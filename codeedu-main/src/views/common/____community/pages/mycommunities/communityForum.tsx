import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchJoyCategoryIdCCI, fetchJoyCategoryComments, sendJoyCategoryComment, updateJoyCategoryFile } from '@/services/connect/JoyService';
import { uploadFile } from '@/services/resume/ResumeService';
import { toast } from 'sonner';
import { useSessionUser } from '@/store/authStore';
import {
    ArrowLeft,
    Send,
    Paperclip,
    Image as ImageIcon,
    Smile,
    Mic,
    FileText,
    ThumbsUp,
    Zap,
    Square
} from 'lucide-react';

import { useCCITimer } from '@/context/CCIContext';
import SubmitResponseModal from '@/views/cci/components/SubmitResponseModal';

const CommunityForum: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useSessionUser();
    const { timeLeft } = useCCITimer();
    const [searchParams, setSearchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [stagedFile, setStagedFile] = useState<File | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [modalStep, setModalStep] = useState<'confirm' | 'submitting' | 'success' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const chatFileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    const EMOJIS = ['😀', '😂', '😍', '😊', '🙌', '👍', '🔥', '🎉', '❤️', '🤔', '👀', '✨', '👏', '😎', '💡', '🚀', '💯', '✅', '🙏', '🤷‍♂️'];

    const joyCategoryId = searchParams.get('joy_category_id');
    const isFetched = useRef(false);
    const isCommentsFetched = useRef(false);

    useEffect(() => {
        const checkJoyCategoryId = async () => {
            if (!joyCategoryId && !isFetched.current) {
                isFetched.current = true;
                try {
                    const response = await fetchJoyCategoryIdCCI();
                    if (response.status === 1 && response.data?.id) {
                        const newParams = new URLSearchParams(window.location.search);
                        newParams.set('joy_category_id', String(response.data.id));
                        setSearchParams(newParams);
                    }
                } catch (error) {
                    isFetched.current = false;
                    console.error('Failed to fetch default joy category:', error);
                }
            }
        };

        checkJoyCategoryId();
    }, [joyCategoryId, setSearchParams]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined;

        const getComments = async () => {
            if (joyCategoryId) {
                try {
                    const res = await fetchJoyCategoryComments(Number(joyCategoryId));
                    if (res.status === 1 && res.data) {
                        if (res.data.file) {
                            setUploadedFile(res.data.file);
                        }
                        const mappedMessages = res.data.list.map((comment: any) => ({
                            id: comment.id,
                            user: comment.name,
                            time: new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            timestamp: comment.created_at,
                            content: comment.body,
                            isRight: comment.user_id === user.id,
                            avatar: comment.profile_image
                        }));

                        setMessages(prev => {
                            // Optimization: only update state if the length or last message ID has changed
                            if (prev.length === mappedMessages.length) {
                                if (prev.length === 0) return prev;
                                if (prev[prev.length - 1].id === mappedMessages[mappedMessages.length - 1].id) {
                                    return prev;
                                }
                            }
                            return mappedMessages;
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch comments:', error);
                }
            }
        };

        if (joyCategoryId) {
            getComments(); // Initial fetch
            intervalId = setInterval(getComments, 3000); // Poll every 3 seconds
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [joyCategoryId, user.id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (message.length > 0) {
            setIsTyping(true);
            // Simulate random user typing or just show "You"
            setTypingUser('You');
        } else {
            setIsTyping(false);
            setTypingUser(null);
        }
    }, [message]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!message.trim() || !joyCategoryId) return;

        try {
            const res = await sendJoyCategoryComment({
                body: message,
                post_id: joyCategoryId,
                commentable_type: 'JoyCategories'
            });

            if (res.status === 1) {
                // Optimistically add message or just refresh
                const newMessage = {
                    id: Date.now(),
                    user: user.name,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: new Date().toISOString(),
                    content: message,
                    isRight: true,
                    avatar: user.profile_image
                };
                setMessages(prev => [...prev, newMessage]);
                setMessage('');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const formatDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
    };

    const getGroupedMessages = () => {
        const groups: { [key: string]: any[] } = {};
        messages.forEach(msg => {
            const label = formatDateLabel(msg.timestamp);
            if (!groups[label]) {
                groups[label] = [];
            }
            groups[label].push(msg);
        });
        return groups;
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !joyCategoryId) return;

        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            toast.error('Only PDF files are allowed');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size exceeds 10MB limit');
            return;
        }

        setStagedFile(file);
    };

    const handleImageClick = () => {
        imageInputRef.current?.click();
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !joyCategoryId) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Only JPG/PNG image files are allowed');
            return;
        }

        try {
            toast.loading('Sending image...', { id: 'image-upload-toast' });
            const uploadRes = await uploadFile(file, 'community_docs');
            if (uploadRes.file?.url) {
                const res = await sendJoyCategoryComment({
                    body: uploadRes.file.url,
                    post_id: joyCategoryId,
                    commentable_type: 'JoyCategories'
                });

                if (res.status === 1) {
                    const newMessage = {
                        id: Date.now(),
                        user: user?.name,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        timestamp: new Date().toISOString(),
                        content: uploadRes.file.url,
                        isRight: true,
                        avatar: user?.profile_image
                    };
                    setMessages(prev => [...prev, newMessage]);
                    toast.success('Image sent', { id: 'image-upload-toast' });
                } else {
                    toast.error('Failed to send image', { id: 'image-upload-toast' });
                }
            } else {
                toast.error('Image upload failed', { id: 'image-upload-toast' });
            }
        } catch (error) {
            console.error('Image upload failed:', error);
            toast.error('An error occurred during image upload', { id: 'image-upload-toast' });
        } finally {
            if (imageInputRef.current) imageInputRef.current.value = '';
        }
    };

    const handleChatFileClick = () => {
        chatFileInputRef.current?.click();
    };

    const handleChatFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !joyCategoryId) return;

        try {
            toast.loading('Sending document...', { id: 'chat-doc-toast' });
            const uploadRes = await uploadFile(file, 'community_docs');
            if (uploadRes.file?.url) {
                const res = await sendJoyCategoryComment({
                    body: uploadRes.file.url,
                    post_id: joyCategoryId,
                    commentable_type: 'JoyCategories'
                });

                if (res.status === 1) {
                    const newMessage = {
                        id: Date.now(),
                        user: user?.name,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        timestamp: new Date().toISOString(),
                        content: uploadRes.file.url,
                        isRight: true,
                        avatar: user?.profile_image
                    };
                    setMessages(prev => [...prev, newMessage]);
                    toast.success('Document sent', { id: 'chat-doc-toast' });
                } else {
                    toast.error('Failed to send document', { id: 'chat-doc-toast' });
                }
            } else {
                toast.error('Upload failed', { id: 'chat-doc-toast' });
            }
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('An error occurred during upload', { id: 'chat-doc-toast' });
        } finally {
            if (chatFileInputRef.current) chatFileInputRef.current.value = '';
        }
    };

    const uploadAudioFile = async (file: File) => {
        if (!joyCategoryId) return;

        try {
            toast.loading('Sending audio...', { id: 'chat-audio-toast' });
            const uploadRes = await uploadFile(file, 'community_docs');
            if (uploadRes.file?.url) {
                const res = await sendJoyCategoryComment({
                    body: uploadRes.file.url,
                    post_id: joyCategoryId,
                    commentable_type: 'JoyCategories'
                });

                if (res.status === 1) {
                    const newMessage = {
                        id: Date.now(),
                        user: user?.name,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        timestamp: new Date().toISOString(),
                        content: uploadRes.file.url,
                        isRight: true,
                        avatar: user?.profile_image
                    };
                    setMessages(prev => [...prev, newMessage]);
                    toast.success('Audio sent', { id: 'chat-audio-toast' });
                } else {
                    toast.error('Failed to send audio', { id: 'chat-audio-toast' });
                }
            } else {
                toast.error('Upload failed', { id: 'chat-audio-toast' });
            }
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('An error occurred during upload', { id: 'chat-audio-toast' });
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const file = new File([audioBlob], `audio-record-${Date.now()}.webm`, { type: 'audio/webm' });

                await uploadAudioFile(file);

                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
                setRecordingTime(0);
                if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            recordingTimerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing mic:", err);
            toast.error("Microphone access denied or not available");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
    };

    const handleInitialSubmitClick = () => {
        if (!stagedFile || !joyCategoryId) return;
        setModalStep('confirm');
    };

    const handleConfirmSubmit = async () => {
        if (!stagedFile || !joyCategoryId) return;

        try {
            setIsUploading(true);
            setModalStep('submitting');

            // 1. Upload file to get URL
            const uploadRes = await uploadFile(stagedFile, 'community_docs');

            if (uploadRes.file?.url) {
                // 2. Update joy category file with the URL
                const updateRes = await updateJoyCategoryFile({
                    file: uploadRes.file.url,
                    id: joyCategoryId
                });

                if (updateRes.status === 1) {
                    setUploadedFile(uploadRes.file.url);
                    setStagedFile(null);
                    setModalStep('success');
                } else {
                    toast.error('Failed to update category file', { id: 'upload-toast' });
                    setModalStep('confirm');
                }
            } else {
                toast.error('File upload failed', { id: 'upload-toast' });
                setModalStep('confirm');
            }
        } catch (error) {
            console.error('Upload process failed:', error);
            toast.error('An error occurred during upload', { id: 'upload-toast' });
            setModalStep('confirm');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleModalContinue = () => {
        setModalStep(null);
        navigate('/cci-stage-2');
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white font-jacques-pro p-4 md:p-8">
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .forum-container {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    height: 500px;
                    min-height: 500px;
                }
                .chat-input-container {
                    background: rgba(255, 255, 255, 0.07);
                    border-radius: 16px;
                    padding: 12px 20px;
                }
                .upload-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    transition: all 0.3s ease;
                }
                .upload-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.2);
                }
                .message-bubble {
                    max-width: 80%;
                }
                .typing-indicator {
                    color: #4ade80;
                    font-size: 14px;
                    font-weight: 500;
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #3b82f6;
                    border-radius: 50%;
                    display: inline-block;
                    margin-left: 6px;
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .recording-wave {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    height: 20px;
                }
                .recording-wave span {
                    display: block;
                    width: 3px;
                    height: 100%;
                    background-color: #ef4444;
                    border-radius: 3px;
                    animation: wave 1s ease-in-out infinite;
                }
                .recording-wave span:nth-child(2) { animation-delay: 0.1s; }
                .recording-wave span:nth-child(3) { animation-delay: 0.2s; }
                .recording-wave span:nth-child(4) { animation-delay: 0.3s; }
                .recording-wave span:nth-child(5) { animation-delay: 0.4s; }

                @keyframes wave {
                    0%, 100% { transform: scaleY(0.3); }
                    50% { transform: scaleY(1); }
                }
            `}</style>

            {/* Top Header */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Stage 02</p>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">CCIQ Engage: Ecosystem Simulation</h1>
                    </div>
                    <div className="text-[#facc15] font-mono text-xl md:text-2xl font-bold">
                        Time Left: {timeLeft}
                    </div>
                </div>
            </div>

            {/* Back Nav */}
            <div className="max-w-7xl mx-auto mb-6">
                <button
                    onClick={() => navigate('/cci-stage-2')}
                    className="flex items-center gap-3 text-lg font-medium hover:text-gray-300 transition-colors bg-white/5 px-6 py-4 rounded-xl border border-white/10 w-full md:w-auto"
                >
                    <ArrowLeft size={20} />
                    Build Your Own Tribe
                </button>
            </div>

            {/* Instruction Banner */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="glass-card p-5 bg-white/[0.04]">
                    <p className="text-lg font-medium text-gray-200">
                        Upload the Research Analysis report and the view points of your community here.
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Forum Area */}
                <div className="lg:col-span-3 forum-container flex flex-col p-6 overflow-hidden relative">

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto space-y-8 pr-2">
                        {Object.entries(getGroupedMessages()).map(([dateLabel, msgs]) => (
                            <React.Fragment key={dateLabel}>
                                <div className="text-center my-4">
                                    <span className="text-xs text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                        {dateLabel}
                                    </span>
                                </div>
                                {msgs.map((msg) => (
                                    <div key={msg.id} className={`flex gap-4 ${msg.isRight ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center border border-white/10 overflow-hidden shadow-lg">
                                                <img
                                                    src={msg.avatar || `https://ui-avatars.com/api/?name=${msg.user}&background=random&color=fff`}
                                                    alt={msg.user}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className={`flex flex-col ${msg.isRight ? 'items-end' : 'items-start'} message-bubble`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-gray-200">{msg.user}</span>
                                                <span className="text-[10px] text-gray-500">{msg.time}</span>
                                                {msg.isOnline && <span className="status-dot"></span>}
                                            </div>
                                            <div className={`p-4 rounded-2xl text-[15px] leading-relaxed overflow-hidden ${msg.isRight
                                                ? 'bg-white/10 rounded-tr-none text-gray-100'
                                                : 'bg-white/[0.03] rounded-tl-none text-gray-300'
                                                }`}>
                                                {msg.content?.match(/\.(jpeg|jpg|gif|png)$/i) && msg.content.startsWith('http') ? (
                                                    <img src={msg.content} alt="Attachment" className="max-w-[200px] sm:max-w-xs rounded-lg" />
                                                ) : msg.content?.match(/\.(mp3|wav|ogg|m4a|webm)$/i) && msg.content.startsWith('http') ? (
                                                    <audio controls className="max-w-[200px] sm:max-w-xs">
                                                        <source src={msg.content} />
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                ) : msg.content?.startsWith('http') && msg.content?.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|csv|txt)(?:\s|$|\?)/i) ? (
                                                    (() => {
                                                        const rawFilename = decodeURIComponent(msg.content.split('/').pop()?.split('?')[0] || 'Document Attachment');
                                                        const extIndex = rawFilename.lastIndexOf('.');
                                                        const name = extIndex !== -1 ? rawFilename.substring(0, extIndex) : rawFilename;
                                                        const ext = extIndex !== -1 ? rawFilename.substring(extIndex) : '';
                                                        
                                                        return (
                                                            <a href={msg.content} target="_blank" rel="noopener noreferrer" download className="flex items-center gap-3 bg-black/40 hover:bg-black/60 transition-colors p-3 rounded-xl border border-white/10 w-fit mt-1 shadow-sm">
                                                                <div className="bg-[#00A8E9]/20 p-2.5 rounded-lg flex flex-col items-center justify-center relative">
                                                                    <FileText size={22} className="text-[#00A8E9]" />
                                                                    {ext && (
                                                                        <span className="absolute -bottom-1 text-[9px] font-bold text-white uppercase bg-[#00A8E9] px-1 rounded-sm leading-tight shadow-sm border border-black/20">
                                                                            {ext.replace('.', '')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col pr-4 overflow-hidden max-w-[200px]">
                                                                    <div 
                                                                        className="flex items-center text-sm font-bold text-gray-100"
                                                                        title={rawFilename}
                                                                    >
                                                                        <span className="truncate">{name}</span>
                                                                        <span className="flex-shrink-0">{ext}</span>
                                                                    </div>
                                                                    <span className="text-xs text-gray-400 font-medium truncate">Click to view or download</span>
                                                                </div>
                                                            </a>
                                                        );
                                                    })()
                                                ) : (
                                                    msg.content
                                                )}
                                            </div>

                                            {msg.reactions && (
                                                <div className="flex gap-2 mt-2">
                                                    {msg.reactions.map((rect: any, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-xs text-gray-400">
                                                            <span className="scale-75 text-[#facc15]">{rect.icon}</span>
                                                            <span>{rect.count}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Section */}
                    <div className="mt-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-4 chat-input-container">
                            <div className="flex gap-3 text-gray-400">
                                <button onClick={handleChatFileClick} className="hover:text-white transition-colors"><Paperclip size={20} /></button>
                                <button onClick={handleImageClick} className="hover:text-white transition-colors"><ImageIcon size={20} /></button>
                                <div className="relative" ref={emojiPickerRef}>
                                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="hover:text-white transition-colors"><Smile size={20} /></button>
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-full left-0 mb-4 w-64 bg-gray-900 border border-white/10 rounded-lg p-2 shadow-2xl z-50 grid grid-cols-5 gap-1">
                                            {EMOJIS.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => {
                                                        setMessage(prev => prev + emoji);
                                                        setShowEmojiPicker(false);
                                                    }}
                                                    className="hover:bg-white/10 p-2 rounded text-xl flex items-center justify-center transition-colors"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isRecording ? (
                                <div className="flex-1 flex items-center justify-between bg-red-500/10 rounded-xl px-4 py-1.5 border border-red-500/20 mr-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <div className="recording-wave">
                                            <span></span><span></span><span></span><span></span><span></span>
                                        </div>
                                        <span className="text-red-400 font-mono text-sm">
                                            {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Message #general"
                                    className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-500"
                                />
                            )}
                            <div className="flex gap-3">
                                {isRecording ? (
                                    <button onClick={stopRecording} className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 p-2 rounded-xl">
                                        <Square size={18} fill="currentColor" />
                                    </button>
                                ) : (
                                    <button onClick={startRecording} className="text-gray-400 hover:text-white transition-colors">
                                        <Mic size={20} />
                                    </button>
                                )}
                                {!isRecording && (
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-green-600 hover:bg-green-500 p-2 rounded-xl transition-all shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                                    >
                                        <Send size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                        {isTyping && (
                            <div className="mt-2 typing-indicator px-2 italic">
                                {typingUser} {typingUser === 'You' ? 'are' : 'is'} typing..
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Upload Column */}
                <div className="lg:col-span-1 space-y-6 flex flex-col items-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                    />
                    <input
                        type="file"
                        ref={chatFileInputRef}
                        className="hidden"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleChatFileChange}
                    />
                    <input
                        type="file"
                        ref={imageInputRef}
                        className="hidden"
                        accept=".jpg,.jpeg,.png,image/png,image/jpeg"
                        onChange={handleImageChange}
                    />
                    <div
                        onClick={!isUploading ? handleFileClick : undefined}
                        className={`upload-card p-10 flex flex-col items-center justify-center w-full text-center gap-4 overflow-hidden ${!isUploading ? 'cursor-pointer hover:bg-white/10' : 'cursor-default opacity-80'}`}
                    >
                        <div className="p-4 bg-white/5 rounded-2xl flex-shrink-0">
                            <FileText size={48} className={isUploading ? 'text-green-500 animate-pulse' : ((uploadedFile || stagedFile) ? 'text-red-500' : 'text-gray-400')} />
                        </div>
                        <div className="w-full">
                            <h3
                                className="text-xl font-bold mb-1 w-full truncate px-2"
                                title={stagedFile ? stagedFile.name : undefined}
                            >
                                {isUploading ? 'Uploading...' : (stagedFile ? stagedFile.name : (uploadedFile ? 'Document Uploaded' : 'Upload Document'))}
                            </h3>
                            {uploadedFile && !stagedFile ? (
                                <div className="flex flex-col gap-2 mt-2">
                                    <a
                                        href={uploadedFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 justify-center bg-blue-400/10 px-3 py-1.5 rounded-lg border border-blue-400/20"
                                    >
                                        <Zap size={14} className="animate-pulse" />
                                        Download File
                                    </a>
                                    <p className="text-[10px] text-gray-500">Click card to replace file</p>
                                </div>
                            ) : (
                                !stagedFile && <p className="text-sm text-gray-500">Format allowed: PDF (Max 10 MB)</p>
                            )}
                            {stagedFile && !isUploading && (
                                <div className="flex flex-col items-center gap-1 mt-2">
                                    <p className="text-xs text-gray-400">Size: {stagedFile.size < 1024 * 1024 ? `${Math.round(stagedFile.size / 1024)} KB` : `${Math.round(stagedFile.size / (1024 * 1024))} MB`}</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setStagedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; handleFileClick(); }}
                                        className="text-xs text-red-400 hover:text-red-300 border border-red-400/20 px-2 py-1 rounded-md"
                                    >
                                        Change File
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 w-full flex justify-center">
                        <button
                            onClick={handleInitialSubmitClick}
                            disabled={!stagedFile || isUploading}
                            className="w-[180px] h-[100px] flex items-center justify-center text-center leading-snug bg-[#facc15] hover:bg-[#eab308] text-black text-xl font-medium rounded-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(250,204,21,0.39)]"
                        >
                            {isUploading ? 'Submitting...' : <>Submit<br />Response</>}
                        </button>
                    </div>
                </div>
            </div>

            <SubmitResponseModal
                isOpen={modalStep !== null}
                onClose={() => setModalStep(null)}
                onConfirm={handleConfirmSubmit}
                step={modalStep || 'confirm'}
                onContinue={handleModalContinue}
                confirmText="You have successfully created a Community for your Problem Statement. Would you like to mark it your final response? You will not be able to change it later."
                cancelText="Review Community"
            />
        </div>
    );
};

export default CommunityForum;
