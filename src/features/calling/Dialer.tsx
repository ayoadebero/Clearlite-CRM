import React from 'react';
import { Phone, PhoneOff, MicOff, X } from 'lucide-react';
import { useCall } from '../../context/CallContext';
import '../../styles/components.css';

const Dialer: React.FC = () => {
    const { isOpen, callState, closeDialer, startCall, endCall, updateNumber } = useCall();

    if (!isOpen) return null;

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleKeyClick = (key: string) => {
        updateNumber(callState.number + key);
    };

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
    const isCallActive = callState.status === 'connected';

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className={`modal-content ${isCallActive ? 'calling-animation' : ''}`}>
                <div className="dialer-display">
                    <div className="dialer-number">{callState.number || 'Enter Number'}</div>
                    <div className="dialer-status">
                        {callState.status === 'connected' ? 'Connected' :
                            callState.status === 'ended' ? 'Call Ended' : 'Ready to Call'}
                    </div>
                    {isCallActive && (
                        <div className="text-xl font-bold mt-2">{formatDuration(callState.duration)}</div>
                    )}
                </div>

                {!isCallActive && (
                    <div className="dialer-keypad">
                        {keys.map(k => (
                            <button key={k} className="keypad-btn" onClick={() => handleKeyClick(k)}>
                                {k}
                            </button>
                        ))}
                    </div>
                )}

                <div className="call-actions">
                    {!isCallActive ? (
                        <button className="btn-call start" onClick={startCall}>
                            <Phone size={24} />
                        </button>
                    ) : (
                        <>
                            <button className="btn-call mute">
                                <MicOff size={24} />
                            </button>
                            <button className="btn-call end" onClick={endCall}>
                                <PhoneOff size={24} />
                            </button>
                        </>
                    )}

                    {!isCallActive && (
                        <button
                            className="icon-btn"
                            style={{ position: 'absolute', top: '16px', right: '16px' }}
                            onClick={closeDialer}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dialer;
