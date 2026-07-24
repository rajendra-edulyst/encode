import React, { useEffect, useState } from 'react'
import { fetchPosts } from '@/services/learner/SocialService'
import { useNewsStore } from '@/store/learner/socialStore'
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { PiEye, PiHeartFill } from 'react-icons/pi';
import { IoChatbubblesOutline, IoSearchOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';

function index() {

  const { setPosts, posts, error, setError, loading, setLoading } = useNewsStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchPosts('news')
      .then((response) => {
        setPosts(response);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setPosts, setError, setLoading]);

  const filteredBlogs = posts.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (loading && posts.length <= 0) return <Loading loading={loading} />
  if (error) return <Alert title={error} type="danger" />


  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full px-12 py-4 text-gray-900 placeholder-gray-500 bg-white border-none rounded-lg shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoSearchOutline className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, index) => (
            <div key={index} className="bg-white rounded-xl cursor-pointer shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <Link to={`/social/post/${blog.id}`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.thumbnail_url}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="text-gray-600 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                  >
                  </div>
                  <div className="flex items-center justify-start gap-4 text-sm text-gray-500">
                    <button
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200"
                      onClick={() => console.log('like')}
                    >
                      <PiHeartFill size={25} />
                      <span>{blog.like_count}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <IoChatbubblesOutline size={25} />
                      <span>{blog.comment_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <PiEye size={25} />
                      <span>{blog.view_count}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {posts.length <= 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No News found</h3>
            <p className="text-gray-600">
              {/* when blogs 0 */}
              No, news found. Please try again later.
            </p>
          </div>
        )}

        {
          posts.length !== 0 && filteredBlogs.length <= 0 && (
            <div className="text-center py-12">
              <BsSearch className="text-4xl text-gray-400 m-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No News found</h3>
              <p className="text-gray-600">
                No, news found. Please try again later with different search term.
              </p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default index