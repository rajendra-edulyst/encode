
import {
  getprofile,
} from "./openService";
import { useState, useEffect, useMemo, useRef } from "react";
import type { Profile, BasicInfoSection, Section } from "./openService";
import { Link, useParams } from "react-router-dom";
import { RiBriefcaseFill } from "react-icons/ri";
import { BsAwardFill } from "react-icons/bs";

import { getMentorAvailableSlotCount } from "@/utils/mentorSlots";
import { socialIcons } from "../components/SocialIcons/socialIcons";
import QRCode from "react-qr-code";
import { Skeleton } from "@/components/ui/skeleton";
import LottieAnimation from "@/components/ui/LottieAnimation";
import NoProfileFound from "@/assets/images/NoProfileFound.json";
import { Download, CalendarPlus } from "lucide-react";
import ExportMenu from "../exports/ExportMenu";
import { Button } from "@/components/ui/ShadcnButton";
import slotAvailableBadge from '@/assets/icons/svg/slot_available.svg';
import SEO from "@/components/SEO/SEO";
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const ProfileView = () => {
  const { org_id, uniqueIdentifier } = useParams();
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [basicInfo, setBasicInfo] = useState<BasicInfoSection>(
    {} as BasicInfoSection
  );
  type AboutInfo = {
    current_role_head_line?: string;
    years_of_exp?: number | string;
    domain?: string;
    areas_of_expertise?: string;
    [key: string]: unknown;
  };

  const [about, setAbout] = useState<AboutInfo>({});
  const [profileSections, setProfileSections] = useState<Section[]>([]);
  const [exportPopupOpen, setExportPopupOpen] = useState(false);

  const socialLinks = useMemo(() => {
    const raw = profile?.profileSection?.social_links?.[0] || {};
    const allowedSocialPlatforms = new Set([
      "linkedin",
      "twitter",
      "instagram",
      "facebook",
      "youtube",
      "behance",
    ]);
    const platformOrder = [
      "linkedin",
      "twitter",
      "instagram",
      "facebook",
      "youtube",
    ];

    const normalizeUrl = (value: unknown) => {
      if (typeof value !== "string") return null;
      const trimmed = value.trim();
      if (!trimmed) return null;
      if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
      return `https://${trimmed}`;
    };

    const entries = Object.entries(raw)
      .map(([platform, value]) => ({
        platform: platform.toLowerCase() === "bee" ? "behance" : platform.toLowerCase(),
        url: normalizeUrl(value),
      }))
      .filter(
        (item): item is { platform: string; url: string } =>
          !!item.url &&
          !!socialIcons[item.platform] &&
          allowedSocialPlatforms.has(item.platform),
      )
      .sort((a, b) => {
        const aIndex = platformOrder.indexOf(a.platform);
        const bIndex = platformOrder.indexOf(b.platform);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      });

    const seen = new Set<string>();
    return entries.filter((item) => {
      const key = `${item.platform}:${item.url.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [profile?.profileSection?.social_links]);

  const publicSlotCount = useMemo(() => {
    return getMentorAvailableSlotCount(
      { slot_available: profile?.slot_available || basicInfo?.slot_available },
      null,
    );
  }, [profile?.slot_available, basicInfo?.slot_available]);

  const [isLoading, setIsLoading] = useState(true);
  const trackedProfileRef = useRef<string | null>(null);

  const loadSections = async () => {
    try {
      setIsLoading(true);
      if (!org_id || !uniqueIdentifier) {
        console.error("org_id or uniqueIdentifier is missing");
        return;
      }
      const resolvedOrgId = org_id && !org_id.includes('-dae124fa') ? 'codeedu-dae124fa' : org_id;
      const response = await getprofile(resolvedOrgId, uniqueIdentifier);
      setProfile((response?.portfolio as Profile) || {});
      // ts-ignore
      setBasicInfo(response?.portfolio?.profileSection?.basic_info?.[0] as BasicInfoSection);
      setAbout(response?.portfolio?.profileSection?.about?.[0]);
      setProfileSections(response?.sections || []);

      if (response?.portfolio) {
        const currentId = String(response.portfolio.id || uniqueIdentifier);
        if (trackedProfileRef.current !== currentId) {
            mixpanelService.track(`Portfolio Viewed :- ${response.portfolio.name || ''}`, {
                entity_id: currentId,
                entity_name: response.portfolio.name || '',
                category: 'Portfolio',
                page_path: window.location.pathname,
                timestamp: new Date().toISOString()
            });
            trackedProfileRef.current = currentId;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function formatDate(value: any) {
    if (!value) return "";
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return String(value);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
    } catch {
      return String(value);
    }
  }

  function renderSectionHtml(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entry: Record<string, any>,
    html: string,
    fields: { fieldKey: string; dataType: string }[]
  ): string {
    return html.replace(/\${(.*?)}/g, (_, keyRaw) => {
      const key = keyRaw.trim();
      const value = entry[key];

      if (value === undefined || value === null || value === "") return "";

      const field = fields.find((f) => f.fieldKey === key);
      if (field?.dataType === "binary" && typeof value === "string") {
        return `<img src="${value}" alt="${key}" style="max-width: 100%; max-height: 150px; border-radius: 8px;" />`;
      }
      if (field?.dataType === "longtext") {
        return `<div style="white-space: pre-wrap;" class="line-clamp-2 text-sm">${value}</div>`;
      }
      if (field?.dataType === "date") {
        try {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            return d.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
            });
          }
        } catch {
          return String(value);
        }
      }
      return String(value);
    });
  }


  const allowedOrder = [
    "about",
    "academic_experince",
    "experience_summary",
    "areas_of_expertise",
    "industry_experience",
    "education",
    "skills",
    "tools_software",
    "certificates",
    "uploadresume"
  ];

  useEffect(() => {
    loadSections();
    // eslint-disable-next-line
  }, [org_id, uniqueIdentifier]);


  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-[80%] mx-auto py-10 mt-10 px-4 sm:px-6">
        <Skeleton className="h-[250px] w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-[100px] w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-[100px] w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  if (!basicInfo?.name) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[70vh]">
        <div className="w-72 h-72">
          <LottieAnimation animationData={NoProfileFound} />
        </div>
        <h2 className="text-2xl font-semibold mt-4 dark:text-gray-200">Profile Not Found</h2>
        <p className="text-gray-500 mt-2">We couldn&apos;t find the profile you are looking for.</p>
      </div>
    );
  }

  const fullName = `${profile?.name || basicInfo?.name || ""} ${basicInfo?.lastName || basicInfo?.last_name || ""}`.trim();
  const displayRole = about?.current_role_head_line || "Professional";
  const experienceYears = Number(about?.years_of_exp) || 0;
  const topExpertise = about?.domain && about?.domain !== 'nan' ? about?.domain : about?.areas_of_expertise;

  return (
    <div className="p-8">
      <SEO
        title={`${fullName} | Mentor at enCODE`}
        description={`${fullName} is ${displayRole} on enCODE.${experienceYears > 0 ? ` ${experienceYears}+ years of experience.` : ''}${topExpertise ? ` Expert in ${topExpertise}.` : ''}`}
        image={basicInfo?.profilePicture || undefined}
      />
      <div className="w-full items-center min-h-screen space-y-4">
        {/* --- Header (Banner) --- */}
        {/* --- Header (Banner) --- */}
        <section className={`rounded-xl overflow-hidden dark:bg-[#1D1D1D] relative p-6 sm:p-8`}>
          <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8">
            {/* Left side: Profile Image & Details */}
            <div className="flex flex-col sm:flex-row w-full items-start gap-4 sm:gap-6 group cursor-pointer">
              <div className="flex justify-between w-full sm:w-auto items-start">
                <div className="relative">
                  <img
                    src={`${basicInfo?.profilePicture}?${Date.now()}`}
                    alt="Profile"
                    className="rounded-lg w-28 h-28 sm:w-36 sm:h-36 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {(() => {
                    const hasSlots = profile?.slot_available === 1 || basicInfo?.slot_available === 1 || publicSlotCount > 0;
                    if (hasSlots) {
                      return (
                        <img
                          src={slotAvailableBadge}
                          alt="Slots available"
                          title="Slots available"
                          className="absolute z-10 pointer-events-none select-none bottom-[-10px] left-[-20px] w-[80px] sm:w-[98px] h-auto"
                        />
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              <div className="text-gray-950 w-full dark:text-white mt-2 sm:mt-0">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {profile?.name || basicInfo?.name} {basicInfo?.lastName || basicInfo?.last_name || ""}
                </h2>
                <p className="text-base text-gray-700 dark:text-gray-400 mt-2">
                  {about?.current_role_head_line}
                </p>

                <div className="mt-4 space-y-2 sm:space-y-4">
                  <p className="text-sm text-start mb-1 text-codeblue">
                    <RiBriefcaseFill className="inline-block mr-1" size={12} />
                    Experience -{' '}
                    <span className="font-semibold text-cblack dark:text-white">
                      {about?.years_of_exp ?? '-'} {(() => {
                        const y = Number(about?.years_of_exp as unknown);
                        return Number.isFinite(y) ? (y > 1 ? 'years' : 'year') : '';
                      })()}
                    </span>
                  </p>
                  <p className="text-sm text-start line-clamp-2 text-codeblue">
                    <BsAwardFill className="inline-block mr-1" size={12} />
                    Expertise -{' '}
                    <span className="font-semibold text-cblack dark:text-white">
                      {about?.domain && about?.domain !== 'nan'
                        ? (<>{about?.domain}</>)
                        : (about?.areas_of_expertise ? (<>{about?.areas_of_expertise}</>) : (<></>))}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Actions & Desktop QR */}
            <div className="flex flex-col items-start sm:items-end justify-between gap-6 min-w-[200px] w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  onClick={() => setExportPopupOpen(true)}
                  className="flex items-center justify-center p-2.5 sm:p-3 bg-gray-100 dark:bg-[#2A2A2A] rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  title="Download Resume"
                >
                  <Download className="w-5 h-5 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-200" />
                </button>
                {socialLinks.slice(0, 4).map(({ platform, url }) => (
                  <a
                    key={`${platform}-${url}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label={`Open ${platform} profile`}
                    title={platform}
                  >
                    <img
                      src={socialIcons[platform]}
                      alt={platform}
                      className="h-9 w-9 sm:h-11 sm:w-11 object-contain"
                    />
                  </a>
                ))}
              </div>

              {/* QR and Book & Connect */}
              <div className="flex items-stretch gap-4 mt-auto w-full sm:w-auto justify-start sm:justify-end">
                {(() => {
                  const isMentorActive = basicInfo?.is_mantor !== false && basicInfo?.is_mentor !== false && profile?.is_mantor !== false && profile?.is_mentor !== false;
                  if (!isMentorActive) return null;

                  const hasSlots = profile?.slot_available === 1 || basicInfo?.slot_available === 1 || publicSlotCount > 0;
                  if (!hasSlots) return null;

                  const buttonContent = (
                    <Button
                      className="text-black flex items-center justify-center flex-col p-1.5 text-center h-20 w-20 bg-codeyellow hover:bg-[#e6c62c] rounded-lg shadow-sm text-xs font-semibold whitespace-pre-wrap transition-colors leading-tight"
                    >
                      <CalendarPlus className="w-4 h-4 mb-1" /> Book &<br/>Connect
                    </Button>
                  );

                  return (
                    <Link to={`/calendar/create?userType=mentor&id=${profile?.uniqueIdentifier}`}>
                      {buttonContent}
                    </Link>
                  );
                })()}

                <div className="bg-white p-1.5 rounded-lg shadow-sm flex items-center justify-center h-20 w-20">
                  <QRCode value={window.location.href} size={64} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Dynamic Sections --- */}
        {profileSections
          .filter((s) =>
            profile?.profileSection
              ? Object.hasOwn(profile.profileSection, s.SectionKey)
              : false
          )
          .filter((s) => allowedOrder.includes(s.SectionKey))
          .sort(
            (a, b) =>
              allowedOrder.indexOf(a.SectionKey) -
              allowedOrder.indexOf(b.SectionKey)
          )
          .map((section) => {
            const sectionData = profile?.profileSection?.[section.SectionKey] || [];

            return (
              <section
                key={section.SectionKey}
                className="bg-white dark:bg-[#1D1D1D] rounded-xl overflow-hidden py-3 px-5"
              >
                <div className="flex justify-between mb-2 sm:mb-4">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {section.name}
                  </h2>
                </div>

                {sectionData.length > 0 ? (
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {sectionData.map((entry: any, i: number) => (
                      <div key={i} className="relative">
                        {section.sectionHtml ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: renderSectionHtml(
                                entry,
                                section.sectionHtml,
                                section.fields
                              ).replace(/line-clamp-\d+/g, ""),
                            }}
                          />
                        ) : (
                          <ul className="text-sm text-gray-700 dark:text-gray-200 list-disc list-inside space-y-1">
                            {section.fields.map((field) => {
                              const key = field.fieldKey;
                              const value = entry[key];
                              if (key === "id" || value === null || value === undefined) return null;

                              if (field.dataType === "binary" && typeof value === "string") {
                                return (
                                  <li key={key}>
                                    <strong>{field.name}:</strong>
                                    <div className="mt-1">
                                      <img
                                        src={value}
                                        alt={field.name}
                                        className="max-h-36 rounded"
                                      />
                                    </div>
                                  </li>
                                );
                              }

                              if (field.dataType === "date") {
                                return (
                                  <li key={key}>
                                    <strong>{field.name}:</strong> {formatDate(value)}
                                  </li>
                                );
                              }

                              return (
                                <li key={key}>
                                  <strong>{field.name}:</strong> {String(value)}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No data yet.</p>
                )}
              </section>
            );
          })}
      </div>
      <ExportMenu profile={profile as any} open={exportPopupOpen} onClose={() => setExportPopupOpen(false)} profileSections={profileSections as any} />
    </div>
  );
};

export default ProfileView;
