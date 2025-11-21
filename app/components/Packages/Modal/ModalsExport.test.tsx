import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AllProviders from "@/app/providers/AllProviders";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
  summarise: jest.fn().mockResolvedValue([]),
  elaborate: jest.fn().mockResolvedValue([]),
  refineQuery: jest.fn().mockResolvedValue([]),
  generateFollowUps: jest.fn().mockResolvedValue([]),
  generateFollowUpQs: jest.fn().mockResolvedValue([]),
}));

import { ReturnHomeModal, ClearChatModal } from "./ModalsExport";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
  usePathname() {
    return "/";
  },
}));

describe("ReturnHomeModal", () => {
  it("renders correctly", () => {
    render(
      <AllProviders>
        <ReturnHomeModal />
      </AllProviders>,
    );
    const modal = screen.getByTestId("modal-container");
    expect(modal).toBeInTheDocument();
  });
});

describe("ClearChatModal", () => {
  it("renders correctly", () => {
    render(
      <AllProviders>
        <ClearChatModal />
      </AllProviders>,
    );
    const modal = screen.getByTestId("modal-container");
    expect(modal).toBeInTheDocument();
  });
});
