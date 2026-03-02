import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OurVision from './pages/OurVision';
import DisposalHub from './pages/DisposalHub';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import Leaderboard from './pages/Leaderboard';
import Wallet from './pages/Wallet';
import BulkRecycle from './pages/BulkRecycle';

const PrivateRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;

    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/vision" element={<OurVision />} />
            <Route path="/hubs" element={<Layout><DisposalHub /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/dashboard" element={
                <PrivateRoute role="user">
                    <DashboardLayout><UserDashboard /></DashboardLayout>
                </PrivateRoute>
            } />

            <Route path="/leaderboard" element={
                <PrivateRoute role="user">
                    <DashboardLayout><Leaderboard /></DashboardLayout>
                </PrivateRoute>
            } />

            <Route path="/dashboard/wallet" element={
                <PrivateRoute role="user">
                    <DashboardLayout><Wallet /></DashboardLayout>
                </PrivateRoute>
            } />

            <Route path="/dashboard/hubs" element={
                <PrivateRoute role="user">
                    <DashboardLayout><DisposalHub /></DashboardLayout>
                </PrivateRoute>
            } />

            <Route path="/dashboard/contact" element={
                <PrivateRoute role="user">
                    <DashboardLayout><Contact /></DashboardLayout>
                </PrivateRoute>
            } />

            <Route path="/dashboard/bulk-recycle" element={
                <PrivateRoute role="user">
                    <DashboardLayout><BulkRecycle /></DashboardLayout>
                </PrivateRoute>
            } />

            <Route path="/admin" element={
                <PrivateRoute role="admin">
                    <Layout><AdminDashboard /></Layout>
                </PrivateRoute>
            } />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
