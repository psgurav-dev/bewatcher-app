/**
 * cinema-hall.tsx — React Native + R3F Native (fully fixed)
 *
 * Fixes applied:
 * 1. extend(THREE) — full namespace, eliminates ALL primitive errors
 * 2. onPointerUp on meshes — fixes toggle swallowed by OrbitControls
 * 3. Toggle logic lives in parent via useCallback pattern shown in USAGE
 * 4. Full-screen canvas via Dimensions.get('screen')
 * 5. Red cinematic environment: crimson velvet walls, warm amber/red lighting
 * 6. Wall sconce lights, deep red rim lights, projector warmth from screen
 * 7. Book CTA appears when seats are selected
 */

import React, {
  useRef,
  useCallback,
  useMemo,
  Suspense,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Canvas, useFrame, extend } from '@react-three/fiber/native';
import { OrbitControls } from '@react-three/drei/native';
import * as THREE from 'three';

// ✅ Extend with full THREE namespace — prevents ALL "must be a function" errors
extend(THREE);

// ─── Screen dimensions ────────────────────────────────────────────────────────
const SCREEN = Dimensions.get('screen');

// ─── Types ────────────────────────────────────────────────────────────────────

export type SeatStatus = 'available' | 'selected' | 'occupied';

export interface SeatInfo {
  id: string;
  position: [number, number, number];
  status: SeatStatus;
}

interface CinemaHallProps {
  seats: SeatInfo[];
  onSeatToggle: (seatId: string) => void;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  available: { base: '#1c1c2e', emissive: '#000000', emissiveI: 0 },
  selected:  { base: '#e11d48', emissive: '#9f1239', emissiveI: 0.9 },
  occupied:  { base: '#3a3a4e', emissive: '#000000', emissiveI: 0 },
} as const;

const ARMREST = '#0e0e1c';
const GAP = 1.2;

// ─── SeatMesh ─────────────────────────────────────────────────────────────────

interface SeatMeshProps {
  seatId: string;
  position: [number, number, number];
  status: SeatStatus;
  onToggle: (id: string) => void;
}

const SeatMesh = React.memo(function SeatMesh({
  seatId,
  position,
  status,
  onToggle,
}: SeatMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const isSelected = status === 'selected';
  const isOccupied = status === 'occupied';
  const { base, emissive, emissiveI } = C[status];

  // Smooth float for selected seats — no re-renders
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y = isSelected
      ? position[1] + Math.sin(Date.now() * 0.004) * 0.06
      : position[1];
  });

  // ✅ onPointerUp fires AFTER OrbitControls releases, ensuring taps register
  const handlePointerUp = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!isOccupied) onToggle(seatId);
    },
    [isOccupied, onToggle, seatId],
  );

  return (
    <group ref={groupRef} position={position}>
      {/* Cushion */}
      <mesh castShadow receiveShadow onPointerUp={handlePointerUp}>
        <boxGeometry args={[0.76, 0.13, 0.66]} />
        <meshStandardMaterial
          color={base}
          emissive={emissive}
          emissiveIntensity={emissiveI}
          roughness={0.65}
          metalness={0.2}
        />
      </mesh>

      {/* Back rest */}
      <mesh position={[0, 0.32, -0.29]} castShadow onPointerUp={handlePointerUp}>
        <boxGeometry args={[0.76, 0.52, 0.1]} />
        <meshStandardMaterial
          color={base}
          emissive={emissive}
          emissiveIntensity={emissiveI * 0.5}
          roughness={0.65}
          metalness={0.2}
        />
      </mesh>

      {/* Left armrest */}
      <mesh position={[-0.39, 0.17, 0]}>
        <boxGeometry args={[0.06, 0.22, 0.56]} />
        <meshStandardMaterial color={ARMREST} roughness={0.9} />
      </mesh>

      {/* Right armrest */}
      <mesh position={[0.39, 0.17, 0]}>
        <boxGeometry args={[0.06, 0.22, 0.56]} />
        <meshStandardMaterial color={ARMREST} roughness={0.9} />
      </mesh>

      {/* Crimson under-glow for selected */}
      {isSelected && (
        <pointLight
          color="#e11d48"
          intensity={2.2}
          distance={2.5}
          position={[0, 0.3, 0]}
        />
      )}
    </group>
  );
});

