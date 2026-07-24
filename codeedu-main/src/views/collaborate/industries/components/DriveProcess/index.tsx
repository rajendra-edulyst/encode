import React from 'react';
import DocumentUpload from './DocumentUpload';
import RecommendedJobs from './RecommendedJobs';

const DriveProcess = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#1A1A1A] p-6 rounded-3xl">
            <div className="lg:col-span-4">
                <DocumentUpload />
            </div>
            <div className="lg:col-span-8">
                <RecommendedJobs />
            </div>
        </div>
    );
};

export default DriveProcess;
