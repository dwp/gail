"use client";

import SidebarProvider from "./SidebarProvider";
import { ResponsiveProvider } from "./ResponsiveProvider";
import { ModalProvider } from "./ModalProvider";
import LocationProvider from "./LocationProvider";

type AllProvidersProps = {
  children: React.ReactNode;
};

export default function AllProviders({ children }: AllProvidersProps) {
  return (
    <ResponsiveProvider>
      <ModalProvider>
        <LocationProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </LocationProvider>
      </ModalProvider>
    </ResponsiveProvider>
  );
}
