import { Sender } from "xstate";
import { DrawMachineEvents, DrawMachineContext } from "../machines/draw.types";

export const resize =
  ({ canvas, supportCanvas }: DrawMachineContext, event: DrawMachineEvents) =>
  (send: Sender<DrawMachineEvents>) => {
    if (!canvas || !supportCanvas) {
      return () => {};
    }
    const setFullScreen = () => {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      supportCanvas.height = window.innerHeight;
      supportCanvas.width = window.innerWidth;
      send("RESIZE");
    };
    setFullScreen();
    window.addEventListener("resize", setFullScreen);
    return () => {
      window.removeEventListener("resize", setFullScreen);
    };
  };
