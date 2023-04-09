import { useCallback, useRef } from "react";
import { setVideoStream } from "./util.setVideoStream";
import { UseScannerParams } from "./lib.types";
import { useScannerDebug } from "./hook.useDebugScanner";
import { inPixels } from "./util.in-pixels";
import { decodeBarcode } from "./util.decode-barcode";
import { handleScan } from "./util.handle-scan";
// import { locateBarcode } from "./util.locate-barcode";

/**
 * Returns a callback reference to supply to a `video`
 * node that will turn the video on and attempt to
 * read the output if a QR or 1D scannable area is detected
 */
export const useScanner = ({ debug, video, mask, onScan }: UseScannerParams) => {
  const { logs, logMessage, canvasDebugRef } = useScannerDebug(debug);

  const canvasScanRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const canvasMaskRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));

  /**
   * This is a singular callback that will initialize the video
   * once the node becomes available in the DOM.
   *
   * https://react.dev/reference/react-dom/components/common#ref-callback
   */
  const initScanner = useCallback<(instance: HTMLVideoElement | null) => Promise<void>>(
    async (videoNode) => {
      if (!videoNode) return;

      await setVideoStream(videoNode);

      const canvasScanNode = canvasScanRef.current;
      const canvasMaskNode = canvasMaskRef.current;
      const canvasDebugNode = canvasDebugRef.current;

      // Set the video properties
      logMessage({ level: "INFO", message: "Setting video properties..." });
      videoNode.style.maxWidth = inPixels(video.maxWidth);
      videoNode.autoplay = true;
      logMessage({
        level: "INFO",
        message: "Setting video properties... done.",
      });

      // 2. Get the video stream and set it to the video element

      // 3. Set some attributes of our elements once the video has initialized
      videoNode.addEventListener("loadedmetadata", () => {
        // Set the scanner to the _real_ height & width of the video
        logMessage({ level: "INFO", message: "Setting scanner attributes..." });
        canvasScanNode.width = videoNode.videoWidth;
        canvasScanNode.height = videoNode.videoHeight;
        logMessage({ level: "INFO", message: "Setting canvas attributes... done." });

        // Set the masking attributes and add it to the DOM if indicated
        if (mask?.className) {
          logMessage({ level: "INFO", message: "Setting mask attributes..." });
          canvasMaskNode.style.height = inPixels(videoNode.clientHeight);
          canvasMaskNode.style.width = inPixels(videoNode.clientWidth);
          canvasMaskNode.style.position = "absolute";
          canvasMaskNode.style.top = inPixels(videoNode.offsetTop);
          canvasMaskNode.style.left = inPixels(videoNode.offsetLeft);
          canvasMaskNode.classList.add(mask?.className ?? "scanner");
          videoNode.parentElement?.appendChild(canvasMaskNode);
          logMessage({
            level: "INFO",
            message: "Setting mask attributes... done.",
          });
        }

        // Set debug canvas attributes if debugCanvas has been enabled
        if (canvasDebugNode) {
          logMessage({ level: "DEBUG", message: "Set canvasDebug attributes" });
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

      // 6. Listen to the timeupdate event on the video
      // LINK - https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
      videoNode.addEventListener("timeupdate", () => {
        logMessage({ level: "TRACE", message: "Video tick" });

        if (canvasDebugScanContext) {
          canvasDebugScanContext.drawImage(videoNode, 0, 0);
        }

        canvasScanContext.drawImage(videoNode, 0, 0);
        const canvasScanImageData = canvasScanContext.getImageData(
          0,
          0,
          canvasScanNode.width,
          canvasScanNode.height
        );

        const result = handleScan({
          canvasMaskNode,
          canvasScanImageData,
        });

        if (!result) return;

        onScan(result);
        logMessage({ level: "DEBUG", message: result });
      });
    },
    [video.maxWidth, canvasDebugRef, logMessage, mask?.className, onScan]
  );

  return { initScanner, logs };
};
