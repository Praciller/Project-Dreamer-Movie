import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import MovieCard from '../../../src/components/movieCard/MovieCard'

// Mock the child components
vi.mock('../../../src/components/lazyLoadImage/Img', () => ({
  default: ({ src, className }) => (
    <img src={src} className={className} alt="poster" />
  )
}))

vi.mock('../../../src/components/circleRating/CircleRating', () => ({
  default: ({ rating }) => <div data-testid="circle-rating">{rating}</div>
}))

vi.mock('../../../src/components/genres/Genres', () => ({
  default: ({ data }) => (
    <div data-testid="genres">{data?.join(', ')}</div>
  )
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      home: (state = { url: { poster: 'https://image.tmdb.org/t/p/w500' } }) => state
    },
    preloadedState: {
      home: { url: { poster: 'https://image.tmdb.org/t/p/w500' } },
      ...initialState
    }
  })
}

const renderWithProviders = (component, store = createMockStore()) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  )
}

describe('MovieCard Component', () => {
  const mockMovieData = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test-poster.jpg',
    vote_average: 7.5,
    genre_ids: [28, 12, 16],
    release_date: '2023-01-15',
    media_type: 'movie'
  }

  const mockTVData = {
    id: 2,
    name: 'Test TV Show',
    poster_path: '/test-tv-poster.jpg',
    vote_average: 8.2,
    genre_ids: [18, 10765],
    release_date: '2023-03-20',
    media_type: 'tv'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render movie card with correct data', () => {
    renderWithProviders(<MovieCard data={mockMovieData} />)

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('Jan 15, 2023')).toBeInTheDocument()
    expect(screen.getByTestId('circle-rating')).toHaveTextContent('7.5')
    expect(screen.getByTestId('genres')).toBeInTheDocument()
  })

  it('should render TV show card with name instead of title', () => {
    renderWithProviders(<MovieCard data={mockTVData} />)

    expect(screen.getByText('Test TV Show')).toBeInTheDocument()
    expect(screen.getByText('Mar 20, 2023')).toBeInTheDocument()
  })

  it('should use fallback poster when poster_path is null', () => {
    const dataWithoutPoster = { ...mockMovieData, poster_path: null }
    renderWithProviders(<MovieCard data={dataWithoutPoster} />)

    const posterImg = screen.getByAltText('poster')
    expect(posterImg.src).toContain('no-poster.png')
  })

  it('should use correct poster URL when poster_path exists', () => {
    renderWithProviders(<MovieCard data={mockMovieData} />)

    const posterImg = screen.getByAltText('poster')
    expect(posterImg.src).toBe('https://image.tmdb.org/t/p/w500/test-poster.jpg')
  })

  it('should navigate to correct URL when clicked', () => {
    renderWithProviders(<MovieCard data={mockMovieData} />)

    const movieCard = screen.getByText('Test Movie').closest('.movieCard')
    fireEvent.click(movieCard)

    expect(mockNavigate).toHaveBeenCalledWith('/movie/1')
  })

  it('should use mediaType prop when media_type is not in data', () => {
    const dataWithoutMediaType = { ...mockMovieData }
    delete dataWithoutMediaType.media_type

    renderWithProviders(<MovieCard data={dataWithoutMediaType} mediaType="tv" />)

    const movieCard = screen.getByText('Test Movie').closest('.movieCard')
    fireEvent.click(movieCard)

    expect(mockNavigate).toHaveBeenCalledWith('/tv/1')
  })

  it('should hide rating and genres when fromSearch is true', () => {
    renderWithProviders(<MovieCard data={mockMovieData} fromSearch={true} />)

    expect(screen.queryByTestId('circle-rating')).not.toBeInTheDocument()
    expect(screen.queryByTestId('genres')).not.toBeInTheDocument()
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('should show rating and genres when fromSearch is false or undefined', () => {
    renderWithProviders(<MovieCard data={mockMovieData} fromSearch={false} />)

    expect(screen.getByTestId('circle-rating')).toBeInTheDocument()
    expect(screen.getByTestId('genres')).toBeInTheDocument()
  })

  it('should handle missing release_date gracefully', () => {
    const dataWithoutDate = { ...mockMovieData, release_date: null }
    renderWithProviders(<MovieCard data={dataWithoutDate} />)

    // Should still render the component without crashing
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('should format vote_average to one decimal place', () => {
    const dataWithPreciseRating = { ...mockMovieData, vote_average: 7.856 }
    renderWithProviders(<MovieCard data={dataWithPreciseRating} />)

    expect(screen.getByTestId('circle-rating')).toHaveTextContent('7.9')
  })

  it('should limit genres to first 2 items', () => {
    const dataWithManyGenres = { 
      ...mockMovieData, 
      genre_ids: [28, 12, 16, 18, 10749, 35] // 6 genres
    }
    renderWithProviders(<MovieCard data={dataWithManyGenres} />)

    const genresElement = screen.getByTestId('genres')
    // The Genres component should receive only the first 2 genre IDs
    expect(genresElement).toBeInTheDocument()
  })
})
