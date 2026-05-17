// ===== MOCK DATA — Realistic Enterprise Seed Data =====

export const DEMO_USERS = [
  { id: 'u1', name: 'Rahul Sharma',  email: 'emp@demo.com',     password: 'demo123', role: 'employee', department: 'Engineering', manager_id: 'u7' },
  { id: 'u2', name: 'Priya Patel',   email: 'priya@demo.com',   password: 'demo123', role: 'employee', department: 'Engineering', manager_id: 'u7' },
  { id: 'u3', name: 'Amit Kumar',    email: 'amit@demo.com',     password: 'demo123', role: 'employee', department: 'Sales',       manager_id: 'u8' },
  { id: 'u4', name: 'Sneha Reddy',   email: 'sneha@demo.com',    password: 'demo123', role: 'employee', department: 'Operations',  manager_id: 'u7' },
  { id: 'u5', name: 'Deepak Verma',  email: 'deepak@demo.com',   password: 'demo123', role: 'employee', department: 'HR',          manager_id: 'u9' },
  { id: 'u6', name: 'Ananya Singh',  email: 'ananya@demo.com',   password: 'demo123', role: 'employee', department: 'Sales',       manager_id: 'u8' },
  { id: 'u7', name: 'Vikram Mehta',  email: 'mgr@demo.com',      password: 'demo123', role: 'manager',  department: 'Engineering', manager_id: null },
  { id: 'u8', name: 'Kavita Nair',   email: 'kavita@demo.com',   password: 'demo123', role: 'manager',  department: 'Sales',       manager_id: null },
  { id: 'u9', name: 'Sunita Joshi',  email: 'admin@demo.com',    password: 'demo123', role: 'admin',    department: 'HR',          manager_id: null },
]

