"use client";

import React from "react";
import { SnackbarProvider } from "notistack";

const MyApp = ({ children }) => {
  return <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>;
};

export default MyApp;
