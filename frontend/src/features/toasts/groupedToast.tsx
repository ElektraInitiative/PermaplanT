import { toast, ToastItem } from 'react-toastify';
import { ToastContent, ToastOptions } from 'react-toastify/dist/types';

const infoToastData = new Set<ToastContent>();
const successToastData = new Set<ToastContent>();
const warningToastData = new Set<ToastContent>();
const errorToastData = new Set<ToastContent>();

export function info(content: ToastContent, options?: ToastOptions<object> | undefined) {
  if (!infoToastData.has(content)) {
    infoToastData.add(content);
    toast.info(content, options);
  }
}

export function success(content: ToastContent, options?: ToastOptions<object> | undefined) {
  if (!successToastData.has(content)) {
    successToastData.add(content);
    toast.success(content, options);
  }
}

export function warning(content: ToastContent, options?: ToastOptions<object> | undefined) {
  if (!warningToastData.has(content)) {
    warningToastData.add(content);
    toast.warning(content, options);
  }
}

export function error(content: ToastContent, options?: ToastOptions<object> | undefined) {
  if (!errorToastData.has(content)) {
    errorToastData.add(content);
    toast.error(content, options);
  }
}

toast.onChange((payload: ToastItem) => {
  if (payload.status !== 'removed') return;

  if (payload.type === 'info') infoToastData.delete(payload.content as ToastContent);
  else if (payload.type === 'success') successToastData.delete(payload.content as ToastContent);
  else if (payload.type === 'warning') warningToastData.delete(payload.content as ToastContent);
  else if (payload.type === 'error') errorToastData.delete(payload.content as ToastContent);
});
