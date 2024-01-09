import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import React, { useState } from "react";
import IconButton from "../../../components/elements/IconButton";
import AddCategories from "./AddCategories";
import ConfirmDeleteModal from "../../../components/modal/ConfirmDeleteModal";
import CategoriesService from "../../../services/categories";
import AddCategoryPlan from "../../plans/components/AddCategoryPlan";
import AdjustBudget from "../../plans/components/AdjustBudget";
import { toast } from "react-toastify";
import { CATEGORY_TYPES } from "../../../config/constants";
import { useTranslation } from "react-i18next";

function UserCategoryItem({ category, onUpdateSuccess }) {
  const [isHover, setIsHover] = useState(false);
  const [isUpdatingCategory, setisUpdatingCategory] = useState(false);
  const [isDeletingCategory, setisDeletingCategory] = useState(false);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [isAdjustingPlan, setIsAdjustingPlan] = useState(false);
  const [isSavingDelete, setIsSavingDelete] = useState(false);
  const { t } = useTranslation();

  const handleDeleteCategory = async () => {
    try {
      setIsSavingDelete(true);
      const data = await CategoriesService.deleteCategory(category.id);
      if (data.status === "success") {
        setisDeletingCategory(false);
        onUpdateSuccess("delete", false);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setIsSavingDelete(false);
  };

  return (
    <div
      className="mb-2 p-2 bg-blue-200 rounded-xl bg-gradient-to-r from-blue-300 to-white flex gap-3"
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="w-16 h-16 shadow-sm relative">
        <img
          src={category.image}
          alt=""
          className="object-cover w-full h-full rounded-md"
        />
        {category.plan && (
          <div className="absolute w-3 h-3 bg-purple-400 rounded-full -right-1 -top-1"></div>
        )}
      </div>
      <div className="flex items-center">
        <p className="text-md font-semibold">{category.name}</p>
      </div>

      <div className="flex justify-end grow items-center gap-1">
        {isHover && category.type === CATEGORY_TYPES.EXPENSES && (
          <motion.div
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
                ? t("category.set_plan")
                : t("category.adjust_plan")}
            </button>
          </motion.div>
        )}
        <IconButton
          icon={faPen}
          onClick={() => {
            setisUpdatingCategory(true);
            setIsHover(false);
          }}
        />
        <IconButton
          icon={faTrash}
          onClick={() => {
            setisDeletingCategory(true);
            setIsHover(false);
          }}
        />
      </div>

      {isUpdatingCategory && (
        <AddCategories
          onClose={() => setisUpdatingCategory(false)}
          onAddSuccess={onUpdateSuccess}
          category={category}
        />
      )}
      {isDeletingCategory && (
        <ConfirmDeleteModal
          message={t("warning.delete_category")}
          onAccept={handleDeleteCategory}
          onClose={() => setisDeletingCategory(false)}
          processing={isSavingDelete}
        />
      )}
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
    </div>
  );
}

export default UserCategoryItem;
