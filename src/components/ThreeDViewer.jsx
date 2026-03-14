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

            {/* --- TABLE MODEL --- */}
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

            {/* --- CHAIR MODEL --- */}
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

            {/* --- SOFA MODEL --- */}
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

            {/* --- BED MODEL --- */}
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

            {/* --- LAMP MODEL --- */}
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

            {/* --- WARDROBE MODEL --- */}
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

            {/* --- SHELF MODEL --- */}
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

            {/* Default Box for unknown types */}
            {!['table', 'chair', 'sofa', 'bed', 'lamp', 'wardrobe', 'shelf'].includes(type) && (
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
        <div className="flex-1 bg-black relative w-full h-full min-h-[500px]">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={40} />
                <color attach="background" args={['#0d1117']} />

                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                <pointLight position={[-10, 5, -10]} intensity={0.4} color="#58a6ff" />

                <Suspense fallback={null}>
                    <Environment preset="city" />
                </Suspense>

                <OrbitControls
                    makeDefault
                    enableDamping
                    minDistance={2}
                    maxDistance={40}
                    maxPolarAngle={Math.PI / 2.1}
                />

                <Room room={state.room} items={state.items} />

                <ContactShadows
                    position={[0, -0.01, 0]}
                    opacity={0.5}
                    scale={20}
                    blur={2.5}
                    far={10}
                />

                <Grid
                    sectionSize={1}
                    sectionColor="#58a6ff"
                    cellSize={0.2}
                    cellColor="#333"
                    infiniteGrid
                    fadeDistance={30}
                    position={[0, 0, 0]}
                />
            </Canvas>

            <div className="absolute bottom-10 left-10 flex gap-4 pointer-events-none select-none">
                <div className="glass px-4 py-3 border border-white/10 rounded-2xl flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-accent font-black tracking-widest uppercase">3D RENDER ENGINE</span>
                        <span className="text-xs text-white/80 font-medium">PRECISION MODELS LOADED</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
