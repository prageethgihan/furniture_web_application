import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DesignCanvas } from './components/DesignCanvas';
import { ThreeDViewer } from './components/ThreeDViewer';
import { useDesignState } from './hooks/useDesignState';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [viewMode, setViewMode] = useState('2d');
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
    activeDesignId
  } = useDesignState();

  return (
    <div className="flex h-screen w-full bg-premium-900 text-white font-inter select-none overflow-hidden">
      {/* Sidebar - Control Hub */}
      <Sidebar
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
        activeDesignId={activeDesignId}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Overlay Notification */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          className="absolute top-0 right-10 z-20 pointer-events-none"
        >
          <div className="bg-premium-950/80 backdrop-blur-xl px-4 py-2 border border-premium-700/50 rounded-2xl flex items-center gap-3 shadow-2xl">
            <div className="px-2 py-0.5 bg-accent/20 text-accent rounded-md font-bold text-[10px]">VER 1.0</div>
            <span className="text-xs text-premium-400">PROJECT: <span className="text-white font-medium">LIVING ROOM REDESIGN</span></span>
          </div>
        </motion.div>

        {/* View Transitioning Logic */}
        <AnimatePresence mode="wait">
          {viewMode === '2d' ? (
            <motion.div
              key="2d-editor"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <DesignCanvas
                state={state}
                updateState={updateState}
                pushToHistory={pushToHistory}
              />
            </motion.div>
          ) : (
            <motion.div
              key="3d-viewer"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <ThreeDViewer
                state={state}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Bar */}
        <footer className="h-8 border-t border-premium-800 bg-premium-950 flex items-center px-6 justify-between text-[10px] text-premium-500 font-medium">
          <div className="flex gap-4">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_green]" />
              SYSTEM RUNNING
            </span>
            <span className="opacity-40">|</span>
            <span>OBJECT COUNT: {state.items.length}</span>
            <span className="opacity-40">|</span>
            <span>DIMENSIONS: {state.room.width} x {state.room.length} M</span>
          </div>
          <div className="flex gap-4">
            <span>LOCAL STORAGE STORAGE ACTIVE</span>
            <span className="opacity-40">|</span>
            <span className="text-premium-400">© 2026 FURNISHAR PREMIUM</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;