// ─── Cinema Screen ────────────────────────────────────────────────────────────

function CinemaScreen() {
  return (
    <group position={[0, 4, -9.5]}>
      {/* Deep crimson velvet backdrop */}
      <mesh position={[0, 1.5, -0.35]}>
        <planeGeometry args={[28, 16]} />
        <meshStandardMaterial color="#2d0408" roughness={1} />
      </mesh>

      {/* Screen frame */}
      <mesh position={[0, 0, -0.08]}>
        <planeGeometry args={[17.4, 9.4]} />
        <meshStandardMaterial color="#080808" roughness={1} />
      </mesh>

      {/* Screen surface */}
      <mesh receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial
          color="#f5f0ee"
          emissive="#ffffff"
          emissiveIntensity={0.18}
          roughness={0.2}
        />
      </mesh>

      {/* Warm projector spill */}
      <pointLight position={[0, 0, 5]}  color="#ff5533" intensity={3}   distance={22} />
      <pointLight position={[0, 2, 3]}  color="#ffddaa" intensity={1.5} distance={14} />
      <pointLight position={[-6, 0, 4]} color="#cc2200" intensity={1}   distance={12} />
      <pointLight position={[ 6, 0, 4]} color="#cc2200" intensity={1}   distance={12} />
    </group>
  );
}

// ─── Walls ────────────────────────────────────────────────────────────────────

function CinemaWalls({
  colCount,
  rowCount,
}: {
  colCount: number;
  rowCount: number;
}) {
  const W = colCount * GAP + 8;
  const D = rowCount * GAP + 18;
  const H = 12;

  return (
    <>
      {/* Left wall */}
      <mesh position={[-W / 2, H / 2 - 0.5, -3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#250508" roughness={1} side={THREE.BackSide} />
      </mesh>

      {/* Right wall */}
      <mesh position={[W / 2, H / 2 - 0.5, -3]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#250508" roughness={1} side={THREE.BackSide} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, H - 0.5, -3]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#190204" roughness={1} side={THREE.BackSide} />
      </mesh>

      {/* Wall sconces — left side */}
      <pointLight position={[-W / 2 + 0.6, 3.5, -1]} color="#cc1111" intensity={2} distance={7} />
      <pointLight position={[-W / 2 + 0.6, 3.5,  5]} color="#cc1111" intensity={2} distance={7} />

      {/* Wall sconces — right side */}
      <pointLight position={[W / 2 - 0.6, 3.5, -1]} color="#cc1111" intensity={2} distance={7} />
      <pointLight position={[W / 2 - 0.6, 3.5,  5]} color="#cc1111" intensity={2} distance={7} />
    </>
  );
}

// ─── Floor ────────────────────────────────────────────────────────────────────

function Floor({
  colCount,
  rowCount,
}: {
  colCount: number;
  rowCount: number;
}) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.51, 0]}
      receiveShadow
    >
      <planeGeometry args={[colCount * GAP + 10, rowCount * GAP + 20]} />
      <meshStandardMaterial color="#0b0508" roughness={0.95} metalness={0.04} />
    </mesh>
  );
}

// ─── Full Scene ───────────────────────────────────────────────────────────────

interface SceneProps {
  seats: SeatInfo[];
  onSeatToggle: (id: string) => void;
  colCount: number;
  rowCount: number;
}

