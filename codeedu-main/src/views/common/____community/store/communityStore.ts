import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CommunityCategory, Domain, Post, PostComment, Event, TrendingCommunity, PoppinTag, Poll, IndustryPost, CommunityMembers, OrgCommunities, SubDomain, RecCommunities } from '@community/types/community';
import { deleteCommunityPost, fetchCommunity, fetchCommunityById, fetchCommunityMembers, fetchDomains, fetchEvent, fetchIndustryLatestPosts, fetchPollPosts, fetchPopularOrgCommunity, fetchPostComments, fetchPostDetail, fetchPosts, fetchRecCommunity, fetchTrendingCommunity, likePost, popinTagPost, sendComment } from '../services/CommunityService';

type PostsState = {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchPosts: ({ my_post, is_pin }: { my_post?: number, is_pin?: number }) => Promise<void>;
  // selectedPost: Post | null;
  // setSelectedPost: (post: Post | null) => void;
  selectedPostComments: PostComment[] | null;
  setSelectedPostComments: (comments: PostComment[] | null) => void;
  fetchPostComments: (post_id: number) => Promise<void>;
  sendComment: (content: string, postId: number) => Promise<void>;
  likePost: (postId: number, type: string) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
}

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      posts: [],
      setPosts: (posts: Post[]) => set({ posts }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      // selectedPost: null,
      // setSelectedPost: (post: Post | null) => set({ selectedPost: post }),
      selectedPostComments: null,
      setSelectedPostComments: (comments: PostComment[] | null) => set({ selectedPostComments: comments }),
      // Fetch posts with optional count and from parameters
      fetchPosts: async ({ my_post, is_pin }) => {
        set({ loading: true });
        try {
          const response = await fetchPosts({ my_post, is_pin });
          set({ posts: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch posts', loading: false });
        }
      },
      fetchPostComments: async (post_id: number) => {
        const { setSelectedPostComments } = get();
        if (!post_id) return;
        try {
          const response = await fetchPostComments(post_id);
          console.log('Fetched comments:', response);
          setSelectedPostComments(response || []);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch post comments' });
        }
      },
      sendComment: async (content: string, postId: number) => {
        const { fetchPostComments } = get();
        if (!postId) return;
        try {
          if (!content.trim()) {
            set({ error: 'Comment content cannot be empty' });
            return;
          }
          await sendComment(postId, content);
          fetchPostComments(postId);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to send comment' });
        }
      },
      likePost: async (postId: number, type: string) => {
        const { posts } = get();
        try {
          await likePost(postId, 'like' === type ? 'like' : 'unlike');
          // Update the post's like status in the local state
          const updatedPosts = posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                user_liked: type === 'like' ? 1 : 0,
                like_count: type === 'like' ? (post.like_count || 0) + 1 : (post.like_count || 0) - 1,
              };
            }
            return post;
          });
          set({ posts: updatedPosts });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to like post' });
        }
      },
      deletePost: async (postId: number) => {
        if (!postId) {
          set({ error: 'Post ID is required to delete a post' });
          return;
        }
        try {
          await deleteCommunityPost(postId);
          const updatedPosts = get().posts.filter(post => post.id !== postId);
          set({ posts: updatedPosts });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete post' });
        }
      },
    }),
    {
      name: 'postsStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);


type PostDetailsState = {
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  post: Post | null;
  setPost: (post: Post | null) => void;
  comments: PostComment[] | null;
  setComments: (comments: PostComment[] | null) => void;
  fetchPostComments: () => Promise<void>;
  sendComment: (content: string) => Promise<void>;
  likePost: (type: string) => Promise<void>;
  deletePost: () => Promise<void>;
  fetchPost: (postId: string) => Promise<void>;
};

export const usePostDetailsStore = create<PostDetailsState>()(
  persist(
    (set, get) => ({
      setError: (error: string) => set({ error }),
      error: '',
      setLoading: (loading: boolean) => set({ loading }),
      loading: false,
      post: null,
      setPost: (post: Post | null) => set({ post }),
      comments: null,
      setComments: (comments: PostComment[] | null) => set({ comments }),
      fetchPostComments: async () => {
        const { post, setComments } = get();
        if (!post) return;
        try {
          const response = await fetchPostComments(post.id);
          console.log('Fetched comments:', response);
          setComments(response || []);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch post comments' });
        }
      },
      sendComment: async (content: string) => {
        const { post, fetchPostComments } = get();
        if (!post) return;
        try {
          if (!content.trim()) {
            set({ error: 'Comment content cannot be empty' });
            return;
          }
          await sendComment(post.id, content);
          fetchPostComments();
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to send comment' });
        }
      },
      likePost: async (type: string) => {
        const { post, setPost } = get();
        if (!post) return;
        try {
          await likePost(post.id, type);
          setPost({
            ...post,
            user_liked: type === 'like' ? 1 : 0,
            like_count: type === 'like' ? (post.like_count || 0) + 1 : (post.like_count || 0) - 1,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to like post' });
        }
      },
      deletePost: async () => {
        const { post, setPost } = get();
        if (!post || !post.id) return;
        try {
          await deleteCommunityPost(post.id);
          setPost(null); // Clear the post after deletion
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete post' });
        }
      },
      fetchPost: async (postId: string) => {
        const { setPost, setError, setLoading, setComments, fetchPostComments } = get();
        setLoading(true);
        try {
          const response = await fetchPostDetail(postId);
          setPost(response || null);
          setComments(null);
          fetchPostComments();
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch post');
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: 'postDetailsStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);

type CommunityState = {
  communities: CommunityCategory[];
  setCommunities: (communities: CommunityCategory[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  members: CommunityMembers | null;
  setMembers: (members: CommunityMembers | null) => void;
  fetchCommunities: (my_community?: number) => Promise<void>;
  // Additional methods
  communityDetails: CommunityCategory | null;
  communityPosts: Post[] | null;
  setCommunityDetails: (community: CommunityCategory | null) => void;
  setCommunityPosts: (posts: Post[] | null) => void;
  fetchCommunityDetails: (communityId: string) => Promise<void>;
  fetchCommunityMembers: (communityId: string) => Promise<void>;
  // like post
  likePost: (postId: number, type: string) => Promise<void>;
};

export const useCommunitiesStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      communities: [],
      setCommunities: (communities: CommunityCategory[]) => set({ communities }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      members: null,
      setMembers: (members: CommunityMembers | null) => set({ members }),
      fetchCommunities: async (my_community?: number) => {
        set({ loading: true });
        try {
          const response = await fetchCommunity({ my_community: my_community || 0 });
          set({ communities: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch communities', loading: false });
        }
      },
      // Community details
      communityDetails: null,
      setCommunityDetails: (community: CommunityCategory | null) => set({ communityDetails: community }),
      // Community posts
      communityPosts: null,
      setCommunityPosts: (posts: Post[] | null) => set({ communityPosts: posts }),
      // Fetch posts for the selected community
      fetchCommunityDetails: async (communityId: string) => {
        const { setError, setLoading, setCommunityPosts, setCommunityDetails } = get();
        if (!communityId) {
          setError('No community selected to fetch posts');
          return;
        }
        setLoading(true);
        try {
          const response = await fetchCommunityById(communityId);
          setCommunityPosts(response.list || []);
          setCommunityDetails(response.category || null);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch community posts');
        }
        finally {
          setLoading(false);
        }
      },
      likePost: async (postId: number, type: string) => {
        const { communityPosts } = get();
        if (!communityPosts) return;
        try {
          await likePost(postId, type);
          // Update the post's like status in the local state
          const updatedPosts = communityPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                user_liked: type === 'like' ? 1 : 0,
                like_count: type === 'like' ? (post.like_count || 0) + 1 : (post.like_count || 0) - 1,
              };
            }
            return post;
          });
          set({ communityPosts: updatedPosts });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to like post' });
        }
      },
      fetchCommunityMembers: async (communityId: string) => {
        const { setMembers, setError, setLoading } = get();
        if (!communityId) {
          setError('No community ID provided to fetch members');
          return;
        }
        setLoading(true);
        try {
          const response = await fetchCommunityMembers(communityId);
          setMembers(response?.data || null);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch community members');
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: 'communityStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);


type MyPostsState = {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchPosts: (count?: number, from?: number, user_id?: number) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
  likePost: (postId: number, type: string) => Promise<void>;
}

export const useMyPostsStore = create<MyPostsState>()(
  persist(
    (set, get) => ({
      posts: [],
      setPosts: (posts: Post[]) => set({ posts }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      fetchPosts: async () => {
        set({ loading: true });
        try {
          const response = await fetchPosts({ my_post: 1 });
          set({ posts: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch posts', loading: false });
        }
      },
      deletePost: async (postId: number) => {
        if (!postId) {
          set({ error: 'Post ID is required to delete a post' });
          return;
        }
        try {
          await deleteCommunityPost(postId);
          const updatedPosts = get().posts.filter(post => post.id !== postId);
          set({ posts: updatedPosts });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete post' });
        }
      },
      likePost: async (postId: number, type: string) => {
        const { posts } = get();
        try {
          await likePost(postId, type);
          const updatedPosts = posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                user_liked: type === 'like' ? 1 : 0,
                like_count: type === 'like' ? (post.like_count || 0) + 1 : (post.like_count || 0) - 1,
              };
            }
            return post;
          });
          set({ posts: updatedPosts });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to like post' });
        }
      },
    }),
    {
      name: 'myPostsStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);


// pined posts store
type PinedPostsState = {
  pinedPosts: Post[];
  setPinedPosts: (pinedPosts: Post[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchPinedPosts: () => Promise<void>;
}

export const usePinedPostsStore = create<PinedPostsState>()(
  persist(
    (set) => ({
      pinedPosts: [],
      setPinedPosts: (pinedPosts: Post[]) => set({ pinedPosts }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      fetchPinedPosts: async () => {
        set({ loading: true, error: '' });
        try {
          const response = await fetchPosts({ is_pin: 1 });
          set({ pinedPosts: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch pined posts' });
        }
        finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'pinedPostsStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);

// domains store
type DomainState = {
  domains: Domain[];
  subdomains: SubDomain[];
  setDomains: (domains: Domain[]) => void;
  setSubDomains: (subdomains: SubDomain[]) =>void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchDomains: () => Promise<void>;
}

export const useDomainsStore = create<DomainState>()(
  persist(
    (set) => ({
      domains: [],
      subdomains: [],
      setDomains: (domains: Domain[]) => set({ domains }),
      setSubDomains:(subdomains: SubDomain[]) =>set({subdomains}),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      fetchDomains: async () => {
        set({ loading: true, error: '' });
        try {
          const response = await fetchDomains();
          set({ domains: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch domains' });
        }
        finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'domainsStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);


// event store
type EventState = {
  events: Event[];
  setEvents: (events: Event[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchEvents: () => Promise<void>;
}

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      events: [],
      setEvents: (events: Event[]) => set({ events }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      fetchEvents: async () => {
        set({ loading: true, error: '' });
        try {
          const response = await fetchEvent();
          set({ events: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch events' });
        }
        finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'eventStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);

// trending community store
type TrendingCommunityState = {
  trendingCommunities: TrendingCommunity[];
  setTrendingCommunities: (trendingCommunities: TrendingCommunity[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchTrendingCommunities: () => Promise<void>;
}

export const useTrendingCommunityStore = create<TrendingCommunityState>()(
  persist(
    (set) => ({
      trendingCommunities: [],
      setTrendingCommunities: (trendingCommunities: TrendingCommunity[]) => set({ trendingCommunities }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      fetchTrendingCommunities: async () => {
        set({ loading: true, error: '' });
        try {
          const response = await fetchTrendingCommunity();
          set({ trendingCommunities: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch trending communities' });
        }
        finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'trandingCommunityStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);

// popinTagPost
type PopinTagPostState = {
  poppinTags: PoppinTag[];
  setPoppinTags: (poppinTags: PoppinTag[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchPoppinTags: () => Promise<void>;
}

export const usePopinTagPostStore = create<PopinTagPostState>()(
  persist(
    (set) => ({
      poppinTags: [],
      setPoppinTags: (poppinTags: PoppinTag[]) => set({ poppinTags }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      fetchPoppinTags: async () => {
        set({ loading: true, error: '' });
        try {
          const response = await popinTagPost();
          set({ poppinTags: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch poppin tags' });
        }
        finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'popinTagPostStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);

// tag posts store
type TagPostsState = {
  tagPosts: Post[];
  setTagPosts: (tagPosts: Post[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchTagPosts: (tagName: string) => Promise<void>;
}

export const useTagPostsStore = create<TagPostsState>()(
  persist(
    (set) => ({
      tagPosts: [],
      setTagPosts: (tagPosts: Post[]) => set({ tagPosts }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      fetchTagPosts: async (tagName: string) => {
        if (!tagName) {
          set({ error: 'Tag name is required to fetch posts', loading: false });
          return;
        }
        set({ loading: true, error: '' });
        try {
          const response = await fetchPosts({ tags: tagName });
          set({ tagPosts: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch tag posts' });
        }
        finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'tagPostsStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);


// opinion poll store
type OpinionPollState = {
  opinionPolls: Poll[];
  setOpinionPolls: (opinionPolls: Poll[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchOpinionPolls: () => Promise<void>;
}

export const useOpinionPollStore = create<OpinionPollState>()(
  persist(
    (set) => ({
      opinionPolls: [],
      setOpinionPolls: (opinionPolls: Poll[]) => set({ opinionPolls }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      fetchOpinionPolls: async () => {
        set({ loading: true, error: '' });
        try {
          const response = await fetchPollPosts();
          set({ opinionPolls: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch opinion polls' });
        }
        finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'opinionPollStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);


// fetchIndustryLatestPosts
type IndustryPostsState = {
  industryPosts: IndustryPost[];
  setIndustryPosts: (industryPosts: IndustryPost[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchIndustryLatestPosts: () => Promise<void>;
}

export const useIndustryPostsStore = create<IndustryPostsState>()(
  persist(
    (set) => ({
      industryPosts: [],
      setIndustryPosts: (industryPosts: IndustryPost[]) => set({ industryPosts }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      fetchIndustryLatestPosts: async () => {
        set({ loading: true, error: '' });
        try {
          const response = await fetchIndustryLatestPosts();
          set({ industryPosts: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch industry posts' });
        }
        finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'industryPostsStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);


// org popular community store
type OrgPopularCommunityState = {
  popularCommunities: OrgCommunities[];
  RecommandedCommunities: RecCommunities[];
  setPopularCommunities: (popularCommunities: OrgCommunities[]) => void;
  setRecommandedCommunities: (RecommandedCommunities: RecCommunities[]) =>void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchPopularCommunities: (self_joined?: number) => Promise<void>;
  fetchRecommandedCommunities: () => Promise<void>;
}

export const useOrgPopularCommunityStore = create<OrgPopularCommunityState>()(
  persist(
    (set) => ({
      popularCommunities: [],
      RecommandedCommunities:[],
      setPopularCommunities: (popularCommunities: OrgCommunities[]) => set({ popularCommunities }),
      setRecommandedCommunities:(RecommandedCommunities:RecCommunities[]) =>set({RecommandedCommunities}),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      fetchPopularCommunities: async (self_joined?: number) => {
        set({ loading: true, error: '' });
        try {
          const response = await fetchPopularOrgCommunity(self_joined ? 1 : 0);
          set({ popularCommunities: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch popular communities' });
        }
        finally {
          set({ loading: false });
        }
      },
      fetchRecommandedCommunities: async () => {
        set({ loading: true, error: '' });
        try {
          const response = await fetchRecCommunity();
          set({ RecommandedCommunities: response || [], loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch Recommanded communities' });
        }
        finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'orgPopularCommunityStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
)
// analytics store

// type AnalyticsState = {
//   analytics: UserCommunityAnalytics;
//   setAnalytics: (analytics: UserCommunityAnalytics) => void;
//   error: string;
//   setError: (error: string) => void;
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
//   fetchAnalytics: (type: 'weekly' | 'monthly') => Promise<void>;
// }

// export const useAnalyticsStore = create<AnalyticsState>()(
//   persist(
//     (set) => ({
//       analytics: {} as UserCommunityAnalytics,
//       setAnalytics: (analytics: UserCommunityAnalytics) => set({ analytics }),
//       error: '',
//       setError: (error: string) => set({ error }),
//       loading: false,
//       setLoading: (loading: boolean) => set({ loading }),
//       fetchAnalytics: async (type: 'weekly' | 'monthly') => {
//         set({ loading: true, error: '' });
//         try {
//           const response = await fetchUserCommunityAnalytics(type);
//           set({ analytics: response || {}, loading: false });
//         } catch (error) {
//           set({ error: error instanceof Error ? error.message : 'Failed to fetch analytics' });
//         }
//         finally {
//           set({ loading: false });
//         }
//       },
//     }),
//     {
//       name: 'analyticsStore',
//       storage: {
//         getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
//         setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
//         removeItem: (key) => localStorage.removeItem(key),
//       },
//     }
//   )
// );

// interface Pagination {
//   total: number;
//   per_page: number;
//   last_page: number;
//   current_page: number;
//   next_page_url: string | null;
//   prev_page_url: string | null;
// }

// type CommunityState = {
//   community: CommunityCategory[];
//   setCommunity: (community: CommunityCategory[]) => void;
//   error: string;
//   setError: (error: string) => void;
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
// };

// export const useCommunityStore = create<CommunityState>()(
//   persist(
//     (set) => ({
//       community: [],
//       setCommunity: (community: CommunityCategory[]) => set({ community }),
//       error: '',
//       setError: (error: string) => set({ error }),
//       loading: false,
//       setLoading: (loading: boolean) => set({ loading }),
//     }),
//     {
//       name: 'communityStore',
//       storage: {
//         getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
//         setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
//         removeItem: (key) => localStorage.removeItem(key),
//       },
//     }
//   )
// );

// // community details store

// type CommunityDetailsState = {
//   community: CommunityCategory;
//   pagination: Pagination;
//   setPagination: (pagination: Pagination) => void;
//   setCommunity: (community: CommunityCategory) => void;
//   communityContent: Post[];
//   setCommunityContent: (communityContent: Post[]) => void;
//   error: string;
//   setError: (error: string) => void;
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
// };

// export const useCommunityDetailsStore = create<CommunityDetailsState>()(
//   persist(
//     (set) => ({
//       community: {} as CommunityCategory,
//       pagination: {} as Pagination,
//       setPagination: (pagination: Pagination) => set({ pagination }),
//       setCommunity: (community: CommunityCategory) => set({ community }),
//       communityContent: [],
//       setCommunityContent: (communityContent: Post[]) => set({ communityContent }),
//       error: '',
//       setError: (error: string) => set({ error }),
//       loading: false,
//       setLoading: (loading: boolean) => set({ loading }),
//     }),
//     {
//       name: 'communityDetailsStore',
//       storage: {
//         getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
//         setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
//         removeItem: (key) => localStorage.removeItem(key),
//       },
//     }
//   )
// );

// // my posts store

// type CommunityMyPostsState = {
//   community: CommunityCategory;
//   pagination: Pagination;
//   setPagination: (pagination: Pagination) => void;
//   setCommunity: (community: CommunityCategory) => void;
//   communityContent: Post[];
//   setCommunityContent: (communityContent: Post[]) => void;
//   error: string;
//   setError: (error: string) => void;
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
// };

// export const useCommunityMyPostsStore = create<CommunityMyPostsState>()(
//   persist(
//     (set) => ({
//       community: {} as CommunityCategory,
//       pagination: {} as Pagination,
//       setPagination: (pagination: Pagination) => set({ pagination }),
//       setCommunity: (community: CommunityCategory) => set({ community }),
//       communityContent: [],
//       setCommunityContent: (communityContent: Post[]) => set({ communityContent }),
//       error: '',
//       setError: (error: string) => set({ error }),
//       loading: false,
//       setLoading: (loading: boolean) => set({ loading }),
//     }),
//     {
//       name: 'communityMyPostsStore',
//       storage: {
//         getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
//         setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
//         removeItem: (key) => localStorage.removeItem(key),
//       },
//     }
//   )
// );

// // community post comment store
// type CommunityPostCommentState = {
//   postId: string;
//   setPostId: (postId: string) => void;
//   comments: Post[];
//   setComments: (comments: Post[]) => void;
//   error: string;
//   setError: (error: string) => void;
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
// };

// export const useCommunityPostCommentStore = create<CommunityPostCommentState>()(
//   persist(
//     (set) => ({
//       postId: '',
//       setPostId: (postId: string) => set({ postId }),
//       comments: [],
//       setComments: (comments: Post[]) => set({ comments }),
//       error: '',
//       setError: (error: string) => set({ error }),
//       loading: false,
//       setLoading: (loading: boolean) => set({ loading }),
//     }),
//     {
//       name: 'communityPostCommentStore',
//       storage: {
//         getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
//         setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
//         removeItem: (key) => localStorage.removeItem(key),
//       },
//     }
//   )
// );


// // announcement store
// type AnnouncementDetailsState = {
//   community: CommunityCategory;
//   setCommunity: (community: CommunityCategory) => void;
//   communityContent: Post[];
//   setCommunityContent: (communityContent: Post[]) => void;
//   error: string;
//   setError: (error: string) => void;
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
// };


// export const useAnnouncementStore = create<AnnouncementDetailsState>()(
//   persist(
//     (set) => ({
//       community: {} as CommunityCategory,
//       setCommunity: (community: CommunityCategory) => set({ community }),
//       communityContent: [],
//       setCommunityContent: (communityContent: Post[]) => set({ communityContent }),
//       error: '',
//       setError: (error: string) => set({ error }),
//       loading: false,
//       setLoading: (loading: boolean) => set({ loading }),
//     }),
//     {
//       name: 'announcementStore',
//       storage: {
//         getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
//         setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
//         removeItem: (key) => localStorage.removeItem(key),
//       },
//     }
//   )
// );