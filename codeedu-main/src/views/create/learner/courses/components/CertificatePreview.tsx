import React from 'react';

interface CertificatePreviewProps {
    userName: string;
    courseName: string;
    organizationName: string;
    organizationLogo: string;
    skills: string[] | undefined;
    certificateId?: string;
    completionDate?: string;
    courseLeader?: string;
    academicHead?: string;
    isBlurred?: boolean;
    pdfUrl?: string;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
    userName,
    courseName,
    organizationName,
    organizationLogo,
    skills,
    certificateId,
    completionDate,
    courseLeader,
    academicHead,
    isBlurred = false,
    pdfUrl,
}) => {
    // If PDF URL is available, show the actual certificate in iframe
    if (pdfUrl && !isBlurred) {
        return (
            <div className="relative w-full">
                <div className="w-full bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-codeblue">
                    <iframe
                        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full"
                        style={{
                            aspectRatio: '794/1123',
                            minHeight: '600px',
                            border: 'none',
                        }}
                        title="Certificate PDF"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`relative w-full ${isBlurred ? 'filter blur-sm' : ''}`}>
            <div
                className="certificate-wrapper w-full bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
                style={{
                    backgroundImage: "url('/certificate/certi01.png')",
                    aspectRatio: '794/1123',
                    maxHeight: '600px',
                }}
            >
                {/* Logo */}
                <img
                    className="absolute top-10 right-[30%] w-24 md:w-32"
                    src={organizationLogo || '/certificate/codelogo.png'}
                    alt="Organization Logo"
                />

                <div className="flex h-full">
                    {/* Sidebar - Empty for design */}
                    <div className="w-[22%]"></div>

                    {/* Content */}
                    <div className="w-[78%] px-6 py-16 flex flex-col items-center text-white">
                        <div className="text-center space-y-2 mt-16">
                            <p className="text-lg md:text-xl font-serif">acknowledging</p>
                            <h1 className="text-2xl md:text-4xl font-bold tracking-wide">{userName}</h1>
                            <p className="text-sm md:text-base font-serif">
                                for completing
                            </p>
                            <h2 className="text-xl md:text-3xl font-creative text-[#00a8e9] my-4">
                                &quot;{courseName}&quot;
                            </h2>
                            <p className="text-sm md:text-base font-serif">crafting new perspectives in</p>
                        </div>

                        {/* Skills */}
                        {skills && skills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center mt-6 mb-4">
                                {skills?.slice(0, 5).map((skill, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-400 rounded-lg px-3 py-1.5 text-xs md:text-sm bg-transparent"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Certificate Info */}
                        <div className="text-center text-xs md:text-sm font-serif mt-4 space-y-1">
                            <p>with</p>
                            {certificateId && <p>certification ID {certificateId},</p>}
                            {completionDate && <p>on {completionDate}</p>}
                            <p>hosted by</p>
                        </div>

                        {/* Organization */}
                        <div className="flex items-center gap-3 mt-3">
                            <h3 className="text-xl md:text-2xl font-bold">{organizationName}</h3>
                            <img
                                className="w-16 md:w-20 h-auto"
                                src={organizationLogo || '/certificate/ixdflogo.png'}
                                alt="Organization Seal"
                            />
                        </div>

                        {/* Signatures */}
                        <div className="flex justify-between w-full px-4 mt-auto pt-8">
                            {courseLeader && (
                                <div className="text-center">
                                    <p className="font-bold text-sm md:text-base">{courseLeader}</p>
                                    <p className="text-xs md:text-sm font-serif mt-1">Course Instructor</p>
                                </div>
                            )}
                            {academicHead && (
                                <div className="text-center">
                                    <p className="font-bold text-sm md:text-base">{academicHead}</p>
                                    <p className="text-xs md:text-sm font-serif mt-1">Academic Head</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificatePreview;
