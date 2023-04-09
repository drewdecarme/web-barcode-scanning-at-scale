import "./lib.barcode-scan";
import { BarcodeScanParams, scanBarcode } from "./lib.barcode-scan";

self.onmessage = (params: { data: BarcodeScanParams }) => {
  const result = scanBarcode(params.data);
  self.postMessage(result);
};
