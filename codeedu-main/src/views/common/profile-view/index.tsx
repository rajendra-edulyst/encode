import {
  getprofile,
  addProfileSectionEntry,
  deleteProfileSectionEntry,
  updateProfileSectionEntry,
  updateProfileImage,
  updateCoverImage,
  RequestVerification,
  UpatePreferences,
  addSocialLinks,
  deleteResumeById
} from "./services/profileService";
import { useState, useEffect, useRef, useMemo } from "react";
import type { Profile, BasicInfoSection } from "./services/profileService";
import type { Section } from "./services/sectionService";
import { useSessionUser } from "@/store/authStore";
import { colorStyles } from '@/lib/packageColor';
import { Pencil, CalendarCheck2, CalendarPlus, Plus, BadgeCheck, FileText, Trash2 as Trash, Upload, DownloadIcon, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from '@/components/ui/switch';
import CustomButton from "./components/ui/CustomButton";
import DynamicSectionForm from "./components/DynamicSectionForm";
import DynamicEditSectionForm from "./components/DynamicEditSectionForm";
import SharePopup from "./components/SharePopup";
import PreferencesPopup from "./components/PreferencesPopup";
import SocialLinks from "./components/SocialLinks";
import AvailabilityPopup from "./components/AvailabilityPopup";
import { SHARE_PROFILE_URL } from "./config";
import { RenderWhenNoEditKeyFound } from "./NoEditKeyFound";
import { fetchUpdateImage, listVideoResume, addResume } from "@/services/learner/PortfolioService";
import ExportMenu from "./exports/ExportMenu";
import QRCode from 'qrcode';
import { getUsersPortfolioKeys, fetchUsersCertificate, fetchUsersSkills, fetchUsersToolsSoftware } from "@/services/portfolio/PortfolioService";
import Loading from "@/components/shared/Loading";
import { usePackageDetails, useUserPackageDetails, useUserProfile } from '@/hooks/data/useGettingStarted';
import { Button } from "@/components/ui/ShadcnButton";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { saveUserInterest } from "@/services/getting-started";
import { useAuth } from "@/auth";
import { FetchUsersCertificateResponse, Skills, UserCertificate, ToolsSoftware } from "@/@types/portfolio";
import { toast } from "sonner";
import { AnalyticsLoggingService } from "@/services/analytics-logging/AnalyticsLoggingService";
import { AnalyticsEventType } from "@/@types/analytics-logging";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddResume from "../profile/builder/AddResume";
import { PersonaInsightsSection } from "@/views/persona-insights";
import { getProfileCompleteness } from "@/views/collaborate/opportunities/services/jobApplicationService";
import { mixpanelService } from "@/services/mixpanel/MixpanelService";
import ApiService from "@/services/ApiService";
import school from "@/assets/images/school.png";
import edit from "@/assets/images/edit.png";

const formatAssignedDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    // day: 'numeric',
    month: "short",
    year: "numeric",
  });
};


