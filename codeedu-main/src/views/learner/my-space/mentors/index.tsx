/**
@@@ Disclaimer: This code belongs to Edulyst Ventures Private Limited 

@date of Version 1 : 21 March 2025
@author::
Edulyst Ventures  
@purpose :
This Component is used to render the Mentor Search Page
**/

import { useState } from 'react';
import { Mentor } from '@/@types/create/mentor';
import Heading from '@/components/heading';
import LoadingSection from '@/components/LoadingSection';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/ShadcnButton';
import { useMentors, useMyMentors } from '@/hooks/data/create/useMentor';
import { Instagram, Linkedin, MapPin } from 'lucide-react';
import { BsBehance } from 'react-icons/bs';
import Breadcrumb from '@/components/breadcrumb';
import ProfilePopup from '@/views/common/profile-view/openview/ProfilePopup';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth';

const MentorPage = () => {
  const { data: mentors = [], isLoading, isError, error } = useMentors();
  const { data: myMentors = [], isLoading: isMyMentorsLoading } = useMyMentors();

  const { user } = useAuth();

  // 🔹 Popup Control
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  // Sort mentors alphabetically
  mentors?.sort((a: Mentor, b: Mentor) => a.name.localeCompare(b.name));

  // Filter only user's mentors
  const myMentorsIds = myMentors?.map((mentor) => mentor.id.toString());
  const onlyMyMentors = mentors?.filter((mentor) =>
    myMentorsIds.includes(mentor.uniqueIdentifier)
  );

  const breadcrumbItems = [{ label: 'Mentors' }];

  const handleSocialClick = (url?: string) => {
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
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {onlyMyMentors?.map((mentor, index) => {
          const profilePic =
            mentor?.profileSection?.basic_info?.[0]?.profilePicture ||
            `https://ui-avatars.com/api/?name=${mentor?.name}`;
          const social_links = mentor?.profileSection?.social_links?.[0];
          const years_of_exp = mentor?.profileSection?.about?.[0]?.years_of_exp;
          const domain = mentor?.profileSection?.about?.[0]?.domain;
          const instagram = social_links?.instagram;
          const behance = social_links?.behance;
          const linkedin = social_links?.linkedin;
          const role =
            mentor?.profileSection?.about?.[0]?.current_role_head_line ?? 'Mentor';
          // const about = mentor?.profileSection?.about?.[0]?.about_me;
          const location = mentor?.profileSection?.about?.[0]?.location;
          const areas_of_expertise =
            mentor?.profileSection?.areas_of_expertise?.[0]?.areas_of_expertise;

          return (
            Number(mentor?.uniqueIdentifier) !== user?.id && <Card key={index} className="cursor-pointer flex flex-col h-full">
              {/* Card Header */}
              <CardHeader>
                <div className="flex flex-col justify-between items-start w-full">
                  <div
                    className="flx flex-col justify-start items-center gap-3 cursor-pointer"
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setIsProfileOpen(true);
                    }}
                  >
                    <img
                      src={profilePic}
                      className="rounded-lg w-16 h-16 bg-gray-200 p-1"
                    />
                    <div>
                      <h6 className="dark:text-gray-200">{mentor?.name}</h6>
                      <p className="line-clamp-2 font-light">{role}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Card Content */}
              <CardContent
                onClick={() => {
                  setSelectedMentor(mentor);
                  setIsProfileOpen(true);
                }}
              >
                <div className="space-y-2">
                  <div className="gap-2 flex items-center">
                    <MapPin className="inline-block" size={16} /> {location || '-'}
                  </div>

                  <div>
                    <p className="text-sm mb-1 dark:text-gray-200">
                      Experience -{' '}
                      <span className="font-semibold text-cblack dark:text-gray-400">
                        {years_of_exp || '-'}{' '}
                        {years_of_exp ? (years_of_exp > 1 ? 'years' : 'year') : ''}
                      </span>
                    </p>
                    <p className="text-sm line-clamp-2 dark:text-gray-200">
                      Expertise -{' '}
                      <span className="font-semibold text-cblack dark:text-gray-400">
                        {areas_of_expertise && areas_of_expertise !== 'nan'
                          ? areas_of_expertise
                          : domain || '-'}
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

              {/* Card Footer */}
              <CardFooter className="flex flex-col justify-start items-start mt-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Link to={`/calendar/create?userType=mentor&id=${mentor?.uniqueIdentifier}`}>
                    <Button className="text-white">Schedule a meeting</Button>
                  </Link>

                  <Button
                    className="text-white"
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setIsProfileOpen(true);
                    }}
                  >
                    View Profile
                  </Button>
                </div>

                <div className="flex justify-end items-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-8"
                    disabled={!instagram}
                    onClick={() => handleSocialClick(instagram)}
                  >
                    <Instagram
                      className={`${instagram
                        ? 'text-red-700 hover:text-red-500'
                        : 'text-gray-500'
                        } cursor-pointer`}
                      size={23}
                    />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-8"
                    disabled={!linkedin}
                    onClick={() => handleSocialClick(linkedin)}
                  >
                    <Linkedin
                      className={`${linkedin
                        ? 'text-blue-700 hover:text-blue-500'
                        : 'text-gray-500'
                        } cursor-pointer`}
                      size={23}
                    />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-8"
                    disabled={!behance}
                    onClick={() => handleSocialClick(behance)}
                  >
                    <BsBehance
                      className={`${behance
                        ? 'text-blue-700 hover:text-blue-500'
                        : 'text-gray-500'
                        } cursor-pointer`}
                      size={23}
                    />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Loading Section */}
      {(isLoading || isMyMentorsLoading) && (
        <LoadingSection
          isLoading={isLoading || isMyMentorsLoading}
          title="Loading Mentors..."
          description="Please wait while we fetch the mentors for you."
        />
      )}

      {/* Error Handling */}
      {isError && (
        <div className="text-center text-red-600 mt-4">
          Error: {error?.message || 'Something went wrong while fetching mentors.'}
        </div>
      )}

      {/* Profile Popup */}
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
