import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Activity, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar p-6 md:p-12">
      <motion.div 
        className="max-w-6xl mx-auto space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold font-['Outfit'] text-foreground tracking-tight">
              Welcome back.
            </motion.h1>
            <motion.p variants={itemVariants} className="text-muted-foreground text-lg max-w-2xl">
              Access intelligent loan advisory, instant Aadhaar eKYC verification, and real-time eligibility scoring powered by AI.
            </motion.p>
          </div>
        </div>

        {/* Hero / Action Card */}
        <motion.div variants={itemVariants} className="relative w-full rounded-3xl overflow-hidden glass p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 group">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="flex-1 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Application</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground font-['Outfit'] leading-tight">
              Ready to check your loan eligibility?
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Our intelligent assistant will guide you through secure KYC verification and instantly calculate your eligibility based on real-time banking parameters.
            </p>
            <button 
              onClick={() => navigate('/chat')}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 glow-sm"
            >
              Start Application
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Decorative element */}
          <div className="hidden md:flex flex-shrink-0 w-64 h-64 relative z-10 items-center justify-center">
             <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_10s_linear_infinite] border-t-primary" />
             <div className="absolute inset-4 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse] border-b-primary/50" />
             <ShieldCheck className="w-24 h-24 text-primary opacity-80" />
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors cursor-default">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Secure eKYC</h3>
            <p className="text-sm text-muted-foreground">Your Aadhaar XML data is cryptographically verified locally and never sent to external LLMs.</p>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors cursor-default">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Instant Scoring</h3>
            <p className="text-sm text-muted-foreground">Real-time eligibility calculation based on income and CIBIL score algorithms.</p>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors cursor-default">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">24/7 Advisory</h3>
            <p className="text-sm text-muted-foreground">Have questions? Our AI is trained on VHF Bank's official policies and guidelines.</p>
          </div>
        </motion.div>
        
        {/* Spacer for bottom padding */}
        <div className="h-8"></div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
