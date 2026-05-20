import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Github,
  Moon,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
} from 'lucide-react'
import { proofTimeline, qaRequirements, systemNodes, workflowStages } from './data/studio'
import type { ProofItem, SystemCategory, TimelineCategory, WorkflowStageId } from './data/studio'
import { clamp, formatDensity, prefersReducedMotion } from './lib/motion'

type ThemeMode = 'night' | 'day'
type TimelineFilter = TimelineCategory | 'all'
type SystemFilter = SystemCategory | 'all'
type HealthState = {
  status: string
  mode: string
  provider: string
  capabilities?: Record<string, { live?: boolean }>
}

const navItems = [
  { label: 'Studio', href: '#studio' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Systems', href: '#systems' },
  { label: 'Evidence', href: '#evidence' },
  { label: 'Demo Guide', href: '#guide' },
]

const systemFilters: { label: string; value: SystemFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'AI', value: 'ai' },
  { label: 'Security', value: 'security' },
  { label: 'Automation', value: 'automation' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Live Ops', value: 'live-ops' },
]

const timelineFilters: { label: string; value: TimelineFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'AI', value: 'ai' },
  { label: 'Security', value: 'security' },
  { label: 'Automation', value: 'automation' },
  { label: 'Frontend', value: 'frontend' },
]

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('night')
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion())
  const [activeStage, setActiveStage] = useState<WorkflowStageId>('observe')
  const [workflowPaused, setWorkflowPaused] = useState(false)
  const [systemFilter, setSystemFilter] = useState<SystemFilter>('all')
  const [selectedNodeId, setSelectedNodeId] = useState('agentic-ai')
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('all')
  const [timelineIndex, setTimelineIndex] = useState(0)
  const [density, setDensity] = useState(68)
  const [speed, setSpeed] = useState(58)
  const [intensity, setIntensity] = useState(72)
  const [health, setHealth] = useState<HealthState | null>(null)
  const [status, setStatus] = useState('Studio ready. Motion is running locally.')
  const [walkthrough, setWalkthrough] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/health')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`health ${response.status}`))))
      .then((data: HealthState) => {
        if (active) setHealth(data)
      })
      .catch(() => {
        if (active) setHealth({ status: 'local-preview', mode: 'vite-static', provider: 'none' })
      })
    return () => {
      active = false
    }
  }, [])

  const filteredNodes = useMemo(
    () => systemNodes.filter((node) => systemFilter === 'all' || node.category === systemFilter),
    [systemFilter],
  )
  const selectedNode =
    filteredNodes.find((node) => node.id === selectedNodeId) ?? filteredNodes[0] ?? systemNodes.find((node) => node.id === selectedNodeId) ?? systemNodes[0]

  const filteredTimeline = useMemo(
    () => proofTimeline.filter((item) => timelineFilter === 'all' || item.category === timelineFilter),
    [timelineFilter],
  )
  const activeProof = filteredTimeline[timelineIndex % Math.max(filteredTimeline.length, 1)] ?? proofTimeline[0]

  const activeStageRecord = workflowStages.find((stage) => stage.id === activeStage) ?? workflowStages[0]
  const motionStyle = {
    '--motion-density': density,
    '--motion-speed': speed,
    '--motion-intensity': intensity,
  } as React.CSSProperties

  const startWalkthrough = useCallback(() => {
    setWalkthrough(true)
    setActiveStage('observe')
    setStatus('Walkthrough started. First stop: observe the signal loop.')
    scrollToId('#workflow')
  }, [])

  const resetMotion = useCallback(() => {
    setDensity(68)
    setSpeed(58)
    setIntensity(72)
    setReducedMotion(false)
    setStatus('Motion lab reset to balanced defaults.')
  }, [])

  return (
    <div
      className={`site-shell theme-${themeMode} ${reducedMotion ? 'motion-reduced' : 'motion-full'}`}
      style={motionStyle}
      data-theme-mode={themeMode}
      data-reduced-motion={String(reducedMotion)}
      data-density={density}
      data-speed={speed}
      data-intensity={intensity}
    >
      <a className="skip-link" href="#studio">
        Skip to studio
      </a>
      <Header
        themeMode={themeMode}
        reducedMotion={reducedMotion}
        onThemeChange={setThemeMode}
        onReducedMotionChange={setReducedMotion}
        onStart={startWalkthrough}
      />
      <main>
        <Hero
          themeMode={themeMode}
          reducedMotion={reducedMotion}
          density={density}
          intensity={intensity}
          status={status}
          onStart={startWalkthrough}
          onThemeChange={setThemeMode}
          onStatus={setStatus}
        />
        <SectionCards />
        <WorkflowSection
          activeStage={activeStage}
          activeStageRecord={activeStageRecord}
          paused={workflowPaused || reducedMotion}
          walkthrough={walkthrough}
          onStageChange={(stage) => {
            setActiveStage(stage)
            setStatus(`Workflow stage selected: ${stage}.`)
          }}
          onPauseChange={setWorkflowPaused}
        />
        <SystemsSection
          filter={systemFilter}
          filteredNodes={filteredNodes}
          selectedNode={selectedNode}
          onFilterChange={(filter) => {
            setSystemFilter(filter)
            setSelectedNodeId((current) => {
              const matchingNodes = systemNodes.filter((node) => filter === 'all' || node.category === filter)
              return matchingNodes.some((node) => node.id === current) ? current : matchingNodes[0]?.id ?? systemNodes[0].id
            })
          }}
          onNodeChange={(nodeId) => {
            setSelectedNodeId(nodeId)
            setStatus(`System node selected: ${nodeId}.`)
          }}
        />
        <EvidenceSection
          filter={timelineFilter}
          items={filteredTimeline}
          activeProof={activeProof}
          activeIndex={timelineIndex}
          onFilterChange={(filter) => {
            setTimelineFilter(filter)
            setTimelineIndex(0)
          }}
          onPrevious={() => setTimelineIndex((current) => (current - 1 + filteredTimeline.length) % filteredTimeline.length)}
          onNext={() => setTimelineIndex((current) => (current + 1) % filteredTimeline.length)}
        />
        <MotionLabSection
          density={density}
          speed={speed}
          intensity={intensity}
          reducedMotion={reducedMotion}
          onDensityChange={setDensity}
          onSpeedChange={setSpeed}
          onIntensityChange={setIntensity}
          onReducedMotionChange={setReducedMotion}
          onReset={resetMotion}
        />
        <DemoGuideSection health={health} walkthrough={walkthrough} status={status} />
      </main>
      <Footer />
    </div>
  )
}

