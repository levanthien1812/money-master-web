import React, { useEffect, useState } from "react";
import CategoryPlanItem from "./CategoryPlanItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import AddCategoryPlan from "./AddCategoryPlan";
import PlansService from "../../../services/plans";
import Select from "../../../components/elements/Select";
import monthsGetter from "../../../utils/monthsGetter";
import Loading from "../../../components/others/Loading";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  GetCategoryPlansQuery,
  GetCategoryPlansYears,
} from "../../../queries/plans";
import Button from "../../../components/elements/Button";

function CategoryPlans({ _month }) {
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [month, setMonth] = useState(
    _month
      ? monthsGetter().find((month) => month.id + 1 === _month)
      : monthsGetter().find((month) => month.id === new Date().getMonth())
  );
  const [year, setYear] = useState();
  const walletChosen = useSelector((state) => state.wallet.walletChosen);

  const { t } = useTranslation();

  const { years, loadingYears, refetchYears } = GetCategoryPlansYears({
    wallet_id: walletChosen?.id,
  });

  const { plans, loadingPlans, plansRefetch } = GetCategoryPlansQuery({
    year: year?.id,
    month: month?.id + 1,
    wallet_id: walletChosen?.id,
    with_report: true,
  });

  useEffect(() => {
    if (walletChosen) refetchYears();
    if (years && years.length > 0) {
      const currentYear =
        years.find((y) => y.id === new Date().getFullYear()) || years[0];
      setYear(currentYear);
    } else {
      setYear({ id: 2024, name: 2024 });
    }
  }, [walletChosen]);

  useEffect(() => {
    if (year && month && walletChosen) plansRefetch();
  }, [year, month, walletChosen]);

  return (
    <div>
      <div className="flex lg:justify-end justify-center sm:gap-3 gap-2">
        <div className="lg:w-1/6 sm:w-1/3 w-1/2">
          <Select
            selected={month}
            setSelected={setMonth}
            data={monthsGetter()}
          />
        </div>
        <div className="lg:w-1/6 sm:w-1/3 w-1/2">
          <Select
            selected={year}
            setSelected={setYear}
            data={years}
            loading={loadingYears}
          />
        </div>
      </div>
      <div className="border-2 border-purple-400 rounded-3xl sm:p-6 p-3 bg-white shadow-xl shadow-purple-200">
        <div className="mb-4">
          {!loadingPlans && year && (
            <div className="md:bg-gradient-to-br md:from-purple-700 md:to-purple-400 md:px-6 md:py-1 md:rounded-r-full md:w-fit md:relative md:-left-6 md:shadow-lg">
              <p className="text-3xl uppercase md:text-white text-purple-500">
                {month.name + " " + year.name}
              </p>
            </div>
          )}
        </div>
        <div className="mb-3">
          {loadingPlans && <Loading />}
          {!loadingPlans &&
            plans &&
            plans.length > 0 &&
            plans.map((categoryPlan) => (
              <CategoryPlanItem
                categoryPlan={categoryPlan}
                key={categoryPlan.id}
                onUpdateSuccess={() => {
                  refetchYears();
                  plansRefetch();
                }}
              />
            ))}
          {!loadingPlans && plans && plans.length === 0 && (
            <p className="text-lg">{t("plan.no_category_plans")}</p>
          )}
        </div>
        <div className="flex lg:justify-end justify-center">
          <Button onClick={() => setIsAddingPlan(true)}>
            {t("plan.add_new")}
          </Button>
        </div>
      </div>
      {isAddingPlan && (
        <AddCategoryPlan
          onClose={() => setIsAddingPlan(false)}
          onUpdateSuccess={() => {
            refetchYears();
            plansRefetch();
          }}
          _month={month.id + 1}
          _year={year.id}
        />
      )}
    </div>
  );
}

export default CategoryPlans;
