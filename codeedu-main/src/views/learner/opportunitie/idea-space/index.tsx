// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import { BsSearch } from 'react-icons/bs';
interface Idea {
    id: number;
    title: string;
    description: string;
    author: {
        name: string;
        avatar: string;
    };
    category: string;
    tags: string[];
    likes: number;
    comments: number;
    status: 'new' | 'in-progress' | 'implemented';
    createdAt: string;
}
const App: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('latest');
    const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
    const [ideaTitle, setIdeaTitle] = useState('');
    const [ideaDescription, setIdeaDescription] = useState('');
    const [ideaCategory, setIdeaCategory] = useState('Technology');
    const [ideaTags, setIdeaTags] = useState('');
    const [likedIdeas, setLikedIdeas] = useState<number[]>([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const categories = ['All', 'Technology', 'Product', 'Design', 'Marketing', 'Business'];
    const ideas: Idea[] = [
        {
            id: 1,
            title: 'AI-Powered Learning Path Recommendation System',
            description: 'Implement an intelligent system that analyzes student performance and learning patterns to create personalized learning paths, optimizing the educational journey for each individual.',
            author: {
                name: 'Christopher Anderson',
                avatar: 'https://public.readdy.ai/ai/img_res/49221490f8b7d7f0fe654b121da7d810.jpg'
            },
            category: 'Technology',
            tags: ['AI', 'Machine Learning', 'EdTech'],
            likes: 156,
            comments: 32,
            status: 'in-progress',
            createdAt: '2025-02-20T09:30:00'
        },
        {
            id: 2,
            title: 'Virtual Reality Campus Tour Platform',
            description: 'Create an immersive VR platform allowing prospective students to explore campus facilities, attend virtual classes, and interact with faculty members from anywhere in the world.',
            author: {
                name: 'Sarah Mitchell',
                avatar: 'https://public.readdy.ai/ai/img_res/8900c21a1600942e2edbfa4a33afd790.jpg'
            },
            category: 'Technology',
            tags: ['VR', 'Education', 'Innovation'],
            likes: 98,
            comments: 24,
            status: 'new',
            createdAt: '2025-02-19T14:20:00'
        },
        {
            id: 3,
            title: 'Sustainable Campus Initiative',
            description: 'Develop a comprehensive sustainability program incorporating renewable energy, waste reduction, and green transportation solutions to create an environmentally conscious campus environment.',
            author: {
                name: 'Michael Chen',
                avatar: 'https://public.readdy.ai/ai/img_res/ca33286e0433455db7320b4f6846d9ba.jpg'
            },
            category: 'Business',
            tags: ['Sustainability', 'Environment', 'Campus'],
            likes: 234,
            comments: 45,
            status: 'implemented',
            createdAt: '2025-02-18T11:15:00'
        }
    ];
    useEffect(() => {
        const initStatsChart = () => {
            const chartElement = document.getElementById('ideaStatsChart');
            if (chartElement) {
                const chart = echarts.init(chartElement);
                const option = {
                    animation: false,
                    title: {
                        text: 'Ideas Statistics',
                        left: 'center',
                        textStyle: {
                            fontSize: 16,
                            fontWeight: 'normal'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [120, 180, 150, 210, 190, 230],
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            color: '#2563eb'
                        },
                        itemStyle: {
                            color: '#2563eb'
                        }
                    }]
                };
                chart.setOption(option);
            }
        };
        initStatsChart();
    }, []);
    const toggleLikeIdea = (id: number) => {
        setLikedIdeas(prev =>
            prev.includes(id) ? prev.filter(ideaId => ideaId !== id) : [...prev, id]
        );
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800';
            case 'implemented': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const heroImage = 'https://coworker.imgix.net/photos/portugal/lisbon/idea-spaces-palacio-sotto-mayor/4-1712061338.jpg?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle';
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 bg-white shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-semibold text-gray-800">IdeaSpace</h1>
                        </div>
                        <div className="flex-1 max-w-2xl mx-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-full border-none bg-gray-100 focus:ring-2 focus:primary text-sm"
                                    placeholder="Search ideas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <BsSearch className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                        <div className="flex items-center h-full">
                            <div className="max-w-xl">
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    Share Your Innovative Ideas
                                </h1>
                                <p className="text-lg text-gray-600 mb-8">
                                    Transform our campus community with your creative solutions and innovative thinking.
                                </p>
                                <button
                                    onClick={() => setShowNewIdeaModal(true)}
                                    className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors !rounded-button whitespace-nowrap"
                                >
                                    Submit Your Idea
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex space-x-4 overflow-x-auto">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`px-6 py-2 rounded-full font-medium transition-colors !rounded-button whitespace-nowrap ${selectedCategory === category
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border-none text-gray-600 rounded-lg px-4 py-2"
                        >
                            <option value="latest">Latest</option>
                            <option value="popular">Most Popular</option>
                            <option value="trending">Trending</option>
                        </select>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div id="ideaStatsChart" style={{ height: '300px' }}></div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {ideas.map((idea) => (
                        <div
                            key={idea.id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={idea.author.avatar}
                                        alt={idea.author.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{idea.title}</h3>
                                        <p className="text-gray-500 text-sm">
                                            {idea.author.name} • {formatDate(idea.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(idea.status)}`}>
                                    {idea.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mt-4 mb-4">{idea.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {idea.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => toggleLikeIdea(idea.id)}
                                        className={`flex items-center space-x-1 text-sm ${likedIdeas.includes(idea.id) ? 'text-red-500' : 'text-gray-500'
                                            } !rounded-button whitespace-nowrap`}
                                    >
                                        <i className={`fas fa-heart ${likedIdeas.includes(idea.id) ? 'text-red-500' : ''}`}></i>
                                        <span>{idea.likes}</span>
                                    </button>
                                    <button className="flex items-center space-x-1 text-sm text-gray-500 !rounded-button whitespace-nowrap">
                                        <i className="fas fa-comment"></i>
                                        <span>{idea.comments}</span>
                                    </button>
                                </div>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium !rounded-button whitespace-nowrap">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            {showNewIdeaModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Submit New Idea</h2>
                            <button
                                onClick={() => setShowNewIdeaModal(false)}
                                className="text-gray-500 hover:text-gray-700 !rounded-button whitespace-nowrap"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={ideaTitle}
                                    onChange={(e) => setIdeaTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your idea title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={ideaDescription}
                                    onChange={(e) => setIdeaDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                                    placeholder="Describe your idea in detail"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={ideaCategory}
                                    onChange={(e) => setIdeaCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {categories.filter(cat => cat !== 'All').map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                <input
                                    type="text"
                                    value={ideaTags}
                                    onChange={(e) => setIdeaTags(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter tags separated by commas"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-3"></i>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" onChange={(e) => {
                                                    if (e.target.files) {
                                                        console.log('File selected:', e.target.files[0].name);
                                                    }
                                                }} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setShowNewIdeaModal(false)}
                                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 !rounded-button whitespace-nowrap"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewIdeaModal(false);
                                }}
                                className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 !rounded-button whitespace-nowrap"
                            >
                                Submit Idea
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default App
