/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Result } from "@zxing/library";
import { BarcodeScanParams } from "./lib.barcode-scan";

export const drawBarcodeBoundary = ({
  canvasMaskNode,
  canvasScanImageData,
  scanResult,
}: Pick<BarcodeScanParams, "canvasMaskNode" | "canvasScanImageData"> & {
  scanResult: Result | null;
}) => {
  // Get the canvasMask element and its dimensions
  const canvasMaskWidth = canvasMaskNode.width;
  const canvasMaskHeight = canvasMaskNode.height;

  // Get the scanned element and its dimensions
  const scannedImageWidth = canvasScanImageData.width;
  const scannedImageHeight = canvasScanImageData.height;

  // Calculate the scaling factor between the video and canvas
  const scaleX = canvasMaskWidth / scannedImageWidth;
  const scaleY = canvasMaskHeight / scannedImageHeight;

  // Get the canvas context
  const ctx = canvasMaskNode.getContext("2d");
  if (!ctx) return;
  // @ts-ignore
  ctx.clearRect(0, 0, canvasMaskWidth, canvasMaskHeight);

  // Do nothing if there is no scan result
  if (!scanResult) return;

  const resultPoints = scanResult.getResultPoints();

  // Scale the ResultPoints coordinates to canvas space
  const scaledPoints = resultPoints.map((point) => {
    return {
      x: point.getX() * scaleX,
      y: point.getY() * scaleY,
    };
  });

  // Draw the bounding box on the canvas
  // @ts-ignore
  ctx.clearRect(0, 0, canvasMaskWidth, canvasMaskHeight);
  // @ts-ignore
  ctx.strokeStyle = "red";
  // @ts-ignore
  ctx.beginPath();
  // @ts-ignore
  ctx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
  for (let i = 1; i < scaledPoints.length; i++) {
    // @ts-ignore
    ctx.lineTo(scaledPoints[i].x, scaledPoints[i].y);
  }
  // @ts-ignore
  ctx.closePath();
  // @ts-ignore
  ctx.stroke();
};
