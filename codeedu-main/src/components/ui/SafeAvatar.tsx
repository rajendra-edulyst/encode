/**
 * Safe Avatar Component with automatic fallback
 * Prevents empty string src attribute warnings
 */

import React from 'react';

interface SafeAvatarProps {
    src?: string | null;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
};

/**
 * SafeAvatar component that prevents empty src warnings
 * Shows initials as fallback when image URL is null/undefined
 * 
 * @example
 * // Basic usage
 * <SafeAvatar src={user.profile_image} alt={user.name} />
 * 
 * @example
 * // With size and custom class
 * <SafeAvatar 
 *   src={user.profile_image} 
 *   alt={user.name} 
 *   size="lg"
 *   className="border-2 border-blue-500"
 * />
 */
export const SafeAvatar: React.FC<SafeAvatarProps> = ({ 
    src, 
    alt, 
    size = 'md',
    className = '' 
}) => {
    const sizeClass = sizeClasses[size];
    const initial = alt?.charAt(0)?.toUpperCase() || 'U';

    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={`${sizeClass} rounded-full object-cover ${className}`}
                onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                }}
            />
        );
    }

    return (
        <div 
            className={`${sizeClass} rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center ${className}`}
        >
            <span className="font-bold text-gray-600 dark:text-gray-300">
                {initial}
            </span>
        </div>
    );
};

export default SafeAvatar;
