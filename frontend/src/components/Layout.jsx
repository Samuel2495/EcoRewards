import Navbar from './Navbar';
import ParticlesBackground from './ParticlesBackground';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen text-gray-100 relative overflow-hidden">
            <ParticlesBackground />
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10"
            >
                {children}
            </motion.main>

            <footer className="glass mt-auto py-8 text-center text-gray-400 text-sm border-t border-white/10">
                <p>&copy; {new Date().getFullYear()} EcoRewards. All rights reserved.</p>
                <p className="mt-2">Building a sustainable future, one task at a time.</p>
            </footer>
        </div>
    );
};

export default Layout;
