import MDEditor, {
  ICommand,
  PreviewType,
  RefMDEditor,
  commands as MarkdownEditorCommands,
  fullscreen as DefaultFullScreenCommand,
} from '@uiw/react-md-editor';
import { useRef, useState } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { useDarkModeStore } from '@/features/dark_mode';

interface MarkdownEditorProps<T extends FieldValues> {
  /** The elements unique id. */
  id: Path<T>;
  /** Text that should be displayed in the accompanying label component. */
  labelText: string;
  /** Additional class names to apply to the input. */
  className?: string;
  /** Callback function that is called when the input value changes. */
  onChange: (value: string | undefined) => void;
  /*** The preview type of the editor. Either 'live', 'edit' or 'preview'. */
  preview?: PreviewType;
  /** The current value of the input. */
  value: string | undefined;
  /** List of commands that should be shown in the toolbar. */
  commands?: ICommand[];
  /** Whether the fullscreen toggle should be shown. */
  showFullScreenToggle?: boolean;
  /** Whether the preview button should be shown. */
  enablePreview?: boolean;
  /** Whether the split view button should be shown. */
  enableSplitView?: boolean;
  /** Whether the editor should be in fullscreen mode. */
  fullScreen?: boolean;
  /** Callback that is called when the editor enters or exits fullscreen mode. */
  fullScreenChange?: (fullScreen: boolean) => void;
  /** List of commands that should be shown in the toolbar when in fullscreen mode. If not set the default commands of the editor will be used. */
  fullScreenCommands?: ICommand[];
}

export { MarkdownEditorCommands };

export default function MarkdownEditor<T extends FieldValues>({
  id,
  labelText,
  className,
  onChange,
  value,
  preview,
  commands,
  enablePreview = true,
  enableSplitView = true,
  showFullScreenToggle = true,
  fullScreenCommands,
  fullScreenChange,
  fullScreen = false,
}: MarkdownEditorProps<T>) {
  const darkMode = useDarkModeStore((state) => state.darkMode);

  const editorRef = useRef<RefMDEditor>(null);
  const [isFullScreen, setIsFullScreen] = useState(fullScreen);

  // custom full screen command to set fullScreen state of the editor
  const customFullScreenCommand: ICommand = {
    name: DefaultFullScreenCommand.name,
    keyCommand: DefaultFullScreenCommand.keyCommand,
    shortcuts: DefaultFullScreenCommand.shortcuts,
    value: DefaultFullScreenCommand.value,
    buttonProps: DefaultFullScreenCommand.buttonProps,
    icon: DefaultFullScreenCommand.icon,
    execute: function execute(state, api, dispatch, executeCommandState, shortcuts) {
      console.log('executeCommandState', executeCommandState);
      api.textArea.focus();
      setIsFullScreen(!isFullScreen);
      fullScreenChange?.(!isFullScreen);
      if (shortcuts && dispatch && executeCommandState) {
        dispatch({
          fullscreen: !executeCommandState.fullscreen,
        });
      }
    },
  };

  const extraCommands = [
    MarkdownEditorCommands.codeEdit,
    enablePreview ? MarkdownEditorCommands.codePreview : null,
    enableSplitView ? MarkdownEditorCommands.codeLive : null,
    showFullScreenToggle ? customFullScreenCommand : null,
  ].filter((command) => command !== null) as ICommand[];

  return (
    <div
      className={`dark:text-white ${className ?? ''}`}
      data-color-mode={darkMode ? 'dark' : 'light'}
    >
      {labelText && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {labelText}
        </label>
      )}
      <MDEditor
        id={id}
        ref={editorRef}
        preview={preview}
        value={value}
        fullscreen={isFullScreen}
        commands={isFullScreen ? fullScreenCommands : commands}
        className={`input list-style-revert border border-neutral-500 bg-neutral-100 placeholder-neutral-500 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:border-neutral-400 disabled:text-neutral-400 aria-[invalid=true]:border-red-400 dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300 dark:disabled:border-neutral-400-dark dark:disabled:text-neutral-400-dark dark:aria-[invalid=true]:border-red-400`}
        extraCommands={extraCommands}
        previewOptions={{
          style: {
            fontSize: 'inherit',
            lineHeight: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
          },
        }}
        onChange={onChange}
      />
    </div>
  );
}
