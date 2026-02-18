import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import Card from '../../../components/Card/Card';
import { register } from '../api/authApi';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
                    Create Account
                </h1>
                <p className="text-gray-400 mt-2">Join the future of banking</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="name"
                    type="text"
                    label="Full Name"
                    placeholder="Naveen"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    id="email"
                    type="email"
                    label="Email Address"
                    placeholder="naveen@example.com"
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
                <Input
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <Button
                    type="submit"
                    className="w-full mt-4"
                    isLoading={isLoading}
                >
                    Create Account
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-neon-purple transition-colors">
                    Sign in
                </Link>
            </div>
        </Card>
    );
};

export default RegisterForm;