const ProfileView = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const { profile: profileData } = useSessionUser();
  const analyticsLogger = AnalyticsLoggingService.init(user);
  const userIsMentor = profileData === "mentor";
  const [isEditKeyAvailable, setIsEditKeyAvailable] = useState(false);
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [basicInfo, setBasicInfo] = useState<BasicInfoSection>(
    {} as BasicInfoSection
  );

  const navigate = useNavigate();
  const location = useLocation();
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [profileSections, setProfileSections] = useState<Section[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editEntry, setEditEntry] = useState<any | null>(null); // entry to edit
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [preferencesPopupOpen, setPreferencesPopupOpen] = useState(false);
  const [addProfileSectionPopupOpen, setAddProfileSectionPopupOpen] = useState(false);
  const [userCertificate, setUserCertificate] = useState<UserCertificate[]>()
  const [verifedSkills, setVerifedSkills] = useState<Skills[]>()
  const [toolsSoftware, setToolsSoftware] = useState<ToolsSoftware[]>()
  const [resumes, setResumes] = useState<{ id: string; url: string; title: string; isLatest?: boolean }[]>([])
  const [isAddResumeOpen, setIsAddResumeOpen] = useState(false)
  const [isPreviewResumeOpen, setIsPreviewResumeOpen] = useState(false)
  const { data: userProfile, refetch: refetchUserProfile } = useUserProfile();
  const { data: packageDetails, refetch: refetchPackageDetails } = useUserPackageDetails(userProfile?.id || 0)

  useEffect(() => {
    refetchUserProfile();
    if (userProfile?.id) {
      refetchPackageDetails();
    }
  }, [refetchUserProfile, refetchPackageDetails, userProfile?.id]);

  const sectionNotTORender = ['skills', 'tools_software']

  const [shareUrl, setShareUrl] = useState("");

  const [exportPopupOpen, setExportPopupOpen] = useState(false);
  const [showAvailabilityPopup, setShowAvailabilityPopup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const ProfileInputRef = useRef<HTMLInputElement | null>(null);
  const CoverInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [profileSkills, setProfileSkills] = useState<any | []>()
  const [allSkills, setAllSkills] = useState<any[]>([])
  const packageData = useMemo(() => packageDetails?.data?.package, [packageDetails]);

  const [switches, setSwitches] = useState({
    is_hire_me_enabled: userProfile?.is_hire_me_enabled === 1,
    is_skill_up_enabled: userProfile?.is_skill_up_enabled === 1,
    is_hiring_now_enabled: userProfile?.is_hiring_now_enabled === 1,
    is_co_collab_now_enabled: userProfile?.is_co_collab_now_enabled === 1,
    is_co_create_enabled: userProfile?.is_co_create_enabled === 1,
  });
  const handleSwitchChange = (field: string, checked: boolean) => {
    setSwitches((prev) => ({
      ...prev,
      [field]: checked,
    }));
    const payload = {
      interest_value: 1,
      [field]: checked ? 1 : 0,
    };
    saveUserInterest(payload);
  };

  const groupedCategories = packageData && Object.values(
    packageData && packageData?.parameters.reduce((acc: any, item: any) => {
      const category = item.master.category.name;

      if (!acc[category]) {
        acc[category] = {
          category,
          colorCode: item.master.category.color_code,
          items: [],
        };
      }

      acc[category].items.push(item);

      return acc;
    }, {})
  );

  const packageColor = userProfile?.packages?.color_code || '#E60086';
  const searchParams = new URLSearchParams(location.search);
  const isIncompleteHighlightMode = searchParams.get('highlight') === 'incomplete';
  const returnJobId = searchParams.get('returnJobId') || '';
  const pendingApplicationRaw = sessionStorage.getItem('pendingJobApplication');
  let pendingApplication: { returnUrl?: string; jobId?: string } | null = null;
  if (pendingApplicationRaw) {
    try {
      pendingApplication = JSON.parse(pendingApplicationRaw) as { returnUrl?: string; jobId?: string };
    } catch (error) {
      console.error(error);
      pendingApplication = null;
    }
  }
  const mandatoryIncompleteSections = getProfileCompleteness(profile?.profileSection).incompleteSections;
  const isProfileCompleteForApply = mandatoryIncompleteSections.length === 0;

  const getSkillsMappedList = async () => {

    const param = new URLSearchParams();
    param.append("creative", "1")


    const [mappedResult, allResult] = await Promise.all([
      ApiService.fetchDataWithAxios<any>({ url: "skills-mapping-list", method: 'GET', params: param }),
      ApiService.fetchDataWithAxios<any>({ url: "skills-list", method: 'GET', params: param })
    ]);

    setProfileSkills(mappedResult?.data || []);
    setAllSkills(allResult?.data || []);
  }

  useEffect(() => {
    getSkillsMappedList()
  }, [])
  const trackedPageView = useRef(false);
  useEffect(() => {
    if (!trackedPageView.current) {
      mixpanelService.track("Portfolio Page Viewed");
      trackedPageView.current = true;
    }
  }, []);

  const loadUserCertificate = async () => {
    try {
      const res: FetchUsersCertificateResponse = await fetchUsersCertificate(
        String(user?.id)
      );

      if (res.status == 1) {
        const programCertificates = res.data.program_certificate.map((item) => ({
          ...item,
          type: "program" as const,
        }));

        const contentCertificates = res.data.content_certificate.map((item) => ({
          ...item,
          type: "content" as const,
        }));

        // Sort both groups individually by assigned_date
        const sortedProgram = programCertificates.sort(
          (a, b) =>
            new Date(b.assigned_date).getTime() -
            new Date(a.assigned_date).getTime()
        );

        const sortedContent = contentCertificates.sort(
          (a, b) =>
            new Date(b.assigned_date).getTime() -
            new Date(a.assigned_date).getTime()
        );

        // FINAL PRIORITY LIST
        const prioritizedCertificates: UserCertificate[] = [
          ...sortedProgram,       // programs first
          ...sortedContent        // then content
        ];

        setUserCertificate(prioritizedCertificates);
      }

      return res;
    } catch (err) {
      console.error(err);
    }
  };

  const loadUserSkills = async () => {
    try {
      const res = await fetchUsersSkills(String(user?.id));
      if (res.status === 1) {
        setVerifedSkills(res.data);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const loadUserToolsSoftware = async () => {
    try {
      const res = await fetchUsersToolsSoftware(String(user?.id));
      if (res.status === 1) {
        setToolsSoftware(res.data);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleShare = (type: string, cert: UserCertificate) => {
    const shareUrl = encodeURIComponent(cert.pdf_file_path);
    const title = encodeURIComponent(String(cert.course_name || cert.content_name) || "");

    analyticsLogger.logEvent({
      event: AnalyticsEventType.certificate_share,
      meta: {
        share_type: type,
        share_url: cert.pdf_file_path,
        certificate_number: cert.certificate_number,
      },
    });

    if (type === "linkedin")
      window.open(
        `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${title}`,
        "_blank"
      );

    if (type === "facebook")
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        "_blank"
      );

    if (type === "twitter")
      window.open(
        `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`,
        "_blank"
      );

    if (type === "whatsapp")
      window.open(
        `https://wa.me/?text=${title}%20${shareUrl}`,
        "_blank"
      );
  };

  const loadSections = async () => {
    try {
      const response = await getprofile();
      setShareUrl(`${SHARE_PROFILE_URL}/${response?.portfolio?.org_id}/${response?.portfolio?.uniqueIdentifier}`);
      setProfile((response?.portfolio as Profile) || {});
      // ts-ignore
      setBasicInfo(response?.portfolio?.profileSection?.basic_info?.[0] as BasicInfoSection);
      setSocialLinks(response?.portfolio?.profileSection?.social_links?.[0] || []);
      setProfileSections(response?.sections || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadResumes = async () => {
    try {
      const response = await getprofile();
      const profileResumes = response?.portfolio?.profileSection?.resumes || [];
      if (Array.isArray(profileResumes)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setResumes(profileResumes.map((r: any) => ({
          id: r.id,
          url: r.resume, // Map resume URL to the url property expected by the UI
          title: r.title || 'Untitled Resume',
          isLatest: r.isLatest
        })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResume = async (id: number | string) => {
    try {
      await deleteResumeById(String(id));
      toast.success("Resume deleted");
      loadResumes();
    } catch (err) {
      toast.error("Failed to delete resume");
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, shareUrl, { width: 160 });
    }
    if (shareUrl) {
      QRCode.toDataURL(shareUrl, { width: 160, margin: 1 })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('QR Generation Error:', err));
    }
  }, [shareUrl]);

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

      if (field?.dataType === "object" && typeof value === "string") {
        return `<a href="${value}" target="_blank" style="color: #0073b1; text-decoration: underline; font-size: 14px;">View Attachment</a>`;
      }

      if (field?.dataType === "longtext") {
        const value_trim: string = (value as string)
          .split("\n")
          .map((line: string) => line.replace(/^\s+/, ""))
          .join("\n")
          .trim();
        const textId = `longtext-${key}-${Math.random().toString(36).substring(2, 9)}`;

        return `
        <div 
          id="${textId}" 
          class="longtext-preview !text-xs dark:text-white" 
          style="
            white-space: pre-wrap;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 6;
            -webkit-box-orient: vertical;
          ">${value_trim}
        </div>
        <button 
          class="show-more-btn" 
          style="
            display: none;
            background: none;
            border: none;
            color: #0073b1;
            font-size: 12px;
            cursor: pointer;
            margin-top: 4px;
          "
          onclick="
            const textEl = document.getElementById('${textId}');
            const btn = this;
            if (textEl.style.webkitLineClamp === 'unset') {
              textEl.style.webkitLineClamp = '6';
              btn.textContent = '// Show more';
            } else {
              textEl.style.webkitLineClamp = 'unset';
              btn.textContent = '// Show less';
            }
          ">
          // Show more
        </button>
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
    const init = async () => {
      try {
        setLoading(true);
        const response = await getUsersPortfolioKeys();

        const isEditKey = localStorage.getItem("editKey");
        if (isEditKey) {
          setIsEditKeyAvailable(true);
          await loadUserCertificate();
          await loadUserSkills();
          await loadUserToolsSoftware();
          await loadResumes();
          setLoading(false);
          loadSections();
        } else {
          setIsEditKeyAvailable(false);
          setLoading(false);
        }

      } catch (error) {
        console.error("Error fetching user portfolio keys:", error);
      }
    };

    init();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const adjustShowMoreButtons = () => {
      const previews = document.querySelectorAll('.longtext-preview');
      previews.forEach((el) => {
        const textEl = el as HTMLElement;
        const btn = textEl.nextElementSibling as HTMLElement;
        if (btn && btn.classList.contains('show-more-btn')) {
          if (textEl.scrollHeight > textEl.clientHeight) {
            btn.style.display = 'inline-block';
          } else {
            btn.style.display = 'none';
          }
        }
      });
    };

    // Run after sections are loaded and rendered
    const timeoutId = setTimeout(adjustShowMoreButtons, 500);
    return () => clearTimeout(timeoutId);
  }, [profileSections, profile]);

  const handleAddClick = (section: Section) => {
    setActiveSection(section);
    setEditEntry(null); // ensure clean add mode
    setIsModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditClick = (section: Section, entry: any) => {
    setActiveSection(section);
    setEditEntry(entry); // populate form with data
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveSection(null);
    setEditEntry(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSectionSubmit = async (data: { Key: string; value: any }[]) => {
    const formData = new FormData();
    formData.append("SectionKey", activeSection?.SectionKey || "");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileSection: { Key: string; value: any }[] = [];

    for (const field of data) {
      const isFile = field.value instanceof File;
      if (isFile) {
        formData.append(field.Key, field.value);
      }
      profileSection.push({
        Key: field.Key,
        value: isFile ? null : field.value,
      });
    }

    if (editEntry?.id) {
      formData.append("entryId", editEntry.id); // include id for editing
    }

    formData.append("profileSection", JSON.stringify(profileSection));
    try {
      await addProfileSectionEntry(formData);
      toast.success("Section saved successfully");
      handleModalClose();
      loadSections();
    } catch (error) {
      console.error("Failed to save section entry:", error);
      toast.error("Failed to save section");
    }
  };

  const handleEditSectionSubmit = async (data: {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profileSection: { Key: string; value: any }[];
    files: Record<string, File | null>;
    successMessage?: string;
  }) => {
    if (!activeSection) return;

    try {
      await updateProfileSectionEntry(
        data.id,
        activeSection.SectionKey,
        data.profileSection,
        data.files,
      );
      toast.success(data.successMessage || "Section updated successfully");
      mixpanelService.track('Portfolio Saved', {
        section: activeSection?.SectionKey,
        timestamp: new Date().toISOString()
      })
      handleModalClose();
      loadSections();
    } catch (error) {
      console.error("Failed to update section entry:", error);
      toast.error("Failed to update section entry");
    }
  };

  const deleteProfileEntry = async (sectionKey: string, id: string) => {
    try {
      await deleteProfileSectionEntry(sectionKey, id);
      toast.success("Entry deleted successfully");
      loadSections();
    } catch (error) {
      console.error("Failed to delete section entry:", error);
      toast.error("Failed to delete entry");
    }
  };

  const handleUpdateProfileImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      await updateProfileImage(formData);
      await fetchUpdateImage(file);
      toast.success("Profile image updated");
      loadSections();
    } catch (error) {
      console.error("Failed to update profile image:", error);
      toast.error("Failed to update profile image");
    }
  };

  const onProfileImageClick = () => {
    ProfileInputRef.current?.click();
  };

  // eslint-disable-next-line
  const handleUpdateCoverImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("coverPicture", file);
      await updateCoverImage(formData);
      toast.success("Cover image updated");
      loadSections();
    } catch (error) {
      console.error("Failed to update cover image:", error);
      toast.error("Failed to update cover image");
    }
  };

  // eslint-disable-next-line
  const onCoverImageClick = () => {
    CoverInputRef.current?.click();
  };

  const SendRequestForVerfication = async () => {
    try {
      await RequestVerification();
      toast.success("Verification request sent");
      loadSections();
    } catch (error) {
      console.error("Failed to send verification request:", error);
      toast.error("Failed to send verification request");
    }
  };

  const handleSavePreferences = async (payload: { show_personal_info: boolean }) => {
    try {
      await UpatePreferences(payload);
      loadSections();
      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const handleSocialLinkSave = async (
    activePlatform: string,
    inputValue: string
  ) => {
    if (!activePlatform || !inputValue) return;

    try {
      await addSocialLinks(activePlatform, inputValue);

      // Optional: Update local state if needed
      setSocialLinks((prev) => ({
        ...prev,
        [activePlatform]: inputValue,
      }));
      toast.success("Social link updated");
    } catch (err) {
      toast.error("Failed to update social link");
    }
  };

  if (loading) {
    return <Loading loading></Loading>;
  }

  if (isEditKeyAvailable === false) {
    return <RenderWhenNoEditKeyFound></RenderWhenNoEditKeyFound>;
  }

  // console.log(profileSkills)


  const aboutMe = profile?.profileSection?.about?.[0]?.about_me || "";
  const latestResume = resumes.find(r => r.isLatest) || resumes[0];

  return (
    <div className="">
      <div className="z-10">
        <div className="w-full z-10 items-center min-h-screen space-y-4 relative">
          {isIncompleteHighlightMode && (
            isProfileCompleteForApply ? (
              <section className="w-full max-w-[72%] rounded-xl border border-codegreen/40 bg-codegreen/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-codegreen font-medium">
                    Profile complete! Ready to apply.
                  </p>
                  <Button
                    type="button"
                    className="bg-codeblue/20 border border-codeblue/40 text-codeblue hover:bg-codeblue/30 text-xs font-semibold"
                    onClick={() => {
                      navigate(
                        pendingApplication?.returnUrl || `/internship/${returnJobId}`,
                        { state: { reopenApply: true } },
                      );
                    }}
                  >
                    Back to Application →
                  </Button>
                </div>
              </section>
            ) : (
              <section className="sticky top-2 z-30 w-full max-w-[72%] rounded-xl border border-codeblue/40 bg-codeblue/10 p-4">
                <div className="flex flex-col items-start gap-2">
                  <p className="text-sm text-codeblue font-medium">
                    Complete your profile to apply for job #{returnJobId}.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/internship/${returnJobId}`)}
                    className="rounded-md bg-codepink/20 border border-codepink/40 text-codepink px-3 py-1 text-xs font-semibold hover:bg-codepink/30 transition-colors"
                  >
                    ← Back to Job
                  </button>
                </div>
              </section>
            )
          )}
          <section className={`rounded-xl overflow-hidden dark:bg-[#1D1D1D]`}>
            <div className="mt-8 sm:mt-8">
              <div className="px-6 pb-6">
                <div className="flex justify-between ">
                  <div className="flex items-start gap-6">
                    <div className="relative cursor-pointer group" onClick={onProfileImageClick} >
                      <img
                        src={`${basicInfo?.profilePicture ? basicInfo?.profilePicture : userProfile?.profile_image}?${Date.now()}`}
                        alt="Profile"
                        className="w-24 h-24 sm:w-36 sm:h-36 bg-white dark:bg-black rounded-xl drop-shadow-lg object-cover transition hover:brightness-90"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl">
                        <span className="text-white text-sm font-medium">Change</span>
                      </div>
                      <input
                        ref={ProfileInputRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (file) {
                            handleUpdateProfileImage(file);
                          }
                        }}
                      />
                    </div>

                    <div className="absolute right-4 top-4">
                      <div className="flex justify-between items-center space-x-4">
                        <button onClick={() => setExportPopupOpen(true)}>
                          <DownloadIcon color="#5A5A5A" width={30} height={30} />
                        </button>

                        <button onClick={() => setSharePopupOpen(true)}>
                          <Share2 className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="text-gray-950 dark:text-white">
                      <h2 className="text-xl sm:text-4xl font-bold">
                        Hey, <span className="font-creative text-codeblue">
                          {userProfile?.platform_name || basicInfo?.name}
                        </span>
                      </h2>

                      <div className='space-y-4 mt-2'>
                        <div className="flex items-center gap-6">
                          {
                            userProfile?.persona_stage ?
                              (
                                <div className='flex items-center gap-2'>
                                  <img src={school} alt={"Package"} className="h-auto w-[34px] inline-block mr-2" />
                                  <span className="text-2xl font-normal font-jacques text-white capitalize"> {userProfile?.persona_stage.toLowerCase()} </span>
                                </div>
                              ) : (
                                <button className="px-3 py-2 bg-[#323232] rounded-[10px] font-jacques flex items-center gap-2 hover:bg-[#323232] transition text-center justify-center whitespace-nowrap" onClick={() => navigate('/getting-started/preferences')}>
                                  <span className="text-xl font-jacques font-normal">Choose a Stage </span>
                                  <img src={edit} alt="edit" className="w-[21px] h-auto text-gray-400 inline-block ml-2" />
                                </button>
                              )
                          }
                          {
                            packageData ? (
                              <div className="flex items-center gap-3">
                                <div className='flex items-center gap-2'>
                                  <img src={packageData?.icon} alt={packageData?.name} className="h-6 w-6 inline-block mr-2" />
                                  <span className="text-2xl font-jacques font-normal" style={{ color: colorStyles[packageData?.color_code].color }}>{packageData?.name}</span>
                                </div>
                                <button className="p-1 hover:bg-gray-700 rounded" onClick={() => navigate('/getting-started/preferences?type=edit&profile=upgrade')}>
                                  <img src={edit} alt="edit" className="w-[21px] h-auto text-gray-400 inline-block" />
                                </button>
                              </div>
                            ) : (
                              <button className="px-3 py-2 bg-[#323232] rounded-[10px] font-jacques flex items-center gap-2 hover:bg-[#323232] transition text-center justify-center whitespace-nowrap" onClick={() => navigate('/getting-started/preferences?profile=upgrade')}>
                                <span className="text-xl font-jacques font-normal">Choose a Plan </span>
                                <img src={edit} alt="edit" className="w-[21px] h-auto text-gray-400 inline-block ml-2" />
                              </button>
                            )
                          }
                        </div>
                        {userProfile?.user_functional_domain && <div className="flex flex-wrap gap-2">
                          {[
                            ...new Map(
                              userProfile?.user_functional_domain?.map((domain) => [
                                domain.id,
                                domain,
                              ])
                            ).values(),
                          ].map(
                            (domain, index) =>
                              domain?.id && (
                                <Badge
                                  key={domain.id}
                                  className="px-3 py-2 bg-card dark:text-white dark:bg-[#2A2A2A] rounded-xl text-sm border border-gray-300 dark:border-gray-700 font-light text-wrap"
                                >
                                  {domain.name}
                                </Badge>
                              )
                          )}
                        </div>
                        }
                        <div className="text-gray-950 dark:text-white line-clamp-2 max-w-4xl">{aboutMe}</div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className={`mt-6 flex items-end justify-between gap-4`}>
                  <div className="flex flex-col gap-2" style={{ height: "stretch" }}>
                    {/* <div className="mb-auto text-gray-900 dark:text-white max-w-[370px] text-[16px] font-normal">
                      <p>Passionate about creating meaningful design experience and driving innovation in the design Industry.</p>
                    </div> */}
                    <div className="flex justify-between content-baseline items-end flex-wrap px-0 pt-4 mb-0">
                      <SocialLinks data={socialLinks} handleSocialLinkSave={handleSocialLinkSave}></SocialLinks>

                      {userIsMentor && (
                        <div className="flex space-x-4">
                          <Link to={"/calendar/sessions"}>
                            <Button className="text-black max-w-24 flex items-center flex-col px-6 text-wrap h-full bg-codeblue"> <CalendarCheck2 />My Session</Button>
                          </Link>
                          <Button className="text-black max-w-24 flex items-center flex-col px-6 text-wrap h-full bg-codeyellow" onClick={() => setShowAvailabilityPopup(true)}> <CalendarPlus />Add your Availability</Button>
                        </div>
                      )}
                    </div>

                    {!userIsMentor && (
                      <div className='col-span-1 lg:col-span-2 flex flex-col justify-end sm:justify-start sm:items-start mt-4 sm:mt-6 items-end w-full'>
                        <div className='flex flex-col lg:flex-row gap-6 w-full'>
                          <div>
                            <div className="flex flex-row flex-nowrap gap-4 items-center">
                              {user?.user_org_type !== 'industry' && (
                                <>
                                  <button className="px-3 2xl:px-6 py-2 bg-gray-300 dark:text-white dark:bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition text-center justify-center whitespace-nowrap text-[20px] font-bold">
                                    <span>Hire Me</span>
                                    <Switch
                                      className="px-2 rounded-xl h-[28px] w-[55px] relative bg-[#171717] data-[state=checked]:bg-[#2A2A2A]"
                                      thumb="data-[state=checked]:translate-x-5 data-[state=unchecked]:-translate-x-1"
                                      checked={switches?.is_hire_me_enabled}
                                      onCheckedChange={(checked) => handleSwitchChange('is_hire_me_enabled', checked)}
                                    />
                                  </button>
                                  <button className="hidden px-2 2xl:px-6 py-2 bg-gray-300 dark:text-white dark:bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition text-center justify-center whitespace-nowrap text-[20px] font-bold">
                                    <span>Skill Up</span>
                                    <Switch
                                      className="px-2 rounded-xl h-[28px] w-[55px] relative bg-[#171717] data-[state=checked]:bg-[#2A2A2A]"
                                      thumb="data-[state=checked]:translate-x-5 data-[state=unchecked]:-translate-x-1"
                                      checked={switches?.is_skill_up_enabled}
                                      onCheckedChange={(checked) => handleSwitchChange('is_skill_up_enabled', checked)}
                                    />
                                  </button>
                                  <button className="px-2 2xl:px-6 py-2 bg-gray-300 dark:text-white dark:bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition text-center justify-center whitespace-nowrap text-[20px] font-bold">
                                    <span>Co-Create</span>
                                    <Switch
                                      className="px-2 rounded-xl h-[28px] w-[55px] relative bg-[#171717] data-[state=checked]:bg-[#2A2A2A]"
                                      thumb="data-[state=checked]:translate-x-5 data-[state=unchecked]:-translate-x-1"
                                      checked={switches?.is_co_create_enabled}
                                      onCheckedChange={(checked) => handleSwitchChange('is_co_create_enabled', checked)}
                                    />
                                  </button>
                                  {resumes.length > 0 ? (
                                    <button
                                      className="hidden px-2 2xl:px-6 py-3 bg-gray-300 dark:text-white dark:bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition text-center justify-center whitespace-nowrap text-[20px] font-bold"
                                      onClick={() => setIsPreviewResumeOpen(true)}
                                    >
                                      <FileText className="w-4 h-4" />
                                      <span>Preview resume</span>
                                    </button>
                                  ) : (
                                    <button
                                      className="hidden px-3 2xl:px-6 py-3 bg-gray-300 dark:text-white dark:bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition text-center justify-center whitespace-nowrap text-[20px] font-bold"
                                      onClick={() => setIsAddResumeOpen(true)}
                                    >
                                      <Upload className="w-4 h-4" />
                                      <span>Upload resume</span>
                                    </button>
                                  )}
                                </>)}
                              {user?.user_org_type === 'industry' && (<>
                                <button className="px-3 2xl:px-6 py-3 bg-gray-300 dark:text-white dark:bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition text-center justify-center whitespace-nowrap">
                                  <span>Hiring Now</span>
                                  <Switch
                                    className="rounded-full relative bg-[#2A2A2A] data-[state=checked]:bg-[#2A2A2A]"
                                    checked={switches?.is_hiring_now_enabled}
                                    onCheckedChange={(checked) => handleSwitchChange('is_hiring_now_enabled', checked)}
                                  />
                                </button>
                                <button className="px-3 2xl:px-6 py-3 bg-gray-300 dark:text-white dark:bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition text-center justify-center whitespace-nowrap">
                                  <span>Co-Collab Now</span>
                                  <Switch
                                    className="rounded-full relative bg-[#2A2A2A] data-[state=checked]:bg-[#2A2A2A]"
                                    checked={switches?.is_co_collab_now_enabled}
                                    onCheckedChange={(checked) => handleSwitchChange('is_co_collab_now_enabled', checked)}
                                  />
                                </button>
                              </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    {!userIsMentor && user?.user_org_type === 'industry' && (
                      <div className='flex-1'>
                        <div className='border border-gray-500 rounded-xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4'>
                          <div className='flex flex-col items-center justify-center'>
                            <img src={packageData?.icon} alt={packageData?.name} className="w-6 h-10 rounded-full object-contain" />
                            <span className="text-lg font-jacques" style={{ color: colorStyles[packageData?.color_code].color }}>{packageData?.name}</span>
                            <span className='text-gray-500'>(Plan Includes)</span>
                          </div>
                          {
                            groupedCategories.map((item: any, idx: number) => {
                              const color = colorStyles[item?.colorCode]

                              return (
                                <Card key={idx} className='bg-[#323232] p-2 gap-0 flex flex-col justify-start items-center'>
                                  <CardHeader>
                                    <CardTitle className='text-xs text-center text-codeblue'
                                      style={{ color: color.color }}
                                    >{item.category}</CardTitle>
                                  </CardHeader>
                                  <CardContent className='px-0 text-left'>
                                    {
                                      item.items.map((par: any, i: number) => {
                                        return (
                                          <p key={i}>{par.master.label}: {par.value}</p>
                                        )
                                      })
                                    }
                                  </CardContent>
                                </Card>
                              )
                            })
                          }

                          {/* <Card className='bg-[#323232] p-2 gap-0 flex flex-col justify-center items-center'>
                                  <CardHeader>
                                    <CardTitle className='text-xs text-center text-codeblue'>CREATE</CardTitle>
                                  </CardHeader>
                                  <CardContent className='px-0 text-left'>
                                    <p>Certification Courses: 15</p>
                                    <p>Self paced: 2 </p>
                                  </CardContent>
                                </Card>
                                <Card className='bg-[#323232] p-2 gap-0 flex flex-col justify-center items-center'>
                                  <CardHeader>
                                    <CardTitle className='text-xs text-center text-codepink'>CONNECT</CardTitle>
                                  </CardHeader>
                                  <CardContent className='px-0 text-left'>
                                    <p>Annual Forecasts : 300</p>
                                    <p>Creative News Trends :50+</p>
                                  </CardContent>
                                </Card>
                                <Card className='bg-[#323232] p-2 gap-0 flex flex-col justify-center items-center'>
                                  <CardHeader className='px-0'>
                                    <CardTitle className='text-xs text-center text-codegreen'>COLLABORATE</CardTitle>
                                  </CardHeader>
                                  <CardContent className='px-0 text-left'>
                                    <p>Master Classes: 2</p>
                                    <p>Workshop Annually: 2</p>
                                    <p>Must Attend : 3</p>
                                  </CardContent>
                                </Card> */}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      {
                        profileSkills && profileSkills.length > 0 && profileSkills.map((skill: any, index: number) => {
                          const fallbackColors = ['#E66B1F', '#26DDDD'];
                          const skillsColor = ['#6F4DBD', '#E66B1F', '#26DDDD', '#E132D2', '#7CD017'];
                          const originalIndex = allSkills.findIndex((s: any) => s.id === skill.skill_id || s.id === skill.id);
                          const activeColor = originalIndex !== -1 ? skillsColor[originalIndex % skillsColor.length] : fallbackColors[index % fallbackColors.length];

                          return (
                            <div
                              key={index}
                              className={`relative rounded-[10px] pr-2 pt-3 overflow-hidden h-[100px] flex items-end`}>
                              <div
                                className="absolute top-3 left-0 z-10"
                              >
                                <svg
                                  width="50"
                                  height="54"
                                  viewBox="0 0 91 99"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M72.075 0h-53.15A18.762 18.762 0 008.73 2.991 19.014 19.014 0 000 19.013V99a19.01 19.01 0 018.33-15.755 18.763 18.763 0 0110.595-3.258h53.15c3.757 0 7.258-1.1 10.204-2.998A19.022 19.022 0 0091 60.974V19.013A19.02 19.02 0 0082.85 3.38 18.766 18.766 0 0072.075 0z"
                                    fill={activeColor}
                                  />
                                </svg>
                                <img
                                  src={skill.icon}
                                  alt={"school"}
                                  className="absolute top-2 left-3 w-[27px] h-[27px] object-contain z-20"
                                />
                              </div>
                              {/* Badge */}
                              <div className="absolute top-0 right-0 z-20">
                                <span
                                  className="text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold"
                                  style={{ backgroundColor: activeColor }}
                                >
                                  {index === 0 ? 'P' : 'S'}
                                </span>
                              </div>
                              <div
                                className={`bg-[#323232] rounded-[10px] h-full min-w-[279px] min-h-[80px] flex items-center justify-center relative overflow-hidden w-full border-[3px]`}
                                style={{
                                  borderColor: activeColor,
                                }}
                              >
                                {/* Title */}
                                <h3 className="text-xl leading-normal font-bold text-white text-center relative z-10 pl-14 pr-10 py-2 w-full flex items-center justify-center min-h-full">
                                  {skill.name}
                                </h3>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {!userIsMentor && (
            <div className="rounded-3xl p-8 mb-8 hidden md:flex gap-10 relative z-10">
              <div className="relative z-10 block md:hidden mb-10">
                <h1 className="text-2xl 2xl:text-4xl font-jacques font-bold mb-2 text-start text-white opacity-100">
                  How do you want to use the Platform today?
                </h1>
              </div>
              <div className="flex gap-10 text-white mx-auto">
                <div className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300 w-[172px]" onClick={() => navigate('/create')}>
                  <div className="absolute -top-4 -left-4 w-[167px] h-[126px] bg-codeblue rounded-2xl z-0"></div>
                  <div className="relative bg-[#1F1F1F] px-4 py-6 rounded-2xl text-center z-10 shadow-lg w-[172px] min-h-40">
                    <h3 className="text-codeblue text-2xl font-bold mb-4">Create</h3>
                    <p className="text-sm leading-relaxed font-normal">Repository of Courses, Mentors & Resources.</p>
                  </div>
                </div>
                {/* Connect */}
                <div className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300 w-[172px]" onClick={() => navigate('/connect')}>
                  <div className="absolute -top-4 -left-4 w-[167px] h-[126px] bg-codepink rounded-2xl z-0"></div>
                  <div className="relative bg-[#1F1F1F] px-4 py-6 rounded-2xl text-center z-10 shadow-lg w-[172px] min-h-40">
                    <h3 className="text-codepink text-2xl font-bold mb-4">Connect</h3>
                    <p className="text-sm leading-relaxed font-normal">Community driven learning ecosystem.</p>
                  </div>
                </div>

                {/* Collaborate */}
                <div className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300 w-[172px]" onClick={() => navigate('/collaborate')}>
                  <div className="absolute -top-4 -left-4 w-[167px] h-[126px] bg-codegreen rounded-2xl z-0"></div>
                  <div className="relative bg-[#1F1F1F] px-4 py-6 rounded-2xl text-center z-10 shadow-lg w-[172px] min-h-40">
                    <h3 className="text-codegreen text-2xl font-bold text-warp mb-4">Collaborate</h3>
                    <p className="text-sm leading-relaxed font-normal">Tech driven interaction industry engine.</p>
                  </div>
                </div>

                {/* Ccat */}
                <div className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300 w-[172px]" onClick={() => navigate('/ccat-landing-page')}>
                  <div className="absolute -top-4 -left-4 w-[167px] h-[126px] bg-codeyellow rounded-2xl z-0"></div>
                  <div className="relative bg-[#1F1F1F] px-4 py-6 rounded-2xl text-center z-10 shadow-lg w-[172px] min-h-40">
                    <h3 className="text-codeyellow text-2xl font-bold mb-4">CCIQ</h3>
                    <p className="text-sm leading-relaxed font-normal">Career Coaching and Adaptive Training.</p>
                  </div>
                </div>
              </div>
              <div className="relative z-10 hidden justify-center items-center md:flex ">
                <h1 className="text-2xl xl:text-4xl justify-center font-poppins font-bold mb-2 text-center text-white opacity-100" style={{ lineHeight: '54px' }}>
                  How do you want to use the Platform today?
                </h1>
              </div>
            </div>
          )}
          {/*{!userIsMentor && typeof window !== 'undefined' && window.location.hostname === 'stage.codeedu.co' && <PersonaInsightsSection />}*/}
          {!userIsMentor && typeof window !== 'undefined' && <PersonaInsightsSection />}

          <section className="bg-white dark:bg-[#1D1D1D] rounded-2xl overflow-hidden py-3 px-8">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setAddProfileSectionPopupOpen(true)}>
              <span className="text-xl font-bold text-white tracking-tight font-jacques">Add New Section</span>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-primary dark:bg-gray-800 dark:hover:bg-gray-900 hover:bg-primary/20 border-0 p-0 w-8 h-8 flex items-center justify-center text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </section>

          {/* --- Resumes Section Removed as per request --- */}


          {profileSections
            .filter((s) => !sectionNotTORender.includes(s.SectionKey))
            .filter((s) => {
              const mandatoryKeys = ['about', 'education', 'experience'];
              if (mandatoryKeys.includes(s.SectionKey)) return true;
              return profile?.profileSection ? Object.hasOwn(profile.profileSection, s.SectionKey) : false;
            })
            .sort((a, b) => {
              const order = ['about', 'education', 'experience'];
              const indexA = order.indexOf(a.SectionKey);
              const indexB = order.indexOf(b.SectionKey);
              if (indexA !== -1 && indexB !== -1) return indexA - indexB;
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;
              return 0;
            })
            .map((section) => {
              const sectionData = profile?.profileSection?.[section.SectionKey] || [];

              return (
                <section
                  key={section.SectionKey}
                  className={`bg-white dark:bg-[#1D1D1D] rounded-xl overflow-hidden py-3 px-8 relative z-10 ${isIncompleteHighlightMode && mandatoryIncompleteSections.includes(section.SectionKey as 'about' | 'education' | 'skills') ? 'border border-error animate-pulse' : ''}`}
                >
                  <div className="flex justify-between items-center mb-2 sm:mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white font-jacques">
                      {section.SectionKey === 'about' ? 'Profile Summary' :
                        section.SectionKey === 'experience' ? 'Work Experience' :
                          section.name}
                      {['about', 'education'].includes(section.SectionKey) ? (
                        <span className="text-red-500"> *</span>
                      ) : ''}
                      {isIncompleteHighlightMode && mandatoryIncompleteSections.includes(section.SectionKey as 'about' | 'education' | 'skills') && (
                        <span className="ml-2 rounded bg-error-subtle px-2 py-0.5 text-xs text-error">
                          Required
                        </span>
                      )}
                    </h2>
                    {(section.isLocked === false || profile.isVerified === false) && (sectionData.length === 0 || sectionData.length < section.maxEntries) && (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          title={`Add ${section.name}`}
                          className="rounded-full bg-primary dark:bg-gray-800 dark:hover:bg-gray-900 hover:bg-primary/20 border-0 p-0 w-8 h-8 flex items-center justify-center text-white"
                          onClick={() => handleAddClick(section)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                    )}
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
                              className="dark:text-white"
                            />
                          ) : (
                            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 dark:text-white">
                              {section.fields.map((field) => {
                                const key = field.fieldKey;
                                const value = entry[key];
                                if (key === "id" || value === null || value === undefined) return null;

                                if (field.dataType === "binary" && typeof value === "string") {
                                  return (
                                    <li key={key}>
                                      <strong className="dark:text-white">{field.name}:</strong>
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

                                if (field.dataType === "object" && typeof value === "string") {
                                  return (
                                    <li key={key}>
                                      <strong className="dark:text-white">{field.name}:</strong>
                                      <a href={value} target="_blank" rel="noreferrer" className="text-secondary underline ml-1">
                                        View Attachment
                                      </a>
                                    </li>
                                  );
                                }

                                if (field.dataType === "date") {
                                  return (
                                    <li key={key}>
                                      <strong className="dark:text-white">{field.name}:</strong> {formatDate(value)}
                                    </li>
                                  );
                                }

                                return (
                                  <li key={key}>
                                    <strong className="dark:text-white">{field.name}:</strong> {String(value)}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                          {(section.isLocked === false || profile.isVerified === false) && (
                            <div className="absolute bg-white dark:bg-black p-1  hover:bg-gray-100 rounded-full border shadow -top-2 right-0 flex gap-3">
                              <button
                                title="Edit"
                                className="p-1 text-primary transition"
                                onClick={() => handleEditClick(section, entry)}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })}

          {/* Functional Domains Section */}
          {userProfile?.user_functional_domain && userProfile.user_functional_domain.length > 0 && (
            <section className="bg-white dark:bg-[#1D1D1D] rounded-xl py-3 px-8 max-w-full overflow-hidden mb-4">
              <div className="px-0">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-white font-bold text-xl font-jacques">
                    Domains
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProfile.user_functional_domain.map((domain: { id: number; name: string }, index: number) => (
                    <Badge key={`domain-${domain.id ?? index}`} className="bg-transparent text-primary border-primary px-4 py-2">
                      {domain.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Skills Section */}
          {(() => {
            const skillsSection = profileSections.find(s => s.SectionKey === 'skills');
            const userSkills = profile?.profileSection?.skills || [];
            const hasVerified = verifedSkills && verifedSkills.length > 0;
            const hasUser = userSkills.length > 0;
            const hasProfileSkills = profileSkills && profileSkills.length > 0;

            // if (!hasVerified && !hasUser && !hasProfileSkills && !skillsSection) return null;
            if (!hasProfileSkills && !skillsSection) return null;

            return (
              <section className={`bg-white dark:bg-[#1D1D1D] rounded-xl py-3 px-8 max-w-full overflow-hidden mb-4 ${isIncompleteHighlightMode && mandatoryIncompleteSections.includes('skills') ? 'border border-error animate-pulse' : ''}`}>
                <div className="px-0">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-white font-bold text-xl font-jacques">
                      {skillsSection?.name || "Skills & Strengths"} <span className="text-red-500">*</span>
                      {isIncompleteHighlightMode && mandatoryIncompleteSections.includes('skills') && (
                        <span className="ml-2 rounded bg-error-subtle px-2 py-0.5 text-xs text-error">
                          Required
                        </span>
                      )}
                    </h2>
                    {skillsSection && (skillsSection.isLocked === false || profile.isVerified === false) && (userSkills.length < skillsSection.maxEntries) && (
                      <>
                        {/*<Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-primary dark:bg-gray-800 dark:hover:bg-gray-900 hover:bg-primary/20 border-0 p-0 w-8 h-8 flex items-center justify-center text-white"
                        onClick={() => handleAddClick(skillsSection)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>*/}
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/*
                    {verifedSkills?.map((skill, index) => (
                      <Badge key={`verified-${index}`} className="bg-transparent text-primary border-primary px-4 py-2" >
                        <BadgeCheck size={16} className="mr-2" />
                        {skill.name}
                      </Badge>
                    ))}
                    */}

                    {profileSkills?.map((skill: any, index: number) => (
                      <Badge key={`profile-skill-${index}`} className="bg-transparent text-primary border-primary px-4 py-2" >
                        {skill.name}
                      </Badge>
                    ))}

                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {/*
                    {userSkills.map((entry: any, index: number) => (
                      <div key={`user-${index}`} className="relative group">
                        <Badge className="bg-transparent text-primary border-primary px-4 py-2">
                          {entry.skill_name}
                        </Badge>
                        {skillsSection && (skillsSection.isLocked === false || profile.isVerified === false) && (
                          <button
                            title="Edit"
                            className="absolute -top-2 -right-2 bg-white text-black rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            onClick={() => handleEditClick(skillsSection, entry)}
                          >
                            <Pencil size={10} />
                          </button>
                        )}
                        <button
                          title="Delete"
                          className="absolute -bottom-2 -right-2 bg-red-50 text-red-500 rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={() => deleteProfileEntry(skillsSection.SectionKey, entry.id)}
                        >
                          <Trash size={10} />
                        </button>
                      </div>
                    ))}
                    */}
                  </div>
                </div>
              </section>
            );
          })()}


          {/* --- Add/Edit Modal --- */}
          {isModalOpen && activeSection && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
              <div className="bg-white dark:bg-card rounded-lg w-full max-w-3xl shadow-lg relative">
                {editEntry ? (
                  <DynamicEditSectionForm
                    section={activeSection}
                    entry={editEntry}
                    onclose={handleModalClose}
                    deleteProfileEntry={deleteProfileEntry}
                    onSubmit={handleEditSectionSubmit}
                  />
                ) : (
                  <DynamicSectionForm
                    section={activeSection}
                    onclose={handleModalClose}
                    onSubmit={handleSectionSubmit}
                  />
                )}
              </div>
            </div>
          )}

          {addProfileSectionPopupOpen && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
              <div className="bg-white dark:bg-card rounded-lg w-full max-w-xl shadow-lg relative flex flex-col"
                style={{ maxHeight: '90vh' }}>
                <div className="flex justify-between shadow rounded-t-lg border-b border-gray-200 py-4 px-6 items-center sticky top-0 bg-white dark:bg-card z-10">
                  <p className="text-lg dark:text-white font-semibold">Add Profile Section</p>
                  <button
                    className="text-gray-400 text-lg hover:bg-black p-1 px-3 transition duration-150 rounded-full hover:text-gray-600"
                    onClick={() => setAddProfileSectionPopupOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                <div
                  className="px-4 sm:px-6 pb-3 overflow-y-auto"
                  style={{ maxHeight: '70vh', minHeight: '200px' }}
                >
                  {profileSections.map((section) => (
                    <div
                      key={section.SectionKey}
                      className="border-b border-gray-500 cursor-pointer pt-3 pb-3 flex justify-between gap-2"
                    >
                      <div className="flex flex-col flex-1 min-w-0" onClick={() => {
                        setAddProfileSectionPopupOpen(false);
                        handleAddClick(section);
                      }}>
                        <p className="text-base font-semibold dark:text-white capitalize truncate">{section.name}</p>
                        <p className="text-sm text-gray-500 truncate">{section.description}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        <CustomButton
                          className="w-full dark:text-black sm:w-auto"
                          onClick={() => {
                            setAddProfileSectionPopupOpen(false);
                            handleAddClick(section);
                          }}
                        >
                          Add
                        </CustomButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <SharePopup shareUrl={shareUrl} open={sharePopupOpen} onClose={() => setSharePopupOpen(false)} />
          <AddResume
            show={isAddResumeOpen}
            onClose={() => setIsAddResumeOpen(false)}
            onSuccess={() => {
              loadResumes();
              setIsAddResumeOpen(false);
            }}
          />

          <Dialog open={isPreviewResumeOpen} onOpenChange={setIsPreviewResumeOpen}>
            <DialogContent className="bg-[#1D1D1D] border-none text-white max-w-4xl h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex justify-between items-center pr-8">
                  <span>Resume Preview</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Update Resume"
                      className="bg-transparent border-white/20 hover:bg-white/10 w-9 h-9"
                      onClick={() => {
                        setIsPreviewResumeOpen(false);
                        setIsAddResumeOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Delete Resume"
                      className="bg-transparent border-red-500/20 hover:bg-red-500/20 text-red-400 w-9 h-9"
                      onClick={() => {
                        if (latestResume?.id) {
                          handleDeleteResume(latestResume.id);
                          setIsPreviewResumeOpen(false);
                        }
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 w-full overflow-hidden rounded-xl bg-white mt-4 relative">
                {latestResume?.url ? (
                  latestResume.url.toLowerCase().endsWith('.pdf') ? (
                    <embed
                      src={`${latestResume.url}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full"
                      type="application/pdf"
                    />
                  ) : (
                    <video controls className="w-full h-full object-contain bg-black">
                      <source src={latestResume.url} />
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-black">
                    No resume document available for preview.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <PreferencesPopup
            open={preferencesPopupOpen}
            data={basicInfo}
            onRequestVerification={SendRequestForVerfication}
            onClose={() => setPreferencesPopupOpen(false)}
            onSave={handleSavePreferences}
          />
          <AvailabilityPopup open={showAvailabilityPopup} onClose={() => setShowAvailabilityPopup(false)} />
          <ExportMenu profile={profile} open={exportPopupOpen} onClose={() => setExportPopupOpen(false)} profileSections={profileSections} />
        </div>
      </div>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 -bottom-16 left-0 w-full h-96 object-cover opacity-80 pointer-events-none"
      >
        <source src="/video/rainbow.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default ProfileView;
