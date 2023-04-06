import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Rect } from "@motion-canvas/2d/lib/components";
import { createRef } from "@motion-canvas/core/lib/utils";
import { all } from "@motion-canvas/core/lib/flow";

export default makeScene2D(function* (view) {
  const myRectangle = createRef<Rect>();

  view.add(
    <Rect
      ref={myRectangle}
      // try changing these properties:
      // x={-300}
      width="90%"
      height="90%"
      stroke={2}
      position={{
        x: 0,
        y: 0,
      }}
      smoothCorners={true}
    />
  );

  yield* all(
    // myRectangle().position.x(300, 1).to(-300, 1),
    myRectangle().fill("#ffffff", 1).to("#83f683", 1)
  );
});
