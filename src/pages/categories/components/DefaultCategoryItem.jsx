import { motion } from "framer-motion";
import React, { useState } from "react";
import AddCategoryPlan from "../../plans/components/AddCategoryPlan";
import AdjustBudget from "../../plans/components/AdjustBudget";
import { CATEGORY_TYPES } from "../../../config/constants";

function DefaultCategoryItem({ category, onUpdateSuccess }) {
  const [isHover, setIsHover] = useState(false);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [isAdjustingPlan, setIsAdjustingPlan] = useState(false);

  return (
    <>
      <div
        className="flex flex-col justify-start items-center p-3 rounded-xl hover:bg-white hover:shadow-blue-200 hover:shadow-xl relative"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="w-24 h-24 shadow-sm mb-2 relative">
          <img
            src={category.image}
            alt=""
            className="object-cover w-full h-full rounded-md"
          />
          {category.plan && (
            <div className="absolute w-3 h-3 bg-purple-400 rounded-full -right-1 -top-1"></div>
          )}
        </div>
        <p className="font-semibold text-sm text-center">{category.name}</p>
        {isHover && category.type === CATEGORY_TYPES.EXPENSES && (
          <motion.div
            className="absolute -bottom-6 z-10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              type: "spring",
            }}
          >
            <button
              className="bg-blue-600 text-white py-1 px-4 rounded-xl shadow-sm shadow-blue-300 text-sm"
              onClick={() => {
                !category.plan
                  ? setIsAddingPlan(true)
                  : setIsAdjustingPlan(true);
                setIsHover(false);
              }}
            >
              {!category.plan
                ? "Set plan this month"
                : "Adjust plan this month"}
            </button>
          </motion.div>
        )}
      </div>
      {isAddingPlan && (
        <AddCategoryPlan
          _month={new Date().getMonth() + 1}
          _year={new Date().getFullYear()}
          onClose={() => setIsAddingPlan(false)}
          category={category}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
      {isAdjustingPlan && (
        <AdjustBudget
          plan={category.plan}
          onClose={() => setIsAdjustingPlan(false)}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
    </>
  );
}

export default DefaultCategoryItem;
