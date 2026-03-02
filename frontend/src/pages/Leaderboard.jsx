import { motion } from 'framer-motion';
import { Trophy, Medal, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users from localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

        // Sort users by points (descending)
        const sortedUsers = storedUsers
            .filter(u => u.role !== 'admin') // Exclude admins from leaderboard
            .sort((a, b) => (b.points || 0) - (a.points || 0));

        setUsers(sortedUsers);
    }, []);

    const getRankIcon = (index) => {
        switch (index) {
            case 0:
                return <Trophy className="text-yellow-400" size={24} />;
            case 1:
                return <Medal className="text-gray-300" size={24} />;
            case 2:
                return <Medal className="text-amber-600" size={24} />;
            default:
                return <span className="text-gray-500 font-bold w-6 text-center">{index + 1}</span>;
        }
    };

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
                    Leaderboard
                </h1>
                <p className="text-gray-600">Top contributors making a difference</p>
            </header>

            <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 font-medium">Rank</th>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium text-right">Points</th>
                                <th className="px-6 py-4 font-medium text-right">Tasks Completed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <motion.tr
                                        key={user.id || user.username}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5">
                                                {getRankIcon(index)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-d-green/20 flex items-center justify-center text-d-green">
                                                    <User size={16} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.fullName || user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                                                {user.points || 0} pts
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-400">
                                            {/* Note: In a real app we'd count actual approved tasks. 
                                                Here we might not have easy access to all tasks for all users without iterating everything.
                                                For MVP, we'll skip or just show a placeholder if not available in user object. 
                                                Let's assume we can rely on user points for now. */}
                                            -
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No active users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
