import { useNavigate } from "react-router-dom"
import boy from "@/assets/images/boy8.png"

const Start = () => {

    const navigate = useNavigate();

    const creatorProfile = () => {
        sessionStorage.setItem('profileType', 'creator');
        navigate('/sign-up' + window.location.search);
    }

    const organizationProfile = () => {
        sessionStorage.setItem('profileType', 'organization');
        navigate('/sign-up' + window.location.search);
    }

    return (
        <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-[90px] py-6 lg:py-8 xl:py-10 2xl:py-12 bg-[#1D1D1D] max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto rounded-[20px]">
            <div className="w-full">
                {/* Header */}
                <div className="text-center mb-6 lg:mb-8 2xl:mb-10">
                    <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-[32px] 2xl:text-[40px] font-bold text-white leading-tight whitespace-nowrap">
                        Start by Defining Your <span className="font-creative text-codeblue">Space</span>
                    </h1>
                </div>

                <div className="flex gap-4 lg:gap-8 justify-around lg:justify-between items-center">
                    <div className="hidden sm:block w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 2xl:w-[318px]">
                        <img src={boy} alt="Robotic boy" className="w-full object-contain scale-x-[-1]" />
                    </div>
                    {/* Cards Container */}
                    <div className="space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8 2xl:space-y-10 flex-1 max-w-[280px] sm:max-w-[300px] lg:max-w-[320px] 2xl:max-w-[340px]">
                        {/* Creator Card */}
                        <div className="bg-[#ec008c] rounded-2xl p-4 md:p-5 lg:p-6 text-center cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                            onClick={creatorProfile}
                        >
                            {/* Icon */}
                            <div className="flex justify-center mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="50"
                                    height="50"
                                    viewBox="0 0 26 26"
                                    fill="none"
                                >
                                    <path
                                        d="M12.7778 25.5556C11.0315 25.5556 9.38102 25.2201 7.82639 24.5493C6.27176 23.8785 4.91412 22.9627 3.75347 21.8021C2.59282 20.6414 1.67708 19.2838 1.00625 17.7292C0.335417 16.1745 0 14.5241 0 12.7778C0 11.0102 0.346065 9.34907 1.03819 7.79444C1.73032 6.23981 2.66736 4.8875 3.84931 3.7375C5.03125 2.5875 6.41019 1.67708 7.98611 1.00625C9.56204 0.335417 11.2444 0 13.0333 0C14.737 0 16.3449 0.292824 17.8569 0.878472C19.369 1.46412 20.6947 2.27338 21.834 3.30625C22.9734 4.33912 23.8785 5.56366 24.5493 6.97986C25.2201 8.39606 25.5556 9.92407 25.5556 11.5639C25.5556 14.013 24.8102 15.8924 23.3194 17.2021C21.8287 18.5118 20.0185 19.1667 17.8889 19.1667H15.525C15.3333 19.1667 15.2002 19.2199 15.1257 19.3264C15.0512 19.4329 15.0139 19.55 15.0139 19.6778C15.0139 19.9333 15.1736 20.3007 15.4931 20.7799C15.8125 21.259 15.9722 21.8074 15.9722 22.425C15.9722 23.4898 15.6794 24.2778 15.0938 24.7889C14.5081 25.3 13.7361 25.5556 12.7778 25.5556ZM5.75 14.0556C6.3037 14.0556 6.76157 13.8745 7.12361 13.5125C7.48565 13.1505 7.66667 12.6926 7.66667 12.1389C7.66667 11.5852 7.48565 11.1273 7.12361 10.7653C6.76157 10.4032 6.3037 10.2222 5.75 10.2222C5.1963 10.2222 4.73843 10.4032 4.37639 10.7653C4.01435 11.1273 3.83333 11.5852 3.83333 12.1389C3.83333 12.6926 4.01435 13.1505 4.37639 13.5125C4.73843 13.8745 5.1963 14.0556 5.75 14.0556ZM9.58333 8.94444C10.137 8.94444 10.5949 8.76343 10.9569 8.40139C11.319 8.03935 11.5 7.58148 11.5 7.02778C11.5 6.47407 11.319 6.0162 10.9569 5.65417C10.5949 5.29213 10.137 5.11111 9.58333 5.11111C9.02963 5.11111 8.57176 5.29213 8.20972 5.65417C7.84769 6.0162 7.66667 6.47407 7.66667 7.02778C7.66667 7.58148 7.84769 8.03935 8.20972 8.40139C8.57176 8.76343 9.02963 8.94444 9.58333 8.94444ZM15.9722 8.94444C16.5259 8.94444 16.9838 8.76343 17.3458 8.40139C17.7079 8.03935 17.8889 7.58148 17.8889 7.02778C17.8889 6.47407 17.7079 6.0162 17.3458 5.65417C16.9838 5.29213 16.5259 5.11111 15.9722 5.11111C15.4185 5.11111 14.9606 5.29213 14.5986 5.65417C14.2366 6.0162 14.0556 6.47407 14.0556 7.02778C14.0556 7.58148 14.2366 8.03935 14.5986 8.40139C14.9606 8.76343 15.4185 8.94444 15.9722 8.94444ZM19.8056 14.0556C20.3593 14.0556 20.8171 13.8745 21.1792 13.5125C21.5412 13.1505 21.7222 12.6926 21.7222 12.1389C21.7222 11.5852 21.5412 11.1273 21.1792 10.7653C20.8171 10.4032 20.3593 10.2222 19.8056 10.2222C19.2519 10.2222 18.794 10.4032 18.4319 10.7653C18.0699 11.1273 17.8889 11.5852 17.8889 12.1389C17.8889 12.6926 18.0699 13.1505 18.4319 13.5125C18.794 13.8745 19.2519 14.0556 19.8056 14.0556Z"
                                        fill="#1C1B1F"
                                    />
                                </svg>
                            </div>

                            {/* Title */}
                            <h2 className="text-lg md:text-xl font-bold text-black mb-1 lg:mb-2">
                                Creator
                            </h2>

                            {/* Description */}
                            <p className="text-sm font-normal text-black/90">
                                A solo spark ready to ignite big ideas.
                            </p>
                        </div>

                        {/* Creative Organization Card */}
                        <div className="bg-codegreen rounded-2xl p-4 md:p-5 lg:p-6 text-center cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                            onClick={organizationProfile}
                        >
                            {/* Icon */}
                            <div className="flex justify-center mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="45"
                                    height="45"
                                    viewBox="0 0 45 45"
                                    fill="none"
                                >
                                    <g transform="scale(1.9)">
                                        <path
                                            d="M2.55556 23C1.85278 23 1.25116 22.7498 0.750695 22.2493C0.250232 21.7488 0 21.1472 0 20.4444V7.66667C0 6.96389 0.250232 6.36227 0.750695 5.86181C1.25116 5.36134 1.85278 5.11111 2.55556 5.11111H5.11111V2.55556C5.11111 1.85278 5.36134 1.25116 5.86181 0.750695C6.36227 0.250232 6.96389 0 7.66667 0H15.3333C16.0361 0 16.6377 0.250232 17.1382 0.750695C17.6387 1.25116 17.8889 1.85278 17.8889 2.55556V10.2222H20.4444C21.1472 10.2222 21.7488 10.4725 22.2493 10.9729C22.7498 11.4734 23 12.075 23 12.7778V20.4444C23 21.1472 22.7498 21.7488 22.2493 22.2493C21.7488 22.7498 21.1472 23 20.4444 23H12.7778V17.8889H10.2222V23H2.55556ZM2.55556 20.4444H5.11111V17.8889H2.55556V20.4444ZM2.55556 15.3333H5.11111V12.7778H2.55556V15.3333ZM2.55556 10.2222H5.11111V7.66667H2.55556V10.2222ZM7.66667 15.3333H10.2222V12.7778H7.66667V15.3333ZM7.66667 10.2222H10.2222V7.66667H7.66667V10.2222ZM7.66667 5.11111H10.2222V2.55556H7.66667V5.11111ZM12.7778 15.3333H15.3333V12.7778H12.7778V15.3333ZM12.7778 10.2222H15.3333V7.66667H12.7778V10.2222ZM12.7778 5.11111H15.3333V2.55556H12.7778V5.11111ZM17.8889 20.4444H20.4444V17.8889H17.8889V20.4444ZM17.8889 15.3333H20.4444V12.7778H17.8889V15.3333Z"
                                            fill="#000000"
                                        />
                                    </g>
                                </svg>
                            </div>

                            {/* Title */}
                            <h2 className="text-lg md:text-xl font-bold text-black mb-1 lg:mb-2">
                                Creative Organization
                            </h2>

                            {/* Description */}
                            <p className="text-sm font-normal text-black/90">
                                Experienced minds united to design the future.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Start