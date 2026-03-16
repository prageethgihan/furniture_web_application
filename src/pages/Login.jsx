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
            const response = await fetch('/api/login', {
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
        <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 font-inter text-white relative overflow-hidden mesh-bg">
            {/* Background Decor - Refined Pellets */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-alt/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-panel p-10 relative overflow-hidden shadow-2xl">
                    {/* Brand Identifier */}
                    <div className="flex flex-col items-center mb-10 text-center">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8 relative"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-alt rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] rotate-3">
                                <Hexagon size={40} className="text-white" strokeWidth={1.5} />
                            </div>
                            <div className="absolute -inset-2 bg-accent/20 blur-xl -z-10 animate-pulse" />
                        </motion.div>
                        
                        <h1 className="text-4xl font-black text-white font-outfit tracking-tighter mb-2">
                            FURNISHAR
                            <span className="block text-xs font-black text-accent tracking-[0.5em] uppercase mt-1 opacity-80">Studio Edition</span>
                        </h1>
                        <p className="text-xs text-white/40 tracking-widest font-black uppercase">Secure Access Protocol</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black tracking-widest uppercase rounded-xl p-4 text-center"
                            >
                                [ ERROR ]: {errorMsg}
                            </motion.div>
                        )}
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] font-outfit ml-1">Identity Vector</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 text-white text-sm rounded-2xl focus:ring-2 focus:ring-accent/50 focus:border-accent/50 block pl-12 p-4 transition-all outline-none font-outfit font-bold backdrop-blur-xl"
                                    placeholder="Enter system identifier..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] font-outfit">Access Cipher</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 text-white text-sm rounded-2xl focus:ring-2 focus:ring-accent/50 focus:border-accent/50 block pl-12 pr-12 p-4 transition-all outline-none font-outfit font-bold backdrop-blur-xl"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full relative group mt-4 h-14"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-accent-alt rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative w-full h-full bg-accent text-white rounded-2xl text-xs font-black tracking-[0.3em] shadow-xl font-outfit uppercase flex items-center justify-center gap-3 transition-transform active:scale-95">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        INITIALIZE SESSION
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
                        <a href="#" className="text-[10px] font-black text-white/20 hover:text-accent tracking-widest uppercase transition-colors">Request Access Credentials</a>
                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center px-4">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-[9px] font-black text-white/30 tracking-[0.2em] font-outfit uppercase">System Online</span>
                    </div>
                    <span className="text-[9px] font-black text-white/20 font-mono">NODE_774_SECURE</span>
                </div>
            </motion.div>
        </div>
    );
}
