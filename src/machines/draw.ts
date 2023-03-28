import { createMachine, assign } from "xstate";
import Stage from "../lib/Stage";
import { resize } from "../services/resize";
import { colors, fillColors } from "../utils/colors";
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
      stage: null,
      tool: "line",
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
        entry: ["resize"],
        on: {
          RESIZE: {
            actions: "resize",
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
                      actions: "initPosition",
                    },
                    {
                      cond: {
                        type: "isTool",
                        tool: "rect",
                      },
                      target: "rect",
                      actions: "initPosition",
                    },
                    {
                      cond: {
                        type: "isTool",
                        tool: "circle",
                      },
                      target: "circle",
                      actions: "initPosition",
                    },
                    {
                      cond: {
                        type: "isTool",
                        tool: "ellipse",
                      },
                      target: "ellipse",
                      actions: "initPosition",
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
                      actions: ["clearSupport", "traceRect"],
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
                      actions: ["clearSupport", "traceCircle"],
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
                      actions: ["clearSupport", "traceEllipse"],
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
      canUndo: ({ stage }) => stage?.hasHistory() || false,
    },
    actions: {
      save: ({ stage }) => {
        stage?.updateHistory();
      },
      undo: ({ stage }) => {
        stage?.undo();
      },
      resize: ({ stage }) => {
        stage?.setFullScreen();
        stage?.redraw();
      },
      assignCanvas: assign((_, { canvas: mainCanvas, supportCanvas }) => {
        const stage = new Stage({ mainCanvas, supportCanvas });
        return {
          stage,
        };
      }),
      initPosition: ({ stage }, event) => {
        stage?.setPosition(event.event);
      },
      drawLine: ({ stage }, event) => {
        stage?.drawLine(event.event);
      },
      drawRect: ({ stage }, { event }) => {
        stage?.drawRect(event);
      },
      traceRect: ({ stage }, { event }) => {
        stage?.drawRect(event, "support");
      },
      drawCircle: ({ stage }, { event }) => {
        stage?.drawCircle(event);
      },
      traceCircle: ({ stage }, { event }) => {
        stage?.drawCircle(event, "support");
      },
      drawEllipse: ({ stage }, { event }) => {
        stage?.drawEllipse(event);
      },
      traceEllipse: ({ stage }, { event }) => {
        stage?.drawEllipse(event, "support");
      },
      changeColor: assign(({ stage }, event) => {
        stage?.setStrokeColor(event.color);
        return { color: event.color };
      }),
      changeFillColor: assign(({ stage }, event) => {
        stage?.setFillColor(event.color);
        return { fillColor: event.color };
      }),
      changeStrokeWidth: assign(({ stage }, event) => {
        stage?.setStrokeWidth(event.width);
        return { strokeWidth: event.width };
      }),
      changeTool: assign((_, event) => {
        return { tool: event.tool };
      }),
      clearSupport: ({ stage }) => {
        stage?.clearSupport();
      },
    },
    services: {
      resize,
    },
  }
);
