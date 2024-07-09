import React, { useEffect, useState } from "react";
import Introduction from "./components/Introduction";
import AddGoal from "./components/AddGoal";
import GoalService from "../../services/goals";
import { toast } from "react-toastify";
import GoalList from "./components/GoalList";
import Congratulation from "./components/Congratulation";
import { useDispatch } from "react-redux";
import { fetchWallets } from "../../stores/wallets";
import { GOAL_STATUS } from "../../config/constants";
import logo from "../../assets/images/logo-money-master.png";
import { useTranslation } from "react-i18next";
import { GetGoalsQuery } from "../../queries/goals";

function GoalsPage() {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [status, setStatus] = useState(GOAL_STATUS.IN_PROGRESS);
  const [isCongratulating, setIsCongratulating] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { countAll, goals, loadingGoals, refetchGoals } = GetGoalsQuery({
    status,
  });

  const handleUpdateSuccess = (goal, _status) => {
    dispatch(fetchWallets());
    if (_status && _status !== status) {
      setStatus(_status);
      if (goal) {
        setIsCongratulating(true);
      }
    } else {
      refetchGoals();
    }
  };

  useEffect(() => {
    refetchGoals();
  }, [status]);

  return (
    <div className="lg:p-8 sm:p-14 p-3">
      <div className="sm:mb-8 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="lg:w-16 lg:h-16 w-10 h-10">
            <img src={logo} alt="" className="w-full h-full object-cover" />
          </div>
          <h2 className="sm:text-4xl text-3xl">{t("goal.goals")}</h2>
        </div>
        {countAll !== 0 && (
          <button
            className="sm:py-2 sm:px-12 py-1 px-4 text-center rounded-xl font-semibold bg-purple-500 text-white hover:bg-purple-600"
            onClick={() => setIsAddingGoal(true)}
          >
            {t("goal.add_goal")}
          </button>
        )}
      </div>
      {!loadingGoals && countAll === 0 && (
        <Introduction setIsAddingGoal={setIsAddingGoal} />
      )}
      {countAll > 0 && goals && (
        <GoalList
          goals={goals}
          status={status}
          setStatus={setStatus}
          onUpdateSuccess={handleUpdateSuccess}
          loading={loadingGoals}
        />
      )}
      {isAddingGoal && (
        <AddGoal
          onClose={() => setIsAddingGoal(false)}
          onUpdateSuccess={handleUpdateSuccess}
          status={status}
        />
      )}
      {isCongratulating === true && (
        <Congratulation onClose={() => setIsCongratulating(false)} />
      )}
    </div>
  );
}

export default GoalsPage;
