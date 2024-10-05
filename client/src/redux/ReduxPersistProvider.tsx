"use client";

import { PersistGate } from "redux-persist/integration/react";
import { ReduxProvider } from "@/redux/ReduxProvider";
import { persistor } from "@/redux/store";

export function ReduxPersistProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </ReduxProvider>
  );
}