function Scene({ seats, onSeatToggle, colCount, rowCount }: SceneProps) {
  const offsetX = -((colCount - 1) * GAP) / 2;

  return (
    <>
      {/* Moody crimson ambient */}
      <ambientLight intensity={0.2} color="#ff6040" />

      {/* Main overhead warm spot */}
      <spotLight
        position={[0, 18, 3]}
        angle={0.38}
        penumbra={0.85}
        intensity={2.8}
        color="#ffe8d0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Deep red rim lights */}
      <pointLight position={[-12, 7, 0]} color="#880000" intensity={2.5} distance={22} />
      <pointLight position={[ 12, 7, 0]} color="#880000" intensity={2.5} distance={22} />

      {/* Floor-level mood fill */}
      <pointLight position={[0, 0.5, 6]} color="#550010" intensity={1.2} distance={10} />

      <CinemaScreen />
      <Floor colCount={colCount} rowCount={rowCount} />
      <CinemaWalls colCount={colCount} rowCount={rowCount} />

      <group position={[offsetX, 0, 0]}>
        {seats.map((seat) => (
          <SeatMesh
            key={seat.id}
            seatId={seat.id}
            position={seat.position}
            status={seat.status}
            onToggle={onSeatToggle}
          />
        ))}
      </group>
    </>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function CinemaHall({ seats, onSeatToggle }: CinemaHallProps) {
  const colCount = useMemo(() => {
    let max = 0;
    for (const s of seats) if (s.position[0] > max) max = s.position[0];
    return max + 1;
  }, [seats]);

  const rowCount = useMemo(() => {
    let max = 0;
    for (const s of seats) if (s.position[2] > max) max = s.position[2];
    return max + 1;
  }, [seats]);

  const handleToggle = useCallback(
    (id: string) => onSeatToggle(id),
    [onSeatToggle],
  );

  const selectedCount = useMemo(
    () => seats.filter((s) => s.status === 'selected').length,
    [seats],
  );

  return (
    <View style={styles.root}>
      {/* Full-screen 3-D canvas */}
      <Canvas
        shadows
        dpr={[1, Platform.OS === 'ios' ? 2 : 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 10, 16], fov: 50, near: 0.1, far: 120 }}
        style={StyleSheet.absoluteFill}
      >
        <Suspense fallback={null}>
          <Scene
            seats={seats}
            onSeatToggle={handleToggle}
            colCount={colCount}
            rowCount={rowCount}
          />
          <OrbitControls
            enablePan={false}
            minDistance={7}
            maxDistance={28}
            maxPolarAngle={Math.PI / 2.05}
            minPolarAngle={Math.PI / 8}
            enableDamping
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>

      {/* ── HUD overlays (non-interactive container → pointerEvents box-none) ── */}

      {/* Title */}
      <View style={styles.topBar} pointerEvents="none">
        <Text style={styles.topBarTitle}>SELECT YOUR SEATS</Text>
      </View>

      {/* Legend */}
      <View style={styles.legend} pointerEvents="none">
        {LEGEND.map(({ label, color, border }) => (
          <View key={label} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: color, borderColor: border }]} />
            <Text style={styles.legendLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Book CTA — only when seats selected */}
      {selectedCount > 0 && (
        <View style={styles.ctaWrapper} pointerEvents="box-none">
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.82}>
            <Text style={styles.ctaText}>
              BOOK {selectedCount} SEAT{selectedCount > 1 ? 'S' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Legend config ────────────────────────────────────────────────────────────

const LEGEND = [
  { label: 'Available', color: C.available.base, border: '#3a3a5e' },
  { label: 'Selected',  color: C.selected.base,  border: '#f43f5e' },
  { label: 'Occupied',  color: C.occupied.base,  border: '#55555e' },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    width: SCREEN.width,
    height: SCREEN.height,
    backgroundColor: '#060008',
  },

  topBar: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  topBarTitle: {
    color: 'rgba(255,200,200,0.5)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 5,
  },

  legend: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 18,
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: 'rgba(6,0,8,0.82)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(225,29,72,0.2)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 3,
    borderWidth: 1,
  },
  legendLabel: {
    color: 'rgba(255,200,200,0.5)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },

  ctaWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#e11d48',
    alignItems: 'center',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.65,
    shadowRadius: 18,
    elevation: 14,
  },
  ctaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 3.5,
  },
});
