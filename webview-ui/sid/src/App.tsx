import React from "react";
import "./App.css";
import SidAddresses from "./sidAddresses";
import ADSR from "./adsr";
import Notes from "./notes";

function App() {
  return (
    <main>
      <SidAddresses />
      <ADSR />
      <Notes />
    </main>
  );
}

export default App;
