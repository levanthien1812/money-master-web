import React, { useMemo } from "react";
import emergency from "../../../assets/images/emergency.png";
import holidays1 from "../../../assets/images/holidays1.png";
import loan from "../../../assets/images/loan.png";
import idea from "../../../assets/images/idea.png";
import moneySaving from "../../../assets/images/money-saving.png";
import relief from "../../../assets/images/relief.png";
import savings from "../../../assets/images/savings.png";
import phone from "../../../assets/images/phone.png";
import { useTranslation } from "react-i18next";

function Introduction({ setIsAddingGoal }) {
  const { t } = useTranslation();

  const savingsItems = useMemo(
    () => [
      {
        id: 1,
        name: t("goal.vacations"),
        image: holidays1,
      },
      {
        id: 2,
        name: t("goal.savings"),
        image: savings,
      },
      {
        id: 3,
        name: t("goal.emergency"),
        image: emergency,
      },
      {
        id: 4,
        name: t("goal.buy_things"),
        image: phone,
      },
    ],
    []
  );

  const debtReductionItems = useMemo(
    () => [
      {
        id: 1,
        name: t("goal.debt_reduction"),
        image: relief,
      },
      {
        id: 2,
        name: t("goal.loan_reduction"),
        image: loan,
      },
    ],
    []
  );

  const goals = useMemo(
    () => [
      {
        id: 1,
        name: t("goal.saving_goals"),
        items: savingsItems,
      },
      {
        id: 2,
        name: t("goal.debt_reduction_goals"),
        items: debtReductionItems,
      },
    ],
    []
  );

  return (
    <div className="flex justify-center py-8">
      <div className="sm:p-8 p-3 bg-white rounded-lg shadow-md xl:w-2/3 sm:w-11/12 w-full relative z-10">
        <div>
          <div className="flex mb-4 gap-3 bg-purple-100 rounded-md">
            <div className="bg-purple-400 rounded-md p-2 w-12 h-full shrink-0">
              <img src={idea} alt="" className="h-8" />
            </div>
            <p className=" text-purple-600 p-1 px-2 text-md font-extrabold">
              {t("goal.introduction")}
            </p>
          </div>
          <div className="grid sm:gap-6 gap-2 mb-6 md:grid-cols-2 grid-cols-1">
            {goals.map((goal) => (
              <div
                className="bg-purple-200 rounded-xl w-full h-full flex flex-col hover:shadow-lg"
                key={goal.id}
              >
                <div className="grid grid-cols-2 grow sm:p-6 p-3 sm:gap-4 gap-2 items-start">
                  {goal.items.map((item) => (
                    <div
                      className="flex flex-col items-center bg-white rounded-xl p-2 hover:shadow-lg"
                      key={item.id}
                    >
                      <img src={item.image} alt="" className="w-3/4 mb-2" />
                      <p className="text-center bg-purple-100 text-purple-600 rounded-xl px-4">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="sm:py-1.5 py-0.5 bg-purple-500 text-white rounded-b-xl">
                  <p className="text-center">{goal.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-purple-500 py-3 px-12 text-white text-md font-bold rounded-md hover:bg-purple-600"
              onClick={() => setIsAddingGoal(true)}
            >
              {t("goal.set_up_goal")}
            </button>
          </div>
        </div>

        <div className="absolute md:-top-28 sm:-top-20 -top-16 right-0 md:-right-28 md:w-40 md:h-40 sm:h-28 sm:w-28 h-20 w-20 bg-white rounded-full p-2 sm:p-4 border-2 border-gray-200 md:rotate-12 z-0 overflow-hidden">
          <img src={moneySaving} alt="" className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}

export default Introduction;
