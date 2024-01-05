import React from "react";
import Warning from "./Warning";

function WarningExceeded({ onClose }) {
  return (
    <Warning
      top={"-top-28"}
      left="left-48"
      onClose={onClose}
      message={
        "Your expenses are exceeding your incomes. Take immediate action to cut costs or increase your income to maintain financial stability."
      }
    />
  );
}

export default WarningExceeded;
