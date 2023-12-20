import React, { useEffect, useState } from "react";
import CategoriesService from "../../services/categories";
import Input from "../../components/elements/Input";
import Loading from "../../components/others/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddCategories from "../categories/components/AddCategories";
import CategoryItem from "./components/CategoryItem";
import { toast } from "react-toastify";
import { CATEGORY_TYPES } from "../../config/constants";
import logo from "../../assets/images/logo-money-master.png";

function DefaultCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [type, setType] = useState(null);
  const [sortBy, setSortBy] = useState("name");

  const getDefaultCategory = async () => {
    try {
      let params = {};
      if (search.length > 0) {
        params = { ...params, search };
      }
      if (type) {
        params = { ...params, type };
      }

      setLoading(true);
      const responseData = await CategoriesService.getDefaultCategories(params);
      setLoading(false);

      setCategories(responseData.data.categories);
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    getDefaultCategory();
  }, [search, type]);

  useEffect(() => {
    setCategories((prev) => {
      let sortedCategories = [...prev];
      sortedCategories.sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "transactions")
          return b.transactions_count - a.transactions_count;
        return b.users_count - a.users_count;
      });
      console.log(sortedCategories);
      return sortedCategories;
    });
  }, [sortBy]);

  const handleAddSuccess = (action) => {
    toast.success(`Category ${action} successfully`);
    setIsAddingCategory(false);
    getDefaultCategory();
  };

  return (
    <div className="lg:p-8 sm:p-14 p-3">
      <div className="flex gap-4 items-center lg:justify-between justify-center lg:flex-row flex-col">
        <div className="flex gap-4 items-center">
          <div className="lg:w-16 lg:h-16 w-10 h-10">
            <img src={logo} alt="" className="w-full h-full object-cover" />
          </div>
          <h2 className="sm:text-4xl text-3xl">Default categories</h2>
        </div>
        <div className="sm:w-72 w-full">
          <Input
            name={"search"}
            placeholder="Search"
            type={"text"}
            size="small"
            mb="mb-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="lg:mt-8 mt-4">
        {loading && <Loading />}
        {!loading && categories.length > 0 && (
          <>
            <div className="flex justify-between lg:flex-row flex-col">
              <div className="flex justify-end gap-2 mb-3 items-center">
                <p className="uppercase text-sm">Sort by: </p>
                <button
                  className={
                    `uppercase text-sm px-4 py-1.5 rounded-full border border-blue-500 ` +
                    (sortBy === "name"
                      ? "bg-blue-500 text-white"
                      : " bg-gray-200 ")
                  }
                  onClick={() => setSortBy("name")}
                >
                  Name
                </button>
                <button
                  className={
                    `uppercase text-sm px-4 py-1.5 rounded-full border border-blue-500 ` +
                    (sortBy === "transactions"
                      ? "bg-blue-500 text-white"
                      : " bg-gray-200 ")
                  }
                  onClick={() => setSortBy("transactions")}
                >
                  Transactions count
                </button>
                <button
                  className={
                    `uppercase text-sm px-4 py-1.5 rounded-full border border-blue-500 ` +
                    (sortBy === "users"
                      ? "bg-blue-500 text-white"
                      : " bg-gray-200 ")
                  }
                  onClick={() => setSortBy("users")}
                >
                  Users count
                </button>
              </div>
              <div className="flex lg:justify-end justify-start items-center gap-2 mb-3">
                <p className="uppercase text-sm">Type: </p>
                <button
                  className={
                    `uppercase text-sm px-4 py-1.5 rounded-full border border-gray-500 ` +
                    (type === null ? "bg-gray-500 text-white" : " bg-gray-200 ")
                  }
                  onClick={() => setType(null)}
                >
                  All
                </button>
                <button
                  className={
                    `uppercase text-sm px-4 py-1.5 rounded-full border border-orange-500 ` +
                    (type === CATEGORY_TYPES.EXPENSES
                      ? "bg-orange-500 text-white"
                      : " bg-gray-200 ")
                  }
                  onClick={() => setType(CATEGORY_TYPES.EXPENSES)}
                >
                  Expenses
                </button>
                <button
                  className={
                    `uppercase text-sm px-4 py-1.5 rounded-full border border-green-500 ` +
                    (type === CATEGORY_TYPES.INCOMES
                      ? "bg-green-500 text-white"
                      : " bg-gray-200 ")
                  }
                  onClick={() => setType(CATEGORY_TYPES.INCOMES)}
                >
                  Incomes
                </button>
              </div>
            </div>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 auto-rows-fr">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onUpdateSuccess={handleAddSuccess}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {!loading && categories.length === 0 && (
        <p className="text-center text-gray-500 text-xl">
          No default category has been added!
        </p>
      )}
      <div className="mt-4 flex justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          onClick={() => setIsAddingCategory(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Add default category
        </button>
      </div>
      {isAddingCategory && (
        <AddCategories
          onClose={() => setIsAddingCategory(false)}
          onAddSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}

export default DefaultCategoriesPage;
