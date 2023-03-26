import React, { FC, createContext, useContext } from "react";
import { InterpreterFrom } from "xstate";
import { useInterpret, useActor } from "@xstate/react";
import { drawMachine } from "../machines/draw";

export const GlobalStateContext = createContext({
  drawService: {} as InterpreterFrom<typeof drawMachine>,
});

type GlobalStateProviderProps = {
  children: React.ReactNode;
};
export const GlobalStateProvider: FC<GlobalStateProviderProps> = (props) => {
  const drawService = useInterpret(drawMachine);

  return (
    <GlobalStateContext.Provider value={{ drawService }}>
      {props.children}
    </GlobalStateContext.Provider>
  );
};

export const useDrawMachine = () => {
  const globalServices = useContext(GlobalStateContext);
  return useActor(globalServices.drawService);
};
