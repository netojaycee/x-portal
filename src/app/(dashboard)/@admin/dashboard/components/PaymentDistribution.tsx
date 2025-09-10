"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  expected: {
    label: "Expected",
    color: "#CBD8F2",
  },
  paid: {
    label: "Paid",
    color: "#4963C7",
  },
} satisfies ChartConfig;

export function PaymentDistribution({
  classRevenueData,
}: {
  classRevenueData: any[];
}) {
  const chartData = classRevenueData.map((item) => ({
    class: item.name,
    expected: item.expected,
    paid: item.paid,
  }));
  return (
    <div className="">
      <h1 className="font-lato text-base md:text-xl font-semibold mb-2">
        Subscription Report
      </h1>
      <Card className="shadow-none max-h-[300px]">
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="class"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="expected"
                fill={chartConfig.expected.color}
                radius={5}
              />
              <Bar dataKey="paid" fill={chartConfig.paid.color} radius={5} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
