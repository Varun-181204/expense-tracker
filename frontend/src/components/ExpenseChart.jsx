import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#7C3AED", // Purple
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Orange
  "#EC4899", // Pink
];

function ExpenseChart({ data }) {

  return (
         <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              isAnimationActive={true}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>
      </div>
  );
}

export default ExpenseChart;