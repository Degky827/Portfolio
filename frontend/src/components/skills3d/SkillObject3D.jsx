import { lazy, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'

const GlowingCube = lazy(() => import('./shapes/GlowingCube'))
const AtomSphere = lazy(() => import('./shapes/AtomSphere'))
const WaveObject = lazy(() => import('./shapes/WaveObject'))
const HexagonPillar = lazy(() => import('./shapes/HexagonPillar'))
const CrystalPrism = lazy(() => import('./shapes/CrystalPrism'))
const FlameNode = lazy(() => import('./shapes/FlameNode'))
const MetallicSphere = lazy(() => import('./shapes/MetallicSphere'))
const DatabaseColumn = lazy(() => import('./shapes/DatabaseColumn'))
const CloudShape = lazy(() => import('./shapes/CloudShape'))
const EnergyNode = lazy(() => import('./shapes/EnergyNode'))
const ToolChip = lazy(() => import('./shapes/ToolChip'))
const CodeShape = lazy(() => import('./shapes/CodeShape'))
const GridTower = lazy(() => import('./shapes/GridTower'))

const SKILL_SHAPES = {
  javascript: { Component: GlowingCube, color: '#facc15' },
  js: { Component: GlowingCube, color: '#facc15' },
  react: { Component: AtomSphere, color: '#61dafb' },
  'react.js': { Component: AtomSphere, color: '#61dafb' },
  tailwind: { Component: WaveObject, color: '#06b6d4' },
  'tailwind css': { Component: WaveObject, color: '#06b6d4' },
  tailwindcss: { Component: WaveObject, color: '#06b6d4' },
  nodejs: { Component: HexagonPillar, color: '#22c55e' },
  'node.js': { Component: HexagonPillar, color: '#22c55e' },
  node: { Component: HexagonPillar, color: '#22c55e' },
  mongodb: { Component: DatabaseColumn, color: '#8b5cf6' },
  mongo: { Component: DatabaseColumn, color: '#8b5cf6' },
  flutter: { Component: CrystalPrism, color: '#3b82f6' },
  firebase: { Component: FlameNode, color: '#ef4444' },
  git: { Component: FlameNode, color: '#ef4444' },
  github: { Component: MetallicSphere, color: '#6b7280' },
  gitlab: { Component: MetallicSphere, color: '#f97316' },
  docker: { Component: CloudShape, color: '#06b6d4' },
  kubernetes: { Component: CloudShape, color: '#3b82f6' },
  k8s: { Component: CloudShape, color: '#3b82f6' },
  python: { Component: EnergyNode, color: '#facc15' },
  typescript: { Component: CodeShape, color: '#3178c6' },
  ts: { Component: CodeShape, color: '#3178c6' },
  nextjs: { Component: GridTower, color: '#ffffff' },
  'next.js': { Component: GridTower, color: '#ffffff' },
  next: { Component: GridTower, color: '#ffffff' },
  vuejs: { Component: AtomSphere, color: '#22c55e' },
  vue: { Component: AtomSphere, color: '#22c55e' },
  angular: { Component: GlowingCube, color: '#ef4444' },
  svelte: { Component: GlowingCube, color: '#f97316' },
  php: { Component: CodeShape, color: '#8b5cf6' },
  laravel: { Component: FlameNode, color: '#ef4444' },
  ruby: { Component: FlameNode, color: '#ef4444' },
  rails: { Component: FlameNode, color: '#ef4444' },
  java: { Component: HexagonPillar, color: '#f97316' },
  kotlin: { Component: CrystalPrism, color: '#a855f7' },
  go: { Component: HexagonPillar, color: '#06b6d4' },
  golang: { Component: HexagonPillar, color: '#06b6d4' },
  rust: { Component: ToolChip, color: '#f97316' },
  swift: { Component: CrystalPrism, color: '#f97316' },
  dart: { Component: CrystalPrism, color: '#06b6d4' },
  '.net': { Component: GridTower, color: '#6366f1' },
  dotnet: { Component: GridTower, color: '#6366f1' },
  'c#': { Component: GridTower, color: '#6366f1' },
  'c++': { Component: CodeShape, color: '#6366f1' },
  postgresql: { Component: DatabaseColumn, color: '#3b82f6' },
  postgres: { Component: DatabaseColumn, color: '#3b82f6' },
  mysql: { Component: DatabaseColumn, color: '#3b82f6' },
  redis: { Component: DatabaseColumn, color: '#ef4444' },
  sqlite: { Component: DatabaseColumn, color: '#06b6d4' },
  supabase: { Component: CloudShape, color: '#22c55e' },
  express: { Component: HexagonPillar, color: '#ffffff' },
  nestjs: { Component: HexagonPillar, color: '#ef4444' },
  deno: { Component: HexagonPillar, color: '#ffffff' },
  bun: { Component: HexagonPillar, color: '#facc15' },
  graphql: { Component: EnergyNode, color: '#ef4444' },
  figma: { Component: ToolChip, color: '#f97316' },
  'framer motion': { Component: ToolChip, color: '#a855f7' },
  framer: { Component: ToolChip, color: '#a855f7' },
  webpack: { Component: ToolChip, color: '#3178c6' },
  vite: { Component: ToolChip, color: '#a855f7' },
  jest: { Component: GlowingCube, color: '#ef4444' },
  cypress: { Component: GridTower, color: '#22c55e' },
  selenium: { Component: GridTower, color: '#3b82f6' },
  nginx: { Component: HexagonPillar, color: '#22c55e' },
  ansible: { Component: CloudShape, color: '#ef4444' },
  terraform: { Component: CloudShape, color: '#8b5cf6' },
  grafana: { Component: GridTower, color: '#f97316' },
  prometheus: { Component: EnergyNode, color: '#ef4444' },
  linux: { Component: HexagonPillar, color: '#facc15' },
  ubuntu: { Component: HexagonPillar, color: '#f97316' },
  vercel: { Component: CloudShape, color: '#ffffff' },
  netlify: { Component: CloudShape, color: '#06b6d4' },
  heroku: { Component: CloudShape, color: '#a855f7' },
  digitalocean: { Component: CloudShape, color: '#3b82f6' },
  apple: { Component: MetallicSphere, color: '#9ca3af' },
  ios: { Component: MetallicSphere, color: '#9ca3af' },
  android: { Component: CrystalPrism, color: '#22c55e' },
  redux: { Component: AtomSphere, color: '#a855f7' },
  'react router': { Component: GridTower, color: '#ef4444' },
  threejs: { Component: CrystalPrism, color: '#ffffff' },
  electron: { Component: MetallicSphere, color: '#3b82f6' },
  tensorflow: { Component: EnergyNode, color: '#f97316' },
  pytorch: { Component: FlameNode, color: '#ef4444' },
  openai: { Component: EnergyNode, color: '#22c55e' },
  solidity: { Component: EnergyNode, color: '#6366f1' },
}

const DEFAULT_SHAPE = { Component: CodeShape, color: '#6366f1' }

function getShapeForSkill(skillName) {
  if (!skillName) return DEFAULT_SHAPE
  const normalized = skillName.toLowerCase().trim()
  return SKILL_SHAPES[normalized] || DEFAULT_SHAPE
}

export default function SkillObject3D({ skill, isHovered = false, size = 40 }) {
  const skillName = skill?.icon || skill?.name
  const { Component, color } = useMemo(() => getShapeForSkill(skillName), [skillName])

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 30 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[2, 2, 2]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-2, -1, 1]} intensity={0.4} color={color} />
        
        <Suspense fallback={null}>
          <Component color={color} isHovered={isHovered} />
        </Suspense>
      </Canvas>
    </div>
  )
}
