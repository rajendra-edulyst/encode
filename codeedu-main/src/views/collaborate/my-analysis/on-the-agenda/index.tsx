// import Breadcrumb from '@/components/breadcrumb'
// import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
// import { useEvents } from '@/hooks/data/collaborate/useEvents';
// import { ClipboardCheck, Goal, Info, List, Megaphone, Plus, SquarePen} from 'lucide-react';
// import React from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import { useIndustryAnalysis } from '@/hooks/data/collaborate/useIndustry';
// import PackageCard from '@/components/PackageCard';
// import { IoPersonSharp } from 'react-icons/io5';
// import handShake from "@/assets/icons/svg/handshake.svg";
// import graduationCap from '@/assets/icons/svg/graduation.svg';
// import person from '@/assets/icons/svg/person.svg';
// import ticket from '@/assets/icons/svg/ticket.svg';
// import programIcon from "@/assets/icons/svg/graduation-cap.svg";
// import resumeIcon from "@/assets/icons/svg/article_person.svg";

// const Index = () => {

//     const breadcrumbItems = [
//         { label: 'Industry' },
//     ];

//     const { data: events = [] } = useEvents();
//     const navigate = useNavigate();
//     const { data: statsCounts } = useIndustryAnalysis();

//     return (
//         <div>
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
//                 <Breadcrumb items={breadcrumbItems} />
//                 <PackageCard />
//             </div>

//             <div className='space-y-5'>
//                 {/* Stats Cards */}
//                 <div>
//                     <Card>
//                         <CardContent>
//                             <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
//                                 {/* Job Posted */}
//                                 <Card className='bg-[#323232] pb-2 gap-4 cursor-pointer hover:scale-105 transition-transform duration-300'>
//                                     <CardContent>
//                                         <div className='flex items-center gap-3'>
//                                             <div className='bg-[#5A5A5A] p-3 rounded-lg flex items-center justify-center'>
//                                                 <ClipboardCheck className='text-white' />
//                                             </div>
//                                             <div>
//                                                 <p className='text-white text-xs'>Job Posted</p>
//                                                 <h1 className='text-white text-2xl font-bold'>{statsCounts?.job_posted ?? 0}</h1>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                     <CardFooter className='flex justify-end items-end'>
//                                         <div
//                                             className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2'
//                                             onClick={() => navigate('/industry/jobs')}
//                                         >
//                                             <Info className='text-black' size={13} />
//                                             <p className='text-black text-[10px] mt-1'>View Details</p>
//                                         </div>
//                                     </CardFooter>
//                                 </Card>

//                                 {/* Applicants Received */}
//                                 <Card className='bg-[#323232] pb-2 gap-4 cursor-pointer hover:scale-105 transition-transform duration-300'>
//                                     <CardContent>
//                                         <div className='flex items-center gap-3'>
//                                             <div className='bg-[#5A5A5A] p-3 rounded-lg flex items-center justify-center'>
//                                                 <IoPersonSharp className='text-white' />
//                                             </div>
//                                             <div>
//                                                 <p className='text-white text-xs'>Applicants Received</p>
//                                                 <h1 className='text-white text-2xl font-bold'>{statsCounts?.tot_applicants ?? 0}</h1>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                     <CardFooter className='flex justify-end items-end'>
//                                         <div
//                                             className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2'
//                                             onClick={() => navigate('/industry/talent-pool')}
//                                         >
//                                             <Info className='text-black' size={13} />
//                                             <p className='text-black text-[10px] mt-1'>View Details</p>
//                                         </div>
//                                     </CardFooter>
//                                 </Card>

//                                 {/* Placement % */}
//                                 <Card className='bg-[#323232] pb-2 gap-4 cursor-pointer hover:scale-105 transition-transform duration-300'>
//                                     <CardContent>
//                                         <div className='flex items-center gap-3'>
//                                             <div className='bg-[#5A5A5A] p-3 rounded-lg flex items-center justify-center'>
//                                                 <Goal className='text-white' />
//                                             </div>
//                                             <div>
//                                                 <p className='text-white text-xs'>Placement %</p>
//                                                 <h1 className='text-white text-2xl font-bold'>{statsCounts?.total_placed ?? 0}</h1>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                     <CardFooter className='flex justify-end items-end'>
//                                         <div className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2'>
//                                             <Info className='text-black' size={13} />
//                                             <p className='text-black text-[10px] mt-1'>View Details</p>
//                                         </div>
//                                     </CardFooter>
//                                 </Card>

