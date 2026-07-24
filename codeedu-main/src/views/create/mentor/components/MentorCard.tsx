import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/ShadcnButton';
import { CalendarPlus, MoveRight, Star } from 'lucide-react';
import { BsAwardFill } from 'react-icons/bs';
import { PiMapPinFill } from 'react-icons/pi';
import { RiBriefcaseFill } from 'react-icons/ri';
import vidwanIcon from './icons/Vidwan.svg';
import behanceIcon from './icons/behance.svg';
import linkedinIcon from './icons/linkedin.svg';
import youtubeIcon from './icons/youtube.svg';
import slotAvailableBadge from '@/assets/icons/svg/slot_available.svg';
import type { AllMentorList, LMSMentor, Mentor } from '@/@types/create/mentor';
import { Link } from 'react-router-dom';
import { getMentorAvailableSlotCount } from '@/utils/mentorSlots';
import { usePackageAccessCounts } from '@/hooks/data/usePackageAccessCounts';

type Props = {
  mentor: Mentor;
  onOpenProfile: (mentor: Mentor) => void;
  onOpenSocial: (url?: string) => void;
  mentorRating?: LMSMentor | AllMentorList;
  hideSlotsBadge?: boolean;
  isPublic?: boolean;
};

const MentorCard = ({ mentor, onOpenProfile, onOpenSocial, mentorRating, hideSlotsBadge, isPublic }: Props) => {
  const profilePic =
    mentor?.profileSection?.basic_info?.[0]?.profilePicture ??
    'https://nlmscdnawsbackup.blob.core.windows.net/nlmsmedia/media/ojQf0ridmqH69aWJAtLqfFotJFG4aDmXOazdHNXM.jpg';

  const social = mentor?.profileSection?.social_links?.[0] || {};
  const vidwan = social?.vidwan;
  const behance = social?.behance;
  const linkedin = social?.linkedin;
  const youtube = social?.youtube;
  const about0 = mentor?.profileSection?.about?.[0];
  const years_of_exp = about0?.years_of_exp;
  const domain = about0?.domain;
  const role = about0?.current_role_head_line ?? 'Mentor';
  const location = mentor?.profileSection?.about?.[0]?.location;
  const { isAccessExhausted } = usePackageAccessCounts();

  const rating = mentorRating?.rating || 0;
  const rawRating = parseFloat(String(rating)) || 0;
  const finalRating = rawRating < 3 ? 3 : rawRating;

  const areas_of_expertise =
    mentor?.profileSection?.areas_of_expertise?.[0]?.areas_of_expertise;
  const isMentorAccessExhausted = isAccessExhausted('mentoring-sessions') || isAccessExhausted('mentoring_sessions');

  const cleanYearsOfExp = (exp: string | number | undefined) => {
    if (!exp && exp !== 0) return undefined;

    const expStr = String(exp).trim();
    const yearPattern = /\s*(year|years|Year|Years)$/i;

    if (yearPattern.test(expStr)) {
      return expStr.replace(yearPattern, '').trim();
    }

    return expStr;
  };

  const getExperienceDisplay = (exp: string | number | undefined) => {
    const cleanedExp = cleanYearsOfExp(exp);

    if (!cleanedExp && cleanedExp !== '0') return '-';

    const expNum = parseFloat(cleanedExp);

    if (!isNaN(expNum)) {
      return `${expNum} ${expNum === 1 ? 'year' : 'years'}`;
    }

    return cleanedExp;
  };

  const displayExperience = getExperienceDisplay(years_of_exp);

  const renderStars = () => {
    const stars = [];
    // Parse rating to ensure it's a number
    const ratingValue = typeof finalRating === 'number' ? finalRating : parseFloat(String(finalRating)) || 0;

    for (let i = 1; i <= 5; i++) {
      // Check if current star should be filled based on rating
      const shouldFill = i <= ratingValue;

      stars.push(
        <Star
          key={i}
          className={`${shouldFill
            ? 'fill-codeyellow text-codeyellow'
            : 'fill-gray-300 text-gray-300'
            } w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4`}
        />
      );
    }
    return stars;
  };

  const handleProfileClick = () => {
    onOpenProfile(mentor);
  };

  const slotCount = getMentorAvailableSlotCount(mentor, mentorRating);

  return (
    <Card
      className="
        cursor-pointer relative flex flex-col h-full
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-xl
      "
    // onClick={handleProfileClick}
    >
      <CardHeader className="p-1 sm:p-4 pb-0 sm:pb-0">
        <div className="flex justify-between items-start w-full">
          {location && (
            <div className="gap-0.5 sm:gap-1 bg-codepink p-1 sm:p-2 text-[8px] sm:text-xs md:text-sm rounded-md right-0 text-white w-fit absolute rounded-br-none rounded-tl-none top-0 flex items-center">
              <PiMapPinFill className="inline-block w-2.5 h-2.5 sm:w-4 sm:h-4" /> {location || '-'}
            </div>
          )}

          <div className="flex mt-1 sm:mt-3 flex-col items-center w-full justify-center gap-1 sm:gap-3 cursor-pointer">
            <div className="relative">
              <img
                src={profilePic}
                className="
                  rounded-lg w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover
                  transition-transform duration-300
                  hover:scale-105
                "
                alt={`Profile of ${mentor?.name}`}
              />
              {slotCount > 0 && !hideSlotsBadge && (
                <img
                  src={slotAvailableBadge}
                  alt={`${slotCount} slot${slotCount === 1 ? '' : 's'} available`}
                  title={`${slotCount} open slot${slotCount === 1 ? '' : 's'}`}
                  className="
                    absolute z-10 pointer-events-none select-none
                    bottom-0 -left-[14%] -translate-x-1/2
                    w-[64px] sm:w-[74px] md:w-[84px] h-auto
                  "
                />
              )}
            </div>
            <div className="mt-0 sm:mt-1">
              <h6 className="dark:text-gray-200 text-xs sm:text-sm md:text-base font-bold text-center mt-0 sm:mt-1 leading-tight">
                {mentor?.name}
              </h6>
              <p className="line-clamp-1 sm:line-clamp-2 text-[8px] sm:text-xs md:text-sm font-normal mt-0.5 sm:mt-2 text-center leading-tight">
                {role}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                {renderStars()}
                <span className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 ml-1">
                  {Number(finalRating).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-1 sm:px-4 py-1 sm:py-3 flex-1 flex flex-col justify-center">
        <div className="space-y-0.5 sm:space-y-2">
          <div>
            <p className="text-[8px] sm:text-xs md:text-sm mb-0.5 text-codeblue text-center leading-tight">
              <RiBriefcaseFill className="inline-block mr-1 w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Experience -{' '}
              <span className="font-semibold text-cblack dark:text-white">
                {displayExperience}
              </span>
            </p>
            <p className="text-[8px] sm:text-xs md:text-sm text-center line-clamp-2 text-codeblue leading-tight">
              <BsAwardFill className="inline-block mr-1 w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Expertise -{' '}
              <span className="font-semibold text-cblack dark:text-white">
                {domain && domain !== 'nan'
                  ? domain
                  : areas_of_expertise || ''}
              </span>
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-end mt-auto px-1 sm:px-4 pb-1 sm:pb-4 pt-0 gap-2">
        <div className="grid grid-cols-2 gap-1 sm:gap-3">
          <button
            className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!vidwan}
            aria-label="Vidwan profile"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSocial(vidwan);
            }}
          >
            <img src={vidwanIcon} className="h-4 sm:h-6 md:h-8" alt="Vidwan" />
          </button>
          <button
            className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!behance}
            aria-label="Behance profile"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSocial(behance);
            }}
          >
            <img src={behanceIcon} className="h-4 sm:h-6 md:h-8" alt="Behance" />
          </button>
          <button
            className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!linkedin}
            aria-label="LinkedIn profile"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSocial(linkedin);
            }}
          >
            <img src={linkedinIcon} className="h-4 sm:h-6 md:h-8" alt="LinkedIn" />
          </button>
          <button
            className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!youtube}
            aria-label="YouTube channel"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSocial(youtube);
            }}
          >
            <img src={youtubeIcon} className="h-4 sm:h-6 md:h-8" alt="YouTube" />
          </button>
        </div>

        <div className="flex gap-1 sm:gap-2">
          <a
            href={
              isPublic
                ? `/sign-in?redirectUrl=${encodeURIComponent(`/calendar/create?userType=mentor&id=${mentor?.uniqueIdentifier}`)}`
                : slotCount > 0 && !isMentorAccessExhausted
                  ? `/calendar/create?userType=mentor&id=${mentor?.uniqueIdentifier}`
                  : '#'
            }
            className={`${!isPublic && slotCount <= 0 ? 'pointer-events-none' : ''} ${!isPublic && isMentorAccessExhausted ? 'cursor-not-allowed opacity-80' : ''}`}
            onClick={(e) => {
              if (!isPublic && (slotCount <= 0 || isMentorAccessExhausted)) e.preventDefault();
              e.stopPropagation();
            }}
            title={isMentorAccessExhausted ? 'You have reached the maximum limit available under your current package' : ''}
          >
            <Button
              disabled={!isPublic && slotCount <= 0}
              className={`
                text-black bg-codeyellow w-9 h-9 sm:w-16 sm:h-14 md:w-20 md:h-auto text-wrap
                flex items-center justify-center flex-col gap-0.5 text-[5px] sm:text-[9px] md:text-xs p-0.5 sm:p-2 leading-[1.1]
                transition-all duration-300 rounded-md
                hover:scale-105 hover:shadow-md
                ${slotCount > 0 && isMentorAccessExhausted ? 'cursor-not-allowed opacity-80' : 'disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale'}
                
              `}
            >
              <CalendarPlus className="w-2.5 h-2.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="text-center">Book &<br />Connect</span>
            </Button>
          </a>

          <Link
            to={isPublic 
              ? `/portfolio/${mentor?.name ? mentor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'mentor'}/${mentor?.uniqueIdentifier}`
              : `/user-portfolio/${mentor?.org_id || 'codeedu-dae124fa'}/${mentor?.uniqueIdentifier}`
            }
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="
                bg-codeblue text-black hover:bg-codeblue/80 w-9 h-9 sm:w-16 sm:h-14 md:w-20 md:h-auto text-wrap
                flex items-center justify-center flex-col gap-0.5 text-[5px] sm:text-[9px] md:text-xs p-0.5 sm:p-2 leading-[1.1]
                transition-all duration-300 rounded-md
                hover:scale-105 hover:shadow-md
              "
            >
              <MoveRight className="w-2.5 h-2.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="text-center">View<br />Profile</span>
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card >
  );
};

export default MentorCard;