type HeaderProps = {
  themeMode: ThemeMode
  reducedMotion: boolean
  onThemeChange: (mode: ThemeMode) => void
  onReducedMotionChange: (enabled: boolean) => void
  onStart: () => void
}

function Header({ themeMode, reducedMotion, onThemeChange, onReducedMotionChange, onStart }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#studio" aria-label="Shanto Systems Studio home">
        <span className="brand-mark" aria-hidden="true">
          <span />
          <span />
        </span>
        <span>
          Shanto Systems
          <b>Studio</b>
        </span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="icon-toggle"
          type="button"
          aria-pressed={reducedMotion}
          aria-label={reducedMotion ? 'Use full motion' : 'Use reduced motion'}
          onClick={() => onReducedMotionChange(!reducedMotion)}
        >
          {reducedMotion ? <Play size={18} /> : <Pause size={18} />}
          <span>Motion</span>
        </button>
        <ThemeSwitch value={themeMode} onChange={onThemeChange} />
        <button className="primary-button" type="button" onClick={onStart}>
          Start Walkthrough
          <ArrowRight size={18} />
        </button>
      </div>
    </header>
  )
}

function ThemeSwitch({ value, onChange }: { value: ThemeMode; onChange: (mode: ThemeMode) => void }) {
  const isDay = value === 'day'
  return (
    <button
      className="theme-switch"
      type="button"
      aria-label={isDay ? 'Switch to night mode' : 'Switch to day mode'}
      aria-pressed={isDay}
      onClick={() => onChange(isDay ? 'night' : 'day')}
    >
      <Moon size={17} />
      <span className="switch-track" aria-hidden="true">
        <span />
      </span>
      <Sun size={17} />
      <b>{isDay ? 'Day' : 'Night'}</b>
    </button>
  )
}

