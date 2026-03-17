import React, { useState, useRef, useEffect } from 'react';
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
    PlusSquare,
    LogOut,
    Printer,
    ChevronLeft,
    X,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    { id: 'desktop', name: 'PC Setup', type: 'desktop', icon: '🖥️', width: 1.4, depth: 0.7, color: '#1a202c' },
    { id: 'rug', name: 'Area Rug', type: 'rug', icon: '🔲', width: 2.5, depth: 3.5, color: '#e2e8f0' },
    { id: 'chair', name: 'Office Chair', type: 'chair', icon: '🪑', width: 0.6, depth: 0.6, color: '#2d3748' },
    { id: 'bed', name: 'King Bed', type: 'bed', icon: '🛏️', width: 2, depth: 2, color: '#edf2f7' },
    { id: 'wardrobe', name: 'Wardrobe', type: 'wardrobe', icon: '🚪', width: 1.5, depth: 0.6, color: '#718096' },
    { id: 'shelf', name: 'Bookshelf', type: 'shelf', icon: '📚', width: 1.2, depth: 0.3, color: '#A0AEC0' },
    { id: 'lamp', name: 'Floor Lamp', type: 'lamp', icon: '💡', width: 0.4, depth: 0.4, color: '#f6ad55' },
    { id: 'tv_unit', name: 'TV Unit', type: 'tv_unit', icon: '📺', width: 1.8, depth: 0.4, color: '#1a202c' },
    { id: 'fridge', name: 'Refrigerator', type: 'fridge', icon: '🧊', width: 0.7, depth: 0.7, color: '#e2e8f0' },
    { id: 'counter', name: 'Kitchen Counter', type: 'counter', icon: '🔪', width: 2.0, depth: 0.6, color: '#f7fafc' },
    { id: 'plant', name: 'Indoor Plant', type: 'plant', icon: '🪴', width: 0.5, depth: 0.5, color: '#48bb78' },
    { id: 'window', name: 'Window', type: 'window', icon: '🪟', width: 1.5, depth: 0.2, color: '#90cdf4' },
    { id: 'door', name: 'Door', type: 'door', icon: '🚪', width: 0.9, depth: 0.1, color: '#9c4221' },
];

