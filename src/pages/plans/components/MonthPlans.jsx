import React, { useEffect, useState } from "react";
import AddMonthPlan from "./AddMonthPlan";
import PlansService from "../../../services/plans";
import MonthPlanItem from "./MonthPlanItem";
import Select from "../../../components/elements/Select";
import Loading from "../../../components/others/Loading";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function MonthPlans({ onSeeCategoryPlans }) {
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [year, setYear] = useState();
  const [years, setYears] = useState();
  const [loading, setLoading] = useState(false);
  const walletChosen = useSelector((state) => state.wallet.walletChosen);
  const [plans, setPlans] = useState(null);
  const [loadingYears, setLoadingYears] = useState(false);

  const getYearsBetween = async () => {
    try {
      setLoadingYears(true);
      const responseData = await PlansService.getMonthPlansYears({
        wallet_id: walletChosen?.id,
      });

      if (responseData.status === "success") {
        console.log(responseData);

        const yearsBetween = responseData.data.years.map((y) => {
          return { id: y, name: y };
        });

        setYears(yearsBetween);

        const currentYear = yearsBetween.find(
          (y) => y.id === new Date().getFullYear()
        );

        setYear(currentYear || yearsBetween[0]);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoadingYears(false);
  };

  const getMonthPlans = async () => {
    try {
      setLoading(true);
      const responseData = await PlansService.getMonthPlans({
        year: year.id,
        wallet_id: walletChosen?.id,
        with_report: true,
      });

      setPlans(responseData.data.plans);
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (year && walletChosen) {
      getMonthPlans();
    }
  }, [year, walletChosen]);

  useEffect(() => {
    setLoadingYears(true);
    setLoading(true);
    if (walletChosen) getYearsBetween();
  }, [walletChosen]);

  return (
    <div>
      <div className="mb-3 flex justify-end items-start gap-2">
        <div className="w-32">
          <Select
            selected={year}
            setSelected={setYear}
            data={years}
            loading={loadingYears}
          />
        </div>
        <button
          className="rounded-lg bg-purple-600 text-white px-6 py-1.5 hover:bg-purple-700"
          onClick={() => setIsAddingPlan(true)}
        >
          Create plan
        </button>
      </div>
      <div>
        {loading && <Loading />}
        {!loading &&
          plans &&
          plans.length > 0 &&
          plans.map((monthPlan) => (
            <MonthPlanItem
              monthPlan={monthPlan}
              key={monthPlan.id}
              onUpdateSuccess={() => {
                getYearsBetween();
                getMonthPlans();
              }}
              onSeeCategoryPlans={onSeeCategoryPlans}
            />
          ))}
        {!loading && plans && plans.length === 0 && (
          <p className="text-2xl text-center text-gray-600 py-4">
            No plan has been set in the period!
          </p>
        )}
      </div>

      {isAddingPlan && (
        <AddMonthPlan
          onClose={() => setIsAddingPlan(false)}
          onAddingSuccess={() => {
            getYearsBetween();
            getMonthPlans();
          }}
        />
      )}
    </div>
  );
}

export default MonthPlans;