//                                 {/* Events Created */}
//                                 <Card className='bg-[#323232] pb-2 gap-4 cursor-pointer hover:scale-105 transition-transform duration-300'>
//                                     <CardContent>
//                                         <div className='flex items-center gap-3'>
//                                             <div className='bg-[#5A5A5A] p-3 rounded-lg flex items-center justify-center'>
//                                                 <Megaphone className='text-white' />
//                                             </div>
//                                             <div>
//                                                 <p className='text-white text-xs'>Events Created</p>
//                                                 <h1 className='text-white text-2xl font-bold'>{statsCounts?.events_created ?? 0}</h1>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                     <CardFooter className='flex justify-end items-end'>
//                                         <div
//                                             className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2'
//                                             onClick={() => navigate('/collaborate/events?category=Masterclass')}
//                                         >
//                                             <Info className='text-black' size={13} />
//                                             <p className='text-black text-[10px] mt-1'>View Details</p>
//                                         </div>
//                                     </CardFooter>
//                                 </Card>

//                                 {/* Total Participants */}
//                                 <Card className='bg-[#323232] pb-2 gap-4 cursor-pointer hover:scale-105 transition-transform duration-300'>
//                                     <CardContent>
//                                         <div className='flex items-center gap-3'>
//                                             <div className='bg-[#5A5A5A] p-3 rounded-lg flex items-center justify-center'>
//                                                 <IoPersonSharp className='text-white' />
//                                             </div>
//                                             <div>
//                                                 <p className='text-white text-xs'>Total Participants</p>
//                                                 <h1 className='text-white text-2xl font-bold'>{statsCounts?.tot_participants ?? 0}</h1>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                     <CardFooter className='flex justify-end items-end'>
//                                         <div className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2'>
//                                             <Info className='text-black' size={13} />
//                                             <p className='text-black text-[10px] mt-1'>View Details</p>
//                                         </div>
//                                     </CardFooter>
//                                 </Card>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Scheduled Events Carousel */}
//                 {(events && events.length !== 0) && (
//                     <div>
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className='text-white text-2xl'>Scheduled Events</CardTitle>
//                                 <CardAction>
//                                     <Link to="/collaborate/my-analysis/on-the-agenda" className="text-sm text-primary hover:underline">
//                                         View All
//                                     </Link>
//                                 </CardAction>
//                             </CardHeader>
//                             <CardContent className="overflow-hidden px-0">
//                                 <div className="relative px-6">
//                                     <Carousel className="w-full">
//                                         <CarouselContent className="pb-5 md:pb-0">
//                                             {events?.map(item => (
//                                                 <CarouselItem key={item.type} className="md:basis-1/2 lg:basis-1/3 2xl:basis-1/4 pb-4">
//                                                     <div
//                                                         className='h-96 w-full bg-gray-800/40 hover:bg-gray-800/25 transition flex flex-col justify-end p-4 rounded-[20px] bg-cover bg-center bg-no-repeat'
//                                                         style={{ backgroundImage: `url('${item.image}')` }}
//                                                     >
//                                                         <div
//                                                             className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2'
//                                                             onClick={() => navigate(`/collaborate/events/${item.id}/edit`)}
//                                                         >
//                                                             <SquarePen className='text-black' size={13} />
//                                                             <p className='text-black text-[10px] mt-1'>Update Event</p>
//                                                         </div>
//                                                     </div>
//                                                 </CarouselItem>
//                                             ))}
//                                         </CarouselContent>
//                                         <CarouselPrevious className="absolute left-2 z-10 text-primary" />
//                                         <CarouselNext className="absolute right-2 z-10 text-primary" />
//                                     </Carousel>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 )}

//                 {/* Main Sections */}
//                 <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
//                     {/* 1. Jobs/Placement */}
//                     <div>
//                         <Card className='gap-2'>
//                             <CardHeader>
//                                 <CardTitle className='text-white'>Jobs/Placement</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
//                                     {/* Resume Management */}
//                                     <Card className='bg-[#323232] p-3 flex flex-col h-full'>
//                                         <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
//                                           <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
//                                                 <img
//                                                     src={resumeIcon}
//                                                     alt="User"
//                                                     className="w-8 h-8"
//                                                 />
//                                             </div>
//                                             <h3 className="text-white text-sm font-medium">Resume Management</h3>
//                                         </CardContent>
//                                         <CardFooter className='mt-auto pt-3 flex justify-center'>
//                                             <div
//                                                 className='h-[64px] w-full bg-primary text-center p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate('/industry/talent-pool')}
//                                             >
//                                                 <List className='text-black' size={16} />
//                                                 <p className='text-black text-[10px] mt-1'>Profile Listing</p>
//                                             </div>
//                                         </CardFooter>
//                                     </Card>

