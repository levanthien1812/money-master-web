import React, { useState } from "react";
import CategoryPlans from "./components/CategoryPlans";
import MonthPlans from "./components/MonthPlans";
import SelectWallet from "../wallets/components/SelectWallet";
import logo from "../../assets/images/logo-money-master.png";
import { useTranslation } from "react-i18next";

function PlansPage() {
  const [viewBy, setViewBy] = useState("months");
  const [monthGiven, setMonthGiven] = useState(null);
  const [yearGiven, setYearGiven] = useState(null);
  const [monthPlans, setMonthPlans] = useState(null);
  const [categoryPlans, setCategoryPlans] = useState(null);

  const { t } = useTranslation();

  const btnStyle = (vb) => {
    if (viewBy === vb) return "bg-purple-600 text-white font-bold";
    else return "text-purple-600 bg-purple-200  hover:bg-purple-200";
  };

  const handleSeeCategoryPlans = (month, year) => {
    setMonthGiven(month);
    setYearGiven(year);

    setViewBy("categories");
  };

  const handleClickByCategoryPlans = () => {
    setMonthGiven(null);
    setYearGiven(null);

    setViewBy("categories");
  };

  return (
    <div className="lg:p-8 sm:p-14 p-3">
      <div className="flex gap-4 items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="lg:w-16 lg:h-16 w-10 h-10">
            <img src={logo} alt="" className="w-full h-full object-cover" />
          </div>
          <h2 className="sm:text-4xl text-3xl">{t("plan.plans")}</h2>
        </div>

        <div className="w-40">
          <SelectWallet />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="xl:w-3/5 sm:w-full lg:w-4/5 w-full">
          <div className="mb-4 flex justify-center w-full p-2 bg-purple-200 rounded-xl gap-2">
            <button
              className={
                "py-2 w-1/2 rounded-xl hover:font-bold " + btnStyle("months")
              }
              onClick={() => setViewBy("months")}
            >
              {t("plan.by_month")}
            </button>
            <button
              className={
                "py-2 w-1/2 rounded-xl hover:font-bold " +
                btnStyle("categories")
              }
              onClick={handleClickByCategoryPlans}
            >
              {t("plan.by_categories")}
            </button>
          </div>
          <div className="">
            {viewBy === "months" && (
              <MonthPlans
                onSeeCategoryPlans={handleSeeCategoryPlans}
                plans={monthPlans}
                setPlans={setMonthPlans}
              />
            )}
            {viewBy === "categories" && (
              <CategoryPlans
                _month={monthGiven}
                _year={yearGiven}
                plans={categoryPlans}
                setPlans={setCategoryPlans}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlansPage;
