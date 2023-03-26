import React from "react";

import { GlobalStateProvider } from "./providers/global";
import Canvas from "./components/Canvas";
import GUI from "./components/GUI";
import "./styles.css";

function App() {
  return (
    <GlobalStateProvider>
      <Canvas />
      <GUI />
    </GlobalStateProvider>
  );
}

export default App;
