import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/ShadcnButton';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginPromptProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ open, onOpenChange }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-[#1D1D1D] text-white border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-jacques mb-2">Keep reading for free</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Create a free account to discover more inspiring content, interact with authors, and save your favorites.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <Button
                        className="w-full bg-codeblue hover:bg-codeblue/80 text-white rounded-lg h-12"
                        onClick={() => navigate(`/sign-in?redirectUrl=${encodeURIComponent(location.pathname + location.search)}`)}
                    >
                        Sign up / Log in
                    </Button>
                </div>

                <DialogFooter className="sm:justify-center mt-2">
                    <p className="text-xs text-gray-500 text-center">
                        By continuing, you agree to EnCode's Terms of Service and Privacy Policy.
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LoginPrompt;
