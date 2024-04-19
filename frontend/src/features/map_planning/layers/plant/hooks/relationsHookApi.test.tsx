import { renderHook, screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';
import { mockServerErrorOnce } from '@/__test_utils__/msw';
import '@/__test_utils__/setup';
import '@/__test_utils__/setupSessionStorageAuth';
import { createQueryHookWrapper } from '@/__test_utils__/utils';
import { RelationType } from '@/api_types/definitions';
import { useRelations } from '@/features/map_planning/layers/plant/hooks/relationsHookApi';

describe('useRelations', () => {
  const renderUseRelations = () =>
    renderHook(
      () =>
        useRelations({
          mapId: 1,
          plantId: 1,
          enabled: true,
        }),
      {
        wrapper: createQueryHookWrapper(),
      },
    );

  it('should return the two relations for the plant', async () => {
    const { result } = renderUseRelations();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.has(1));
    expect(result.current.data?.has(2));
    expect(result.current.data?.get(1)?.id == 1);
    expect(result.current.data?.get(1)?.relation == RelationType.Neutral);
    expect(result.current.data?.get(2)?.relation == RelationType.Antagonist);
  });

  it('should cause a toast to appear on failing hook', async () => {
    mockServerErrorOnce();
    const { result } = renderUseRelations();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
    await screen.findByRole('alert');
  });
});
