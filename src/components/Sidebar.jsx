import React, { useState } from 'react';
import {
    Square,
    Maximize,
    Trash2,
    RotateCcw,
    Plus,
    Save,
    Layers,
    Box,
    Palette,
    Undo,
    Redo,
    Folder,
<<<<<<< HEAD
    PlusSquare,
    LogOut,
    Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
=======
    PlusSquare
} from 'lucide-react';
>>>>>>> aa7461d23baee1d5605273d4d700876aa9959ddf
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const FURNITURE_CATALOG = [
    { id: 'sofa', name: 'Premium Sofa', type: 'sofa', icon: '🛋️', width: 2.2, depth: 1, color: '#4a5568' },
    { id: 'armchair', name: 'Armchair', type: 'sofa', icon: '💺', width: 0.8, depth: 0.8, color: '#ecc94b' },
    { id: 'table', name: 'Oak Table', type: 'table', icon: '🪑', width: 1.2, depth: 0.8, color: '#8b4513' },
    { id: 'coffee_table', name: 'Coffee Table', type: 'table', icon: '☕', width: 1.0, depth: 0.6, color: '#2d3748' },
<<<<<<< HEAD
    { id: 'desktop', name: 'PC Setup', type: 'desktop', icon: '🖥️', width: 1.4, depth: 0.7, color: '#1a202c' },
    { id: 'rug', name: 'Area Rug', type: 'rug', icon: '🔲', width: 2.5, depth: 3.5, color: '#e2e8f0' },
=======
>>>>>>> aa7461d23baee1d5605273d4d700876aa9959ddf
    { id: 'chair', name: 'Office Chair', type: 'chair', icon: '🪑', width: 0.6, depth: 0.6, color: '#2d3748' },
    { id: 'bed', name: 'King Bed', type: 'bed', icon: '🛏️', width: 2, depth: 2, color: '#edf2f7' },
    { id: 'wardrobe', name: 'Wardrobe', type: 'wardrobe', icon: '🚪', width: 1.5, depth: 0.6, color: '#718096' },
    { id: 'shelf', name: 'Bookshelf', type: 'shelf', icon: '📚', width: 1.2, depth: 0.3, color: '#A0AEC0' },
    { id: 'lamp', name: 'Floor Lamp', type: 'lamp', icon: '💡', width: 0.4, depth: 0.4, color: '#f6ad55' },
<<<<<<< HEAD
    { id: 'tv_unit', name: 'TV Unit', type: 'tv_unit', icon: '📺', width: 1.8, depth: 0.4, color: '#1a202c' },
    { id: 'fridge', name: 'Refrigerator', type: 'fridge', icon: '🧊', width: 0.7, depth: 0.7, color: '#e2e8f0' },
    { id: 'counter', name: 'Kitchen Counter', type: 'counter', icon: '🔪', width: 2.0, depth: 0.6, color: '#f7fafc' },
    { id: 'plant', name: 'Indoor Plant', type: 'plant', icon: '🪴', width: 0.5, depth: 0.5, color: '#48bb78' },
    { id: 'window', name: 'Window', type: 'window', icon: '🪟', width: 1.5, depth: 0.2, color: '#90cdf4' },
    { id: 'door', name: 'Door', type: 'door', icon: '🚪', width: 0.9, depth: 0.1, color: '#9c4221' },
=======
    { id: 'tv_unit', name: 'TV Unit', type: 'table', icon: '📺', width: 1.8, depth: 0.4, color: '#1a202c' },
    { id: 'fridge', name: 'Refrigerator', type: 'wardrobe', icon: '🧊', width: 0.7, depth: 0.7, color: '#e2e8f0' },
    { id: 'counter', name: 'Kitchen Counter', type: 'table', icon: '🔪', width: 2.0, depth: 0.6, color: '#f7fafc' },
    { id: 'plant', name: 'Indoor Plant', type: 'lamp', icon: '🪴', width: 0.5, depth: 0.5, color: '#48bb78' },
>>>>>>> aa7461d23baee1d5605273d4d700876aa9959ddf
];

