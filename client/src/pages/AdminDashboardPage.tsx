import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { AlertTriangle, Eye, Flame, Heart, Lock, Sparkles, Table2, Trash2, Users } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { SolidCard } from '../components/SolidCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { MetricCard } from '../components/MetricCard';
import { fetchAdminDashboard, resetAllData } from '../lib/api';
import { AdminDashboardData } from '../types';

export function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchAdminDashboard()
      .then(setData)
      .catch(() => setError('Failed to load admin dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredEmployees = useMemo(() => {
    if (!data) return [];
    if (departmentFilter === 'all') return data.employeeDirectory;
    return data.employeeDirectory.filter((employee) => employee.department === departmentFilter);
  }, [data, departmentFilter]);

  async function handleReset() {
    setResetting(true);
    try {
      await resetAllData();
      setShowResetConfirm(false);
      window.location.reload();
    } catch {
      setError('Reset failed. Please try again.');
    } finally {
      setResetting(false);
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!data) {
    return (
      <AppShell title="Workplace insights" subtitle="HR analytics dashboard" badge="Admin · Insights">
        <div className="text-center text-white/80">{error || 'No data available.'}</div>
      </AppShell>
    );
  }

  const departments = Array.from(new Set(data.employeeDirectory.map((employee) => employee.department)));

  return (
    <AppShell
      title="Workplace intelligence dashboard"
      subtitle="Real-time pulse, sentiment, and AI-driven HR recommendations across TVS Digital."
      badge="Admin · Insights"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total employees"
          value={String(data.overview.totalEmployees)}
          subtitle={`${data.overview.submissionsToday} responded today`}
          icon={<Users size={18} />}
          accent="white"
        />
        <MetricCard
          title="Sentiment score"
          value={`${data.overview.sentimentScore}%`}
          subtitle={`Submission rate · ${data.overview.submissionRate}%`}
          icon={<Heart size={18} />}
          accent="blue"
        />
        <MetricCard
          title="Stress meter"
          value={`${data.overview.stressMeter}%`}
          subtitle={`Engagement · ${data.overview.engagementScore}%`}
          icon={<Flame size={18} />}
          accent="red"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#8a1216] bg-[#450a0a] px-4 py-2 text-sm text-[#fecaca] transition hover:bg-[#7f1d1d]"
        >
          <Trash2 size={16} /> Reset all data
        </button>
      </div>

      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-[#8a1216] bg-[#450a0a] p-4"
        >
          <div className="text-sm text-[#fecaca]">
            <strong>Warning:</strong> This will permanently delete ALL data — every employee account, all responses, and all confidential reports. This action cannot be undone.
          </div>
          <div className="mt-3 flex gap-3">
            <button
              onClick={handleReset}
              disabled={resetting}
              className="rounded-2xl bg-[#E31E24] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c9191f] disabled:opacity-50"
            >
              {resetting ? 'Resetting...' : 'Yes, reset everything'}
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="rounded-2xl border border-[#1a3a5c] bg-[#0c2244] px-4 py-2 text-sm text-[#cbd5e1] transition hover:border-[#E31E24]"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <SolidCard className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Daily mood trend (7 days)</h3>
              <p className="text-sm text-[#94a3b8]">Mood, stress, and engagement averages.</p>
            </div>
            <Sparkles size={18} className="text-[#E31E24]" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.moodTrend}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#cbd5f5" fontSize={11} />
                <YAxis stroke="#cbd5f5" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#0b1f47', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }} />
                <Legend />
                <Line type="monotone" dataKey="mood" stroke="#E31E24" strokeWidth={2} />
                <Line type="monotone" dataKey="stress" stroke="#f97316" strokeWidth={2} />
                <Line type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SolidCard>

        <SolidCard className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#E31E24]" />
            <div>
              <h3 className="text-lg font-semibold text-white">Sentiment distribution</h3>
              <p className="text-sm text-[#94a3b8]">Confidential report sentiment breakdown.</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Positive', value: data.confidentialReports.filter((r) => r.sentiment === 'positive').length, color: '#22c55e' },
                    { name: 'Neutral', value: data.confidentialReports.filter((r) => r.sentiment === 'neutral').length, color: '#3b82f6' },
                    { name: 'Negative', value: data.confidentialReports.filter((r) => r.sentiment === 'negative').length, color: '#E31E24' },
                  ].filter((item) => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {[
                    { name: 'Positive', value: data.confidentialReports.filter((r) => r.sentiment === 'positive').length, color: '#22c55e' },
                    { name: 'Neutral', value: data.confidentialReports.filter((r) => r.sentiment === 'neutral').length, color: '#3b82f6' },
                    { name: 'Negative', value: data.confidentialReports.filter((r) => r.sentiment === 'negative').length, color: '#E31E24' },
                  ].filter((item) => item.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0b1f47', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SolidCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SolidCard className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Department satisfaction</h3>
            <p className="text-sm text-[#94a3b8]">Average score by department today.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentStats}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="department" stroke="#cbd5f5" fontSize={11} />
                <YAxis stroke="#cbd5f5" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#0b1f47', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }} />
                <Bar dataKey="averageScore" radius={[8, 8, 0, 0]}>
                  {data.departmentStats.map((entry, index) => (
                    <Cell key={entry.department} fill={index % 2 === 0 ? '#003DA5' : '#E31E24'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SolidCard>

        <SolidCard className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Productivity vs stress</h3>
            <p className="text-sm text-[#94a3b8]">Each dot is one employee submission today.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <XAxis type="number" dataKey="stress" name="Stress" stroke="#cbd5f5" fontSize={11} domain={[0, 100]} />
                <YAxis type="number" dataKey="productivity" name="Productivity" stroke="#cbd5f5" fontSize={11} domain={[0, 100]} />
                <ZAxis range={[80, 80]} />
                <Tooltip contentStyle={{ background: '#0b1f47', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }} />
                <Scatter data={data.productivityVsStress} fill="#E31E24" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </SolidCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SolidCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Burnout heatmap</h3>
            <AlertTriangle size={18} className="text-[#E31E24]" />
          </div>
          <div className="space-y-2">
            {data.burnoutHeatmap.length === 0 ? (
              <div className="text-sm text-[#64748b]">No team-level data yet today.</div>
            ) : null}
            {data.burnoutHeatmap.map((team) => (
              <motion.div
                key={team.team}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between rounded-2xl border border-[#1a3a5c] bg-[#0c2244] p-3 text-sm text-[#cbd5e1]"
              >
                <div>
                  <div className="font-medium text-white">{team.team}</div>
                  <div className="text-xs text-[#64748b]">Morale {team.morale}%</div>
                </div>
                <div
                  className="rounded-xl px-3 py-2 text-xs font-semibold"
                  style={{
                    background: team.burnoutRisk >= 70 ? 'rgba(227,30,36,0.25)' : team.burnoutRisk >= 50 ? 'rgba(249,115,22,0.25)' : 'rgba(34,197,94,0.25)',
                    color: team.burnoutRisk >= 70 ? '#fda4af' : team.burnoutRisk >= 50 ? '#fdba74' : '#86efac',
                  }}
                >
                  Burnout · {team.burnoutRisk}%
                </div>
              </motion.div>
            ))}
          </div>
        </SolidCard>

        <SolidCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Confidential reports</h3>
            <span className="rounded-full bg-[#E31E24] px-3 py-1 text-xs text-white">
              {data.confidentialReports.length} latest
            </span>
          </div>
          <div className="space-y-3">
            {data.confidentialReports.length === 0 ? (
              <div className="text-sm text-[#64748b]">No confidential notes yet.</div>
            ) : null}
            {data.confidentialReports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[#1a3a5c] bg-[#0c2244] p-4 text-sm text-[#cbd5e1]"
              >
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="rounded-full bg-[#E31E24] px-2 py-1 uppercase tracking-widest text-white">{report.aiCategory}</span>
                  <span className="text-[#64748b]">
                    {report.anonymous ? 'Anonymous' : report.employeeId} · {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-white">{report.text}</div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-[#E31E24] px-2 py-1 uppercase tracking-widest text-white">{report.priority}</span>
                  <span className="rounded-full bg-[#E31E24] px-2 py-1 uppercase tracking-widest text-white">{report.sentiment}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </SolidCard>
      </div>

      <SolidCard className="mt-6 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Table2 size={18} className="text-[#E31E24]" />
          <div>
            <h3 className="text-lg font-semibold text-white">All responses</h3>
            <p className="text-sm text-[#94a3b8]">Every submission with full Q&A, scores, and confidential notes.</p>
          </div>
        </div>

        {data.allResponses.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#64748b]">No submissions yet.</div>
        ) : (
          <div className="space-y-4">
            {data.allResponses.map((response) => (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[#1a3a5c] bg-[#0c2244] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">{response.name}</span>
                    <span className="rounded-full bg-[#1a3a5c] px-2 py-0.5 text-xs text-[#94a3b8]">{response.employeeId}</span>
                    <span className="rounded-full bg-[#1a3a5c] px-2 py-0.5 text-xs capitalize text-[#94a3b8]">{response.department}</span>
                    <span className="text-xs text-[#64748b]">{response.businessDateKey}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#94a3b8]">Mood: {response.mood}</span>
                    <span className="rounded-full bg-[#003DA5] px-2 py-0.5 text-xs text-white">Avg {response.averageScore}</span>
                    <span className="rounded-full bg-[#E31E24] px-2 py-0.5 text-xs text-white">Stress {response.stressScore}</span>
                  </div>
                </div>

                <div className="mt-3 space-y-2 border-t border-[#1a3a5c] pt-3">
                  {response.answers.map((answer, idx) => (
                    <div key={idx} className="flex gap-2 text-sm">
                      <span className="text-[#E31E24]">Q{idx + 1}.</span>
                      <span className="text-[#94a3b8]">{answer.question}</span>
                      <span className="text-white">→ {answer.answer}</span>
                    </div>
                  ))}
                </div>

                {response.confidentialNote && (
                  <div className="mt-3 rounded-xl border border-[#8a1216] bg-[#450a0a] p-3">
                    <div className="flex items-center gap-2 text-xs text-[#fecaca]">
                      <Lock size={14} /> Confidential
                      {response.anonymousNote && (
                        <span className="rounded-full bg-[#7f1d1d] px-2 py-0.5 text-[10px]">Anonymous</span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-[#fecaca]">{response.confidentialNote}</div>
                    {response.aiCategory && (
                      <div className="mt-2 flex gap-2">
                        <span className="rounded-full bg-[#E31E24] px-2 py-0.5 text-xs text-white">{response.aiCategory}</span>
                        <span className="rounded-full bg-[#003DA5] px-2 py-0.5 text-xs text-white">{response.sentiment}</span>
                        <span className="rounded-full bg-[#8a1216] px-2 py-0.5 text-xs text-white">{response.priority}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </SolidCard>

      <SolidCard className="mt-6 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Employee directory</h3>
            <p className="text-sm text-[#94a3b8]">Search and review employee-level pulse data.</p>
          </div>
          <select
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
            className="rounded-2xl border border-[#1a3a5c] bg-[#0c2244] px-4 py-2 text-sm text-white focus:border-[#E31E24] focus:outline-none"
          >
            <option value="all" className="bg-slate-900">
              All departments
            </option>
            {departments.map((department) => (
              <option key={department} value={department} className="bg-slate-900">
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#1a3a5c] text-sm text-[#cbd5e1]">
            <thead className="text-left text-xs uppercase tracking-widest text-[#64748b]">
              <tr>
                <th className="px-3 py-2">Employee</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Designation</th>
                <th className="px-3 py-2">Latest sentiment</th>
                <th className="px-3 py-2">Stress</th>
                <th className="px-3 py-2">Last submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a3a5c]">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-[#0e2a50]">
                  <td className="px-3 py-2">
                    <div className="font-medium text-white">{employee.name}</div>
                    <div className="text-xs text-[#64748b]">
                      {employee.employeeId} · {employee.email}
                    </div>
                  </td>
                  <td className="px-3 py-2 capitalize">{employee.department}</td>
                  <td className="px-3 py-2">{employee.designation}</td>
                  <td className="px-3 py-2">{employee.latestAverageScore}%</td>
                  <td className="px-3 py-2">{employee.latestStressScore}%</td>
                  <td className="px-3 py-2">{employee.lastSubmittedAt ? new Date(employee.lastSubmittedAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-[#64748b]">
                    No employees found for this filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SolidCard>
    </AppShell>
  );
}
