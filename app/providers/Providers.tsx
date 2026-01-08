"use client";

import { ResponsiveProvider } from "./ResponsiveProvider";
import { ModalProvider } from "./ModalProvider";
import LocationProvider from "./LocationProvider";
import CitationsProvider from "./CitationsProvider";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ResponsiveProvider>
      <ModalProvider>
        <LocationProvider>
          <CitationsProvider>{children}</CitationsProvider>
        </LocationProvider>
      </ModalProvider>
    </ResponsiveProvider>
  );
}
