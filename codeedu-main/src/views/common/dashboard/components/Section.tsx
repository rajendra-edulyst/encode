import { ReactNode } from "react";

interface SectionProps {
    title: string;
    action?: string;
    children: ReactNode;
}

const Section = ({ title, action, children }: SectionProps) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="font-semibold">{title}</h2>
            {action && (
                <button className="px-4 py-2 text-sm rounded-lg border border-white/10 bg-black/40">
                    {action}
                </button>
            )}
        </div>
        {children}
    </div>
);

export default Section;
