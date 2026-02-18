import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = ({ children, className, hover = false, ...props }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -5 } : {}}
            className={cn(
                "glass-card p-6 relative overflow-hidden",
                hover && "hover:shadow-neon-blue/20 hover:border-neon-blue/30 transition-all duration-300",
                className
            )}
            {...props}
        >
            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-blue/20 rounded-full blur-3xl" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default Card;
