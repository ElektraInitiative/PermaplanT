import { AnimatePresence, motion } from 'framer-motion';

interface ModalContainerProps {
  children: React.ReactNode;
  show: boolean;
}

export default function ModalContainer({ children, show }: ModalContainerProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-[15%] left-[50%] z-[1020]"
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
