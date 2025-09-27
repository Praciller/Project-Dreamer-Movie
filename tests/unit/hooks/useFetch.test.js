import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useFetch from '../../../src/hooks/useFetch'
import { fetchDataFromApi } from '../../../src/utils/api'

// Mock the API utility
vi.mock('../../../src/utils/api')
const mockedFetchDataFromApi = vi.mocked(fetchDataFromApi)

describe('useFetch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with correct default values', () => {
    mockedFetchDataFromApi.mockImplementation(() => new Promise(() => {})) // Never resolves

    const { result } = renderHook(() => useFetch('/test-url'))

    expect(result.current.data).toBe(null)
    expect(result.current.loading).toBe('loading...')
    expect(result.current.error).toBe(null)
  })

  it('should fetch data successfully', async () => {
    const mockData = {
      results: [
        { id: 1, title: 'Test Movie' }
      ]
    }

    mockedFetchDataFromApi.mockResolvedValueOnce(mockData)

    const { result } = renderHook(() => useFetch('/movie/popular'))

    // Initially loading
    expect(result.current.loading).toBe('loading...')
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)

    // Wait for the API call to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBe(null)
    expect(mockedFetchDataFromApi).toHaveBeenCalledWith('/movie/popular')
  })

  it('should handle API errors', async () => {
    const mockError = new Error('API Error')
    mockedFetchDataFromApi.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useFetch('/movie/popular'))

    // Initially loading
    expect(result.current.loading).toBe('loading...')

    // Wait for the error to be handled
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe('Something went wrong!')
  })

  it('should refetch when URL changes', async () => {
    const mockData1 = { results: [{ id: 1, title: 'Movie 1' }] }
    const mockData2 = { results: [{ id: 2, title: 'Movie 2' }] }

    mockedFetchDataFromApi
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2)

    const { result, rerender } = renderHook(
      ({ url }) => useFetch(url),
      { initialProps: { url: '/movie/popular' } }
    )

    // Wait for first fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.data).toEqual(mockData1)

    // Change URL and rerender
    rerender({ url: '/movie/top_rated' })

    // Should start loading again
    expect(result.current.loading).toBe('loading...')
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)

    // Wait for second fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.data).toEqual(mockData2)

    expect(mockedFetchDataFromApi).toHaveBeenCalledTimes(2)
    expect(mockedFetchDataFromApi).toHaveBeenNthCalledWith(1, '/movie/popular')
    expect(mockedFetchDataFromApi).toHaveBeenNthCalledWith(2, '/movie/top_rated')
  })

  it('should reset state when URL changes', async () => {
    const mockData = { results: [] }
    mockedFetchDataFromApi.mockResolvedValue(mockData)

    const { result, rerender } = renderHook(
      ({ url }) => useFetch(url),
      { initialProps: { url: '/movie/popular' } }
    )

    // Wait for first fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Set up a slow response for the second call
    mockedFetchDataFromApi.mockImplementation(() => new Promise(() => {}))

    // Change URL
    rerender({ url: '/movie/top_rated' })

    // State should be reset
    expect(result.current.loading).toBe('loading...')
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })
})
