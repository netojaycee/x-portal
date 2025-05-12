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
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "July", desktop: 186 },
  { month: "August", desktop: 305 },
  { month: "September", desktop: 237 },
  { month: "October", desktop: 73 },
  { month: "November", desktop: 209 },
  { month: "December", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#CBD8F2",
    // active - #4963C7
  },
} satisfies ChartConfig;

export function SubscriptionReport() {
  return (
    <div className=''>
      <h1 className='font-lato text-base md:text-xl font-semibold mb-2'>
        Subscription Report
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
                tickFormatter={(value) => value.slice(0, 3)}
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
