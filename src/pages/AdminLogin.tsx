import React, { useState } from 'react';
import axios from 'axios';
import { Zap, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-6 bg-mesh">
      <div className="absolute top-0 left-0 w-full h-full technical-grid opacity-10" />
      
      <div className="glass-card max-w-md w-full p-10 relative z-10 border-white/10 shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-neon-purple rounded-xl flex items-center justify-center text-white neon-glow-purple mb-4">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">SYSTEM <span className="text-neon-purple italic">ACCESS</span></h2>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mt-2">Restricted Area</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="text-xs text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Identification</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
              placeholder="Enter ID"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Passcode</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
                placeholder="Enter Passcode"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            </div>
          </div>
          
          <button type="submit" className="w-full neon-button py-4 mt-4">
            INITIATE OVERRIDE
          </button>
        </form>
      </div>
    </div>
  );
}
