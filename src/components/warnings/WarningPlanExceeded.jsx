import React from "react";
import Warning from "./Warning";

function WarningPlanExceeded({ onClose }) {
  return (
    <Warning
      top={"-top-28"}
      left="left-48"
      onClose={onClose}
      message={
        "Your actual expenses have exceeded the budget. Take corrective measures to bring your spending back on track and avoid financial strain."
      }
    />
  );
}

export default WarningPlanExceeded;
