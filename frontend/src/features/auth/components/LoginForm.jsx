import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import Card from '../../../components/Card/Card';
import { login } from '../api/authApi';

const LoginForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await login(formData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'APPROVER') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto relative overflow-hidden">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Welcome Back
                </h1>
                <p className="text-gray-400 mt-2">Sign in to manage your credit</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    id="email"
                    type="email"
                    label="Email Address"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <Input
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20"
                    >
                        {error}
                    </motion.div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                >
                    Sign In
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:text-neon-purple transition-colors">
                    Create one
                </Link>
            </div>
        </Card>
    );
};

export default LoginForm;
