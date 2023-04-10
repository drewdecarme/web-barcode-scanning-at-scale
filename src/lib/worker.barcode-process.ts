import { BarcodeProcessParams, processBarcode } from "./lib.barcode-process";

self.onmessage = (params: { data: BarcodeProcessParams }) => {
  processBarcode(params.data);
  self.postMessage("done");
};
