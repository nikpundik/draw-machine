import { assign } from "xstate";
import { MouseEvent } from "react";
import {
  DrawMachineEvents,
  DrawMachineContext,
  assertEventType,
} from "./draw.types";

const getMousePosition = (
  canvas: HTMLCanvasElement,
  event: MouseEvent<HTMLCanvasElement>
) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
};

export const assignCanvas = assign(
  (_: DrawMachineContext, event: DrawMachineEvents) => {
    assertEventType(event, "CANVAS_READY");
    return {
      canvas: event.canvas,
      ctx: event.canvas.getContext("2d"),
    };
  }
);

export const changeColor = assign(
  (_: DrawMachineContext, event: DrawMachineEvents) => {
    assertEventType(event, "CHANGE_COLOR");
    return { color: event.color };
  }
);

export const changeStrokeWidth = assign(
  (_: DrawMachineContext, event: DrawMachineEvents) => {
    assertEventType(event, "CHANGE_STROKE_WIDTH");
    return { strokeWidth: event.width };
  }
);

export const initLine = assign(
  ({ canvas }: DrawMachineContext, event: DrawMachineEvents) => {
    assertEventType(event, "MOUSE_DOWN");
    if (!canvas) {
      return {};
    }
    const { x, y } = getMousePosition(canvas, event.event);
    return { line: { x, y } };
  }
);

export const drawLine = assign(
  (
    { canvas, ctx, line, color, strokeWidth }: DrawMachineContext,
    event: DrawMachineEvents
  ) => {
    assertEventType(event, "MOUSE_MOVE");
    if (!canvas || !ctx || !line) {
      return {};
    }
    const { x, y } = getMousePosition(canvas, event.event);
    ctx.beginPath();
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = color.hex;
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
    return { line: { x, y } };
  }
);

export const save = assign(
  ({ ctx, history }: DrawMachineContext, _: DrawMachineEvents) => {
    if (!ctx) {
      return {};
    }
    const dataUrl = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (history.length < 10) {
      return { history: [...history, dataUrl] };
    }
    const [, ...newHistory] = history;
    return { history: [...newHistory, dataUrl] };
  }
);

export const undo = assign(
  ({ ctx, history }: DrawMachineContext, _: DrawMachineEvents) => {
    if (!ctx) {
      return {};
    }
    const newHistory = [...history];
    newHistory.pop();
    const imageData = newHistory[newHistory.length - 1];
    ctx.putImageData(imageData, 0, 0);
    return { history: newHistory };
  }
);

export const drawLast = (
  { ctx, history }: DrawMachineContext,
  _: DrawMachineEvents
) => {
  const imageData = history[history.length - 1];
  if (ctx && imageData) {
    ctx.putImageData(imageData, 0, 0);
  }
};