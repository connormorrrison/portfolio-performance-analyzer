import React from "react";

const Button = ({ children, onClick, className}) => (
    <button onClick={onClick} className={`button ${className}`}>
        {children}
    </button>
);

export default Button;