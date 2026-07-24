import React from "react";
import { EulaContent } from "./content";

const Eula: React.FC = () => {
    return (
        <div className="relative flex flex-col h-full border border-gray-800 rounded-lg shadow-lg bg-[#1D1D1D] p-12">
            <div className="max-h-[60vh] overflow-y-auto">
                <EulaContent />
            </div>
        </div>
    );
};

export default Eula;