type HeroProps = {
  themeMode: ThemeMode
  reducedMotion: boolean
  density: number
  intensity: number
  status: string
  onStart: () => void
  onThemeChange: (mode: ThemeMode) => void
  onStatus: (status: string) => void
}

function Hero({ themeMode, reducedMotion, density, intensity, status, onStart, onThemeChange, onStatus }: HeroProps) {
  const [dragPosition, setDragPosition] = useState(50)
  const splitRef = useRef<HTMLDivElement | null>(null)

  const updateSplit = useCallback((clientX: number) => {
    const box = splitRef.current?.getBoundingClientRect()
    if (!box) return
    const next = clamp(((clientX - box.left) / box.width) * 100, 18, 82)
    setDragPosition(next)
  }, [])

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.buttons !== 1) return
      updateSplit(event.clientX)
      onStatus('Hero split dragged. Dark and day motion states are blended.')
    },
    [onStatus, updateSplit],
  )

  return (
    <section className="hero-section" id="studio" aria-labelledby="hero-title">
      <div className="hero-media" ref={splitRef} onPointerMove={onPointerMove}>
        <video
          className="hero-video hero-video-night"
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          poster="/assets/hero-dark.jpg"
          data-active={themeMode === 'night'}
          aria-hidden="true"
        >
          <source src="/assets/hero-dark-motion.mp4" type="video/mp4" />
        </video>
        <video
          className="hero-video hero-video-day"
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          poster="/assets/hero-light.jpg"
          style={{ clipPath: `inset(0 0 0 ${dragPosition}%)` }}
          data-active={themeMode === 'day'}
          aria-hidden="true"
        >
          <source src="/assets/hero-light-motion.mp4" type="video/mp4" />
        </video>
        <SignalCanvas density={density} intensity={intensity} reducedMotion={reducedMotion} />
        <div className="split-line" style={{ left: `${dragPosition}%` }} aria-hidden="true">
          <button
            type="button"
            aria-label="Drag day and night split"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              updateSplit(event.clientX)
            }}
            onPointerMove={(event) => {
              if (event.buttons === 1) updateSplit(event.clientX)
            }}
          >
            <ChevronLeft size={18} />
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="hero-scrim" aria-hidden="true" />
      </div>

      <div className="hero-index" aria-hidden="true">
        <span>01</span>
        <i />
        <span>06</span>
      </div>
      <div className="hero-copy">
        <h1 id="hero-title">
          <span>Intelligence.</span>
          <span>Automation.</span>
          <em>Outcomes.</em>
        </h1>
        <p>
          We design and operate agentic systems that observe signals, reason over context, act with precision, and verify with
          measurable proof.
        </p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={onStart}>
            Start Walkthrough
            <ArrowRight size={18} />
          </button>
          <button className="secondary-button" type="button" onClick={() => scrollToId('#systems')}>
            Explore Systems
            <CircleDot size={17} />
          </button>
        </div>
      </div>
      <div className="hero-tags" aria-label="Workflow stages visible in the hero">
        {workflowStages.map((stage) => (
          <button
            className={`floating-tag floating-tag-${stage.id}`}
            type="button"
            key={stage.id}
            onClick={() => {
              onStatus(`Hero marker selected: ${stage.label}.`)
              scrollToId('#workflow')
            }}
          >
            {stage.label}
          </button>
        ))}
      </div>
      <div className="hero-status" aria-live="polite">
        <span />
        <strong>Systems online</strong>
        <p>{status}</p>
      </div>
      <article className="operator-card" aria-label="Shanto Mathew profile">
        <img src="/assets/shanto-linkedin.jpg" alt="Shanto Mathew" width="96" height="96" />
        <div>
          <span>Builder operator</span>
          <strong>Shanto Mathew</strong>
          <p>Agentic AI and security automation systems.</p>
        </div>
      </article>
      <div className="hero-mode-panel">
        <span>Transition</span>
        <button type="button" aria-pressed={themeMode === 'night'} onClick={() => onThemeChange('night')}>
          Night
        </button>
        <button type="button" aria-pressed={themeMode === 'day'} onClick={() => onThemeChange('day')}>
          Day
        </button>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span />
        Scroll to explore
      </div>
    </section>
  )
}

