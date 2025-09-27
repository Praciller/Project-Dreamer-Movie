import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import { fetchDataFromApi } from "../../src/utils/api";

// Mock axios for integration tests
vi.mock("axios");
const mockedAxios = vi.mocked(axios);

describe("API Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("TMDB API Integration", () => {
    it("should successfully integrate with TMDB API endpoints", async () => {
      const mockMovieData = {
        page: 1,
        results: [
          {
            id: 550,
            title: "Fight Club",
            overview: "A ticking-time-bomb insomniac...",
            poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            vote_average: 8.4,
            release_date: "1999-10-15",
            genre_ids: [18, 53],
          },
        ],
        total_pages: 500,
        total_results: 10000,
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockMovieData });

      const result = await fetchDataFromApi("/movie/popular", { page: 1 });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/movie/popular",
        {
          headers: {
            Authorization: expect.stringContaining("bearer"),
          },
          params: { page: 1 },
        }
      );
      expect(result).toEqual(mockMovieData);
      expect(result.results[0].title).toBe("Fight Club");
    });

    it("should handle API errors in integration", async () => {
      const mockError = new Error("Network Error");
      mockedAxios.get.mockRejectedValueOnce(mockError);

      const result = await fetchDataFromApi("/movie/popular");

      expect(result).toBe(mockError);
    });

    it("should integrate with different TMDB endpoints", async () => {
      const mockGenreData = {
        genres: [
          { id: 28, name: "Action" },
          { id: 12, name: "Adventure" },
          { id: 16, name: "Animation" },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockGenreData });

      const result = await fetchDataFromApi("/genre/movie/list");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/genre/movie/list",
        {
          headers: {
            Authorization: expect.stringContaining("bearer"),
          },
          params: undefined,
        }
      );
      expect(result).toEqual(mockGenreData);
      expect(result.genres).toHaveLength(3);
    });
  });
});
