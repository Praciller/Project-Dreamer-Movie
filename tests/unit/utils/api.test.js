import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { fetchDataFromApi } from "../../../src/utils/api";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios);

describe("API Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchDataFromApi", () => {
    it("should fetch data successfully", async () => {
      const mockData = {
        results: [
          {
            id: 1,
            title: "Test Movie",
            overview: "Test overview",
            poster_path: "/test-poster.jpg",
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchDataFromApi("/movie/popular", { page: 1 });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/movie/popular",
        {
          headers: {
            Authorization:
              "bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTI1ZmVhZTg1OWZmNzE0OTBlODJmNzRkMmY1NzgyMyIsIm5iZiI6MTY4OTUxMDM1MC45MDIwMDAyLCJzdWIiOiI2NGIzZTFjZTIzZDI3ODAxNDU4NTJiOWMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.SHb-PfuarVI-Ao1ecQ9AcvCYavn3tzl3iCHV7lo5zs8",
          },
          params: { page: 1 },
        }
      );
      expect(result).toEqual(mockData);
    });

    it("should handle API errors gracefully", async () => {
      const mockError = new Error("Network Error");
      mockedAxios.get.mockRejectedValueOnce(mockError);

      const result = await fetchDataFromApi("/movie/popular", { page: 1 });

      expect(result).toBe(mockError);
    });

    it("should handle requests without parameters", async () => {
      const mockData = { results: [] };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchDataFromApi("/genre/movie/list");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/genre/movie/list",
        {
          headers: {
            Authorization:
              "bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTI1ZmVhZTg1OWZmNzE0OTBlODJmNzRkMmY1NzgyMyIsIm5iZiI6MTY4OTUxMDM1MC45MDIwMDAyLCJzdWIiOiI2NGIzZTFjZTIzZDI3ODAxNDU4NTJiOWMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.SHb-PfuarVI-Ao1ecQ9AcvCYavn3tzl3iCHV7lo5zs8",
          },
          params: undefined,
        }
      );
      expect(result).toEqual(mockData);
    });

    it("should include correct authorization header", async () => {
      const mockData = { results: [] };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      await fetchDataFromApi("/test-endpoint");

      const callArgs = mockedAxios.get.mock.calls[0];
      expect(callArgs[1].headers.Authorization).toBe(
        "bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTI1ZmVhZTg1OWZmNzE0OTBlODJmNzRkMmY1NzgyMyIsIm5iZiI6MTY4OTUxMDM1MC45MDIwMDAyLCJzdWIiOiI2NGIzZTFjZTIzZDI3ODAxNDU4NTJiOWMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.SHb-PfuarVI-Ao1ecQ9AcvCYavn3tzl3iCHV7lo5zs8"
      );
    });
  });
});
