import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { DesignCanvas } from './components/DesignCanvas';
import { ThreeDViewer } from './components/ThreeDViewer';
import { useDesignState } from './hooks/useDesignState';
import { AnimatePresence, motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import Login from './pages/Login';

function MainWorkspace() {
  const [viewMode, setViewMode] = useState('2d');
  const canvasRef = React.useRef(null);
  const canvasRef3D = React.useRef(null);
  const {
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
    logout
  } = useDesignState();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const exportImageData = async (name) => {
    const fileName = `${(name || 'design').replace(/\s+/g, '_')}_export.png`;
    
    if (viewMode === '2d' && canvasRef.current) {
        return await canvasRef.current.exportPNG(fileName);
    } else if (viewMode === '3d' && canvasRef3D.current) {
        return await canvasRef3D.current.exportPNG(fileName);
    }
    
    return false;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-premium-950 text-white font-inter select-none overflow-hidden mesh-bg">
      {/* Sidebar - Control Hub */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        state={state}
        updateState={updateState}
        pushToHistory={pushToHistory}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        saveDesign={saveDesign}
        savedDesigns={savedDesigns}
        loadSpecificDesign={loadSpecificDesign}
        createNewDesign={createNewDesign}
        clearDesign={clearDesign}
        activeDesignId={activeDesignId}
        viewMode={viewMode}
        setViewMode={setViewMode}
        exportImageData={exportImageData}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Overlay Notification & Mobile Menu */}
        <div className="absolute top-6 left-6 right-6 md:right-10 z-30 pointer-events-none flex justify-between items-start print-hide">
          <div className="pointer-events-auto md:hidden">
             <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="glass-panel p-3 rounded-xl text-white/60 hover:text-white transition-all active:scale-95"
             >
                <Layers size={20} />
             </button>
          </div>
          
          <div className="scale-75 md:scale-100 origin-top-right">
            <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4 premium-shadow border-white/10 backdrop-blur-md">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-accent font-black tracking-[0.2em] font-outfit">PREMIUM VERSION</span>
                <span className="text-xs text-white/50 font-medium whitespace-nowrap">REV 2026.4</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-tighter whitespace-nowrap">PROJECT</span>
                <span className="text-sm text-white font-bold font-outfit uppercase tracking-wide whitespace-nowrap">FURNISHAR_CORE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Print Template Header */}
        <div className="print-header"></div>

        {/* View Transitioning Logic */}
        <AnimatePresence mode="wait">
          {viewMode === '2d' ? (
            <motion.div
              key="2d-editor"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex flex-col relative"
            >
              <DesignCanvas
                ref={canvasRef}
                state={state}
                updateState={updateState}
                pushToHistory={pushToHistory}
              />
            </motion.div>
          ) : (
            <motion.div
              key="3d-viewer"
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <ThreeDViewer
                ref={canvasRef3D}
                state={state}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Bar */}
        <footer className="h-10 border-t border-white/5 bg-black/40 backdrop-blur-md flex items-center px-8 justify-between text-[11px] text-white/40 font-medium flex-shrink-0">
          <div className="flex gap-8">
            <span className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-white/60 tracking-wide font-outfit uppercase">Core Engine Online</span>
            </span>
            <span className="flex items-center gap-1.5 opacity-60">
              <span className="font-bold text-white/80">{state.items.length}</span> Objects Loaded
            </span>
            <span className="flex items-center gap-1.5 opacity-60">
               <span className="font-bold text-white/80">{state.room.width}m × {state.room.length}m</span> Workspace
            </span>
          </div>
          <div className="flex gap-6 items-center">
            <span className="text-white/20 uppercase tracking-[0.2em] text-[9px]">Local DB Encryption Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <span className="text-white/60 font-outfit font-bold tracking-widest text-[10px]">FURNISHAR PREMIUM</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/workspace" element={<MainWorkspace />} />
    </Routes>
  );
}

export default App;