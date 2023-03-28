import { Sender } from "xstate";
import { DrawMachineEvents, DrawMachineContext } from "../machines/draw.types";

export const resize =
  ({ stage }: DrawMachineContext, event: DrawMachineEvents) =>
  (send: Sender<DrawMachineEvents>) => {
    const setFullScreen = () => {
      send("RESIZE");
    };
    window.addEventListener("resize", setFullScreen);
    return () => {
      window.removeEventListener("resize", setFullScreen);
    };
  };
