import { MouseEvent, KeyboardEvent } from "react";
import Stage from "../lib/Stage";
import { Color } from "../utils/colors";
import { Tool } from "../utils/tools";

export type DrawMachineEvents =
  | {
      type: "CANVAS_READY";
      canvas: HTMLCanvasElement;
      supportCanvas: HTMLCanvasElement;
    }
  | { type: "CANVAS_ERROR" }
  | { type: "MOUSE_DOWN"; event: MouseEvent<HTMLCanvasElement> }
  | { type: "MOUSE_UP"; event: MouseEvent<HTMLCanvasElement> }
  | { type: "MOUSE_MOVE"; event: MouseEvent<HTMLCanvasElement> }
  | { type: "MOUSE_OUT"; event: MouseEvent<HTMLCanvasElement> }
  | { type: "BACKSPACE_PRESS"; event: KeyboardEvent<HTMLCanvasElement> }
  | { type: "CHANGE_COLOR"; color: Color }
  | { type: "CHANGE_FILL_COLOR"; color: Color }
  | { type: "CHANGE_STROKE_WIDTH"; width: number }
  | { type: "CHANGE_TOOL"; tool: Tool }
  | { type: "TOGGLE_GUI" }
  | { type: "RESIZE" };

export type DrawMachineContext = {
  stage: Stage | null;
  tool: Tool;
  color: Color;
  fillColor: Color;
  strokeWidth: number;
};
