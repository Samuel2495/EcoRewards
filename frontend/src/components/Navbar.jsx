import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-d-green">
                            EcoRewards
                        </span>
                    </Link>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="hover:text-d-green px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300">Home</Link>
                            <Link to="/vision" className="hover:text-d-green px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300">Our Vision</Link>
                            <Link to="/hubs" className="hover:text-d-green px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300">Disposal Hubs</Link>
                            <Link to="/contact" className="hover:text-d-green px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300">Contact</Link>

                            {!user ? (
                                <>
                                    <Link to="/login" className="border border-d-green text-d-green hover:bg-d-green hover:text-white px-4 py-2 rounded-full transition-all">
                                        Login
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center space-x-1 hover:text-d-green text-gray-300">
                                        <User size={18} />
                                        <span>{user.username}</span>
                                    </Link>
                                    <button onClick={handleLogout} className="text-red-400 hover:text-red-500 font-medium">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-d-green p-2">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-white/10"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/" className="text-gray-300 hover:text-d-green block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                            <Link to="/vision" className="text-gray-300 hover:text-d-green block px-3 py-2 rounded-md text-base font-medium">Our Vision</Link>
                            <Link to="/hubs" className="text-gray-300 hover:text-d-green block px-3 py-2 rounded-md text-base font-medium">Disposal Hubs</Link>
                            <Link to="/contact" className="text-gray-300 hover:text-d-green block px-3 py-2 rounded-md text-base font-medium">Contact</Link>
                            {!user ? (
                                <Link to="/login" className="bg-d-green text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                            ) : (
                                <>
                                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-gray-300 hover:text-d-green block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                    <button onClick={handleLogout} className="text-red-400 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Logout</button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
