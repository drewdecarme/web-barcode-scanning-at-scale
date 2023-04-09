import { Result } from "@zxing/library";

export const locateBarcode = ({
  maskCanvas,
  scannerImageData,
  resultData,
}: {
  maskCanvas: HTMLCanvasElement;
  resultData: Result;
  scannerImageData: ImageData;
}) => {
  // Get the canvas element and its dimensions
  const canvasMaskWidth = maskCanvas.width;
  const canvasMaskHeight = maskCanvas.height;

  // Get the video element and its dimensions
  const scannedImageWidth = scannerImageData.width;
  const scannedImageHeight = scannerImageData.height;

  // Calculate the scaling factor between the video and canvas
  const scaleX = canvasMaskWidth / scannedImageWidth;
  const scaleY = canvasMaskHeight / scannedImageHeight;

  const resultPoints = resultData.getResultPoints();

  // Scale the ResultPoints coordinates to canvas space
  const scaledPoints = resultPoints.map((point) => {
    return {
      x: point.getX() * scaleX,
      y: point.getY() * scaleY,
    };
  });

  // Draw the bounding box on the canvas
  const ctx = maskCanvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasMaskWidth, canvasMaskHeight);
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
  for (let i = 1; i < scaledPoints.length; i++) {
    ctx.lineTo(scaledPoints[i].x, scaledPoints[i].y);
  }
  ctx.closePath();
  ctx.stroke();
};
