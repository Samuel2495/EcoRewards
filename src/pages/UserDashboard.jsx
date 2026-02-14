import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Coins, CheckCircle, Clock, XCircle, CalendarCheck, X } from 'lucide-react';
import { QrReader } from 'react-qr-reader';

const UserDashboard = () => {
    const { user, updateUser } = useAuth();
    const { tasks, userTasks, completeTask, checkInToHub } = useData();
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);

    // Calculate stats
    const approvedTasks = userTasks.filter(t => t.status === 'approved');

    const handleScan = (result, error) => {
        if (result) {
            const code = result?.text || result;
            if (code) {
                const response = checkInToHub(code);
                if (response.success) {
                    setScanResult(response.message);
                    setIsCheckedIn(true);
                    setShowScanner(false);
                    updateUser({ points: (user.points || 0) + response.points });
                } else {
                    setScanError(response.message);
                }
            }
        }
    };

    const handleCheckInClick = () => {
        if (!isCheckedIn) {
            setShowScanner(true);
            setScanResult(null);
            setScanError(null);
        }
    };

    const getTaskStatus = (taskId) => {
        const userTask = userTasks.find(t => t.taskId === taskId); // Get latest or find specific logic
        // If multiple completions allowed, logic varies. Assuming once per day/session for simplicity
        // Let's filter for the latest one
        const entry = [...userTasks].reverse().find(t => t.taskId === taskId);
        return entry ? entry.status : null;
    };

    return (
        <div className="space-y-8 relative">
            <AnimatePresence>
                {showScanner && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowScanner(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-neutral-900 border border-white/10 p-6 rounded-2xl w-full max-w-md relative z-10"
                        >
                            <button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-4 text-center">Scan Hub QR Code</h2>

                            <div className="overflow-hidden rounded-xl border-2 border-dashed border-emerald-500/50 mb-4 bg-black">
                                <QrReader
                                    onResult={(result, error) => handleScan(result, error)}
                                    className="w-full"
                                    constraints={{ facingMode: 'environment' }}
                                />
                            </div>

                            {scanError && (
                                <p className="text-red-400 text-center text-sm mb-4 bg-red-900/20 p-2 rounded">{scanError}</p>
                            )}

                            <p className="text-gray-400 text-center text-sm">
                                Point your camera at the QR code displayed at the recycling hub.
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="space-y-8">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
                            Hello, {user?.fullName || user?.username}
                        </h1>
                        <p className="text-gray-600">Track your progress and rewards</p>
                    </div>
                    <Button
                        onClick={handleCheckInClick}
                        disabled={isCheckedIn}
                        className={`${isCheckedIn ? 'bg-emerald-100 text-emerald-700 border-emerald-200 cursor-default' : ''}`}
                        variant={isCheckedIn ? 'outline' : 'primary'}
                    >
                        <CalendarCheck className="w-4 h-4 mr-2" />
                        {isCheckedIn ? 'Checked In' : 'Check In'}
                    </Button>
                </header>

                {/* Display success message if just checked in? */}
                {scanResult && isCheckedIn && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-6 flex items-center gap-3">
                        <CheckCircle size={20} />
                        {scanResult}
                    </motion.div>
                )}

                {/* Stats Cards */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
                            <Leaf size={32} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Total Points</p>
                            <h2 className="text-3xl font-bold text-white">{user.points || 0}</h2>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
                            <Coins size={32} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Credits Earned</p>
                            <h2 className="text-3xl font-bold text-white">{user.credits || 0}</h2>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                            <CheckCircle size={32} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Tasks Completed</p>
                            <h2 className="text-3xl font-bold text-white">{approvedTasks.length}</h2>
                        </div>
                    </motion.div>
                </div>

                {/* Daily Tasks */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-white">Daily Tasks</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task) => {
                            const status = getTaskStatus(task.id);
                            return (
                                <motion.div
                                    key={task.id}
                                    whileHover={{ y: -5 }}
                                    className="glass p-6 rounded-2xl flex flex-col justify-between"
                                >
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-white">{task.title}</h3>
                                        <p className="text-gray-300 text-sm mb-4">{task.description}</p>
                                        <div className="flex gap-3 mb-6">
                                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {task.points} pts
                                            </span>
                                            <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {task.credits} cr
                                            </span>
                                        </div>
                                    </div>

                                    {status === 'approved' ? (
                                        <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium bg-emerald-50 py-2 rounded-xl">
                                            <CheckCircle size={18} /> Completed
                                        </div>
                                    ) : status === 'pending' ? (
                                        <div className="flex items-center justify-center gap-2 text-amber-600 font-medium bg-amber-50 py-2 rounded-xl">
                                            <Clock size={18} /> Pending Verification
                                        </div>
                                    ) : status === 'rejected' ? (
                                        <div className="flex items-center justify-center gap-2 text-red-600 font-medium bg-red-50 py-2 rounded-xl">
                                            <XCircle size={18} /> Rejected
                                        </div>
                                    ) : (
                                        <Button onClick={() => completeTask(task.id)} className="w-full">
                                            Mark as Complete
                                        </Button>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;
