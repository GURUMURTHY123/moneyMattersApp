import React from 'react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts"

const data = [
  {
    group_name: "Sunday",
    debit: 200,
    credit: 400,
  },
  {
    group_name: "Monday",
    debit: 3000,
    credit: 500,
  },
  {
    group_name: "Tuesday",
    debit: 1000,
    credit: 1500,
  },
  {
    group_name: "Wednesday",
    debit: 700,
    credit: 1200,
  },
  {
    group_name: "Thursday",
    debit: 700,
    credit: 1200,
  },
  {
    group_name: "Friday",
    debit: 700,
    credit: 1200,
  },
  {
    group_name: "Saturday",
    debit: 700,
    credit: 1200,
  }
]

const Barchart = () => {
  return (
    <ResponsiveContainer width="95%" height={350} margin={20}>
      <BarChart
        data={data}
        margin={{
          top: 60,
          bottom:10,
          left:10,
          right:10
        }}
      >
        <XAxis
          dataKey="group_name"
          tick={{
            stroke: "gray",
            strokeWidth: 0,
          }}
        />
        <YAxis
          tick={{
            stroke: "gray",
            strokeWidth: 0,
          }}
        />
        <Legend
          wrapperStyle={{
            margin: 280
          }}
        />
        <Bar dataKey="debit" name="Debit" fill="#4D78FF" barSize="50%"  />
        <Bar dataKey="credit" name="Credit" fill="#FCAA0B" barSize="10%"  />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Barchart