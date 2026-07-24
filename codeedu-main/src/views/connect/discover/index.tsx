import React, { useEffect, useState, useRef } from "react";
import ConnectLayout from "../layouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscoverCommunities from "./components/communities";
import RightSidePanel from "../layouts/right-side-panel";
import Posts from "./components/posts";
import Industries from "./components/industries";

import { mixpanelService } from "@/services/mixpanel/MixpanelService";

const Communities: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const trackedPageView = useRef(false);
  useEffect(() => {
    if (!trackedPageView.current) {
        mixpanelService.track('Connect Discover Viewed', {
            page_path: window.location.pathname,
            timestamp: new Date().toISOString()
        });
        trackedPageView.current = true;
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <ConnectLayout active="discover">

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-8 gap-y-6">
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          <h1
            className={`text-primary ${isMobile ? "text-2xl text-center" : "text-[30px]"
              }`}
          >
            TrendSurf...
          </h1>

          <Tabs defaultValue="communities" className="space-y-4">
            {/* Tabs Header */}
            <TabsList
              className={`bg-transparent ${isMobile
                ? "flex flex-wrap justify-center gap-2"
                : "space-x-3 mb-7"
                }`}
            >
              <TabsTrigger
                className="px-6 md:px-10 py-2 md:py-3 rounded-lg border-primary border text-white data-[state=active]:font-bold"
                value="buzz"
              >
                Buzz
              </TabsTrigger>
              <TabsTrigger
                className="px-6 md:px-10 py-2 md:py-3 rounded-lg border-primary border text-white data-[state=active]:font-bold"
                value="communities"
              >
                Communities
              </TabsTrigger>
              {/* <TabsTrigger
                className="px-6 md:px-10 py-2 md:py-3 rounded-lg border-primary border text-white data-[state=active]:font-bold"
                value="creators"
              >
                Creators
              </TabsTrigger> */}
              {/* <TabsTrigger
                className="px-6 md:px-10 py-2 md:py-3 rounded-lg border-primary border text-white data-[state=active]:font-bold"
                value="industries"
              >
                Industries
              </TabsTrigger> */}
            </TabsList>

            {/* Tabs Content */}
            <TabsContent value="buzz">
              <Posts />
            </TabsContent>
            <TabsContent value="communities">
              <DiscoverCommunities />
            </TabsContent>
            <TabsContent value="creators">Creators Content</TabsContent>
            <TabsContent value="industries">
              <Industries />
            </TabsContent>
          </Tabs>
        </div>
        {/* Right Side Panel */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          <RightSidePanel />
        </div>
      </div>
    </ConnectLayout>
  );
};

export default Communities;
