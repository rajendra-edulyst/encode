import { Advertisement, AdvertisementResponse } from '@/@types/learner/advtisements';
import ApiService from '@/services/ApiService'
import { CommunitiesPostsApiResponse, CommunityCategory, CommunityCategoryApiResponse, CommunityDetailsList, Domain, DomainApiResponse, EventApiResponse, Event, Post, PostComment, PostCommentsApiResponse, PostDetailApiResponse, TrendingCommunity, TrendingCommunityApiResponse, PoppinTagApiResponse, PoppinTag, PollApiResponse, Poll, IndustryPostApiResponse, IndustryPost, CommunityMembersApiResponse, OrgCommunityApiResponse, OrgCommunities, UserCommunityAnalyticsApiResponse, UserCommunityAnalytics, SubDomain, SubDomainApiResponse, RecCommunities, RecCommunityApiResponse, Industry, IndustryApiResponse } from '../types/community';

export async function fetchPosts(params?: URLSearchParams): Promise<Post[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunitiesPostsApiResponse>({
            url: '/get-post',
            method: 'post',
            params: params
        })
        return response?.data?.post ?? [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchPollPosts(): Promise<Poll[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<PollApiResponse>({
            url: '/get-post',
            method: 'post',
            params: {
                content_type: 12, // Assuming 12 is the type for poll posts
            }
        })
        return response?.data?.post ?? [];
    } catch (error) {
        throw error as string;
    }
}


export async function fetchAdvertisements(): Promise<Advertisement[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AdvertisementResponse>({
            url: '/v1/get-infocus-promotions?type=advertisement',
            method: 'get',

        })
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}


export async function fetchMyPosts(): Promise<Post[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunitiesPostsApiResponse>({
            url: '/get-post',
            method: 'post',
        })
        return response?.data?.post ?? [];
    } catch (error) {
        throw error as string;
    }
}

interface CommunityApiProps {
    my_community: number;
}

export async function fetchCommunity(props: CommunityApiProps = { my_community: 0 }): Promise<CommunityCategory[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityCategoryApiResponse>({
            url: '/user-joy-category',
            method: 'post',
            params: props
        })
        return response?.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchCommunityDetails(id: string): Promise<CommunityCategory> {
    try {
        const response = await ApiService.fetchDataWithAxios<{
            status: string;
            data: CommunityCategory;
            error: string;
        }>({
            url: `/v1/org-popular-community-by-id`,
            method: 'get',
            params: {
                category_id: id
            }
        });
        return response?.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchCommunityById(id: string): Promise<CommunityDetailsList> {
    try {
        const response = await ApiService.fetchDataWithAxios<{
            status: string;
            data: CommunityCategory;
            error: string;
        }>({
            url: `/v1/org-popular-community-by-id?category_id=${id}`,
            method: 'get',
        });
        return {
            list: [],
            category: response?.data
        }
    } catch (error) {
        throw error as string;
    }
}

export async function fetchPostComments(postId: number | string): Promise<PostComment[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<PostCommentsApiResponse>({
            url: `/get-comments-list/${postId}`,
            method: 'get',
        })
        return response?.data?.list ?? [];
    }
    catch (error) {
        throw new Error(`Failed to fetch comments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function sendComment(postId: number, content: string): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: '/user-comment-tracking',
            method: 'post',
            data: {
                post_id: postId.toString(),
                content: content
            }
        });
    } catch (error) {
        throw new Error(`Failed to send comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function likePost(postId: number, type: string): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/user-view-tracking`,
            method: 'post',
            data: {
                type: 'contents',
                content_id: postId.toString(),
                like: type === 'like' ? '1' : '0'
            }
        });
    } catch (error) {
        throw new Error(`Failed to like post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}


export async function deleteCommunityPost(id: number): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<{
            status: number;
            message: string;
            data: string;
        }>({
            url: `/joy/content/delete/${id}`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}


export async function fetchPostDetail(id: string): Promise<Post> {
    try {
        const response = await ApiService.fetchDataWithAxios<PostDetailApiResponse>({
            url: `/joy/contents/${id}`,
            method: 'get',
        })
        return response?.data?.list[0] || null;
    } catch (error) {
        throw error as string;
    }
}

export async function addCommunityPost(data: FormData): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/create-post`,
            method: 'post',
            data: data
        });
    } catch (error) {
        throw new Error(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function fetchIndustry(): Promise<Industry[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<IndustryApiResponse>({
            url: '/university-list',
            method: 'get',
        })
        console.log("Industry response:", response);
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}

export async function updateCommunityPost(postId: string, data: FormData): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/update-post/${postId}`,
            method: 'post',
            data: data,
        });
    } catch (error) {
        console.error('Update error:', error);
        throw new Error(`Failed to update post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}



// posts

export async function fetchPinedPosts(): Promise<Post[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunitiesPostsApiResponse>({
            url: '/get-post',
            method: 'post',
            params: {
                is_pin: 1,
            }
        })
        return response?.data?.post ?? [];
    } catch (error) {
        throw error as string;
    }
}

// domains
export async function fetchDomains(): Promise<Domain[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<DomainApiResponse>({
            url: '/get-industry-domain',
            method: 'get',
            params: {
                type: 'domain'
            }
        })
        return response?.data?.list ?? [];
    } catch (error) {
        throw error as string;
    }
}

//subdomains
export async function fetchSubDomains(domain_id: string): Promise<SubDomain[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<SubDomainApiResponse>({
            url: `/get-sub-domain`,
            method: 'get',
            params: {
                domain_id: domain_id
            }
        })
        return response?.data.list ?? [];
    } catch (error) {
        throw error as string;
    }
}

// events
export async function fetchEvent(ongoing_date?: string | null, is_assigned?: number): Promise<Event[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventApiResponse>({
            url: '/competition-list' + (ongoing_date ? `?ongoing_date=${ongoing_date}` : '') + (is_assigned ? `&is_assigned=${is_assigned}` : ''),
            method: 'get',
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchBannerEvent(): Promise<EventApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventApiResponse>({
            url: '/competition-list?is_popular=1&type=event',
            method: 'get',
        })
        return response;
    } catch (error) {
        throw error as string;
    }
}


// fetch trending community posts
export async function fetchTrendingCommunity(): Promise<TrendingCommunity[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<TrendingCommunityApiResponse>({
            url: `/user-joy-category?sort_by=member`,
            method: 'post',
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// repost - v1/joy-content-repost
export async function repostPost(data: { joy_content_id: number; description: string; category_id: string; }): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: '/v1/joy-content-repost',
            method: 'post',
            data: data,
        })

    } catch (error) {
        throw error as string;
    }
}

// update repost 
export async function updateRepostPost(id: number, data: { description: string; category_id: string; status: string }): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/v1/repost-update/${id}`,
            method: 'post',
            data: data,
        });
    } catch (error) {
        throw error as string;
    }
}


