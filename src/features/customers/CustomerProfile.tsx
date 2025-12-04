import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, PhoneIncoming, PhoneOutgoing, MessageSquare, MessageCircle, Calendar } from 'lucide-react';
import { useCall } from '../../context/CallContext';
import SchedulingModal from '../../components/SchedulingModal';
import '../../styles/components.css';

const CustomerProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { openDialer } = useCall();
    const [customer, setCustomer] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [showScheduling, setShowScheduling] = React.useState(false);

    React.useEffect(() => {
        const loadCustomer = async () => {
            if (!id) return;
            try {
                // Import dynamically or use the imported service if added to imports
                const { getCustomerById } = await import('../../services/customerStorage');
                const data = await getCustomerById(id);
                setCustomer(data);
            } catch (error) {
                console.error('Failed to load customer', error);
            } finally {
                setLoading(false);
            }
        };
        loadCustomer();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!customer) return <div>Customer not found</div>;

    const handleText = () => {
        window.location.href = `sms:${customer.phone}`;
    };

    const handleWhatsApp = () => {
        // Remove non-numeric characters for WhatsApp URL
        const cleanPhone = customer.phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    return (
        <div className="profile-view">
            <button
                onClick={() => navigate(-1)}
                className="icon-btn"
                style={{ marginBottom: 'var(--space-md)', gap: 'var(--space-sm)' }}
            >
                <ArrowLeft size={18} /> Back
            </button>

            <div className="profile-header">
                <div className="profile-avatar-lg">{customer.avatar}</div>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>{customer.name}</h1>
                    <div className="text-muted">{customer.role} at {customer.company}</div>
                    <div className="flex gap-sm" style={{ marginTop: 'var(--space-sm)' }}>
                        <span className={`status-badge status-${customer.status}`}>{customer.status}</span>
                    </div>
                </div>
                <div className="flex gap-md">
                    <button
                        className="icon-btn"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                        onClick={handleText}
                        title="Send Text"
                    >
                        <MessageSquare size={20} />
                    </button>
                    <button
                        className="icon-btn"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                        onClick={handleWhatsApp}
                        title="WhatsApp"
                    >
                        <MessageCircle size={20} />
                    </button>
                    <button className="icon-btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                        <Mail size={20} />
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => setShowScheduling(true)}
                    >
                        <Calendar size={18} />
                        Schedule
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => openDialer(customer.phone)}
                    >
                        <Phone size={18} />
                        Call
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-xl)' }}>
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>Notes</h3>
                    <textarea
                        className="w-full"
                        rows={6}
                        defaultValue={customer.notes}
                        style={{ resize: 'none' }}
                    />
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>Contact Info</h3>
                    <div className="flex flex-col gap-md">
                        <div>
                            <div className="text-xs text-muted uppercase">Email</div>
                            <div>{customer.email}</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted uppercase">Phone</div>
                            <div>{customer.phone}</div>
                        </div>
                    </div>

                    <h3 style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>Recent Calls</h3>
                    <div className="call-history">
                        {customer.calls && customer.calls.length > 0 ? (
                            customer.calls.map((call: any) => (
                                <div key={call.id} className="flex items-center justify-between" style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <div className="flex items-center gap-sm">
                                        {call.type === 'outbound' ? (
                                            <PhoneOutgoing size={16} className="text-primary" />
                                        ) : (
                                            <PhoneIncoming size={16} className="text-success" />
                                        )}
                                        <div>
                                            <div className="text-sm font-bold">{new Date(call.date).toLocaleDateString()}</div>
                                            <div className="text-xs text-muted">{new Date(call.date).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted">{call.duration}</div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted text-sm">No recent calls.</p>
                        )}
                    </div>
                </div>
            </div>

            <SchedulingModal
                isOpen={showScheduling}
                onClose={() => setShowScheduling(false)}
                customerName={customer.name}
                customerEmail={customer.email}
            />
        </div>
    );
};

export default CustomerProfile;
