import React, { useEffect, useState } from "react";
import formatCurrency from "../../../utils/currencyFormatter";
import { motion } from "framer-motion";
import ConfirmDeleteModal from "../../../components/modal/ConfirmDeleteModal";
import PlansService from "../../../services/plans";
import { toast } from "react-toastify";
import AdjustBudget from "./AdjustBudget";
import { t } from "i18next";

function CategoryPlanItem({ categoryPlan, onUpdateSuccess }) {
  const [isHovering, setIsHovering] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSavingDelete, setIsSavingDelete] = useState(false);

  useEffect(() => {
    if (categoryPlan.actual) {
      setPercentage((categoryPlan.actual / categoryPlan.amount) * 100);
    }
  }, [categoryPlan]);

  const handleClickDelete = () => {
    setIsDeleting(true);
    setIsHovering(false);
  };

  const handleClickUpdate = () => {
    setIsUpdating(true);
    setIsHovering(false);
  };

  const handleDelete = async () => {
    try {
      setIsSavingDelete(true);
      const responseData = await PlansService.deleteCategoryPlan(
        categoryPlan.id
      );

      if (responseData.status === "success") {
        setIsDeleting(false);
        toast.success(t("plan.delete_cplan_success"));
        onUpdateSuccess();
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setIsSavingDelete(false);
  };

  return (
    <>
      <div
        className="flex gap-3 items-center mb-1 py-1 sm:px-4 px-0 rounded-xl hover:bg-purple-200 hover:bg-opacity-80 relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={categoryPlan.category.image}
            alt=""
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-1/4 overflow-hidden">
          <p className={isHovering ? "font-bold" : ""}>
            {categoryPlan.category.name}
          </p>
        </div>
        <div className="h-2 bg-purple-50 rounded-full grow shadow-sm overflow-hidden">
          <div
            className={
              "h-full rounded-full " +
              (percentage > 100
                ? "bg-red-600"
                : percentage > 50
                ? "bg-purple-600"
                : "bg-purple-400")
            }
            style={{
              width: (percentage > 100 ? 100 : Math.round(percentage)) + "%",
            }}
          ></div>
        </div>
        <div className="w-10">
          <p
            className={`text-lg ${
              percentage <= 100 ? "text-purple-600" : "text-red-600"
            } font-bold`}
          >
            {Math.round(percentage) + "%"}
          </p>
        </div>
        {isHovering && (
          <motion.div
            initial={{ translateY: 0, opacity: 0 }}
            animate={{ translateY: 10, opacity: 1 }}
            transition={{ type: "spring" }}
            className="absolute bg-white px-6 py-3 rounded-xl bottom-12 sm:right-36 right-16 shadow-md w-60"
          >
            <div className="flex justify-between mb-1">
              <p>{t("plan.plan")}: </p>
              <p className="font-bold">
                {formatCurrency(categoryPlan.amount)}
              </p>{" "}
            </div>
            <div className="flex justify-between mb-1">
              <p>{t("plan.actual")}: </p>

              <p className="font-bold">{formatCurrency(categoryPlan.actual)}</p>
            </div>
            <hr className="h-0.5 bg-gray-300 mb-2" />
            {percentage <= 100 && (
              <div className="flex justify-between mb-1">
                <p>{t("plan.remaining")}: </p>

                <p className="font-bold text-purple-600">
                  {formatCurrency(categoryPlan.amount - categoryPlan.actual)}
                </p>
              </div>
            )}
            {percentage > 100 && (
              <div className="flex justify-between mb-1">
                <p>{t("plan.overspend")}: </p>

                <p className="font-bold text-red-600">
                  {formatCurrency(
                    (categoryPlan.amount - categoryPlan.actual) * -1
                  )}
                </p>
              </div>
            )}
            <div className="flex gap-1">
              <motion.button
                className="py-1 px-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md w-1/2 text-sm"
                onClick={handleClickUpdate}
                initial={{ scaleY: 0, translateY: 10, opacity: 0 }}
                animate={{ scaleY: 1, translateY: 0, opacity: 1 }}
                transition={{ type: "spring" }}
              >
                Update
              </motion.button>
              <motion.button
                className="2y-1 px-2 bg-red-500 hover:bg-red-600 text-white rounded-md w-1/2 text-sm"
                onClick={handleClickDelete}
                initial={{ scaleY: 0, translateY: 10, opacity: 0 }}
                animate={{ scaleY: 1, translateY: 0, opacity: 1 }}
                transition={{ type: "spring" }}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
      {isDeleting && (
        <ConfirmDeleteModal
          message={t("warning.delete_cplan")}
          onAccept={handleDelete}
          onClose={() => setIsDeleting(false)}
          processing={isSavingDelete}
        />
      )}
      {isUpdating && (
        <AdjustBudget
          plan={categoryPlan}
          onClose={() => setIsUpdating(false)}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
    </>
  );
}

export default CategoryPlanItem;
