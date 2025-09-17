import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

function Heading() {
  return (
    <div className="text-center mb-12">
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl font-extrabold text-sky-700 drop-shadow-lg tracking-tight"
      >
        POSCO International
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="flex items-center justify-center gap-2 mt-4"
      >
        <Briefcase className="w-6 h-6 text-sky-700" />
        <p className="text-gray-700 text-xl font-semibold">
          수행 업무 조사 <span className="text-sky-700">(Work Survey)</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "120px" }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mx-auto mt-3 h-1 bg-sky-700 rounded-full shadow-md"
      />
    </div>
  );
}

export default Heading;
