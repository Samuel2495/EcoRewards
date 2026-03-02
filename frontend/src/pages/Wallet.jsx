import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ShoppingBag, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const Wallet = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('redeem'); // 'redeem' or 'donate'
    const [notification, setNotification] = useState(null);

    const coupons = [
        { id: 1, name: 'Amazon Gift Card ₹500', cost: 500, image: 'https://images.unsplash.com/photo-1629431742616-527c244c776c?w=100&h=100&fit=crop' },
        { id: 2, name: 'EcoStore Discount 20%', cost: 200, image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb77c356?w=100&h=100&fit=crop' },
        { id: 3, name: 'Movie Ticket Voucher', cost: 300, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=100&fit=crop' },
        { id: 4, name: 'Metro Card Recharge ₹100', cost: 100, image: 'https://images.unsplash.com/photo-1575883267576-92842426366b?w=100&h=100&fit=crop' },
    ];

    const charities = [
        { id: 1, name: 'Plant a Tree', cost: 100, description: 'Plant one tree in a deforestation area.', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb77c356?w=100&h=100&fit=crop' },
        { id: 2, name: 'Clean The Ocean', cost: 50, description: 'Remove 1kg of plastic from the ocean.', image: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=100&h=100&fit=crop' },
        { id: 3, name: 'Feed the Hungry', cost: 50, description: 'Provide a meal for a person in need.', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100&h=100&fit=crop' },
    ];

    const handleTransaction = (item) => {
        if (user.credits >= item.cost) {
            const newCredits = user.credits - item.cost;
            updateUser({ credits: newCredits });
            showNotification('success', `Successfully ${activeTab === 'redeem' ? 'redeemed' : 'donated to'} ${item.name}!`);
        } else {
            showNotification('error', `Insufficient credits to ${activeTab === 'redeem' ? 'redeem this coupon' : 'make this donation'}.`);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="space-y-8 relative">
            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 20, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-xl flex items-center gap-3 ${notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="font-medium">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
                        My Wallet
                    </h1>
                    <p className="text-gray-400">Manage your credits and rewards</p>
                </div>
                <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border border-yellow-500/30 bg-yellow-500/10">
                    <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-400">
                        <Coins size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-yellow-200/70 font-medium uppercase tracking-wider">Current Balance</p>
                        <p className="text-2xl font-bold text-yellow-400">{user?.credits || 0} <span className="text-sm font-normal">Credits</span></p>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('redeem')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeTab === 'redeem'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    <ShoppingBag size={18} />
                    Coupons
                </button>
                <button
                    onClick={() => setActiveTab('donate')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeTab === 'donate'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    <Heart size={18} />
                    Donations
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'redeem' ? (
                        coupons.map((coupon) => (
                            <CreditItemCard
                                key={coupon.id}
                                item={coupon}
                                type="coupon"
                                onAction={() => handleTransaction(coupon)}
                                canAfford={user?.credits >= coupon.cost}
                            />
                        ))
                    ) : (
                        charities.map((charity) => (
                            <CreditItemCard
                                key={charity.id}
                                item={charity}
                                type="donation"
                                onAction={() => handleTransaction(charity)}
                                canAfford={user?.credits >= charity.cost}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const CreditItemCard = ({ item, type, onAction, canAfford }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass p-5 rounded-2xl flex flex-col h-full border border-white/5 hover:border-white/20 transition-colors"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${type === 'coupon' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {type === 'coupon' ? <ShoppingBag size={24} /> : <Heart size={24} />}
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full text-yellow-400 font-bold text-sm">
                <Coins size={14} />
                {item.cost}
            </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
        {item.description && <p className="text-gray-400 text-sm mb-4 flex-grow">{item.description}</p>}
        {!item.description && <div className="flex-grow"></div>} {/* Spacer if no description */}

        <Button
            onClick={onAction}
            disabled={!canAfford}
            className={`w-full mt-4 ${!canAfford ? 'opacity-50 cursor-not-allowed bg-gray-600' : ''}`}
            variant={type === 'coupon' ? 'primary' : 'secondary'} // Just reusing variants for visual distinction if possible
        >
            {type === 'coupon' ? 'Redeem' : 'Donate'}
        </Button>
    </motion.div>
);

export default Wallet;