function SignalCanvas({ density, intensity, reducedMotion }: { density: number; intensity: number; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let frame = 0
    let animation = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      const box = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(box.width * dpr))
      canvas.height = Math.max(1, Math.floor(box.height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const draw = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      context.clearRect(0, 0, width, height)
      const nodeCount = Math.round(14 + density / 5)
      for (let index = 0; index < nodeCount; index += 1) {
        const phase = frame * 0.008 + index * 0.74
        const x = (width * (0.22 + ((index * 37) % 70) / 100)) % width
        const y = height * (0.2 + ((index * 19) % 58) / 100) + Math.sin(phase) * 14
        const radius = 1.4 + (intensity / 120) * (1 + Math.sin(phase))
        context.globalAlpha = 0.18 + intensity / 380
        context.fillStyle = index % 4 === 0 ? '#63ef8f' : index % 3 === 0 ? '#ffb34c' : '#00d9ff'
        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fill()
        if (index > 0) {
          const x2 = (width * (0.18 + (((index - 1) * 37) % 74) / 100)) % width
          const y2 = height * (0.2 + (((index - 1) * 19) % 58) / 100) + Math.cos(phase) * 12
          context.globalAlpha = 0.05 + intensity / 900
          context.strokeStyle = '#91f7ff'
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(x, y)
          context.lineTo(x2, y2)
          context.stroke()
        }
      }
      canvas.dataset.renderFrames = String(frame)
      frame += 1
      if (!reducedMotion) animation = requestAnimationFrame(draw)
    }
    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animation)
      window.removeEventListener('resize', resize)
    }
  }, [density, intensity, reducedMotion])

  return <canvas ref={canvasRef} className="signal-canvas" aria-label="Decorative motion signal field" data-render-frames="0" />
}

function SectionCards() {
  const cards = [
    { id: '02', title: 'Observe. Plan. Act. Verify.', text: 'A closed loop of intelligence turns signal into outcomes.', href: '#workflow' },
    { id: '03', title: 'Interactive Systems', text: 'Explore the connected systems that power automation at scale.', href: '#systems' },
    { id: '04', title: 'Proof of Impact', text: 'Real projects. Measurable outcomes. Verifiable at every step.', href: '#evidence' },
    { id: '05', title: 'Tune the Experience', text: 'Adjust motion, speed, and intensity to your preference.', href: '#motion-lab' },
  ]
  return (
    <section className="section-cards" aria-label="Studio sections">
      {cards.map((card) => (
        <article className="section-card" key={card.id}>
          <span>{card.id}</span>
          <h2>{card.title}</h2>
          <p>{card.text}</p>
          <a href={card.href}>
            Open
            <ArrowRight size={16} />
          </a>
        </article>
      ))}
    </section>
  )
}

function WorkflowSection({
  activeStage,
  activeStageRecord,
  paused,
  walkthrough,
  onStageChange,
  onPauseChange,
}: {
  activeStage: WorkflowStageId
  activeStageRecord: (typeof workflowStages)[number]
  paused: boolean
  walkthrough: boolean
  onStageChange: (stage: WorkflowStageId) => void
  onPauseChange: (paused: boolean) => void
}) {
  return (
    <section className="workflow-section" id="workflow" aria-labelledby="workflow-title" data-walkthrough={walkthrough}>
      <div className="section-copy">
        <span>02 Workflow</span>
        <h2 id="workflow-title">A motion loop for real agent work.</h2>
        <p>
          The tutorial method becomes a production story here: start with a strong visual state, make the transition tactile, then improve
          every section until the workflow reads without explanation.
        </p>
      </div>
      <div className="workflow-grid">
        <div className="loop-stage" data-paused={paused}>
          {workflowStages.map((stage, index) => {
            const Icon = stage.icon
            return (
              <button
                type="button"
                className={`loop-node loop-node-${stage.tone}`}
                aria-pressed={activeStage === stage.id}
                style={{ '--node-index': index } as React.CSSProperties}
                onClick={() => onStageChange(stage.id)}
                key={stage.id}
              >
                <Icon size={24} />
                <span>{stage.label}</span>
              </button>
            )
          })}
          <div className="loop-core" aria-hidden="true">
            <ShieldCheck size={34} />
          </div>
        </div>
        <article className={`workflow-detail workflow-detail-${activeStageRecord.tone}`}>
          <span>{activeStageRecord.label}</span>
          <h3>{activeStageRecord.headline}</h3>
          <p>{activeStageRecord.copy}</p>
          <strong>{activeStageRecord.proof}</strong>
          <div className="workflow-controls">
            <button type="button" className="secondary-button" onClick={() => onPauseChange(!paused)} aria-pressed={paused}>
              {paused ? <Play size={17} /> : <Pause size={17} />}
              {paused ? 'Replay loop' : 'Pause loop'}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                const current = workflowStages.findIndex((stage) => stage.id === activeStage)
                onStageChange(workflowStages[(current + 1) % workflowStages.length].id)
              }}
            >
              Next stage
              <ArrowRight size={17} />
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}

