import { createKeyBindingsAccordingToConfig } from '@/config/keybindings';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalContainerProps {
  /** usually the Modal content */
  children: React.ReactNode;
  /** controls the visibility */
  show: boolean;
  /** Callback that is executed when the user presses the configured cancelModal key. */
  onCancelKeyPressed?: () => void;
}

/** animated container for Modals */
export default function ModalContainer({
  children,
  show,
  onCancelKeyPressed,
}: ModalContainerProps) {
  const keyHandlerActions = {
    cancelModal: onCancelKeyPressed,
  };
  useKeyHandlers(createKeyBindingsAccordingToConfig('global', keyHandlerActions), document, true);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed left-[50%] top-[15%] z-[1020]"
          initial={{ opacity: 0, translateX: '-50%' }}
          animate={{
            opacity: 100,
            transition: { delay: 0, duration: 0.1 },
          }}
          exit={{
            opacity: 0,
            transition: { delay: 0, duration: 0.1 },
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
