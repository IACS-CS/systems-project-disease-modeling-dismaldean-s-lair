import React, { useEffect, useState } from "react";
import HandshakeSimulation from "./sims/handshakeGame/HandshakeSimulation";
import Simulation from "./sims/simulationOne/Simulation";
import Simulation2 from "./sims/simulationTwo/Simulation";

export const App = () => {
  const sims = [
    {
      name: "Handshake Simulation",
      component: HandshakeSimulation,
    },
    {
      name: "My Simulation",
      component: Simulation,
    },
    {
      name: "My Rabies Simulation",
      component: Simulation2,
    },
  ];

  const [activeSim, setActiveSim] = useState(undefined);

  const renderChooser = () => (
    <div className="simulation-chooser">
      <h1>Simulation Playground</h1>
      <ul>
        {sims.map((sim) => (
          <li key={sim.name}>
            <button onClick={() => setActiveSim(sim)}>{sim.name}</button>
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );

  const renderSim = () => (
    <div className="simulation-container">
      <button className="back-button" onClick={() => setActiveSim(undefined)}>
        Back
      </button>
      <activeSim.component />
    </div>
  );

  return (
    <div className="app-container">
      {activeSim ? renderSim() : renderChooser()}
    </div>
  );
};

const Footer = () => (
  <footer className="footer">
    <p>Created with the help of ChatGPT and Google.</p>
  </footer>
);

export default App;
