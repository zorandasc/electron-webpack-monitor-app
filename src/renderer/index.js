import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Settings from "../components/Settings";
import { Router } from "react-router-static";

const routes = {
  // A map of "route" => "component"
  default: App,
  settings: Settings, // Default component to mount when no other route is detected
};

ReactDOM.render(<Router routes={routes} />, document.getElementById("app"));
