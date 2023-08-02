import { AnimatePresence, motion } from 'framer-motion';

interface TransparentBackgroundProps {
  onClick?: () => void;
  show: boolean;
}

/** Animated background used for Modals */
const TransparentBackground = ({ onClick, show }: TransparentBackgroundProps) => {
  return (
    <>
      <div
        onClick={onClick}
        className={`fixed bottom-0 right-0 z-[1010] ${show ? '' : 'pointer-events-none'}`}
      >
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.5,
                transition: { delay: 0, duration: 0.3 },
              }}
              exit={{
                opacity: 0,
              }}
            >
              <div className="h-screen w-screen bg-[#000]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default TransparentBackground;