//                                     {/* Job Management */}
//                                     <Card className='bg-[#323232] p-3 flex flex-col h-full'>
//                                         <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
//                                            <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
//                                                 <img
//                                                     src={person}
//                                                     alt="User"
//                                                     className="w-6 h-6"
//                                                 />
//                                             </div>
//                                             <h3 className="text-white text-sm font-medium">Job Management</h3>
//                                         </CardContent>
//                                         <CardFooter className='mt-auto pt-3 flex justify-center gap-2'>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-gray-600 text-center p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate('/industry/jobs')}
//                                             >
//                                                 <List className='text-white' size={16} />
//                                                 <p className='text-white text-[10px] mt-1'>Job Listing</p>
//                                             </div>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-primary text-center p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate('/industry/jobs/add')}
//                                             >
//                                                 <Plus className='text-black' size={16} />
//                                                 <p className='text-black text-[10px] mt-1'>Create Job</p>
//                                             </div>
//                                         </CardFooter>
//                                     </Card>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>

//                     {/* 2. On the Agenda */}
//                     <div>
//                         <Card>
//                             <CardHeader className='pb-0'>
//                                 <CardTitle className='text-white'>On the Agenda</CardTitle>
//                             </CardHeader>
//                             <CardContent className='px-2 pt-3'>
//                                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                                     {/* Masterclass */}
//                                     <Card className='bg-[#323232] p-3 flex flex-col h-full'>
//                                         <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
//                                             <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
//                                                 <img
//                                                     src={person}
//                                                     alt="User"
//                                                     className="w-6 h-6"
//                                                 />
//                                             </div>
//                                             <h3 className="text-white text-sm font-medium">Masterclass</h3>
//                                         </CardContent>
//                                         <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events?category=Masterclass`)}
//                                             >
//                                                 <List className='text-white' size={16} />
//                                                 <p className='text-white text-[10px] mt-1'>Events Listing</p>
//                                             </div>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events/create?category=masterclass`)}
//                                             >
//                                                 <Plus className='text-black' size={16} />
//                                                 <p className='text-black text-[10px] mt-1'>Add Masterclass</p>
//                                             </div>
//                                         </CardFooter>
//                                     </Card>

//                                     {/* Workshop */}
//                                     <Card className='bg-[#323232] p-3 flex flex-col h-full'>
//                                         <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
//                                             <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
//                                                 <img
//                                                     src={person}
//                                                     alt="User"
//                                                     className="w-6 h-6"
//                                                 />
//                                             </div>
//                                             <h3 className="text-white text-sm font-medium">Workshop</h3>
//                                         </CardContent>
//                                         <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events?category=Workshops`)}
//                                             >
//                                                 <List className='text-white' size={16} />
//                                                 <p className='text-white text-[10px] mt-1'>Workshop Listing</p>
//                                             </div>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events/create?category=Workshops`)}
//                                             >
//                                                 <Plus className='text-black' size={16} />
//                                                 <p className='text-black text-[10px] mt-1'>Add Workshop</p>
//                                             </div>
//                                         </CardFooter>
//                                     </Card>

//                                     {/* Industry Visit */}
//                                     <Card className='bg-[#323232] p-3 flex flex-col h-full'>
//                                         <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
//                                              <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
//                                                 <img
//                                                     src={person}
//                                                     alt="User"
//                                                     className="w-6 h-6"
//                                                 />
//                                             </div>
//                                             <h3 className="text-white text-sm font-medium">Industry Visit</h3>
//                                         </CardContent>
//                                         <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events?category=Industry Visits`)}
//                                             >
//                                                 <List className='text-white' size={16} />
//                                                 <p className='text-white text-[10px] mt-1'>Industry Listing</p>
//                                             </div>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events/create?category=industry visit`)}
//                                             >
//                                                 <Plus className='text-black' size={16} />
//                                                 <p className='text-black text-[10px] mt-1'>Add Visit</p>
//                                             </div>
//                                         </CardFooter>
//                                     </Card>

