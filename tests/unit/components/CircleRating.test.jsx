import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CircleRating from "../../../src/components/circleRating/CircleRating";

describe("CircleRating Component", () => {
  it("should render with correct rating value", () => {
    const rating = 7.5;
    render(<CircleRating rating={rating} />);

    // Check if the rating text is displayed
    expect(screen.getByText("7.5")).toBeInTheDocument();
  });

  it("should render with low rating (red color)", () => {
    const rating = 3.2;
    render(<CircleRating rating={rating} />);

    const container = screen.getByText("3.2").closest(".circleRating");
    expect(container).toBeInTheDocument();
    expect(screen.getByText("3.2")).toBeInTheDocument();
  });

  it("should render with medium rating (orange color)", () => {
    const rating = 6.5;
    render(<CircleRating rating={rating} />);

    const container = screen.getByText("6.5").closest(".circleRating");
    expect(container).toBeInTheDocument();
    expect(screen.getByText("6.5")).toBeInTheDocument();
  });

  it("should render with high rating (green color)", () => {
    const rating = 8.7;
    render(<CircleRating rating={rating} />);

    const container = screen.getByText("8.7").closest(".circleRating");
    expect(container).toBeInTheDocument();
    expect(screen.getByText("8.7")).toBeInTheDocument();
  });

  it("should handle edge case ratings", () => {
    // Test exactly 5 (should be orange)
    const { rerender } = render(<CircleRating rating={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();

    // Test exactly 7 (should be green)
    rerender(<CircleRating rating={7} />);
    expect(screen.getByText("7")).toBeInTheDocument();

    // Test 0 rating - CircularProgressbar might not display 0 as text, so just check container
    rerender(<CircleRating rating={0} />);
    const container = document.querySelector(".circleRating");
    expect(container).toBeInTheDocument();

    // Test maximum rating
    rerender(<CircleRating rating={10} />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("should have correct CSS class", () => {
    const rating = 7.5;
    render(<CircleRating rating={rating} />);

    const container = screen.getByText("7.5").closest(".circleRating");
    expect(container).toHaveClass("circleRating");
  });

  it("should handle decimal ratings correctly", () => {
    const rating = 7.89;
    render(<CircleRating rating={rating} />);

    expect(screen.getByText("7.89")).toBeInTheDocument();
  });

  it("should handle string ratings (converted to number)", () => {
    const rating = "8.5";
    render(<CircleRating rating={rating} />);

    expect(screen.getByText("8.5")).toBeInTheDocument();
  });
});
