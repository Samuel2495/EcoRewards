import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Trophy, LogOut, User, MapPin, Phone, Wallet, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const links = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/dashboard/wallet', icon: Wallet, label: 'My Wallet' },
        { path: '/dashboard/bulk-recycle', icon: Truck, label: 'Bulk Recycle' },
        { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
        { path: '/dashboard/hubs', icon: MapPin, label: 'Disposal Hubs' },
        { path: '/dashboard/contact', icon: Phone, label: 'Contact Us' },
    ];

    return (
        <div className="h-screen w-64 glass border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-white/10">
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-d-green">EcoRewards</span>
                </Link>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(link.path)
                            ? 'bg-d-green text-white shadow-lg shadow-d-green/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <link.icon size={20} />
                        <span className="font-medium">{link.label}</span>
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-d-green/20 flex items-center justify-center text-d-green">
                        <User size={16} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user?.username || 'User'}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role || 'Member'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
