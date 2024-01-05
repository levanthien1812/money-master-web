import React from "react";
import Warning from "./Warning";

function WarningExceed({ onClose }) {
  return (
    <Warning
      top={"-top-28"}
      left="left-48"
      onClose={onClose}
      message={
        "Your total expenses are approaching your total incomes. Review your spending to ensure financial balance."
      }
    />
  );
}

export default WarningExceed;
