// This example was taken directly from open source knowldge and docuemtnation
// Decoding: https://github.com/zxing-js/library#usage
// Image Conversion
// - https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvasRenderingContext2D#inherited_properties_and_methods
// - https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvasRenderingContext2D#pixel_manipulation
// - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData

import {
  MultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  BinaryBitmap,
  HybridBinarizer,
  RGBLuminanceSource,
} from "@zxing/library";

const hints = new Map();
const formats = [
  BarcodeFormat.QR_CODE,
  BarcodeFormat.CODE_128,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
];

hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
hints.set(DecodeHintType.TRY_HARDER, true);
const reader = new MultiFormatReader();
reader.setHints(hints);

export type DecodeBarcodeReturn = ReturnType<typeof decodeBarcode>;

/**
 * A utility that reads an ImageData instance
 * and uses the @zxing/library utility to decode
 * the image data to read the barcode contained
 * in the data
 */
export const decodeBarcode = (imageData: ImageData) => {
  try {
    // https://github.com/zxing-js/library/issues/148#issuecomment-530649651
    const len = imageData.width * imageData.height;
    const luminancesUint8Array = new Uint8ClampedArray(len);

    for (let i = 0; i < len; i++) {
      luminancesUint8Array[i] =
        ((imageData.data[i * 4] +
          imageData.data[i * 4 + 1] * 2 +
          imageData.data[i * 4 + 2]) /
          4) &
        0xff;
    }

    const luminanceSource = new RGBLuminanceSource(
      luminancesUint8Array,
      imageData.width,
      imageData.height
    );

    const result = reader.decode(
      new BinaryBitmap(new HybridBinarizer(luminanceSource))
    );

    return result;
  } catch (error) {
    return null;
  }
};
