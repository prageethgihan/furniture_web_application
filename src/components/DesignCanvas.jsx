import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    RotateCcw,
    Trash2,
    Move,
    Scaling,
    RefreshCw,
    Info,
    Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const DesignCanvas = ({ state, updateState, pushToHistory }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [hoveredId, setHoveredId] = useState(null);
    const [zoom, setZoom] = useState(80); // Pixels per meter

    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const { room, items } = state;
    const isNewDesign = items.length === 0;

    // Constants
    const PIXELS_PER_METER = zoom;

    const getMousePosition = (e) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const CTM = svgRef.current.getScreenCTM();
        if (!CTM) return { x: 0, y: 0 };

        // CTM maps SVG coordinates to screen coordinates
        // To get SVG coordinates from screen, we use: (Screen - Offset) / Scale
        // CTM.a is the scale, CTM.e is the offset
        const x = (e.clientX - CTM.e) / CTM.a;
        const y = (e.clientY - CTM.f) / CTM.d;

        // Note: We DO NOT divide by PIXELS_PER_METER here because the viewBox 
        // is already set to the meter dimensions (e.g., 0 0 8 8).
        // The CTM already takes care of the mapping from pixels to meters.
        return { x, y };
    };

    const handlePointerDown = (e, item) => {
        e.stopPropagation();
        setSelectedId(item.id);
        setIsDragging(true);

        // Capture pointer to ensure move/up events are caught even if mouse leaves the SVG
        e.currentTarget.setPointerCapture(e.pointerId);

        const point = getMousePosition(e);
        // dragOffset is the distance from item's center to the point where user clicked
        setDragOffset({
            x: point.x - item.x,
            y: point.y - item.y
        });
    };

    const handlePointerMove = (e) => {
        if (!isDragging || !selectedId) return;

        const point = getMousePosition(e);

        // Calculate new position based on click point relative to center
        // Round to 0.05m (5cm) steps
        const newX = Math.round((point.x - dragOffset.x) * 20) / 20;
        const newY = Math.round((point.y - dragOffset.y) * 20) / 20;

        // Constraint within room boundaries
        const constrainedX = Math.max(0, Math.min(room.width, newX));
        const constrainedY = Math.max(0, Math.min(room.length, newY));

        // Use functional update to avoid stale state issues during fast movement
        updateState(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === selectedId
                    ? { ...item, x: constrainedX, y: constrainedY }
                    : item
            )
        }));
    };

    const handlePointerUp = (e) => {
        if (isDragging) {
            setIsDragging(false);
            // After drag is finished, commit the final state to history
            pushToHistory(state);

            try {
                if (e.pointerId !== undefined) {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                }
            } catch (err) {
                // Ignore capture release errors
            }
        }
    };

    const removeItem = (id) => {
        const newState = {
            ...state,
            items: state.items.filter(item => item.id !== id)
        };
        updateState(newState);
        pushToHistory(newState);
        setSelectedId(null);
    };

    const duplicateItem = (id) => {
        const itemToDuplicate = state.items.find(item => item.id === id);
        if (!itemToDuplicate) return;

        const newItem = {
            ...itemToDuplicate,
            id: Date.now().toString(),
            x: Math.min(room.width, itemToDuplicate.x + 0.4),
            y: Math.min(room.length, itemToDuplicate.y + 0.4),
        };

        const newState = {
            ...state,
            items: [...state.items, newItem]
        };
        updateState(newState);
        pushToHistory(newState);
        setSelectedId(newItem.id);
    };

    const rotateItem = (id) => {
        const newState = {
            ...state,
            items: state.items.map(item =>
                item.id === id
                    ? { ...item, rotation: (item.rotation + 45) % 360 }
                    : item
            )
        };
        updateState(newState);
        pushToHistory(newState);
    };

    const renderFurnitureShape = (item) => {
        const color = item.color;
        switch (item.type) {
            case 'sofa':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.1" fill={color} />
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={0.15} rx="0.05" fill="#00000033" />
                        <rect x={-item.width / 2} y={-item.depth / 2} width={0.15} height={item.depth} rx="0.05" fill="#00000033" />
                        <rect x={item.width / 2 - 0.15} y={-item.depth / 2} width={0.15} height={item.depth} rx="0.05" fill="#00000033" />
                    </g>
                );
            case 'table':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.05" fill={color} />
                        <rect x={-item.width / 2 + 0.05} y={-item.depth / 2 + 0.05} width={item.width - 0.1} height={item.depth - 0.1} rx="0.02" fill="none" stroke="#ffffff22" strokeWidth="0.01" />
                    </g>
                );
            case 'bed':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.05" fill={color} />
                        <rect x={-item.width / 2 + 0.2} y={-item.depth / 2 + 0.1} width={item.width / 2 - 0.3} height={0.4} rx="0.05" fill="#ffffff22" />
                        <rect x={0.1} y={-item.depth / 2 + 0.1} width={item.width / 2 - 0.3} height={0.4} rx="0.05" fill="#ffffff22" />
                    </g>
                );
            case 'chair':
                return (
                    <circle r={item.width / 2} fill={color} />
                );
            case 'wardrobe':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.02" fill={color} />
                        <rect x={-item.width / 2 + 0.05} y={-item.depth / 2 + 0.05} width={item.width - 0.1} height={item.depth - 0.1} fill="none" stroke="#ffffff22" strokeWidth="0.01" />
                        <line x1={0} y1={-item.depth / 2} x2={0} y2={item.depth / 2} stroke="#00000033" strokeWidth="0.02" />
                        <circle cx={-0.05} cy={0} r="0.03" fill="#00000044" />
                        <circle cx={0.05} cy={0} r="0.03" fill="#00000044" />
                    </g>
                );
            case 'shelf':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.01" fill={color} />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <rect key={i} x={-item.width / 2 + 0.1 + (i * 0.2)} y={-item.depth / 2 + 0.05} width={0.15} height={item.depth - 0.1} fill="#ffffff11" />
                        ))}
                    </g>
                );
            case 'lamp':
                return (
                    <g>
                        <circle r={item.width / 2} fill={color} />
                        <circle r={item.width / 4} fill="#ffffff66" />
                        <circle r={0.02} fill="white" />
                    </g>
                );
            case 'rug':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.1" fill={color} opacity="0.8" />
                        <rect x={-item.width / 2 + 0.05} y={-item.depth / 2 + 0.05} width={item.width - 0.1} height={item.depth - 0.1} rx="0.08" fill="none" stroke="#00000033" strokeDasharray="0.1 0.1" strokeWidth="0.02" />
                    </g>
                );
            case 'desktop':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.02" fill={color} />
                        <rect x={-0.3} y={-item.depth / 2 + 0.1} width={0.6} height={0.05} rx="0.01" fill="#ffffff" />
                        <rect x={-0.2} y={0.1} width={0.4} height={0.15} rx="0.02" fill="#ffffff33" />
                        <circle cx={0.3} cy={0.15} r={0.05} fill="#ffffff33" />
                    </g>
                );
            case 'window':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} fill={color} opacity="0.6" />
                        <line x1={-item.width / 2} y1={0} x2={item.width / 2} y2={0} stroke="#ffffff" strokeWidth="0.02" />
                        <line x1={0} y1={-item.depth / 2} x2={0} y2={item.depth / 2} stroke="#ffffff" strokeWidth="0.02" />
                    </g>
                );
            case 'tv_unit':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.05" fill={color} />
                        <rect x={-item.width / 2 + 0.05} y={-item.depth / 2 + 0.05} width={item.width - 0.1} height={item.depth - 0.1} rx="0.02" fill="none" stroke="#ffffff22" strokeWidth="0.01" />
                        <rect x={-0.6} y={-item.depth / 2 + 0.1} width={1.2} height={0.05} fill="#111" />
                        <rect x={-0.7} y={-item.depth / 2 + 0.15} width={1.4} height={0.1} rx="0.02" fill="#0a0a0a" />
                    </g>
                );
            case 'door':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} fill={color} />
                        <path d={`M ${-item.width / 2} ${item.depth / 2} A ${item.width} ${item.width} 0 0 1 ${item.width / 2} ${-item.width + item.depth / 2} L ${-item.width / 2} ${-item.width + item.depth / 2} Z`} fill="none" stroke="#00000044" strokeWidth="0.02" strokeDasharray="0.05 0.05" />
                    </g>
                );
            case 'plant':
                return (
                    <g>
                        <circle r={item.width / 3} fill="#8b4513" />
                        <circle r={item.width / 3 - 0.02} fill="#3e2723" />
                        <path d={`M 0 0 Q ${-item.width / 2} ${-item.depth / 2} 0 ${-item.depth / 2} Q ${item.width / 2} ${-item.depth / 2} 0 0`} fill={color} />
                        <path d={`M 0 0 Q ${item.width / 2} ${-item.depth / 2} ${item.width / 2} 0 Q ${item.width / 2} ${item.depth / 2} 0 0`} fill={color} />
                        <path d={`M 0 0 Q ${item.width / 2} ${item.depth / 2} 0 ${item.depth / 2} Q ${-item.width / 2} ${item.depth / 2} 0 0`} fill={color} />
                        <path d={`M 0 0 Q ${-item.width / 2} ${item.depth / 2} ${-item.width / 2} 0 Q ${-item.width / 2} ${-item.depth / 2} 0 0`} fill={color} opacity="0.8" />
                    </g>
                );
            case 'counter':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.02" fill={color} />
                        {/* Sink */}
                        <rect x={-item.width / 4 - 0.2} y={-0.15} width={0.4} height={0.3} rx="0.05" fill="#a0aec0" />
                        <circle cx={-item.width / 4} cy={0} r={0.05} fill="#718096" />
                        {/* Stove top */}
                        <rect x={item.width / 4 - 0.25} y={-0.2} width={0.5} height={0.4} rx="0.02" fill="#2d3748" />
                        <circle cx={item.width / 4 - 0.12} cy={-0.08} r={0.08} fill="#e53e3e" />
                        <circle cx={item.width / 4 + 0.12} cy={-0.08} r={0.08} fill="#e53e3e" />
                        <circle cx={item.width / 4 - 0.12} cy={0.12} r={0.06} fill="#e53e3e" />
                        <circle cx={item.width / 4 + 0.12} cy={0.12} r={0.06} fill="#e53e3e" />
                    </g>
                );
            case 'fridge':
                return (
                    <g>
                        <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.05" fill={color} />
                        {/* Door split */}
                        <line x1={0} y1={-item.depth / 2} x2={0} y2={item.depth / 2} stroke="#00000033" strokeWidth="0.02" />
                        {/* Handles */}
                        <rect x={-0.1} y={-item.depth / 2 + 0.05} width={0.02} height={0.3} rx="0.01" fill="#718096" />
                        <rect x={0.08} y={-item.depth / 2 + 0.05} width={0.02} height={0.3} rx="0.01" fill="#718096" />
                        {/* Top vent / detail */}
                        <rect x={-item.width / 2 + 0.05} y={-item.depth / 2 + 0.02} width={item.width - 0.1} height={0.02} rx="0.01" fill="#00000022" />
                    </g>
                );
            default:
                return <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.05" fill={color} />;
        }
    };

    const selectedItem = useMemo(() => items.find(i => i.id === selectedId), [items, selectedId]);

    return (
        <div
            className="relative w-full h-full bg-[#05070a] flex flex-col overflow-hidden"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ touchAction: 'none' }}
        >
            {/* Ambient Background Grid (Fixed) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0"
                style={{ backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px)', backgroundSize: `${zoom}px ${zoom}px` }} />

            {/* Scrollable Workspace Area */}
            <div
                ref={containerRef}
                className="absolute inset-0 overflow-auto scrollbar-premium flex flex-col z-10"
                onClick={() => setSelectedId(null)}
            >
                {/* Centering Wrapper with generous padding to ensure room to scroll */}
                <div className="min-w-max min-h-full flex items-center justify-center p-[20vw]">
                    {/* Workspace Grid Container */}
                    <div
                        className="relative shadow-[0_50px_100px_rgba(0,0,0,0.9)] rounded-[2rem] md:rounded-[3.5rem] border border-white/10 bg-[#0a0c10] flex items-center justify-center transition-all duration-300"
                        style={{
                            width: `${room.width * zoom}px`,
                            height: `${room.length * zoom}px`,
                            overflow: 'visible'
                        }}
                    >
                        {/* Internal Texture Overlay */}
                        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] rounded-[2rem] md:rounded-[3.5rem] pointer-events-none overflow-hidden" />

                        <svg
                            ref={svgRef}
                            viewBox={`0 0 ${room.width} ${room.length}`}
                            preserveAspectRatio="xMidYMid meet"
                            className="w-full h-full bg-[#0f1218] transition-all duration-300 overflow-visible relative z-10 p-4 sm:p-6 md:p-8 lg:p-10 rounded-[1.5rem] md:rounded-[3rem]"
                            style={{ cursor: isDragging ? 'grabbing' : 'default' }}
                        >
                            <defs>
                                <pattern id="dot-grid" width="1" height="1" patternUnits="userSpaceOnUse">
                                    <circle cx="0.05" cy="0.05" r="0.03" fill="rgba(255,255,255,0.08)" />
                                </pattern>
                                <pattern id="fine-dots" width="0.2" height="0.2" patternUnits="userSpaceOnUse">
                                    <circle cx="0.02" cy="0.02" r="0.01" fill="rgba(255,255,255,0.03)" />
                                </pattern>
                                <linearGradient id="wall-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                                    <stop offset="100%" stopColor="rgba(139, 92, 246, 0.2)" />
                                </linearGradient>
                            </defs>

                            <rect width="100%" height="100%" fill="url(#fine-dots)" />
                            <rect width="100%" height="100%" fill="url(#dot-grid)" />

                            {/* Room Boundary Glow */}
                            <rect width="100%" height="100%" fill="none" stroke="url(#wall-grad)" strokeWidth="0.08" className="opacity-50" />

                            {isNewDesign && (
                                <g transform={`translate(${room.width / 2}, ${room.length / 2})`} style={{ pointerEvents: 'none' }}>
                                    <rect x="-2.5" y="-0.8" width="5" height="1.6" rx="0.4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.02" />
                                    <text y="-0.2" fontSize="0.25" fill="white" textAnchor="middle" fontWeight="900" className="font-outfit uppercase tracking-widest">Workspace Initialized</text>
                                    <text y="0.25" fontSize="0.14" fill="rgba(255,255,255,0.3)" textAnchor="middle" className="font-outfit uppercase tracking-widest font-black">Deploy assets from the catalog</text>
                                </g>
                            )}

                            {items.map((item) => (
                                <g
                                    key={item.id}
                                    transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation})`}
                                    onPointerDown={(e) => handlePointerDown(e, item)}
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseEnter={() => setHoveredId(item.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    style={{ cursor: 'move', touchAction: 'none' }}
                                >
                                    {/* Selection Effect */}
                                    {(selectedId === item.id || hoveredId === item.id) && (
                                        <g>
                                            <ellipse
                                                rx={item.width / 2 + 0.2}
                                                ry={item.depth / 2 + 0.2}
                                                fill="none"
                                                stroke={selectedId === item.id ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)'}
                                                strokeWidth="0.04"
                                                strokeDasharray="0.08 0.08"
                                                className={selectedId === item.id ? "animate-spin-slow" : ""}
                                                style={{ transformOrigin: 'center', animationDuration: '10s' }}
                                            />
                                            <rect
                                                x={-item.width / 2 - 0.15}
                                                y={-item.depth / 2 - 0.15}
                                                width={item.width + 0.3}
                                                height={item.depth + 0.3}
                                                rx="0.1"
                                                fill="rgba(59, 130, 246, 0.05)"
                                            />
                                        </g>
                                    )}

                                    {/* Object Shadow */}
                                    <rect
                                        x={-item.width / 2 + 0.03}
                                        y={-item.depth / 2 + 0.03}
                                        width={item.width}
                                        height={item.depth}
                                        fill="rgba(0,0,0,0.5)"
                                        rx="0.05"
                                    />

                                    {renderFurnitureShape(item)}

                                    {/* Measurement Labels */}
                                    {(selectedId === item.id || hoveredId === item.id) && (
                                        <g transform={`rotate(${-item.rotation})`}>
                                            <text
                                                y={-item.depth / 2 - 0.3}
                                                fontSize="0.22"
                                                fill="white"
                                                textAnchor="middle"
                                                className="font-black font-outfit uppercase tracking-tighter shadow-sm"
                                                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                                            >
                                                DIMENSIONS: {item.width}M × {item.depth}M
                                            </text>
                                        </g>
                                    )}
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>
            </div>

            {/* Selection Controls HUD (Fixed at top) */}
            <AnimatePresence>
                {selectedId && selectedItem && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
                    >
                        <div className="glass-panel px-6 py-4 rounded-[2rem] flex items-center gap-4 premium-shadow border-white/10 scale-90 sm:scale-100 backdrop-blur-3xl">
                            <div className="pr-6 border-r border-white/10 flex flex-col">
                                <span className="text-[9px] text-accent font-black uppercase tracking-[0.2em] font-outfit mb-0.5">Asset Instance</span>
                                <span className="text-sm font-bold text-white font-outfit uppercase tracking-tight whitespace-nowrap">{selectedItem.name}</span>
                            </div>

                            <div className="flex gap-2.5">
                                {[
                                    { icon: <Copy size={18} />, action: duplicateItem, label: 'Clone', color: 'hover:bg-accent' },
                                    { icon: <RefreshCw size={18} />, action: rotateItem, label: 'Rotate', color: 'hover:bg-accent-alt', rotate: true },
                                    { icon: <Trash2 size={18} />, action: removeItem, label: 'Destroy', color: 'hover:bg-red-500' }
                                ].map((tool, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); tool.action(selectedId); }}
                                        className={cn(
                                            "w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white/5 text-white/40 rounded-2xl transition-all border border-white/5 active:scale-90 group",
                                            tool.color, "hover:text-white hover:border-white/10"
                                        )}
                                        title={tool.label}
                                    >
                                        <div className={cn(tool.rotate ? "group-hover:rotate-90 transition-transform duration-500" : "")}>
                                            {tool.icon}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Right-aligned Vertical HUD Indicators & Zoom Control */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 glass-panel px-5 py-8 rounded-[2.5rem] border-white/5 backdrop-blur-3xl scale-90 md:scale-100 origin-right z-40 shadow-2xl">
                {/* Zoom Control Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <Move size={20} className="text-accent" />
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-[9px] text-white/30 font-black uppercase tracking-widest font-outfit text-center">Zoom</span>
                        <div className="h-32 flex items-center justify-center">
                            <input
                                type="range"
                                min="40"
                                max="200"
                                value={zoom}
                                onChange={(e) => setZoom(parseInt(e.target.value))}
                                className="w-32 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent -rotate-90"
                                style={{ width: '120px' }}
                            />
                        </div>
                        <span className="text-xs text-white font-black font-outfit">{zoom}</span>
                    </div>
                </div>

                <div className="w-10 h-px bg-white/5" />

                {/* Room Dimensions Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent-alt/10 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                        <Scaling size={20} className="text-accent-alt" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] text-white/30 font-black uppercase tracking-widest font-outfit text-center mb-1">Room</span>
                        <div className="flex flex-col items-center">
                            <span className="text-sm text-white font-black font-outfit leading-tight">{room.width}m</span>
                            <span className="text-[10px] text-white/20 font-black font-outfit leading-none py-0.5">X</span>
                            <span className="text-sm text-white font-black font-outfit leading-tight">{room.length}m</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

