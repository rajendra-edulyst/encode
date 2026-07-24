import React, { useState } from 'react';
import { faqs } from './data/faqs';
import FaqItem from './components/FaqItem';
import { Button } from '@/components/ui/ShadcnButton';
import { Link } from 'react-router-dom';
import queryMan from '@/assets/images/query_man.svg';
import rainbow from '@/assets/images/rainbow.svg';
import { HelpCircle } from 'lucide-react';
import SEO from '@/components/SEO/SEO';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';
import { useEffect, useRef } from 'react';

type Faq = {
    id: number;
    question: string;
    answer: string;
    category: string;
};

const HelpCenter = () => {
    const [search, setSearch] = useState('');
    // eslint-disable-next-line
    const [selectedCategory, setSelectedCategory] = useState('All');

    const trackedPageView = useRef(false);

    useEffect(() => {
        if (!trackedPageView.current) {
            mixpanelService.track("Help Center Page Viewed");
            trackedPageView.current = true;
        }
    }, []);

    const allCategories = Array.from(new Set(faqs.map((faq) => faq.category)));
    // eslint-disable-next-line
    const categoryOptions = ['All', ...allCategories];

    // Filter FAQs by search + category
    const filteredFaqs = faqs.filter((faq) => {
        const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
        const matchesSearch =
            faq.question.toLowerCase().includes(search.toLowerCase()) ||
            faq.answer.toLowerCase().includes(search.toLowerCase()) ||
            faq.category.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Group by category
    const groupedFaqs: Record<string, Faq[]> = {};
    filteredFaqs.forEach((faq) => {
        if (!groupedFaqs[faq.category]) {
            groupedFaqs[faq.category] = [];
        }
        groupedFaqs[faq.category].push(faq);
    });

    return (
        <div>
            <SEO 
                title="Help Center (FAQ) | enCODE"
                description="Find answers to frequently asked questions about enCODE, including course details, account setup, billing, and support options."
                aeoType="FAQPage"
                faqData={faqs}
            />

            <div className='relative w-full rounded-2xl overflow-hidden bg-[#1A1A1A] text-white flex flex-col sm:flex-row justify-between items-center px-8 sm:px-12 py-12 sm:py-16 mb-8 min-h-[280px]'>
                {/* Rainbow Background Container */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    <img 
                        src={rainbow} 
                        alt="rainbow background" 
                        className="absolute top-0 left-1/2 h-full w-[45%] sm:w-[40%] object-fill opacity-80" 
                    />
                </div>

                {/* Left Content */}
                <div className="z-10 flex flex-col w-full sm:w-2/5">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-3">The Guidance Lounge</h2>
                    <p className="text-[#00B4D8] text-lg mb-8">Noah is here to guide you through every challenge.</p>
                    
                    <input 
                        type="text" 
                        placeholder="Search for help!" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#383838] border-none text-white placeholder-gray-400 px-5 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00B4D8]"
                    />
                </div>

                {/* Center Character (Noah) */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 hidden sm:block pointer-events-none h-full pt-4">
                    <img src={queryMan} alt="Noah" className="h-full object-contain object-bottom" />
                </div>

                {/* Right Side Button */}
                <div className="z-10 mt-6 sm:mt-0 flex-shrink-0">
                    <Link to="/queries/new">
                        <button className="bg-[#00B4D8] hover:bg-[#0096b4] text-black font-semibold py-4 px-8 rounded-xl flex flex-col items-center gap-1 transition-colors">
                            <HelpCircle size={28} />
                            <span className="text-base text-center">Raise a<br/>Query</span>
                        </button>
                    </Link>
                </div>
            </div>


            {/* Grouped FAQs */}
            {filteredFaqs.length > 0 ? (
                <div>
                    {
                        Object.entries(groupedFaqs).map(([category, faqs]) => (
                            <div key={category} className="space-y-4 mb-4">
                                {faqs.map((faq: Faq) => (
                                    <FaqItem key={faq.id} item={faq} />
                                ))}
                            </div>
                        ))
                    }

                    <div className='text-center items-center'>
                        <p className="text-center text-gray-500">Unable to find. What you are looking for?</p>
                        <Link to="/queries/new">
                            <Button variant={"outline"} className='text-center items-center mt-4'>
                                Raise a Query
                            </Button>
                        </Link>
                    </div>

                </div>

            ) : (
                <div className='text-center items-center'>
                    <p className="text-center text-gray-500">No Results Found.</p>
                    <Link to="/queries/new">
                        <Button variant={"outline"} className='text-center items-center mt-4'>
                            Raise a Query
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HelpCenter;
