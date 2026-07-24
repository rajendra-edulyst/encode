import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { Clock } from "lucide-react";

const TABS = ["Top Posts", "People", "Clubs", "Internships"] as const;
type TabType = (typeof TABS)[number];

// Fake data for demonstration purposes
const FAKE_RESULTS: Record<TabType, any[]> = {
  "Top Posts": [
    { title: "How to learn React", description: "Learn React in 2025" },
    { title: "Latest Trends", description: "React, AI, Web3, etc." },
    { title: "Top JS Frameworks", description: "React, Angular, Vue" },
    { title: "Best Practices", description: "Avoid these mistakes in React" },
    { title: "New in JavaScript", description: "Explore modern JS features" },
    { title: "Web Performance", description: "Optimizing React apps" },
  ],
  People: [
    { name: "", role: "Software Engineer", location: "New York", profilePic: "https://ui-avatars.com/api/?name=John+Doe" },
    { name: "Jane Smith", role: "Product Manager", location: "London", profilePic: "https://ui-avatars.com/api/?name=Jane+Smith" },
    { name: "Albert Einstein", role: "Physicist", location: "Germany", profilePic: "https://ui-avatars.com/api/?name=Albert+Einstein" },
    { name: "Ada Lovelace", role: "Mathematician", location: "UK", profilePic: "https://ui-avatars.com/api/?name=Ada+Lovelace" },
    { name: "Grace Hopper", role: "Computer Scientist", location: "USA", profilePic: "https://ui-avatars.com/api/?name=Grace+Hopper" },
    { name: "Linus Torvalds", role: "Software Engineer", location: "Finland", profilePic: "https://ui-avatars.com/api/?name=Linus+Torvalds" },
  ],
  Clubs: [
    { title: "AI Club", description: "Learn AI and Machine Learning", members: 100 },
    { title: "Tech Enthusiasts", description: "Discuss the latest in tech", members: 200 },
    { title: "Chess Club", description: "Strategic game lovers", members: 50 },
    { title: "Coding Ninjas", description: "Coding challenges and projects", members: 150 },
    { title: "Robotics Club", description: "Build and program robots", members: 75 },
    { title: "Game Dev Club", description: "Game design and development", members: 120 },
  ],
  Internships: [
    { title: "Frontend Intern", company: "TechCorp", location: "Remote", duration: "3 months" },
    { title: "Backend Intern", company: "DevSolutions", location: "San Francisco", duration: "6 months" },
    { title: "Data Analyst", company: "DataWorks", location: "New York", duration: "4 months" },
    { title: "AI Research Intern", company: "AI Innovators", location: "Berlin", duration: "2 months" },
    { title: "UX/UI Intern", company: "DesignHub", location: "London", duration: "6 months" },
    { title: "Machine Learning Intern", company: "FutureTech", location: "Austin", duration: "4 months" },
  ],
};

const SearchInput = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Top Posts");
  const [inputValue, setInputValue] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Store to localStorage
  const updateSearchHistory = (newTerm: string) => {
    const trimmed = newTerm.trim();
    if (!trimmed) return;

    const updated = [trimmed, ...searchHistory.filter((v) => v !== trimmed)].slice(0, 5);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const handleSearch = (term: string) => {
    setInputValue(term);
    updateSearchHistory(term);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(inputValue);
    }
  };

  const handleRecentClick = (term: string) => {
    handleSearch(term);
  };

  const handleRemoveHistory = (term: string) => {
    const updated = searchHistory.filter((entry) => entry !== term);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto" >
      <input
        placeholder="Search club, people, tags"
        className={`-mt-3 !py-1 !rounded-2xl h-auto border w-full px-4 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none ${showDropdown ? "!rounded-b-none" : ""}`}
        value={inputValue}
        onFocus={() => setShowDropdown(true)}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {showDropdown && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-xl rounded-t-none mt-0 z-10 shadow-lg max-h-[300px] overflow-y-auto">
          {/* Tabs */}
          <div className="flex space-x-4 sticky top-0 bg-white z-20 p-3 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`text-sm font-medium pb-1 ${activeTab === tab ? "text-black border-b-2 border-black" : "text-gray-500"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Results or History */}
          {inputValue.trim() ? (
            <ul className="space-y-2 px-3 py-2 max-h-[250px] overflow-y-auto">
              {FAKE_RESULTS[activeTab].slice(0, 5).map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  {activeTab === "People" ? (
                    <div className="flex items-center gap-2">
                      <img src={item.profilePic} alt="profile" className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.role} - {item.location}</div>
                      </div>
                    </div>
                  ) : activeTab === "Clubs" ? (
                    <div className="font-semibold">{item.title}</div>
                  ) : activeTab === "Internships" ? (
                    <div className="flex items-center gap-2">
                      <img src={`https://ui-avatars.com/api/?name=${item.title}`} alt="profile" className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.company}</div>
                      </div>
                    </div>
                  ) : (
                    <div>{item.title}</div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-2">
              <div className="text-xs text-gray-500 mb-2">Recent Searches</div>
              <ul className="space-y-1">
                {searchHistory.length > 0 ? (
                  searchHistory.map((entry, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                    >
                      <span className="flex-1 flex items-center gap-2 truncate" onClick={() => handleRecentClick(entry)}>
                        <Clock size={16}></Clock>{entry}
                      </span>
                      <button
                        className="text-gray-400 hover:text-red-500 text-xs ml-2"
                        onClick={() => handleRemoveHistory(entry)}
                      >
                        ✕
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-400 italic">No recent searches</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchInput;