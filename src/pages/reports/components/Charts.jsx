import React from "react";
import { Chart, registerables } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { REPORT_TYPES } from "../../../config/constants";

function Charts({
  loading,
  reportType,
  chartLabels,
  datasets,
  filledReports,
}) {
  // Chqrt configurations
  Chart.register(...registerables);
  Chart.defaults.font.family = "Quicksand";
  Chart.defaults.color = "#000000";
  Chart.defaults.font.size = 14;

  return (
    <div className="mb-5">
      {!loading && reportType === REPORT_TYPES.DAY_MONTH && (
        <div style={{ maxHeight: 400 }} className="w-full">
          <Bar
            height={400}
            data={{
              labels: chartLabels,
              datasets: datasets,
            }}
            options={{
              maintainAspectRatio: false,
            }}
          />
        </div>
      )}

      {!loading && reportType === REPORT_TYPES.CATEGORY && (
        <div style={{ maxHeight: 400 }} className="w-full">
          <Doughnut
            height={400}
            width={400}
            options={{
              maintainAspectRatio: false,
            }}
            data={{
              labels: Object.values(filledReports).map((report) => report.name),
              datasets: datasets,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Charts;
