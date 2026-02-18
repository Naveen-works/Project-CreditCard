// import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: "bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50",
    secondary: "bg-surface border border-white/10 text-white hover:bg-white/5",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
};

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    disabled,
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Glow effect for primary variant */}
            {variant === 'primary' && (
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-primary to-neon-purple opacity-0 hover:opacity-100 blur-xl transition-opacity duration-300" />
            )}
        </motion.button>
    );
};

import PropTypes from 'prop-types';

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default Button;
