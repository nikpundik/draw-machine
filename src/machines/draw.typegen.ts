// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.resize": {
      type: "done.invoke.resize";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.resize": { type: "error.platform.resize"; data: unknown };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    resize: "done.invoke.resize";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignCanvas: "CANVAS_READY";
    changeColor: "CHANGE_COLOR";
    changeFillColor: "CHANGE_FILL_COLOR";
    changeStrokeWidth: "CHANGE_STROKE_WIDTH";
    changeTool: "CHANGE_TOOL";
    clearSupport: "CANVAS_READY" | "MOUSE_OUT" | "MOUSE_UP";
    drawCircle: "MOUSE_UP";
    drawEllipse: "MOUSE_UP";
    drawLast: "RESIZE";
    drawLine: "MOUSE_MOVE";
    drawRect: "MOUSE_UP";
    initCircle: "MOUSE_DOWN";
    initEllipse: "MOUSE_DOWN";
    initLine: "MOUSE_DOWN";
    initRect: "MOUSE_DOWN";
    save: "CANVAS_READY" | "MOUSE_OUT" | "MOUSE_UP";
    traceCircle: "MOUSE_MOVE";
    traceEllipse: "MOUSE_MOVE";
    traceRect: "MOUSE_MOVE";
    undo: "BACKSPACE_PRESS";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    canUndo: "BACKSPACE_PRESS";
    isTool: "MOUSE_DOWN";
  };
  eventsCausingServices: {
    resize: "CANVAS_READY";
  };
  matchesStates:
    | "error"
    | "loading"
    | "running"
    | "running.canvas"
    | "running.canvas.circle"
    | "running.canvas.ellipse"
    | "running.canvas.idle"
    | "running.canvas.line"
    | "running.canvas.rect"
    | "running.gui"
    | "running.gui.hidden"
    | "running.gui.visible"
    | {
        running?:
          | "canvas"
          | "gui"
          | {
              canvas?: "circle" | "ellipse" | "idle" | "line" | "rect";
              gui?: "hidden" | "visible";
            };
      };
  tags: never;
}
