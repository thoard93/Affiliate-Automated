'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
];

export default function DashboardCharts() {
    return (
        <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        hide={true}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0F0F0F',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#FF6B00' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#FF6B00"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorSales)"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
