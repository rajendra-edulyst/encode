import React, { useState } from 'react';

type DescriptionWithClampProps = {
    text: string;
    className?: string;
};

const DescriptionWithClamp = ({ text, className = '' }: DescriptionWithClampProps) => {
    const [expanded, setExpanded] = useState(false);
    
    const charLimit = 80;
    const shouldClamp = text.length > charLimit;
    return (
        <div className={className + ' relative'}>
            {!expanded ? (
                <div className={shouldClamp ? 'line-clamp-1 text-gray-800' : 'text-gray-800'} style={{ fontSize: '1rem' }}>
                    {text}
                    {shouldClamp && (
                        <span
                            className="absolute bottom-0 right-0 bg-white text-gray-500 text-sm pl-1 cursor-pointer hover:underline"
                            onClick={() => setExpanded(true)}
                        >
                            See more
                        </span>
                    )}
                </div>
            ) : (
                <div className="text-gray-800" style={{ fontSize: '1rem' }}>
                    <p>{text}</p>
                    <button
                        className="text-gray-600 hover:underline text-sm mt-2"
                        onClick={() => setExpanded(false)}
                    >
                        See less
                    </button>
                </div>
            )}
        </div>
    );
};

export default DescriptionWithClamp;