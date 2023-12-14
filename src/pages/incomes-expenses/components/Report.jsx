import {
  faChevronLeft,
  faChevronRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useMemo, useState } from "react";
import formatCurrency from "../../../utils/currencyFormatter";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlansService from "../../../services/plans";
import AddMonthPlan from "../../plans/components/AddMonthPlan";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Loading from "../../../components/others/Loading";
import getMonthName from "../../../utils/getMonthName";
import { toast } from "react-toastify";
import { CATEGORY_TYPES } from "../../../config/constants";

function Report({
  month,
  year,
  decreaseMonth,
  increaseMonth,
  report,
  loading,
}) {
  const [plan, setPlan] = useState();
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const walletChosen = useSelector((state) => state.wallet.walletChosen);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const navigate = useNavigate();

  const getPlan = async () => {
    try {
      setLoadingPlan(true);
      const responseData = await PlansService.getMonthPlans({
        month,
        year,
        wallet_id: walletChosen?.id,
        with_report: true,
      });

      if (responseData.status === "success") {
        if (responseData.data.plans.length > 0)
          setPlan(responseData.data.plans[0]);
        else setPlan(null);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoadingPlan(false);
  };

  useEffect(() => {
    if (walletChosen) getPlan();
  }, [month, year, walletChosen]);

  let percentageReport = useMemo(() => {
    if (report) {
      if (report[CATEGORY_TYPES.INCOMES] === 0) return 100;
      return Math.round(
        (report[CATEGORY_TYPES.EXPENSES] / report[CATEGORY_TYPES.INCOMES]) * 100
      );
    }
  }, [report]);

  let percentagePlan = useMemo(() => {
    if (report && plan)
      return Math.round((report[CATEGORY_TYPES.EXPENSES] / plan.amount) * 100);
  }, [report, plan]);

  const handleClickViewReport = () => {
    navigate("/reports", { state: { month, year } });
  };

  return (
    <div
      className="lg:w-5/12 w-full rounded-2xl sm:px-6 px-3 bg-white py-6 shadow-lg"
      style={{ minHeight: 300 }}
    >
      <div className="flex justify-between items-center mb-4 ">
        <button
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-purple-200 active:bg-purple-300"
          onClick={decreaseMonth}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="gap-3 flex items-center justify-center">
          <FontAwesomeIcon
            icon={faStar}
            className="text-gray-500 hidden sm:block lg:hidden xl:block"
          />
          <div
            className="text-center text-xl font-bold uppercase bg-purple-500 text-white px-4 py-1 rounded-full"
            id="monthYear"
          >
            {getMonthName(month - 1) + " " + year}
          </div>
          <FontAwesomeIcon
            icon={faStar}
            className="text-gray-500 hidden sm:block lg:hidden xl:block"
          />
        </div>
        <button
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-purple-200 active:bg-purple-300"
          onClick={increaseMonth}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {loading && <Loading />}

      {!loading && report && (
        <>
          <div className="mb-8 py-2 sm:px-4 px-0 rounded-xl flex gap-1 flex-row lg:flex-col xl:flex-row">
            <div className="bg-white sm:py-2 py-1 sm:px-4 px-2 rounded-xl w-1/2 xl:w-1/2 sm:w-full text-center shadow-lg">
              <p className="text-md uppercase mb-1">Total incomes:</p>
              <p className="text-2xl font-semibold text-green-500">
                {formatCurrency(report[CATEGORY_TYPES.INCOMES])}
              </p>
            </div>
            <div className="bg-white py-1 px-2 sm:py-2 sm:px-4  rounded-xl w-1/2 xl:w-1/2 sm:w-full text-center shadow-lg">
              <p className="text-md uppercase mb-1">Total expenses:</p>
              <p className="text-2xl font-semibold text-orange-500">
                {"-" + formatCurrency(report[CATEGORY_TYPES.EXPENSES])}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-72 mb-4">
              <CircularProgressbarWithChildren
                value={percentageReport}
                counterClockwise={true}
                styles={buildStyles({
                  pathColor: "#F97315",
                  trailColor: "#11111111",
                  pathTransitionDuration: 0.5,
                  strokeLinecap: "round",
                })}
              >
                <div className="w-32 h-32 rounded-xl overflow-hidden mb-2">
                  <img
                    className="object-cover w-full h-full"
                    src={walletChosen?.image}
                    alt=""
                  />
                </div>

                <p className="text-2xl font-bold">{percentageReport + "%"}</p>
              </CircularProgressbarWithChildren>
            </div>
            {report[CATEGORY_TYPES.INCOMES] - report[CATEGORY_TYPES.EXPENSES] >=
              0 && (
              <p className="text-xl">
                Remainder:{" "}
                <span className="font-semibold text-purple-600 text-2xl">
                  {formatCurrency(
                    report[CATEGORY_TYPES.INCOMES] -
                      report[CATEGORY_TYPES.EXPENSES]
                  )}
                </span>
              </p>
            )}
            {report[CATEGORY_TYPES.INCOMES] - report[CATEGORY_TYPES.EXPENSES] <
              0 && (
              <p className="text-xl">
                Exceeding:{" "}
                <span className="font-semibold text-red-600 text-2xl">
                  {formatCurrency(
                    (report[CATEGORY_TYPES.INCOMES] -
                      report[CATEGORY_TYPES.EXPENSES]) *
                      -1
                  )}
                </span>
              </p>
            )}
          </div>

          <div className="text-center flex flex-col items-center">
            {!loadingPlan && !plan && (
              <button
                className="py-2 px-8 rounded-lg bg-transparent text-purple-500 font-semibold hover:bg-white mb-3"
                onClick={() => setIsAddingPlan(true)}
              >
                Set up plan for this month
              </button>
            )}
            {!loadingPlan && plan && (
              <div className="mb-3 bg-purple-200 rounded-xl py-2 px-4">
                <div className="mb-2 flex justify-between items-end">
                  <div className="flex flex-col justify-center items-start text-md w-1/2 text-start">
                    <p className="">Your budget for this month: </p>
                    <p className="font-bold text-xl">
                      {formatCurrency(plan.amount)}
                    </p>
                  </div>
                  {percentagePlan <= 100 && (
                    <div className="flex flex-col justify-center items-end text-md w-1/2 text-end">
                      <p className="">
                        Budget left until the end of{" "}
                        {getMonthName(plan.month - 1)}:{" "}
                      </p>

                      <p className="font-bold text-xl">
                        {formatCurrency(
                          plan.amount - report[CATEGORY_TYPES.EXPENSES]
                        )}
                      </p>
                    </div>
                  )}
                  {percentagePlan > 100 && (
                    <div className="flex flex-col justify-center items-end text-md w-1/2 text-red font-bold text-end">
                      <p className="">You have overspent your budget of: </p>
                      <p className="text-xl">
                        {formatCurrency(
                          (plan.amount - report[CATEGORY_TYPES.EXPENSES]) * -1
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <div className="h-3 bg-white rounded-full grow shadow-sm">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width:
                          (percentagePlan > 100 ? 100 : percentagePlan) + "%",
                      }}
                    ></div>
                  </div>
                  <p className="text-xl text-purple-500 font-bold">
                    {percentagePlan + "%"}
                  </p>
                </div>
              </div>
            )}
            <button
              className="py-2 px-8 rounded-lg bg-purple-500 text-white text-sm font-semibold uppercase mt-3 hover:bg-purple-600"
              onClick={handleClickViewReport}
            >
              View report
            </button>
          </div>
        </>
      )}

      {!loading && !report && (
        <>
          <p className="text-center text-3xl mt-12 text-gray-400 font-light">
            You didn&apos;t make any transactions in this period!
          </p>
        </>
      )}

      {isAddingPlan && (
        <AddMonthPlan
          onClose={() => setIsAddingPlan(false)}
          onAddingSuccess={() => getPlan()}
          _month={month}
          _year={year}
        />
      )}
    </div>
  );
}

export default Report;
