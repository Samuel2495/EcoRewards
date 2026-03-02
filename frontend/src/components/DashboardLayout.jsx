import Sidebar from './Sidebar';
import ParticlesBackground from './ParticlesBackground';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-neutral-900 text-gray-100 relative overflow-hidden flex">
            <ParticlesBackground />

            <Sidebar />

            <motion.main
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 ml-64 p-8 sm:p-12 relative z-10 overflow-y-auto h-screen"
            >
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </motion.main>
        </div>
    );
};

export default DashboardLayout;
