import {
    getprofile,
} from "./openService";
import { useState, useEffect } from "react";
import type { Profile, BasicInfoSection, Section } from "./openService";
import { useParams } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import CustomButton from "./../components/ui/CustomButton";

const ProfileView = () => {
    const { org_id, uniqueIdentifier } = useParams();
    const [profile, setProfile] = useState<Profile>({} as Profile);
    const group = useThemeStore((state) => state.group);
    const [basicInfo, setBasicInfo] = useState<BasicInfoSection>(
        {} as BasicInfoSection
    );
    const [about, setAbout] = useState<string>("");

    const [profileSections, setProfileSections] = useState<Section[]>([]);

    const loadSections = async () => {
        try {
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
        } catch (error) {
            console.error(error);
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
        entry: Record<string, any>,
        html: string,
        fields: { fieldKey: string; dataType: string }[]
    ): string {
        return html.replace(/\${(.*?)}/g, (_, keyRaw) => {
            const key = keyRaw.trim();
            let value = entry[key];

            if (value === undefined || value === null || value === "") return "";

            const field = fields.find((f) => f.fieldKey === key);

            if (field?.dataType === "binary" && typeof value === "string") {
                return `<img src="${value}" alt="${key}" style="max-width: 100%; max-height: 150px; border-radius: 8px;" />`;
            }

            if (field?.dataType === "longtext") {
                // 🧹 Clean up indentation on every line while keeping line breaks
                value = value
                    .split("\n")
                    .map((line) => line.replace(/^\s+/, "")) // remove leading spaces on each line
                    .join("\n")
                    .trim(); // remove overall leading/trailing newlines/spaces

                const textId = `longtext-${key}-${Math.random().toString(36).substring(2, 9)}`;

                return `
        <div 
          id="${textId}" 
          class="longtext-preview !text-xs" 
          >${value}
        </div>
      `;
            }

            // 📅 Handle dates
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

            // 🧩 Default fallback
            return String(value);
        });
    }

    useEffect(() => {
        loadSections();
        // eslint-disable-next-line
    }, [org_id, uniqueIdentifier]);

    const allowedOrder = [
        "about.education",
        "academic_experince",
        "industry_experience",
        "certificates",
        "publications",
    ];


    return (
        <div>
            <div className="w-full items-center min-h-screen space-y-4">
                <section style={{ boxShadow: "0px 3px 5px rgba(127, 188, 66, 0.04)" }} className={`rounded-md border border-primary overflow-hidden bg-[${group === 'create' ? '#FCE5F3' : group === 'connect' ? '#E5F5FB' : group === 'collaborate' ? '#F2F8EC' : '#F5F5F5'}]`}>
                    {/* <div className="relative w-full aspect-[3/1] sm:aspect-[6/1] bg-gray-100">
                    <div className="relative w-full aspect-[3/1] sm:aspect-[6/1]">
                      <img
                        src={`${basicInfo?.coverPicture}?${Date.now()}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
        
                      <div className="absolute top-4 right-4 z-10">
                        <button
                          type="button"
                          className="px-2 py-2 text-sm font-medium bg-white text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                          onClick={onCoverImageClick}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <input
                          ref={CoverInputRef}
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              handleUpdateCoverImage(file);
                            }
                          }}
                        />
                      </div>
        
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
        
                    <div className="absolute bottom-[10%] sm:bottom-[15%] left-6 translate-y-1/2 flex items-end gap-4 group cursor-pointer">
                      <div className="relative" onClick={onProfileImageClick} >
                        <img
                          src={`${basicInfo?.profilePicture}?${Date.now()}`}
                          // alt="Profile"
                          className="w-24 h-24 sm:w-36 sm:h-36 bg-white rounded-full border-4 border-gray-50 drop-shadow-sm object-cover transition hover:brightness-90"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
                          <span className="text-white text-sm font-medium">Change</span>
                        </div>
                        <input
                          ref={ProfileInputRef}
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              handleUpdateProfileImage(file);
                            }
                          }}
                        />
                      </div>
        
                    </div>
                    {profile.isVerified && (
                      <div className="hidden sm:block absolute bottom-[-3.5rem] right-6">
                        <span className="flex items-center bg-gray-100 text-sm px-2.5 py-2 rounded-full border border-gray-300 shadow-sm">
                          <div className="rounded-full p-[3px] bg-green-500 mr-2">
                            <BadgeCheck className="text-white w-4 h-4" />
                          </div>
                          <p className="text-sm font-medium text-black">
                            Verified profile
                          </p>
                        </span>
                      </div>
                    )}
        
                    <div className="hidden sm:block absolute right-4 -bottom-[11.5rem]">
                      <canvas ref={canvasRef} />
                    </div>
                    {profile.isVerified && (
                      <div className="sm:hidden absolute bottom-[-3rem] right-3">
                        <div className="rounded-full p-[3.5px] bg-green-500 mr-2">
                          <BadgeCheck className="text-white w-6 h-6" />
                        </div>
                      </div>
                    )}
                  </div> */}

                    <div className="mt-8 sm:mt-8">


                        <div className="px-6 pb-6">
                            <div className="flex justify-between ">
                                <div className="flex items-start gap-4 group cursor-pointer">
                                    <div className="relative !min-w-36" >
                                        <img
                                            src={`${basicInfo?.profilePicture}?${Date.now()}`}
                                            // alt="Profile"
                                            className="w-24 h-24 sm:w-36 sm:h-36 bg-white rounded-full border-4 border-primary drop-shadow-md object-cover transition hover:brightness-90"
                                        />

                                    </div>


                                    <div className="text-gray-950">
                                        <h2 className="text-xl sm:text-2xl font-bold">
                                            {basicInfo?.name}

                                        </h2>
                                        <span className="text-xs">{about?.about_me}</span>
                                        <CustomButton
                                            className="mt-2"
                                            onClick={() => {
                                                const profileView = `${window.location.origin}/portfolio/${org_id}/${uniqueIdentifier}`;
                                                window.open(profileView, "_blank");
                                            }}
                                        >View Protfolio</CustomButton>

                                    </div>
                                </div>


                            </div>



                        </div>
                    </div>
                </section>


                <section className="mt-4 space-y-6 bg-white p-4 border border-gray-200 rounded-md">
                    <span><span className="font-semibold">Current Designation:</span> {about?.current_role_head_line}</span>
                </section>

                {/* --- Dynamic Sections --- */}
                {profileSections
                    .filter((s) => {
                        if (!profile?.profileSection) return false;
                        return Object.hasOwn(profile.profileSection, s.SectionKey);
                    })
                    // Only keep sections that match your allowed keys
                    .filter((s) => allowedOrder.includes(s.SectionKey))
                    // Sort in the defined order
                    .sort(
                        (a, b) =>
                            allowedOrder.indexOf(a.SectionKey) - allowedOrder.indexOf(b.SectionKey)
                    )
                    .map((section) => {
                        const sectionData = profile?.profileSection?.[section.SectionKey] || [];

                        return (
                            <section
                                key={section.SectionKey}
                                className="bg-white rounded-md border border-gray-200 overflow-hidden py-3 px-5"
                            >
                                <div className="flex justify-between mb-2 sm:mb-4">
                                    <h2 className="text-base sm:text-xl font-semibold text-gray-900">
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
                                                            ),
                                                        }}
                                                    />
                                                ) : (
                                                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
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
        </div>
    );
};

export default ProfileView;
