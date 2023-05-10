export enum InfoMessageType {
  success,
  failure,
  neutral,
}

interface InfoMessageProps {
  message: string;
  type: InfoMessageType;
  onClose: () => void;
}

export default function InfoMessage({ message, type, onClose }: InfoMessageProps) {
  let style = 'my-2 p-1 text-center border-2 rounded-xl ';
  if (type === InfoMessageType.failure) {
    style +=
      'text-red-800 dark:text-red-100 border-red-300 dark:border-red-500 bg-red-100 dark:bg-red-400';
  } else if (type === InfoMessageType.success) {
    style +=
      'text-primary-800 dark:text-primary-100 border-primary-300 dark:border-primary-500 bg-primary-100 dark:bg-primary-400';
  } else if (type === InfoMessageType.neutral) {
    style +=
      'text-neutral-800 dark:text-neutral-100 border-neutral-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-400';
  }

  return (
    <div className={style} onClick={onClose}>
      {message}
    </div>
  );
}
