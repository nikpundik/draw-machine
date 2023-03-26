import { FC, useEffect, useRef, KeyboardEvent } from "react";
import { useDrawMachine } from "../../providers/global";

const Canvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, send] = useDrawMachine();
  useEffect(() => {
    if (canvasRef.current) {
      send({ type: "CANVAS_READY", canvas: canvasRef.current });
    } else {
      send({ type: "CANVAS_ERROR" });
    }
  }, []);

  const onKeyPress = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (event.key === "Backspace") {
      send({ type: "BACKSPACE_PRESS", event });
    }
    if (event.key === "t") {
      send({ type: "TOGGLE_GUI" });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="canvas"
      tabIndex={1}
      onKeyDown={onKeyPress}
      onMouseDown={(event) => {
        send({ type: "MOUSE_DOWN", event });
      }}
      onMouseUp={(event) => {
        send({ type: "MOUSE_UP", event });
      }}
      onMouseMove={(event) => {
        send({ type: "MOUSE_MOVE", event });
      }}
      onMouseOut={(event) => {
        send({ type: "MOUSE_OUT", event });
      }}
    />
  );
};

export default Canvas;
