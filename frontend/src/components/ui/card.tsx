import React, { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;  // Allow className prop
}

export const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => (
    <div className={`card ${className}`} {...props}>
        {children}
    </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = "", ...props }) => (
    <div className={`card-header ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className = "", ...props }) => (
    <h2 className={`card-title ${className}`} {...props}>
        {children}
    </h2>
);

export const CardContent: React.FC<CardProps> = ({ children, className = "", ...props }) => (
    <div className={`card-content ${className}`} {...props}>
        {children}
    </div>
);