//                                     {/* Competitions */}
//                                     <Card className='bg-[#323232] p-3 flex flex-col h-full'>
//                                         <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
//                                             {/* <div className="bg-[#5A5A5A] p-2.5 rounded-md">
//                                                 <User className="text-white w-6 h-6" />
//                                             </div> */}
//                                               <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
//                                                 <img
//                                                     src={person}
//                                                     alt="User"
//                                                     className="w-6 h-6"
//                                                 />
//                                             </div>
//                                             <h3 className="text-white text-sm font-medium">Competitions</h3>
//                                         </CardContent>
//                                         <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events?category=Competitions`)}
//                                             >
//                                                 <List className='text-white' size={16} />
//                                                 <p className='text-white text-[10px] mt-1'>Competitions Listing</p>
//                                             </div>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events/create?category=competition`)}
//                                             >
//                                                 <Plus className='text-black' size={16} />
//                                                 <p className='text-black text-[10px] mt-1'>Add Competition</p>
//                                             </div>
//                                         </CardFooter>
//                                     </Card>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>

//                     {/* 3. Must Attend */}
//                     <div>
//                         <Card>
//                             <CardHeader className='pb-0'>
//                                 <CardTitle className='text-white'>Must Attend</CardTitle>
//                             </CardHeader>
//                             <CardContent className='px-2 pt-3'>
//                                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                                     {/* Creators Meetup */}
//                                     <Card className='bg-[#323232] p-3 flex flex-col h-full'>
//                                         <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
//                                             {/* <div className="bg-[#5A5A5A] p-2.5 rounded-md">
//                                                 <SquareUserRound className="text-white w-6 h-6" />
//                                             </div> */}
//                                             <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
//                                                 <img
//                                                     src={handShake}
//                                                     alt="User"
//                                                     className="w-6 h-6"
//                                                 />
//                                             </div>
//                                             <h3 className="text-white text-sm font-medium">Creators Meetup</h3>
//                                         </CardContent>
//                                         <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/must-attend/community-meetups?category=Community Meetup`)}
//                                             >
//                                                 <List className='text-white' size={16} />
//                                                 <p className='text-white text-[10px] mt-1'>Meetup Listing</p>
//                                             </div>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events/create?category=community meetups`)}
//                                             >
//                                                 <Plus className='text-black' size={16} />
//                                                 <p className='text-black text-[10px] mt-1'>Add Meetup</p>
//                                             </div>
//                                         </CardFooter>
//                                     </Card>

//                                     {/* Flagship Event */}
//                                     <Card className='bg-[#323232] p-3 flex flex-col h-full'>
//                                         <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
//                                             {/* <div className="bg-[#5A5A5A] p-2.5 rounded-md">
//                                                 <User className="text-white w-6 h-6" />
//                                             </div> */}
//                                             <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
//                                                 <img
//                                                     src={ticket}
//                                                     alt="User"
//                                                     className="w-6 h-6"
//                                                 />
//                                             </div>
//                                             <h3 className="text-white text-sm font-medium">Flagship Event</h3>
//                                         </CardContent>
//                                         <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/must-attend/community-meetups?category=Flagship Events`)}
//                                             >
//                                                 <List className='text-white' size={16} />
//                                                 <p className='text-white text-[10px] mt-1'>Event Listing</p>
//                                             </div>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events/create?category=flagship event`)}
//                                             >
//                                                 <Plus className='text-black' size={16} />
//                                                 <p className='text-black text-[10px] mt-1'>Add Event</p>
//                                             </div>
//                                         </CardFooter>
//                                     </Card>

//                                     {/* Career Drive */}
//                                     <Card className='bg-[#323232] p-3 flex flex-col h-full'>
//                                         <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
//                                             {/* <div className="bg-[#5A5A5A] p-2.5 rounded-md">
//                                                 <User className="text-white w-6 h-6" />
//                                             </div> */}
//                                             <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
//                                                 <img
//                                                     src={graduationCap}
//                                                     alt="User"
//                                                     className="w-6 h-6"
//                                                 />
//                                             </div>
//                                             <h3 className="text-white text-sm font-medium">Career Drive</h3>
//                                         </CardContent>
//                                         <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/must-attend/community-meetups?category=Career Drive`)}
//                                             >
//                                                 <List className='text-white' size={16} />
//                                                 <p className='text-white text-[10px] mt-1'>Drive Listing</p>
//                                             </div>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events/create?category=drive`)}
//                                             >
//                                                 <Plus className='text-black' size={16} />
//                                                 <p className='text-black text-[10px] mt-1'>Add Drive</p>
//                                             </div>
//                                         </CardFooter>
//                                     </Card>

