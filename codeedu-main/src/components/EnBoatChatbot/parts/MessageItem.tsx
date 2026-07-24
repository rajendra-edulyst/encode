import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    ChevronRight,
    Clock,
    GraduationCap,
    Layout,
    Link as LinkIcon,
    Sparkles,
    Calendar,
    CalendarPlus,
    Video,
    ExternalLink,
    Eye,
    Megaphone,
    Lightbulb,
    Briefcase,
    MapPin,
    Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Message } from '../types';

/* ─────────────────────────────────────────────────────────
   Design tokens (single source of truth for consistency)
   ───────────────────────────────────────────────────────── */
const CARD =
    'p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50';
const CARD_HOVER =
    'transition-all hover:border-indigo-500/40 hover:bg-zinc-800';
const CARD_INTERACTIVE = (isTyping: boolean) =>
    `${CARD} group ${isTyping ? 'opacity-50 cursor-not-allowed' : `cursor-pointer ${CARD_HOVER}`}`;
const STAT_CARD =
    'p-2.5 bg-zinc-800/50 rounded-xl border border-zinc-700/50 text-center';
const LABEL = 'text-[10px] text-zinc-500';
const LABEL_UPPER = 'text-[10px] uppercase tracking-wider text-zinc-500 font-bold';
const CHEVRON =
    'w-4 h-4 text-zinc-600 group-hover:text-white transition-colors flex-shrink-0';

// Buttons
const BTN_BASE = 'font-bold transition-all flex-shrink-0 flex items-center justify-center gap-1.5 rounded-lg';
const MSG_BTN_BLOCK = (isTyping: boolean) =>
    `w-full text-[11px] h-8 border border-zinc-700 text-zinc-400 mt-2 ${BTN_BASE} ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:bg-zinc-800'}`;
const MSG_BTN_INLINE = (color: string, isTyping: boolean) =>
    `h-7 px-3 text-[10px] ${color} ${BTN_BASE} ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 active:scale-95'}`;

const BADGE = (color: string) =>
    `text-[9px] px-2 py-0.5 rounded-full font-medium border bg-${color}-500/10 text-${color}-400 border-${color}-500/20`;

const SECTION = 'mt-3 space-y-2';
const META_ICON = 'w-3 h-3 flex-shrink-0';
const META_ROW = 'flex items-center gap-2 flex-wrap mt-1.5';
const META_ITEM = 'text-[10px] text-zinc-400 flex items-center gap-1';
const AVATAR_PLACEHOLDER =
    'rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0';

/* ───────────────────────────────────────────────────────── */

