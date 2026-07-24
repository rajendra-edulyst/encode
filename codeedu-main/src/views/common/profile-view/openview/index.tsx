import { cn } from "@/lib/utils";
import {
  getprofile,
} from "./openService";
import { useState, useEffect, useMemo } from "react";
import type { Profile, BasicInfoSection, Section } from "./openService";
import { Link, useParams } from "react-router-dom";
import { CalendarPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/ShadcnButton";
import { RiBriefcaseFill } from "react-icons/ri";
import { BsAwardFill } from "react-icons/bs";
import { useMentorListV2 } from "@/hooks/data/faculty/useMentor";
import { getMentorAvailableSlotCount } from "@/utils/mentorSlots";
import { socialIcons } from "../components/SocialIcons/socialIcons";
import QRCode from "react-qr-code";
import ExportMenu from "../exports/ExportMenu";
import slotAvailableBadge from '@/assets/icons/svg/slot_available.svg';
import SEO from "@/components/SEO/SEO";

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
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  const { data: mentorListV2 = [] } = useMentorListV2();
  const publicSlotCount = useMemo(() => {
    if (!uniqueIdentifier) return 0;
    const uid = String(uniqueIdentifier);
    const email = basicInfo?.email?.trim();
    const row = mentorListV2.find(
      (m) => String(m.id) === uid || (!!email && m.email === email),
    );
    return getMentorAvailableSlotCount(
      { slot_available: row?.slot_available },
      null,
    );
  }, [mentorListV2, uniqueIdentifier, basicInfo?.email]);

  const loadSections = async () => {
    try {
      setLoading(true);
      setHasError(false);
      if (!org_id || !uniqueIdentifier) {
        console.error("org_id or uniqueIdentifier is missing");
        setHasError(true);
        return;
      }
      const resolvedOrgId = org_id && !org_id.includes('-dae124fa') ? 'codeedu-dae124fa' : org_id;
      const response = await getprofile(resolvedOrgId, uniqueIdentifier);
      setProfile((response?.portfolio as Profile) || {});
      // ts-ignore
      setBasicInfo(response?.portfolio?.profileSection?.basic_info?.[0] as BasicInfoSection);
      setAbout(response?.portfolio?.profileSection?.about?.[0]);
      setProfileSections(response?.sections || []);
    } catch (error) {
      console.error(error);
      setHasError(true);
    } finally {
      setLoading(false);
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

  const fullName = `${profile?.name || basicInfo?.name || ""} ${basicInfo?.lastName || basicInfo?.last_name || ""}`.trim();
  const displayRole = about?.current_role_head_line || "Professional";
  const experienceYears = Number(about?.years_of_exp) || 0;
  const topExpertise = about?.domain && about?.domain !== 'nan' ? about?.domain : about?.areas_of_expertise;

  return (
    <div>
      <SEO
        title={`${fullName} | Mentor at enCODE`}
        description={`${fullName} is ${displayRole} on enCODE.${experienceYears > 0 ? ` ${experienceYears}+ years of experience.` : ''}${topExpertise ? ` Expert in ${topExpertise}.` : ''}`}
        image={basicInfo?.profilePicture || undefined}
      />
      <div className="w-full items-center min-h-screen space-y-4">
        {/* --- Header (Banner) --- */}
        <section className={`rounded-xl overflow-hidden dark:bg-[#1D1D1D] relative`}>
          <div className="mt-8 sm:mt-8">
            <div className="px-6 pb-6">
              <div className="flex justify-between ">
                <div className="flex flex-col w-full items-start gap-4 group cursor-pointer">
                  <div className="relative" >
                    {loading || hasError || !basicInfo?.profilePicture ? (
                      <div className="rounded-lg w-36 h-36 bg-gray-300 dark:bg-gray-700 animate-pulse object-cover"></div>
                    ) : (
                      <img
                        src={`${basicInfo?.profilePicture}?${Date.now()}`}
                        // alt="Profile"
                        className="rounded-lg w-36 h-36 object-cover
                    transition-transform duration-300
                    hover:scale-105"
                      />
                    )}
                    {publicSlotCount > 0 && !loading && !hasError && (
                      <img
                        src={slotAvailableBadge}
                        alt={`${publicSlotCount} slot${publicSlotCount === 1 ? '' : 's'} available`}
                        title={`${publicSlotCount} open slot${publicSlotCount === 1 ? '' : 's'}`}
                        className="
                          absolute z-10 pointer-events-none select-none
                          -left-3 -bottom-3
                          w-[84px] sm:w-[92px] md:w-[98px] h-auto
                        "
                      />
                    )}
                  </div>


                  <div className="text-gray-950 w-full dark:text-white">
                    {loading || hasError ? (
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse"></div>
                    ) : (
                      <h2 className="text-xl sm:text-3xl font-bold">
                        {profile?.name || basicInfo?.name} {basicInfo?.lastName || basicInfo?.last_name || ""}
                      </h2>
                    )}

                    {loading || hasError ? (
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mt-2 animate-pulse"></div>
                    ) : (
                      <p className="text-base text-gray-700 dark:text-gray-600 mt-2">{about?.current_role_head_line}</p>
                    )}

                    <div className="justify-between flex !w-full items-start gap-4 mt-4">
                      <div className="space-y-4">
                        {loading || hasError ? (
                          <>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {loading || hasError ? (
                          <div className="bg-gray-300 dark:bg-gray-700 w-[76px] h-[76px] rounded-lg animate-pulse"></div>
                        ) : (
                          <div className="bg-white p-1.5 rounded-lg shadow-sm">
                            <QRCode value={window.location.href} size={64} />
                          </div>
                        )}
                        {(() => {
                          const isMentorActive = basicInfo?.is_mantor !== false && basicInfo?.is_mentor !== false && profile?.is_mantor !== false && profile?.is_mentor !== false;
                          if (!isMentorActive) return null;

                          const buttonContent = (
                            <Button
                              disabled={publicSlotCount <= 0}
                              className={cn(
                                "text-black max-w-24 flex items-center flex-col px-6 text-wrap h-full bg-codeyellow",
                                publicSlotCount <= 0 && "opacity-50 grayscale cursor-not-allowed"
                              )}
                            >
                              <CalendarPlus /> Book & Connect
                            </Button>
                          );

                          if (publicSlotCount <= 0) return buttonContent;

                          return (
                            <Link to={`/calendar/create?userType=mentor&id=${profile?.uniqueIdentifier}`}>
                              {buttonContent}
                            </Link>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {!loading && !hasError && socialLinks.length > 0 && (
                  <div className="absolute top-7 right-8 flex items-center gap-4 z-20">
                    <button onClick={() => setExportPopupOpen(true)} className="inline-flex items-center justify-center hover:scale-110 transition-transform h-11 w-11 bg-gray-100 dark:bg-[#2A2A2A] rounded-full text-gray-700 dark:text-gray-200" title="Download Resume">
                      <Download className="w-5 h-5" />
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
                          className="h-11 w-11 object-contain"
                        />
                      </a>
                    ))}
                  </div>
                )}
                {socialLinks.length === 0 && (
                  <div className="absolute top-7 right-8 flex items-center gap-4 z-20">
                    <button onClick={() => setExportPopupOpen(true)} className="inline-flex items-center justify-center hover:scale-110 transition-transform h-11 w-11 bg-gray-100 dark:bg-[#2A2A2A] rounded-full text-gray-700 dark:text-gray-200" title="Download Resume">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                )}


              </div>
            </div>
          </div>


        </section>

        {/* --- Dynamic Sections --- */}
        {loading || hasError ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 w-full bg-gray-200 dark:bg-[#1D1D1D] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {profileSections
              .filter(
                (s) =>
                  profile?.profileSection &&
                  Object.hasOwn(profile.profileSection, s.SectionKey),
              )
              .filter((s) => allowedOrder.includes(s.SectionKey))
              .sort(
                (a, b) =>
                  allowedOrder.indexOf(a.SectionKey) -
                  allowedOrder.indexOf(b.SectionKey),
              )
              .map((section) => {
                const sectionData = profile?.profileSection[section.SectionKey] || [];

                return (
                  <section
                    key={section.SectionKey}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden dark:bg-[#111111]"
                  >
                    <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                      <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-gray-200">
                        {section.name}
                      </h2>
                    </div>
                    {sectionData.length > 0 ? (
                      <div className="px-6 py-4 space-y-4">
                        {sectionData.map(
                          (entry: Record<string, unknown>, i: number) => (
                            <div key={i}>
                              {section.sectionHtml ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: renderSectionHtml(
                                      entry,
                                      section.sectionHtml,
                                      section.fields,
                                    ),
                                  }}
                                />
                              ) : (
                                <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                                  {section.fields.map((field) => {
                                    const key = field.fieldKey;
                                    const value = entry[key];
                                    if (!value || key === "id") return null;

                                    if (
                                      field.dataType === "binary" &&
                                      typeof value === "string"
                                    ) {
                                      return (
                                        <li key={key}>
                                          <strong>{field.name}:</strong>
                                          <div className="mt-2">
                                            <img
                                              src={value}
                                              alt={field.name}
                                              className="max-h-40 rounded"
                                            />
                                          </div>
                                        </li>
                                      );
                                    }

                                    if (field.dataType === "date") {
                                      return (
                                        <li key={key}>
                                          <strong>{field.name}:</strong>{" "}
                                          {formatDate(value)}
                                        </li>
                                      );
                                    }

                                    return (
                                      <li key={key}>
                                        <strong>{field.name}:</strong>{" "}
                                        {String(value)}
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="px-6 py-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No {section.name.toLowerCase()} added yet.
                        </p>
                      </div>
                    )}
                  </section>
                );
              })}
          </div>
        )}
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ExportMenu profile={profile as any} open={exportPopupOpen} onClose={() => setExportPopupOpen(false)} profileSections={profileSections as any} />
    </div>
  );
};

export default ProfileView;
