"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col items-center mt-16 md:mt-24 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="text-center"
      >
        <motion.h1 variants={itemVariants} className="text-4xl font-bold">
          Welcome to In Death Tournament
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg text-gray-400 mt-2">
          Compete in tournaments, climb the leaderboard, and prove your skills.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-6 flex gap-4 justify-center">
          <Link href="/tournaments">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg shadow hover:bg-blue-600 transition">
              View Tournaments
            </button>
          </Link>

          {user && (user.roles.includes("admin") || user.roles.includes("creator")) && (
            <Link href="/create-tournament">
              <button className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg shadow hover:bg-green-600 transition">
                Create a Tournament
              </button>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </main>
  );
}
