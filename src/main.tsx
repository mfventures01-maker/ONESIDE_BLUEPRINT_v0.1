/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./telemetry/reactInterceptor";
import App from "./App";
import "./index.css";

import { telemetryEngine } from "./telemetry/engine";

telemetryEngine.emit('component_renders', {
  TraceID: telemetryEngine.generateTraceID(),
  ComponentName: 'createRoot',
  RenderStatus: 'STARTED'
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
