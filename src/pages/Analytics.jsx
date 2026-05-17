import { useAnalytics } from '../context/AnalyticsContext'
import { BarChart3, TrendingUp, PieChart } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart as RePieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts'
import { CHART_COLORS } from '../utils/constants'

const DEPT_COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0284c7']

export default function Analytics() {
  const { qoqData, completionData, departmentData } = useAnalytics()

  // Get unique department keys from qoqData
  const deptKeys = qoqData.length > 0
    ? Object.keys(qoqData[0]).filter(k => k !== 'quarter' && k !== 'overall')
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Organization-wide goal performance insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QoQ Performance Trends — Line Chart */}
        <div className="card lg:col-span-2">
          <div className="card-header flex items-center gap-2">
            <TrendingUp size={16} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">Quarter-over-Quarter Performance</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={qoqData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="overall" name="Overall" stroke={CHART_COLORS.primary} strokeWidth={2.5} dot={{ r: 4 }} />
                {deptKeys.map((dept, i) => (
                  <Line
                    key={dept} type="monotone" dataKey={dept} name={dept}
                    stroke={DEPT_COLORS[i % DEPT_COLORS.length]} strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Completion Status — Pie Chart */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <PieChart size={16} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">Goal Status Distribution</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <RePieChart>
                <Pie
                  data={completionData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={100} innerRadius={55}
                  paddingAngle={2} label={({ name, value }) => `${name} (${value})`}
                  labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                >
                  {completionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color || DEPT_COLORS[i % DEPT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Comparison — Bar Chart */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <BarChart3 size={16} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">Department Completion Rates</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={departmentData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis dataKey="department" type="category" width={90} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value) => [`${value}%`, 'Completion Rate']}
                />
                <Bar dataKey="completionRate" radius={[0, 4, 4, 0]} barSize={24}>
                  {departmentData.map((entry, i) => (
                    <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
