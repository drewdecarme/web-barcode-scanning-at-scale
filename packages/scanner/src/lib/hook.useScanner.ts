import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { decodeBarcode } from "./util.barcode-decode";

export type UseScannerLog = {
  ts: string;
  message: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE";
};
export type UseScannerLogger = (message: UseScannerLog) => void;

export type UseScannerParams = {
  debug?: {
    canvasRef?: MutableRefObject<HTMLCanvasElement | null>;
    enableLogging?: boolean;
  };
  video: {
    maxWidth: number;
  };
};

export const useScanner = (params: UseScannerParams) => {
  const [logs, setLog] = useState<UseScannerLog[]>([]);
  const shouldDebugRef = useRef<boolean>(!!params.debug?.canvasRef?.current);
  const shouldLogRef = useRef<boolean>(params.debug?.enableLogging ?? false);

  useEffect(() => {
    shouldLogRef.current = params.debug?.enableLogging ?? false;
    shouldDebugRef.current = !!params.debug?.canvasRef?.current;
  }, [params.debug?.canvasRef, params.debug?.enableLogging]);

  // Utility to log message if a mechanism is available
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

  // when the video node becomes available,
  // run this callback function
  const setVideoRef = useCallback<
    (instance: HTMLVideoElement | null) => Promise<void>
  >(
    async (videoNode) => {
      if (!videoNode) return;

      // 1. Set some of the configuration properties
      videoNode.style.maxWidth = `${params.video.maxWidth}px`;
      videoNode.autoplay = true;

      // 2. Get the video stream and set it to the video element
      if (!("srcObject" in videoNode)) {
        return alert(
          "Your browser does not support the scanner. Please download the latest version of Chrome, Firefox, or Safari."
        );
      }
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          aspectRatio: window.devicePixelRatio || 1,
          frameRate: 30,
          width: {
            ideal: 4096,
          },
          height: {
            ideal: 2160,
          },
        },
      });
      videoNode.srcObject = videoStream;

      // 3. Initialize some objects after the video has loaded with the webcam
      videoNode.addEventListener("loadedmetadata", () => {
        // 3.1 Set the debug canvas element to the _real_ height of the video
        // this only becomes available when the metadata has loaded
        if (params.debug?.canvasRef?.current) {
          params.debug.canvasRef.current.width = videoNode.videoWidth;
          params.debug.canvasRef.current.height = videoNode.videoHeight;
          params.debug.canvasRef.current.style.maxWidth = params.video.maxWidth
            .toString()
            .concat("px");
        }
      });

      // 4. Create an offscreen canvas element to store the video data
      // LINK - https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
      if (typeof OffscreenCanvas === "undefined") {
        return alert(
          "Your browser does not support the scanner. Please download the latest version of Chrome, Firefox, or Safari."
        );
      }
      const offscreenCanvas = new OffscreenCanvas(
        videoNode.videoWidth,
        videoNode.videoHeight
      );
      const offscreenCanvasContext = offscreenCanvas.getContext("2d", {
        alpha: false,
        willReadFrequently: true,
      });

      // 5. Grab the debug context as well if it exists
      let debugContext: CanvasRenderingContext2D | null;
      if (params.debug?.canvasRef?.current) {
        debugContext = params.debug.canvasRef.current.getContext("2d", {
          alpha: false,
          willReadFrequently: true,
        });
      }

      // 6. Listen to the timeupdate event on the video
      // LINK - https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
      videoNode.addEventListener("timeupdate", () => {
        logMessage({ level: "TRACE", message: "Video updated" });

        if (!offscreenCanvasContext) {
          return console.warn(
            "'OffscreenCanvasRenderingContext2D' not available. This is most likely an error in how your browser implements the OffscreenCanvas API."
          );
        }

        offscreenCanvasContext.drawImage(videoNode, 0, 0);
        if (debugContext && shouldDebugRef.current) {
          debugContext.drawImage(videoNode, 0, 0);
        }

        // START HERE TOMORROW
        // Why is that only working for a Canvas node?
        const imageData = debugContext.getImageData(
          0,
          0,
          videoNode.videoWidth,
          videoNode.videoHeight
        );
        // console.log(imageData);
        const result = decodeBarcode(imageData);
        logMessage({ level: "DEBUG", message: result });
      });
    },
    [logMessage, params.debug?.canvasRef, params.video.maxWidth]
  );

  return { setVideoRef, logs };
};
