import { ResultPoint } from "@zxing/library";

//stackoverflow.com/questions/11340996/is-zxing-providing-upc-barcodes-coordinates-on-the-screen
export const drawBoundary = ({
  points,
  canvas,
}: {
  points: Array<ResultPoint>;
  canvas: HTMLCanvasElement;
}) => {
  console.log(points);
  // const bottomLeft = [points[0].getX(), points[0].getY()]; // index 0: bottom left: ;
  // const topLeft = [points[1].getX(), points[1].getY()];
  // const topRight = [points[2].getX(), points[2].getY()];
  // const context = canvas.getContext("2d", {
  //   alpha: false,
  //   willReadFrequently: true,
  // });
  // if (!context) return;
  // console.log(points);
  // console.log(topLeft[0], topLeft[1]);
  // context.strokeRect(
  //   topLeft[0],
  //   topLeft[1],
  //   topRight[0] - topLeft[0],
  //   topLeft[1] - bottomLeft[1]
  // );
};