export const Sidebar = ({
    isOpen,
    setIsOpen,
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
    clearDesign,
    activeDesignId,
    viewMode,
    setViewMode
}) => {
    const [activeTab, setActiveTab] = useState('room');
    const navigate = useNavigate();

    // Modal state
    const [saveModal, setSaveModal] = useState(false);
    const [designNameInput, setDesignNameInput] = useState('');
    const [wipeModal, setWipeModal] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);
    const saveInputRef = useRef(null);

    const showToast = (msg, type = 'success') => {
        setToastMsg({ msg, type });
        setTimeout(() => setToastMsg(null), 3000);
    };

    const openSaveModal = () => {
        const currentName = activeDesignId
            ? savedDesigns.find(d => d.id === activeDesignId)?.name || ''
            : '';
        setDesignNameInput(currentName);
        setSaveModal(true);
        setTimeout(() => saveInputRef.current?.focus(), 100);
    };

    const handleSaveConfirm = async () => {
        const trimmedName = designNameInput.trim();
        if (!trimmedName) return;
        setSaveModal(false);
        try {
            const result = await saveDesign(trimmedName);
            showToast(result?.message || `"${trimmedName}" saved!`, 'success');
        } catch (e) {
            showToast('Save failed: ' + e.message, 'error');
        }
    };

    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    const user = (userStr && userStr !== 'undefined' && userStr !== 'null') 
        ? JSON.parse(userStr) 
        : { email: 'guest@furnishar.com', role: 'PRO MEMBER' };
    const email = user?.email || 'guest@furnishar.com';
    const username = email.split('@')[0];

    const handleLogout = () => {
        // Here you can add logic to clear session/local storage if needed
        navigate('/');
    };

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
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <aside 
                className={cn(
                    "fixed md:relative inset-y-0 left-0 w-[320px] lg:w-[360px] glass-panel flex flex-col z-50 md:z-20 select-none overflow-hidden shadow-2xl transition-transform duration-500 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:border-none"
                )}
            >
                {/* Desktop Collapse Toggle */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-20 bg-black/40 backdrop-blur-xl border border-white/5 border-l-0 rounded-r-2xl hidden md:flex items-center justify-center text-white/20 hover:text-white transition-all group"
                >
                    <div className={cn("transition-transform duration-500", isOpen ? "rotate-180" : "rotate-0")}>
                         <Plus size={20} className="rotate-45" />
                    </div>
                </button>
            {/* Brand Header */}
            <div className="p-8 pb-6 space-y-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                            <Layers className="text-white" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white font-outfit tracking-tight leading-none">
                                FURNISHAR
                            </h1>
                            <span className="text-[10px] font-bold text-accent tracking-[0.3em] uppercase opacity-80">Studio Edition</span>
                        </div>
                    </div>
                </div>

                {/* User Profile Badge - Premium Edition */}
                <div className="relative group cursor-pointer">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-accent-alt rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative flex items-center justify-between bg-black/40 backdrop-blur-xl p-3 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="min-w-10 w-10 h-10 rounded-xl bg-gradient-to-br from-premium-800 to-black border border-white/10 flex items-center justify-center text-white font-black text-lg font-outfit shadow-xl">
                                {email.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0 pr-2">
                                <span className="text-xs font-bold text-white font-outfit truncate max-w-[120px] block" title={email}>{username}</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-black">{user?.role || 'PRO MEMBER'}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all active:scale-90"
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs - Modern Segmented Control */}
            <div className="px-6 pb-4">
                <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                    {[
                        { id: 'room', label: 'ROOM', icon: <Square size={14} /> },
                        { id: 'furniture', label: 'ASSETS', icon: <Box size={14} /> },
                        { id: 'designs', label: 'VAULT', icon: <Folder size={14} /> }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 font-outfit",
                                activeTab === tab.id 
                                    ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10" 
                                    : "text-white/30 hover:text-white/60"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 space-y-8 py-4 custom-scrollbar">
                {activeTab === 'room' && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="space-y-5">
                            <label className="text-[10px] font-black text-white/30 flex items-center gap-2 tracking-[0.2em] uppercase font-outfit">
                                <Maximize size={14} className="text-accent" /> Spatial parameters
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest px-1">Width (m)</span>
                                    <input
                                        type="number"
                                        min="2"
                                        max="20"
                                        step="0.1"
                                        value={state.room.width}
                                        onChange={(e) => updateRoom('width', parseFloat(e.target.value))}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-outfit"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest px-1">Length (m)</span>
                                    <input
                                        type="number"
                                        min="2"
                                        max="20"
                                        step="0.1"
                                        value={state.room.length}
                                        onChange={(e) => updateRoom('length', parseFloat(e.target.value))}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-outfit"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <label className="text-[10px] font-black text-white/30 flex items-center gap-2 tracking-[0.2em] uppercase font-outfit">
                                <Palette size={14} className="text-accent-alt" /> Material Finish
                            </label>
                            <div className="relative group">
                                <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 transition-all group-hover:border-accent-alt/30">
                                    <div
                                        className="w-12 h-12 rounded-xl border-2 border-white/10 shadow-2xl flex-shrink-0"
                                        style={{ backgroundColor: state.room.wallColor, boxShadow: `0 0 20px ${state.room.wallColor}33` }}
                                    />
                                    <div className="flex-1 flex flex-col">
                                        <span className="text-[10px] text-white/60 font-black font-outfit uppercase">Wall Color</span>
                                        <input
                                            type="color"
                                            value={state.room.wallColor}
                                            onChange={(e) => updateRoom('wallColor', e.target.value)}
                                            className="w-full h-8 bg-transparent cursor-pointer rounded-lg border-none opacity-50 hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 mt-6 border-t border-white/5">
                            <label className="text-[10px] font-black text-white/30 tracking-[0.2em] uppercase font-outfit">
                                Operations
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    disabled={!canUndo}
                                    onClick={undo}
                                    className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black tracking-widest text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed uppercase font-outfit"
                                >
                                    <Undo size={14} /> Back
                                </button>
                                <button
                                    disabled={!canRedo}
                                    onClick={redo}
                                    className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black tracking-widest text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed uppercase font-outfit"
                                >
                                    <Redo size={14} /> Next
                                </button>
                            </div>

                            <button
                                onClick={() => setWipeModal(true)}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all hover:bg-red-500 hover:text-white uppercase font-outfit"
                            >
                                <Trash2 size={16} /> Wipe Canvas
                            </button>

                            <button
                                onClick={openSaveModal}
                                className="w-full relative group"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-accent-alt rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative flex items-center justify-center gap-3 py-4 bg-accent text-white rounded-2xl text-xs font-black tracking-[0.2em] shadow-xl font-outfit uppercase">
                                    <Save size={18} /> Commit to Cloud
                                </div>
                            </button>

                            <button
                                onClick={() => window.print()}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white font-outfit text-[10px] font-black tracking-[0.2em] rounded-2xl transition-all hover:bg-white/10 hover:border-white/20 uppercase"
                            >
                                <Printer size={18} /> Generate Report
                            </button>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'furniture' && (
                    <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-white/30 tracking-[0.2em] uppercase font-outfit">
                                Component Catalog
                            </label>
                            <span className="text-[10px] font-black text-accent font-outfit px-2 py-1 bg-accent/10 rounded-md">
                                {FURNITURE_CATALOG.length} ITEMS
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {FURNITURE_CATALOG.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => addItem(item)}
                                    className="glass-card flex items-center gap-5 p-4 rounded-2xl relative group overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent to-accent-alt opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-14 h-14 flex items-center justify-center bg-black/40 rounded-xl text-3xl group-hover:scale-110 transition-all duration-300 border border-white/5 shadow-inner">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-bold text-white font-outfit group-hover:text-accent transition-colors">{item.name}</p>
                                        <p className="text-[10px] font-black text-white/30 tracking-widest font-outfit uppercase">{item.width}m × {item.depth}m</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-accent/20 group-hover:text-accent transition-all">
                                        <Plus size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'designs' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        <button
                            onClick={createNewDesign}
                            className="w-full flex flex-col items-center justify-center gap-2 py-8 bg-black/30 border-2 border-dashed border-white/10 text-white/30 rounded-3xl transition-all hover:bg-white/5 hover:border-accent hover:text-white group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-2 group-hover:bg-accent/20 group-hover:text-accent transition-all">
                                <PlusSquare size={24} />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.3em] font-outfit uppercase">Initialize New Grid</span>
                        </button>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/30 tracking-[0.2em] uppercase font-outfit">
                                Secure Storage Vault
                            </label>

                            <div className="flex flex-col gap-3">
                                {savedDesigns.length === 0 ? (
                                    <div className="text-center py-12 glass-card rounded-3xl">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-outfit">Vault is Empty</p>
                                    </div>
                                ) : (
                                    savedDesigns.map((design) => (
                                        <button
                                            key={design.id}
                                            onClick={() => loadSpecificDesign(design.id)}
                                            className={cn(
                                                "glass-card p-5 rounded-3xl text-left relative overflow-hidden group",
                                                activeDesignId === design.id
                                                    ? "border-accent/50 bg-accent/5"
                                                    : ""
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={cn(
                                                    "text-sm font-black font-outfit truncate max-w-[150px] tracking-tight uppercase",
                                                    activeDesignId === design.id ? "text-accent" : "text-white"
                                                )}>
                                                    {design.name}
                                                </span>
                                                <span className="text-[9px] font-black text-white/20 font-mono tracking-tighter">
                                                    REF_{design.id}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                                <span className="text-[9px] font-black text-white/30 tracking-widest font-outfit uppercase">
                                                    {new Date(design.updated_at).toLocaleDateString()} // {new Date(design.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {activeDesignId === design.id && (
                                                <div className="absolute top-0 right-0 w-12 h-12 bg-accent/10 rounded-bl-[40px] flex items-center justify-end pr-3 pt-3">
                                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                                </div>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* View Mode Toggle - Integrated Fixed Bottom */}
            <div className="p-6 bg-black/40 backdrop-blur-3xl border-t border-white/5">
                <div className="flex bg-white/5 p-1.5 rounded-2xl gap-1 border border-white/5 shadow-inner">
                    <button
                        onClick={() => setViewMode('2d')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-500 font-outfit uppercase",
                            viewMode === '2d' 
                                ? "bg-accent text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] border border-white/10" 
                                : "text-white/30 hover:text-white/50"
                        )}
                    >
                        <Square size={16} /> Orthographic
                    </button>
                    <button
                        onClick={() => setViewMode('3d')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-500 font-outfit uppercase",
                            viewMode === '3d' 
                                ? "bg-accent-alt text-white shadow-[0_8px_30px_rgb(139,92,246,0.3)] border border-white/10" 
                                : "text-white/30 hover:text-white/50"
                        )}
                    >
                        <Box size={16} /> Perspective
                    </button>
                </div>
            </div>
            </aside>

            {/* ─── Save Modal ─── */}
            <AnimatePresence>
                {saveModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6"
                        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
                        onClick={() => setSaveModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-sm bg-[#0f1218] border border-white/10 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[10px] text-accent font-black tracking-[0.3em] uppercase font-outfit mb-1">Secure Storage Vault</p>
                                    <h2 className="text-lg font-black text-white font-outfit tracking-tight">Commit Design</h2>
                                </div>
                                <button onClick={() => setSaveModal(false)} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest font-outfit">Design Name</label>
                                <input
                                    ref={saveInputRef}
                                    type="text"
                                    value={designNameInput}
                                    onChange={e => setDesignNameInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSaveConfirm()}
                                    placeholder="e.g. Living Room v2"
                                    className="w-full bg-black/50 border border-white/10 focus:border-accent/60 rounded-2xl px-4 py-3.5 text-sm text-white font-bold font-outfit focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all placeholder:text-white/20"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSaveModal(false)}
                                    className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/50 text-[10px] font-black tracking-widest uppercase font-outfit hover:bg-white/10 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveConfirm}
                                    disabled={!designNameInput.trim()}
                                    className="flex-1 py-3.5 rounded-2xl bg-accent text-white text-[10px] font-black tracking-widest uppercase font-outfit hover:bg-accent/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Save size={14} /> Commit
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Wipe Confirm Modal ─── */}
            <AnimatePresence>
                {wipeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6"
                        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
                        onClick={() => setWipeModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-sm bg-[#0f1218] border border-red-500/20 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex flex-col items-center text-center gap-4 mb-7">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <AlertTriangle size={28} className="text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-white font-outfit mb-1">Wipe Canvas?</h2>
                                    <p className="text-xs text-white/40 font-outfit">All unsaved items will be permanently removed.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setWipeModal(false)}
                                    className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/50 text-[10px] font-black tracking-widest uppercase font-outfit hover:bg-white/10 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { setWipeModal(false); clearDesign(); }}
                                    className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white text-[10px] font-black tracking-widest uppercase font-outfit hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={14} /> Wipe
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Toast Notification ─── */}
            <AnimatePresence>
                {toastMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        className={cn(
                            "fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-bold font-outfit",
                            toastMsg.type === 'error'
                                ? 'bg-red-500/20 border-red-500/30 text-red-300'
                                : 'bg-accent/20 border-accent/30 text-accent'
                        )}
                    >
                        <CheckCircle size={18} />
                        {toastMsg.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
