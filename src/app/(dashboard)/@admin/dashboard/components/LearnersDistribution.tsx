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
const chartData = [
  { month: "JS1", desktop: 186 },
  { month: "JS2", desktop: 305 },
  { month: "JS3", desktop: 237 },
  { month: "SS1", desktop: 73 },
  { month: "SS2", desktop: 209 },
  { month: "SS3", desktop: 214 },
  { month: "BASIC1", desktop: 186 },
  { month: "BASIC2", desktop: 305 },
  { month: "BASIC3", desktop: 237 },
  { month: "BASIC4", desktop: 73 },
  { month: "BASIC5", desktop: 209 },
  { month: "BASIC6", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#CBD8F2",
    // active - #4963C7
  },
} satisfies ChartConfig;

export function LearnersDistribution() {
  return (
    <div className=''>
      <h1 className='font-lato text-base md:text-xl font-semibold mb-2'>
        Learners Distribution
      </h1>
      <Card className='shadow-none max-h-[300px]'>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='month'
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
              <Bar dataKey='desktop' fill='var(--color-desktop)' radius={5} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
