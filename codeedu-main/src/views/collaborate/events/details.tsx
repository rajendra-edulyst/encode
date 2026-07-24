import Breadcrumb from "@/components/breadcrumb";
import LoadingSection from "@/components/LoadingSection";
import SafeHtml from "@/components/SafeHtml";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/ShadcnButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useEventById } from "@/hooks/data/collaborate/useEvents";
import { formatDate } from "@/utils/commonDateFormat";
import EventActivity from "@/views/learner/events/EventActivity";
import { useParams, Link } from "react-router-dom";
import { Calendar, Star, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { mixpanelService } from "@/services/mixpanel/MixpanelService";

const breadcrumbItems = [
  { label: "Events", path: "/collaborate/events" },
  { label: "Details" },
];

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const { data: eventdetails, isLoading } = useEventById(id);

  const trackedPageView = useRef(false);

  useEffect(() => {
    if (eventdetails?.competitions_details?.program?.name && !trackedPageView.current) {
        mixpanelService.track('Event Viewed', {
            event_id: id,
            event_name: eventdetails.competitions_details.program.name,
            category: 'Event',
            page_path: window.location.pathname,
            timestamp: new Date().toISOString()
        })
        trackedPageView.current = true;
    }
  }, [eventdetails, id])

  if (isLoading) {
    return (
      <LoadingSection
        isLoading={isLoading}
        title="Loading event details..."
        description="please wait ....."
      />
    );
  }

  const event = eventdetails?.competitions_details?.program;
  const instructions = eventdetails?.competition_instructions;
  const skills = eventdetails?.job_skill_details?.all_program_skills;
  const expert = eventdetails?.expert;

  const isPastEvent = (endDate: string) => {
    const today = new Date();
    return new Date(endDate) < today;
  };

  return (
    <div className="flex flex-col space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      {/* ADMIN ACTIONS */}
      <div className="flex justify-end gap-4">
        <Button className="bg-[#7fbc42] hover:bg-[#6da538] text-black font-semibold px-6">
          <Link to={`/collaborate/events/${id}/edit`}>Update</Link>
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 text-white px-6">
          Delete
        </Button>
      </div>

      {/* HERO SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        <div
          className="md:col-span-7 h-80 md:h-96 rounded-3xl overflow-hidden border border-gray-800 bg-cover bg-center"
          style={{ backgroundImage: `url('${event?.image}')` }}
        />

        <Card className="md:col-span-3 bg-[#1a1a1a] flex flex-col justify-between">
          <CardContent className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {event?.name}
            </h1>

            <p className="text-gray-300 text-sm">
              Domain: {event?.event_details?.functional_domain ?? "-"}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#4A9EFF]" />

                <p> <span className="font-semibold"></span> Start Date :- {formatDate(event?.start_date, 'DD MMM YY, HH:mm a')} </p>

              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#4A9EFF]" />
                <p> <span className="font-semibold">End Date :- </span> {formatDate(event?.end_date, 'DD MMM YY, HH:mm a')}</p>
              </div>
            </div>
          </CardContent>

          {!isPastEvent(event?.end_date ?? "") && (
            <CardFooter>
              <Button className="w-full bg-[#7fbc42] hover:bg-[#6da538] text-black font-bold py-5 rounded-xl flex gap-2">
                <ArrowRight className="w-5 h-5" />
                Register Now
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* STATS BAR */}
      <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800 py-10 px-8">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Location", value: event?.event_details?.venue || "Online" },
            { label: "Registered Users", value: event?.user_registered_count || "0" },
            { label: "Skills", value: skills?.length || "0" },
            {
              label: "Rating",
              value: event?.event_details?.rating || "0",
              icon: <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />,
            },
          ].map((item, i) => (
            <div key={i} className="text-center relative">
              <p className="text-gray-400 text-sm mb-3">{item.label}</p>
              <div className="flex justify-center items-center gap-2">
                {item.icon}
                <p className="text-white text-2xl font-bold">{item.value}</p>
              </div>
              {i !== 3 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gray-700" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* TABS SECTION */}
      <Card>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="bg-[#5A5A5A]  rounded-full mb-6">
              <TabsTrigger value="overview" className="
              h-full
              px-8
              rounded-full
              text-white
              text-sm
              font-medium
              data-[state=active]:bg-[#8BC34A]
              data-[state=active]:text-black
              transition-all
            ">
                Overview
              </TabsTrigger>
              <TabsTrigger value="expert" className="
              h-full
              px-8
              rounded-full
              text-white
              text-sm
              font-medium
              data-[state=active]:bg-[#8BC34A]
              data-[state=active]:text-black
              transition-all
            ">
                Expert Details
              </TabsTrigger>
              <TabsTrigger value="gallery" className="
              h-full
              px-8
              rounded-full
              text-white
              text-sm
              font-medium
              data-[state=active]:bg-[#8BC34A]
              data-[state=active]:text-black
              transition-all
            ">
                Gallery
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="space-y-8">
              <Section title="About Event">
                <SafeHtml html={event?.description ?? "-"} />
              </Section>

              <Section title="Skills Acquired">
                <div className="flex flex-wrap gap-3">
                  {skills?.map((skill, i) => (
                    <Badge
                      key={i}
                      className="bg-[#4a4a4a] text-white px-5 py-2 rounded-full"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Section>

              {instructions?.instructions && (
                <Section title="Event Instructions">
                  <SafeHtml
                    html={instructions.instructions.replace(
                      /\u2022/g,
                      "<br/>• "
                    )}
                  />
                </Section>
              )}

              {instructions?.whats_in && (
                <Section title={`What's in for you`}>
                  <SafeHtml
                    html={instructions.whats_in.replace(/\u2022/g, "<br/>• ")}
                  />
                </Section>
              )}

              {instructions?.faq && (
                <Section title="Frequently Asked Questions">
                  <SafeHtml
                    html={instructions.faq.replace(/\u2022/g, "<br/>• ")}
                  />
                </Section>
              )}
            </TabsContent>

            {/* EXPERT */}
            <TabsContent value="expert">
              {expert?.name ? (
                <Section>
                  <div className="flex gap-8">
                    <img
                      src={expert.profile_image || "/img/others/expert.png"}
                      className="w-40 h-40 rounded-2xl border-4 border-[#7fbc42]"
                    />
                    <div className="space-y-3">
                      <p className="text-white text-2xl font-bold">
                        {expert.name}
                      </p>
                      <p className="text-gray-300">{expert.role}</p>
                      <div className="flex flex-wrap gap-3">
                        {expert.skills?.map((s, i) => (
                          <Badge key={i} className="bg-[#4a4a4a] text-white">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Section>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No Expert Details Found
                </p>
              )}
            </TabsContent>

            {/* GALLERY */}
            <TabsContent value="gallery">
              <EventActivity />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

/* REUSABLE SECTION */
function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-gray-700">
      {title && (
        <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
      )}
      <div className="text-gray-300 leading-relaxed">{children}</div>
    </div>
  );
}