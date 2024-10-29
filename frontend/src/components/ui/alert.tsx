import React, { ReactNode } from 'react';

interface AlertProps {
    children: ReactNode;
    className?: string;  // Allow className prop
    variant?: string;    // Optional variant prop if needed
}

export const Alert: React.FC<AlertProps> = ({ children, className = "", variant = "default", ...props }) => (
    <div className={`alert ${className} ${variant}`} {...props}>
        {children}
    </div>
);

export const AlertTitle: React.FC<AlertProps> = ({ children, className = "", ...props }) => (
    <div className={`alert-title ${className}`} {...props}>
        {children}
    </div>
);

export const AlertDescription: React.FC<AlertProps> = ({ children, className = "", ...props }) => (
    <div className={`alert-description ${className}`} {...props}>
        {children}
    </div>
);