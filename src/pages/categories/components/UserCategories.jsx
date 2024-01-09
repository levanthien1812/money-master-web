import React from "react";
import UserCategoryList from "./UserCategoryList";
import Loading from "../../../components/others/Loading";
import { CATEGORY_TYPES } from "../../../config/constants";
import { useTranslation } from "react-i18next";

function UserCategories({ categories, onUpdateSuccess, loading }) {
  const { t } = useTranslation();

  return (
    <div className="lg:w-2/5 w-full py-3">
      <div className="mb-4 border-l-8 border-l-blue-500 ps-4 py-1 bg-blue-200 rounded-lg">
        <h3 className="text-2xl">{t("category.your_categories")}</h3>
      </div>

      <div className="mb-3">
        <h4 className="text-xl font-bold text-blue-500">
          {t("category.expenses")}
        </h4>

        {loading && <Loading />}
        {!loading &&
          categories.filter(
            (category) => category.type === CATEGORY_TYPES.EXPENSES
          ).length > 0 && (
            <UserCategoryList
              categories={categories.filter(
                (category) => category.type === CATEGORY_TYPES.EXPENSES
              )}
              onUpdateSuccess={onUpdateSuccess}
            />
          )}
        {!loading &&
          categories.filter(
            (category) => category.type === CATEGORY_TYPES.EXPENSES
          ).length === 0 && (
            <p className="text-md text-gray-600 text-center py-3">
              {t("category.no_categories")}
            </p>
          )}
      </div>
      <div>
        <h4 className="text-xl font-bold text-blue-500">
          {t("category.incomes")}
        </h4>

        {loading && <Loading />}
        {!loading &&
          categories.filter(
            (category) => category.type === CATEGORY_TYPES.INCOMES
          ).length > 0 && (
            <UserCategoryList
              categories={categories.filter(
                (category) => category.type === CATEGORY_TYPES.INCOMES
              )}
              onUpdateSuccess={onUpdateSuccess}
            />
          )}
        {!loading &&
          categories.filter(
            (category) => category.type === CATEGORY_TYPES.INCOMES
          ).length === 0 && (
            <p className="text-md text-gray-600 text-center py-3">
              {t("category.no_categories")}
            </p>
          )}
      </div>
    </div>
  );
}

export default UserCategories;
