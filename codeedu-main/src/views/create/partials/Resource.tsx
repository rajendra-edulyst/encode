/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { mixpanelService } from "@/services/mixpanel/MixpanelService";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Search from "@assets/icons/category_search.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/ShadcnButton";
import React from "react";

interface ResourceItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

const Resources: React.FC = () => {
  const resources: ResourceItem[] = [
    {
      id: 1,
      name: "Toolkits",
      slug: "toolkits",
      description:
        "Ready-made resources and frameworks to kickstart projects and learning.",
      image: "/img/others/image1.png",
    },
    {
      id: 2,
      name: "Creative Library",
      slug: "creative-library",
      description:
        "A curated space for books, magazines, and research to fuel learning and creativity.",
      image: "/img/others/Image24.png",

    },
    {
      id: 3,
      name: "Reading Shelf",
      slug: "reading-shelf",
      description:
        "A curated space for books, magazines, and research to fuel learning and creativity.",
      image: "/img/others/image2.png",
    },
    {
      id: 4,
      name: "A/V Vault",
      slug: "a/v-vault",
      description:
        "The A/V Vault is a central repository of audio and video resources.",
      image: "/img/others/image3.png",
    },
  ];

  const [api, setApi] = React.useState<any>(null);

  return (
    <div className="rounded-2xl border p-6 bg-white dark:bg-gray-900 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Resource Hubs</h1>
        <Link
          to="/explore/resource-hub"
          className="text-primary text-sm font-medium hover:underline"
          onClick={() => mixpanelService.track("Resource Hub View All Clicked")}
        >
          View all
        </Link>
      </div>

      {/* Carousel */}
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{ align: "start" }}
          className="w-full"
        >
          <CarouselContent>
            {resources.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-full md:basis-1/2 lg:basis-1/3 px-2"
              >
                <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative h-52">
                    <Link
                      to={`/explore/resource-hub?tab=${item.slug}`}
                      onClick={() => {
                        mixpanelService.track("Resource Hub Opened", {
                          hub_id: item.id,
                          hub_name: item.name,
                          hub_slug: item.slug,
                        });
                      }}
                    >                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  <div className="p-6 flex flex-col">
                    <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                      {item.name}
                    </h2>

                    <div className="flex justify-between items-start gap-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 line-clamp-3">
                        {item.description}
                      </p>

                      <div className="shrink-0">
                        <Link to={`/explore/resource-hub?tab=${item.slug}`}>
                          <button
                            className={cn(
                              "rounded-xl bg-primary px-4 py-3 shadow-sm",
                              "hover:opacity-90 transition-opacity",
                              "flex flex-col items-center justify-center min-w-[80px]"
                            )}
                          >
                            <img
                              src={Search}
                              alt="Lookout"
                              className="w-5 h-5 object-contain mb-1"
                            />
                            <span className="text-xs font-medium text-black">
                              Lookout
                            </span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="icon"

          className="absolute left-[-20px] top-1/2 -translate-y-1/2 rounded-full border bg-background text-primary hover:bg-primary hover:text-white shadow-md"
          onClick={() => api?.scrollPrev()}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="icon"

          className="absolute right-[-20px] top-1/2 -translate-y-1/2 rounded-full border bg-background text-primary hover:bg-primary hover:text-white shadow-md"
          onClick={() => api?.scrollNext()}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Resources;
