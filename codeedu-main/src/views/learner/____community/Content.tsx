import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPostDetail, Post, getCommentsList, sendComment } from "@/services/learner/SocialService";
import { Alert, Button } from "@/components/ui";
import { BsArrowDown } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { useAuth } from "@/auth";

import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton } from "react-share";
import { Link } from "lucide-react";

export default function Content() {
    const { id } = useParams(); // Get ID from URL

    const { user } = useAuth();

    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showResources, setShowResources] = useState(false);
    const [showResourceIndex, setShowResourceIndex] = useState(0);
    const [comment, setComment] = useState("");
    const [showCopyTooltip, setShowCopyTooltip] = useState<boolean>(false);

    // Store comments dynamically
    const [comments, setComments] = useState<
        {
            id: number;
            content: string;
            date: string;
            name: string;
            profile_image: string;
        }[]
    >([]);
    const fetchComments = async () => {
        const response = await getCommentsList(Number(id));
        setComments(response);
        localStorage.setItem(`comments_${id}`, JSON.stringify(response));
    };

    const handleSubmitComment = async () => {
        if (!comment.trim()) return;
        try {
            await sendComment(id, comment);
            setComment('');
            fetchComments(); // Refresh the comments

        } catch (error) {
            console.error("Failed to send comment:", error);
        }
    };


    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response: Post = await fetchPostDetail(id);

                if (response) {
                    const post: Post = response; // Extract the first post
                    setContent(post);
                } else {
                    console.warn("No content found for ID:", id);
                    setContent(null);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message || "Failed to fetch content.");
            } finally {
                setLoading(false);
            }
        };



        fetchData();
        fetchComments();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!content) return <Alert title="Content not found" type="warning" />;

    // Function to detect resource type (image, video, or PDF)
    interface ResourceTypeMap {
        [key: string]: string;
    }

    const checkResourceType = (resource_path: string): string => {
        const resourceTypeMap: ResourceTypeMap = {
            jpg: "img",
            png: "img",
            jpeg: "img",
            mp4: "video",
            pdf: "pdf",
        };

        const extension = resource_path.split(".").pop()?.toLowerCase();
        return extension && resourceTypeMap[extension] ? resourceTypeMap[extension] : "unknown";
    };


    const handleShare = (platform: string) => {
        const url = window.location.href;
        switch (platform) {
            case 'linkedin': {
                const shareUrl = encodeURIComponent(url);
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
                break;
            }
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                setShowCopyTooltip(true);
                setTimeout(() => setShowCopyTooltip(false), 2000);
                break;
        }
    };


    return (
        <>
            <article className="min-h-screen">
                {/* Cover Image Section */}
                <div className="relative h-[300px] md:h-[400px] bg-[#1A1D29] overflow-hidden rounded-lg">
                    <div className="absolute inset-0">
                        <img
                            src={content?.thumbnail_url || "https://default-image-url.com"}
                            alt={content?.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>

                {/* Main Content Container */}
                <div className="w-[90%] mx-auto px-4 -mt-64 relative z-10">
                    {/* Post Details Section */}
                    {!showResources && (
                        <div className="bg-white dark:bg-gray-700 rounded-xl px-6 py-8 md:px-12 md:py-10">
                            <div className="flex justify-between gap-4">
                                <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-8">
                                    {content?.title}
                                </h1>
                                <Button className="border dark:border-gray-300" onClick={() => setShowResources(true)}>Resources</Button>
                            </div>
                            <div className="max-w-none prose">
                                <div className="text-sm dark:text-gray-200" dangerouslySetInnerHTML={{ __html: content?.description ?? '' }}></div>
                            </div>
                        </div>
                    )}

                    {/* Resources Section */}
                    {showResources && (
                        <div className="bg-white dark:bg-gray-700 rounded-xl px-6 py-8 md:px-12 md:py-10">
                            <div className="flex justify-between gap-4">
                                <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-8">Resources</h1>
                                <Button className="" onClick={() => setShowResources(false)}>Back</Button>
                            </div>
                            <div className="max-w-none">
                                {content?.multi_file_uploads?.length > 0 ? (
                                    content.multi_file_uploads.map((file: string, index: number) => (
                                        <div key={index} className="mb-6">
                                            {/* Resource Tabs */}
                                            <div
                                                className="flex items-center gap-4 rounded-lg cursor-pointer p-3 border mb-3"
                                                onClick={() => setShowResourceIndex(index)}
                                            >
                                                <span>Content {index + 1}</span>
                                            </div>

                                            {/* Resource Display */}
                                            <div className={`flex items-center gap-4 rounded-lg overflow-hidden ${index === showResourceIndex ? 'block' : 'hidden'}`}>
                                                {checkResourceType(file) === 'img' && <img src={file} alt="Resource" className="w-full rounded-lg" />}
                                                {checkResourceType(file) === 'video' && <video controls src={file} className="w-full rounded-lg"></video>}
                                                {checkResourceType(file) === 'pdf' && (
                                                    <embed src={file} type="application/pdf" width="100%" height="600px" className="rounded-lg" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No resources available.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="bg-white dark:bg-gray-700 rounded-xl p-4 mt-8">
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-8">Comments</h1>

                        {/* Comment Input */}
                        <div className="flex items-center gap-4">
                            <img
                                src={user?.profile_image || `https://ui-avatars.com/api/?name=${user.name}`}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    className="w-full p-3 border rounded-lg"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSubmitComment();
                                        }
                                    }}
                                />
                                <div className="absolute right-3 top-1">
                                    <button className="p-2" onClick={handleSubmitComment}>
                                        <IoMdSend size={25} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Display Comments */}
                    <div id="comments">
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index} className="dark:bg-gray-900 bg-white mt-5 transition-transform rounded-lg shadow cursor-pointer p-4">
                                    <div className="flex justify-start items-center gap-2 mb-3">
                                        <img
                                            src={
                                                comment?.profile_image || `https://ui-avatars.com/api/?name=${comment?.name}`
                                            }
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <h3 className="font-bold text-sm dark:text-white">{comment?.name}</h3>
                                            <p className="text-sm dark:text-gray-200">{comment?.date}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>{comment?.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 mt-4">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>

                {/* Scroll to Bottom Button */}
                <button
                    className="w-12 h-12 fixed bottom-6 right-6 z-10 bg-[#1A1D29] rounded-full flex justify-center items-center cursor-pointer hover:transform hover:scale-105 transition-transform"
                    onClick={() =>
                        window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: "smooth",
                        })
                    }
                >
                    <BsArrowDown size={30} className="text-white" />
                </button>
            </article>
            <div className="border-t border-gray-200 pt-6 mt-10">
                <h3 className="text-lg font-semibold mb-4">Share this article</h3>
                <div className="flex flex-wrap gap-2">
                    {/* <button
                        className="rounded flex items-center px-4 py-2 bg-[#0077B5] text-white hover:opacity-90 whitespace-nowrap"
                        onClick={() => handleShare('linkedin')}
                    >
                        <i className="fab fa-linkedin mr-2"></i>
                        LinkedIn
                    </button> */}
                    <LinkedinShareButton
                        url={window.location.href}
                        title={content?.title ?? ''}
                        summary={content?.description ?? ''}
                        source="CodeEdu"
                        className="rounded flex items-center px-4 py-2 bg-[#0077B5] text-white hover:opacity-90 whitespace-nowrap"
                    >
                        <LinkedinIcon size={32} round={true} />
                    </LinkedinShareButton>
                    {/* <button
                        className="rounded flex items-center px-4 py-2 bg-[#3b5998] text-white hover:opacity-90 whitespace-nowrap"
                        onClick={() => handleShare('facebook')}
                    >
                        <i className="fab fa-facebook mr-2"></i>
                        Facebook
                    </button> */}
                    <FacebookShareButton
                        url={window.location.href}
                        quote={content?.description ?? ''}
                        className="rounded flex items-center px-4 py-2 bg-[#3b5998] text-white hover:opacity-90 whitespace-nowrap"
                    >
                        <FacebookIcon size={32} round={true} />
                    </FacebookShareButton>



                    {/* Copy Link Button */}
                    <div className="relative">
                        <button
                            className="rounded flex items-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 whitespace-nowrap"
                            onClick={() => handleShare('copy')}
                        >
                            <Link size={20} className="mr-2" />
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
        </>
    );
}
