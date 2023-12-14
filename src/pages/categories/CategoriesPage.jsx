import React, { useEffect, useState } from "react";
import CategoriesService from "../../services/categories";
import DefaultCategories from "./components/DefaultCategories";
import UserCategories from "./components/UserCategories";
import AddCategories from "./components/AddCategories";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function CategoriesPage() {
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [isAddingCategory, setisAddingCategory] = useState(false);
  const [loadingDefault, setLoadingDefault] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const walletChosen = useSelector((state) => state.wallet.walletChosen);

  const getCategories = async (isDefault = true) => {
    try {
      const data = await CategoriesService.getCategories({
        default: isDefault,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        wallet_id: walletChosen.id,
        with_plan: true,
      });

      isDefault
        ? setDefaultCategories(data.data.categories)
        : setUserCategories(data.data.categories);
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const getAllCategories = async () => {
    setLoadingDefault(true);
    setLoadingUser(true);

    await getCategories(true);
    setLoadingDefault(false);

    await getCategories(false);
    setLoadingUser(false);
  };

  useEffect(() => {
    setLoadingDefault(true);
    setLoadingUser(true);
    if (walletChosen) {
      getAllCategories();
    }
  }, [walletChosen]);

  const handleUpdateSuccess = async (action) => {
    setisAddingCategory(false);
    getAllCategories();

    if (action) {
      toast.success("Category is " + action + "d successfully");
    }
  };

  return (
    <div className="lg:p-8 sm:p-14 p-3">
      {/* Header */}
      <div className="sm:mb-8 mb-4 flex justify-between items-center">
        <div className="flex gap-4">
          <h2 className="sm:text-4xl text-3xl">Categories</h2>
        </div>
        <div
          className="flex border-2 border-purple-500 rounded-2xl relative"
          id="add-transactions-container"
        >
          <button
            className="sm:py-2 sm:px-8 py-1 px-2 text-center rounded-xl font-semibold bg-purple-500 text-white hover:bg-purple-600"
            id="add-expense-btn"
            onClick={() => setisAddingCategory(true)}
          >
            Create new category
          </button>
        </div>
      </div>

      <div className="flex gap-8 lg:flex-row flex-col">
        {/* DEFAULT CATEGORIES */}
        <DefaultCategories
          categories={defaultCategories}
          loading={loadingDefault}
          onUpdateSuccess={handleUpdateSuccess}
        />

        {/* USER'S CATEGORIES */}
        {userCategories && (
          <UserCategories
            categories={userCategories}
            onUpdateSuccess={handleUpdateSuccess}
            loading={loadingUser}
          />
        )}
      </div>

      {isAddingCategory && (
        <AddCategories
          onClose={() => setisAddingCategory(false)}
          onAddSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}

export default CategoriesPage;
