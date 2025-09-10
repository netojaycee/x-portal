"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


const chartConfig = {
  studentsNo: {
    label: "students",
    color: "#CBD8F2",
    // active - #4963C7
  },
} satisfies ChartConfig;

export function LearnersDistribution({schoolClassSummary}: {schoolClassSummary: any}) {
  console.log("schoolClassSummary", schoolClassSummary);
  return (
    <div className=''>
      <h1 className='font-lato text-base md:text-xl font-semibold mb-2'>
        Learners Distribution
      </h1>
      <Card className='shadow-none max-h-[300px]'>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={schoolClassSummary}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='class'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                // tickFormatter={(value) => value.slice(0, 3)}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey='studentsNo' fill='var(--color-studentsNo)' radius={5} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
