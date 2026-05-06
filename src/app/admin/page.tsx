"use client";

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
} from "recharts";

const salesData = [
  { name: "Jan", value: 4200 },
  { name: "Feb", value: 3800 },
  { name: "Mar", value: 5100 },
  { name: "Apr", value: 4600 },
  { name: "May", value: 6200 },
  { name: "Jun", value: 7600 },
];

const videoPerformanceData = [
  { name: "Tutorials", value: 11900 },
  { name: "Entertainment", value: 8600 },
  { name: "Drama", value: 6700 },
];

export default function AdminDashboard() {
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
          value='$45,231'
          icon={<DollarSign size={20} className='text-blue-600' />}
          iconBg='bg-blue-100/50'
          trend='+12.5%'
          trendColor='text-green-500'
        />
        <DashboardCard
          title='Total Orders'
          value='1,234'
          icon={<ShoppingCart size={20} className='text-blue-600' />}
          iconBg='bg-blue-100/50'
          trend='+8.2%'
          trendColor='text-green-500'
        />
        <DashboardCard
          title='Total Users'
          value='8,542'
          icon={<Users size={20} className='text-blue-600' />}
          iconBg='bg-blue-100/50'
          trend='+23.1%'
          trendColor='text-green-500'
        />
        <DashboardCard
          title='Total Videos'
          value='156'
          icon={<Video size={20} className='text-blue-600' />}
          iconBg='bg-blue-100/50'
          trend='+5.4%'
          trendColor='text-green-500'
        />
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Sales Trend Chart */}
        <div className='bg-[#FFCC80] rounded-xl p-6 relative'>
          <h2 className='text-black font-semibold text-sm mb-6'>Sales Trend</h2>
          <div className='h-[250px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={salesData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='rgba(0,0,0,0.1)'
                />
                <XAxis
                  dataKey='name'
                  axisLine={true}
                  tickLine={true}
                  tick={{ fill: "#000", fontSize: 12 }}
                  stroke='#000'
                />
                <YAxis
                  axisLine={true}
                  tickLine={true}
                  tick={{ fill: "#000", fontSize: 12 }}
                  stroke='#000'
                />
                <Line
                  type='monotone'
                  dataKey='value'
                  stroke='#3b82f6'
                  strokeWidth={2}
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
        <div className='bg-white rounded-xl p-6'>
          <h2 className='text-black font-semibold text-sm mb-6'>
            Video Performance
          </h2>
          <div className='h-[250px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={videoPerformanceData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                barSize={60}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='#eee'
                />
                <XAxis
                  dataKey='name'
                  axisLine={true}
                  tickLine={true}
                  tick={{ fill: "#888", fontSize: 12 }}
                  stroke='#ccc'
                />
                <YAxis
                  axisLine={true}
                  tickLine={true}
                  tick={{ fill: "#888", fontSize: 12 }}
                  stroke='#ccc'
                />
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
    <div className='bg-[#FFCC80] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-36'>
      <div className='flex justify-between items-start'>
        <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
        <span className={`text-sm font-semibold ${trendColor}`}>{trend}</span>
      </div>
      <div>
        <h3 className='text-2xl font-bold text-black mt-2'>{value}</h3>
        <p className='text-black/60 text-sm'>{title}</p>
      </div>
    </div>
  );
}
