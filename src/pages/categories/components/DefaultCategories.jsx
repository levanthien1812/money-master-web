import React from "react";
import DefaultCategoryList from "./DefaultCategoryList";
import Loading from "../../../components/others/Loading";
import { CATEGORY_TYPES } from "../../../config/constants";
import { useTranslation } from "react-i18next";

function DefaultCategories({ categories, loading, onUpdateSuccess }) {
  const { t } = useTranslation();

  return (
    <div className="lg:border-r lg:border-r-purple-400 py-3 lg:w-3/5 w-full">
      <div className="mb-4 border-l-8 border-l-purple-500 ps-4 py-1 bg-purple-200 rounded-lg">
        <h3 className="text-2xl">{t("category.default_categories")}</h3>
      </div>

      <div className="mb-3">
        <h4 className="text-xl font-bold text-purple-500">
          {t("category.expenses")}
        </h4>

        {loading && <Loading />}
        {!loading && (
          <DefaultCategoryList
            categories={categories.filter(
              (category) => category.type === CATEGORY_TYPES.EXPENSES
            )}
            onUpdateSuccess={onUpdateSuccess}
          />
        )}
      </div>
      <div>
        <h4 className="text-xl font-bold text-purple-500">
          {t("category.incomes")}
        </h4>

        {loading && <Loading />}
        {!loading && (
          <DefaultCategoryList
            categories={categories.filter(
              (category) => category.type === CATEGORY_TYPES.INCOMES
            )}
            onUpdateSuccess={onUpdateSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default DefaultCategories;
