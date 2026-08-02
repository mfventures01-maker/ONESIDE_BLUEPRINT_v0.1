/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./state/auth/AuthProvider";
import { ShellStateProvider } from "./state/Contexts";
import { AppRoutes } from "./routes";
import { AdminShield } from "./components/AdminShield";

export default function App() {
  return (
    <AuthProvider>
      <ShellStateProvider>
        <BrowserRouter>
          <AppRoutes />
          <AdminShield />
        </BrowserRouter>
      </ShellStateProvider>
    </AuthProvider>
  );
}

