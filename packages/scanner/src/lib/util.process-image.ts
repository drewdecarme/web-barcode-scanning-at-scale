// Define a 3x3 Gaussian blur kernel
const gaussianKernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
const gaussianDivisor = 16;
const gaussianOffset = 0;

/**
 * Convolution is performed by looping over each pixel in the
 * image and calculating a weighted sum
 * of the pixel values in a neighborhood around the pixel as defined
 * by the convolution kernel. The divisor and offset values are used
 * to scale and shift the result
 * of the convolution respectively
 */
export function processImage(imageData: ImageData): ImageData {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const halfKernelSize = Math.floor(Math.sqrt(gaussianKernel.length) / 2);
  const output = new Uint8ClampedArray(pixels.length);

  for (let i = 0; i < pixels.length; i += 4) {
    const pixelX = (i / 4) % width;
    const pixelY = Math.floor(i / (4 * width));
    let r = 0,
      g = 0,
      b = 0;
    for (let kernelY = -halfKernelSize; kernelY <= halfKernelSize; kernelY++) {
      for (let kernelX = -halfKernelSize; kernelX <= halfKernelSize; kernelX++) {
        const x = pixelX + kernelX;
        const y = pixelY + kernelY;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const index = (y * width + x) * 4;
          const weight =
            gaussianKernel[
              (kernelY + halfKernelSize) * Math.sqrt(gaussianKernel.length) +
                (kernelX + halfKernelSize)
            ];
          r += pixels[index] * weight;
          g += pixels[index + 1] * weight;
          b += pixels[index + 2] * weight;
        }
      }
    }
    output[i] = r / gaussianDivisor + gaussianOffset;
    output[i + 1] = g / gaussianDivisor + gaussianOffset;
    output[i + 2] = b / gaussianDivisor + gaussianOffset;
    output[i + 3] = pixels[i + 3];
  }

  return new ImageData(output, width, height);
}
