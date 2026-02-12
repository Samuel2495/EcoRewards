import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const Vision = () => {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">Our Vision</h1>
                    <p className="text-xl text-gray-600">
                        At EcoRewards, we believe in making everyday tasks more fulfilling, sustainable, and rewarding.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass p-8 rounded-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-emerald-400">Mission</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Our mission is to inspire individuals to take charge of their daily responsibilities with a sense of purpose and accomplishment. By seamlessly blending task management with eco-conscious waste disposal, we aim to create a system that not only enhances productivity but also promotes a cleaner, more sustainable environment.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass p-8 rounded-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-emerald-400">Innovation</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Through our innovative platform, we empower users to stay organized by assigning them daily tasks, including responsible waste disposal, all while rewarding their progress. Every completed task brings them one step closer to achieving personal goals, with the added incentive of tangible rewards that motivate continued success.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass p-8 rounded-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-emerald-400">Future</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We envision a world where small, consistent actions make a big impact—on both the individual's sense of achievement and the planet's well-being. Our platform is more than just a task manager; it's a movement toward a more mindful, organized, and environmentally-friendly lifestyle. Together, let's create positive habits that lead to lasting change, one task at a time.
                        </p>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default Vision;
