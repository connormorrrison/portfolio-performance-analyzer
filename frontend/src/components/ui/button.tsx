import React, { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: string;
    size?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, variant, size }) => (
    <button onClick={onClick} className={className}>
        {children}
    </button>
);

export default Button;