function SystemsSection({
  filter,
  filteredNodes,
  selectedNode,
  onFilterChange,
  onNodeChange,
}: {
  filter: SystemFilter
  filteredNodes: typeof systemNodes
  selectedNode: (typeof systemNodes)[number]
  onFilterChange: (filter: SystemFilter) => void
  onNodeChange: (nodeId: string) => void
}) {
  return (
    <section className="systems-section" id="systems" aria-labelledby="systems-title">
      <div className="section-copy compact">
        <span>03 Systems</span>
        <h2 id="systems-title">Interactive systems map.</h2>
        <p>Click a node or filter a discipline. The graphic is motion-first, but every object is a real control.</p>
      </div>
      <SegmentedControl
        label="System filters"
        items={systemFilters}
        value={filter}
        onChange={onFilterChange}
      />
      <div className="systems-board">
        <div className="systems-map" aria-label="Interactive systems nodes">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            {filteredNodes.map((node) => (
              <line key={`${node.id}-line`} x1="50" y1="49" x2={node.x} y2={node.y} />
            ))}
          </svg>
          {filteredNodes.map((node) => {
            const Icon = node.icon
            return (
              <button
                className="system-node"
                type="button"
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                aria-pressed={selectedNode.id === node.id}
                onClick={() => onNodeChange(node.id)}
              >
                <Icon size={22} />
                <span>{node.label}</span>
              </button>
            )
          })}
        </div>
        <article className="system-detail">
          <span>{selectedNode.category}</span>
          <h3>{selectedNode.label}</h3>
          <strong>{selectedNode.metric}</strong>
          <p>{selectedNode.detail}</p>
        </article>
      </div>
    </section>
  )
}

function EvidenceSection({
  filter,
  items,
  activeProof,
  activeIndex,
  onFilterChange,
  onPrevious,
  onNext,
}: {
  filter: TimelineFilter
  items: ProofItem[]
  activeProof: ProofItem
  activeIndex: number
  onFilterChange: (filter: TimelineFilter) => void
  onPrevious: () => void
  onNext: () => void
}) {
  return (
    <section className="evidence-section" id="evidence" aria-labelledby="evidence-title">
      <div className="section-copy compact">
        <span>04 Evidence</span>
        <h2 id="evidence-title">Proof timeline with measurable outcomes.</h2>
        <p>The site does not hide behind visuals. Each motion beat points back to real verification habits.</p>
      </div>
      <SegmentedControl
        label="Timeline filters"
        items={timelineFilters}
        value={filter}
        onChange={onFilterChange}
      />
      <div className="timeline-shell">
        <button type="button" className="round-button" onClick={onPrevious} aria-label="Previous proof item">
          <ChevronLeft size={22} />
        </button>
        <article className="proof-card">
          <span>{activeProof.year}</span>
          <h3>{activeProof.title}</h3>
          <strong>{activeProof.metric}</strong>
          <p>{activeProof.copy}</p>
          <div className="timeline-progress" aria-label={`${activeIndex + 1} of ${items.length}`}>
            {items.map((item, index) => (
              <i key={item.id} data-active={index === activeIndex % items.length} />
            ))}
          </div>
        </article>
        <button type="button" className="round-button" onClick={onNext} aria-label="Next proof item">
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  )
}

