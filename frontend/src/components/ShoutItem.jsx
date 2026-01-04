import { motion } from "framer-motion";

export default function ShoutItem({ shout }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="mb-3 p-2 bg-white text-gray-900 rounded border shadow-sm"
    >
      <div className="text-sm">
        <span className="font-semibold">{shout.user}</span>: {shout.message}
      </div>
    </motion.div>
  );
}
