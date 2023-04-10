import { useCallback, useEffect, useRef } from "react";
import { setVideoStream } from "./util.setVideoStream";
import { UseScannerParams } from "./lib.types";
import { inPixels } from "./util.in-pixels";
import { useScannerDebugger } from "./hook.useScannerDebugger";

const barcodeScannerWorker = new Worker(
  new URL("./worker.barcode-scan.ts", import.meta.url),
  {
    type: "module",
  }
);
const barcodeProcessWorker = new Worker(
  new URL("./worker.barcode-process.ts", import.meta.url),
  {
    type: "module",
  }
);

/**
 * Returns a callback reference to supply to a `video`
 * node that will turn the video on and attempt to
 * read the output if a QR or 1D scannable area is detected
 */
export const useScanner = ({ debug, video, mask, onScan }: UseScannerParams) => {
  const { getCanvasDebugNode, log } = useScannerDebugger(debug);
  const canvasScanRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const canvasMaskRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const isFirstVideoTick = useRef(true);

  useEffect(() => {
    barcodeScannerWorker.addEventListener("message", (event) => {
      log({ level: "INFO", message: `Result ${event.data}` });
      onScan(event.data);
    });
  }, [log, onScan]);

  useEffect(() => {
    barcodeProcessWorker.addEventListener("message", () => {
      log({ level: "INFO", message: "DONE DECODING." });
    });
  }, [log]);

  /**
   * This is a singular callback that will initialize the video
   * once the node becomes available in the DOM.
   *
   * https://react.dev/reference/react-dom/components/common#ref-callback
   */
  const initScanner = useCallback<(instance: HTMLVideoElement | null) => Promise<void>>(
    async (videoNode) => {
      if (!videoNode) return;

      // Start the video stream
      await setVideoStream(videoNode);

      const canvasScanNode = canvasScanRef.current;
      const canvasMaskNode = canvasMaskRef.current;
      const canvasDebugNode = getCanvasDebugNode();

      // Set the video properties
      log({ level: "INFO", message: "Setting video properties..." });
      videoNode.style.maxWidth = inPixels(video.maxWidth);
      videoNode.autoplay = true;
      log({ level: "INFO", message: "Setting video properties... done." });

      // 3. Set some attributes of our elements once the video has initialized
      videoNode.addEventListener("loadedmetadata", () => {
        // Set the scanner to the _real_ height & width of the video
        log({ level: "INFO", message: "Setting scanner attributes..." });
        canvasScanNode.width = videoNode.videoWidth;
        canvasScanNode.height = videoNode.videoHeight;
        log({ level: "INFO", message: "Setting canvas attributes... done." });

        // Set the masking attributes and add it to the DOM if indicated
        if (mask?.className) {
          log({ level: "INFO", message: "Setting mask attributes..." });
          canvasMaskNode.style.height = inPixels(videoNode.clientHeight);
          canvasMaskNode.style.width = inPixels(videoNode.clientWidth);
          canvasMaskNode.style.position = "absolute";
          canvasMaskNode.style.top = inPixels(videoNode.offsetTop);
          canvasMaskNode.style.left = inPixels(videoNode.offsetLeft);
          canvasMaskNode.classList.add(mask?.className ?? "scanner");
          videoNode.parentElement?.appendChild(canvasMaskNode);
          log({ level: "INFO", message: "Setting mask attributes... done." });
        }

        // Set debug canvas attributes if debugCanvas has been enabled
        if (canvasDebugNode) {
          log({ level: "DEBUG", message: "Set canvasDebug attributes" });
          canvasDebugNode.width = videoNode.videoWidth;
          canvasDebugNode.height = videoNode.videoHeight;
          canvasDebugNode.style.maxWidth = inPixels(video.maxWidth);
        }
      });

      // Get the contexts
      const canvasScanContext = canvasScanRef.current.getContext("2d", {
        willReadFrequently: true,
      });
      const canvasDebugScanContext = canvasDebugNode?.getContext("2d") ?? null;

      // short circuit if the canvasScanContext doesn't exist.
      if (!canvasScanContext) {
        throw new Error("Cannot get the necessary context to decode the scan.");
      }

      const offscreenCanvas = canvasMaskNode.transferControlToOffscreen();

      // When the next tick of the video occurs
      videoNode.addEventListener("timeupdate", () => {
        log({ level: "TRACE", message: "Video tick" });

        if (canvasDebugScanContext) {
          canvasDebugScanContext.drawImage(videoNode, 0, 0);
        }

        if (!canvasScanContext) return;

        canvasScanContext.drawImage(videoNode, 0, 0);
        const canvasScanImageData = canvasScanContext.getImageData(
          0,
          0,
          canvasScanNode.width,
          canvasScanNode.height
        );

        if (isFirstVideoTick.current) {
          barcodeScannerWorker.postMessage(
            {
              canvasMaskNode: offscreenCanvas,
              canvasScanImageData,
            },
            // transferable object
            [offscreenCanvas]
          );

          isFirstVideoTick.current = false;
        } else {
          // serializable structured clone
          barcodeScannerWorker.postMessage({ canvasScanImageData });
        }

        barcodeProcessWorker.postMessage(canvasScanImageData);
      });
    },
    [getCanvasDebugNode, log, video.maxWidth, mask?.className]
  );

  return initScanner;
};
