import React, { useState, useEffect } from "react";
import { getprofile } from "./openService";
import type { Profile, BasicInfoSection, Section } from "./openService";
import { useThemeStore } from "@/store/themeStore";
import CustomButton from "../components/ui/CustomButton";
import { Link } from "react-router-dom";

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  org_id: string;
  uniqueIdentifier: string;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({
  isOpen,
  onClose,
  org_id,
  uniqueIdentifier,
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [basicInfo, setBasicInfo] = useState<BasicInfoSection | null>(null);
  const [about, setAbout] = useState<any>(null);
  const [profileSections, setProfileSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const group = useThemeStore((state) => state.group);

  const loadSections = async () => {
    if (!org_id || !uniqueIdentifier) return;

    setLoading(true);
    setProfile(null); // clear old data
    setBasicInfo(null);
    setAbout(null);
    setProfileSections([]);

    try {
      const resolvedOrgId = org_id && !org_id.includes('-dae124fa') ? 'codeedu-dae124fa' : org_id;
      const response = await getprofile(resolvedOrgId, uniqueIdentifier);
      const portfolio = response?.portfolio as Profile;

      setProfile(portfolio);
      setBasicInfo(portfolio?.profileSection?.basic_info?.[0] || null);
      setAbout(portfolio?.profileSection?.about?.[0] || null);
      setProfileSections(response?.sections || []);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSections();
    }
  }, [isOpen, org_id, uniqueIdentifier]);

  const formatDate = (value: any) => {
    if (!value) return "";
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return String(value);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
    } catch {
      return String(value);
    }
  };

  const renderSectionHtml = (
    entry: Record<string, any>,
    html: string,
    fields: { fieldKey: string; dataType: string }[]
  ): string => {
    return html.replace(/\${(.*?)}/g, (_, keyRaw) => {
      const key = keyRaw.trim();
      let value = entry[key];
      if (value === undefined || value === null || value === "") return "";

      const field = fields.find((f) => f.fieldKey === key);
      if (field?.dataType === "binary" && typeof value === "string") {
        return `<img src="${value}" alt="${key}" style="max-width:100%;max-height:150px;border-radius:8px;" />`;
      }
      if (field?.dataType === "longtext") {
        value = value
          .split("\n")
          .map((line: string) => line.trimStart())
          .join("\n")
          .trim();
        return `<div class="longtext-preview text-xs">${value}</div>`;
      }
      if (field?.dataType === "date") return formatDate(value);
      return String(value);
    });
  };

  const allowedOrder = [
    "about.education",
    "academic_experince",
    "industry_experience",
    "certificates",
    "publications",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center overflow-y-auto p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="p-6 space-y-6">
          {loading ? (
            // 🔄 Skeleton Loader
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-gray-300 dark:bg-gray-700 w-24 h-24 rounded-md"></div>
                <div className="space-y-3 w-full">
                  <div className="h-5 bg-gray-300 dark:bg-gray-700 w-2/3 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 w-1/2 rounded"></div>
                  <div className="flex gap-2 mt-3">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 w-24 rounded"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 w-24 rounded"></div>
                  </div>
                </div>
              </div>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-300 dark:bg-gray-700 rounded-md"
                ></div>
              ))}
            </div>
          ) : (
            <>
              {/* ===== Top Section ===== */}
              <section className="overflow-hidden border-b border-gray-200 dark:border-gray-700">
                <div className="mt-8 px-6 pb-6">
                  <div className="flex items-start gap-4 group cursor-pointer">
                    <img
                      src={`${basicInfo?.profilePicture || "/placeholder.jpg"}?${Date.now()}`}
                      className="w-24 h-24 sm:w-36 sm:h-36 bg-white rounded-md border border-primary object-cover"
                    />
                    <div className="text-gray-950 justify-between dark:text-gray-200">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold">
                          {basicInfo?.name || "Loading..."}
                        </h2>
                        <span>{about?.current_role_head_line}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`${window.location.origin}/calendar/create?userType=mentor&id=${uniqueIdentifier}`}
                        >
                          <CustomButton className="mt-4">
                            Schedule a meeting
                          </CustomButton>
                        </Link>

                        <CustomButton
                          className="mt-4"
                          onClick={() => {
                            const profileView = `${window.location.origin}/portfolio/${org_id}/${uniqueIdentifier}`;
                            window.open(profileView, "_blank");
                          }}
                        >
                          View Portfolio
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ===== Dynamic Sections ===== */}
              {profileSections
                .filter(
                  (s) =>
                    profile?.profileSection &&
                    Object.hasOwn(profile.profileSection, s.SectionKey)
                )
                .filter((s) => allowedOrder.includes(s.SectionKey))
                .sort(
                  (a, b) =>
                    allowedOrder.indexOf(a.SectionKey) -
                    allowedOrder.indexOf(b.SectionKey)
                )
                .map((section) => {
                  const sectionData =
                    profile?.profileSection?.[section.SectionKey] || [];

                  return (
                    <section
                      key={section.SectionKey}
                      className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden py-3 px-5"
                    >
                      <div className="flex justify-between mb-2 sm:mb-4">
                        <h2 className="text-base dark:text-gray-200 sm:text-xl font-semibold text-gray-900">
                          {section.name}
                        </h2>
                      </div>

                      {sectionData.length > 0 ? (
                        <div className="space-y-3">
                          {sectionData.map((entry: any, i: number) => (
                            <div key={i}>
                              {section.sectionHtml ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: renderSectionHtml(
                                      entry,
                                      section.sectionHtml,
                                      section.fields
                                    ),
                                  }}
                                />
                              ) : (
                                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
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
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No data yet.</p>
                      )}
                    </section>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;
