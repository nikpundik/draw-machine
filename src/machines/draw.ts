import { createMachine, assign } from "xstate";
import { resize } from "../services/resize";
import { colors, fillColors } from "../utils/colors";
import { getMousePosition } from "../utils/mouse";
import { DrawMachineContext, DrawMachineEvents } from "./draw.types";

export const drawMachine = createMachine(
  {
    id: "draw",
    initial: "loading",
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import("./draw.typegen").Typegen0,
    schema: {
      context: {} as DrawMachineContext,
      events: {} as DrawMachineEvents,
    },
    context: {
      canvas: null,
      ctx: null,
      supportCanvas: null,
      supportCtx: null,
      tool: "line",
      line: null,
      history: [],
      color: colors[0],
      fillColor: fillColors[0],
      strokeWidth: 5,
    },
    states: {
      loading: {
        on: {
          CANVAS_READY: { target: "running", actions: "assignCanvas" },
          CANVAS_ERROR: { target: "error" },
        },
      },
      running: {
        invoke: {
          id: "resize",
          src: "resize",
        },
        on: {
          RESIZE: {
            actions: "drawLast",
          },
        },
        type: "parallel",
        states: {
          gui: {
            initial: "visible",
            states: {
              visible: {
                on: {
                  TOGGLE_GUI: "hidden",
                },
              },
              hidden: {
                on: {
                  TOGGLE_GUI: "visible",
                },
              },
            },
          },
          canvas: {
            initial: "idle",
            states: {
              idle: {
                entry: ["save", "clearSupport"],
                on: {
                  MOUSE_DOWN: [
                    {
                      cond: {
                        type: "isTool",
                        tool: "line",
                      },
                      target: "line",
                      actions: "initLine",
                    },
                    {
                      cond: {
                        type: "isTool",
                        tool: "rect",
                      },
                      target: "rect",
                      actions: "initRect",
                    },
                    {
                      cond: {
                        type: "isTool",
                        tool: "circle",
                      },
                      target: "circle",
                      actions: "initCircle",
                    },
                    {
                      cond: {
                        type: "isTool",
                        tool: "ellipse",
                      },
                      target: "ellipse",
                      actions: "initEllipse",
                    },
                  ],
                  BACKSPACE_PRESS: [
                    {
                      cond: "canUndo",
                      actions: "undo",
                    },
                  ],
                  CHANGE_COLOR: {
                    actions: "changeColor",
                  },
                  CHANGE_FILL_COLOR: {
                    actions: "changeFillColor",
                  },
                  CHANGE_STROKE_WIDTH: {
                    actions: "changeStrokeWidth",
                  },
                  CHANGE_TOOL: {
                    actions: "changeTool",
                  },
                },
              },
              line: {
                on: {
                  MOUSE_MOVE: [
                    {
                      actions: "drawLine",
                    },
                  ],
                  MOUSE_UP: {
                    target: "idle",
                  },
                  MOUSE_OUT: {
                    target: "idle",
                  },
                },
              },
              rect: {
                on: {
                  MOUSE_MOVE: [
                    {
                      actions: "traceRect",
                    },
                  ],
                  MOUSE_UP: {
                    target: "idle",
                    actions: "drawRect",
                  },
                  MOUSE_OUT: {
                    target: "idle",
                  },
                },
              },
              circle: {
                on: {
                  MOUSE_MOVE: [
                    {
                      actions: "traceCircle",
                    },
                  ],
                  MOUSE_UP: {
                    target: "idle",
                    actions: "drawCircle",
                  },
                  MOUSE_OUT: {
                    target: "idle",
                  },
                },
              },
              ellipse: {
                on: {
                  MOUSE_MOVE: [
                    {
                      actions: "traceEllipse",
                    },
                  ],
                  MOUSE_UP: {
                    target: "idle",
                    actions: "drawEllipse",
                  },
                  MOUSE_OUT: {
                    target: "idle",
                  },
                },
              },
            },
          },
        },
      },
      error: {},
    },
  },
  {
    guards: {
      isTool: ({ tool }, _, guard: any) => tool === guard?.cond?.tool,
      canUndo: ({ history }) => history.length > 1,
    },
    actions: {
      save: assign(({ ctx, history }) => {
        if (!ctx) {
          return {};
        }
        const dataUrl = ctx.getImageData(
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height
        );
        if (history.length < 10) {
          return { history: [...history, dataUrl] };
        }
        const [, ...newHistory] = history;
        return { history: [...newHistory, dataUrl] };
      }),
      undo: assign(({ ctx, history }) => {
        if (!ctx) {
          return {};
        }
        const newHistory = [...history];
        newHistory.pop();
        const imageData = newHistory[newHistory.length - 1];
        ctx.putImageData(imageData, 0, 0);
        return { history: newHistory };
      }),
      drawLast: ({ ctx, history }) => {
        const imageData = history[history.length - 1];
        if (ctx && imageData) {
          ctx.putImageData(imageData, 0, 0);
        }
      },
      assignCanvas: assign((_, event) => {
        return {
          canvas: event.canvas,
          ctx: event.canvas.getContext("2d"),
          supportCanvas: event.supportCanvas,
          supportCtx: event.supportCanvas.getContext("2d"),
        };
      }),
      initLine: assign(({ canvas }, event) => {
        if (!canvas) {
          return {};
        }
        const { x, y } = getMousePosition(canvas, event.event);
        return { line: { x, y } };
      }),
      drawLine: assign(
        ({ canvas, ctx, line, color, fillColor, strokeWidth }, event) => {
          if (!canvas || !ctx || !line) {
            return {};
          }
          const { x, y } = getMousePosition(canvas, event.event);
          ctx.beginPath();
          ctx.lineWidth = strokeWidth;
          ctx.lineCap = "round";
          ctx.strokeStyle = color.hex;
          ctx.fillStyle = fillColor.hex;
          ctx.moveTo(line.x, line.y);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.closePath();
          return { line: { x, y } };
        }
      ),
      initRect: assign(({ canvas }, event) => {
        if (!canvas) {
          return {};
        }
        const { x, y } = getMousePosition(canvas, event.event);
        return { line: { x, y } };
      }),
      drawRect: assign(
        ({ canvas, ctx, line, color, fillColor, strokeWidth }, event) => {
          if (!canvas || !ctx || !line) {
            return {};
          }
          const { x, y } = getMousePosition(canvas, event.event);
          ctx.beginPath();
          ctx.lineWidth = strokeWidth;
          ctx.lineCap = "round";
          ctx.strokeStyle = color.hex;
          ctx.fillStyle = fillColor.hex;
          ctx.beginPath();
          ctx.rect(line.x, line.y, x - line.x, y - line.y);
          ctx.fill();
          ctx.stroke();
          ctx.closePath();
          return { line: null };
        }
      ),
      traceRect: (
        { supportCanvas, supportCtx, line, color, fillColor, strokeWidth },
        event
      ) => {
        if (!supportCanvas || !supportCtx || !line) {
          return {};
        }
        const { x, y } = getMousePosition(supportCanvas, event.event);
        supportCtx.clearRect(0, 0, supportCanvas.width, supportCanvas.height);
        supportCtx.beginPath();
        supportCtx.lineWidth = strokeWidth;
        supportCtx.lineCap = "round";
        supportCtx.strokeStyle = color.hex;
        supportCtx.fillStyle = fillColor.hex;
        supportCtx.beginPath();
        supportCtx.rect(line.x, line.y, x - line.x, y - line.y);
        supportCtx.fill();
        supportCtx.stroke();
        supportCtx.closePath();
      },
      initCircle: assign(({ canvas }, event) => {
        if (!canvas) {
          return {};
        }
        const { x, y } = getMousePosition(canvas, event.event);
        return { line: { x, y } };
      }),
      drawCircle: assign(
        ({ canvas, ctx, line, color, fillColor, strokeWidth }, event) => {
          if (!canvas || !ctx || !line) {
            return {};
          }
          const { x, y } = getMousePosition(canvas, event.event);
          ctx.beginPath();
          ctx.lineWidth = strokeWidth;
          ctx.lineCap = "round";
          ctx.strokeStyle = color.hex;
          ctx.fillStyle = fillColor.hex;
          const radius = Math.abs((x - line.x + (y - line.y)) / 2);
          ctx.closePath();
          ctx.beginPath();
          ctx.arc(line.x, line.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          return { line: null };
        }
      ),
      traceCircle: (
        { supportCanvas, supportCtx, line, color, fillColor, strokeWidth },
        event
      ) => {
        if (!supportCanvas || !supportCtx || !line) {
          return {};
        }
        const { x, y } = getMousePosition(supportCanvas, event.event);
        supportCtx.clearRect(0, 0, supportCanvas.width, supportCanvas.height);
        supportCtx.beginPath();
        supportCtx.lineWidth = strokeWidth;
        supportCtx.lineCap = "round";
        supportCtx.strokeStyle = color.hex;
        supportCtx.fillStyle = fillColor.hex;
        const radius = Math.abs((x - line.x + (y - line.y)) / 2);
        supportCtx.closePath();
        supportCtx.beginPath();
        supportCtx.arc(line.x, line.y, radius, 0, 2 * Math.PI);
        supportCtx.stroke();
        supportCtx.fill();
        supportCtx.closePath();
      },
      initEllipse: assign(({ canvas }, event) => {
        if (!canvas) {
          return {};
        }
        const { x, y } = getMousePosition(canvas, event.event);
        return { line: { x, y } };
      }),
      drawEllipse: assign(
        ({ canvas, ctx, line, color, fillColor, strokeWidth }, event) => {
          if (!canvas || !ctx || !line) {
            return {};
          }
          const { x, y } = getMousePosition(canvas, event.event);
          ctx.beginPath();
          ctx.lineWidth = strokeWidth;
          ctx.lineCap = "round";
          ctx.strokeStyle = color.hex;
          ctx.fillStyle = fillColor.hex;
          ctx.closePath();
          ctx.beginPath();
          ctx.ellipse(
            line.x,
            line.y,
            Math.abs(x - line.x),
            Math.abs(y - line.y),
            0,
            0,
            2 * Math.PI
          );
          ctx.stroke();
          ctx.fill();
          return { line: null };
        }
      ),
      traceEllipse: (
        { supportCanvas, supportCtx, line, color, fillColor, strokeWidth },
        event
      ) => {
        if (!supportCanvas || !supportCtx || !line) {
          return {};
        }
        const { x, y } = getMousePosition(supportCanvas, event.event);
        supportCtx.clearRect(0, 0, supportCanvas.width, supportCanvas.height);
        supportCtx.beginPath();
        supportCtx.lineWidth = strokeWidth;
        supportCtx.lineCap = "round";
        supportCtx.strokeStyle = color.hex;
        supportCtx.fillStyle = fillColor.hex;
        supportCtx.closePath();
        supportCtx.beginPath();
        supportCtx.ellipse(
          line.x,
          line.y,
          Math.abs(x - line.x),
          Math.abs(y - line.y),
          0,
          0,
          2 * Math.PI
        );
        supportCtx.stroke();
        supportCtx.fill();
        supportCtx.closePath();
      },
      changeColor: assign((_, event) => {
        return { color: event.color };
      }),
      changeFillColor: assign((_, event) => {
        return { fillColor: event.color };
      }),
      changeStrokeWidth: assign((_, event) => {
        return { strokeWidth: event.width };
      }),
      changeTool: assign((_, event) => {
        return { tool: event.tool };
      }),
      clearSupport: ({ supportCanvas, supportCtx }) => {
        if (!supportCanvas || !supportCtx) {
          return;
        }
        supportCtx.clearRect(0, 0, supportCanvas.width, supportCanvas.height);
      },
    },
    services: {
      resize,
    },
  }
);
