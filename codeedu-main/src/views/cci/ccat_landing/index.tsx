// import { FunctionComponent } from "react";
// import { Link } from "react-router-dom";
// import ContentArea from "./components/ContentArea";

// const CCATDashboardStage2Done: FunctionComponent = () => {
//   return (
//     <div className="w-full min-h-screen bg-black text-white font-jacques-pro flex flex-col items-center">
//       <main className="w-full max-w-[1300px] flex flex-col items-center gap-10 py-10 px-6 box-border">
//         <ContentArea />
//       </main>
//       <footer className="w-full max-w-[1300px] mt-auto py-8 px-6 border-t border-[#333] flex flex-col gap-6 text-sm text-gray-400">
//         <div className="flex justify-between items-center w-full">
//           <div className="flex gap-4">
//             <Link to="/help-center?cci=1" className="hover:text-white cursor-pointer" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</Link> | <Link to="/queries?cci=1" className="hover:text-white cursor-pointer" style={{ color: 'inherit', textDecoration: 'none' }}>Support</Link>
//           </div>
//           {/*<div>Attempts Left: 2/3</div>*/}
//         </div>
//         <div className="text-center mt-4">
//           © Copyrights 2026 All rights reserved by CODE EDU
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default CCATDashboardStage2Done;



// Icons
import { HiOutlineLightBulb, HiOutlinePuzzlePiece, HiOutlineChatBubbleBottomCenterText, HiOutlineCpuChip, HiOutlineUserGroup } from 'react-icons/hi2'
import { MdOutlineArchitecture, MdOutlineRocketLaunch, MdOutlineRadar } from 'react-icons/md'
import { TbBuildingCommunity } from 'react-icons/tb'
import { BsBullseye } from 'react-icons/bs'
import HeroSection from './components/HeroSection'
import GrowthSection from './components/GrowthSection'
import EvaluationSection from './components/EvaluationSection'
import BackgroundRibbon from './components/BackgroundRibbon'
import AudienceSection from './components/AudienceSection'
import CTASection from './components/CTASection'
import { useNavigate } from 'react-router-dom'
import HeroImage from './user-interface-background 1.png'
import { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUserProfile, useUpdateCCIStartDate, useCCITimeslots } from "@/hooks/data/useGettingStarted";

const CCATLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: userProfile } = useUserProfile();
  const { mutate: updateCCI } = useUpdateCCIStartDate();
  const { data: timeslotsData } = useCCITimeslots();

  // Extract dates from API response or use empty array
  const apiDates: any[] = Array.isArray(timeslotsData) ? timeslotsData : (timeslotsData?.data || []);

  // Format dates for display
  const dates = apiDates.map(dateItem => {
    const dateStr = typeof dateItem === 'object' && dateItem !== null
      ? (dateItem.date || dateItem.timeslot || dateItem.start_date || dateItem.cci_start_date || Object.values(dateItem)[0] || String(dateItem))
      : String(dateItem);
    const parsed = dayjs(dateStr);
    return parsed.isValid() ? parsed.format('DD MMM, YYYY') : dateStr;
  });

  // Set default selected date once dates are loaded
  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  const onFrameButtonClick = useCallback(() => {
    if (!userProfile) return;

    if ((userProfile.completed_hrs || 0) < 10) {
      setIsDialogOpen(true);
    } else {
      if (userProfile.cci_start_date) {
        navigate('/cci');
      } else {
        setIsLockDialogOpen(true);
      }
    }
  }, [userProfile, navigate]);

  // Mock Data for API readiness
  const heroData = {
    title: (
      <>
        Creativity, cognition, and <br />
        mindset define your potential. <br />
        CCIQ measures it.
      </>
    ),
    subtitle: "CCIQ measures your creative mindset, problem-solving ability, and design intuition - not your memory.",
    buttonText: "Start Now",
    buttonAction: onFrameButtonClick,
    image: HeroImage
  }

  const growthData = {
    text: "Growth isn't one-shot.",
    highlightText: "3 attempts",
    subText: "You get 3 attempts a year, use them to evolve."
  }

  const evaluationCardsData = [
    {
      title: "Creative &\nCritical Thinking",
      description: "The ability to generate ideas, evaluate, recognize patterns, decide under uncertainty, and invent.",
      icon: <HiOutlineLightBulb className="w-10 h-10" />,
      colorTheme: "purple" as const
    },
    {
      title: "Problem Solving\n& Systems Thinking",
      description: "Analyzing problems, mapping systems, and building solutions through rigorous thinking.",
      icon: <HiOutlinePuzzlePiece className="w-10 h-10" />,
      colorTheme: "orange" as const
    },
    {
      title: "Communication\n& Expressions",
      description: "A blend of verbal, visual, and written communication to convey ideas clearly and persuasively.",
      icon: <HiOutlineChatBubbleBottomCenterText className="w-10 h-10" />,
      colorTheme: "cyan" as const
    },
    {
      title: "Digital & AI\nFluency",
      description: "Leveraging technology and AI to research, analyze, think, and drive creative solutions.",
      icon: <HiOutlineCpuChip className="w-10 h-10" />,
      colorTheme: "pink" as const
    },
    {
      title: "Collaboration &\nLeadership",
      description: "Working collaboratively, leading with initiative, and taking ownership while resolving challenges.",
      icon: <HiOutlineUserGroup className="w-10 h-10" />,
      colorTheme: "green" as const
    }
  ]

  const evaluationData = {
    title: "What CCIQ Evaluates?",
    subtitle: "CCIQ Focuses on the core pillars of creative intelligence-",
    cards: evaluationCardsData
  }

  const audienceCardsData = [
    {
      title: "Aspiring Designers",
      description: "For those pursuing or planning B.Des, B.Arch, BFA, NID, NIFT & other design programs.",
      icon: <MdOutlineArchitecture className="w-6 h-6" />,
      colorTheme: "yellow" as const
    },
    {
      title: "Curious Creators",
      description: "Turn your curiosity into clarity and direction.",
      icon: <HiOutlineLightBulb className="w-6 h-6" />,
      colorTheme: "orange" as const
    },
    {
      title: "Creative Industries",
      description: "For creative industries that prioritize originality, design, and expression.",
      icon: <TbBuildingCommunity className="w-6 h-6" />,
      colorTheme: "green" as const
    },
    {
      title: "Future Innovators",
      description: "Understand how you think, adapt, and build what's next.",
      icon: <MdOutlineRadar className="w-6 h-6" />,
      colorTheme: "blue" as const
    },
    {
      title: "Talent-Forward Institutions",
      description: "Identify and nurture creative capability beyond academic scores.",
      icon: <MdOutlineRocketLaunch className="w-6 h-6" />,
      colorTheme: "purple" as const
    }
  ]

  const audienceData = {
    title: "Who Should Take CCIQ?",
    subtitle: "For those who don't just want to learn- but want to understand how capable they truly are.",
    audiences: audienceCardsData
  }

  const ctaData = {
    heading: (
      <>
        Think you've got the creative edge?<br />
        <span className="font-normal text-gray-300 text-3xl sm:text-4xl">Take CCIQ. Discover how you think.</span>
      </>
    ) as unknown as string, // Cast to string for props compatibility if needed, or adjust types.ts to accept ReactNode
    description: "",
    buttonText: "Start Now",
    buttonAction: onFrameButtonClick
  }

  return (
    <div className="w-full min-h-screen bg-black font-jacques-pro selection:bg-[#FFDE00] selection:text-black relative overflow-x-hidden">
      <div className="relative z-10 w-full flex flex-col">
        <HeroSection {...heroData} />
        <GrowthSection {...growthData} />
        <EvaluationSection {...evaluationData} />

        {/* Shared container for Audience and CTA sections to allow a single continuous background ribbon */}
        <div className="relative w-full overflow-hidden">
          {/* The ribbon flows from top-right down to bottom-center. 
                        Scaled up significantly and flipped horizontally so the video's hard edges are outside the screen, leaving only the smooth curve.
                    */}
          <BackgroundRibbon className="absolute top-[40%] -right-[20%] w-[140%] h-[130%] -left-[20%] -scale-x-100 rotate-[150deg] z-0 opacity-70 pointer-events-none" />

          <AudienceSection {...audienceData} />
          <CTASection {...ctaData} heading={ctaData.heading as string} />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#606060] border-none sm:max-w-2xl px-6 py-12 flex flex-col items-center text-center gap-6 rounded-3xl z-[200]">
          <DialogTitle className="text-white text-3xl md:text-[38px] font-bold mt-2 leading-tight">
            Keep Going to Unlock This Stage
          </DialogTitle>
          <div className="flex flex-col text-white text-[20px] md:text-[22px] tracking-wide font-light gap-1 mb-4">
            <span>You still need to complete {Math.max(0, 24 - (userProfile?.completed_hrs || 0))} hours to</span>
            <span>attempt the CCIQ Test.</span>
            <span>(Atleast 24 Hours on the platform)</span>
          </div>
          <button
            onClick={() => {
              setIsDialogOpen(false);
            }}
            className="flex flex-col items-center justify-center bg-[#fcee0a] hover:bg-[#ffe500] text-black font-medium rounded-xl px-12 py-3 transition-colors"
          >
            <span className="text-xl leading-none">↗</span>
            <span className="leading-tight text-[18px]">Continue<br />Learning</span>
          </button>
        </DialogContent>
      </Dialog>

      <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
        <DialogContent className="bg-[#606060] border-none sm:max-w-[900px] px-6 py-12 flex flex-col items-center text-center gap-8 rounded-3xl z-[200]">
          <DialogTitle className="text-white text-3xl md:text-[42px] font-bold mt-2 leading-tight">
            Lock Your CCI Moment
          </DialogTitle>
          <div className="flex flex-col text-white text-[18px] md:text-[20px] tracking-wide font-light gap-1">
            <span>Pick a date and time when you can focus, think freely,</span>
            <span>and give your best. (24 hours window)</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {dates.map((date, idx) => {
              const parts = date.split(',');
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center rounded-xl px-6 py-4 cursor-pointer transition-all ${selectedDate === date ? 'border border-[#fcee0a] text-[#fcee0a] bg-[#393939]' : 'border border-transparent text-white bg-[#444444] hover:bg-[#555555]'}`}
                  style={{ minWidth: '125px' }}
                >
                  <span className="font-medium text-lg leading-tight">{parts[0]}{parts.length > 1 ? ',' : ''}</span>
                  {parts.length > 1 && <span className="font-medium text-lg leading-tight">{parts[1].trim()}</span>}
                </div>
              );
            })}
          </div>

          <div className="flex items-stretch gap-6 mt-4">
            <button
              onClick={() => setIsLockDialogOpen(false)}
              className="flex items-center justify-center bg-[#a3a3a3] hover:bg-[#b0b0b0] text-black font-medium rounded-xl px-10 transition-colors"
            >
              <span className="leading-tight text-[18px]">Not<br />Now</span>
            </button>

            <button
              onClick={() => {
                const formattedDate = dayjs(selectedDate, 'DD MMM, YYYY').format('YYYY-MM-DD HH:mm:ss');
                updateCCI(formattedDate, {
                  onSuccess: () => {
                    setIsLockDialogOpen(false);
                    navigate('/cci');
                  }
                });
              }}
              className="flex flex-col items-center justify-center bg-[#fcee0a] hover:bg-[#ffe500] text-black font-medium rounded-xl px-10 py-3 transition-colors"
            >
              <span className="text-xl leading-none">↗</span>
              <span className="leading-tight text-[18px]">Confirm<br />& Start</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CCATLandingPage

