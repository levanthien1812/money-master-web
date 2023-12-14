import React, { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import { toast } from "react-toastify";
import GoalService from "../../../services/goals";
import formatCurrency from "../../../utils/currencyFormatter";
import Loading from "../../../components/others/Loading";
import { format } from "date-fns";
import goalImage from "../../../assets/images/goal.png";

function Additions({ onClose, goal }) {
  const [additions, setAdditions] = useState([]);
  const [shownAdditions, setShownAdditions] = useState([]);
  const [loadingAdditions, setLoadingAdditions] = useState(false);
  const [type, setType] = useState("additions");

  const getAdditions = async () => {
    setLoadingAdditions(true);
    try {
      const responseData = await GoalService.getGoalAdditions(goal.id);

      if (responseData.status === "success") {
        setAdditions(responseData.data.goal_additions);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoadingAdditions(false);
  };

  useEffect(() => {
    setLoadingAdditions(true);
    getAdditions();
  }, []);

  useEffect(() => {
    if (additions.length > 0)
      setShownAdditions(
        additions.filter((addition) =>
          type === "additions" ? addition.amount > 0 : addition.amount < 0
        )
      );
  }, [type, additions]);

  const btnStyle = (_type) => {
    if (type === _type) return "bg-purple-600 text-white font-bold";
    else return "text-purple-600 bg-purple-200  hover:bg-purple-200";
  };

  return (
    <Modal
      onClose={onClose}
      onAccept={onClose}
      title={"Goal additions & withdrawals"}
      width={"xl:w-1/3 md:w-2/5 sm:w-1/2 w-11/12"}
      action="yes"
    >
      <div>
        <div className="mb-4 flex justify-center w-full p-1 bg-purple-200 rounded-xl gap-2">
          <button
            className={
              "py-1 w-1/2 rounded-xl hover:font-bold " + btnStyle("additions")
            }
            onClick={() => setType("additions")}
          >
            Additions
          </button>
          <button
            className={
              "py-1 w-1/2 rounded-xl hover:font-bold " + btnStyle("withdrawals")
            }
            onClick={() => setType("withdrawals")}
          >
            Withdrawals
          </button>
        </div>
        {!loadingAdditions && shownAdditions.length > 0 && (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-start">ID</th>
                <th className="text-start">
                  {type === "additions" ? "From" : "To"}
                </th>
                <th className="text-start">Amount</th>
                <th className="text-start">Date</th>
              </tr>
            </thead>
            <tbody>
              {shownAdditions.map((addition, index) => (
                <tr
                  key={addition.id}
                  className={`py-1 ${
                    index % 2 === 0 ? "bg-white" : "bg-purple-200"
                  }`}
                >
                  <td className="px-2 py-2">{addition.id}</td>
                  <td className="">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            addition.wallet_id
                              ? addition.wallet.image
                              : addition.goal_from.image || goalImage
                          }
                          alt=""
                        />{" "}
                      </div>
                      <p>
                        {addition.wallet_id
                          ? addition.wallet.name
                          : addition.goal_from.name}
                      </p>
                    </div>
                  </td>
                  <td className="font-bold text-purple-500">
                    {formatCurrency(Math.abs(addition.amount))}
                  </td>
                  <td className="text-sm">
                    {format(new Date(addition.date), "dd/MM/yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loadingAdditions && shownAdditions.length === 0 && (
          <p className="text-center text-xl text-gray-500">
            {type === "additions"
              ? "No additions found!"
              : "No withdrawals found!"}
          </p>
        )}
        {loadingAdditions && <Loading />}
      </div>
    </Modal>
  );
}

export default Additions;
