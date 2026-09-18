import React from 'react';
import { NavLink, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { MessageSquare, ShieldCheck, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Guest User';

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/auth');
  };

  const navItems = [
    { path: '/', label: 'Loan Assistant', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Sidebar Navigation */}
      <nav className="w-20 md:w-64 h-full glass-panel flex flex-col justify-between py-8 px-4 flex-shrink-0 z-50">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-sm flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="hidden md:block text-lg font-bold font-['Outfit'] tracking-tight text-foreground">
              VHF<span className="text-primary">Bank</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="hidden md:block relative z-10 font-medium text-sm">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User Profile Mini */}
        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-black/20 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="hidden md:block overflow-hidden flex-1">
              <p className="text-sm font-medium text-foreground truncate">{username}</p>
              <p className="text-xs text-muted-foreground truncate">Verified Client</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden md:block font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-full relative overflow-hidden bg-gradient-dark">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
