import React from 'react'
import { ButtonProps } from './types'

const Button: React.FC<ButtonProps> = ({ 
    text, 
    onClick, 
    icon, 
    variant = 'primary',
    className = '' 
}) => {
    const baseStyles = 'inline-flex flex-col items-center justify-center font-bold rounded-xl transition-all duration-300 ease-in-out px-8 py-4 gap-1 shadow-md'
    
    // According to the UI, the primary button is yellow with black text
    const variants = {
        primary: 'bg-[#FFDE00] text-black hover:bg-[#E6C800]',
        secondary: 'bg-transparent border border-white text-white hover:bg-white/10'
    }

    return (
        <button 
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {icon && <span>{icon}</span>}
            <span>{text}</span>
        </button>
    )
}

export default Button
