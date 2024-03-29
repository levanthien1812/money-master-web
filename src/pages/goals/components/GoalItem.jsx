import React, { useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import formatCurrency from "../../../utils/currencyFormatter";
import { format } from "date-fns";
import AddGoal from "./AddGoal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";
import Additions from "./Additions";
import AddAddition from "./AddAddition";
import TransferSurplus from "./TransferSurplus";
import ConfirmDeleteModal from "../../../components/modal/ConfirmDeleteModal";
import { toast } from "react-toastify";
import GoalService from "../../../services/goals";
import { shorten } from "../../../utils/stringFormatter";
import goalImage from "../../../assets/images/goal.png";
import { GOAL_STATUS } from "../../../config/constants";
import { useTranslation } from "react-i18next";

function GoalItem({ goal, status, onUpdateSuccess }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isViewingAdditions, setIsViewingAdditions] = useState(false);
  const [isAddingAddition, setIsAddingAddition] = useState(false);
  const [isAddingWithdrawal, setIsAddingWithdrawal] = useState(false);
  const [isTransferingSurplus, setIsTransferingSurplus] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [isSavingDelete, setIsSavingDelete] = useState(false);

  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      setIsSavingDelete(true);
      const responseData = await GoalService.deleteGoal(goal.id);

      if (responseData.status === "success") {
        toast.success("Delete goal successfully!");
        setIsConfirmDelete(false);
        onUpdateSuccess({ status });
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setIsSavingDelete(false);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-2 bg-white sm:p-4 rounded-xl shadow-md hover:shadow-purple-300 relative overflow-hidden">
        <div className="w-44 p-2 hidden sm:block shrink-0">
          <CircularProgressbarWithChildren
            value={(goal.total_contributions / goal.amount) * 100}
            counterClockwise={true}
            styles={buildStyles({
              pathColor: "#A855F7",
              trailColor: "#11111111",
              pathTransitionDuration: 0.5,
              strokeLinecap: "round",
            })}
            strokeWidth={3}
          >
            <div
              className="rounded-full overflow-hidden shadow-md m-1"
              style={{ width: "90%", height: "90%" }}
            >
              <img
                className="object-cover w-full h-full"
                src={goal.image || goalImage}
                alt=""
              />
            </div>
          </CircularProgressbarWithChildren>
        </div>
        <div className="block sm:hidden">
          <div className="h-32">
            <img
              src={goal.image || goalImage}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-1.5 bg-purple-200">
            <div
              className="h-1.5 bg-purple-500"
              style={{
                width: (goal.total_contributions / goal.amount) * 100 + "%",
              }}
            ></div>
          </div>
        </div>
        <div className="h-full flex flex-col justify-between grow p-3 sm:p-0">
          <div>
            <p className="text-xl text-gray-600 font-extrabold mb-2">
              {shorten(goal.name, 80)}
            </p>

            <div className="flex justify-between items-center gap-2 mb-4">
              <p className="bg-yellow-500 rounded-md px-3 text-sm uppercase w-fit">
                {status === GOAL_STATUS.IN_PROGRESS && (
                  <>
                    <span className="font-bold text-purple-600">
                      {Math.round(
                        (new Date(goal.date_end).getTime() -
                          new Date().getTime()) /
                          (1000 * 3600 * 24)
                      )}
                    </span>{" "}
                    <span className="text-xs font-bold">
                      {t("goal.days_left")}
                    </span>
                  </>
                )}
                {status === GOAL_STATUS.NOT_STARTED && (
                  <>
                    <span className="text-xs font-bold">
                      {t("goal.start_in")}
                    </span>{" "}
                    <span className="font-bold text-purple-600">
                      {Math.round(
                        (new Date(goal.date_begin).getTime() -
                          new Date().getTime()) /
                          (1000 * 3600 * 24)
                      )}
                    </span>{" "}
                    <span className="text-xs font-bold">{t("goal.days")}</span>
                  </>
                )}
                {(status === GOAL_STATUS.FINISH ||
                  status === GOAL_STATUS.NOT_COMPLETED) && (
                  <>
                    <span className="text-xs font-bold">
                      {t("goal.finished")}{" "}
                    </span>{" "}
                    <span className="font-bold text-purple-600">
                      {Math.round(
                        (new Date(goal.date_begin).getTime() -
                          new Date().getTime()) /
                          (1000 * 3600 * 24)
                      ) * -1}
                    </span>{" "}
                    <span className="text-xs font-bold">
                      {t("goal.days_ago")}
                    </span>
                  </>
                )}
              </p>
              {status !== GOAL_STATUS.NOT_STARTED && (
                <button
                  className=" text-purple-600 whitespace-nowrap rounded-md text-sm uppercase py-1 hover:underline"
                  onClick={() => setIsViewingAdditions(true)}
                >
                  {t("goal.see_additions")}
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-purple-600 ms-2"
                  />
                </button>
              )}
            </div>

            {status !== GOAL_STATUS.NOT_STARTED && (
              <p className="text-sm mb-3">
                <span className="text-xl bg-purple-100 text-purple-600 py-1 px-3 rounded-md font-bold">
                  {formatCurrency(goal.total_contributions)}
                </span>{" "}
                {t("goal.of")}{" "}
                <span className="text-purple-600 font-bold">
                  {formatCurrency(goal.amount)}
                </span>
              </p>
            )}
            {status === GOAL_STATUS.NOT_STARTED && (
              <>
                <p className="text-sm mb-3">
                  {t("goal.target_amount")}:{" "}
                  <span className="text-md bg-purple-100 text-purple-600 py-1 px-3 rounded-md font-bold">
                    {formatCurrency(goal.amount)}
                  </span>
                </p>
                <p className="text-sm mb-3">
                  {t("goal.begining_date")}:{" "}
                  <span className="text-md bg-purple-100 text-purple-600 py-1 px-3 rounded-md font-bold">
                    {format(new Date(goal.date_begin), "dd/MM/yyyy")}
                  </span>
                </p>
                <p className="text-sm mb-5">
                  {t("goal.due_date")}:{" "}
                  <span className="text-md bg-purple-100 text-purple-600 py-1 px-3 rounded-md font-bold">
                    {format(new Date(goal.date_end), "dd/MM/yyyy")}
                  </span>
                </p>
              </>
            )}
          </div>
          <div className="flex sm:justify-end justify-center sm:gap-2 gap-1">
            <button
              className="bg-red-200 text-red-500 rounded-md whitespace-nowrap text-sm sm:px-4 px-2 py-1 hover:font-bold"
              onClick={() => setIsConfirmDelete(true)}
            >
              {t("action.delete")}
            </button>
            <button
              className="bg-purple-200 text-purple-500 rounded-md whitespace-nowrap text-sm sm:px-4 px-2 py-1 hover:font-bold"
              onClick={() => setIsUpdating(true)}
            >
              {t("action.update")}
            </button>
            {status !== GOAL_STATUS.NOT_STARTED && (
              <button
                className="bg-purple-200 text-purple-500 rounded-md whitespace-nowrap text-sm sm:px-4 px-2 py-1 hover:font-bold"
                onClick={() => setIsAddingWithdrawal(true)}
              >
                {t("goal.withdraw")}
              </button>
            )}
            {(status === GOAL_STATUS.IN_PROGRESS ||
              status === GOAL_STATUS.FINISH) && (
              <button
                className="bg-purple-600 text-white rounded-md whitespace-nowrap text-sm sm:px-4 px-2 py-1 hover:bg-purple-700"
                onClick={() => setIsAddingAddition(true)}
              >
                {t("goal.add_to_goal")}
              </button>
            )}
            {status === GOAL_STATUS.FINISH &&
              goal.total_contributions > goal.amount && (
                <button
                  className="bg-purple-600 text-white rounded-md whitespace-nowrap text-sm px-4 py-1 hover:bg-purple-700"
                  onClick={() => setIsTransferingSurplus(true)}
                >
                  {t("goal.transfer_surplus")}
                </button>
              )}
          </div>
        </div>
        {goal.is_important === 1 && (
          <div className="absolute w-20 h-20 rounded-full bg-purple-200 -top-10 -left-10 flex justify-end items-end p-3.5">
            <FontAwesomeIcon icon={faStar} className="text-purple-700" />
          </div>
        )}
      </div>
      {isUpdating && (
        <AddGoal
          onClose={() => setIsUpdating(false)}
          goal={goal}
          onUpdateSuccess={onUpdateSuccess}
          status={status}
        />
      )}
      {isViewingAdditions && (
        <Additions onClose={() => setIsViewingAdditions(false)} goal={goal} />
      )}
      {isAddingAddition && (
        <AddAddition
          type={"addition"}
          goal={goal}
          onClose={() => setIsAddingAddition(false)}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
      {isAddingWithdrawal && (
        <AddAddition
          type={"withdrawal"}
          goal={goal}
          onClose={() => setIsAddingWithdrawal(false)}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
      {isTransferingSurplus && (
        <TransferSurplus
          goal={goal}
          onClose={() => setIsTransferingSurplus(false)}
          amount={goal.total_contributions - goal.amount}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
      {isConfirmDelete && (
        <ConfirmDeleteModal
          message={t("warning.delete_goal")}
          onAccept={handleDelete}
          onClose={() => setIsConfirmDelete(false)}
          processing={isSavingDelete}
        />
      )}
    </>
  );
}

export default GoalItem;
