import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react';
import React from 'react'


interface CodeButtonProps {
    className?: string;
    img?: string;
    icon?: React.ReactNode;
    name: string;
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

const CodeButton = ({ className, img, icon, name, onClick, isLoading, disabled }: CodeButtonProps) => {

    return (
        <button
            className={cn("rounded-xl h-[85px] flex flex-col items-center justify-center min-w-[80px] bg-primary text-black px-3 py-3 shadow-sm", "hover:opacity-90 transition-opacity", className)}
            aria-label={name}
            disabled={isLoading || disabled}
            onClick={onClick}
        >
            {img && <img src={img} alt={name} className="w-5 h-5 object-contain" />}
            {(icon && !isLoading) && icon}
            {isLoading && <Loader className="w-5 h-5 text-black animate-spin" />}
            <span className="text-sm dark:text-black text-muted-foreground">{name}</span>
        </button>
    )
}

export default CodeButton