const now = new Date()
const ago = (hours) => new Date(now - hours * 3600000).toISOString()
const dateStr = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`

export const SEED_GOALS = [
  // Rahul's goals (emp@demo.com) — 4 goals, mixed statuses
  {
    id: 'g1', employee_id: 'u1', title: 'Achieve 98% system uptime',
    description: 'Ensure all production systems maintain 98% or higher uptime throughout the fiscal year by implementing proactive monitoring and incident response.',
    thrust_area: 'Operational Excellence', uom: 'Percentage', target: 98, weightage: 30,
    department: 'Engineering', deadline: dateStr(2026, 12, 31),
    status: 'Approved', locked: true, shared_goal_id: null,
    created_at: ago(720), updated_at: ago(48),
  },
  {
    id: 'g2', employee_id: 'u1', title: 'Reduce code review cycle time to 24 hours',
    description: 'Streamline the code review process to ensure all PRs are reviewed within 24 hours of submission.',
    thrust_area: 'Operational Excellence', uom: 'Days', target: 1, weightage: 20,
    department: 'Engineering', deadline: dateStr(2026, 9, 30),
    status: 'Approved', locked: true, shared_goal_id: null,
    created_at: ago(720), updated_at: ago(72),
  },
  {
    id: 'g3', employee_id: 'u1', title: 'Complete 3 cloud migration milestones',
    description: 'Lead and execute three key milestones in the cloud migration roadmap including assessment, pilot, and partial rollout.',
    thrust_area: 'Innovation', uom: 'Count', target: 3, weightage: 30,
    department: 'Engineering', deadline: dateStr(2026, 9, 30),
    status: 'Locked', locked: true, shared_goal_id: null,
    created_at: ago(720), updated_at: ago(24),
  },
  {
    id: 'g4', employee_id: 'u1', title: 'Mentor 2 junior developers',
    description: 'Provide structured mentorship to 2 junior team members through weekly 1:1s, code pairing sessions, and quarterly skill assessments.',
    thrust_area: 'People Development', uom: 'Count', target: 2, weightage: 20,
    department: 'Engineering', deadline: dateStr(2026, 6, 30),
    status: 'Pending Approval', locked: false, shared_goal_id: null,
    created_at: ago(48), updated_at: ago(12),
  },

  // Priya's goals
  {
    id: 'g5', employee_id: 'u2', title: 'Increase unit test coverage to 85%',
    description: 'Improve automated test coverage across all microservices to achieve minimum 85% code coverage.',
    thrust_area: 'Operational Excellence', uom: 'Percentage', target: 85, weightage: 35,
    department: 'Engineering', deadline: dateStr(2026, 6, 30),
    status: 'Approved', locked: true, shared_goal_id: null,
    created_at: ago(600), updated_at: ago(120),
  },
  {
    id: 'g6', employee_id: 'u2', title: 'Deliver API gateway redesign',
    description: 'Architect and deliver the new API gateway with improved rate limiting, caching, and authentication modules.',
    thrust_area: 'Innovation', uom: 'Count', target: 1, weightage: 40,
    department: 'Engineering', deadline: dateStr(2026, 9, 30),
    status: 'Pending Approval', locked: false, shared_goal_id: null,
    created_at: ago(96), updated_at: ago(24),
  },
  {
    id: 'g7', employee_id: 'u2', title: 'Reduce deployment failures by 50%',
    description: 'Implement CI/CD improvements to reduce production deployment failure rate from current 8% to 4%.',
    thrust_area: 'Operational Excellence', uom: 'Percentage', target: 50, weightage: 25,
    department: 'Engineering', deadline: dateStr(2026, 12, 31),
    status: 'Draft', locked: false, shared_goal_id: null,
    created_at: ago(24), updated_at: ago(6),
  },

  // Amit's goals (Sales)
  {
    id: 'g8', employee_id: 'u3', title: 'Increase customer NPS score by 12 points',
    description: 'Drive customer satisfaction initiatives to improve Net Promoter Score from 42 to 54 through targeted engagement programs.',
    thrust_area: 'Customer Satisfaction', uom: 'Score', target: 12, weightage: 30,
    department: 'Sales', deadline: dateStr(2026, 6, 30),
    status: 'Approved', locked: true, shared_goal_id: null,
    created_at: ago(500), updated_at: ago(96),
  },
  {
    id: 'g9', employee_id: 'u3', title: 'Close ₹2.5 Cr in new enterprise deals',
    description: 'Identify and close new enterprise accounts with combined annual contract value of ₹2.5 crore.',
    thrust_area: 'Revenue Growth', uom: 'Currency', target: 250, weightage: 40,
    department: 'Sales', deadline: dateStr(2026, 12, 31),
    status: 'Locked', locked: true, shared_goal_id: null,
    created_at: ago(500), updated_at: ago(48),
  },
  {
    id: 'g10', employee_id: 'u3', title: 'Reduce sales cycle from 45 to 30 days',
    description: 'Optimize sales process and implement automation to reduce average deal cycle time by 33%.',
    thrust_area: 'Operational Excellence', uom: 'Days', target: 30, weightage: 30,
    department: 'Sales', deadline: dateStr(2026, 9, 30),
    status: 'Approved', locked: true, shared_goal_id: null,
    created_at: ago(500), updated_at: ago(72),
  },

  // Sneha's goals (Operations)
  {
    id: 'g11', employee_id: 'u4', title: 'Increase SLA compliance by 15%',
    description: 'Improve SLA compliance from current 82% to 97% across all operational processes through process standardization.',
    thrust_area: 'Operational Excellence', uom: 'Percentage', target: 15, weightage: 35,
    department: 'Operations', deadline: dateStr(2026, 6, 30),
    status: 'Pending Approval', locked: false, shared_goal_id: null,
    created_at: ago(72), updated_at: ago(18),
  },
  {
    id: 'g12', employee_id: 'u4', title: 'Reduce operational costs by 10%',
    description: 'Identify and eliminate operational inefficiencies to achieve 10% cost reduction across all departments.',
    thrust_area: 'Revenue Growth', uom: 'Percentage', target: 10, weightage: 30,
    department: 'Operations', deadline: dateStr(2026, 9, 30),
    status: 'Rejected', locked: false, shared_goal_id: null,
    created_at: ago(120), updated_at: ago(48),
  },
  {
    id: 'g13', employee_id: 'u4', title: 'Reduce ticket turnaround time by 20%',
    description: 'Implement ticket triage automation and workflow optimization to reduce average resolution time from 5 days to 4 days.',
    thrust_area: 'Customer Satisfaction', uom: 'Percentage', target: 20, weightage: 35,
    department: 'Operations', deadline: dateStr(2026, 12, 31),
    status: 'Draft', locked: false, shared_goal_id: null,
    created_at: ago(36), updated_at: ago(6),
  },

  // Deepak's goals (HR)
  {
    id: 'g14', employee_id: 'u5', title: 'Improve onboarding completion rate to 95%',
    description: 'Redesign the employee onboarding program to achieve 95% completion rate within the first 30 days.',
    thrust_area: 'People Development', uom: 'Percentage', target: 95, weightage: 40,
    department: 'HR', deadline: dateStr(2026, 6, 30),
    status: 'Approved', locked: true, shared_goal_id: null,
    created_at: ago(480), updated_at: ago(96),
  },
  {
    id: 'g15', employee_id: 'u5', title: 'Launch employee wellness program',
    description: 'Design and launch a comprehensive wellness program covering mental health, fitness, and work-life balance for all employees.',
    thrust_area: 'People Development', uom: 'Count', target: 1, weightage: 30,
    department: 'HR', deadline: dateStr(2026, 9, 30),
    status: 'Approved', locked: true, shared_goal_id: null,
    created_at: ago(480), updated_at: ago(120),
  },
  {
    id: 'g16', employee_id: 'u5', title: 'Reduce voluntary attrition to below 12%',
    description: 'Implement retention strategies to reduce voluntary attrition from 16% to below 12% annually.',
    thrust_area: 'People Development', uom: 'Percentage', target: 12, weightage: 30,
    department: 'HR', deadline: dateStr(2026, 12, 31),
    status: 'Locked', locked: true, shared_goal_id: null,
    created_at: ago(480), updated_at: ago(72),
  },

  // Ananya's goals (Sales)
  {
    id: 'g17', employee_id: 'u6', title: 'Generate 50 qualified leads per quarter',
    description: 'Build and execute lead generation campaigns to consistently deliver 50 marketing-qualified leads per quarter.',
    thrust_area: 'Revenue Growth', uom: 'Count', target: 50, weightage: 35,
    department: 'Sales', deadline: dateStr(2026, 6, 30),
    status: 'Returned For Rework', locked: false, shared_goal_id: null,
    created_at: ago(200), updated_at: ago(24),
  },
  {
    id: 'g18', employee_id: 'u6', title: 'Achieve 90% customer retention rate',
    description: 'Implement customer success programs and QBRs to maintain 90% or higher customer retention.',
    thrust_area: 'Customer Satisfaction', uom: 'Percentage', target: 90, weightage: 35,
    department: 'Sales', deadline: dateStr(2026, 12, 31),
    status: 'Pending Approval', locked: false, shared_goal_id: null,
    created_at: ago(100), updated_at: ago(12),
  },
  {
    id: 'g19', employee_id: 'u6', title: 'Complete advanced sales training certification',
    description: 'Complete the enterprise sales methodology certification program including 4 modules and practical assessments.',
    thrust_area: 'People Development', uom: 'Count', target: 1, weightage: 30,
    department: 'Sales', deadline: dateStr(2026, 3, 31),
    status: 'Draft', locked: false, shared_goal_id: null,
    created_at: ago(48), updated_at: ago(12),
  },
]

export const SEED_CHECKINS = [
  // Rahul's check-ins
  { id: 'c1', goal_id: 'g1', quarter: 'Q1', achievement: 97.5, progress: 99, status: 'On Track', comment: 'Maintained 97.5% uptime in Q1. Minor outage on March 15 resolved within 2 hours.', created_at: ago(360) },
  { id: 'c2', goal_id: 'g1', quarter: 'Q2', achievement: 98.2, progress: 100, status: 'Completed', comment: 'Exceeded target with 98.2% uptime. New monitoring alerts have been very effective.', created_at: ago(120) },
  { id: 'c3', goal_id: 'g2', quarter: 'Q1', achievement: 1.5, progress: 67, status: 'On Track', comment: 'Average review time reduced to 1.5 days. Implementing auto-assignment next quarter.', created_at: ago(360) },
  { id: 'c4', goal_id: 'g3', quarter: 'Q1', achievement: 1, progress: 33, status: 'On Track', comment: 'Completed cloud readiness assessment. Documentation and runbooks prepared.', created_at: ago(360) },
  { id: 'c5', goal_id: 'g3', quarter: 'Q2', achievement: 2, progress: 67, status: 'On Track', comment: 'Pilot migration completed successfully for 2 non-critical services.', created_at: ago(96) },

  // Priya's check-ins
  { id: 'c6', goal_id: 'g5', quarter: 'Q1', achievement: 72, progress: 85, status: 'On Track', comment: 'Test coverage at 72%. Added integration tests for payment and auth services.', created_at: ago(340) },
  { id: 'c7', goal_id: 'g5', quarter: 'Q2', achievement: 80, progress: 94, status: 'On Track', comment: 'Coverage up to 80%. Working on edge cases for data pipeline tests.', created_at: ago(100) },

  // Amit's check-ins
  { id: 'c8', goal_id: 'g8', quarter: 'Q1', achievement: 6, progress: 50, status: 'On Track', comment: 'NPS improved by 6 points to 48. Customer feedback program showing results.', created_at: ago(350) },
  { id: 'c9', goal_id: 'g9', quarter: 'Q1', achievement: 80, progress: 32, status: 'On Track', comment: 'Closed ₹80L in Q1. Pipeline has ₹1.2Cr in advanced stages.', created_at: ago(350) },
  { id: 'c10', goal_id: 'g10', quarter: 'Q1', achievement: 38, progress: 47, status: 'On Track', comment: 'Cycle reduced to 38 days. New CRM workflows helping with follow-ups.', created_at: ago(350) },

  // Deepak's check-ins
  { id: 'c11', goal_id: 'g14', quarter: 'Q1', achievement: 88, progress: 93, status: 'On Track', comment: 'Onboarding completion at 88%. New digital onboarding portal launched in March.', created_at: ago(330) },
  { id: 'c12', goal_id: 'g14', quarter: 'Q2', achievement: 93, progress: 98, status: 'On Track', comment: 'Reached 93% completion. Buddy program and milestone checkpoints driving improvement.', created_at: ago(80) },
  { id: 'c13', goal_id: 'g15', quarter: 'Q1', achievement: 0, progress: 0, status: 'Not Started', comment: 'Program design phase. Vendor evaluation for mental health partner underway.', created_at: ago(330) },
  { id: 'c14', goal_id: 'g16', quarter: 'Q1', achievement: 14.5, progress: 17, status: 'On Track', comment: 'Current attrition at 14.5%. Exit interview insights being incorporated into retention plan.', created_at: ago(330) },
]

export const SEED_AUDIT_LOGS = [
  { id: 'a1', action: 'Goal Created', details: 'Rahul Sharma created goal "Achieve 98% system uptime"', changed_by: 'u1', changed_by_name: 'Rahul Sharma', created_at: ago(720) },
  { id: 'a2', action: 'Goal Approved', details: 'Vikram Mehta approved goal "Achieve 98% system uptime" for Rahul Sharma', changed_by: 'u7', changed_by_name: 'Vikram Mehta', created_at: ago(700) },
  { id: 'a3', action: 'Goal Locked', details: 'System locked goal "Achieve 98% system uptime" after approval', changed_by: 'u7', changed_by_name: 'System', created_at: ago(700) },
  { id: 'a4', action: 'Check-in Submitted', details: 'Rahul Sharma submitted Q1 check-in for "Achieve 98% system uptime"', changed_by: 'u1', changed_by_name: 'Rahul Sharma', created_at: ago(360) },
  { id: 'a5', action: 'Goal Approved', details: 'Vikram Mehta approved 3 goals for Priya Patel', changed_by: 'u7', changed_by_name: 'Vikram Mehta', created_at: ago(580) },
  { id: 'a6', action: 'Goal Rejected', details: 'Vikram Mehta rejected "Reduce operational costs by 10%" — Target too ambitious for current quarter', changed_by: 'u7', changed_by_name: 'Vikram Mehta', created_at: ago(48) },
  { id: 'a7', action: 'Goal Returned', details: 'Kavita Nair returned "Generate 50 qualified leads per quarter" for rework — Please add regional breakdown', changed_by: 'u8', changed_by_name: 'Kavita Nair', created_at: ago(24) },
  { id: 'a8', action: 'Goal Submitted', details: 'Sneha Reddy submitted 3 goals for approval', changed_by: 'u4', changed_by_name: 'Sneha Reddy', created_at: ago(72) },
  { id: 'a9', action: 'Check-in Submitted', details: 'Amit Kumar submitted Q1 check-in for "Increase customer NPS score by 12 points"', changed_by: 'u3', changed_by_name: 'Amit Kumar', created_at: ago(350) },
  { id: 'a10', action: 'Goal Unlocked', details: 'Sunita Joshi unlocked goal "Close ₹2.5 Cr in new enterprise deals" for Amit Kumar', changed_by: 'u9', changed_by_name: 'Sunita Joshi', created_at: ago(12) },
  { id: 'a11', action: 'Check-in Submitted', details: 'Deepak Verma submitted Q2 check-in for "Improve onboarding completion rate to 95%"', changed_by: 'u5', changed_by_name: 'Deepak Verma', created_at: ago(80) },
  { id: 'a12', action: 'Goal Created', details: 'Ananya Singh created goal "Complete advanced sales training certification"', changed_by: 'u6', changed_by_name: 'Ananya Singh', created_at: ago(48) },
]

export const SEED_ACTIVITY = [
  { id: 'act1', text: 'Rahul Sharma submitted Q2 check-in update', role: 'employee', timestamp: ago(2), icon: '🟢' },
  { id: 'act2', text: 'Vikram Mehta approved "System uptime" goal', role: 'manager', timestamp: ago(6), icon: '🔵' },
  { id: 'act3', text: 'Sneha Reddy submitted 3 goals for approval', role: 'employee', timestamp: ago(18), icon: '🟢' },
  { id: 'act4', text: 'Kavita Nair returned goal for rework to Ananya Singh', role: 'manager', timestamp: ago(24), icon: '🔵' },
  { id: 'act5', text: 'Sunita Joshi unlocked goal for Amit Kumar', role: 'admin', timestamp: ago(12), icon: '🟡' },
  { id: 'act6', text: 'Deepak Verma submitted Q2 check-in for onboarding goal', role: 'employee', timestamp: ago(80), icon: '🟢' },
  { id: 'act7', text: 'Priya Patel created new goal "Deliver API gateway redesign"', role: 'employee', timestamp: ago(96), icon: '🟢' },
  { id: 'act8', text: 'Vikram Mehta rejected cost reduction goal for Sneha Reddy', role: 'manager', timestamp: ago(48), icon: '🔵' },
  { id: 'act9', text: 'Amit Kumar submitted Q1 check-in for NPS improvement', role: 'employee', timestamp: ago(350), icon: '🟢' },
  { id: 'act10', text: 'Ananya Singh created "Advanced sales training" goal', role: 'employee', timestamp: ago(48), icon: '🟢' },
]

export const SEED_SHARED_GOALS = [
  {
    id: 'sg1',
    title: 'Achieve organization-wide customer satisfaction score of 4.5/5',
    target: 4.5,
    primary_owner: 'u3',
    created_at: ago(600),
  },
]