export const Sidebar = ({
    state,
    updateState,
    pushToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    saveDesign,
    savedDesigns,
    loadSpecificDesign,
    createNewDesign,
<<<<<<< HEAD
    clearDesign,
=======
>>>>>>> aa7461d23baee1d5605273d4d700876aa9959ddf
    activeDesignId,
    viewMode,
    setViewMode
}) => {
    const [activeTab, setActiveTab] = useState('room');
<<<<<<< HEAD
    const navigate = useNavigate();

    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { email: 'guest@furnishar.com', role: 'user' };
    const username = user.email.split('@')[0];

    const handleLogout = () => {
        // Here you can add logic to clear session/local storage if needed
        navigate('/');
    };
=======
>>>>>>> aa7461d23baee1d5605273d4d700876aa9959ddf

    const addItem = (item) => {
        const newItem = {
            id: Date.now().toString(),
            type: item.type,
            name: item.name,
            x: state.room.width / 2,
            y: state.room.length / 2,
            rotation: 0,
            scale: 1,
            color: item.color,
            width: item.width,
            depth: item.depth,
        };

        const newState = {
            ...state,
            items: [...state.items, newItem]
        };
        updateState(newState);
        pushToHistory(newState);
    };

    const updateRoom = (field, value) => {
        const newState = {
            ...state,
            room: { ...state.room, [field]: value }
        };
        updateState(newState);
        pushToHistory(newState);
    };

    return (
        <aside className="w-80 h-full border-r border-premium-800 bg-premium-900 flex flex-col z-10 select-none overflow-y-auto">
<<<<<<< HEAD
            <div className="p-6 border-b border-premium-800 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            <Layers className="text-accent" />
                            FurnishAR 3D
                        </h1>
                        <p className="text-xs text-premium-400">Professional Floor Planner</p>
                    </div>
                </div>

                {/* User Profile Badge */}
                <div className="flex items-center justify-between bg-premium-950 p-2.5 rounded-xl border border-premium-800 shadow-inner">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="min-w-8 w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-sm uppercase shadow-inner">
                            {user.email.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-xs font-bold text-white truncate max-w-[120px] block" title={user.email}>{username}</span>
                            <span className="text-[9px] text-accent uppercase tracking-widest block font-medium truncate">{user.role || 'Member'}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-premium-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all focus:outline-none flex-shrink-0"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
=======
            <div className="p-6 border-b border-premium-800">
                <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <Layers className="text-accent" />
                    FurnishAR 3D
                </h1>
                <p className="text-xs text-premium-400">Professional Floor Planner</p>
>>>>>>> aa7461d23baee1d5605273d4d700876aa9959ddf
            </div>

            <div className="flex border-b border-premium-800">
                <button
                    onClick={() => setActiveTab('room')}
                    className={cn(
                        "flex-1 py-3 text-xs font-medium transition-all duration-200",
                        activeTab === 'room' ? "text-accent border-b-2 border-accent bg-premium-800/50" : "text-premium-400 hover:text-white"
                    )}
                >
                    ROOM
                </button>
                <button
                    onClick={() => setActiveTab('furniture')}
                    className={cn(
                        "flex-1 py-3 text-xs font-medium transition-all duration-200",
                        activeTab === 'furniture' ? "text-accent border-b-2 border-accent bg-premium-800/50" : "text-premium-400 hover:text-white"
                    )}
                >
                    CATALOG
                </button>
                <button
                    onClick={() => setActiveTab('designs')}
                    className={cn(
                        "flex-1 py-3 text-xs font-medium transition-all duration-200",
                        activeTab === 'designs' ? "text-accent border-b-2 border-accent bg-premium-800/50" : "text-premium-400 hover:text-white"
                    )}
                >
                    DESIGNS
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 animate-fade-in">
                {activeTab === 'room' && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-premium-300 flex items-center gap-2">
                                <Maximize size={14} /> ROOM DIMENSIONS (M)
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <span className="text-[10px] text-premium-500 uppercase">Width</span>
                                    <input
                                        type="number"
                                        min="2"
                                        max="20"
                                        step="0.1"
                                        value={state.room.width}
                                        onChange={(e) => updateRoom('width', parseFloat(e.target.value))}
                                        className="w-full bg-premium-800 border border-premium-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-[10px] text-premium-500 uppercase">Length</span>
                                    <input
                                        type="number"
                                        min="2"
                                        max="20"
                                        step="0.1"
                                        value={state.room.length}
                                        onChange={(e) => updateRoom('length', parseFloat(e.target.value))}
                                        className="w-full bg-premium-800 border border-premium-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-bold text-premium-300 flex items-center gap-2">
                                <Palette size={14} /> WALL COLOR
                            </label>
                            <div className="flex items-center gap-4 bg-premium-800 p-3 rounded-lg border border-premium-700">
                                <div
                                    className="w-10 h-10 rounded-full border border-premium-600 shadow-inner"
                                    style={{ backgroundColor: state.room.wallColor }}
                                />
                                <input
                                    type="color"
                                    value={state.room.wallColor}
                                    onChange={(e) => updateRoom('wallColor', e.target.value)}
                                    className="flex-1 h-8 bg-transparent cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-premium-800">
                            <label className="text-xs font-bold text-premium-300 flex items-center gap-2 uppercase">
                                <Undo size={14} /> History & Control
                            </label>
<<<<<<< HEAD

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    disabled={!canUndo}
                                    onClick={undo}
                                    className="flex items-center justify-center gap-2 py-2 bg-premium-800 border border-premium-700 rounded-lg text-xs font-medium transition-all hover:bg-premium-700 disabled:opacity-30 disabled:cursor-not-allowed"
=======
                            <div className="flex gap-2">
                                <button
                                    disabled={!canUndo}
                                    onClick={undo}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-premium-800 border border-premium-700 rounded-lg text-sm transition-all hover:bg-premium-700 disabled:opacity-30 disabled:cursor-not-allowed"
>>>>>>> aa7461d23baee1d5605273d4d700876aa9959ddf
                                >
                                    <Undo size={14} /> Undo
                                </button>
                                <button
                                    disabled={!canRedo}
                                    onClick={redo}
<<<<<<< HEAD
                                    className="flex items-center justify-center gap-2 py-2 bg-premium-800 border border-premium-700 rounded-lg text-xs font-medium transition-all hover:bg-premium-700 disabled:opacity-30 disabled:cursor-not-allowed"
=======
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-premium-800 border border-premium-700 rounded-lg text-sm transition-all hover:bg-premium-700 disabled:opacity-30 disabled:cursor-not-allowed"
>>>>>>> aa7461d23baee1d5605273d4d700876aa9959ddf
                                >
                                    <Redo size={14} /> Redo
                                </button>
                            </div>
<<<<<<< HEAD

                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to clear all furniture from this design?')) {
                                        clearDesign();
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-bold transition-all hover:bg-red-500 hover:text-white"
                            >
                                <Trash2 size={14} /> CLEAR CANVAS
                            </button>

=======
>>>>>>> aa7461d23baee1d5605273d4d700876aa9959ddf
                            <button
                                onClick={() => {
                                    const currentName = activeDesignId ? savedDesigns.find(d => d.id === activeDesignId)?.name : 'New Design';
                                    const name = window.prompt("Enter a name for your design:", currentName || '');
                                    if (name !== null) {
                                        saveDesign(name.trim() || undefined);
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-accent/20 border border-accent/40 text-accent rounded-lg text-sm font-bold transition-all hover:bg-accent hover:text-white"
                            >
                                <Save size={16} /> SAVE DESIGN
                            </button>
<<<<<<< HEAD

                            <button
                                onClick={() => window.print()}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-premium-800 border border-premium-700 text-white rounded-lg text-sm font-bold transition-all hover:bg-premium-700 hover:text-accent"
                            >
                                <Printer size={16} /> PRINT DESIGN
                            </button>
=======
>>>>>>> aa7461d23baee1d5605273d4d700876aa9959ddf
                        </div>
                    </div>
                )}

                {activeTab === 'furniture' && (
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-premium-300 flex items-center gap-2 uppercase">
                            <Plus size={14} /> Furniture Collection
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {FURNITURE_CATALOG.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => addItem(item)}
                                    className="flex items-center gap-4 bg-premium-800 p-3 border border-premium-700 rounded-xl transition-all hover:border-accent hover:bg-premium-700 group"
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-premium-900 rounded-lg text-2xl group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-white">{item.name}</p>
                                        <p className="text-[10px] text-premium-500">{item.width}m x {item.depth}m</p>
                                    </div>
                                    <Plus size={16} className="ml-auto text-premium-500 group-hover:text-accent" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'designs' && (
                    <div className="space-y-6">
                        <button
                            onClick={createNewDesign}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-premium-800 border-2 border-dashed border-premium-700 text-premium-300 rounded-xl text-xs font-bold transition-all hover:border-accent hover:text-white group"
                        >
                            <PlusSquare size={16} className="group-hover:scale-110 transition-transform" />
                            START NEW DESIGN
                        </button>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-premium-300 flex items-center gap-2 uppercase">
                                <Folder size={14} /> Saved Designs ({savedDesigns.length})
                            </label>

                            <div className="flex flex-col gap-2">
                                {savedDesigns.length === 0 ? (
                                    <div className="text-center py-8 bg-premium-800/30 rounded-xl border border-dashed border-premium-700">
                                        <p className="text-[10px] text-premium-500 italic">No designs found in Database</p>
                                    </div>
                                ) : (
                                    savedDesigns.map((design) => (
                                        <button
                                            key={design.id}
                                            onClick={() => loadSpecificDesign(design.id)}
                                            className={cn(
                                                "flex flex-col gap-1 p-4 border rounded-xl text-left transition-all group relative overflow-hidden",
                                                activeDesignId === design.id
                                                    ? "bg-accent/10 border-accent/50 ring-1 ring-accent/20"
                                                    : "bg-premium-800 border-premium-700 hover:border-premium-500"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={cn(
                                                    "text-sm font-semibold truncate max-w-[150px]",
                                                    activeDesignId === design.id ? "text-accent" : "text-white"
                                                )}>
                                                    {design.name}
                                                </span>
                                                <span className="text-[9px] text-premium-500 font-mono">
                                                    ID: {design.id}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-premium-500">
                                                {new Date(design.updated_at).toLocaleDateString()} at {new Date(design.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {activeDesignId === design.id && (
                                                <div className="absolute top-0 right-0 w-8 h-8 bg-accent/10 rounded-bl-full flex items-center justify-center pl-2 pb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                </div>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-premium-950 border-t border-premium-800">
                <div className="flex bg-premium-900 p-1 rounded-xl gap-1">
                    <button
                        onClick={() => setViewMode('2d')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all",
                            viewMode === '2d' ? "bg-accent text-white shadow-lg" : "text-premium-400 hover:text-premium-300"
                        )}
                    >
                        <Square size={14} /> 2D PLAN
                    </button>
                    <button
                        onClick={() => setViewMode('3d')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all",
                            viewMode === '3d' ? "bg-accent text-white shadow-lg" : "text-premium-400 hover:text-premium-300"
                        )}
                    >
                        <Box size={14} /> 3D VIEW
                    </button>
                </div>
            </div>
        </aside>
    );
};
