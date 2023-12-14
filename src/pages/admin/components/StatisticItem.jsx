import React from "react";
import { motion } from "framer-motion";

function StatisticItem({ statistic }) {
  return (
    <motion.div
      key={Math.random() * 100}
      className={`p-4 rounded-2xl xl:w-1/4 md:w-1/3 w-full flex justify-between items-center shadow-md bg-gradient-to-tr ${statistic.bgColor}`}
      whileHover={{ scale: 1.05 }}
    >
      <div>
        {statistic.loading === true && (
          <p className={`text-xl font-bold ${statistic.color}`}>Loading...</p>
        )}
        {statistic.loading === false && (
          <p className={`text-3xl font-bold ${statistic.color}`}>
            {statistic.count}
          </p>
        )}
        <p className={`text-md uppercase ${statistic.color} font-bold`}>
          {statistic.name}
        </p>
        {statistic.currentMonthCount && (
          <p>
            This month: <span>{statistic.currentMonthCount}</span>
          </p>
        )}
      </div>
      <div>
        <img src={statistic.image} alt="" className="w-16 h-16" />
      </div>
    </motion.div>
  );
}

export default StatisticItem;