interface MessageItemProps {
    msg: Message;
    isTyping: boolean;
    onSendMessage: (text: string) => void;
    onSelectCourse: (id: string) => void;
    onSelectModule: (id: string) => void;
    onCloseChatbot: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
    msg,
    isTyping,
    onSendMessage,
    onSelectCourse,
    onSelectModule,
    onCloseChatbot
}) => {
    const navigate = useNavigate();
    const handleNavigate = (path: string) => {
        onCloseChatbot();
        navigate(path);
    };
    const handleOpenLink = (url: string) => {
        onCloseChatbot();
        window.open(url, '_blank');
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm ${msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                    }`}
            >
                {msg.text ? <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p> : null}

                {/* ──────── Course Status Stats ──────── */}
                {msg.type === 'status' && (
                    <div className={SECTION}>
                        <div className="grid grid-cols-2 gap-2">
                            <div className={STAT_CARD}>
                                <div className={`${LABEL} mb-0.5`}>Active</div>
                                <div className="text-lg font-bold text-indigo-400">{msg.data.active}</div>
                            </div>
                            <div className={STAT_CARD}>
                                <div className={`${LABEL} mb-0.5`}>Completed</div>
                                <div className="text-lg font-bold text-emerald-400">{msg.data.completed}</div>
                            </div>
                        </div>
                        <div className={CARD}>
                            <div className="flex justify-between text-xs mb-2 font-medium">
                                <span>Learning Progress</span>
                                <span>{msg.data.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${msg.data.progress}%` }}
                                    className="h-full bg-indigo-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* ──────── Courses List ──────── */}
                {msg.type === 'courses' && (
                    <div className={SECTION}>
                        {msg.data.map((c: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                onClick={() => !isTyping && handleNavigate(`/courses/${c.id}`)}
                                className={CARD_INTERACTIVE(isTyping)}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${c.color === 'indigo' ? 'bg-indigo-500' : c.color === 'purple' ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-zinc-100 truncate">{c.name}</div>
                                            <div className={`${LABEL} flex items-center gap-1`}>
                                                <BookOpen className={META_ICON} />
                                                {c.modules}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className={CHEVRON} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}


                {msg.type === 'classes' && (
                    <div className={SECTION}>
                        {msg.data.map((cls: any, i: number) => (
                            <div key={i} className={`${CARD} space-y-2`}>
                                <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-zinc-100 truncate">{cls.title}</div>
                                        <div className={LABEL}>{cls.instructor}</div>
                                    </div>
                                    {cls.status === 'live' && (
                                        <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-full border border-red-500/20 animate-pulse flex-shrink-0">
                                            LIVE
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-zinc-400">
                                    <div className="flex items-center gap-1">
                                        <Clock className={META_ICON} />
                                        {cls.time}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <GraduationCap className={META_ICON} />
                                        {cls.date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ──────── Mentoring Sessions ──────── */}
                {msg.type === 'mentoring' && (
                    <div className={SECTION}>
                        {msg.data.map((m: any, i: number) => (
                            <div key={i} className="p-3 bg-zinc-800/50 rounded-xl border border-indigo-500/20">
                                <div className="flex items-center gap-3 mb-2.5">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold flex-shrink-0">
                                        {m.mentor.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-zinc-100 truncate">{m.mentor}</div>
                                        <div className="text-[10px] text-indigo-400 truncate">{m.topic}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs text-zinc-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-indigo-400" />
                                        {m.time}
                                    </div>
                                    <button
                                        disabled={isTyping}
                                        className={MSG_BTN_INLINE('bg-indigo-600 text-white', isTyping)}
                                    >
                                        Join Session
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ──────── Module List ──────── */}
                {msg.type === 'module-list' && (
                    <div className={SECTION}>
                        <div className={`${LABEL_UPPER} mb-1`}>Modules & Content</div>
                        {msg.data.map((m: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                onClick={() => {
                                    if (isTyping) return;
                                    onSelectModule(m.id.toString());
                                    onSendMessage(`Tell me about module: ${m.name}`);
                                }}
                                className={CARD_INTERACTIVE(isTyping)}
                            >
                                <div className="flex justify-between items-center gap-2">
                                    <div className="text-sm font-medium text-zinc-100 truncate min-w-0">{m.name}</div>
                                    <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] rounded-full ${m.isAssessment ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                        {m.isAssessment ? 'Assessment' : m.contentCount > 0 ? `${m.contentCount} items` : 'View'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ──────── Module Detail ──────── */}
                {msg.type === 'module-detail' && (
                    <div className="mt-3 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/20">
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="p-2 bg-indigo-500/20 rounded-lg flex-shrink-0">
                                <Layout className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div className="text-sm font-bold text-zinc-100 truncate min-w-0">{msg.data.module_details?.name}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className={STAT_CARD}>
                                <div className={`${LABEL} mb-0.5`}>Videos</div>
                                <div className="text-xs font-bold text-zinc-200">{msg.data.content_count?.videos || 0}</div>
                            </div>
                            <div className={STAT_CARD}>
                                <div className={`${LABEL} mb-0.5`}>Notes</div>
                                <div className="text-xs font-bold text-zinc-200">{msg.data.content_count?.notes || 0}</div>
                            </div>
                            <div className={STAT_CARD}>
                                <div className={`${LABEL} mb-0.5`}>Sessions</div>
                                <div className="text-xs font-bold text-zinc-200">{msg.data.content_count?.sessions || 0}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ──────── Mentors Overview ──────── */}
                {msg.type === 'mentors' && (
                    <div className={SECTION}>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                                <div className="text-[10px] text-blue-400 font-bold uppercase mb-0.5">My Mentors</div>
                                <div className="text-lg font-bold text-white">{msg.data.myCount}</div>
                            </div>
                            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                                <div className="text-[10px] text-emerald-400 font-bold uppercase mb-0.5">Recommended</div>
                                <div className="text-lg font-bold text-white">{msg.data.recCount}</div>
                            </div>
                            <div className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-center">
                                <div className="text-[10px] text-zinc-400 font-bold uppercase mb-0.5">Explore</div>
                                <div className="text-lg font-bold text-white">{msg.data.exploreCount || 0}</div>
                            </div>
                        </div>

                        {msg.data.slotCount > 0 && (
                            <button
                                onClick={() => !isTyping && onSendMessage('Show slot available mentors')}
                                disabled={isTyping}
                                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl text-yellow-400 text-xs font-bold uppercase transition-all ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:from-yellow-500/30 hover:to-amber-500/30 cursor-pointer'}`}
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Slot Available ({msg.data.slotCount})
                            </button>
                        )}

                        {msg.data.hasSlots?.length > 0 && !msg.data.slotCount && (
                            <div className="text-[11px] text-zinc-400 italic px-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                Some mentors have available slots for today!
                            </div>
                        )}
                    </div>
                )}

                {/* ──────── Slot-Available Mentors ──────── */}
                {msg.type === 'slot-mentors' && msg.data && (
                    <div className="mt-3 space-y-2.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                        {msg.data.map((mentor: any, i: number) => (
                            <div key={mentor.id || i} className={`${CARD} space-y-3`}>
                                {/* Row 1: Avatar + Name + Rating */}
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden border border-zinc-600/50">
                                        {mentor.profilePicture ? (
                                            <img src={mentor.profilePicture} alt={mentor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            mentor.name?.charAt(0)?.toUpperCase() || 'M'
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-white truncate">{mentor.name}</div>
                                        <div className="text-[11px] text-zinc-400 truncate">{mentor.role || 'Mentor'}</div>
                                    </div>
                                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-[10px] text-yellow-400 font-bold flex-shrink-0">
                                        ⭐ {mentor.rating || '—'}
                                    </div>
                                </div>
                                {/* Row 2: Expertise + Experience + Domain tags */}
                                <div className="flex flex-wrap gap-1.5">
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] text-indigo-300">
                                        🎯 {mentor.expertise
                                            ? (mentor.expertise.length > 30 ? mentor.expertise.substring(0, 30) + '…' : mentor.expertise)
                                            : 'Not listed'}
                                    </span>
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-300">
                                        💼 {mentor.experience > 0 ? `${mentor.experience} yrs exp` : 'Exp. N/A'}
                                    </span>
                                    {mentor.domain && (
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] text-purple-300">
                                            🌐 {mentor.domain}
                                        </span>
                                    )}
                                </div>
                                {/* Row 3: Action Buttons */}
                                <div className="flex gap-2 pt-0.5">
                                    {mentor.uniqueIdentifier && (
                                        <button
                                            className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-[11px] font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleNavigate(`/calendar/create?userType=mentor&id=${mentor.uniqueIdentifier}`)}
                                        >
                                            <CalendarPlus className="w-3.5 h-3.5" />
                                            Book & Connect
                                        </button>
                                    )}
                                    {mentor.uniqueIdentifier && mentor.orgId && (
                                        <button
                                            className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleNavigate(`/portfolio/${mentor.orgId}/${mentor.uniqueIdentifier}`)}
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            View Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ──────── Resources ──────── */}
                {msg.type === 'resources' && (
                    <div className={SECTION}>
                        <div className="grid grid-cols-3 gap-2">
                            <div className={STAT_CARD}>
                                <div className="text-[10px] text-zinc-400 font-bold uppercase mb-0.5">Categories</div>
                                <div className="text-base font-bold text-white">{msg.data.categoriesCount || 0}</div>
                            </div>
                            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                                <div className="text-[10px] text-emerald-400 font-bold uppercase mb-0.5">Added</div>
                                <div className="text-base font-bold text-white">{msg.data.addedCount || 0}</div>
                            </div>
                            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                                <div className="text-[10px] text-blue-400 font-bold uppercase mb-0.5">Available</div>
                                <div className="text-base font-bold text-white">{msg.data.availableCount || 0}</div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-3">
                            {(msg.data.items || []).map((res: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    onClick={() => !isTyping && res.link && handleOpenLink(res.link)}
                                    className={CARD_INTERACTIVE(isTyping)}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700/50">
                                                <LinkIcon className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-zinc-100 truncate">{res.name}</div>
                                                <div className={`${LABEL} font-medium capitalize mt-0.5`}>{res.type}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {res.isSaved && (
                                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">
                                                    Added
                                                </span>
                                            )}
                                            <ChevronRight className={CHEVRON} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <button
                            disabled={isTyping}
                            className={MSG_BTN_BLOCK(isTyping)}
                            onClick={() => handleNavigate('/explore/resource-hub')}
                        >
                            Explore Resource Hub
                            <ChevronRight className="w-3 h-3 ml-1" />
                        </button>
                    </div>
                )}

                {/* ──────── Spotlight Mentors ──────── */}
                {msg.type === 'spotlight-mentors' && (
                    <div className={SECTION}>
                        {msg.data.map((mentor: any, i: number) => (
                            <div key={i} className={`${CARD} flex items-center justify-between gap-3`}>
                                <div className="min-w-0">
                                    <div className="text-sm font-bold text-zinc-100 truncate">{mentor.profiles[0]?.name}</div>
                                </div>
                                <button
                                    disabled={isTyping}
                                    className={MSG_BTN_INLINE('bg-yellow-400 text-black', isTyping)}
                                    onClick={() => handleNavigate(`/calendar/create?userType=mentor&id=${mentor?.profiles[0]?.id}`)}
                                >
                                    Book & Connect
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ──────── Calendar Sessions ──────── */}
                {msg.type === 'calendar' && (
                    <div className={SECTION}>
                        <div className={`${LABEL_UPPER} mb-1 flex items-center gap-1`}>
                            <Calendar className={META_ICON} />
                            Scheduled Sessions
                        </div>
                        {msg.data.map((session: any, i: number) => (
                            <div key={i} className={`${CARD} space-y-2`}>
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-zinc-100 truncate">{session.name}</div>
                                        <div className={`${LABEL} mt-0.5 capitalize`}>
                                            {session.type === 'zoomclass' ? '🎥 Zoom Class' :
                                                session.type === 'offlineclass' ? '🏫 Offline Class' :
                                                    session.type === 'liveclass' ? '📺 Live Class' :
                                                        '📅 Calendar Session'}
                                        </div>
                                    </div>
                                    {session.canJoin && session.link ? (
                                        <button
                                            disabled={isTyping}
                                            className={MSG_BTN_INLINE('bg-emerald-600 text-white', isTyping)}
                                            onClick={() => handleOpenLink(session.link)}
                                        >
                                            Join Now
                                        </button>
                                    ) : (
                                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/20 flex-shrink-0">
                                            Upcoming
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-zinc-400">
                                    <div className="flex items-center gap-1">
                                        <Clock className={META_ICON} />
                                        {session.startTime} - {session.endTime}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className={META_ICON} />
                                        {session.date}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            disabled={isTyping}
                            className={MSG_BTN_BLOCK(isTyping)}
                            onClick={() => handleNavigate('/calendar')}
                        >
                            Open Full Calendar
                            <ChevronRight className="w-3 h-3 ml-1" />
                        </button>
                    </div>
                )}

                {/* ──────── Trending Courses ──────── */}
                {msg.type === 'trending-courses' && (
                    <div className={SECTION}>
                        <div className={`${LABEL_UPPER} mb-1`}>🔥 Trending Now</div>
                        {msg.data.map((course: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                onClick={() => !isTyping && handleNavigate(`/courses/${course.profileId}`)}
                                className={`rounded-xl border border-zinc-700/50 overflow-hidden ${isTyping ? 'opacity-50 cursor-not-allowed' : `cursor-pointer group ${CARD_HOVER}`}`}
                            >
                                {course.image && (
                                    <div
                                        className="h-20 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${course.image})` }}
                                    />
                                )}
                                <div className="p-3 bg-zinc-800/50 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Video className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                        <span className="text-sm font-medium text-zinc-100 truncate">{course.name}</span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors flex-shrink-0" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ──────── Course suggestion (API: based on user query) ──────── */}
                {msg.type === 'course-suggested' && (
                    <div className={SECTION}>
                        <div className={`${LABEL_UPPER} mb-1 flex items-center gap-1`}>
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            Suggested courses for your query
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-0.5">
                            {(msg.data || []).map((course: any, i: number) => {
                                const courseName = course['Course Name'] ?? course.courseName ?? 'Unknown Course';
                                const department = course['Department'] ?? course.department ?? '';
                                const skills = course['Skills'] ?? course.skills ?? '';
                                const industryDomain = course['Industry Domain'] ?? course.industryDomain ?? '';
                                const courseType = course['Course type'] ?? course.courseType ?? '';
                                const coursePathway = course['Course Pathway'] ?? course.coursePathway ?? '';
                                const courseLevel = course['Course Level'] ?? course.courseLevel ?? '';
                                const jobRole = course['Job role to skill'] ?? course['job role to skill'] ?? course.jobRole ?? '';
                                const splitByCommaOrNewline = (str: string) => str.split(/\n|,/).map((s: string) => s.trim()).filter((s: string) => s && s.toLowerCase() !== 'nan');
                                const domains = industryDomain ? splitByCommaOrNewline(String(industryDomain)).slice(0, 3) : [];
                                const skillsList = skills ? splitByCommaOrNewline(String(skills)).slice(0, 4) : [];
                                const levelLower = (courseLevel || '').toLowerCase();
                                const levelStyle = levelLower.includes('beginner') || levelLower.includes('basic')
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : levelLower.includes('advanced')
                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                        : levelLower.includes('intermediate')
                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`flex-none w-[260px] rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-3.5 flex flex-col gap-2.5 group ${!isTyping ? CARD_HOVER : 'opacity-90'}`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="text-xs font-bold text-zinc-100 line-clamp-2 group-hover:text-indigo-300 transition-colors">{courseName}</h3>
                                            {courseLevel && (
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider flex-shrink-0 ${levelStyle} border`}>
                                                    {courseLevel}
                                                </span>
                                            )}
                                        </div>
                                        {(department || courseType) && (
                                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-500">
                                                {department && <span className="line-clamp-2">🏛️ {String(department).replace(/\n/g, ' ')}</span>}
                                                {courseType && <span>📋 {courseType}</span>}
                                            </div>
                                        )}
                                        {coursePathway && (
                                            <p className="text-[10px] text-zinc-400 leading-relaxed italic bg-zinc-800 p-2 rounded-lg border border-zinc-700/50 line-clamp-2">
                                                {coursePathway}
                                            </p>
                                        )}
                                        {domains.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {domains.map((d: string, di: number) => (
                                                    <span key={di} className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[9px] border border-indigo-500/20">
                                                        {d}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {skillsList.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {skillsList.map((s: string, si: number) => (
                                                    <span key={si} className="px-1.5 py-0.5 bg-zinc-700/50 text-zinc-400 rounded text-[9px] border border-zinc-600/50">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {jobRole && String(jobRole).toLowerCase() !== 'nan' && (
                                            <div className="pt-2 border-t border-zinc-700/50">
                                                <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Job roles</span>
                                                <p className="text-[10px] text-zinc-400 leading-snug line-clamp-2">{jobRole}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ──────── Announcements ──────── */}
                {msg.type === 'announcements' && (
                    <div className={SECTION}>
                        <div className={`${LABEL_UPPER} mb-1 flex items-center gap-1`}>
                            <Megaphone className={META_ICON} />
                            Latest Announcements
                        </div>
                        {msg.data.map((announcement: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                onClick={() => !isTyping && handleNavigate(`/social/post/${announcement.id}`)}
                                className={CARD_INTERACTIVE(isTyping)}
                            >
                                <div className="flex items-start gap-3">
                                    {announcement.image && (
                                        <img
                                            src={announcement.image}
                                            alt={announcement.title}
                                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-zinc-600"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-zinc-100 line-clamp-2">{announcement.title}</div>
                                        {announcement.date && (
                                            <div className={`${META_ITEM} mt-1`}>
                                                <Calendar className={META_ICON} />
                                                {announcement.date}
                                            </div>
                                        )}
                                    </div>
                                    <ChevronRight className={`${CHEVRON} mt-1`} />
                                </div>
                            </motion.div>
                        ))}
                        <button
                            disabled={isTyping}
                            className={MSG_BTN_BLOCK(isTyping)}
                            onClick={() => handleNavigate('/announcements')}
                        >
                            View All Announcements
                            <ChevronRight className="w-3 h-3 ml-1" />
                        </button>
                    </div>
                )}

                {/* ──────── Help & FAQ ──────── */}
                {msg.type === 'help' && (
                    <div className={SECTION}>
                        {(msg.data?.tips || []).length > 0 && (
                            <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                    <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">
                                        {msg.data?.category || 'Tips'}
                                    </span>
                                </div>
                                <div className="space-y-1.5">
                                    {(msg.data?.tips || []).map((tip: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                                            <span className="text-indigo-400 font-bold mt-0.5 flex-shrink-0">•</span>
                                            <span className="leading-relaxed">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {msg.data?.routePath && (
                            <button
                                disabled={isTyping}
                                className={MSG_BTN_BLOCK(isTyping)}
                                onClick={() => handleNavigate(msg.data.routePath)}
                            >
                                {msg.data.primaryActionLabel || 'Go'}
                                <ChevronRight className="w-3 h-3 ml-1" />
                            </button>
                        )}
                    </div>
                )}

                {/* ──────── Collaborate: Events ──────── */}
                {msg.type === 'collaborate-events' && msg.data?.events && (
                    <div className={SECTION}>
                        {msg.data.events.map((event: any, i: number) => (
                            <motion.div
                                key={event.id || i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                onClick={() => !isTyping && handleNavigate(`/collaborate/event/${event.id}`)}
                                className={CARD_INTERACTIVE(isTyping)}
                            >
                                <div className="flex items-start gap-3">
                                    {event.image ? (
                                        <img src={event.image} alt={event.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-zinc-600" />
                                    ) : (
                                        <div className={`w-10 h-10 ${AVATAR_PLACEHOLDER}`}>
                                            <Calendar className="w-5 h-5 text-indigo-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-zinc-100 line-clamp-1">{event.name}</div>
                                        {event.organization_name && (
                                            <div className={`${LABEL} mt-0.5 truncate`}>{event.organization_name}</div>
                                        )}
                                        <div className={META_ROW}>
                                            {event.start_date && (
                                                <div className={META_ITEM}>
                                                    <Calendar className={META_ICON} />
                                                    {new Date(event.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            )}
                                            {event.vanue && (
                                                <div className={META_ITEM}>
                                                    <MapPin className={META_ICON} />
                                                    {event.vanue}
                                                </div>
                                            )}
                                        </div>
                                        {event.com_status?.program_status && (
                                            <span className={`inline-block mt-1.5 text-[9px] px-2 py-0.5 rounded-full font-medium ${event.com_status.program_status === 'Ongoing'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : event.com_status.program_status === 'Upcoming'
                                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    : 'bg-zinc-700/50 text-zinc-400 border border-zinc-600/30'
                                                }`}>
                                                {event.com_status.program_status}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronRight className={`${CHEVRON} mt-1`} />
                                </div>
                            </motion.div>
                        ))}
                        {msg.data.routePath && (
                            <button
                                disabled={isTyping}
                                className={MSG_BTN_BLOCK(isTyping)}
                                onClick={() => handleNavigate(msg.data.routePath)}
                            >
                                View All {msg.data.category}
                                <ChevronRight className="w-3 h-3 ml-1" />
                            </button>
                        )}
                    </div>
                )}

                {/* ──────── Collaborate: Jobs/Internships ──────── */}
                {msg.type === 'collaborate-jobs' && msg.data && (
                    <div className={SECTION}>
                        {/* Summary badges */}
                        <div className="flex gap-2 mb-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                                {msg.data.totalJobs} Job{msg.data.totalJobs !== 1 ? 's' : ''}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                                {msg.data.totalInternships} Internship{msg.data.totalInternships !== 1 ? 's' : ''}
                            </span>
                        </div>
                        {/* Job cards */}
                        {[...(msg.data.jobs || []), ...(msg.data.internships || [])].slice(0, 5).map((program: any, i: number) => (
                            <motion.div
                                key={program.id || i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                onClick={() => !isTyping && handleNavigate(`/internship/${program.id}`)}
                                className={CARD_INTERACTIVE(isTyping)}
                            >
                                <div className="flex items-start gap-3">
                                    {program.image ? (
                                        <img src={program.image} alt={program.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-zinc-600" />
                                    ) : (
                                        <div className={`w-10 h-10 ${AVATAR_PLACEHOLDER}`}>
                                            <Briefcase className="w-5 h-5 text-indigo-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-zinc-100 line-clamp-1">{program.name}</div>
                                        {program.job_in_org_name && (
                                            <div className={`${LABEL} mt-0.5 truncate`}>{program.job_in_org_name}</div>
                                        )}
                                        <div className={META_ROW}>
                                            {program.location && (
                                                <div className={META_ITEM}>
                                                    <MapPin className={META_ICON} />
                                                    {program.location}
                                                </div>
                                            )}
                                            {program.experience && (
                                                <div className={META_ITEM}>
                                                    <Briefcase className={META_ICON} />
                                                    {program.experience} Yrs
                                                </div>
                                            )}
                                            {program.job_type && (
                                                <div className={META_ITEM}>
                                                    <Users className={META_ICON} />
                                                    {program.job_type}
                                                </div>
                                            )}
                                        </div>
                                        <span className={`inline-block mt-1.5 text-[9px] px-2 py-0.5 rounded-full font-medium ${program.is_job === 1
                                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                            {program.is_job === 1 ? 'Job' : 'Internship'}
                                        </span>
                                    </div>
                                    <ChevronRight className={`${CHEVRON} mt-1`} />
                                </div>
                            </motion.div>
                        ))}
                        {msg.data.routePath && (
                            <button
                                disabled={isTyping}
                                className={MSG_BTN_BLOCK(isTyping)}
                                onClick={() => handleNavigate(msg.data.routePath)}
                            >
                                <Briefcase className="w-3 h-3 mr-1" />
                                View All Jobs & Internships
                                <ChevronRight className="w-3 h-3 ml-1" />
                            </button>
                        )}
                    </div>
                )}

                {/* ──────── Collaborate: Portfolio / InFocus ──────── */}
                {msg.type === 'collaborate-portfolio' && msg.data?.creators && (
                    <div className={SECTION}>
                        {msg.data.creators.map((creator: any, i: number) => (
                            <motion.div
                                key={creator.id || i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className={CARD}
                            >
                                <div className="text-xs font-semibold text-indigo-400 mb-2 truncate">{creator.display_name || creator.tab_name}</div>
                                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                                    {(creator.profiles || []).slice(0, 4).map((profile: any, pi: number) => (
                                        <div key={pi} className="flex flex-col items-center gap-1 flex-shrink-0" style={{ width: 48 }}>
                                            <img
                                                src={profile.profile_image || profile.org_logo || '/placeholder-user.png'}
                                                alt={profile.name}
                                                className="w-9 h-9 rounded-full object-cover border border-zinc-600"
                                            />
                                            <span className="text-[9px] text-zinc-400 text-center line-clamp-1 w-full">{profile.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                        {msg.data.routePath && (
                            <button
                                disabled={isTyping}
                                className={MSG_BTN_BLOCK(isTyping)}
                                onClick={() => handleNavigate(msg.data.routePath)}
                            >
                                View All In Focus
                                <ChevronRight className="w-3 h-3 ml-1" />
                            </button>
                        )}
                    </div>
                )}

                {/* ──────── Timestamp ──────── */}
                <span className="text-[10px] opacity-40 mt-2 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </motion.div >
    );
};
