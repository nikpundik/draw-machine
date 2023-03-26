import { createMachine } from "xstate";
import { resize } from "../services/resize";
import { colors } from "../utils/colors";
import {
  assignCanvas,
  changeColor,
  changeStrokeWidth,
  changeTool,
  clearSupport,
  drawLast,
  drawLine,
  drawRect,
  initLine,
  initRect,
  save,
  traceRect,
  undo,
} from "./draw.actions";
import { DrawMachineContext, DrawMachineEvents } from "./draw.types";

export const drawMachine = createMachine<DrawMachineContext, DrawMachineEvents>(
  {
    id: "draw",
    initial: "loading",
    predictableActionArguments: true,
    preserveActionOrder: true,
    context: {
      canvas: null,
      ctx: null,
      supportCanvas: null,
      supportCtx: null,
      tool: "line",
      line: null,
      history: [],
      color: colors[0],
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
                      cond: "isLineTool",
                      target: "line",
                      actions: "initLine",
                    },
                    {
                      cond: "isRectTool",
                      target: "rect",
                      actions: "initRect",
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
            },
          },
        },
      },
      error: {},
    },
  },
  {
    guards: {
      isLineTool: ({ tool }) => tool === "line",
      isRectTool: ({ tool }) => tool === "rect",
      canUndo: ({ history }) => history.length > 1,
    },
    actions: {
      save,
      undo,
      drawLast,
      assignCanvas,
      initLine,
      drawLine,
      initRect,
      drawRect,
      traceRect,
      changeColor,
      changeStrokeWidth,
      changeTool,
      clearSupport,
    },
    services: {
      resize,
    },
  }
);
