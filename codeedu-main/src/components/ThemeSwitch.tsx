import React from 'react';
import '@/assets/css/ThemeSwitch.css';
import { useThemeStore } from '@/store/themeStore';

export const ThemeSwitch: React.FC = () => {

    const { setMode, mode } = useThemeStore((state) => state)

    return (
        <label className="theme-switch">
            <input
                type="checkbox"
                className="theme-switch__checkbox"
                checked={mode === 'dark'}
                onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            />
            <div className="theme-switch__container">
                <div className="theme-switch__clouds"></div>
                <div className="theme-switch__stars-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M135.831 3.00688C135.055 3.85027 ... 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </div>
                <div className="theme-switch__circle-container">
                    <div className="theme-switch__sun-moon-container">
                        <div className="theme-switch__moon">
                            <div className="theme-switch__spot"></div>
                            <div className="theme-switch__spot"></div>
                            <div className="theme-switch__spot"></div>
                        </div>
                    </div>
                </div>
            </div>
        </label>
    );
};

export default ThemeSwitch;