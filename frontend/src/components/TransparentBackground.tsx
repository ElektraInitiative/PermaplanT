import { AnimatePresence, motion } from 'framer-motion';

interface TransparentBackgroundProps {
  onClick: () => void;
  show: boolean;
}

const TransparentBackground = ({ onClick, show }: TransparentBackgroundProps) => {
  return (
    <>
      <div
        onClick={onClick}
        className={`fixed right-0 bottom-0 z-[1010] ${show ? '' : 'pointer-events-none'}`}
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
              <div style={{ backgroundColor: 'black', height: '100vh', width: '100vw' }}></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default TransparentBackground;
