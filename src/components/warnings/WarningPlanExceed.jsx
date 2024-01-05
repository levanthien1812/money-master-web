import React from "react";
import Warning from "./Warning";

function WarningPlanExceed({ onClose }) {
  return (
    <Warning
      top={"-top-28"}
      left="left-48"
      onClose={onClose}
      message={
        "Your actual expenses are approaching your budget limit. Monitor your spending to stay within your financial plan."
      }
    />
  );
}

export default WarningPlanExceed;