// poppins v1/popin-tag-post
export async function popinTagPost(): Promise<PoppinTag[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<PoppinTagApiResponse>({
            url: '/v1/popin-tag-post',
            method: 'get',
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// v1/industry-latest-post
export async function fetchIndustryLatestPosts(): Promise<IndustryPost[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<IndustryPostApiResponse>({
            url: '/v1/industry-latest-post',
            method: 'get',
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// community members - community-peoples
export async function fetchCommunityMembers(id: string): Promise<CommunityMembersApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityMembersApiResponse>({
            url: `/v1/community-peoples/${id}`,
            method: 'get',
        })
        return response;
    } catch (error) {
        throw error as string;
    }
}

// create community
export async function createCommunity(data: FormData, community_id?: string): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: `/joy/category${community_id ? `/${community_id}` : ''}`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data: data as FormData,
        })
        return response
    } catch (error) {
        throw error as string;
    }
}

export async function deleteCommunity(id: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios<void>({
            url: `/joy/category/delete/${id}`,
            method: 'get',
        })
    } catch (error) {
        throw error as string;
    }
}

// org-popular-community 
export async function fetchPopularOrgCommunity(self_joined?: number): Promise<OrgCommunities[]> {
    try {

        const params = new URLSearchParams();
        if (self_joined !== undefined) {
            params.append('self_joined', self_joined.toString());
        }

        const response = await ApiService.fetchDataWithAxios<OrgCommunityApiResponse>({
            url: `/v1/org-popular-community`,
            method: 'get',
            params: params
        });
        return response?.data
    } catch (error) {
        throw error as string;
    }
}

// recommanded communities

export async function fetchRecCommunity(): Promise<RecCommunities[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<RecCommunityApiResponse>({
            url: `/v1/get-recommended-community`,
            method: 'get',
        });
        return response?.data
    } catch (error) {
        throw error as string;
    }
}

// get cities
export async function fetchCities(search: string): Promise<string[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<{ data: string[] }>({
            url: '/getCities',
            method: 'get',
            params: {
                search: search
            }
        });
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}


// analytics
export async function fetchUserCommunityAnalytics(type: 'weekly' | 'monthly'): Promise<UserCommunityAnalytics> {
    try {
        const response = await ApiService.fetchDataWithAxios<UserCommunityAnalyticsApiResponse>({
            url: '/v1/user-community-analytics',
            method: 'get',
            params: { data_type: type }
        });
        return response?.data;
    } catch (error) {
        throw error as string;
    }
}

// join community
export async function joinCommunity(id: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios<void>({
            url: `/courses/user-mapping?category_ids=${id}`,
            method: 'get',
        });
    } catch (error) {
        throw error as string;
    }
}

