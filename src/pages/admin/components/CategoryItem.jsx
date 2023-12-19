import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import AddCategories from "../../categories/components/AddCategories";
import ConfirmDeleteModal from "../../../components/modal/ConfirmDeleteModal";
import CategoriesService from "../../../services/categories";
import { toast } from "react-toastify";
import { CATEGORY_TYPES } from "../../../config/constants";

function CategoryItem({ category, onUpdateSuccess }) {
  const [isHover, setIsHover] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const handleDeleteCategory = async () => {
    try {
      const responseData = await CategoriesService.deleteDefaultCategory(
        category.id
      );

      if (responseData.status === "success") {
        setIsConfirmDelete(false);
        onUpdateSuccess("delete");
      } else {
        toast.error(responseData.error);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    // Set a timeout to show the child after 0.2 seconds
    timeoutRef.current = setTimeout(() => {
      setIsHover(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsHover(false);
  };

  return (
    <>
      <motion.div
        key={Math.random()}
        className="flex gap-4 py-3 px-5 rounded-md shadow-md items-center justify-between bg-white hover:bg-blue-200 cursor-pointer relative overflow-hidden"
        whileHover={{
          scale: 1.05,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center shadow-sm shrink-0">
          <img
            src={category.image}
            alt=""
            className="object-cover w-full h-full"
          />
        </div>
        <div className="grow">
          <div className="flex justify-end mb-1">
            <p
              className={`uppercase text-xs px-2 rounded-full text-white ${
                category.type === CATEGORY_TYPES.EXPENSES
                  ? "bg-orange-600"
                  : "bg-green-600"
              }`}
            >
              {category.type === CATEGORY_TYPES.EXPENSES ? "Expense" : "Income"}
            </p>
          </div>

          <p className="text-right text-md uppercase font-bold tracking-wide">
            {category.name}
          </p>

          <div className="my-1 bg-gray-300" style={{ height: 1 }}></div>
          <p className="text-right text-sm">
            Transactions count:{" "}
            <span className="font-bold text-blue-600">
              {category.transactions_count}
            </span>
          </p>
          <p className="text-right text-sm">
            Users count:{" "}
            <span className="font-bold text-blue-600">
              {category.users_count}
            </span>
          </p>
        </div>
        {isHover && (
          <div className="absolute bottom-0 left-0 flex justify-center gap-2 w-full py-2 items-end h-full bg-gradient-to-t from-white to-transparent">
            <motion.button
              className="py-1 px-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl w-1/3 text-sm"
              onClick={() => {
                setIsHover(false);
                setIsUpdating(true);
              }}
              initial={{ scaleY: 0, translateY: 10, opacity: 0 }}
              animate={{ scaleY: 1, translateY: 0, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              Update
            </motion.button>
            <motion.button
              className="py-1 px-2 bg-red-500 hover:bg-red-600 text-white rounded-xl w-1/3 text-sm"
              onClick={() => {
                setIsHover(false);
                setIsConfirmDelete(true);
              }}
              initial={{ scaleY: 0, translateY: 10, opacity: 0 }}
              animate={{ scaleY: 1, translateY: 0, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              Delete
            </motion.button>
          </div>
        )}
      </motion.div>
      {isUpdating && (
        <AddCategories
          onClose={() => setIsUpdating(false)}
          onAddSuccess={() => onUpdateSuccess("update")}
          category={category}
        />
      )}
      {isConfirmDelete && (
        <ConfirmDeleteModal
          message={
            "Are you sure to delete this default category? This action can not be undone."
          }
          onClose={() => setIsConfirmDelete(false)}
          onAccept={handleDeleteCategory}
        />
      )}
    </>
  );
}

export default CategoryItem;
