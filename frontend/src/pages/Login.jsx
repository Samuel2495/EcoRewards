import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = await login(
            formData.username,
            formData.password,
            isAdmin ? 'admin' : 'user'
        );

        if(result.success){
            navigate(isAdmin ? '/admin' : '/dashboard');
        }   else{
            setError(result.message);
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-2xl w-full max-w-md"
                >
                    <h2 className="text-3xl font-bold text-center mb-2 text-white">Welcome Back</h2>
                    <p className="text-center text-gray-400 mb-8">Login to continue your eco-journey</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/10 p-1 rounded-lg inline-flex">
                                <button
                                    type="button"
                                    onClick={() => setIsAdmin(false)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isAdmin ? 'bg-d-green text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                >
                                    User Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAdmin(true)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isAdmin ? 'bg-d-green text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Admin Login
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm text-center border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-d-green/50 focus:border-d-green transition-all"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-d-green/50 focus:border-d-green transition-all"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="w-full py-3">
                            Login
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Login;
