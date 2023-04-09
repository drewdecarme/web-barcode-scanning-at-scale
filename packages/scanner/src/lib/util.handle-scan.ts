import { decodeBarcode } from "./util.decode-barcode";
import { drawBarcodeBoundary } from "./util.locate-barcode";
import { processImage } from "./util.process-image";

export type HandleScanParams = {
  canvasMaskNode: HTMLCanvasElement;
  canvasScanImageData: ImageData;
};

export const handleScan = ({
  canvasMaskNode,
  canvasScanImageData,
}: HandleScanParams): undefined | string => {
  const scanResult = decodeBarcode(canvasScanImageData);

  drawBarcodeBoundary({
    canvasMaskNode,
    canvasScanImageData,
    scanResult,
  });

  if (!scanResult) {
    return undefined;
  }

  processImage(canvasScanImageData);

  return scanResult.getText();
};
