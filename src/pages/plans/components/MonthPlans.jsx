import React, { useEffect, useState } from "react";
import AddMonthPlan from "./AddMonthPlan";
import PlansService from "../../../services/plans";
import MonthPlanItem from "./MonthPlanItem";
import Select from "../../../components/elements/Select";
import Loading from "../../../components/others/Loading";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { GetMonthPlansQuery, GetMonthPlansYears } from "../../../queries/plans";
import Button from "../../../components/elements/Button";

function MonthPlans({ onSeeCategoryPlans }) {
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [year, setYear] = useState();
  const walletChosen = useSelector((state) => state.wallet.walletChosen);

  const { t } = useTranslation();

  const { years, loadingYears, refetchYears } = GetMonthPlansYears({
    wallet_id: walletChosen?.id,
  });

  const { plans, loadingPlans, refetchPlans } = GetMonthPlansQuery({
    year: year?.id,
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
    if (year && walletChosen) {
      refetchPlans();
    }
  }, [year, walletChosen]);

  return (
    <div>
      <div className="mb-3 flex justify-between items-center gap-2">
        <div className="w-32">
          <Select
            selected={year}
            setSelected={setYear}
            data={years}
            loading={loadingYears}
          />
        </div>
        <Button onClick={() => setIsAddingPlan(true)} >
          {t("plan.create_plan")}
        </Button>
      </div>
      <div>
        {loadingPlans && <Loading />}
        {!loadingPlans &&
          plans &&
          plans.length > 0 &&
          plans.map((monthPlan) => (
            <MonthPlanItem
              monthPlan={monthPlan}
              key={monthPlan.id}
              onUpdateSuccess={() => {
                refetchYears();
                refetchPlans();
              }}
              onSeeCategoryPlans={onSeeCategoryPlans}
            />
          ))}
        {!loadingPlans && plans && plans.length === 0 && (
          <p className="text-2xl text-center text-gray-600 py-4">
            {t("plan.no_plans")}
          </p>
        )}
      </div>

      {isAddingPlan && (
        <AddMonthPlan
          onClose={() => setIsAddingPlan(false)}
          onAddingSuccess={() => {
            refetchYears();
            refetchPlans();
          }}
        />
      )}
    </div>
  );
}

export default MonthPlans;
