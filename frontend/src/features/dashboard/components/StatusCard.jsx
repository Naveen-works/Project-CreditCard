import React from 'react';
import Card from '../../../components/Card/Card';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const StatusCard = ({ application }) => {
    if (!application) {
        return (
            <Card className="border-dashed border-2 border-white/20 bg-transparent">
                <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-gray-400">No Applications Yet</h3>
                    <p className="text-gray-500 text-sm mt-1">Apply for a credit card to get started.</p>
                </div>
            </Card>
        );
    }

    const getStatusConfig = (status) => {
        switch (status) {
            case 'APPROVED': return { color: 'text-green-400', icon: CheckCircle, border: 'border-green-500/30' };
            case 'REJECTED': return { color: 'text-red-400', icon: XCircle, border: 'border-red-500/30' };
            case 'DISPATCHED': return { color: 'text-neon-blue', icon: CheckCircle, border: 'border-neon-blue/30' };
            default: return { color: 'text-yellow-400', icon: Clock, border: 'border-yellow-500/30' };
        }
    };

    const { color, icon: Icon, border } = getStatusConfig(application.status);

    return (
        <Card className={`border ${border}`}>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-300">Application Status</h3>
                    <p className="text-xs text-gray-500 mt-1">ID: {application.id}</p>
                </div>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>

            <div className="mt-6">
                <div className={`text-2xl font-bold tracking-wider ${color}`}>
                    {application.status}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                    Applied on: {new Date(application.appliedDate).toLocaleDateString()}
                </p>
            </div>

            {application.creditLimit > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Credit Limit</span>
                        <span className="text-xl font-mono text-white">
                            ${application.creditLimit.toLocaleString()}
                        </span>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default StatusCard;
