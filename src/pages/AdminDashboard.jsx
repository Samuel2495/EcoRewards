import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ClipboardCheck, Trash2, Check, X, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

const AdminDashboard = () => {
    const { getAllUsers, deleteUser, verifyTask, tasks, pickupRequests } = useData();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [showQrModal, setShowQrModal] = useState(false);

    const refreshData = () => {
        const allUsers = getAllUsers();
        setUsers(allUsers);

        // Aggregate all pending tasks
        const allPending = [];
        allUsers.forEach(user => {
            const userTasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
            userTasks.forEach(t => {
                if (t.status === 'pending') {
                    allPending.push({ ...t, userId: user.id, userName: user.fullName || user.username });
                }
            });
        });
        setPendingTasks(allPending);
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleVerify = (userId, taskId, approved) => {
        verifyTask(userId, taskId, approved);
        refreshData();
    };

    const handleDeleteUser = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteUser(userId);
            refreshData();
        }
    };

    const getTaskTitle = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        return task ? task.title : 'Unknown Task';
    };

    const getHubSpecificPoints = (userId) => {
        if (!user?.hubId) return 0;

        const checkIns = JSON.parse(localStorage.getItem(`checkins_${userId}`) || '[]');
        const hubCheckIns = checkIns.filter(ci => ci.hubId === user.hubId);
        return hubCheckIns.reduce((total, ci) => total + (ci.points || 0), 0);
    };

    return (
        <div className="space-y-10 relative">
            <AnimatePresence>
                {showQrModal && user?.hubCode && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowQrModal(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-neutral-900 border border-white/10 p-8 rounded-2xl w-full max-w-sm relative z-10 flex flex-col items-center shadow-2xl"
                        >
                            <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-2 text-center">{user.fullName}</h2>
                            <p className="text-gray-400 mb-6 text-center">Scan to Check In</p>

                            <div className="p-4 bg-white rounded-xl shadow-lg mb-6">
                                <QRCode
                                    value={user.hubCode}
                                    size={200}
                                    fgColor="#059669" // Emerald 600
                                    bgColor="#ffffff"
                                />
                            </div>

                            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-lg">
                                <p className="text-emerald-400 font-mono font-bold tracking-wider text-xl">{user.hubCode}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
                        {user?.fullName || 'Admin Dashboard'}
                    </h1>
                    <p className="text-gray-400">Manage users and verifications</p>
                </div>

                {user?.hubCode && (
                    <Button onClick={() => setShowQrModal(true)} className="flex items-center gap-2">
                        <QrCode size={20} />
                        Show Hub QR
                    </Button>
                )}
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-6 rounded-2xl flex items-center gap-4">
                    <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-medium">Total Users</p>
                        <h2 className="text-3xl font-bold text-white">{users.filter(u => u.role !== 'admin').length}</h2>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-2xl flex items-center gap-4">
                    <div className="bg-amber-100 p-4 rounded-full text-amber-600">
                        <ClipboardCheck size={32} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-medium">Pending Verifications</p>
                        <h2 className="text-3xl font-bold text-white">{pendingTasks.length}</h2>
                    </div>
                </motion.div>
            </div>

            {/* Verification Queue */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-white">Verification Queue</h2>
                <div className="grid gap-4">
                    {pendingTasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-8 glass rounded-xl">No pending verifications</p>
                    ) : (
                        pendingTasks.map((req, index) => (
                            <motion.div
                                key={`${req.userId}-${req.taskId}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-4 rounded-xl flex items-center justify-between flex-wrap gap-4"
                            >
                                <div>
                                    <h4 className="font-bold text-white">{getTaskTitle(req.taskId)}</h4>
                                    <p className="text-sm text-gray-300">User: <span className="font-medium text-emerald-400">{req.userName}</span></p>
                                    <p className="text-xs text-gray-400">{new Date(req.timestamp).toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleVerify(req.userId, req.taskId, true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm">
                                        <Check size={16} /> Approve
                                    </Button>
                                    <Button onClick={() => handleVerify(req.userId, req.taskId, false)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm">
                                        <X size={16} /> Reject
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* Bulk Pickup Requests */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-white">Bulk Pickup Requests</h2>
                <div className="grid gap-4">
                    {user?.hubId && pickupRequests ? (
                        pickupRequests
                            .filter(req => req.hubId === user.hubId)
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                            .map((req, index) => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="glass p-6 rounded-xl"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{req.userName}</h4>
                                            <p className="text-xs text-gray-400">{new Date(req.timestamp).toLocaleString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                                req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {req.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Material:</span>
                                                <span className="text-white font-medium">{req.materialType}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Weight:</span>
                                                <span className="text-white font-medium">{req.weight} kg</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Preferred Date:</span>
                                                <span className="text-white font-medium">{new Date(req.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Contact:</span>
                                                <a href={`tel:${req.contact}`} className="text-emerald-400 font-medium hover:underline">{req.contact}</a>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-gray-400">Address:</span>
                                                <p className="text-white text-xs mt-1">{req.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {req.description && (
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
                                            <p className="text-gray-400 text-xs mb-1">Notes:</p>
                                            <p className="text-white text-sm">{req.description}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                    ) : (
                        <p className="text-gray-500 text-center py-8 glass rounded-xl">
                            {user?.hubId ? 'No pickup requests for your hub yet' : 'Hub information not available'}
                        </p>
                    )}
                </div>
            </section>

            {/* User Management */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-white">User Check-ins at This Hub</h2>
                <div className="glass rounded-2xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-4 font-semibold text-gray-300">Username</th>
                                <th className="p-4 font-semibold text-gray-300">Full Name</th>
                                <th className="p-4 font-semibold text-gray-300">Email</th>
                                <th className="p-4 font-semibold text-gray-300">Points Earned Here</th>
                                <th className="p-4 font-semibold text-gray-300">Check-ins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter(u => u.role !== 'admin').map((u) => {
                                const hubPoints = getHubSpecificPoints(u.id);
                                const checkIns = JSON.parse(localStorage.getItem(`checkins_${u.id}`) || '[]');
                                const hubCheckIns = checkIns.filter(ci => ci.hubId === user?.hubId);

                                return (
                                    <tr key={u.id} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="p-4">{u.username}</td>
                                        <td className="p-4">{u.fullName}</td>
                                        <td className="p-4">{u.email}</td>
                                        <td className="p-4 font-medium text-emerald-400">{hubPoints}</td>
                                        <td className="p-4 text-gray-300">{hubCheckIns.length}</td>
                                    </tr>
                                );
                            })}
                            {users.filter(u => u.role !== 'admin').length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">No registered users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
