import {
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
} from 'react-icons/pi'
import { MdCastForEducation, MdOutlineLocalPlay } from "react-icons/md";
import { User, TvMinimalPlay, FileQuestion, FileText, UserRoundSearch, LayoutDashboard, CalendarDays, LibraryBig, BriefcaseBusiness, Presentation, GraduationCap, ChartLine, Scroll, ScanSearch, NotebookPen, House, CirclePlus, Users, BookOpenCheck, BookKey, PackageSearch, CalendarRange, ScanEye, Info, Building, Package } from 'lucide-react';
import { JSX } from 'react';
import { IoIosPeople } from 'react-icons/io';
import { SiCodementor } from "react-icons/si";
import { HiOutlineUserGroup } from "react-icons/hi";

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <LayoutDashboard className='text-primary' />,
    mySpace: <BookOpenCheck className='text-primary' />,
    recommended: <BookKey className='text-primary' />,
    explore: <PackageSearch className='text-primary' />,
    house: <House className="w-5 h-5 text-primary" />,
    Create: <CirclePlus className=" text-primary" />,
    singleMenu: <PiAcornDuotone className='text-primary' />,
    collapseMenu: <PiArrowsInDuotone className='text-primary' />,
    groupSingleMenu: <PiBookOpenUserDuotone className='text-primary' />,
    groupCollapseMenu: <PiBookBookmarkDuotone className='text-primary' />,
    groupMenu: <PiBagSimpleDuotone className='text-primary' />,
    learningMenu: <MdCastForEducation className='text-primary' />,
    user: <User size={24} />,
    blog: <img src="https://edulystblob.blob.core.windows.net/evmedias/blogs.png" alt="blog" className='w-6' />,
    news: <img src="https://edulystblob.blob.core.windows.net/evmedias/News.png" alt="blog" className='w-6' />,
    competition: <img src="https://edulystblob.blob.core.windows.net/evmedias/competitions.png" alt="blog" className='w-6' />,
    ideaSpace: <img src="https://edulystblob.blob.core.windows.net/evmedias/idea_Space.png" alt="blog" className='w-6' />,
    internship: <GraduationCap className='text-primary' />,
    jobs: <img src="https://edulystblob.blob.core.windows.net/evmedias/jobs.png" alt="blog" className='w-6' />,
    placements: <img src="https://edulystblob.blob.core.windows.net/evmedias/placements.png" alt="blog" className='w-6' />,
    // new icons
    queries: <FileQuestion className='text-primary' />,
    classes: <Presentation className='text-primary' />,
    event: <MdOutlineLocalPlay className='text-primary' />,
    calendar: <CalendarDays className='text-primary' />,
    community: <IoIosPeople className='text-primary' />,
    mentoring: <SiCodementor className='text-primary' />,
    myCourses: <LibraryBig className='text-primary' />,
    portfolio: <BriefcaseBusiness className='text-primary' />,
    sessions: <TvMinimalPlay size={22} className='text-primary' />,
    quiz: <FileQuestion size={22} className='text-primary' />,
    assignment: <FileText size={22} className='text-primary' />,
    userSearch: <UserRoundSearch size={22} className='text-primary' />,
    events: <MdOutlineLocalPlay size={22} className='text-primary' />,
    analytics: <ChartLine size={22} className='text-primary' />,
    myWall: <House size={22} className='text-primary' />,
    myPosts: <Scroll size={22} className='text-primary' />,
    myCommunities: <HiOutlineUserGroup size={22} className='text-primary' />,
    discover: <ScanSearch size={22} className='text-primary' />,
    activity: <NotebookPen size={22} className='text-primary' />,
    talentPool: <Users size={22} className='text-primary' />,
    onTheAgenda: <CalendarRange size={22} className='text-primary' />,
    infocus: <ScanEye size={22} className='text-primary' />,
    helpCenter: <Info size={22} className='text-primary' />,
    industries: <Building size={22} className='text-primary' />,
    package: <Package size={22} className='text-primary' />,
    analyticsDashboard: <ChartLine size={22} className='text-primary' />,
}

export default navigationIcon