function MotionLabSection({
  density,
  speed,
  intensity,
  reducedMotion,
  onDensityChange,
  onSpeedChange,
  onIntensityChange,
  onReducedMotionChange,
  onReset,
}: {
  density: number
  speed: number
  intensity: number
  reducedMotion: boolean
  onDensityChange: (value: number) => void
  onSpeedChange: (value: number) => void
  onIntensityChange: (value: number) => void
  onReducedMotionChange: (value: boolean) => void
  onReset: () => void
}) {
  return (
    <section className="motion-lab-section" id="motion-lab" aria-labelledby="motion-lab-title">
      <div className="section-copy compact">
        <span>05 Motion Lab</span>
        <h2 id="motion-lab-title">Tune the experience without breaking the system.</h2>
        <p>Motion is a product control here. Use the sliders to change density, speed, and background intensity.</p>
      </div>
      <div className="motion-lab-grid">
        <div className="motion-preview" aria-hidden="true">
          <span />
          <span />
          <span />
          <b>{formatDensity(density)}</b>
        </div>
        <div className="motion-controls">
          <Slider label="Motion density" value={density} onChange={onDensityChange} />
          <Slider label="Animation speed" value={speed} onChange={onSpeedChange} />
          <Slider label="Background intensity" value={intensity} onChange={onIntensityChange} />
          <label className="toggle-row">
            <span>
              <b>Reduce Motion</b>
              <small>Disable long transforms and video-driven animation.</small>
            </span>
            <input type="checkbox" checked={reducedMotion} onChange={(event) => onReducedMotionChange(event.target.checked)} />
          </label>
          <button type="button" className="secondary-button" onClick={onReset}>
            <RefreshCw size={17} />
            Reset motion settings
          </button>
        </div>
      </div>
    </section>
  )
}

function DemoGuideSection({ health, walkthrough, status }: { health: HealthState | null; walkthrough: boolean; status: string }) {
  return (
    <section className="guide-section" id="guide" aria-labelledby="guide-title">
      <div className="section-copy compact">
        <span>06 Demo Guide</span>
        <h2 id="guide-title">Run the site like a reviewer.</h2>
        <p>The guide is built into the app so the deployed URL can stand alone during a review or interview.</p>
      </div>
      <div className="guide-grid">
        <article className="guide-panel">
          <h3>Walkthrough</h3>
          <ol>
            <li data-active={walkthrough}>Start Walkthrough from the hero.</li>
            <li>Switch between Night and Day to inspect the paired media transition.</li>
            <li>Open Workflow, click Observe, Plan, Act, and Verify.</li>
            <li>Filter the Systems map and select each visible node.</li>
            <li>Filter Evidence, use previous and next, then tune Motion Lab.</li>
          </ol>
        </article>
        <article className="guide-panel">
          <h3>System status</h3>
          <div className="guide-profile">
            <img src="/assets/shanto-linkedin.jpg" alt="Shanto Mathew" width="56" height="56" />
            <span>
              <b>Shanto Mathew</b>
              <small>LinkedIn profile photo loaded locally</small>
            </span>
          </div>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{health?.status ?? 'checking'}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{health?.mode ?? 'loading'}</dd>
            </div>
            <div>
              <dt>Provider</dt>
              <dd>{health?.provider ?? 'none'}</dd>
            </div>
          </dl>
          <p aria-live="polite">{status}</p>
        </article>
        <article className="guide-panel">
          <h3>Release checklist</h3>
          <ul>
            {qaRequirements.map((requirement) => (
              <li key={requirement}>
                <CheckCircle2 size={17} />
                {requirement}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="range-control">
      <span>
        <b>{label}</b>
        <output aria-label={`${label} value`}>{value}</output>
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

function SegmentedControl<T extends string>({
  label,
  items,
  value,
  onChange,
}: {
  label: string
  items: { label: string; value: T }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="segmented-control" role="group" aria-label={label}>
      {items.map((item) => (
        <button type="button" aria-pressed={value === item.value} onClick={() => onChange(item.value)} key={item.value}>
          {item.label}
        </button>
      ))}
    </div>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>Shanto Systems Studio</span>
      <a href="https://github.com/shanto12/shanto-systems-studio" rel="noreferrer">
        <Github size={17} />
        GitHub
      </a>
      <a href="#guide">
        <SlidersHorizontal size={17} />
        Evidence Matrix
      </a>
    </footer>
  )
}

export default App
