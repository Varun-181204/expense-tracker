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

    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

      <div className="h-96">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="income"
              fill="#22c55e"
            />

            <Bar
              dataKey="expense"
              fill="#ef4444"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default MonthlyChart;