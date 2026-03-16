import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
    OrbitControls,
    PerspectiveCamera,
    Environment,
    ContactShadows,
    RoundedBox,
    Grid,
    Float
} from '@react-three/drei';
import { Box } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- Professional Furniture Components (3D) ---
const FurnitureBox = ({ width, depth, color, position, rotation, type, room }) => {
    // Center items relative to the origin (0,0)
    const pos = [position.x - room.width / 2, 0, position.z - room.length / 2];

    // Define furniture dimensions/structure based on type
    const getStructure = () => {
        switch (type) {
            case 'table':
                return { legHeight: 0.7, topThickness: 0.05, topY: 0.7 };
            case 'chair':
                return { legHeight: 0.45, seatThickness: 0.05, seatY: 0.45, backHeight: 0.5 };
            case 'sofa':
                return { baseHeight: 0.4, backHeight: 0.5 };
            case 'bed':
                return { baseHeight: 0.3, mattressThickness: 0.2, headboardHeight: 0.8 };
            default:
                return { baseHeight: 0.5 };
        }
    };

    const s = getStructure();

    return (
        <group position={pos} rotation={[0, -rotation * (Math.PI / 180), 0]}>

            {/* TABLE MODEL */}
            {type === 'table' && (
                <group>
                    {/* Table Top */}
                    <RoundedBox args={[width, s.topThickness, depth]} radius={0.02} position={[0, s.topY + s.topThickness / 2, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
                    </RoundedBox>
                    {/* Legs */}
                    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
                        <mesh key={i} position={[lx * (width / 2 - 0.05), s.legHeight / 2, lz * (depth / 2 - 0.05)]} castShadow>
                            <boxGeometry args={[0.04, s.legHeight, 0.04]} />
                            <meshStandardMaterial color="#222" roughness={0.5} />
                        </mesh>
                    ))}
                </group>
            )}

            {/* CHAIR MODEL */}
            {type === 'chair' && (
                <group>
                    {/* Seat */}
                    <RoundedBox args={[width, s.seatThickness, depth]} radius={0.02} position={[0, s.seatY, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </RoundedBox>
                    {/* Backrest */}
                    <RoundedBox args={[width, s.backHeight, 0.05]} radius={0.02} position={[0, s.seatY + s.backHeight / 2, -depth / 2 + 0.025]} castShadow>
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </RoundedBox>
                    {/* Legs */}
                    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
                        <mesh key={i} position={[lx * (width / 2 - 0.03), s.legHeight / 2, lz * (depth / 2 - 0.03)]} castShadow>
                            <cylinderGeometry args={[0.02, 0.015, s.legHeight]} />
                            <meshStandardMaterial color="#111" />
                        </mesh>
                    ))}
                </group>
            )}

            {/* SOFA MODEL */}
            {type === 'sofa' && (
                <group>
                    {/* Main Base Seat */}
                    <RoundedBox args={[width, s.baseHeight, depth]} radius={0.05} position={[0, s.baseHeight / 2, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color={color} roughness={0.8} />
                    </RoundedBox>
                    {/* Backrest */}
                    <RoundedBox args={[width, s.backHeight + 0.2, 0.2]} radius={0.1} position={[0, s.baseHeight + 0.1, -depth / 2 + 0.1]} castShadow>
                        <meshStandardMaterial color={color} roughness={0.8} />
                    </RoundedBox>
                    {/* Armrests */}
                    <RoundedBox args={[0.2, s.baseHeight + 0.2, depth]} radius={0.05} position={[-width / 2 + 0.1, s.baseHeight / 2 + 0.1, 0]} castShadow>
                        <meshStandardMaterial color={color} roughness={0.8} />
                    </RoundedBox>
                    <RoundedBox args={[0.2, s.baseHeight + 0.2, depth]} radius={0.05} position={[width / 2 - 0.1, s.baseHeight / 2 + 0.1, 0]} castShadow>
                        <meshStandardMaterial color={color} roughness={0.8} />
                    </RoundedBox>
                </group>
            )}

            {/* BED MODEL */}
            {type === 'bed' && (
                <group>
                    {/* Base Frame */}
                    <RoundedBox args={[width, s.baseHeight, depth]} radius={0.02} position={[0, s.baseHeight / 2, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color="#444" roughness={0.9} />
                    </RoundedBox>
                    {/* Mattress */}
                    <RoundedBox args={[width - 0.05, s.mattressThickness, depth - 0.05]} radius={0.1} position={[0, s.baseHeight + s.mattressThickness / 2, 0]} castShadow>
                        <meshStandardMaterial color={color} roughness={1} />
                    </RoundedBox>
                    {/* Headboard */}
                    <RoundedBox args={[width, s.headboardHeight, 0.1]} radius={0.05} position={[0, s.headboardHeight / 2, -depth / 2 + 0.05]} castShadow>
                        <meshStandardMaterial color="#333" roughness={0.7} />
                    </RoundedBox>
                </group>
            )}

            {/* LAMP MODEL */}
            {type === 'lamp' && (
                <group>
                    {/* Stem */}
                    <mesh position={[0, 0.9, 0]} castShadow>
                        <cylinderGeometry args={[0.015, 0.015, 1.8]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    {/* Base */}
                    <mesh position={[0, 0.02, 0]} receiveShadow>
                        <cylinderGeometry args={[0.2, 0.2, 0.04]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    {/* Shade */}
                    <mesh position={[0, 1.7, 0]} castShadow>
                        <coneGeometry args={[0.25, 0.4, 32]} />
                        <meshStandardMaterial color="#ffcc33" emissive="#ffcc33" emissiveIntensity={1} />
                    </mesh>
                    <pointLight position={[0, 1.7, 0]} intensity={2} color="#ffaa00" distance={10} />
                </group>
            )}

            {/* WARDROBE MODEL */}
            {type === 'wardrobe' && (
                <group>
                    <RoundedBox args={[width, 2.0, depth]} radius={0.02} position={[0, 1.0, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color={color} roughness={0.4} />
                    </RoundedBox>
                    {/* Doors Divide */}
                    <mesh position={[0, 1.0, depth / 2 + 0.005]}>
                        <boxGeometry args={[0.01, 1.9, 0.01]} />
                        <meshStandardMaterial color="#00000033" />
                    </mesh>
                    {/* Handles */}
                    <mesh position={[-0.05, 1.0, depth / 2 + 0.02]}>
                        <sphereGeometry args={[0.02, 16, 16]} />
                        <meshStandardMaterial color="#222" metalness={1} />
                    </mesh>
                    <mesh position={[0.05, 1.0, depth / 2 + 0.02]}>
                        <sphereGeometry args={[0.02, 16, 16]} />
                        <meshStandardMaterial color="#222" metalness={1} />
                    </mesh>
                </group>
            )}

            {/* SHELF MODEL */}
            {type === 'shelf' && (
                <group>
                    <RoundedBox args={[width, 1.8, depth]} radius={0.01} position={[0, 0.9, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color={color} roughness={0.5} />
                    </RoundedBox>
                    {/* Shelves */}
                    {[0.4, 0.8, 1.2, 1.6].map((hy, i) => (
                        <mesh key={i} position={[0, hy, 0.05]}>
                            <boxGeometry args={[width - 0.02, 0.02, depth - 0.02]} />
                            <meshStandardMaterial color="#00000022" />
                        </mesh>
                    ))}
                </group>
            )}

            {/* RUG MODEL */}
            {type === 'rug' && (
                <group>
                    <mesh position={[0, 0.01, 0]} receiveShadow>
                        <boxGeometry args={[width, 0.02, depth]} />
                        <meshStandardMaterial color={color} roughness={0.9} />
                    </mesh>
                </group>
            )}

            {/* DESKTOP MODEL */}
            {type === 'desktop' && (
                <group>
                    {/* Table Base */}
                    <RoundedBox args={[width, 0.05, depth]} radius={0.01} position={[0, 0.75, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color={color} roughness={0.5} />
                    </RoundedBox>
                    {/* Legs */}
                    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
                        <mesh key={i} position={[lx * (width / 2 - 0.05), 0.35, lz * (depth / 2 - 0.05)]} castShadow>
                            <boxGeometry args={[0.04, 0.7, 0.04]} />
                            <meshStandardMaterial color="#222" />
                        </mesh>
                    ))}
                    {/* Monitor */}
                    <RoundedBox args={[0.6, 0.35, 0.05]} radius={0.01} position={[0, 0.75 + 0.3, -depth / 2 + 0.15]} castShadow>
                        <meshStandardMaterial color="#111" />
                    </RoundedBox>
                    <mesh position={[0, 0.75 + 0.15, -depth / 2 + 0.15]} castShadow>
                        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                        <meshStandardMaterial color="#333" />
                    </mesh>
                    <mesh position={[0, 0.75 + 0.025, -depth / 2 + 0.15]} castShadow>
                        <boxGeometry args={[0.2, 0.02, 0.1]} />
                        <meshStandardMaterial color="#333" />
                    </mesh>
                </group>
            )}

            {/* WINDOW/DOOR */}
            {(type === 'window' || type === 'door') && (
                <group>
                    <RoundedBox args={[width, type === 'door' ? 2 : 1.2, depth]} radius={0.01} position={[0, type === 'door' ? 1 : 1.5, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color={color} opacity={type === 'window' ? 0.3 : 1} transparent={type === 'window'} roughness={type === 'window' ? 0.1 : 0.8} />
                    </RoundedBox>
                </group>
            )}

            {/* TV UNIT MODEL */}
            {type === 'tv_unit' && (
                <group>
                    {/* TV Stand Base */}
                    <RoundedBox args={[width, 0.4, depth]} radius={0.02} position={[0, 0.2, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color={color} roughness={0.4} />
                    </RoundedBox>
                    {/* TV Stand Legs */}
                    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
                        <mesh key={i} position={[lx * (width / 2 - 0.1), 0.05, lz * (depth / 2 - 0.1)]} castShadow>
                            <cylinderGeometry args={[0.02, 0.01, 0.1]} />
                            <meshStandardMaterial color="#222" />
                        </mesh>
                    ))}
                    {/* TV Base/Neck */}
                    <mesh position={[0, 0.45, -depth / 2 + 0.1]} castShadow>
                        <boxGeometry args={[0.4, 0.1, 0.1]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    <mesh position={[0, 0.55, -depth / 2 + 0.1]} castShadow>
                        <cylinderGeometry args={[0.03, 0.03, 0.2]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    {/* TV Screen */}
                    <RoundedBox args={[1.5, 0.8, 0.05]} radius={0.01} position={[0, 0.9, -depth / 2 + 0.15]} castShadow>
                        <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.8} />
                    </RoundedBox>
                    {/* TV Inner Display */}
                    <mesh position={[0, 0.9, -depth / 2 + 0.176]}>
                        <planeGeometry args={[1.45, 0.75]} />
                        <meshBasicMaterial color="#020817" />
                    </mesh>
                </group>
            )}

            {/* --- PLANT MODEL --- */}
            {type === 'plant' && (
                <group>
                    {/* Pot */}
                    <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
                        <cylinderGeometry args={[0.15, 0.1, 0.4, 16]} />
                        <meshStandardMaterial color="#8b4513" roughness={0.8} />
                    </mesh>
                    {/* Soil */}
                    <mesh position={[0, 0.39, 0]} receiveShadow>
                        <cylinderGeometry args={[0.14, 0.14, 0.02, 16]} />
                        <meshStandardMaterial color="#3e2723" roughness={1} />
                    </mesh>
                    {/* Leaves / Bush */}
                    <mesh position={[0, 0.6, 0]} castShadow>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>
                    <mesh position={[-0.1, 0.5, 0.1]} castShadow>
                        <sphereGeometry args={[0.2, 16, 16]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>
                    <mesh position={[0.1, 0.7, -0.1]} castShadow>
                        <sphereGeometry args={[0.25, 16, 16]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>
                </group>
            )}

            {/* --- COUNTER/PANTRY MODEL --- */}
            {type === 'counter' && (
                <group>
                    {/* Main Cabinet Base */}
                    <RoundedBox args={[width, 0.85, depth]} radius={0.01} position={[0, 0.425, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </RoundedBox>
                    {/* Counter Top */}
                    <RoundedBox args={[width + 0.04, 0.05, depth + 0.04]} radius={0.01} position={[0, 0.875, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color="#cbd5e0" roughness={0.2} metalness={0.1} />
                    </RoundedBox>

                    {/* Sink Basin */}
                    <mesh position={[-width / 4, 0.88, 0]}>
                        <boxGeometry args={[0.5, 0.05, 0.4]} />
                        <meshStandardMaterial color="#a0aec0" metalness={0.8} roughness={0.2} />
                    </mesh>
                    {/* Faucet */}
                    <mesh position={[-width / 4, 1.0, -0.15]} castShadow>
                        <cylinderGeometry args={[0.01, 0.01, 0.2]} />
                        <meshStandardMaterial color="#cbd5e0" metalness={0.9} roughness={0.1} />
                    </mesh>
                    <mesh position={[-width / 4, 1.1, -0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                        <meshStandardMaterial color="#cbd5e0" metalness={0.9} roughness={0.1} />
                    </mesh>

                    {/* Stove/Cooktop */}
                    <mesh position={[width / 4, 0.905, 0]} castShadow>
                        <boxGeometry args={[0.6, 0.01, 0.5]} />
                        <meshStandardMaterial color="#1a202c" roughness={0.2} />
                    </mesh>
                    {/* Burners */}
                    {[-0.15, 0.15].map((bx, i) => (
                        [-0.12, 0.12].map((bz, j) => (
                            <mesh key={`${i}-${j}`} position={[width / 4 + bx, 0.91, bz]}>
                                <cylinderGeometry args={[0.08, 0.08, 0.01]} />
                                <meshStandardMaterial color="#e53e3e" emissive="#e53e3e" emissiveIntensity={0.5} />
                            </mesh>
                        ))
                    ))}

                    {/* Cabinet Doors (Front) */}
                    {[...Array(4)].map((_, i) => (
                        <mesh key={i} position={[-width / 2 + (width / 4) / 2 + i * (width / 4), 0.425, depth / 2 + 0.01]}>
                            <boxGeometry args={[width / 4 - 0.02, 0.8, 0.02]} />
                            <meshStandardMaterial color="#ffffff22" />
                        </mesh>
                    ))}

                    {/* Door Handles */}
                    {[...Array(4)].map((_, i) => (
                        <mesh key={`handle-${i}`} position={[-width / 2 + (width / 4) / 2 + i * (width / 4) + (i % 2 === 0 ? 0.08 : -0.08), 0.7, depth / 2 + 0.03]} castShadow>
                            <boxGeometry args={[0.02, 0.1, 0.01]} />
                            <meshStandardMaterial color="#a0aec0" metalness={0.8} />
                        </mesh>
                    ))}
                </group>
            )}

            {/* --- REFRIGERATOR MODEL --- */}
            {type === 'fridge' && (
                <group>
                    {/* Main Body */}
                    <RoundedBox args={[width, 1.8, depth]} radius={0.02} position={[0, 0.9, 0]} castShadow receiveShadow>
                        <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
                    </RoundedBox>
                    {/* Top Door (Freezer) */}
                    <RoundedBox args={[width + 0.02, 0.5, 0.05]} radius={0.01} position={[0, 1.5, depth / 2]} castShadow>
                        <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
                    </RoundedBox>
                    {/* Bottom Door (Fridge) */}
                    <RoundedBox args={[width + 0.02, 1.25, 0.05]} radius={0.01} position={[0, 0.625, depth / 2]} castShadow>
                        <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
                    </RoundedBox>
                    {/* Door Split Line */}
                    <mesh position={[0, 1.25, depth / 2 + 0.025]}>
                        <boxGeometry args={[width + 0.02, 0.01, 0.06]} />
                        <meshStandardMaterial color="#00000033" />
                    </mesh>
                    {/* Handles */}
                    <mesh position={[-width / 2 + 0.1, 1.4, depth / 2 + 0.05]} castShadow>
                        <cylinderGeometry args={[0.015, 0.015, 0.3]} />
                        <meshStandardMaterial color="#cbd5e0" metalness={0.9} roughness={0.1} />
                    </mesh>
                    <mesh position={[-width / 2 + 0.1, 0.9, depth / 2 + 0.05]} castShadow>
                        <cylinderGeometry args={[0.015, 0.015, 0.5]} />
                        <meshStandardMaterial color="#cbd5e0" metalness={0.9} roughness={0.1} />
                    </mesh>
                    {/* Bottom Vent */}
                    <mesh position={[0, 0.05, depth / 2]}>
                        <boxGeometry args={[width - 0.1, 0.08, 0.02]} />
                        <meshStandardMaterial color="#1a202c" roughness={0.8} />
                    </mesh>
                </group>
            )}

            {/* Default Box for unknown types */}
            {!['table', 'chair', 'sofa', 'bed', 'lamp', 'wardrobe', 'shelf', 'rug', 'desktop', 'window', 'door', 'tv_unit', 'plant', 'counter', 'fridge'].includes(type) && (
                <RoundedBox args={[width, 0.5, depth]} radius={0.05} position={[0, 0.25, 0]} castShadow>
                    <meshStandardMaterial color={color} />
                </RoundedBox>
            )}
        </group>
    );
};

const Room = ({ room, items }) => {
    const wallHeight = 2.8;
    const wallThickness = 0.2;

    return (
        <group>
            {/* Floor */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <planeGeometry args={[room.width, room.length]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.1} />
            </mesh>

            {/* Walls */}
            <mesh position={[0, wallHeight / 2, -room.length / 2 - wallThickness / 2]} receiveShadow castShadow>
                <boxGeometry args={[room.width + wallThickness * 2, wallHeight, wallThickness]} />
                <meshStandardMaterial color={room.wallColor} roughness={0.8} />
            </mesh>
            <mesh position={[-room.width / 2 - wallThickness / 2, wallHeight / 2, 0]} receiveShadow castShadow>
                <boxGeometry args={[wallThickness, wallHeight, room.length]} />
                <meshStandardMaterial color={room.wallColor} roughness={0.8} />
            </mesh>

            {/* Furniture */}
            {items.map((item) => (
                <FurnitureBox
                    key={item.id}
                    room={room}
                    type={item.type}
                    width={item.width}
                    depth={item.depth}
                    color={item.color}
                    position={{ x: item.x, z: item.y }}
                    rotation={item.rotation}
                />
            ))}
        </group>
    );
};

export const ThreeDViewer = ({ state }) => {
    return (
        <div className="flex-1 bg-black relative w-full h-full min-h-[500px] overflow-hidden mesh-bg">
            <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true, antialias: true }}>
                <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={35} />
                <color attach="background" args={['#05070a']} />

                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                
                {/* Neon Studio Lights */}
                <pointLight position={[-15, 10, -15]} intensity={1.5} color="#3b82f6" />
                <pointLight position={[15, 10, 15]} intensity={1.5} color="#8b92f6" />
                <pointLight position={[0, 5, 20]} intensity={1} color="#f472b6" />

                <Suspense fallback={null}>
                    <Environment preset="night" />
                </Suspense>

                <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={3}
                    maxDistance={60}
                    maxPolarAngle={Math.PI / 2.1}
                />

                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                    <Room room={state.room} items={state.items} />
                </Float>

                <ContactShadows
                    position={[0, -0.01, 0]}
                    opacity={0.6}
                    scale={30}
                    blur={2}
                    far={15}
                />

                <Grid
                    sectionSize={5}
                    sectionColor="#3b82f6"
                    sectionThickness={1.5}
                    cellSize={1}
                    cellColor="#1e293b"
                    cellThickness={0.8}
                    infiniteGrid
                    fadeDistance={50}
                    fadeStrength={10}
                    position={[0, -0.02, 0]}
                />
            </Canvas>

            {/* Premium 3D HUD */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:bottom-12 md:left-12 flex flex-col md:flex-row items-center gap-6 md:gap-10 glass-panel px-6 py-4 md:px-8 md:py-5 rounded-[1.5rem] md:rounded-[2.5rem] border-white/5 backdrop-blur-3xl scale-90 md:scale-100 origin-bottom-left z-40">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center shadow-lg shadow-accent/20">
                        <Box className="text-white" size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] font-outfit">Perspective Engine</span>
                        <div className="flex items-center gap-2">
                             <span className="text-sm text-white font-black font-outfit uppercase">Spatial Studio Mode</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        </div>
                    </div>
                </div>
                
                <div className="w-px h-10 bg-white/5" />
                
                <div className="flex flex-col">
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] font-outfit mb-1">Compute Load</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className={cn("w-3 h-1.5 rounded-full", i < 5 ? "bg-accent/40" : "bg-white/5")} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Corner Versioning */}
            <div className="absolute top-12 right-12 text-right pointer-events-none opacity-40">
                <p className="text-[10px] font-black text-white/40 tracking-[0.4em] uppercase font-outfit">Render_Node_Alpha</p>
                <p className="text-[9px] font-black text-accent-alt/60 font-mono">RX_4492_STUDIO</p>
            </div>
        </div>
    );
};
