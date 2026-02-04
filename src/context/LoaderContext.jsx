import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('INITIALIZING SYSTEM');
    const timerRef = useRef(null);

    const showLoader = useCallback((msg = 'INITIALIZING SYSTEM', duration = null) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        setMessage(msg);
        setIsLoading(true);

        if (duration) {
            timerRef.current = setTimeout(() => {
                setIsLoading(false);
            }, duration);
        }
    }, []);

    const hideLoader = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsLoading(false);
    }, []);

    const updateMessage = useCallback((msg) => {
        setMessage(msg);
    }, []);

    return (
        <LoaderContext.Provider value={{ isLoading, message, showLoader, hideLoader, updateMessage }}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};
