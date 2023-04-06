import { useCallback, useEffect, useRef, useState } from "react";
import { decodeBarcode } from "./util.read-barcode";
import { drawBoundary } from "./util.draw-boundary";
import { setVideoStream } from "./util.setVideoStream";
import { UseScannerParams, UseScannerLog } from "./lib.types";

/**
 * Returns a callback reference to supply to a `video`
 * node that will turn the video on and attempt to
 * read the output if a QR or 1D scannable area is detected
 */
export const useScanner = ({ debug, video, onScan }: UseScannerParams) => {
  const [logs, setLog] = useState<UseScannerLog[]>([]);

  const shouldLogRef = useRef<boolean>(debug?.enableLogging ?? false);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const canvasBoundaryRef = useRef<HTMLCanvasElement>(
    document.createElement("canvas")
  );
  const canvasDebugRef = useRef<HTMLCanvasElement | null>(
    debug?.canvasRef?.current ?? null
  );

  /**
   * This is a memoized utility to log messages or add message
   * entries to the log state declared at the top of the hook.
   * Since this can be called in event handlers, we need to use
   * mutable references to prevent their execution if a one of the
   * `debug.enableLogging` is changed to true.
   */
  const logMessage = useCallback<(params: Omit<UseScannerLog, "ts">) => void>(
    (message) => {
      if (!shouldLogRef.current) return;
      setLog((prevLogs) => [
        ...prevLogs,
        {
          ...message,
          ts: new Date().toISOString(),
        },
      ]);
    },
    []
  );

  /**
   * When any of the debugging parameters change, we update
   * some of the refs to either enable or prevent code execution
   * in the video listeners
   */
  useEffect(() => {
    // enable or disable logging
    shouldLogRef.current = debug?.enableLogging ?? false;
    logMessage({
      level: "INFO",
      message: `Logging ${shouldLogRef.current ? "enabled" : "disabled"}`,
    });

    // enable or disable canvas debugging
    canvasDebugRef.current = debug?.canvasRef?.current ?? null;
    logMessage({
      level: "INFO",
      message: `Canvas Debugging ${
        canvasDebugRef.current ? "enabled" : "disabled"
      }`,
    });
  }, [logMessage, debug?.canvasRef, debug?.enableLogging]);

  /**
   * SECRET SAUCE
   * This is a singular callback that will initialize the video
   * once the node becomes available in the DOM. These concepts
   * are covered by 'CallbackRefs'; A React convention to supply
   * to the `ref` prop of any HTML node.
   */
  const setVideoRef = useCallback<
    (instance: HTMLVideoElement | null) => Promise<void>
  >(
    async (videoNode) => {
      if (!videoNode) return;

      // 1. Set some of the configuration properties
      videoNode.style.maxWidth = `${video.maxWidth}px`;
      videoNode.autoplay = true;

      // 2. Get the video stream and set it to the video element
      await setVideoStream(videoNode);

      // 3. Initialize some objects after the video has loaded with the webcam
      videoNode.addEventListener("loadedmetadata", () => {
        canvasRef.current.width = videoNode.videoWidth;
        canvasRef.current.height = videoNode.videoHeight;
        logMessage({ level: "INFO", message: "Set canvas dimensions" });

        canvasBoundaryRef.current.width = videoNode.clientWidth;
        canvasBoundaryRef.current.height = videoNode.clientHeight;
        canvasBoundaryRef.current.style.position = "absolute";
        canvasBoundaryRef.current.style.top = `${videoNode.offsetTop}px`;
        canvasBoundaryRef.current.style.left = `${videoNode.offsetLeft}px`;
        videoNode.parentElement?.appendChild(canvasBoundaryRef.current);
        logMessage({
          level: "INFO",
          message: "Set boundary dimensions & position",
        });

        // 3.1 Set the debug canvas element to the _real_ height of the video
        // this only becomes available when the metadata has loaded
        if (debug?.canvasRef?.current) {
          logMessage({ level: "DEBUG", message: "Set canvasDebug dimensions" });
          debug.canvasRef.current.width = videoNode.videoWidth;
          debug.canvasRef.current.height = videoNode.videoHeight;
          debug.canvasRef.current.style.maxWidth = `${video.maxWidth}px`;
        }
      });

      // 4. Get the context of both canvas elements
      // LINK - https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
      const canvasContext = canvasRef.current.getContext("2d", {
        alpha: false,
        willReadFrequently: true,
      });

      if (!canvasContext) {
        return logMessage({ level: "ERROR", message: "CanvasContext is null" });
      }

      const canvasDebugContext = canvasDebugRef.current
        ? canvasDebugRef.current.getContext("2d", {
            alpha: false,
            willReadFrequently: true,
          })
        : null;

      // 6. Listen to the timeupdate event on the video
      // LINK - https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
      videoNode.addEventListener("timeupdate", () => {
        logMessage({ level: "TRACE", message: "Video tick" });

        if (canvasDebugContext) {
          canvasDebugContext.drawImage(videoNode, 0, 0);
        }

        // 7. Draw the video image onto the in memory canvas and convert it get it's image data
        canvasContext.drawImage(videoNode, 0, 0);
        const canvasImageData = canvasContext.getImageData(
          0,
          0,
          videoNode.videoWidth,
          videoNode.videoHeight
        );
        // 8. Detect a barcode
        const barcode = decodeBarcode(canvasImageData);
        if (!barcode) return;

        // 9. Draw the boundary
        drawBoundary({
          points: barcode.getResultPoints(),
          canvas: canvasBoundaryRef.current,
        });
        // 8. Get the value
        const text = barcode.getText();
        onScan(text);
        logMessage({ level: "DEBUG", message: text });
      });
    },
    [logMessage, debug?.canvasRef, video.maxWidth, onScan]
  );

  return { setVideoRef, logs };
};
