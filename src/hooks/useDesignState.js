import { useState, useCallback, useRef, useEffect } from 'react';

const INITIAL_STATE = {
    room: {
        width: 8,
        length: 8,
        wallColor: '#808e9b',
    },
    items: [],
};

const API_URL = 'http://localhost:5000/api/designs';

export const useDesignState = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const [designId, setDesignId] = useState(null);
    const [savedDesigns, setSavedDesigns] = useState([]);
    const historyRef = useRef([INITIAL_STATE]);
    const historyIndexRef = useRef(0);

    const pushToHistory = useCallback((newState) => {
        const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
        newHistory.push(JSON.parse(JSON.stringify(newState)));

        if (newHistory.length > 100) {
            newHistory.shift();
        } else {
            historyIndexRef.current++;
        }
        historyRef.current = newHistory;
    }, []);

    const setDesign = useCallback((updater) => {
        setState(updater);
    }, []);

    const undo = useCallback(() => {
        if (historyIndexRef.current > 0) {
            historyIndexRef.current--;
            const prevState = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]));
            setState(prevState);
        }
    }, []);

    const redo = useCallback(() => {
        if (historyIndexRef.current < historyRef.current.length - 1) {
            historyIndexRef.current++;
            const nextState = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]));
            setState(nextState);
        }
    }, []);

    const saveDesign = useCallback(async (customName) => {
        try {
            const dataToSave = state;
            const name = customName || (designId ? savedDesigns.find(d => d.id === designId)?.name : 'New Design');

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: designId,
                    name: name || 'Untitled Design',
                    design_data: dataToSave
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Server returned an error');
            }

            const result = await response.json();
            if (result.id) {
                setDesignId(result.id);
                alert('Design saved successfully!');
                loadDesignsList(); // Refresh list
            }
        } catch (error) {
            console.error('Save failed:', error);
            alert(`Failed to save design: ${error.message}`);
        }
    }, [state, designId, savedDesigns]);

    const loadDesignsList = useCallback(async () => {
        try {
            const response = await fetch(API_URL);
            const designs = await response.json();
            setSavedDesigns(designs);
            return designs;
        } catch (error) {
            console.error('Load list failed:', error);
            return [];
        }
    }, []);

    const loadSpecificDesign = useCallback((id) => {
        const design = savedDesigns.find(d => d.id === id);
        if (design) {
            const loadedState = design.design_data;
            setState(loadedState);
            setDesignId(design.id);
            historyRef.current = [loadedState];
            historyIndexRef.current = 0;
        }
    }, [savedDesigns]);

    const createNewDesign = useCallback(() => {
        setState(INITIAL_STATE);
        setDesignId(null);
        historyRef.current = [INITIAL_STATE];
        historyIndexRef.current = 0;
    }, []);

    const clearDesign = useCallback(() => {
        const clearedState = { ...state, items: [] };
        setState(clearedState);
        pushToHistory(clearedState);
    }, [state, pushToHistory]);

    useEffect(() => {
        loadDesignsList();
    }, [loadDesignsList]);

    return {
        state,
        updateState: setDesign,
        pushToHistory,
        undo,
        redo,
        canUndo: historyIndexRef.current > 0,
        canRedo: historyIndexRef.current < historyRef.current.length - 1,
        saveDesign,
        savedDesigns,
        loadSpecificDesign,
        createNewDesign,
        clearDesign,
        activeDesignId: designId
    };
};
