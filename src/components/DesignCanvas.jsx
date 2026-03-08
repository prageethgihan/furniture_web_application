import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    RotateCcw,
    Trash2,
    Move,
    Scaling,
    RefreshCw,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DesignCanvas = ({ state, updateState, pushToHistory }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [hoveredId, setHoveredId] = useState(null);

    const svgRef = useRef(null);
    const { room, items } = state;

    // Constants
    const PIXELS_PER_METER = 60;



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
            default:
                return <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} rx="0.05" fill={color} />;
        }
    };

    const selectedItem = useMemo(() => items.find(i => i.id === selectedId), [items, selectedId]);

    return (
        <div
            className="relative flex-1 bg-premium-900 flex items-center justify-center p-12 overflow-hidden"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onClick={() => setSelectedId(null)}
            style={{ touchAction: 'none' }}
        >
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#58a6ff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />

            <motion.div
                layout
                className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-lg border border-white/5 bg-[#1a1d21] p-16"
            >
                <svg
                    ref={svgRef}
                    width={room.width * PIXELS_PER_METER}
                    height={room.length * PIXELS_PER_METER}
                    viewBox={`0 0 ${room.width} ${room.length}`}
                    className="bg-[#21262d] transition-all duration-300 rounded overflow-visible"
                    style={{ cursor: isDragging ? 'grabbing' : 'default' }}
                >
                    <defs>
                        <pattern id="major-grid" width="1" height="1" patternUnits="userSpaceOnUse">
                            <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#ffffff11" strokeWidth="0.05" />
                        </pattern>
                        <pattern id="minor-grid" width="0.2" height="0.2" patternUnits="userSpaceOnUse">
                            <path d="M 0.2 0 L 0 0 0 0.2" fill="none" stroke="#ffffff05" strokeWidth="0.02" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#minor-grid)" />
                    <rect width="100%" height="100%" fill="url(#major-grid)" />

                    <rect width="100%" height="100%" fill="none" stroke="#58a6ff33" strokeWidth="0.1" />

                    {items.map((item) => (
                        <g
                            key={item.id}
                            transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation})`}
                            onPointerDown={(e) => handlePointerDown(e, item)}
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{ cursor: 'move', touchAction: 'none' }}
                            className="drop-shadow-lg"
                        >
                            {(selectedId === item.id || hoveredId === item.id) && (
                                <ellipse
                                    rx={item.width / 2 + 0.15}
                                    ry={item.depth / 2 + 0.15}
                                    fill="none"
                                    stroke={selectedId === item.id ? '#58a6ff' : '#58a6ff44'}
                                    strokeWidth="0.03"
                                    strokeDasharray="0.1 0.05"
                                    className={selectedId === item.id ? "animate-pulse" : ""}
                                />
                            )}

                            <rect
                                x={-item.width / 2 + 0.02}
                                y={-item.depth / 2 + 0.02}
                                width={item.width}
                                height={item.depth}
                                fill="#00000044"
                                rx="0.05"
                            />

                            {renderFurnitureShape(item)}

                            {(selectedId === item.id || hoveredId === item.id) && (
                                <g transform={`rotate(${-item.rotation})`}>
                                    <text
                                        y={-item.depth / 2 - 0.2}
                                        fontSize="0.25"
                                        fill="#58a6ff"
                                        textAnchor="middle"
                                        className="font-bold select-none pointer-events-none"
                                    >
                                        {item.width}m × {item.depth}m
                                    </text>
                                </g>
                            )}
                        </g>
                    ))}
                </svg>

                <AnimatePresence>
                    {selectedId && selectedItem && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-premium-950/90 border border-white/10 p-3 rounded-2xl shadow-2xl backdrop-blur-md"
                        >
                            <div className="px-4 border-r border-white/10 flex flex-col">
                                <span className="text-[9px] text-premium-500 font-black uppercase tracking-[2px]">Object Inspector</span>
                                <span className="text-sm font-semibold text-white truncate max-w-[120px]">{selectedItem.name}</span>
                            </div>

                            <div className="flex gap-1.5 px-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); rotateItem(selectedId); }}
                                    className="w-10 h-10 flex items-center justify-center bg-premium-800 hover:bg-accent hover:text-white rounded-xl text-premium-400 transition-all border border-white/5 group"
                                >
                                    <RefreshCw size={20} className="group-hover:rotate-45 transition-transform" />
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); removeItem(selectedId); }}
                                    className="w-10 h-10 flex items-center justify-center bg-premium-800 hover:bg-red-500 hover:text-white rounded-xl text-premium-400 transition-all border border-white/5"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="absolute bottom-8 left-8 flex items-center gap-6 glass px-6 py-4 rounded-3xl">
                <div className="flex flex-col">
                    <span className="text-[9px] text-premium-500 font-bold uppercase tracking-widest">Active Scale</span>
                    <span className="text-sm text-white font-mono">1M = {PIXELS_PER_METER}PX</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                    <span className="text-[9px] text-premium-500 font-bold uppercase tracking-widest">Snap Setting</span>
                    <span className="text-sm text-white flex items-center gap-2 font-mono">
                        <Info size={14} className="text-accent" /> 0.05m
                    </span>
                </div>
            </div>
        </div>
    );
};
