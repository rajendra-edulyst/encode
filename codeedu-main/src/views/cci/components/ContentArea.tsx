import { useNavigate } from "react-router-dom";
import { FunctionComponent, useState, useEffect } from "react";
import StageAcknowledgementModal from "./StageAcknowledgementModal";
import { useUserProfile, useCCIStage1Status, useCCIStage3Status, useCCIStage2Status } from "@/hooks/data/useGettingStarted";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useCCITimer } from "@/context/CCIContext";

dayjs.extend(duration);

export type ContentAreaType = {
  className?: string;
};

const CircularProgress = ({
  percentage,
  color,
  size = 60,
  strokeWidth = 5
}: {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        {percentage > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        )}
      </svg>
      <span className="absolute text-[14px] font-bold text-white">
        {percentage}%
      </span>
    </div>
  );
};

const ContentArea: FunctionComponent<ContentAreaType> = ({ className = "" }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStage2ModalOpen, setIsStage2ModalOpen] = useState(false);
  const [isStage3ModalOpen, setIsStage3ModalOpen] = useState(false);
  const { data: userProfile } = useUserProfile();
  const { timeLeft } = useCCITimer();
  const { data: stage1Status } = useCCIStage1Status();
  const { data: stage2Status } = useCCIStage2Status();
  const { data: stage3Status } = useCCIStage3Status();

  const isStage1Completed = stage1Status?.data?.final === 1;
  const isStage2Completed = stage2Status?.data?.final === 1;
  const isStage3Completed = stage3Status?.data?.final === 1;

  // Stage 02 partial progress: each of course/community/buzz counts as 1/3
  const stage2Keys = ['course', 'community', 'buzz'] as const;
  const stage2CompletedCount = stage2Keys.filter(k => stage2Status?.data?.[k] === 1).length;
  const stage2PercentNum = stage2CompletedCount === 0 ? 0 : stage2CompletedCount === 3 ? 100 : Math.round((stage2CompletedCount / 3) * 100);
  const stage2Percent = `${stage2PercentNum}%`;

  // Stage 03 partial progress: each of video/graphics/Written counts as 1/3
  const stage3Keys = ['video', 'graphics', 'Written'] as const;
  const stage3CompletedCount = stage3Keys.filter(k => stage3Status?.data?.[k] === 1).length;
  const stage3PercentNum = stage3CompletedCount === 0 ? 0 : stage3CompletedCount === 3 ? 100 : Math.round((stage3CompletedCount / 3) * 100);
  const stage3Percent = `${stage3PercentNum}%`;

  // const isStage4Completed = Number(userProfile?.cci_stage_4) === 1;
  const isStage4Completed = (userProfile?.cci_stage_4) === 1;

  // alert(isStage4Completed)

  // Attempts Left: 3/3 if all 3 stages done, 1/3 if stage1 (±stage2) done, 2/3 default
  const attemptsLeft =
    isStage1Completed && isStage2Completed && isStage3Completed && isStage4Completed
      ? '1/3'
      : '0/3';

  const cciStartDate = userProfile?.cci_start_date;

  // Check if the scheduled exam date is still in the future (date-only comparison)
  const isScheduledInFuture = cciStartDate
    ? dayjs(cciStartDate).startOf('day').isAfter(dayjs().startOf('day'))
    : false;

  const isTimeOver = !!cciStartDate && !isScheduledInFuture && timeLeft === "00:00:00";

  const handleStartNow = () => {
    setIsModalOpen(true);
  };

  const handleStage2StartNow = () => {
    setIsStage2ModalOpen(true);
  };

  const handleStage3StartNow = () => {
    setIsStage3ModalOpen(true);
  };

  return (
    <div className={`w-full flex flex-col gap-12 font-jacques-pro relative ${className}`}>

      {/* Blur wrapper — blurred + non-interactive when exam date is in the future or over */}
      <div className={(isScheduledInFuture || isTimeOver) ? 'blur-sm pointer-events-none select-none' : ''}>

        {/* Top Banner Block */}
        <div
          className="w-full relative rounded-2xl py-10 px-8 md:px-12 border border-[#2a2a2a] shadow-2xl overflow-hidden mt-6"
          style={{
            backgroundImage: "url('/cci/content-area-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="flex justify-between items-start flex-wrap gap-8 relative z-10 w-full mb-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <h1 className="text-[48px] font-bold m-0 text-white tracking-wide font-jacques-pro leading-normal">Hey, <span className="text-[#FFEC00] font-normal" style={{ fontFamily: "'Creative Ligatures', sans-serif" }}>{userProfile?.platform_name || userProfile?.name || 'User'}</span></h1>
              </div>
              <h2 className="text-[26px] font-semibold text-white mt-1 m-0">
                Ready to put your creativity to the test?
              </h2>
              <div className="flex items-center gap-6 mt-4">
                <span className="text-white text-lg font-bold">Your CCIQ Exam Schedule</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium bg-[#808080] text-black px-4 py-1.5 rounded-md">
                    {cciStartDate ? dayjs(cciStartDate).format('DD MMM, YYYY') : 'N/A'}
                  </span>
                  <span className="hidden text-sm font-medium bg-[#808080] text-black px-4 py-1.5 rounded-md">
                    {cciStartDate ? dayjs(cciStartDate).format('hh:mm:ss A') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 pt-2">
              <span className="text-[17px] text-gray-300">Attempts Left: <span className="text-white">{attemptsLeft}</span></span>
              <span className="text-[24px] font-bold text-white">Creative Time Left: <span className="text-white">{timeLeft}</span></span>
              <button
                onClick={() => navigate('/exam-dashboard')}
                className="hidden mt-2 bg-[#fcee0a] hover:bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-bold text-[15px] transition-all hover:scale-105 shadow-lg uppercase tracking-wide cursor-pointer"
              >
                Check Result Now
              </button>
            </div>
          </div>

          {/* 4 Circular progress indicators */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-6 relative z-10 w-full">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-400">CCIQ Ignite</span>
                <span className="text-sm font-bold text-white">Cognitive Challenge</span>
              </div>
              <CircularProgress
                percentage={isStage1Completed ? 100 : 0}
                color="#fcee0a"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-400">CCIQ Engage</span>
                <span className="text-sm font-bold text-white">Ecosystem Simulation</span>
              </div>
              <CircularProgress
                percentage={stage2PercentNum}
                color="#fcee0a"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-400">CCIQ Present</span>
                <span className="text-sm font-bold text-white">Narrative Showcase</span>
              </div>
              <CircularProgress
                percentage={stage3PercentNum}
                color="#fcee0a"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-400">CCIQ Track</span>
                <span className="text-sm font-bold text-white">Growth Continuum</span>
              </div>
              <CircularProgress
                percentage={isStage4Completed ? 100 : 0}
                color="#fcee0a"
              />
            </div>
          </div>
        </div>

        {/* Performance Analysis Banner (Only displayed when all 4 stages are completed) */}
        {isStage1Completed && isStage2Completed && isStage3Completed && isStage4Completed && (
          <div
            className="w-full h-[220px] rounded-[32px] flex items-center justify-center text-white mt-4 shadow-2xl border border-[#222] overflow-hidden relative"
            style={{
              backgroundImage: "url('/cci/performance-banner-bg-ribbon-final.png')",
              backgroundSize: "cover",
              backgroundPosition: "left center",
            }}
          >
            <div className="flex flex-col gap-1 relative z-10 text-center">
              <h2 className="text-[34px] font-bold m-0 tracking-tight leading-tight font-jacques-pro">
                We’re Analyzing Your Performance
              </h2>
              <p className="text-[20px] text-gray-300 m-0 font-medium opacity-90">
                Your results are taking shape.
              </p>
            </div>

            <button
              onClick={() => navigate('/exam-dashboard')}
              className="absolute right-10 md:right-16 bg-[#fcee0a] hover:bg-yellow-400 text-black w-[150px] h-[110px] rounded-[24px] font-bold text-[16px] transition-all hover:scale-105 shadow-xl flex flex-col items-center justify-center cursor-pointer z-20 shrink-0"
            >
              <span className="absolute top-2 right-4 text-[26px] font-bold">↗</span>
              <span className="mt-4 leading-tight text-center">
                Check<br />Result Now
              </span>
            </button>
          </div>
        )}

        {/* 3 Main Cards (Restored Image Backgrounds) */}
        <section className="self-stretch flex flex-wrap lg:flex-nowrap items-stretch gap-[41.5px] max-w-full pt-10 mt-6 z-20 relative font-jacques-pro">

          {/* Card 1 */}
          <div className="flex-1 flex flex-col pt-[8px] px-[22px] pb-[24px] box-border relative isolate min-h-[350px] min-w-[307px] max-w-full">
            <img
              className="w-full h-full absolute !!m-[0 important] top-[0px] right-[0px] bottom-[0px] left-[0px] max-w-full overflow-hidden max-h-full object-[100%_100%] rounded-2xl z-[-1]"
              alt=""
              src="/cci/Group2@2x_v2.png"
            />
            <div className="absolute inset-0 opacity-40 rounded-2xl z-[-1]" />
            {/* Tab Area Overlay */}
            <div className="w-full h-[60px] flex justify-center items-start pt-[2px] text-white">
              <div className="flex flex-col items-center">
                <span className="text-[12px] font-normal leading-none font-jacques-pro">Stage</span>
                <span className="text-[20px] font-bold leading-none mt-1">01</span>
              </div>
            </div>
            {/* Card Content Overlay */}
            <div className="px-2 mt-[2px] w-full flex flex-col flex-1 h-full pb-4">
              <h3 className="text-[20px] font-bold text-center text-white leading-tight m-0">
                CCIQ Ignite:<br />Cognitive Challenge
              </h3>
              <p className="text-[13px] text-gray-300 mt-[26px] mb-[26px] leading-relaxed flex-1 text-left min-h-[60px]">
                To evaluate core thinking ability, conceptual clarity, and creative reasoning across domains.
              </p>
              <div className="flex items-center justify-between w-full mt-auto relative z-10 bottom-2">
                <div className="flex items-center gap-2 text-[14px] text-gray-300">
                  <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Duration: <strong className="text-white font-semibold">30 Mins</strong></span>
                </div>
              </div>
              {/* Absolute right Start Button */}
              {isStage1Completed ? (
                <div className="absolute right-[26px] bottom-[26px] z-10">
                  <img
                    src="/cci/stage-3/completed-badge-v6.png"
                    alt="Completed"
                    className="w-[100px] h-auto"
                  />
                </div>
              ) : (
                <button
                  onClick={handleStartNow}
                  className="absolute right-[22px] bottom-[22px] bg-[#fcee0a] text-black font-semibold flex flex-col items-center justify-center rounded-[12px] w-[80px] h-[80px] hover:bg-yellow-400 z-10 shadow-lg"
                >
                  <img src="/cci/arrow-start-now.png" alt="arrow" className="w-[18px] h-[18px]" />
                  <span className="text-[15px] leading-tight mt-1 font-medium">Start<br />Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex-1 flex flex-col pt-[8px] pl-[34px] pr-[30px] pb-[24px] box-border relative isolate min-h-[350px] min-w-[307px] max-w-full">
            <img
              className="w-full h-full absolute !!m-[0 important] top-[0px] right-[0px] bottom-[0px] left-[0px] max-w-full overflow-hidden max-h-full object-[100%_100%] rounded-2xl z-[-1]"
              alt=""
              src="/cci/Group1@2x_v2.png"
            />
            <div className="absolute inset-0 opacity-40 rounded-2xl z-[-1]" />
            {/* Tab Area Overlay */}
            <div className="w-full h-[60px] flex justify-center items-start pt-[2px] text-white">
              <div className="flex flex-col items-center">
                <span className="text-[12px] font-normal leading-none font-jacques-pro">Stage</span>
                <span className="text-[20px] font-bold leading-none mt-1">02</span>
              </div>
            </div>
            {/* Card Content Overlay */}
            <div className="px-2 mt-[2px] w-full flex flex-col flex-1 h-full pb-4">
              <h3 className="text-[20px] font-bold text-center text-white leading-tight m-0">
                CCIQ Engage:<br />Ecosystem Simulation
              </h3>
              <p className="text-[13px] text-gray-300 mt-[26px] mb-[26px] leading-relaxed flex-1 text-left min-h-[60px]">
                To evaluate real-world application, initiative, and community interaction within the enCODE ecosystem.
              </p>
              <div className="flex items-center justify-between w-full mt-auto relative z-10 bottom-2">
                <div className="flex items-center gap-2 text-[14px] text-gray-300">
                  <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Duration: <strong className="text-white font-semibold">24 Hours</strong></span>
                </div>
              </div>
              {/* Absolute right Start Button */}
              {isStage2Completed ? (
                <div className="absolute right-[22px] bottom-[26px] z-10">
                  <img
                    src="/cci/stage-3/completed-badge-v6.png"
                    alt="Completed"
                    className="w-[100px] h-auto"
                  />
                </div>
              ) : (
                <button
                  onClick={handleStage2StartNow}
                  className="absolute right-[22px] bottom-[22px] bg-[#fcee0a] text-black font-semibold flex flex-col items-center justify-center rounded-[12px] w-[80px] h-[80px] hover:bg-yellow-400 z-10 shadow-lg cursor-pointer"
                >
                  <img src="/cci/arrow-start-now.png" alt="arrow" className="w-[18px] h-[18px]" />
                  <span className="text-[15px] leading-tight mt-1 font-medium">Start<br />Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex-1 flex flex-col pt-[8px] pl-[34px] pr-[30px] pb-[24px] box-border relative isolate min-h-[350px] min-w-[307px] max-w-full">
            <img
              className="w-full h-full absolute !!m-[0 important] top-[0px] right-[0px] bottom-[0px] left-[0px] max-w-full overflow-hidden max-h-full object-[100%_100%] rounded-2xl z-[-1]"
              alt=""
              src="/cci/Group@2x_v2.png"
            />
            <div className="absolute inset-0 opacity-40 rounded-2xl z-[-1]" />
            {/* Tab Area Overlay */}
            <div className="w-full h-[60px] flex justify-center items-start pt-[2px] text-white">
              <div className="flex flex-col items-center">
                <span className="text-[12px] font-normal leading-none font-jacques-pro">Stage</span>
                <span className="text-[20px] font-bold leading-none mt-1">03</span>
              </div>
            </div>
            {/* Card Content Overlay */}
            <div className="px-2 mt-[2px] w-full flex flex-col flex-1 h-full pb-4">
              <h3 className="text-[20px] font-bold text-center text-white leading-tight m-0">
                CCIQ Present:<br />Narrative Showcase
              </h3>
              <p className="text-[13px] text-gray-300 mt-[26px] mb-[26px] leading-relaxed flex-1 text-left min-h-[60px]">
                To assess storytelling ability, communication strength, confidence, and personal branding.
              </p>
              <div className="flex items-center justify-between w-full mt-auto relative z-10 bottom-2">
                <div className="flex items-center gap-2 text-[14px] text-gray-300">
                  <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Duration: <strong className="text-white font-semibold">2 Hours</strong></span>
                </div>
              </div>
              {/* Absolute right Start Button */}
              {isStage3Completed ? (
                <div className="absolute right-[22px] bottom-[26px] z-10">
                  <img
                    src="/cci/stage-3/completed-badge-v6.png"
                    alt="Completed"
                    className="w-[100px] h-auto"
                  />
                </div>
              ) : (
                <button
                  onClick={handleStage3StartNow}
                  className="absolute right-[22px] bottom-[22px] bg-[#fcee0a] text-black font-semibold flex flex-col items-center justify-center rounded-[12px] w-[80px] h-[80px] hover:bg-yellow-400 z-10 shadow-lg"
                >
                  <img src="/cci/arrow-start-now.png" alt="arrow" className="w-[18px] h-[18px]" />
                  <span className="text-[15px] leading-tight mt-1 font-medium">Start<br />Now</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Stage 04 Wide Card */}
        <div className="flex flex-col md:flex-row relative mt-8 min-h-[120px] rounded-[16px] bg-[#242424] items-center ml-3 shadow-xl border border-[#2a2a2a]">
          {/* The left blue ribbon */}
          <div className="absolute left-[-12px] top-[10px] bottom-[10px] w-[130px] bg-[#00b0f0] rounded-r-[16px] flex flex-col items-center justify-center shadow-lg z-10 hidden md:flex">
            {/* Top fold */}
            <div className="absolute top-[-10px] left-0 w-0 h-0 border-b-[10px] border-b-[#0076a3] border-l-[12px] border-l-transparent"></div>
            {/* Bottom fold */}
            <div className="absolute bottom-[-10px] left-0 w-0 h-0 border-t-[10px] border-t-[#0076a3] border-l-[12px] border-l-transparent"></div>

            <div className="text-center text-white mt-1">
              <span className="text-[13px] block font-medium leading-none mb-1.5 tracking-wider font-jacques-pro">Stage</span>
              <span className="text-[32px] font-bold leading-none font-jacques-pro">04</span>
            </div>
          </div>
          {/* Mobile view ribbon */}
          <div className="md:hidden bg-[#00b0f0] w-full shrink-0 flex justify-center items-center text-center text-white py-4 relative z-10 rounded-t-[16px]">
            <div className="text-center text-white">
              <span className="text-[11px] block font-medium leading-none mb-1.5 tracking-wider font-jacques-pro">Stage</span>
              <span className="text-[28px] font-bold leading-none font-jacques-pro">04</span>
            </div>
          </div>

          <div className="flex-1 p-6 md:pl-[150px] md:pr-6 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-between z-10 w-full gap-6">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[20px] font-bold text-white tracking-wide font-jacques-pro m-0">CCIQ Track: Growth Continuum</h3>
              <p className="text-[13px] text-gray-300 m-0 font-jacques-pro">To evaluate core thinking ability, conceptual clarity, and creative reasoning across domains.</p>
            </div>
            {isStage4Completed ? (
              <div className="shrink-0 z-10 self-center">
                <img
                  src="/cci/stage-3/completed-badge-v6.png"
                  alt="Completed"
                  className="w-[100px] h-auto"
                />
              </div>
            ) : (
              <button
                onClick={() => navigate('/cci-stage-4')}
                className="bg-[#fcee0a] text-black shrink-0 font-semibold flex flex-col items-center justify-center rounded-[14px] w-[85px] h-[85px] transition hover:bg-yellow-400 cursor-pointer font-jacques-pro shadow-md border-none self-center md:self-auto"
              >
                <svg className="w-5 h-5 mb-1.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
                <span className="text-[14px] leading-tight mt-0.5">Check<br />Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Two Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-[#181818] rounded-2xl p-8 min-h-[280px]">
            <div className="flex items-center gap-4">
              <img src="/Preparatory_Guidance.png" alt="Preparatory Guidance" className="w-10 h-10 object-contain" />
              <h3 className="text-xl font-bold text-white">Preparatory Guidance</h3>
            </div>
          </div>
          <div className="bg-[#181818] rounded-2xl p-8 min-h-[280px]">
            <div className="flex items-center gap-4">
              <img src="/Mockup Tests.png" alt="Mockup Tests" className="w-10 h-10 object-contain" />
              <h3 className="text-xl font-bold text-white">Mockup Tests</h3>
            </div>
          </div>
        </div>

        <StageAcknowledgementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAcknowledge={() => {
            setIsModalOpen(false);
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
              elem.requestFullscreen().catch(err => console.log(`Error attempting to enable fullscreen: ${err.message}`));
            }
            navigate("/assessment/8758/9589?course=CCI%20Creative%20Course&module=Module%201&cci=1");
          }}
        />
        <StageAcknowledgementModal
          isOpen={isStage2ModalOpen}
          onClose={() => setIsStage2ModalOpen(false)}
          onAcknowledge={() => {
            setIsStage2ModalOpen(false);
            navigate("/cci-stage-2");
          }}
          stageNumber="02"
          badgeColor="#E3007A"
          objective="To evaluate learners on Originality, Design Thinking, and Expression through active participation within the enCODE ecosystem."
          formatLabel="Format:"
          questionFormat={
            <div className="flex flex-col gap-1">
              <p className="m-0">A challenge will be presented. Based on it, demonstrate the three pillars of CODE:</p>
              <div className="mt-2">
                <strong>Originality</strong> → Learn a relevant course to build unique understanding<br />
                <strong>Design</strong> → Engage in a community to exchange and shape ideas<br />
                <strong>Expression</strong> → Share your work on the Buzz/Poll section
              </div>
            </div>
          }
          evaluation="Creativity, problem-solving, and clarity of communication."
          duration="24 Hours"
        />
        <StageAcknowledgementModal
          isOpen={isStage3ModalOpen}
          onClose={() => setIsStage3ModalOpen(false)}
          onAcknowledge={() => {
            setIsStage3ModalOpen(false);
            navigate("/cci-stage-3");
          }}
          stageNumber="03"
          badgeColor="#3dba4e"
          objective="To assess storytelling ability, communication strength, confidence, and personal branding."
          formatLabel="Format:"
          questionFormat={
            <div className="flex flex-col gap-2">
              <div>
                <p className="m-0 font-bold">1. Video Submission (Mandatory)</p>
                <p className="m-0">Upload a Video Resume / Capability Pitch</p>
                <ul className="m-0 pl-5 list-disc space-y-0.5">
                  <li>Duration: 2–3 mins</li>
                  <li>Format: MP4 / MOV</li>
                </ul>
              </div>
              <div>
                <p className="m-0 font-bold">2. Graphic Analysis (Mandatory)</p>
                <p className="m-0">Analyze a given visual (poster/UI/infographic)</p>
              </div>
              <div>
                <p className="m-0 font-bold">3. Written Analysis (Mandatory)</p>
                <p className="m-0">Respond to a given prompt</p>
              </div>
            </div>
          }
          evaluation={
            <ul className="m-0 pl-5 list-disc space-y-1">
              <li>Narrative clarity</li>
              <li>Analytical thinking</li>
              <li>Expression &amp; structure</li>
            </ul>
          }
          duration="6 Hours"
        />
      </div>{/* end blur wrapper */}

      {/* Overlay message when exam date hasn't arrived yet */}
      {isScheduledInFuture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-6 text-center px-8 py-14 rounded-3xl border border-[#333] bg-[#111]/90 shadow-2xl max-w-[620px] w-full mx-4 backdrop-blur-sm font-jacques-pro">
            <span className="text-6xl">🗓️</span>
            <h2 className="text-[28px] md:text-[34px] font-bold text-white leading-tight m-0">
              Your CCIQ Exam Schedule Date is not Arrived Yet!
            </h2>
            <p className="text-[16px] text-gray-400 m-0">
              Your exam is scheduled for{" "}
              <span className="text-[#FFEC00] font-semibold">
                {dayjs(cciStartDate).format('DD MMM, YYYY')}
              </span>.
              <br />Please come back on that date to begin your CCIQ stages.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-2 bg-[#fcee0a] hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold text-[16px] transition-all hover:scale-105 shadow-lg cursor-pointer font-jacques-pro"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Overlay message when exam date is over */}
      {isTimeOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-6 text-center px-8 py-14 rounded-3xl border border-[#333] bg-[#111]/90 shadow-2xl max-w-[620px] w-full mx-4 backdrop-blur-sm font-jacques-pro">
            <span className="text-6xl">⏳</span>
            <h2 className="text-[28px] md:text-[34px] font-bold text-white leading-tight m-0">
              Your CCIQ Exam Date is Exceeded!
            </h2>
            <p className="text-[16px] text-gray-400 m-0">
              Your exam time has run out.
              <br />You can no longer participate in the CCIQ stages.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-2 bg-[#fcee0a] hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold text-[16px] transition-all hover:scale-105 shadow-lg cursor-pointer font-jacques-pro"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentArea;