//                                     {/* Immersion Program */}
//                                     <Card className='bg-[#323232] p-3 flex flex-col h-full'>
//                                         <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
//                                             {/* <div className="bg-[#5A5A5A] p-2.5 rounded-md">
//                                                 <User className="text-white w-6 h-6" />
//                                             </div> */}
//                                             <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
//                                                 <img
//                                                     src={programIcon}
//                                                     alt="User"
//                                                     className="w-6 h-6"
//                                                 />
//                                             </div>
//                                             <h3 className="text-white text-sm font-medium">Immersion Program</h3>
//                                         </CardContent>
//                                         <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/must-attend/community-meetups?category=Immersion Programs`)}
//                                             >
//                                                 <List className='text-white' size={16} />
//                                                 <p className='text-white text-[10px] mt-1'>Program Listing</p>
//                                             </div>
//                                             <div
//                                                 className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
//                                                 onClick={() => navigate(`/collaborate/events/create?category=immersion program`)}
//                                             >
//                                                 <Plus className='text-black' size={16} />
//                                                 <p className='text-black text-[10px] mt-1'>Add Program</p>
//                                             </div>
//                                         </CardFooter>
//                                     </Card>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Index
import Breadcrumb from '@/components/breadcrumb'
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useEvents } from '@/hooks/data/collaborate/useEvents';
import { ClipboardCheck, Goal, Info, List, Megaphone, Plus, SquarePen, FileText, Briefcase } from 'lucide-react';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useIndustryAnalysis } from '@/hooks/data/collaborate/useIndustry';
import PackageCard from '@/components/PackageCard';
import { IoPersonSharp } from 'react-icons/io5';

// SVG Imports - Make sure these paths are correct
import handShake from "@/assets/icons/svg/handshake.svg";
import graduationCap from '@/assets/icons/svg/graduation.svg';
import ticket from '@/assets/icons/svg/ticket.svg';
import programIcon from "@/assets/icons/svg/graduation-cap.svg";

