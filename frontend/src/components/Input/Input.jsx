import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const Input = forwardRef(({ label, error, className, id, ...props }, ref) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-gray-400 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        "w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300",
                        error && "border-red-500/50 focus:ring-red-500/20 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
                {/* Glow effect on focus */}
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-primary to-neon-purple opacity-0 group-focus-within:opacity-20 blur-lg transition-opacity duration-300" />
            </div>
            {error && (
                <p className="text-xs text-red-500 ml-1 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

Input.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string.isRequired
};

export default Input;
