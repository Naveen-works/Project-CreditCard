import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card/Card';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import axios from 'axios';
import { motion } from 'framer-motion';

const ApplyPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        applicantName: '',
        panCard: '',
        email: '',
        dob: '',
        annualIncome: ''
    });

    // Auto-fill from logged in user
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setFormData(prev => ({
                ...prev,
                applicantName: user.name || '',
                email: user.email || ''
            }));
        }
    }, []);

    const validate = () => {
        const newErrors = {};

        // PAN Card Validation: 5 letters, 4 digits, 1 letter
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(formData.panCard.toUpperCase())) {
            newErrors.panCard = "Invalid PAN format (e.g., ABCDE1234F)";
        }

        // Age Validation: Must be > 18
        if (formData.dob) {
            const birthDate = new Date(formData.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                newErrors.dob = "You must be at least 18 years old.";
            }
        }

        // Income Validation
        if (formData.annualIncome < 0) {
            newErrors.annualIncome = "Income cannot be negative";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        // Clear error when user types
        if (errors[e.target.id]) {
            setErrors({ ...errors, [e.target.id]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/applicant/apply', {
                ...formData,
                panCard: formData.panCard.toUpperCase(), // Ensure backend gets uppercase
                annualIncome: parseFloat(formData.annualIncome)
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const applicationData = response.data;
            localStorage.setItem('lastApplication', JSON.stringify(applicationData));

            alert("Application Submitted Successfully!");
            navigate('/dashboard');
        } catch (error) {
            console.error("Application failed", error);
            const serverError = error.response?.data?.error || "Application failed. Please check your inputs.";
            alert(serverError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Credit Card Application</h1>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            id="applicantName"
                            label="Full Name"
                            placeholder="As per ID proof"
                            value={formData.applicantName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="contact@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled // Lock email if auto-filled? Optional. Keeping editable for now but usually locked.
                        />
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Input
                                id="panCard"
                                label="PAN Card Number"
                                placeholder="ABCDE1234F"
                                value={formData.panCard}
                                onChange={handleChange}
                                required
                                maxLength={10}
                            />
                            {errors.panCard && <p className="text-red-400 text-xs mt-1">{errors.panCard}</p>}
                        </div>

                        <div>
                            <Input
                                id="dob"
                                label="Date of Birth"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                            {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob}</p>}
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div>
                        <Input
                            id="annualIncome"
                            label="Annual Income (USD)"
                            type="number"
                            placeholder="50000"
                            value={formData.annualIncome}
                            onChange={handleChange}
                            required
                        />
                        {errors.annualIncome && <p className="text-red-400 text-xs mt-1">{errors.annualIncome}</p>}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/dashboard')}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            Submit Application
                        </Button>
                    </div>
                </form>
            </Card>

            <p className="text-gray-500 text-xs text-center mt-6">
                By submitting you agree to our terms and credit checks.
            </p>
        </div>
    );
};

export default ApplyPage;
