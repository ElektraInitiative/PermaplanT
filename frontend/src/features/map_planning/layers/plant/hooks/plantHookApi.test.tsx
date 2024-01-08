import { renderHook, waitFor, screen, act } from '@testing-library/react';
import { mockServerErrorOnce } from '@/__test_utils__/msw';
import '@/__test_utils__/setup';
import '@/__test_utils__/setupSessionStorageAuth';
import { createQueryHookWrapper } from '@/__test_utils__/utils';
import { useFindPlantById, usePlantSearch } from './plantHookApi';

describe('useFindPlantById', () => {
  const renderUseFindPlantById = () =>
    renderHook(() => useFindPlantById({ plantId: 1 }), {
      wrapper: createQueryHookWrapper(),
    });

  it('should return a plant', async () => {
    const { result } = renderUseFindPlantById();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.unique_name).toBe('test');
    expect(result.current.data?.id).toBe(1);
  });

  it('should cause a toast to appear on failing hook', async () => {
    mockServerErrorOnce();
    const { result } = renderUseFindPlantById();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
    await screen.findByRole('alert');
  });
});

// skipped because of https://github.com/testing-library/react-testing-library/issues/1197
// TODO: remove skip when issue is resolved
describe.skip('usePlantSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const renderUsePlantSearch = () =>
    renderHook(() => usePlantSearch(), {
      wrapper: createQueryHookWrapper(),
    });

  it('should first return a page of plants without the user typing', async () => {
    const { result } = renderUsePlantSearch();
    await waitFor(() => expect(result.current.queryInfo.isSuccess).toBe(true));

    expect(result.current.queryInfo.isSuccess).toBe(true);
    expect(result.current.queryInfo.data?.length).toBe(3);
  });

  it('should return results for the search term', async () => {
    const { result } = renderUsePlantSearch();
    await waitFor(() => expect(result.current.queryInfo.isSuccess).toBe(true));

    act(() => {
      result.current.actions.searchPlants('t');
    });

    await waitFor(() => expect(result.current.queryInfo.isFetching).toBe(true));
    expect(result.current.queryInfo.data).toBeDefined();
    expect(result.current.queryInfo.error).toBeNull();

    await waitFor(() => expect(result.current.queryInfo.isFetching).toBe(false));
    expect(result.current.queryInfo.error).toBeNull();
    expect(result.current.queryInfo.data?.length).toBe(2);
    expect(result.current.queryInfo.data?.[0].id).toBe(1);
    expect(result.current.queryInfo.data?.[0].unique_name).toBe('test');
    expect(result.current.queryInfo.data?.[1].id).toBe(3);
    expect(result.current.queryInfo.data?.[1].unique_name).toBe('plant');
  });

  it('should return a page of plants after clearing the search term', async () => {
    const { result } = renderUsePlantSearch();
    await waitFor(() => expect(result.current.queryInfo.isSuccess).toBe(true));

    act(() => {
      result.current.actions.searchPlants('flower');
    });

    await waitFor(() => expect(result.current.queryInfo.isFetching).toBe(true));
    await waitFor(() => expect(result.current.queryInfo.isFetching).toBe(false));
    expect(result.current.queryInfo.data?.length).toBe(0);

    act(() => {
      result.current.actions.clearSearchTerm();
    });

    act(() => {
      vi.advanceTimersToNextTimer();
    });

    await waitFor(() => expect(result.current.queryInfo.isPreviousData).toBe(false));
    expect(result.current.queryInfo.data?.length).toBe(3);
  });

  it('should cause a toast to appear when the search fails', async () => {
    mockServerErrorOnce();
    const { result } = renderUsePlantSearch();

    await waitFor(() => expect(result.current.queryInfo.isError).toBe(true));
    expect(result.current.queryInfo.error).toBeDefined();
    await screen.findByRole('alert');
  });
});
