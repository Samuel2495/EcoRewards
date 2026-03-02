import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, Users, ArrowRight } from 'lucide-react';

const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <section className="text-center space-y-8 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-md">
                        Turn Daily Tasks<br />Into Real Rewards
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                        Join the EcoRewards community and make a difference. Complete eco-friendly tasks, track your impact, and earn rewards for a sustainable lifestyle.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/signup">
                            <Button className="text-lg px-8 py-4">Get Started</Button>
                        </Link>
                        <Link to="/vision">
                            <Button variant="secondary" className="text-lg px-8 py-4">Learn More</Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Abstract Background Shapes */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </section>

            {/* Features Section */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-8"
            >
                <motion.div variants={itemVariants} className="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300 border border-white/5">
                    <div className="bg-d-green/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 text-d-green">
                        <Leaf size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Daily Tasks</h3>
                    <p className="text-gray-400">
                        Complete simple daily challenges like using reusable bags or saving water to earn points and maintain your streak.
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300 border border-white/5">
                    <div className="bg-d-green/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 text-d-green">
                        <Recycle size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Bulk Recycling</h3>
                    <p className="text-gray-400">
                        Visit our Disposal Hubs to recycle bulk waste. Earn credits for every kilogram of material you responsibly dispose of.
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300 border border-white/5">
                    <div className="bg-d-green/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 text-d-green">
                        <Users size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Community Impact</h3>
                    <p className="text-gray-400">
                        Join a growing community of eco-warriors. Compete on the leaderboard and see the collective impact of our actions.
                    </p>
                </motion.div>
            </motion.section>

            {/* CTA Section */}
            <section className="glass p-12 rounded-3xl text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6">Ready to make a change?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Start your journey towards a more sustainable future today. It's free, fun, and rewarding.
                    </p>
                    <Link to="/signup">
                        <Button className="mx-auto">
                            Join Now <ArrowRight size={20} />
                        </Button>
                    </Link>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </section>
        </div>
    );
};

export default Home;
