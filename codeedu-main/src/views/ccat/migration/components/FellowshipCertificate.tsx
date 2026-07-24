import iconCompass from '@assets/images/explore.png';
import download from '@assets/images/upgrade.png';
import receipt from '@assets/images/receipt_long.png';
import { Link } from "react-router-dom";


export const FellowshipCertificate = ({ progress, upgradedPackage, percent }: any) => {

    return (
        <div className="flex gap-4 w-full min-h-[200px]">
            {/* Navigator */}
            <div className="relative min-w-[260px] h-auto bg-[#1D1D1D] rounded-[20px] p-4 flex flex-col justify-center overflow-hidden min-h-[120px]">
                <Link to="/getting-started/preferences?type=edit&profile=upgrade" className="flex justify-start items-center absolute top-0 left-0 bg-[#5A5A5A] rounded-br-[10px] px-3 py-1 z-10">
                    <img src={download} alt="download" className="w-auto h-4 mr-1" />
                    <span className="text-[14px] font-normal px-2 py-1 rounded-md text-white">
                        Upgrade
                    </span>
                </Link>

                <div className="flex flex-col items-center">
                    {upgradedPackage?.icon && (
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3">
                            <img src={upgradedPackage.icon} alt={upgradedPackage?.name} className="w-full h-full object-contain" />
                        </div>
                    )}

                    <h3 className="text-white text-[26px] font-bold text-center leading-tight">
                        {upgradedPackage?.name || "Open for All"}
                    </h3>
                </div>
            </div>

            {/* Fellowship Certificate */}
            <div className="w-full min-w-[590px] p-5 pt-4 h-auto relative bg-[#1D1D1D] rounded-[20px] overflow-hidden min-h-[120px]">
                <h3 className="text-white text-[16px] font-bold h-1/5 mb-2">
                    Your Fellowship Certificate
                </h3>

                <div className="relative z-10 flex flex-col justify-end rounded-[10px] overflow-hidden h-4/5">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    >
                        <source src="/video/rainbow.mp4" type="video/mp4" />
                    </video>
                    <div className="relative z-10 bottom-0">
                        <p className="text-right text-sm font-normal text-white mt-1 mr-4">
                            {progress}% Completed
                        </p>
                        <div className="w-full h-3 bg-[#666] overflow-hidden">
                            <div
                                className="h-full rounded-r-full"
                                style={{
                                    width: `${progress}%`,
                                    background:
                                        'linear-gradient(90deg,#00D1FF,#D7FF00)'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Completion */}
            <div className="col-span-3 flex items-center w-full gap-4">
                <div className="h-full bg-[#1D1D1D] w-1/2 rounded-[20px] p-4 flex flex-col items-center justify-center gap-4">
                    <CircularProgress percentage={percent} />

                    <p className="text-[#7FBC42] text-center text-[16px] font-bold">
                        Complete my
                        <br />
                        Profile.
                    </p>
                </div>

                {/* Learning History */}
                <Link to="/purchase-history" className="h-full bg-[#1D1D1D] w-1/2 rounded-[20px] p-4 flex flex-col items-center justify-center gap-4">
                    <div className="relative w-10 h-auto mb-3">
                        <img src={receipt} alt="receipt" className="w-full h-full object-contain" />
                    </div>

                    <p className="text-white text-center text-[16px] font-bold">
                        Learning
                        <br />
                        History
                    </p>
                </Link>
            </div>
        </div>
    )
}


const CircularProgress = ({ percentage = 15 }) => {
    const radius = 32;
    const stroke = 10;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset =
        circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-30 h-30">
            <svg
                width="106"
                height="106"
                viewBox="0 0 106 106"
                className="-rotate-90"
            >
                {/* Background Ring */}
                <circle
                    cx="53"
                    cy="53"
                    r={normalizedRadius}
                    fill="transparent"
                    stroke="#5A5A5A"
                    strokeWidth={stroke}
                />

                {/* Progress Ring */}
                <circle
                    cx="53"
                    cy="53"
                    r={normalizedRadius}
                    fill="transparent"
                    stroke="#7FBC42"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-white text-[14px] font-normal">
                {percentage}%
            </div>
        </div>
    );
};