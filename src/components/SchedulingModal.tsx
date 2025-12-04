import React from 'react';
import { X } from 'lucide-react';
import { InlineWidget } from 'react-calendly';
import '../styles/components.css';

interface SchedulingModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerName?: string;
    customerEmail?: string;
}

const SchedulingModal: React.FC<SchedulingModalProps> = ({
    isOpen,
    onClose,
    customerName,
    customerEmail
}) => {
    if (!isOpen) return null;

    const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com';

    const prefill = {
        name: customerName || '',
        email: customerEmail || ''
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', height: '700px' }}>
                <div className="modal-header">
                    <h2>Schedule Appointment</h2>
                    <button onClick={onClose} className="icon-btn">
                        <X size={20} />
                    </button>
                </div>
                <div style={{ height: '600px', overflow: 'hidden' }}>
                    <InlineWidget
                        url={calendlyUrl}
                        prefill={prefill}
                        styles={{ height: '100%' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SchedulingModal;
