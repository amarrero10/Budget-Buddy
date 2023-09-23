import React from "react";
import { Pie } from "react-chartjs-2";

import stringHash from "string-hash";

// Function to generate a color based on a unique identifier
function generateColor(identifier) {
  // Use string-hash to generate a hash code from the identifier
  const hash = stringHash(identifier);
  const hue = ((hash % 360) + 360) % 360; // Ensure hue is within the 0-360 range
  return `hsl(${hue}, 70%, 50%)`; // Generate an HSL color
}

function BudgetChart({ data }) {
  // Define the data for the chart
  const chartData = {
    labels: data.map((budget) => budget.budgetName),
    datasets: [
      {
        data: data.map((budget) => budget.totalAmount),
        backgroundColor: data.map((budget) => generateColor(`${budget.id}-${budget.budgetName}`)), // Combine id and name for a unique identifier
      },
    ],
  };

  return (
    <div className="chart-container">
      <Pie data={chartData} />
    </div>
  );
}

export default BudgetChart;
