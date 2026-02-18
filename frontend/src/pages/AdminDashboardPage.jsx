import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import { Check, X, Truck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/approver/applications', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setApplications(response.data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.put(`http://localhost:8080/api/approver/${action}/${id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchApplications(); // Refresh list
        } catch (error) {
            alert(`Failed to ${action} application`);
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
                    Admin Dashboard
                </h1>
                <Button variant="ghost" onClick={logout} className="text-red-400">
                    <LogOut size={20} className="mr-2" /> Logout
                </Button>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    <div className="text-center text-gray-500 py-10">Loading applications...</div>
                ) : applications.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No applications found.</div>
                ) : (
                    applications.map((app) => (
                        <Card key={app.id} className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white">{app.applicantName}</h3>
                                <p className="text-sm text-gray-400">PAN: {app.panCard} | Income: ${app.annualIncome}</p>
                                <p className="text-xs text-gray-500">Score: {app.creditScore} | Limit: ${app.creditLimit}</p>
                            </div>

                            <div className="px-4 py-1 rounded-full text-sm font-bold bg-white/5 border border-white/10">
                                <span className={
                                    app.status === 'APPROVED' ? 'text-green-400' :
                                        app.status === 'REJECTED' ? 'text-red-400' :
                                            app.status === 'DISPATCHED' ? 'text-neon-blue' : 'text-yellow-400'
                                }>
                                    {app.status}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                {app.status === 'PENDING' && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleAction(app.id, 'approve')}
                                        className="bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30 border border-neon-blue/50"
                                    >
                                        <Check size={16} className="mr-1" /> Process Application
                                    </Button>
                                )}
                            </div>

                            {app.status === 'APPROVED' && (
                                <Button size="sm" onClick={() => handleAction(app.id, 'dispatch')} className="bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30">
                                    <Truck size={16} className="mr-1" /> Dispatch
                                </Button>
                            )}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
