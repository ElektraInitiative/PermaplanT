import { toast } from 'react-toastify';
import { ToastContent, ToastOptions } from 'react-toastify/dist/types';
import { create } from 'zustand';

type GroupedToastData<TData> = {
  content: ToastContent<TData>;
  options: ToastOptions<object> | undefined;
};

interface GroupedToastState {
  loading: Map<GroupedToastData<unknown>, number>;
  success: Map<GroupedToastData<unknown>, number>;
  info: Map<GroupedToastData<unknown>, number>;
  error: Map<GroupedToastData<unknown>, number>;
  warning: Map<GroupedToastData<unknown>, number>;

  addLoadingContent: (data: GroupedToastData<unknown>) => boolean;
  addSuccessContent: (data: GroupedToastData<unknown>) => boolean;
  addInfoContent: (data: GroupedToastData<unknown>) => boolean;
  addErrorContent: (data: GroupedToastData<unknown>) => boolean;
  addWarningContent: (data: GroupedToastData<unknown>) => boolean;
}

const useGroupedToastState = create<GroupedToastState>((set) => {
  return {
    loading: new Map(),
    success: new Map(),
    info: new Map(),
    error: new Map(),
    warning: new Map(),

    addLoadingContent: (data: GroupedToastData<unknown>): boolean => {
      let contentKnown = false;

      set((state) => {
        if (state.loading.has(data)) {
          const count = state.loading.get(data) ?? 0;
          contentKnown = true;
          return {
            ...state,
            loading: state.loading.set(data, count + 1),
          };
        }

        return {
          ...state,
          loading: state.loading.set(data, 1),
        };
      });

      return contentKnown;
    },
    addSuccessContent: (data: GroupedToastData<unknown>): boolean => {
      return !!data;
    },
    addInfoContent: (data: GroupedToastData<unknown>): boolean => {
      return !!data;
    },
    addErrorContent: (data: GroupedToastData<unknown>): boolean => {
      return !!data;
    },
    addWarningContent: (data: GroupedToastData<unknown>): boolean => {
      return !!data;
    },
  };
});

export function loading(content: ToastContent, options?: ToastOptions<object> | undefined) {
  if (useGroupedToastState.getState().addLoadingContent({ content, options })) {
    toast.loading(<LoadingContentDisplay data={{ content, options }} />, options);
  }
}

function LoadingContentDisplay(props: { data: GroupedToastData<unknown> }) {
  const loading = useGroupedToastState((state) => state.loading);

  return (
    <>
      {props.data.content}
      {loading.get(props.data) ?? 0 > 1 ? <span>x{loading.get(props.data)}</span> : <></>}
    </>
  );
}

/*export function success<TData = unknown>(
  content: ToastContent<TData>,
  options?: ToastOptions<object> | undefined,
) {
  return toast.success(content, options);
}

export function info<TData = unknown>(
  content: ToastContent<TData>,
  options?: ToastOptions<object> | undefined,
) {}

export function error<TData = unknown>(
  content: ToastContent<TData>,
  options?: ToastOptions<object> | undefined,
) {}

export function warning<TData = unknown>(
  content: ToastContent<TData>,
  options?: ToastOptions<object> | undefined,
) {}

toast.onChange((payload: ToastItem) => {});
*/
