/* eslint-env node */
import "@testing-library/jest-dom";
import { vi, afterEach } from "vitest";

// Mock environment variables
vi.mock("import.meta", () => ({
  env: {
    VITE_APP_TMDB_TOKEN:
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTI1ZmVhZTg1OWZmNzE0OTBlODJmNzRkMmY1NzgyMyIsIm5iZiI6MTY4OTUxMDM1MC45MDIwMDAyLCJzdWIiOiI2NGIzZTFjZTIzZDI3ODAxNDU4NTJiOWMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.SHb-PfuarVI-Ao1ecQ9AcvCYavn3tzl3iCHV7lo5zs8",
  },
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
global.scrollTo = vi.fn();

// Mock fetch for API calls
global.fetch = vi.fn();

// Setup cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