const Index = () => {

    const breadcrumbItems = [
        { label: 'Industry' },
    ];

    const { data: events = [] } = useEvents();
    const navigate = useNavigate();
    const { data: statsCounts } = useIndustryAnalysis();

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <Breadcrumb items={breadcrumbItems} />
                <PackageCard />
            </div>

            <div className='space-y-5'>
                {/* Stats Cards */}
                <div>
                    <Card>
                        <CardContent>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                                {/* Job Posted */}
                                <Card className='bg-[#323232] pb-2 gap-4 cursor-pointer hover:scale-105 transition-transform duration-300'>
                                    <CardContent>
                                        <div className='flex items-center gap-3'>
                                            <div className='bg-[#5A5A5A] p-3 rounded-lg flex items-center justify-center'>
                                                <ClipboardCheck className='text-white' />
                                            </div>
                                            <div>
                                                <p className='text-white text-xs'>Job Posted</p>
                                                <h1 className='text-white text-2xl font-bold'>{statsCounts?.job_posted ?? 0}</h1>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className='flex justify-end items-end'>
                                        <div
                                            className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2'
                                            onClick={() => navigate('/industry/jobs')}
                                        >
                                            <Info className='text-black' size={13} />
                                            <p className='text-black text-[10px] mt-1'>View Details</p>
                                        </div>
                                    </CardFooter>
                                </Card>

                                {/* Applicants Received */}
                                <Card className='bg-[#323232] pb-2 gap-4 cursor-pointer hover:scale-105 transition-transform duration-300'>
                                    <CardContent>
                                        <div className='flex items-center gap-3'>
                                            <div className='bg-[#5A5A5A] p-3 rounded-lg flex items-center justify-center'>
                                                <IoPersonSharp className='text-white' />
                                            </div>
                                            <div>
                                                <p className='text-white text-xs'>Applicants Received</p>
                                                <h1 className='text-white text-2xl font-bold'>{statsCounts?.tot_applicants ?? 0}</h1>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className='flex justify-end items-end'>
                                        <div
                                            className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2'
                                            onClick={() => navigate('/industry/talent-pool')}
                                        >
                                            <Info className='text-black' size={13} />
                                            <p className='text-black text-[10px] mt-1'>View Details</p>
                                        </div>
                                    </CardFooter>
                                </Card>

                                {/* Placement % */}
                                <Card className='bg-[#323232] pb-2 gap-4 cursor-pointer hover:scale-105 transition-transform duration-300'>
                                    <CardContent>
                                        <div className='flex items-center gap-3'>
                                            <div className='bg-[#5A5A5A] p-3 rounded-lg flex items-center justify-center'>
                                                <Goal className='text-white' />
                                            </div>
                                            <div>
                                                <p className='text-white text-xs'>Placement %</p>
                                                <h1 className='text-white text-2xl font-bold'>{statsCounts?.total_placed ?? 0}</h1>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className='flex justify-end items-end'>
                                        <div className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2'>
                                            <Info className='text-black' size={13} />
                                            <p className='text-black text-[10px] mt-1'>View Details</p>
                                        </div>
                                    </CardFooter>
                                </Card>

                                {/* Events Created */}
                                <Card className='bg-[#323232] pb-2 gap-4 cursor-pointer hover:scale-105 transition-transform duration-300'>
                                    <CardContent>
                                        <div className='flex items-center gap-3'>
                                            <div className='bg-[#5A5A5A] p-3 rounded-lg flex items-center justify-center'>
                                                <Megaphone className='text-white' />
                                            </div>
                                            <div>
                                                <p className='text-white text-xs'>Events Created</p>
                                                <h1 className='text-white text-2xl font-bold'>{statsCounts?.events_created ?? 0}</h1>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className='flex justify-end items-end'>
                                        <div
                                            className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2'
                                            onClick={() => navigate('/collaborate/events?category=Masterclass')}
                                        >
                                            <Info className='text-black' size={13} />
                                            <p className='text-black text-[10px] mt-1'>View Details</p>
                                        </div>
                                    </CardFooter>
                                </Card>

                                {/* Total Participants */}
                                <Card className='bg-[#323232] pb-2 gap-4 cursor-pointer hover:scale-105 transition-transform duration-300'>
                                    <CardContent>
                                        <div className='flex items-center gap-3'>
                                            <div className='bg-[#5A5A5A] p-3 rounded-lg flex items-center justify-center'>
                                                <IoPersonSharp className='text-white' />
                                            </div>
                                            <div>
                                                <p className='text-white text-xs'>Total Participants</p>
                                                <h1 className='text-white text-2xl font-bold'>{statsCounts?.tot_participants ?? 0}</h1>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className='flex justify-end items-end'>
                                        <div className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2'>
                                            <Info className='text-black' size={13} />
                                            <p className='text-black text-[10px] mt-1'>View Details</p>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Scheduled Events Carousel */}
                {(events && events.length !== 0) && (
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-white text-2xl'>Scheduled Events</CardTitle>
                                <CardAction>
                                    <Link to="/collaborate/my-analysis/on-the-agenda" className="text-sm text-primary hover:underline">
                                        View All
                                    </Link>
                                </CardAction>
                            </CardHeader>
                            <CardContent className="overflow-hidden px-0">
                                <div className="relative px-6">
                                    <Carousel className="w-full" opts={{ align: "start" }}>
                                        <CarouselContent className="pb-5 md:pb-0">
                                            {events?.map(item => (
                                                <CarouselItem key={item.type} className="basis-1/2 pb-4 cursor-pointer" onClick={() => navigate('/collaborate/agenda')}>
                                                    <div
                                                        className='w-full h-[300px] bg-gray-800/40 hover:bg-gray-800/25 transition flex flex-col justify-end items-end p-4 rounded-[20px] bg-cover bg-center bg-no-repeat shadow-sm'
                                                        style={{ backgroundImage: `url('${item.image}')` }}
                                                    >
                                                        <div
                                                            className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2 hover:scale-105 transition-transform shadow-lg'
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/collaborate/events/${item.id}/edit`); }}
                                                        >
                                                            <SquarePen className='text-black' size={14} />
                                                            <p className='text-black text-[10px] mt-1 font-semibold leading-tight'>Update Event</p>
                                                        </div>
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="absolute left-2 z-10 text-primary" />
                                        <CarouselNext className="absolute right-2 z-10 text-primary" />
                                    </Carousel>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Sections */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    {/* 1. Jobs/Placement */}
                    <div>
                        <Card className='gap-2'>
                            <CardHeader>
                                <CardTitle className='text-white'>Jobs/Placement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                    {/* Resume Management - Using FileText icon from lucide-react */}
                                    <Card className='bg-[#323232] p-3 flex flex-col h-full'>
                                        <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
                                            <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
                                                <FileText className="text-white w-6 h-6" />
                                            </div>
                                            <h3 className="text-white text-sm font-medium">Resume Management</h3>
                                        </CardContent>
                                        <CardFooter className='mt-auto pt-3 flex justify-center'>
                                            <div
                                                className='h-[64px] w-full bg-primary text-center p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate('/industry/talent-pool')}
                                            >
                                                <List className='text-black' size={16} />
                                                <p className='text-black text-[10px] mt-1'>Profile Listing</p>
                                            </div>
                                        </CardFooter>
                                    </Card>

                                    {/* Job Management - Using Briefcase icon from lucide-react */}
                                    <Card className='bg-[#323232] p-3 flex flex-col h-full'>
                                        <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
                                            <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
                                                <Briefcase className="text-white w-6 h-6" />
                                            </div>
                                            <h3 className="text-white text-sm font-medium">Job Management</h3>
                                        </CardContent>
                                        <CardFooter className='mt-auto pt-3 flex justify-center gap-2'>
                                            <div
                                                className='h-[64px] flex-1 bg-gray-600 text-center p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate('/industry/jobs')}
                                            >
                                                <List className='text-white' size={16} />
                                                <p className='text-white text-[10px] mt-1'>Job Listing</p>
                                            </div>
                                            <div
                                                className='h-[64px] flex-1 bg-primary text-center p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate('/industry/jobs/add')}
                                            >
                                                <Plus className='text-black' size={16} />
                                                <p className='text-black text-[10px] mt-1'>Create Job</p>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 2. On the Agenda */}
                    <div>
                        <Card>
                            <CardHeader className='pb-0'>
                                <CardTitle className='text-white'>On the Agenda</CardTitle>
                            </CardHeader>
                            <CardContent className='px-2 pt-3'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {/* Masterclass */}
                                    <Card className='bg-[#323232] p-3 flex flex-col h-full'>
                                        <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
                                            <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
                                                <IoPersonSharp className="text-white w-6 h-6" />
                                            </div>
                                            <h3 className="text-white text-sm font-medium">Masterclass</h3>
                                        </CardContent>
                                        <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
                                            <div
                                                className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events?category=Masterclass`)}
                                            >
                                                <List className='text-white' size={16} />
                                                <p className='text-white text-[10px] mt-1'>Events Listing</p>
                                            </div>
                                            <div
                                                className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events/create?category=masterclass`)}
                                            >
                                                <Plus className='text-black' size={16} />
                                                <p className='text-black text-[10px] mt-1'>Add Masterclass</p>
                                            </div>
                                        </CardFooter>
                                    </Card>

                                    {/* Workshop */}
                                    <Card className='bg-[#323232] p-3 flex flex-col h-full'>
                                        <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
                                            <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
                                                <IoPersonSharp className="text-white w-6 h-6" />
                                            </div>
                                            <h3 className="text-white text-sm font-medium">Workshop</h3>
                                        </CardContent>
                                        <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
                                            <div
                                                className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events?category=Workshops`)}
                                            >
                                                <List className='text-white' size={16} />
                                                <p className='text-white text-[10px] mt-1'>Workshop Listing</p>
                                            </div>
                                            <div
                                                className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events/create?category=Workshops`)}
                                            >
                                                <Plus className='text-black' size={16} />
                                                <p className='text-black text-[10px] mt-1'>Add Workshop</p>
                                            </div>
                                        </CardFooter>
                                    </Card>

                                    {/* Industry Visit */}
                                    <Card className='bg-[#323232] p-3 flex flex-col h-full'>
                                        <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
                                            <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
                                                <IoPersonSharp className="text-white w-6 h-6" />
                                            </div>
                                            <h3 className="text-white text-sm font-medium">Industry Visit</h3>
                                        </CardContent>
                                        <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
                                            <div
                                                className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events?category=Industry Visits`)}
                                            >
                                                <List className='text-white' size={16} />
                                                <p className='text-white text-[10px] mt-1'>Industry Listing</p>
                                            </div>
                                            <div
                                                className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events/create?category=industry visit`)}
                                            >
                                                <Plus className='text-black' size={16} />
                                                <p className='text-black text-[10px] mt-1'>Add Visit</p>
                                            </div>
                                        </CardFooter>
                                    </Card>

                                    {/* Competitions */}
                                    <Card className='bg-[#323232] p-3 flex flex-col h-full'>
                                        <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
                                            <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
                                                <IoPersonSharp className="text-white w-6 h-6" />
                                            </div>
                                            <h3 className="text-white text-sm font-medium">Competitions</h3>
                                        </CardContent>
                                        <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
                                            <div
                                                className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events?category=Competitions`)}
                                            >
                                                <List className='text-white' size={16} />
                                                <p className='text-white text-[10px] mt-1'>Competitions Listing</p>
                                            </div>
                                            <div
                                                className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events/create?category=competition`)}
                                            >
                                                <Plus className='text-black' size={16} />
                                                <p className='text-black text-[10px] mt-1'>Add Competition</p>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 3. Must Attend */}
                    <div>
                        <Card>
                            <CardHeader className='pb-0'>
                                <CardTitle className='text-white'>Must Attend</CardTitle>
                            </CardHeader>
                            <CardContent className='px-2 pt-3'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {/* Creators Meetup */}
                                    <Card className='bg-[#323232] p-3 flex flex-col h-full'>
                                        <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
                                            <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
                                                <img
                                                    src={handShake}
                                                    alt="Handshake"
                                                    className="w-6 h-6"
                                                />
                                            </div>
                                            <h3 className="text-white text-sm font-medium">Creators Meetup</h3>
                                        </CardContent>
                                        <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
                                            <div
                                                className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/must-attend/community-meetups?category=Community Meetup`)}
                                            >
                                                <List className='text-white' size={16} />
                                                <p className='text-white text-[10px] mt-1'>Meetup Listing</p>
                                            </div>
                                            <div
                                                className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events/create?category=community meetups`)}
                                            >
                                                <Plus className='text-black' size={16} />
                                                <p className='text-black text-[10px] mt-1'>Add Meetup</p>
                                            </div>
                                        </CardFooter>
                                    </Card>

                                    {/* Flagship Event */}
                                    <Card className='bg-[#323232] p-3 flex flex-col h-full'>
                                        <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
                                            <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
                                                <img
                                                    src={ticket}
                                                    alt="Ticket"
                                                    className="w-6 h-6"
                                                />
                                            </div>
                                            <h3 className="text-white text-sm font-medium">Flagship Event</h3>
                                        </CardContent>
                                        <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
                                            <div
                                                className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/must-attend/community-meetups?category=Flagship Events`)}
                                            >
                                                <List className='text-white' size={16} />
                                                <p className='text-white text-[10px] mt-1'>Event Listing</p>
                                            </div>
                                            <div
                                                className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events/create?category=flagship event`)}
                                            >
                                                <Plus className='text-black' size={16} />
                                                <p className='text-black text-[10px] mt-1'>Add Event</p>
                                            </div>
                                        </CardFooter>
                                    </Card>

                                    {/* Career Drive */}
                                    <Card className='bg-[#323232] p-3 flex flex-col h-full'>
                                        <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
                                            <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
                                                <img
                                                    src={graduationCap}
                                                    alt="Graduation Cap"
                                                    className="w-6 h-6"
                                                />
                                            </div>
                                            <h3 className="text-white text-sm font-medium">Career Drive</h3>
                                        </CardContent>
                                        <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
                                            <div
                                                className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/must-attend/community-meetups?category=Career Drive`)}
                                            >
                                                <List className='text-white' size={16} />
                                                <p className='text-white text-[10px] mt-1'>Drive Listing</p>
                                            </div>
                                            <div
                                                className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events/create?category=drive`)}
                                            >
                                                <Plus className='text-black' size={16} />
                                                <p className='text-black text-[10px] mt-1'>Add Drive</p>
                                            </div>
                                        </CardFooter>
                                    </Card>

                                    {/* Immersion Program */}
                                    <Card className='bg-[#323232] p-3 flex flex-col h-full'>
                                        <CardContent className="p-2 flex flex-row items-center gap-3 flex-1 pb-0">
                                            <div className="bg-[#5A5A5A] p-2.5 rounded-md flex items-center justify-center">
                                                <img
                                                    src={programIcon}
                                                    alt="Program"
                                                    className="w-6 h-6"
                                                />
                                            </div>
                                            <h3 className="text-white text-sm font-medium">Immersion Program</h3>
                                        </CardContent>
                                        <CardFooter className='mt-auto pt-3 flex justify-center gap-2 px-2'>
                                            <div
                                                className='h-[64px] flex-1 bg-gray-600 text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/must-attend/community-meetups?category=Immersion Programs`)}
                                            >
                                                <List className='text-white' size={16} />
                                                <p className='text-white text-[10px] mt-1'>Program Listing</p>
                                            </div>
                                            <div
                                                className='h-[64px] flex-1 bg-primary text-center p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer'
                                                onClick={() => navigate(`/collaborate/events/create?category=immersion program`)}
                                            >
                                                <Plus className='text-black' size={16} />
                                                <p className='text-black text-[10px] mt-1'>Add Program</p>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index