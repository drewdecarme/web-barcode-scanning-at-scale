import { decodeBarcode } from "./lib.barcode-decode";
import { drawBarcodeBoundary } from "./lib.barcode-boundary";

export type BarcodeScanParams = {
  canvasMaskNode: OffscreenCanvas;
  canvasScanImageData: ImageData;
};

export const scanBarcode = ({
  canvasMaskNode,
  canvasScanImageData,
}: BarcodeScanParams): undefined | string => {
  const scanResult = decodeBarcode(canvasScanImageData);

  drawBarcodeBoundary({
    canvasMaskNode,
    canvasScanImageData,
    scanResult,
  });

  if (!scanResult) {
    return undefined;
  }

  return scanResult.getText();
};
