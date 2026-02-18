import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatusCard from '../features/dashboard/components/StatusCard';
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import axios from 'axios';

const DashboardPage = () => {
    const [application, setApplication] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{"name": "User"}');

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:8080/applicant/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplication(response.data);
            } catch (error) {
                console.error("Error fetching application:", error);
                if (error.response && error.response.status === 403) {
                    // Token might be invalid
                    localStorage.removeItem('token');
                    // window.location.href = '/login'; // Optional: auto-redirect
                }
            }
        };

        fetchApplication();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">{user.name}</span>
                    </h1>
                    <p className="text-gray-400">Welcome to your credit dashboard.</p>
                </div>

                {!application && (
                    <Link to="apply">
                        <Button>
                            <Plus size={20} />
                            Apply Now
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-1"
                >
                    <StatusCard application={application} />
                </motion.div>

                {/* Mock additional widgets */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-surface/30 border border-white/5 flex flex-col justify-center items-center text-center">
                        <h3 className="text-gray-400 font-medium mb-2">Credit Score</h3>
                        <div className="text-5xl font-bold text-white">
                            {application?.creditScore || '---'}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Updated just now</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-surface/30 border border-white/5 flex flex-col justify-center items-center text-center">
                        <h3 className="text-gray-400 font-medium mb-2">Next Application Eligibility</h3>
                        <div className="text-xl font-bold text-white">
                            {application ? (() => {
                                const nextDate = new Date(application.appliedDate);
                                nextDate.setMonth(nextDate.getMonth() + 6);
                                return nextDate.toLocaleDateString();
                            })() : '---'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
