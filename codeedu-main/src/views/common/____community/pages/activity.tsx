import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
import { Button } from "@/components/ui/ShadcnButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("activity");

  return (
      <div className="shadow-sm px-6 py-6">
        {/* Header Navigation */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-2">
            <Tabs defaultValue="activity" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-[240px] grid-cols-2 bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="activity" 
                  className={`py-3 px-4 rounded-none font-medium text-base border-b-2 ${activeTab === "activity" ? "border-purple-500 text-purple-600" : "border-transparent text-gray-500"}`}
                >
                  Activity
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="gap-2 !rounded-button whitespace-nowrap cursor-pointer">
              <i className="fas fa-sliders-h text-gray-600"></i>
              Filter
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <ScrollArea className="h-[calc(100vh-56px)]">
          <div className="p-4">
            {/* Activity Feed */}
            <div className="space-y-6">
              {/* Platform Post */}
              <div className="bg-white rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md">
                      <i className="fas fa-palette text-blue-500 text-xs"></i>
                    </div>
                    <span className="text-sm font-medium text-blue-500">Graphixx</span>
                  </div>
                </div>
                
                {/* Post Author */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20profile%20picture%20of%20a%20young%20man%20with%20glasses%2C%20minimal%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20detailed%20face%2C%20soft%20lighting&width=100&height=100&seq=1&orientation=squarish" />
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Prakash Solanki</span>
                      <span className="text-xs text-gray-500">• 6h</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-button cursor-pointer">
                        <i className="fas fa-ellipsis-v text-gray-500"></i>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">Save</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Post Content */}
                <div className="mt-3">
                  <h2 className="text-xl font-semibold text-gray-800">Visual Storytelling in Graphic Design</h2>
                  <p className="mt-2 text-gray-600 text-sm">
                    Exploring how design elements like color, typography, and composition work together to convey emotion, narrative, and meaning in a powerful, visual way is at the heart of impactful graphic design. Each element plays a unique role—color evokes mood, typography communicates tone and hierarchy, while composition guides the {`viewer's`}...
                  </p>
                </div>
                
                {/* Post Metrics */}
                <div className="flex items-center gap-4 mt-4">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="far fa-heart"></i>
                    <span className="text-sm">1.1k likes</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="far fa-comment"></i>
                    <span className="text-sm">178 comments</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-retweet"></i>
                    <span className="text-sm">21 repost</span>
                  </Button>
                </div>
              </div>
              
              {/* You liked this post */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">You liked this post</p>
                
                <div className="bg-white rounded-lg border border-gray-100 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md">
                        <i className="fas fa-palette text-blue-500 text-xs"></i>
                      </div>
                      <span className="text-sm font-medium text-blue-500">Graphixx</span>
                    </div>
                  </div>
                  
                  {/* Post Author */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-gray-200">
                        <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20profile%20picture%20of%20a%20young%20man%20with%20beard%2C%20minimal%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20detailed%20face%2C%20soft%20lighting&width=100&height=100&seq=2&orientation=squarish" />
                        <AvatarFallback>ID</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Ishan dev</span>
                        <span className="text-xs text-gray-500">• 3h</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-button cursor-pointer">
                          <i className="fas fa-ellipsis-v text-gray-500"></i>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">Save</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Post Content */}
                  <div className="mt-3">
                    <h2 className="text-xl font-semibold text-gray-800">New graphic trends for youtube thumbnails</h2>
                    <p className="mt-2 text-gray-600 text-sm">
                      Modern YouTube thumbnails are shifting toward bold, eye-catching visuals with vibrant colors, large text, expressive faces, and minimal distractions. Current trends emphasize clarity and emotional impact—using high contrast, simplified layouts, and close-up shots to...
                    </p>
                  </div>
                  
                  {/* Thumbnail Image */}
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img 
                      src="https://readdy.ai/api/search-image?query=youtube%20thumbnail%20design%20with%20bright%20neon%20colors%2C%20bold%20text%2C%20high%20contrast%2C%20simplified%20layout%2C%20eye-catching%20graphics%2C%20modern%20design%2C%20clean%20background%2C%20professional%20look%2C%20digital%20marketing%2C%20content%20creation%2C%20video%20promotion&width=600&height=338&seq=3&orientation=landscape" 
                      alt="YouTube thumbnail example" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  
                  {/* Post Metrics */}
                  <div className="flex items-center gap-4 mt-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="far fa-heart"></i>
                      <span className="text-sm">1.1k likes</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="far fa-comment"></i>
                      <span className="text-sm">178 comments</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="fas fa-retweet"></i>
                      <span className="text-sm">21 repost</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* You commented on this post */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">You commented on this post</p>
                
                <div className="bg-white rounded-lg border border-gray-100 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-gray-200">
                        <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20profile%20picture%20of%20a%20person%20with%20glasses%2C%20minimal%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20detailed%20face%2C%20soft%20lighting&width=100&height=100&seq=4&orientation=squarish" />
                        <AvatarFallback>DM</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Devmode</span>
                        <span className="text-xs text-gray-500">• 5 days ago</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-button cursor-pointer">
                          <i className="fas fa-ellipsis-v text-gray-500"></i>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">Save</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Post Content */}
                  <div className="mt-3">
                    <h2 className="text-xl font-semibold text-gray-800">Building Dynamic UIs with React</h2>
                    <p className="mt-2 text-gray-600 text-sm">
                      Exploring how {`React's`} component-based architecture and state management simplify creating fast, interactive, and scalable web applications reveals its power in modern...
                    </p>
                  </div>
                  
                  {/* Game Image */}
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img 
                      src="https://readdy.ai/api/search-image?query=video%20game%20promotional%20banner%20showing%20cross-platform%20availability%20for%20Xbox%2C%20PS4%20and%20PC%2C%20dark%20background%20with%20soldier%20character%2C%20high%20quality%20gaming%20graphics%2C%20professional%20game%20marketing%20material%2C%20cinematic%20game%20art&width=600&height=250&seq=5&orientation=landscape" 
                      alt="Game cross-platform banner" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  
                  {/* Post Metrics */}
                  <div className="flex items-center gap-4 mt-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="far fa-heart"></i>
                      <span className="text-sm">1.1k likes</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="far fa-comment"></i>
                      <span className="text-sm">178 comments</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="fas fa-retweet"></i>
                      <span className="text-sm">21 repost</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Fire Comment Post */}
              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20profile%20picture%20of%20a%20young%20man%20with%20glasses%2C%20minimal%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20detailed%20face%2C%20soft%20lighting&width=100&height=100&seq=1&orientation=squarish" />
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Prakash Solanki</span>
                      <span className="text-xs text-gray-500">• 6 days ago</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-button cursor-pointer">
                        <i className="fas fa-ellipsis-v text-gray-500"></i>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">Save</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Post Content */}
                <div className="mt-3">
                  <p className="text-lg font-medium text-gray-800">
                    This UI is so damn fire 🔥🔥
                  </p>
                </div>
                
                {/* Post Metrics */}
                <div className="flex items-center gap-4 mt-4">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="far fa-heart"></i>
                    <span className="text-sm">1.1k likes</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="far fa-comment"></i>
                    <span className="text-sm">178 comments</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-retweet"></i>
                    <span className="text-sm">21 repost</span>
                  </Button>
                </div>
              </div>
              
              {/* Python Post */}
              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-md">
                      <i className="fas fa-code text-green-500 text-xs"></i>
                    </div>
                    <span className="text-sm font-medium text-green-500">CodeFlix</span>
                  </div>
                </div>
                
                {/* Post Author */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20profile%20picture%20of%20a%20young%20man%20with%20glasses%2C%20minimal%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20detailed%20face%2C%20soft%20lighting&width=100&height=100&seq=1&orientation=squarish" />
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Prakash Solanki</span>
                      <span className="text-xs text-gray-500">• 03/05/2025</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-button cursor-pointer">
                        <i className="fas fa-ellipsis-v text-gray-500"></i>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">Save</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Post Content */}
                <div className="mt-3">
                  <h2 className="text-xl font-semibold text-gray-800">Python Power: Simplifying Complex Problems</h2>
                  <p className="mt-2 text-gray-600 text-sm">
                    Highlighting {`Python's`} versatility and readability in solving diverse challenges—from data analysis and automation to web development and AI—shows {`why it's`} a favorite among beginners and professionals alike. Its clean syntax and vast ecosystem of libraries...
                  </p>
                </div>
                
                {/* Python Image */}
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img 
                    src="https://readdy.ai/api/search-image?query=programmer%20working%20with%20python%20code%20on%20screen%2C%20green%20code%20on%20dark%20background%2C%20programming%20environment%20with%20python%20syntax%20highlighted%2C%20snake%20imagery%20subtly%20incorporated%2C%20professional%20coding%20workspace%2C%20modern%20developer%20setup&width=600&height=338&seq=6&orientation=landscape" 
                    alt="Python programming" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                {/* Post Metrics */}
                <div className="flex items-center gap-4 mt-4">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="far fa-heart"></i>
                    <span className="text-sm">1.1k likes</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="far fa-comment"></i>
                    <span className="text-sm">178 comments</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-retweet"></i>
                    <span className="text-sm">21 repost</span>
                  </Button>
                </div>
              </div>
              
              {/* Spacer at bottom */}
              <div className="h-10"></div>
            </div>
          </div>
        </ScrollArea>
      </div>
  );
}

export default App;