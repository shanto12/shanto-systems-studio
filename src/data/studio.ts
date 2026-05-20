import type { ComponentType } from 'react'
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  Code2,
  DatabaseZap,
  Eye,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react'

export type WorkflowStageId = 'observe' | 'plan' | 'act' | 'verify'
export type SystemCategory = 'ai' | 'security' | 'automation' | 'frontend' | 'live-ops'
export type TimelineCategory = 'ai' | 'security' | 'automation' | 'frontend'

export type WorkflowStage = {
  id: WorkflowStageId
  label: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
  headline: string
  copy: string
  proof: string
  tone: 'cyan' | 'green' | 'amber' | 'coral'
}

export type SystemNode = {
  id: string
  label: string
  category: SystemCategory
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
  x: number
  y: number
  metric: string
  detail: string
}

export type ProofItem = {
  id: string
  year: string
  title: string
  category: TimelineCategory
  metric: string
  copy: string
}

export const workflowStages: WorkflowStage[] = [
  {
    id: 'observe',
    label: 'Observe',
    icon: Eye,
    headline: 'Capture the right signal first.',
    copy: 'Recruiter threads, alerts, XSIAM issues, job context, and runtime health are normalized into a clean evidence stream before any automation acts.',
    proof: 'Inputs are tagged, dated in Central Time, and kept reversible.',
    tone: 'cyan',
  },
  {
    id: 'plan',
    label: 'Plan',
    icon: BrainCircuit,
    headline: 'Reason over context, constraints, and risk.',
    copy: 'The plan layer separates source evidence, operator intent, tool permissions, and release gates so execution remains explainable.',
    proof: 'Every run has a route, assumption set, and fallback.',
    tone: 'green',
  },
  {
    id: 'act',
    label: 'Act',
    icon: Zap,
    headline: 'Execute through bounded tools.',
    copy: 'Browser, Netlify, SOAR, LinkedIn, and local runners are treated as scoped actuators with explicit guardrails and audit-friendly outputs.',
    proof: 'Primary controls stay testable, not decorative.',
    tone: 'amber',
  },
  {
    id: 'verify',
    label: 'Verify',
    icon: CheckCircle2,
    headline: 'Close with current production evidence.',
    copy: 'The final pass checks deployed URLs, controls, headers, console health, mobile layout, and the exact artifacts a reviewer needs.',
    proof: 'No claim ships without evidence mapped to it.',
    tone: 'coral',
  },
]

export const systemNodes: SystemNode[] = [
  {
    id: 'agentic-ai',
    label: 'Agentic AI',
    category: 'ai',
    icon: Bot,
    x: 50,
    y: 49,
    metric: '4-lens loops',
    detail: 'Multi-agent research, draft, reviewer, and verifier loops that stay source-grounded and operator-visible.',
  },
  {
    id: 'xsiam',
    label: 'XSIAM',
    category: 'security',
    icon: ShieldCheck,
    x: 28,
    y: 31,
    metric: 'MTTR down',
    detail: 'Alert drilldowns, playbook run evidence, and incident notes with read-only defaults until a change is authorized.',
  },
  {
    id: 'soar',
    label: 'SOAR',
    category: 'automation',
    icon: Workflow,
    x: 71,
    y: 30,
    metric: 'HITL gated',
    detail: 'Playbooks that separate analysis from action, requiring explicit approval for risky or external side effects.',
  },
  {
    id: 'demo-factory',
    label: 'Demo Factory',
    category: 'frontend',
    icon: Sparkles,
    x: 73,
    y: 66,
    metric: 'Netlify live',
    detail: 'Polished role-specific demos with accessible UI, synthetic data, docs, and production release evidence.',
  },
  {
    id: 'live-ops',
    label: 'Live Ops',
    category: 'live-ops',
    icon: Radar,
    x: 38,
    y: 73,
    metric: 'Brokered runs',
    detail: 'Control rooms, runner task queues, and health checks that avoid direct public web-to-shell control.',
  },
  {
    id: 'data-boundary',
    label: 'Data Boundary',
    category: 'security',
    icon: LockKeyhole,
    x: 50,
    y: 18,
    metric: 'Secret-safe',
    detail: 'Keys stay server-side or in local Keychain; demos expose deterministic degraded modes when providers are absent.',
  },
  {
    id: 'rag',
    label: 'Evidence RAG',
    category: 'ai',
    icon: DatabaseZap,
    x: 22,
    y: 58,
    metric: 'Cited context',
    detail: 'Local knowledge, public research, and tool output are kept as inspectable artifacts before synthesis.',
  },
  {
    id: 'frontend',
    label: 'Motion UI',
    category: 'frontend',
    icon: Code2,
    x: 80,
    y: 49,
    metric: 'Control proof',
    detail: 'Visuals are backed by real buttons, tabs, filters, sliders, responsive checks, and console/network QA.',
  },
]

export const proofTimeline: ProofItem[] = [
  {
    id: 'ai-soc',
    year: '2026',
    title: 'AI SOC Copilot',
    category: 'security',
    metric: 'Issue RCA in minutes',
    copy: 'Read-only XSIAM evidence recovery with playbook traces, entries, and production-safe reporting.',
  },
  {
    id: 'recruiter-automation',
    year: '2026',
    title: 'Recruiter Automation',
    category: 'automation',
    metric: 'Daily signal loops',
    copy: 'Gmail, LinkedIn, calendar, and local tracker workflows with no-send guardrails and exact draft review.',
  },
  {
    id: 'netlify-demos',
    year: '2026',
    title: 'Netlify Demo Factory',
    category: 'frontend',
    metric: 'Production evidence matrix',
    copy: 'Role-specific React apps deployed to Netlify with health routes, headers, mobile screenshots, and tests.',
  },
  {
    id: 'agent-research',
    year: '2026',
    title: 'Agent Research Workbench',
    category: 'ai',
    metric: 'Parallel lenses',
    copy: 'Research, analysis, and synthesis split into bounded subtasks with durable source notes and fallback paths.',
  },
]

export const qaRequirements = [
  'Production Netlify URL, not localhost',
  'Real Chrome profile final pass',
  'Every visible primary control clicked',
  'Desktop and mobile layouts checked',
  'Console errors and failed requests reviewed',
  'Security headers and CSP checked',
  'Production npm audit recorded',
  'Evidence matrix updated with current proof',
]
