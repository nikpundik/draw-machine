import { MouseEvent, KeyboardEvent } from "react";
import { EventObject } from "xstate";
import { Color } from "../utils/colors";

export function assertEventType<
  TE extends EventObject,
  TType extends TE["type"]
>(event: TE, eventType: TType): asserts event is TE & { type: TType } {
  if (event.type !== eventType) {
    throw new Error(
      `Invalid event: expected "${eventType}", got "${event.type}"`
    );
  }
}

export type DrawMachineEvents =
  | { type: "CANVAS_READY"; canvas: HTMLCanvasElement }
  | { type: "CANVAS_ERROR" }
  | { type: "MOUSE_DOWN"; event: MouseEvent<HTMLCanvasElement> }
  | { type: "MOUSE_UP"; event: MouseEvent<HTMLCanvasElement> }
  | { type: "MOUSE_MOVE"; event: MouseEvent<HTMLCanvasElement> }
  | { type: "MOUSE_OUT"; event: MouseEvent<HTMLCanvasElement> }
  | { type: "BACKSPACE_PRESS"; event: KeyboardEvent<HTMLCanvasElement> }
  | { type: "CHANGE_COLOR"; color: Color }
  | { type: "CHANGE_STROKE_WIDTH"; width: number }
  | { type: "TOGGLE_GUI" }
  | { type: "RESIZE" };

export type DrawMachineContext = {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  tool: "line";
  line: { x: number; y: number } | null;
  history: ImageData[];
  color: Color;
  strokeWidth: number;
};
