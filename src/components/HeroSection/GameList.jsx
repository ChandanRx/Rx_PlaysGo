"use client";
import React, { useEffect, useState } from "react";
import Data from "../../shared/data";
import Image from "next/image";
import { motion } from "framer-motion";

const GameList = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    setGames(Data.GameData);
  }, []);

  return (
    <div className="mt-6 grid grid-cols-3 gap-5 px-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 md:px-0">
      {games.map((item, index) => (
        <motion.div
          key={item.name}
          className="group flex flex-col items-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.05, rotate: 1 }}
        >
          <Image
            className="cursor-pointer rounded-2xl border border-white/10 bg-black/40 p-2 shadow-sm transition-all duration-300 group-hover:border-amber-400/70 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
            src={item.image}
            alt={item.name}
            width={60}
            height={60}
          />
          <motion.h2
            className="text-[13px] text-center font-medium text-slate-200 transition-colors duration-300 group-hover:text-amber-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.08 + 0.2 }}
          >
            {item.name}
          </motion.h2>
        </motion.div>
      ))}
    </div>
  );
};

export default GameList;
