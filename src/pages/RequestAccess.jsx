import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, User, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RequestAccess() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock API Call to request access
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full bg-[#0d1117] flex items-center justify-center p-4 font-inter text-premium-400 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-premium-700/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 premium-shadow relative overflow-hidden">
                    {/* Subtle top border glow */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-xs text-premium-500 hover:text-white mb-6 group transition-colors"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </button>

                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-white tracking-tight">Request Access</h1>
                        <p className="text-sm mt-2">Get early access to our professional floor planner.</p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-premium-500 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-premium-600 group-focus-within:text-accent transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-lg focus:ring-1 focus:ring-accent focus:border-accent block pl-10 p-2.5 transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-premium-500 uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-premium-600 group-focus-within:text-accent transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-lg focus:ring-1 focus:ring-accent focus:border-accent block pl-10 p-2.5 transition-all outline-none"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-premium-500 uppercase tracking-wider ml-1">Company / Organization</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-premium-600 group-focus-within:text-accent transition-colors">
                                        <Building size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="w-full bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-lg focus:ring-1 focus:ring-accent focus:border-accent block pl-10 p-2.5 transition-all outline-none"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full mt-4 text-white bg-accent hover:bg-opacity-90 font-medium rounded-lg text-sm px-5 py-3 text-center flex items-center justify-center gap-2 group transition-all"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Submit Request</span>
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-accent/10 border border-accent/20 rounded-xl p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send size={20} />
                            </div>
                            <h3 className="text-white font-medium mb-2">Request Received!</h3>
                            <p className="text-sm text-premium-400">
                                Thank you for your interest. We will review your request and get back to you at <strong className="text-accent">{email}</strong> shortly.
                            </p>
                        </motion.div>
                    )}
                </div>

                <div className="mt-8 text-center text-[10px] text-premium-600 flex justify-center items-center gap-4">
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_green]" /> SYSTEM ONLINE</span>
                    <span className="opacity-40">|</span>
                    <span>SECURE ENCLAVE CONNECTION</span>
                </div>
            </motion.div>
        </div>
    );
}