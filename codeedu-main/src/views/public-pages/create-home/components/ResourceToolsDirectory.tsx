import React, { useMemo } from 'react'
import { Button } from '@/components/ui/ShadcnButton'
import { ArrowRight, CloudLightning } from 'lucide-react'
import { useResource } from '@/hooks/data/create/useResource'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth'
import { toast } from 'sonner'
import ApiService from '@/services/ApiService'
import HeroVideo from './0_Abstract_Black_1280x720 (1).mp4'


const DUMMY_TOOLS: any[] = [
    { id: '1', name: 'HeyGen', official_url: '#' },
    { id: '2', name: 'Canva', official_url: '#' },
    { id: '3', name: 'Figma', official_url: '#' },
    { id: '4', name: 'Framer', official_url: '#' },
    { id: '5', name: 'Notion', official_url: '#' },
    { id: '6', name: 'ChatGPT', official_url: '#' },
    { id: '7', name: 'Cube', official_url: '#' },
    { id: '8', name: 'Miro', official_url: '#' },
    { id: '9', name: 'Adobe', official_url: '#' },
    { id: '10', name: 'Kaiber', official_url: '#' },
    { id: '11', name: 'Zoom', official_url: '#' },
    { id: '12', name: 'Midjourney', official_url: '#' },
];

const ResourceToolsDirectory = () => {
    const { authenticated } = useAuth();
    const params = useMemo(() => new URLSearchParams({ type: 'toolkits' }), []);
    const { data: items = [], isLoading } = useResource(params, true);

    // Get up to 12 tools for the grid
    const toolsToDisplay = items.length > 0 ? items.slice(0, 12) : DUMMY_TOOLS;

    const getSSOData = async () => {
        if (!authenticated) {
            toast.error('Please log in to access the Full Library');
            return;
        }

        const loadingToast = toast.loading('Connecting to Creative Library...');
        try {
            const response = await ApiService.fetchDataWithAxios<{
                status: number;
                data: {
                    jwt: string;
                    orgId: string;
                    url: string;
                };
            }>({
                url: 'https://encodeapi.codeedu.co/api/knimbus-sso',
                method: 'get',
            });

            if (response.status === 1) {
                const { url, jwt, orgId } = response.data;

                const form = document.createElement('form');
                form.method = 'POST';
                form.action = url;
                form.target = '_blank';

                const jwtInput = document.createElement('input');
                jwtInput.type = 'hidden';
                jwtInput.name = 'jwt';
                jwtInput.value = jwt;
                form.appendChild(jwtInput);

                const orgIdInput = document.createElement('input');
                orgIdInput.type = 'hidden';
                orgIdInput.name = 'orgId';
                orgIdInput.value = orgId;
                form.appendChild(orgIdInput);

                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
                toast.dismiss(loadingToast);
            } else {
                toast.error('Failed to authenticate with Creative Library', { id: loadingToast });
            }
        } catch (error) {
            console.error('Error fetching SSO data:', error);
            toast.error('Something went wrong', { id: loadingToast });
        }
    };

    return (
        <section className="mb-8">
            <div className="bg-[#1D1D1D] rounded-2xl p-6 md:p-8">
                <div className="mb-8">
                    <h2 className="text-[30px] lg:text-[32px] font-semibold text-codepink">
                        Resource Tools Directory
                    </h2>
                    <p className="mt-2 text-[30px] lg:text-[22px] font-normal leading-[1.1] text-#FFFFFF max-w-3xl">
                        Curated toolkits to accelerate your creative workflow</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tools Grid */}
                    <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 lg:p-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-codeyellow font-bold text-lg mb-2 uppercase tracking-wide">
                                THE AI ARSENAL
                            </h3>
                            <p className="text-gray-400 text-sm mb-8 max-w-md">
                                Deploy cutting-edge generative tools to your production pipeline to 10X your UI/UX prototyping to image synthesis needs.
                            </p>

                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {isLoading ? (
                                    <div className="col-span-full text-gray-400 text-sm py-4">Loading tools...</div>
                                ) : toolsToDisplay.map((tool) => {
                                    const isValidUrl = tool.official_url && (tool.official_url.startsWith('http://') || tool.official_url.startsWith('https://'));
                                    const href = isValidUrl ? tool.official_url : '#';

                                    return (
                                        <a
                                            key={tool.id}
                                            href={href}
                                            target={isValidUrl ? "_blank" : "_self"}
                                            rel="noopener noreferrer"
                                            className="bg-white rounded-lg p-3 flex flex-col items-center justify-center gap-2 h-20 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black font-bold overflow-hidden shrink-0">
                                                <img
                                                    src={tool.logo_url ?? `https://ui-avatars.com/api/?name=${tool.name}&background=random&size=64`}
                                                    alt={tool.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${tool.name}&background=random&size=64`;
                                                    }}
                                                />
                                            </div>
                                            <span className="text-black text-[10px] font-semibold text-center line-clamp-1 w-full leading-tight">{tool.name}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Link to="/explore/resource-hub/toolkits">
                                <Button className="bg-codeblue hover:bg-codeblue/90 text-white rounded-lg text-sm px-6 flex items-center gap-2">
                                    Explore AI Toolkit <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Hub Library Card */}
                    <div className="relative rounded-xl overflow-hidden border border-gray-800 flex flex-col justify-end min-h-[300px] lg:min-h-0">
                        <video
                            src={HeroVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                        <div className="relative p-6 mt-auto">
                            <button
                                onClick={getSSOData}
                                className="w-full bg-codeblue rounded-xl p-6 text-center shadow-lg backdrop-blur-sm border border-codeblue/50 hover:bg-codeblue/90 transition-colors cursor-pointer"
                            >
                                <CloudLightning className="w-10 h-8 text-white mx-auto mb-3" />
                                <h4 className="text-white font-bold text-lg mb-1">Full Library</h4>
                                <p className="text-white/80 text-xs">Access 500+ curated assets for your projects</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResourceToolsDirectory
