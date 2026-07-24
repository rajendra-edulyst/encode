import {
    Swiper,
    SwiperSlide,
    type SwiperRef
} from "swiper/react";
import TopNetworkCard from "@/components/TopNetworkCard";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import useResponsive from "@/utils/hooks/useResponsive";

interface User {
    id: number;
    name: string;
    profile_image: string;
    number_of_post: number;
    number_of_comments: number;
    number_of_likes: number;
    heading?: string;
    description?: string;
    image?: string;
}

const contributorText = {
    like: {
        heading: "Support Squad",
        description: "Always hyping others with a like!",
        image:
            "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/community/Contribution/like.png"
    },
    comment: {
        heading: "Comment Champion",
        description: "Always ready with insights or kind words",
        image:
            "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/community/Contribution/comments.png"
    },
    post: {
        heading: "Content Creator",
        description: "Your ideas fuel the community",
        image:
            "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/community/Contribution/creative-writing.png"
    },
    highestLikePostComment: {
        heading: "Community Hero",
        description: "You like, comment, and post—triple threat!",
        image:
            "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/community/Contribution/superhero.png"
    }
};

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const fetchUsers = async (type: "weekly" | "monthly") => {
    const response = await fetch(
        `https://elmscodeedu.edulystventures.com/api/v1/top-joy-posted?data_type=${type}`,
        {
            headers: {
                "Content-Type": "application/json",
                "nlms-api-key": "0612b32b39f4b29f48c5c5363028ee916bb99CodeEdu"
            }
        }
    );
    if (!response.ok) throw new Error("Network response was not ok");
    // Simulate a delay for demonstration purposes
    await sleep(300); // 500ms delay
    return response.json();
};

const useTopNetworkers = (type: "weekly" | "monthly") =>
    useQuery({
        queryKey: ["topNetworkers", type],
        queryFn: () => fetchUsers(type)
    });

const TopNetworkers = () => {
    const [type, setType] = useState<"weekly" | "monthly">("monthly");
    const swiperRef = useRef<SwiperRef | null>(null);

    const { data, isLoading, isFetching, error } = useTopNetworkers(type);
    const [fakeLoading, setFakeLoading] = useState(false);
    const { larger, smaller } = useResponsive()

    // On type change or cache refetch, show spinner for 1s if not already loading
    useEffect(() => {
        if (isFetching) {
            setFakeLoading(true);
            const to = setTimeout(() => setFakeLoading(false), 300);
            return () => clearTimeout(to);
        }
        setFakeLoading(false);
    }, [isFetching, isLoading, type]);

    const users: User[] = useMemo(() => {
        if (!data?.data) return [];

        type ContributorType = "like" | "comment" | "post";

        let processedUsers = data.data.map((user: User) => {
            const { number_of_post, number_of_comments, number_of_likes } = user;
            const max = Math.max(
                number_of_post,
                number_of_comments,
                number_of_likes
            );

            const topCategories: ContributorType[] = [];
            if (number_of_post === max) topCategories.push("post");
            if (number_of_comments === max) topCategories.push("comment");
            if (number_of_likes === max) topCategories.push("like");
            const selected: ContributorType =
                topCategories[Math.floor(Math.random() * topCategories.length)];

            return {
                ...user,
                heading: contributorText[selected].heading,
                description: contributorText[selected].description,
                image: contributorText[selected].image
            };
        });

        // Find the most contributor
        const mostContributor = data.data.reduce(
            (prev: User | null, current: User) => {
                const prevTotal =
                    (prev?.number_of_likes || 0) +
                    (prev?.number_of_comments || 0) +
                    (prev?.number_of_post || 0);
                const currentTotal =
                    current.number_of_likes +
                    current.number_of_comments +
                    current.number_of_post;
                return currentTotal > prevTotal ? current : prev;
            },
            null
        );
        // Assign 'Community Hero' to most contributor
        if (mostContributor) {
            processedUsers = processedUsers.map((user: User) =>
                user.id === mostContributor.id
                    ? {
                        ...user,
                        heading: contributorText.highestLikePostComment.heading,
                        description: contributorText.highestLikePostComment.description,
                        image: contributorText.highestLikePostComment.image
                    }
                    : user
            );
        }
        return processedUsers;
    }, [data]);

    // Swiper autoplay start
    useEffect(() => {
        swiperRef.current?.swiper?.autoplay?.start();
    }, []);


    if(users?.length === 0) return null;

    return (
        <div
            className="bg-no-repeat bg-cover bg-top w-full py-16 px-10"
            style={{
                backgroundImage:
                    "url('https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/codeedu-landing/hero-bg.png?v=1')"
            }}
        >
            <div className="flex flex-col gap-3 text-center mb-10">
                <h1 className="text-black text-3xl font-bold">
                    Top Networkers of the Week
                </h1>
                <p className="text-lg text-black font-normal">
                    Meet the changemakers fueling our community — from project sharers to discussion drivers,<br /> these contributors are shaping the Code experience with creativity and collaboration.
                </p>
            </div>
            <div className="w-7xl m-auto px-4">
                {(isLoading || fakeLoading) && (
                    <div className="flex justify-center items-center py-10 min-h-56">
                        <Loader2 className="animate-spin text-yellow-400" size={32} />
                    </div>
                )}
                {error && (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-red-500 text-xl">Error loading users!</span>
                    </div>
                )}
                {!isLoading && !fakeLoading && !error && (
                    <Swiper
                        ref={swiperRef}
                        effect={'coverflow'}
                        slidesPerView={larger.lg ? 3 : smaller.lg && larger.md ? 2 : 1}
                        centeredSlides={true}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 100,
                            depth: 150,
                            modifier: 2,
                            slideShadows: false,
                        }}
                        modules={[Autoplay, EffectCoverflow]}
                        loop={true}
                        // loopAdditionalSlides={users.length}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        observer={true}
                        observeParents={true}
                        onSwiper={(swiper) => {
                            swiper.autoplay?.start();
                        }}
                    >
                        {users && users?.slice(0, 6)?.map((user, idx) => (
                            <SwiperSlide
                                key={idx}
                                style={{
                                    width: '373px',
                                    transition: 'transform 0.3s ease-in-out',
                                }}
                            >
                                <TopNetworkCard user={user} idx={idx} type={type} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default TopNetworkers;


// import { Swiper, SwiperSlide, type SwiperRef } from 'swiper/react'
// import { EffectCoverflow, Autoplay } from 'swiper/modules';
// import { useEffect, useRef, useState } from 'react';
// import TopNetworkCard from './TopNetworkCard';


// interface User {
//     id: number;
//     name: string;
//     profile_image: string;
//     number_of_post: number;
//     number_of_comments: number;
//     number_of_likes: number;
//     heading?: string;
//     description?: string;
// }

// const TopNetworkers = () => {

//     const [users, setUsers] = useState<User[]>([]);
//     const [type, setType] = useState<'weekly' | 'monthly'>('monthly');
//     const swiperRef = useRef<SwiperRef | null>(null);

//     const contributorText = {
//         like: {
//             heading: "Support Squad",
//             description: "Always hyping others with a like!",
//             image: "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/community/Contribution/like.png"
//         },
//         comment: {
//             heading: "Comment Champion",
//             description: "Always ready with insights or kind words",
//             image: "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/community/Contribution/comments.png"
//         },
//         post: {
//             heading: "Content Creator",
//             description: "Your ideas fuel the community",
//             image: "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/community/Contribution/creative-writing.png"
//         },
//         highestLikePostComment: {
//             heading: "Community Hero",
//             description: "You like, comment, and post—triple threat!",
//             image: "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/community/Contribution/superhero.png"
//         }
//     };

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await fetch(`https://elmscodeedu.edulystventures.com/api/v1/top-joy-posted?data_type=${type}`, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'nlms-api-key': '0612b32b39f4b29f48c5c5363028ee916bb99CodeEdu'
//                     }
//                 });
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data = await response.json();
//                 setUsers(data.data);

//                 type ContributorType = 'like' | 'comment' | 'post';
//                 setUsers(prevUsers =>
//                     prevUsers.map(user => {
//                         const { number_of_post, number_of_comments, number_of_likes } = user;

//                         const max = Math.max(number_of_post, number_of_comments, number_of_likes);

//                         const topCategories: ContributorType[] = [];

//                         if (number_of_post === max) topCategories.push('post');
//                         if (number_of_comments === max) topCategories.push('comment');
//                         if (number_of_likes === max) topCategories.push('like');

//                         const selected: ContributorType = topCategories[Math.floor(Math.random() * topCategories.length)];

//                         return {
//                             ...user,
//                             heading: contributorText[selected].heading,
//                             description: contributorText[selected].description,
//                             image: contributorText[selected].image
//                         };
//                     })
//                 );

//                 // Find the most contributor user that hight of likes + comments + posts
//                 const mostContributor = data.data.reduce((prev: User | null, current: User) => {
//                     const prevTotal = (prev?.number_of_likes || 0) + (prev?.number_of_comments || 0) + (prev?.number_of_post || 0);
//                     const currentTotal = current.number_of_likes + current.number_of_comments + current.number_of_post;
//                     return (currentTotal > prevTotal) ? current : prev;
//                 }, null);
//                 // set heading and description for the most contributor user in users state
//                 if (mostContributor) {
//                     setUsers(prevUsers =>
//                         prevUsers.map(user => {
//                             if (user.id === mostContributor.id) {
//                                 return {
//                                     ...user,
//                                     heading: contributorText.highestLikePostComment.heading,
//                                     description: contributorText.highestLikePostComment.description,
//                                     image: contributorText.highestLikePostComment.image
//                                 };
//                             }
//                             return user;
//                         })
//                     );
//                 }

//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             }
//         };
//         fetchUsers();
//     }, [type]);


//     // Ensure swiperRef is not null before calling methods
//     useEffect(() => {
//         swiperRef.current?.swiper?.autoplay?.start();
//     }, []);


//     return (
//         <section className="bg-no-repeat bg-cover bg-top w-full py-16" style={{
//             backgroundImage: "url('https://community.edulystventures.com/images/contributors.png')",
//         }}>
//             <div className="flex flex-col gap-3 text-center mb-10">
//                 <h1 className="text-white text-3xl font-bold">Top Networkers of the Week</h1>
//                 <p className="text-lg text-white font-normal">Meet the changemakers fueling our community — from project sharers to discussion drivers,<br /> these contributors are shaping the Code experience with creativity and collaboration.</p>
//                 {/* <h5 className="text-white text-xl capitalize font-bold">Weekly | Monthly</h5>  */}
//                 <h5>
//                     <span className={`text-xl capitalize ${type === 'weekly' ? 'font-bold text-yellow-400' : 'text-white'} cursor-pointer`} onClick={() => setType('weekly')}>Weekly</span><span className="text-white text-xl capitalize font-bold cursor-pointer">&nbsp;|</span>
//                     <span className={`text-xl capitalize ${type === 'monthly' ? 'font-bold text-yellow-400' : 'text-white '} cursor-pointer`} onClick={() => setType('monthly')}> Monthly</span>
//                 </h5>
//             </div>
//             <div className="w-7xl m-auto px-4">
//                 <Swiper
//                     ref={swiperRef}
//                     effect={'coverflow'}
//                     slidesPerView={3}
//                     centeredSlides={true}
//                     coverflowEffect={{
//                         rotate: 0,
//                         stretch: 100,
//                         depth: 150,
//                         modifier: 2,
//                         slideShadows: false,
//                     }}
//                     modules={[Autoplay, EffectCoverflow]}
//                     loop={true}
//                     loopAdditionalSlides={users.length}
//                     autoplay={{
//                         delay: 2000,
//                         disableOnInteraction: false,
//                         pauseOnMouseEnter: true,
//                     }}
//                     observer={true}
//                     observeParents={true}
//                     onSwiper={(swiper) => {
//                         swiper.autoplay?.start();
//                     }}
//                 >
//                     {users && users?.slice(0, 6)?.map((user, idx) => (
//                         <SwiperSlide
//                             key={idx}
//                             style={{
//                                 width: '373px',
//                                 transition: 'transform 0.3s ease-in-out',
//                             }}
//                         >
//                             <TopNetworkCard user={user} idx={idx} type={type} />
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             </div>
//         </section>
//     )
// }

// export default TopNetworkers