import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the providers used by NavbarClient
jest.mock("@/app/providers", () => ({
  useSidebar: jest.fn(),
  useResponsive: jest.fn(),
}));

import { useSidebar, useResponsive } from "@/app/providers";

// Provide a simple matchMedia mock with add/removeEventListener
function mockMatchMedia() {
  return {
    matches: false,
    media: "(max-width: 768px)",
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
}

describe("NavbarClient", () => {
  afterEach(() => {
    jest.resetAllMocks();
    document.body.innerHTML = "";
  });

  it("sets tabindex -1 when sidebar visible on small screen", async () => {
    (useSidebar as jest.Mock).mockReturnValue({ isSidebarVisible: true });
    (useResponsive as jest.Mock).mockReturnValue({ isSmallScreen: true });

    // attach a container with focusable children
    const container = document.createElement("div");
    container.id = "navbar-container";
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = "link";
    const btn = document.createElement("button");
    btn.textContent = "btn";
    container.appendChild(a);
    container.appendChild(btn);
    document.body.appendChild(container);

    // mock matchMedia
    window.matchMedia = jest.fn().mockImplementation(mockMatchMedia);

    const { default: NavbarClient } = await import("../NavbarClient");
    render(<NavbarClient />);

    await waitFor(() => {
      expect(container.tabIndex).toBe(-1);
      expect(a.tabIndex).toBe(-1);
      expect(btn.tabIndex).toBe(-1);
    });
  });

  it("sets tabindex 0 when sidebar hidden or not small screen", async () => {
    (useSidebar as jest.Mock).mockReturnValue({ isSidebarVisible: false });
    (useResponsive as jest.Mock).mockReturnValue({ isSmallScreen: true });

    const container = document.createElement("div");
    container.id = "navbar-container";
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = "link";
    const btn = document.createElement("button");
    btn.textContent = "btn";
    container.appendChild(a);
    container.appendChild(btn);
    document.body.appendChild(container);

    window.matchMedia = jest.fn().mockImplementation(mockMatchMedia);

    const { default: NavbarClient } = await import("../NavbarClient");
    render(<NavbarClient />);

    await waitFor(() => {
      expect(container.tabIndex).toBe(0);
      expect(a.tabIndex).toBe(0);
      expect(btn.tabIndex).toBe(0);
    });
  });

  it("works with custom containerId", async () => {
    (useSidebar as jest.Mock).mockReturnValue({ isSidebarVisible: true });
    (useResponsive as jest.Mock).mockReturnValue({ isSmallScreen: true });

    const container = document.createElement("div");
    container.id = "custom-navbar";
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = "link";
    container.appendChild(a);
    document.body.appendChild(container);

    window.matchMedia = jest.fn().mockImplementation(mockMatchMedia);

    const { default: NavbarClient } = await import("../NavbarClient");
    render(<NavbarClient containerId="custom-navbar" />);

    await waitFor(() => {
      expect(container.tabIndex).toBe(-1);
      expect(a.tabIndex).toBe(-1);
    });
  });
});
