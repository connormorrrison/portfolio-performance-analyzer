import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
    <input {...props} className={`input ${className}`} />
);

export default Input;