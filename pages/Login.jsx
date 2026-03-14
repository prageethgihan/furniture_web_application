import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Eye, EyeOff, Hexagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/workspace');
            } else {
                setErrorMsg(data.error || 'Invalid credentials');
                setIsLoading(false);
            }
        } catch (error) {
            setErrorMsg('Server connection failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0d1117] flex items-center justify-center p-4 font-inter text-premium-400 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-premium-700/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 premium-shadow relative overflow-hidden">
                    {/* Subtle top border glow */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

                    {/* Logo / Header */}
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                            className="w-16 h-16 bg-[#0d1117] rounded-xl border border-[#30363d] flex items-center justify-center shadow-inner mb-4 relative"
                        >
                            <Hexagon size={32} className="text-accent" strokeWidth={1.5} />
                            <div className="absolute inset-0 bg-accent/20 blur-md rounded-xl" />
                        </motion.div>
                        <h1 className="text-2xl font-semibold text-white tracking-tight">Furnishar Premium</h1>
                        <p className="text-sm mt-2">Sign in to your design workspace</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs rounded-lg p-3 text-center"
                            >
                                {errorMsg}
                            </motion.div>
                        )}
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
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-medium text-premium-500 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-xs text-accent hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-premium-600 group-focus-within:text-accent transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-lg focus:ring-1 focus:ring-accent focus:border-accent block pl-10 pr-10 p-2.5 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-premium-600 hover:text-white transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-accent focus:ring-accent focus:ring-offset-gray-800"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-premium-400">Remember me for 30 days</label>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            type="submit"
                            className="w-full text-white bg-accent hover:bg-opacity-90 font-medium rounded-lg text-sm px-5 py-3 text-center flex items-center justify-center gap-2 group transition-all"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Initialize Workspace</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

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
