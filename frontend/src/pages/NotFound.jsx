import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';

const NotFound = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h1 className="text-9xl font-bold text-primary/20">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">The page you are looking for does not exist or has been moved.</p>
                <Link to="/">
                    <Button>Return Home</Button>
                </Link>
            </div>
        </Layout>
    );
};

export default NotFound;
