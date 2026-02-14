import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'bg-d-green text-white hover:bg-emerald-600 shadow-lg shadow-d-green/30',
        secondary: 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200',
        outline: 'border-2 border-d-green text-d-green hover:bg-d-green/10',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
