import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import categories from "../../../assets/images/categories.png";
import plan from "../../../assets/images/money-bag.png";
import report from "../../../assets/images/seo-report.png";
import expenses from "../../../assets/images/spending.png";
import goal from "../../../assets/images/goal.png";

function Benefits({ setShownBenefits }) {
  const benefits = [
    { name: "Transactions Tracking", image: expenses },
    { name: "Expense Categorizations", image: categories },
    { name: "Expense Planing (Budgeting)", image: plan },
    { name: "Financial Reporting", image: report },
    { name: "Goals & Savings", image: goal },
  ];

  return (
    <div>
      <h2 className="text-purple-500 text-3xl text-center">Benefits</h2>
      <div className="grid grid-cols-2 grid-flow-row gap-3 mt-4 auto-rows-fr">
        {benefits.map((benefit) => (
          <div
            className="sm:p-3 p-2 bg-purple-200 rounded-xl text-center flex flex-col justify-center items-center gap-2 hover:bg-purple-300"
            key={Math.random()}
          >
            <img src={benefit.image} alt="" className="w-14 h-14" />
            <p className="font-semibold text-gray-600 text-md">
              {benefit.name}
            </p>
          </div>
        ))}
      </div>
      <button
        className="bg-purple-600 text-white py-2 w-full rounded-lg sm:mt-12 mt-4 text-xl hover:bg-purple-700"
        onClick={() => setShownBenefits(false)}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="me-3" />
        <span>Back</span>
      </button>
    </div>
  );
}

export default Benefits;
