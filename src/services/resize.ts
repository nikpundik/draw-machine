import { Sender } from "xstate";
import { DrawMachineEvents, DrawMachineContext } from "../machines/draw.types";

export const resize =
  ({ canvas }: DrawMachineContext, event: DrawMachineEvents) =>
  (send: Sender<DrawMachineEvents>) => {
    if (!canvas) {
      return () => {};
    }
    const setFullScreen = () => {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      send("RESIZE");
    };
    setFullScreen();
    window.addEventListener("resize", setFullScreen);
    return () => {
      window.removeEventListener("resize", setFullScreen);
    };
  };
