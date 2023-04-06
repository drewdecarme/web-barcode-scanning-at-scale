import { useCallback, useRef } from "react";
import { setVideoStream } from "./util.setVideoStream";
import { UseScannerParams } from "./lib.types";
import { useScannerDebug } from "./hook.useDebugScanner";
import { inPixels } from "./util.in-pixels";
import { decodeBarcode } from "./util.decode-barcode";

/**
 * Returns a callback reference to supply to a `video`
 * node that will turn the video on and attempt to
 * read the output if a QR or 1D scannable area is detected
 */
export const useScanner = ({ debug, video, mask, onScan }: UseScannerParams) => {
  const { logs, logMessage, canvasDebugRef } = useScannerDebug(debug);

  const maskRef = useRef<HTMLDivElement>(document.createElement("div"));
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));

  /**
   * This is a singular callback that will initialize the video
   * once the node becomes available in the DOM.
   *
   * https://react.dev/reference/react-dom/components/common#ref-callback
   */
  const initScanner = useCallback<(instance: HTMLVideoElement | null) => Promise<void>>(
    async (videoNode) => {
      if (!videoNode) return;

      // 1. Set some of the configuration properties
      videoNode.style.maxWidth = inPixels(video.maxWidth);
      videoNode.autoplay = true;

      // 2. Get the video stream and set it to the video element
      await setVideoStream(videoNode);

      // 3. Set some attributes of our elements once the video has initialized
      videoNode.addEventListener("loadedmetadata", () => {
        // Set scanner attributes
        logMessage({ level: "INFO", message: "Setting canvas attributes..." });
        canvasRef.current.width = videoNode.videoWidth;
        canvasRef.current.height = videoNode.videoHeight;
        logMessage({ level: "INFO", message: "Setting canvas attributes... done." });

        // Set mask attributes
        logMessage({ level: "INFO", message: "Setting mask attributes..." });
        maskRef.current.style.height = inPixels(videoNode.clientHeight);
        maskRef.current.style.width = inPixels(videoNode.clientWidth);
        maskRef.current.style.position = "absolute";
        maskRef.current.style.top = inPixels(videoNode.offsetTop);
        maskRef.current.style.left = inPixels(videoNode.offsetLeft);
        maskRef.current.classList.add(mask?.className ?? "scanner");
        videoNode.parentElement?.appendChild(maskRef.current);
        logMessage({ level: "INFO", message: "Setting mask attributes... done." });

        // 3.1 Set the debug canvas element to the _real_ height of the video
        // this only becomes available when the metadata has loaded
        if (canvasDebugRef.current) {
          logMessage({ level: "DEBUG", message: "Set canvasDebug attributes" });
          canvasDebugRef.current.width = videoNode.videoWidth;
          canvasDebugRef.current.height = videoNode.videoHeight;
          canvasDebugRef.current.style.maxWidth = inPixels(video.maxWidth);
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

        // 8. Get the value
        const text = barcode.getText();
        onScan(text);
        logMessage({ level: "DEBUG", message: text });
      });
    },
    [video.maxWidth, canvasDebugRef, logMessage, mask?.className, onScan]
  );

  return { initScanner, logs };
};
