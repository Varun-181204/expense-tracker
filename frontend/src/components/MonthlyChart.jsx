import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

function MonthlyChart({ data }) {

  return (

    <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="income"
              fill="#10B981"
              radius={[10, 10, 0, 0]}
              animationDuration={1200}
            />

            <Bar
              dataKey="expense"
              fill="#EF4444"
              radius={[10, 10, 0, 0]}
              animationDuration={1200}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

  );

}

export default MonthlyChart;
