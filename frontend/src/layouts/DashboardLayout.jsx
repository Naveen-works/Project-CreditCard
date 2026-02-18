import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, CreditCard, LogOut, User } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from '../components/Button/Button';

const SidebarLink = ({ to, icon: Icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
            isActive
                ? "bg-primary/20 text-white shadow-lg shadow-primary/10"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
        )}
    >
        <Icon size={20} className="group-hover:text-neon-blue transition-colors" />
        <span className="font-medium">{children}</span>
    </NavLink>
);

const DashboardLayout = () => {
    const navigate = useNavigate();
    // Mock user data - in real app, get from context
    const user = { name: 'User', role: 'APPLICANT' };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-64 border-r border-white/10 bg-surface/50 backdrop-blur-xl fixed h-full z-50 hidden md:flex flex-col p-6"
            >
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-neon-blue flex items-center justify-center font-bold text-xl">
                        CC
                    </div>
                    <span className="text-xl font-bold tracking-wider text-white">
                        NEXUS
                    </span>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarLink to="/dashboard" icon={LayoutDashboard}>Overview</SidebarLink>
                    <SidebarLink to="/dashboard/apply" icon={CreditCard}>Apply Now</SidebarLink>
                    <SidebarLink to="/dashboard/profile" icon={User}>Profile</SidebarLink>
                </nav>

                <div className="mt-auto">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
                        <p className="text-sm text-gray-400">Logged in as</p>
                        <p className="font-medium text-white truncate">{user.name}</p>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} className="mr-2" />
                        Logout
                    </Button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-10 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 rounded-full blur-[150px] -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};

export default DashboardLayout;
