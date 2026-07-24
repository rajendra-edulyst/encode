export interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
    type?: 'text' | 'options' | 'status' | 'courses' | 'classes' | 'mentoring' | 'resources' | 'module-list' | 'module-detail' | 'mentors' | 'spotlight-mentors' | 'calendar' | 'trending-courses' | 'announcements' | 'help' | 'slot-mentors' | 'collaborate-events' | 'collaborate-jobs' | 'collaborate-portfolio' | 'course-suggested';
    data?: any;
}
