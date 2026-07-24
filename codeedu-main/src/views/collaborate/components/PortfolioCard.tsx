import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/ShadcnButton'
import { MoveRight } from 'lucide-react'
import { useUserProfile } from '@/hooks/data/useGettingStarted'
import { useQuery } from '@tanstack/react-query'
import { getprofile } from '@/views/common/profile-view/openview/openService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'

interface PortfolioCardProps {
    data: {
        id: string
        profile_image?: string
        name?: string
        designation?: string
        description?: string
        skills?: string[]
        role?: string
    }
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ data }) => {
    const { authenticated } = useAuth();
    const { data: userProfile } = useUserProfile();
    const org_id = userProfile?.user_profile?.org_id;

    const navigate = useNavigate();
    const profileView = `/user-portfolio/${org_id || 'codeedu-dae124fa'}/${data?.id}`

    const handleViewProfile = () => {
        navigate(profileView);
    }

    const { data: profileData } = useQuery({
        queryKey: ['portfolioProfile', org_id, data.id],
        queryFn: () => getprofile(org_id!, data.id),
        enabled: !!org_id && !!data.id,
        staleTime: 1000 * 60 * 5,
    });

    const fetchedSkills = profileData?.portfolio?.profileSection?.skills
        ? profileData.portfolio.profileSection.skills.map((skill: any) => skill.skill_name || skill.name)
        : [];

    const skills = fetchedSkills.length > 0
        ? fetchedSkills
        : (data?.skills && data.skills.length > 0 ? data.skills : []);

    return (
        <Card className="relative bg-[#2f2f2f] rounded-2xl h-full p-6 flex flex-col justify-between shadow-lg overflow-hidden">

            <Badge className={`absolute top-0 right-0 rounded-md rounded-ss-none rounded-ee-none p-1 px-3 text-xs font-medium ${data.role === 'Student' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                data.role === 'Industry' ? 'bg-green-100 text-green-800 border-green-200' :
                    data.role === 'Faculty' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        'bg-codepink text-white border-none'
                }`}>
                {'Creator'}
            </Badge>


            <div className="flex flex-col items-center text-center gap-3">
                <img
                    src={data?.profile_image}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                    loading="lazy"
                />

                <h3 className="text-white text-xl font-semibold">
                    {data?.name}
                </h3>


                <p className="text-gray-300 text-sm">
                    {data?.designation}
                </p>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 max-w-xs">
                    {data?.description}
                </p>
            </div>


            <CardContent className="px-0 pt-6">
                <div className="flex items-end justify-between gap-4">

                    <div className="flex flex-col gap-2">
                        {skills.slice(0, 3).map((skill, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="border-[#7FBC42] text-white text-xs px-4 py-1 rounded-full w-fit"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>


                    <Button
                        onClick={handleViewProfile}
                        className="bg-primary hover:bg-[#7cab48] text-black w-[110px] h-[94px] rounded-xl flex flex-col items-center justify-center gap-2 text-sm font-medium"
                    >
                        <MoveRight size={18} />
                        View
                        <br />
                        Portfolio
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default PortfolioCard
