/* eslint-disable react-hooks/purity */
"use client";

import {
  useGetChartsDataQuery,
  useGetStatsQuery,
} from "@/redux/features/admin/dashboardAPI";
import { DollarSign, ShoppingCart, Users, Video } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";
import React from "react";

export function DashboardSkeleton() {
  return (
    <div className='space-y-6 animate-pulse'>
      <div>
        <div className='h-8 w-48 bg-white/10 rounded-md mb-2' />
        <div className='h-4 w-64 bg-white/5 rounded-md' />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='bg-white/5 rounded-xl p-6 h-36 border border-white/5'
          />
        ))}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white/5 border border-white/5 rounded-xl p-6 h-88' />
        <div className='bg-white/5 border border-white/5 rounded-xl p-6 h-88' />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: statsRes, isLoading: statsLoading } = useGetStatsQuery({});
  const { data: chartsRes, isLoading: chartsLoading } = useGetChartsDataQuery(
    {},
  );

  if (statsLoading || chartsLoading) {
    return <DashboardSkeleton />;
  }

  const stats = statsRes?.data;
  const charts = chartsRes?.data;

  // Format Sales Trend Data for Recharts
  const formattedSalesData =
    charts?.sales_trend?.labels.map((label: string, index: number) => ({
      name: label,
      value: charts.sales_trend.values[index],
    })) || [];

  // Format Video Performance Data for Recharts
  const formattedVideoData =
    charts?.video_performance?.labels.map((label: string, index: number) => ({
      name: label,
      value: charts.video_performance.values[index],
    })) || [];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-white mb-1'>Dashboard</h1>
        <p className='text-white/60 text-sm'>
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        <DashboardCard
          title='Total Revenue'
          value={`$${stats?.revenue?.total || 0}`}
          icon={<DollarSign size={20} className='text-blue-600' />}
          iconBg='bg-blue-100/50'
          trend='Live'
          trendColor='text-green-500'
        />
        <DashboardCard
          title='Total Orders'
          value={stats?.orders?.total?.toString() || "0"}
          icon={<ShoppingCart size={20} className='text-blue-600' />}
          iconBg='bg-blue-100/50'
          trend={`${stats?.orders?.video_orders || 0} Videos`}
          trendColor='text-blue-500'
        />
        <DashboardCard
          title='Total Users'
          value={stats?.users?.total?.toString() || "0"}
          icon={<Users size={20} className='text-blue-600' />}
          iconBg='bg-blue-100/50'
          trend='Active'
          trendColor='text-green-500'
        />
        <DashboardCard
          title='Total Videos'
          value={stats?.videos?.total?.toString() || "0"}
          icon={<Video size={20} className='text-blue-600' />}
          iconBg='bg-blue-100/50'
          trend={`${stats?.videos?.published || 0} Published`}
          trendColor='text-green-500'
        />
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Sales Trend Chart */}
        <div className='bg-[#FFCC80] rounded-xl p-6 relative shadow-lg'>
          <h2 className='text-black font-semibold text-sm mb-6'>
            Sales Trend (USD)
          </h2>
          <div className='h-62.5 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={formattedSalesData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='rgba(0,0,0,0.1)'
                />
                <XAxis
                  dataKey='name'
                  tick={{ fill: "#000", fontSize: 12 }}
                  stroke='#000'
                />
                <YAxis tick={{ fill: "#000", fontSize: 12 }} stroke='#000' />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='value'
                  stroke='#3b82f6'
                  strokeWidth={3}
                  dot={{
                    fill: "#fff",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Video Performance Chart */}
        <div className='bg-white rounded-xl p-6 shadow-lg'>
          <h2 className='text-black font-semibold text-sm mb-6'>
            Video Performance ({charts?.video_performance?.metric || "Views"})
          </h2>
          <div className='h-62.5 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={formattedVideoData} barSize={60}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='#eee'
                />
                <XAxis
                  dataKey='name'
                  tick={{ fill: "#888", fontSize: 12 }}
                  stroke='#ccc'
                />
                <YAxis tick={{ fill: "#888", fontSize: 12 }} stroke='#ccc' />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey='value' fill='#8b5cf6' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  iconBg,
  trend,
  trendColor,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  trend: string;
  trendColor: string;
}) {
  return (
    <div className='bg-[#FFCC80] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-36 shadow-sm border border-black/5'>
      <div className='flex justify-between items-start'>
        <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
        <span
          className={`text-xs font-bold uppercase tracking-wider ${trendColor}`}
        >
          {trend}
        </span>
      </div>
      <div>
        <h3 className='text-2xl font-bold text-black mt-2'>{value}</h3>
        <p className='text-black/60 text-sm font-medium'>{title}</p>
      </div>
    </div>
  );
}