// leave community
export async function leaveCommunity(id: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios<void>({
            url: `/user-joy-category-unmap/${id}`,
            method: 'post',
        });
    } catch (error) {
        throw error as string;
    }
}

// v1/user-community-report
export async function reportCommunity(communityId: number, reason: string): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios<void>({
            url: '/v1/user-community-report',
            method: 'post',
            data: {
                "joy_category_id": communityId,
                'comments': reason,
            }
        });
    } catch (error) {
        throw error as string;
    }
}

// mute community
export async function muteCommunity(communityId: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios<void>({
            url: `/v1/user-community-mute`,
            method: 'post',
            data: {
                joy_category_id: communityId,
            }
        });
    } catch (error) {
        throw error as string;
    }
}

// curl --location 'http://lo2-lms.localhost/api/joy/category/123' \
// --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG8yLWxtcy5sb2NhbGhvc3QvYXBpL2xvZ2luIiwiaWF0IjoxNzUxODY3NTc5LCJleHAiOjE3NTU0Njc1NzksIm5iZiI6MTc1MTg2NzU3OSwianRpIjoiSzZ0NkZKRVlkd3RlSGhsaCIsInN1YiI6MjI3MzIsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.2bUZ4mYPCuEkJGfrYyag5HnmztG7TmHdD5nFsrXurcA' \
// --header 'nlms-api-key: 0612b32b39f4b29f48c5c5363028ee916bb99Mec' \
// --form 'file=@"postman-cloud:///1efc1059-a3d2-4370-aba6-28e551b1d19a"' \
// --form 'title="Updated Category Title"' \
// --form 'status="Active"' \
// --form 'description="This is the updated description"' \
// --form 'type="public"' \
// --form 'domain_id="2"' \
// --form 'location="Mumbai"'



// export async function fetchCommunity(): Promise<CommunityCategory[]> {
//     try {
//         const response = await ApiService.fetchDataWithAxios<CommunityCategoryApiResponse>({
//             url: '/user-joy-category',
//             method: 'post',
//         })
//         return response?.data
//     } catch (error) {
//         throw error as string;
//     }
// }

// export async function fetchCommunityById(id: string): Promise<CommunityDetailsList> {
//     try {
//         const response = await ApiService.fetchDataWithAxios<CommunityDetailsApiResponse>({
//             url: `/joy/content?category_id=${id}`,
//             method: 'get',
//         })
//         return response?.data
//     } catch (error) {
//         throw error as string;
//     }
// }

// export async function fetchCommunityPosts(id: string): Promise<CommunityPostsApiResponse> {
//     try {
//         const response = await ApiService.fetchDataWithAxios<CommunityPostsApiResponse>({
//             url: `/v1/communities/${id}/posts`,
//             method: 'get',
//         })
//         return response
//     } catch (error) {
//         throw error as string;
//     }
// }

// export async function fetchCommunityMyPosts(id: string): Promise<CommunityPostsApiResponse> {
//     try {
//         const response = await ApiService.fetchDataWithAxios<CommunityPostsApiResponse>({
//             url: `/v1/communities/${id}/posts/my-posts`,
//             method: 'get',
//         })
//         return response
//     } catch (error) {
//         throw error as string;
//     }
// }


// export async function fetchCommunityTrending(id: string): Promise<CommunityPostsApiResponse> {
//     try {
//         const response = await ApiService.fetchDataWithAxios<CommunityPostsApiResponse>({
//             url: `/v1/communities/${id}/posts/trending`,
//             method: 'get',
//         })
//         return response
//     } catch (error) {
//         throw error as string;
//     }
// }


// export async function fetchAnnouncement(id: string): Promise<CommunityDetailsList> {
//     try {
//         const response = await ApiService.fetchDataWithAxios<CommunityDetailsApiResponse>({
//             url: `/joy/content?category_id=${id}&content_type=8`,
//             method: 'get',
//         })
//         return response?.data
//     } catch (error) {
//         throw error as string;
//     }
// }


// export async function deleteCommunityPost(id: number): Promise<string> {
//     try {
//         const response = await ApiService.fetchDataWithAxios<{
//             status: number;
//             message: string;
//             data: string;
//         }>({
//             url: `/joy/content/delete/${id}`,
//             method: 'get',
//         })
//         return response.data
//     } catch (error) {
//         throw error as string;
//     }
// }

// export async function editCommunityPost(id: number, data: {
//     title: string;
//     description: string;
// }): Promise<string> {
//     try {
//         const response = await ApiService.fetchDataWithAxios<{
//             message: string;
//             data: string;
//         }>({
//             url: `/joy/content/${id}`,
//             method: 'post',
//             data: data,
//         })
//         return response.data
//     } catch (error) {
//         throw error as string;
//     }
// }

// get community post comments by post id