import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface CallState {
    status: 'idle' | 'dialing' | 'connected' | 'ended';
    number: string;
    duration: number;
}

interface CallContextType {
    isOpen: boolean;
    callState: CallState;
    openDialer: (number?: string) => void;
    closeDialer: () => void;
    startCall: () => void;
    endCall: () => void;
    updateNumber: (num: string) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [callState, setCallState] = useState<CallState>({
        status: 'idle',
        number: '',
        duration: 0
    });
    const [timerId, setTimerId] = useState<number | null>(null);

    const openDialer = (number: string = '') => {
        setIsOpen(true);
        setCallState(prev => ({ ...prev, number, status: 'idle' }));
    };

    const closeDialer = () => {
        setIsOpen(false);
        if (callState.status === 'connected') {
            endCall();
        }
    };

    const updateNumber = (num: string) => {
        setCallState(prev => ({ ...prev, number: num }));
    };

    const startCall = () => {
        setCallState(prev => ({ ...prev, status: 'connected', duration: 0 }));
        const id = window.setInterval(() => {
            setCallState(prev => ({ ...prev, duration: prev.duration + 1 }));
        }, 1000);
        setTimerId(id);
    };

    const endCall = () => {
        if (timerId) window.clearInterval(timerId);
        setTimerId(null);
        setCallState(prev => ({ ...prev, status: 'ended' }));
        setTimeout(() => {
            setCallState(prev => ({ ...prev, status: 'idle', duration: 0 }));
        }, 2000);
    };

    return (
        <CallContext.Provider value={{ isOpen, callState, openDialer, closeDialer, startCall, endCall, updateNumber }}>
            {children}
        </CallContext.Provider>
    );
};

export const useCall = () => {
    const context = useContext(CallContext);
    if (!context) throw new Error('useCall must be used within a CallProvider');
    return context;
};
