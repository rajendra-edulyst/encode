/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 21 March 2025
@author:: Edulyst Ventures  
@purpose : This Component is used to render the Mentor Search Page

@@ Use case (if any use case) and solutions 

**/


import { Mentor } from '@/@types/create/mentor';
import Heading from '@/components/heading';
import LoadingSection from '@/components/LoadingSection';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/ShadcnButton';
import { useMentors } from '@/hooks/data/create/useMentor';
import { Check, ChevronsUpDown, Instagram, Linkedin, MapPin, RefreshCcw } from 'lucide-react';
import React, { useState } from 'react'
import { BsBehance } from 'react-icons/bs';
import { Link } from 'react-router-dom';
// import Connect from './Connect';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import Breadcrumb from '@/components/breadcrumb';
import { useAuth } from '@/auth';

const MentorPage = () => {


  // const [connectMentorDialogOpen, setConnectMentorDialogOpen] = useState(false);
  // const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const { data: mentors = [], isLoading, isError, error, refetch } = useMentors();
  const [locationFilter, setLocationFilter] = useState<string>("All Locations");
  const [locationPopoverOpen, setLocationPopoverOpen] = React.useState(false)

  const { user } = useAuth();

  const locations = Array.from(new Set(mentors.map(mentor => mentor?.profileSection?.about?.find(item => item?.location)?.location).filter((loc): loc is string => Boolean(loc)))).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const filteredMentors = locationFilter === "All Locations" ? mentors : mentors.filter(mentor => mentor?.profileSection?.about?.some(item => item?.location === locationFilter));

  // change mentor alphabetical order
  filteredMentors.sort((a: Mentor, b: Mentor) => a.name.localeCompare(b.name));


  const breadcrumbItems = [
    { label: 'Mentors' }
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSocialClick = (url: string | undefined, platform: string) => {
    if (!url) return;

    let formattedUrl = url;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className='flex justify-between items-center mb-4'>
        <Heading title="Mentors" description='Find the right mentor for your learning journey.' className='mb-0' />
        <div className='flex justify-center items-center gap-4'>
          <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
            <PopoverTrigger asChild className='overflow-hidden'>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={locationPopoverOpen}
                className="justify-between"
              >
                {locationFilter}  <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0 overflow-hidden">
              <Command>
                <CommandInput placeholder="Search location..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem key="All Locations" value="All Locations" onSelect={(currentValue) => {
                      setLocationFilter(currentValue || "All Locations");
                      setLocationPopoverOpen(false);
                    }}>
                      All Locations
                      <Check
                        className={cn(
                          "ml-auto",
                          locationFilter === "All Locations" ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                    {
                      locations.map((location) => (
                        <CommandItem
                          key={location}
                          value={location}
                          onSelect={(currentValue) => {
                            setLocationFilter(currentValue || "All Locations");
                            setLocationPopoverOpen(false);
                          }}
                        >
                          {location}
                          <Check
                            className={cn(
                              "ml-auto",
                              location === locationFilter ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))
                    }
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button asChild className="text-gray-700 bg-primary" variant="outline" size="sm">
            <Link to="/become-mentor" className="text-primary">
              Be a Mentor
            </Link>
          </Button>
          <Button size={'icon'} variant={'outline'} onClick={() => refetch()}>
            <RefreshCcw />
          </Button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-3 nasugap-4'>
        {
          filteredMentors?.map((mentor, index) => {

            // eslint-disable-next-line
            const profileView = `${window.location.origin}/portfolio/${mentor?.org_id}/${mentor?.uniqueIdentifier}`;
            const MiniprofileView = `${window.location.origin}/mini-portfolio/${mentor?.org_id}/${mentor?.uniqueIdentifier}`;

            const profilePic = mentor?.profileSection?.basic_info?.[0]?.profilePicture || `https://ui-avatars.com/api/?name=${mentor?.name}`;
            const social_links = mentor?.profileSection?.social_links?.[0];
            const years_of_exp = mentor?.profileSection?.about?.[0]?.years_of_exp;

            const instagram = social_links?.instagram;
            const behance = social_links?.behance;
            const linkedin = social_links?.linkedin;

            const role = mentor?.profileSection?.about?.[0]?.current_role_head_line ?? 'Mentor';
            const about = mentor?.profileSection?.about?.[0]?.about_me;
            const location = mentor?.profileSection?.about?.[0]?.location
            const areas_of_expertise = mentor?.profileSection?.areas_of_expertise?.[0]?.areas_of_expertise;

            return (
              Number(mentor?.uniqueIdentifier) !== user?.id && <Card key={index} className="cursor-pointer flex flex-col h-full">
                <CardHeader>
                  <div className='flex justify-between items-start w-full'>
                    <div className='flex justify-start items-center gap-3 cursor-pointer' onClick={() => window.open(MiniprofileView, '_blank')}>
                      <img src={profilePic} className='rounded-lg w-16 h-16 bg-gray-200 p-1' />
                      <div>
                        <h6>{mentor?.name}</h6>
                        <p className='line-clamp-2'>{role}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent onClick={() => window.open(MiniprofileView, '_blank')}>
                  <div className='space-y-2'>
                    <div className='gap-2 flex items-center'>
                      {location}
                      <MapPin className='inline-block' size={16} /> {location || "-"}
                    </div>
                    <div>
                      <p className='text-sm mb-1'>Experience <span className='font-semibold text-cblack'>{years_of_exp ?? '-'} {years_of_exp ? years_of_exp > 1 ? 'years' : 'year' : ''}</span></p>
                      <p className='text-sm line-clamp-2'>Expertise <span className='font-semibold text-cblack'>{areas_of_expertise || '-'}</span></p>
                    </div>
                    <div>
                      <h6 className='font-semibold text-sm mb-1'>About</h6>
                      <p className='line-clamp-3'>{about}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between mt-auto">
                  <div className='flex justify-end items-center gap-2'>
                    <Button variant="secondary" size="icon" className="size-8" disabled={!instagram} onClick={() => handleSocialClick(instagram, 'instagram')}>
                      <Instagram className={`${instagram ? 'text-red-700 hover:text-red-500' : 'text-gray-500'} cursor-pointer`} size={23} />
                    </Button>
                    <Button variant="secondary" size="icon" className="size-8" disabled={!linkedin} onClick={() => handleSocialClick(linkedin, 'linkedin')}>
                      <Linkedin className={`${linkedin ? 'text-blue-700 hover:text-blue-500' : 'text-gray-500'} cursor-pointer`} size={23} />
                    </Button>
                    <Button variant="secondary" size="icon" className="size-8" disabled={!behance} onClick={() => handleSocialClick(behance, 'behance')}>
                      <BsBehance className={`${behance ? 'text-blue-700 hover:text-blue-500' : 'text-gray-500'} cursor-pointer`} size={23} />
                    </Button>
                  </div>
                  {/* <Button
                    variant="outline"
                    className="w-10px border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setConnectMentorDialogOpen(true);
                    }}
                  >
                    Connect Now <ArrowRight />
                  </Button> */}
                </CardFooter>
              </Card>
            )
          })
        }
      </div>
      {
        isLoading && <LoadingSection isLoading={isLoading} title='Loading Mentors...' description='Please wait while we fetch the mentors for you.' />
      }
      {/* <Connect open={connectMentorDialogOpen} mentor={selectedMentor} onClose={() => setConnectMentorDialogOpen(false)} /> */}
      {
        isError && <div className='text-center text-red-600 mt-4'>Error: {error?.message || 'Something went wrong while fetching mentors.'}</div>
      }
    </div >
  )
}

export default MentorPage