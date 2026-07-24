import React, { useState, useEffect } from 'react';
import { fetchPostDetail } from '@/services/learner/SocialService';
import { usePostDetailStore } from '@/store/learner/socialStore';
import { useParams } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { BsHeart } from 'react-icons/bs';
import SEO from '@/components/SEO/SEO';

const Show: React.FC = () => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(1234);
  const [showCopyTooltip, setShowCopyTooltip] = useState<boolean>(false);

  const { post, setPost, loading, setLoading, error, setError } = usePostDetailStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    setLoading(true);
    setError('');

    if (!id) {
      setError('Post not found');
      setLoading(false);
      return;
    }

    fetchPostDetail(id).then((data) => {
      setPost(data);
    }).catch((error) => {
      setError(error);
    }).finally(() => {
      setLoading(false);
    });
  }, [setLoading, setPost, setError, id]);

  if (loading) return <Loading loading={loading} />
  if (error) return <Alert title={error} type="danger" />

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || '');
    const description = encodeURIComponent(post?.description?.replace(/<[^>]*>/g, '').substring(0, 200) || '');
    const image = encodeURIComponent(post?.resource_path || '');

    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}&picture=${image}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(window.location.href);
        setShowCopyTooltip(true);
        setTimeout(() => setShowCopyTooltip(false), 2000);
        break;
    }
  };

  const cleanDescription = post?.description?.replace(/<[^>]*>/g, '').substring(0, 160) || '';

  return (
    <div className="min-h-screen bg-white dark:bg-black rounded">
      <SEO
        title={`${post?.title} | enCODE`}
        description={cleanDescription}
        image={post?.resource_path || undefined}
        type="article"
      />

      <main className="mx-auto px-4 py-8 md:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-white">
            {post?.title}
          </h1>
        </header>

        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={post?.resource_path}
            alt="Blog featured image"
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="flex items-center space-x-6 mb-8 py-4 border-y border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              className="flex items-center space-x-2 transition-transform hover:scale-105"
              onClick={handleLike}
            >
              <BsHeart className={`fas fa-heart ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-white'}`} />
              <span className="text-gray-600 dark:text-white">{likeCount.toLocaleString()}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-comment text-gray-600 dark:text-white"></i>
            <span className="text-gray-600 dark:text-white">{post?.comment_count}</span>
          </div>
        </div>

        <article className="prose max-w-none mb-12">
          <div className="text-gray-800 leading-relaxed whitespace-pre-line dark:text-white prose-strong:dark:text-white prose-strong:dark:font-extrabold"
            dangerouslySetInnerHTML={{ __html: post?.description ?? '' }}
          >
          </div>
        </article>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Share this article</h3>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded flex items-center px-4 py-2 bg-[#0077B5] text-white hover:opacity-90 whitespace-nowrap"
              onClick={() => handleShare('linkedin')}
            >
              <i className="fab fa-linkedin mr-2"></i>
              LinkedIn
            </button>
            <button
              className="rounded flex items-center px-4 py-2 bg-[#3b5998] text-white hover:opacity-90 whitespace-nowrap"
              onClick={() => handleShare('facebook')}
            >
              <i className="fab fa-facebook mr-2"></i>
              Facebook
            </button>
            <button
              className="rounded flex items-center px-4 py-2 bg-[#1DA1F2] text-white hover:opacity-90 whitespace-nowrap"
              onClick={() => handleShare('twitter')}
            >
              <i className="fab fa-twitter mr-2"></i>
              Twitter
            </button>
            <div className="relative">
              <button
                className="rounded flex items-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 whitespace-nowrap"
                onClick={() => handleShare('copy')}
              >
                <i className="fas fa-link mr-2"></i>
                Copy Link
              </button>
              {showCopyTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded">
                  Copied!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Show;