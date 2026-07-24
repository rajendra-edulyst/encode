import { useState } from 'react';
import { Mentor } from '@/@types/create/mentor';
import Heading from '@/components/heading';
import LoadingSection from '@/components/LoadingSection';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/ShadcnButton';
import { useMentors } from '@/hooks/data/create/useMentor';
import { CalendarPlus, Check, ChevronsUpDown, MoveRight } from 'lucide-react';
import { BsAwardFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import Breadcrumb from '@/components/breadcrumb';
import ProfilePopup from '@/views/common/profile-view/openview/ProfilePopup';
import { PiMapPinFill } from 'react-icons/pi';
import { RiBriefcaseFill } from 'react-icons/ri';
import behanceIcon from './icons/behance.svg';
import linkedinIcon from './icons/linkedin.svg';
import youtubeIcon from './icons/youtube.svg';
import vidwanIcon from './icons/Vidwan.svg';
import { useAuth } from '@/auth';

const MentorPage = () => {
  const { data: mentors = [], isLoading, isError, error } = useMentors();
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);

  const { user } = useAuth();

  // 👇 Popup control states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const locations = Array.from(
    new Set(
      mentors
        .map((mentor) =>
          mentor?.profileSection?.about?.find((item) => item?.location)?.location
        )
        .filter((loc): loc is string => Boolean(loc))
    )
  ).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const filteredMentors =
    locationFilter === 'All Locations'
      ? mentors
      : mentors.filter((mentor) =>
        mentor?.profileSection?.about?.some(
          (item) => item?.location === locationFilter
        )
      );

  // sort mentors alphabetically
  filteredMentors.sort((a: Mentor, b: Mentor) => a.name.localeCompare(b.name));

  const breadcrumbItems = [{ label: 'Mentors' }];

  const handleSocialClick = (url: string | undefined) => {
    if (!url) return;
    let formattedUrl = url;
    if (!formattedUrl.startsWith('http')) formattedUrl = `https://${formattedUrl}`;
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex justify-between items-center mb-4">
        <Heading
          title="Mentors"
          description="Find the right mentor for your learning journey."
          className="mb-0"
        />
        <div className="flex justify-center items-center gap-4">
          <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
            <PopoverTrigger asChild className="overflow-hidden">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={locationPopoverOpen}
                className="justify-between"
              >
                {locationFilter} <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0 overflow-hidden">
              <Command>
                <CommandInput placeholder="Search location..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      key="All Locations"
                      value="All Locations"
                      onSelect={(currentValue) => {
                        setLocationFilter(currentValue || 'All Locations');
                        setLocationPopoverOpen(false);
                      }}
                    >
                      All Locations
                      <Check
                        className={cn(
                          'ml-auto',
                          locationFilter === 'All Locations'
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                    {locations.map((location) => (
                      <CommandItem
                        key={location}
                        value={location}
                        onSelect={(currentValue) => {
                          setLocationFilter(currentValue || 'All Locations');
                          setLocationPopoverOpen(false);
                        }}
                      >
                        {location}
                        <Check
                          className={cn(
                            'ml-auto',
                            location === locationFilter
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Link to="/become-mentor" className="text-primary">
            <Button className="text-black bg-primary" variant="outline" size="sm">
              Be a Mentor
            </Button>
          </Link>
        </div>
      </div>

      {/* Mentor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMentors?.map((mentor, index) => {
          const profilePic =
            mentor?.profileSection?.basic_info?.[0]?.profilePicture ||
            `https://ui-avatars.com/api/?name=${mentor?.name}`;
          const social_links = mentor?.profileSection?.social_links?.[0];
          const years_of_exp = mentor?.profileSection?.about?.[0]?.years_of_exp;
          const domain = mentor?.profileSection?.about?.[0]?.domain;
          // const instagram = social_links?.[0]?.vidwan;
          // const behance = social_links?.[0]?.behance;
          // const linkedin = social_links?.[0]?.linkedin;
          const youtube = social_links?.youtube;
          const instagram = social_links?.instagram;
          const behance = social_links?.behance;
          const linkedin = social_links?.linkedin;
          const role =
            mentor?.profileSection?.about?.[0]?.current_role_head_line ?? 'Mentor';
          // const about = mentor?.profileSection?.about?.[0]?.about_me;
          const location = mentor?.profileSection?.about?.[0]?.location;
          const areas_of_expertise = mentor?.profileSection?.areas_of_expertise?.[0]?.areas_of_expertise;

          return (
            Number(mentor?.uniqueIdentifier) == user?.id && <Card key={index} className="cursor-pointer relative flex flex-col h-full">
              <CardHeader>
                <div className="flex  justify-between items-start w-full">
                  <div className="gap-1 bg-codepink p-2 rounded-md right-0 text-white w-fit absolute rounded-br-none rounded-tl-none top-0 flex items-center">
                    <PiMapPinFill className="inline-block" size={16} />{' '}
                    {location || '-'}
                  </div>
                  <div
                    className="flex mt-5 flex-col items-center w-full justify-center gap-3 cursor-pointer"
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setIsProfileOpen(true);
                    }}
                  >
                    <img
                      src={profilePic}
                      className="rounded-lg w-16 h-16"
                    />
                    <div>
                      <h6 className="dark:text-gray-200 text-xl font-bold text-center">{mentor?.name}</h6>
                      <p className="line-clamp-2 text-sm font-normal mt-2 text-center">{role}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent
                onClick={() => {
                  setSelectedMentor(mentor);
                  setIsProfileOpen(true);
                }}
              >
                <div className="space-y-2">

                  <div>
                    <p className="text-sm mb-1 text-codeblue text-center">
                      <RiBriefcaseFill className="inline-block mr-1" size={12} />
                      Experience -{' '}
                      <span className="font-semibold text-cblack dark:text-white">
                        {years_of_exp || '-'}{' '}
                        {years_of_exp ? (years_of_exp > 1 ? 'years' : 'year') : ''}
                      </span>
                    </p>
                    <p className="text-sm text-center line-clamp-2 text-codeblue">
                      < BsAwardFill className="inline-block mr-1" size={12} />
                      Expertise -{' '}
                      <span className="font-semibold text-cblack dark:text-white">
                        {domain && domain !== 'nan'
                          ? (
                            <>
                              <span className="font-semibold text-cblack dark:text-white">
                                {domain}
                              </span>
                            </>
                          )
                          : (
                            <>
                              {areas_of_expertise ? (
                                <>
                                  <span className="font-semibold text-cblack dark:text-white">
                                    {areas_of_expertise}
                                  </span>
                                </>
                              ) : (
                                <>
                                </>
                              )}
                            </>
                          )}
                      </span>
                    </p>
                  </div>

                  {/* {about && (
                    <div>
                      <h6 className="font-semibold text-sm mb-1 dark:text-gray-200">
                        About -
                      </h6>
                      <p className="line-clamp-3">{about || 'Not specified'}</p>
                    </div>
                  )} */}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-start mt-auto">


                <div className=" grid grid-cols-2 gap-3 ">
                  <a
                    onClick={() => handleSocialClick(instagram)}
                  >
                    <img src={vidwanIcon} className='h-8' alt="" />
                  </a>
                  <a
                    onClick={() => handleSocialClick(behance)}
                  >
                    <img src={behanceIcon} className='h-8' alt="" />
                  </a>
                  <a
                    onClick={() => handleSocialClick(linkedin)}
                  >
                    <img src={linkedinIcon} className='h-8' alt="" />
                  </a>
                  <a
                    onClick={() => handleSocialClick(youtube)}
                  >
                    <img src={youtubeIcon} className='h-8' alt="" />

                  </a>
                </div>

                <div className="flex  gap-2">
                  <Link to={`/calendar/create?userType=mentor&id=${mentor?.uniqueIdentifier}`}>
                    <Button className="text-black bg-codeyellow  max-w-20 h-full font-normal text-wrap flex items-center flex-col"> <CalendarPlus /> Book & Connect</Button>
                  </Link>

                  {/* 👇 Popup trigger button */}
                  <Button
                    className="text-black max-w-20 h-full font-normal text-wrap flex items-center flex-col"
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setIsProfileOpen(true);
                    }}
                  >
                    <MoveRight />
                    View Profile
                  </Button>
                </div>


              </CardFooter>
            </Card>
          );
        })}
      </div>

      {isLoading && (
        <LoadingSection
          isLoading={isLoading}
          title="Loading Mentors..."
          description="Please wait while we fetch the mentors for you."
        />
      )}

      {isError && (
        <div className="text-center text-red-600 mt-4">
          Error: {error?.message || 'Something went wrong while fetching mentors.'}
        </div>
      )}


      {selectedMentor && (
        <ProfilePopup
          isOpen={isProfileOpen}
          org_id={selectedMentor.org_id}
          uniqueIdentifier={selectedMentor.uniqueIdentifier}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default MentorPage;
