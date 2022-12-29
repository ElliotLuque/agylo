import { AnimatePresence, motion } from "framer-motion";
import InfoIcon from "./svg/infoIcon";
import ErrorIcon from "./svg/errorIcon";

const Toast: React.FC<{ message: string; isOpen: boolean; error: boolean }> = ({
  message,
  isOpen,
  error,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="toast-updated"
          initial={{ x: 100, opacity: 0.1 }}
          exit={{ x: 100, opacity: 0.1 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.65 }}
        >
          <div
            className="pointer-events-none max-w-xs select-none rounded-md border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            role="alert"
          >
            <div className="flex items-center  gap-4 p-4">
              {error ? <ErrorIcon /> : <InfoIcon />}
              <p className="text-md text-gray-700 align-middle dark:text-gray-400">
                  {message}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
