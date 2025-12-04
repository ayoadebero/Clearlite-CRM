import React from 'react';
import { Users, TrendingUp, Phone, Clock } from 'lucide-react';
import { MOCK_CUSTOMERS } from '../../data/mockData';
import '../../styles/analytics.css';

const Analytics: React.FC = () => {
    // Calculate metrics from customer data
    const totalCustomers = MOCK_CUSTOMERS.length;
    const activeCustomers = MOCK_CUSTOMERS.filter(c => c.status === 'active').length;
    const leads = MOCK_CUSTOMERS.filter(c => c.status === 'lead').length;
    const inactiveCustomers = MOCK_CUSTOMERS.filter(c => c.status === 'inactive').length;

    // Calculate call metrics
    const allCalls = MOCK_CUSTOMERS.flatMap(c => c.calls);
    const totalCalls = allCalls.length;

    // Calculate average duration (convert "Xm Ys" to seconds)
    const avgDurationSeconds = allCalls.length > 0
        ? allCalls.reduce((acc, call) => {
            const match = call.duration.match(/(\d+)m\s+(\d+)s/);
            if (match) {
                return acc + (parseInt(match[1]) * 60) + parseInt(match[2]);
            }
            return acc;
        }, 0) / allCalls.length
        : 0;

    const avgDuration = `${Math.floor(avgDurationSeconds / 60)}m ${Math.floor(avgDurationSeconds % 60)}s`;

    const metrics = [
        { icon: Users, label: 'Total Customers', value: totalCustomers, color: 'var(--primary)' },
        { icon: TrendingUp, label: 'Active Customers', value: activeCustomers, color: 'var(--success)' },
        { icon: Users, label: 'Leads', value: leads, color: 'var(--warning)' },
        { icon: Phone, label: 'Total Calls', value: totalCalls, color: 'var(--primary)' },
        { icon: Clock, label: 'Avg Call Duration', value: avgDuration, color: 'var(--success)' },
        { icon: Users, label: 'Inactive', value: inactiveCustomers, color: 'var(--text-muted)' },
    ];

    return (
        <div className="analytics-container">
            <h2 className="analytics-title">Dashboard Overview</h2>

            <div className="metrics-grid">
                {metrics.map((metric, index) => (
                    <div key={index} className="metric-card">
                        <div className="metric-icon" style={{ color: metric.color }}>
                            <metric.icon size={24} />
                        </div>
                        <div className="metric-content">
                            <div className="metric-label">{metric.label}</div>
                            <div className="metric-value">{metric.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <h3>Customer Distribution</h3>
                    <div className="bar-chart">
                        <div className="bar" style={{ height: `${(activeCustomers / totalCustomers) * 100}%`, background: 'var(--success)' }}>
                            <span>{activeCustomers}</span>
                        </div>
                        <div className="bar" style={{ height: `${(leads / totalCustomers) * 100}%`, background: 'var(--warning)' }}>
                            <span>{leads}</span>
                        </div>
                        <div className="bar" style={{ height: `${(inactiveCustomers / totalCustomers) * 100}%`, background: 'var(--text-muted)' }}>
                            <span>{inactiveCustomers}</span>
                        </div>
                    </div>
                    <div className="chart-labels">
                        <span>Active</span>
                        <span>Leads</span>
                        <span>Inactive</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
