import { Link } from 'react-router-dom';
import { ShieldCheck, MessageSquarePlus, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function Home() {
  const steps = [
    {
      icon: <MessageSquarePlus className="w-8 h-8 text-white" />,
      title: 'Submit Complaint',
      description: 'Easily log your issue with relevant details and attachments.',
      color: 'bg-blue-500',
    },
    {
      icon: <Clock className="w-8 h-8 text-white" />,
      title: 'Admin Review',
      description: 'Our team reviews and assigns your complaint to the right department.',
      color: 'bg-indigo-500',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      title: 'Action Taken',
      description: 'The department investigates and works on resolving the issue.',
      color: 'bg-blue-600',
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-white" />,
      title: 'Resolution',
      description: 'You get notified once the problem is fully resolved.',
      color: 'bg-indigo-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 15 } }
  };

  const stepContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const stepItemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 40 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', bounce: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-[#8ea7d6] flex flex-col font-sans overflow-hidden">
      {/* Navigation Layer */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="p-6 md:px-12 flex justify-between items-center z-20 sticky top-0 bg-[#8ea7d6]/80 backdrop-blur-md"
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 bg-[#1d40a8] rounded-xl flex items-center justify-center shadow-lg"
          >
            <ShieldCheck className="text-white w-6 h-6" />
          </motion.div>
          <span className="text-2xl font-extrabold text-[#1d40a8] tracking-tight">CMS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-white font-semibold hover:text-[#1d40a8] transition-colors">Login</Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/register" className="bg-[#1d40a8] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-[#153084] transition-colors inline-block">
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      <main className="flex-1 flex flex-col items-center relative z-10">
        
        {/* Background Decorative Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] border-[40px] border-white/10 rounded-full blur-sm pointer-events-none"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] border-[30px] border-white/10 rounded-full blur-sm pointer-events-none"
        />

        {/* Hero Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-6xl px-6 py-20 md:py-32 flex flex-col items-center text-center z-10"
        >
          <motion.div variants={itemVariants} className="inline-block mb-6 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold tracking-wider uppercase border border-white/30">
            Streamlined Issue Tracking
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-white mb-8 drop-shadow-md leading-tight">
            Resolve Issues <br className="hidden md:block"/> 
            <span className="text-[#1d40a8] drop-shadow-sm">Faster Than Ever</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="max-w-2xl text-lg md:text-xl text-white/90 font-medium mb-12 shadow-sm drop-shadow-sm">
            Empowering students and administrators with a seamless, transparent, and accountable platform for handling complaints.
          </motion.p>
          <motion.div variants={itemVariants} className="flex gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="flex items-center gap-2 bg-[#1d40a8] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-[#153084] hover:shadow-2xl transition-colors">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Workflow Section */}
        <motion.div 
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: 'spring', damping: 20, stiffness: 60 }}
          className="w-full bg-white flex-1 z-10 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] pt-20 pb-24 px-6 relative mt-10"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-extrabold text-[#1d40a8] mb-4">How It Works</h2>
              <p className="text-slate-500 font-medium max-w-xl mx-auto">Our streamlined process ensures your complaints are heard and resolved efficiently, with complete visibility at every step.</p>
            </motion.div>

            <motion.div 
              variants={stepContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
            >
              {/* Connection Line Desktop */}
              <motion.div 
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                className="hidden lg:block absolute top-[4rem] left-10 right-10 h-1 bg-indigo-100 z-0 rounded-full origin-left"
              />

              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  variants={stepItemVariants}
                  className="relative z-10 flex flex-col items-center text-center group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                    className={`w-20 h-20 rounded-2xl ${step.color} shadow-xl flex items-center justify-center mb-6 ring-4 ring-white`}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </main>

    </div>
  );
}
