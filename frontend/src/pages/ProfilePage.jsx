import React, { useState, useEffect } from 'react';
import Card from '../components/Card/Card';
import axios from 'axios';
import { User, Mail, CreditCard, Calendar, DollarSign, Activity } from 'lucide-react';

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Get user from local storage (or could fetch from an auth endpoint)
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                setUser(storedUser);

                // Fetch application status
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get('http://localhost:8080/applicant/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setApplication(response.data);
                }
            } catch (error) {
                console.error("Error fetching profile data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div className="text-white">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>

            {/* User Details */}
            <Card>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-2xl font-bold text-white">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <p className="text-gray-400 flex items-center gap-2">
                            <Mail size={14} /> {user.email}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Application Status */}
            <h2 className="text-2xl font-bold text-white">Application Status</h2>
            {application ? (
                <Card className="relative overflow-hidden">
                    <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-xl text-xs font-bold ${application.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                        application.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {application.status}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <CreditCard size={18} className="text-neon-blue" />
                                <div>
                                    <p className="text-xs text-gray-500">PAN Card</p>
                                    <p className="font-mono">{application.panCard}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <Activity size={18} className="text-neon-purple" />
                                <div>
                                    <p className="text-xs text-gray-500">Credit Score</p>
                                    <p className="font-bold">{application.creditScore}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <DollarSign size={18} className="text-green-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Annual Income</p>
                                    <p>${application.annualIncome.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <Calendar size={18} className="text-orange-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Applied Date</p>
                                    <p>{application.appliedDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {application.creditLimit > 0 && (
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="text-center">
                                <p className="text-sm text-gray-400">Approved Credit Limit</p>
                                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green">
                                    ${application.creditLimit.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            ) : (
                <Card>
                    <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">You haven't applied for a credit card yet.</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ProfilePage;
