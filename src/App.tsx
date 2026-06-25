/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./state/auth/AuthProvider";
import { ShellStateProvider } from "./state/Contexts";
import { AppRoutes } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <ShellStateProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ShellStateProvider>
    </AuthProvider>
  );
}
