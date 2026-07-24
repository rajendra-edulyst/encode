
import { useState, useEffect } from "react";
import { socialIcons } from "./SocialIcons/socialIcons";
import { Plus } from "lucide-react";

const prioritizedPlatforms = ["vidwan", "linkedin", "behance", "youtube"];

const socialPlatforms = [
  { key: "vidwan", label: "Vidwan" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "behance", label: "Behance" },
  { key: "orcid", label: "ORCID" },
  { key: "figma", label: "Figma" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "twitter", label: "Twitter" },
  { key: "instagram", label: "Instagram" },
  { key: "github", label: "GitHub" },
  { key: "notion", label: "Notion" },
  { key: "dribbble", label: "Dribbble" },
  { key: "discord", label: "Discord" },
  { key: "reddit", label: "Reddit" },
  { key: "snapchat", label: "Snapchat" },
  { key: "pinterest", label: "Pinterest" },
  { key: "threads", label: "Threads" },
  { key: "hackerrank", label: "HackerRank" },
];

const validationPatterns: Record<string, RegExp> = {
  vidwan: /^https:\/\/.+/,
  facebook: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
  twitter: /^https?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]{1,15}\/?$/,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/,
  instagram: /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._]+\/?$/,
  youtube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/,
  github: /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/,
  behance: /^https?:\/\/(www\.)?behance\.net\/[A-Za-z0-9_-]+\/?$/,
  figma: /^https?:\/\/(www\.)?figma\.com\/(@[A-Za-z0-9_-]+|file\/[A-Za-z0-9]+\/[^/]+)\/?$/,
  notion: /^https?:\/\/(www\.)?notion\.so\/.+$/,
  dribbble: /^https?:\/\/(www\.)?dribbble\.com\/[A-Za-z0-9_-]+\/?$/,
  discord: /^https?:\/\/(discord\.gg|discord\.com)\/[A-Za-z0-9]+\/?$/,
  orcid: /^https?:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{4}\/?$/,
  reddit: /^https?:\/\/(www\.)?reddit\.com\/user\/[A-Za-z0-9_-]+\/?$/,
  snapchat: /^https?:\/\/(www\.)?snapchat\.com\/add\/[A-Za-z0-9._-]+\/?$/,
  pinterest: /^https?:\/\/(www\.)?pinterest\.com\/[A-Za-z0-9._-]+\/?$/,
  threads: /^https?:\/\/(www\.)?threads\.net\/@[A-Za-z0-9._-]+\/?$/,
  hackerrank: /^https?:\/\/(www\.)?hackerrank\.com\/[A-Za-z0-9_-]+\/?$/,
};

const placeholderUrls: Record<string, string> = {
  vidwan: "https://vidwan.com/yourprofile",
  facebook: "https://facebook.com/yourprofile",
  twitter: "https://twitter.com/yourhandle",
  linkedin: "https://linkedin.com/in/yourprofile",
  instagram: "https://instagram.com/yourhandle",
  youtube: "https://youtube.com/channel/yourchannel",
  github: "https://github.com/yourusername",
  behance: "https://behance.net/yourprofile",
  figma: "https://figma.com/@yourusername",
  notion: "https://notion.so/yourpage",
  dribbble: "https://dribbble.com/yourhandle",
  discord: "https://discord.gg/yourinvite",
  orcid: "https://orcid.org/0000-0000-0000-0000",
  reddit: "https://reddit.com/user/yourhandle",
  snapchat: "https://snapchat.com/add/yourusername",
  pinterest: "https://pinterest.com/yourprofile",
  threads: "https://threads.net/@yourhandle",
  hackerrank: "https://hackerrank.com/yourprofile",
};


type SocialLinksProps = {
  data: Record<string, string>;
  handleSocialLinkSave: (platform: string, url: string) => void;
};

const SocialLinks = ({ data, handleSocialLinkSave }: SocialLinksProps) => {
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)"); // mobile breakpoint

    const handleResize = () => setIsMobile(mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const validateUrl = (platform: string, url: string) => {
    const pattern = validationPatterns[platform];
    return pattern ? pattern.test(url.trim()) : true;
  };

  // Keys of platforms that have been added
  const linkedKeys = Object.keys(data || {}).filter((k) => data[k]);

  // Platforms that are added with labels and keys
  const addedPlatforms = socialPlatforms
    .filter((p) => linkedKeys.includes(p.key))
    .map((p) => ({
      ...p,
      added: true,
      url: data[p.key],
    }));

  const mobilePlatformsToShow =
    addedPlatforms.length > 0
      ? [
        ...addedPlatforms.slice(0, 4),
        ...prioritizedPlatforms
          .filter((key) => !addedPlatforms.some((p) => p.key === key))
          .slice(0, 4 - addedPlatforms.length)
          .map((key) => ({
            key,
            label: socialPlatforms.find((p) => p.key === key)?.label || key,
            added: !!data?.[key],
          })),
      ]
      : prioritizedPlatforms.slice(0, 4).map((key) => ({
        key,
        label: socialPlatforms.find((p) => p.key === key)?.label || key,
        added: !!data?.[key],
      }));

  const desktopPlatformsToShow =
    addedPlatforms.length > 0
      ? [
        ...addedPlatforms.slice(0, 5),
        ...prioritizedPlatforms
          .filter((key) => !addedPlatforms.some((p) => p.key === key))
          .slice(0, 5 - addedPlatforms.length)
          .map((key) => ({
            key,
            label: socialPlatforms.find((p) => p.key === key)?.label || key,
            added: !!data?.[key],
          })),
      ]
      : prioritizedPlatforms.slice(0, 5).map((key) => ({
        key,
        label: socialPlatforms.find((p) => p.key === key)?.label || key,
        added: !!data?.[key],
      }));


  // Final list to render depends on isMobile
  const platformsToRender = isMobile ? mobilePlatformsToShow : desktopPlatformsToShow;

  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {platformsToRender.map(({ key, label, added }) => (
          <button
            key={key}
            title={label}
            className="rounded-full transition"
            onClick={() => {
              setActivePlatform(key);
              setInputValue(data?.[key] || "");
            }}
          >
            <img
              src={socialIcons[key]}
              alt={label}
              className={`w-8 h-8 filter ${added ? "opacity-100" : "opacity-80 grayscale brightness-90"}`}
            />
          </button>
        ))}

        {/* Show plus icon only on desktop and only if no added platforms */}
        <button
          className="p-2 mr-1 rounded-full shrink-0 bg-gray-50 dark:bg-black border hover:bg-gray-200 transition"
          title="Add other platform"
          onClick={() => setActivePlatform("add")}
        >
          <Plus className="w-4 h-4 dark:text-white" />
        </button>
      </div>

      {/* Modal and Add Modal code remains the same */}
      {activePlatform && activePlatform !== "add" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-card rounded-lg w-full max-w-md shadow-lg relative">
            <div className="flex items-center border-b border-gray-200 shadow p-4 px-6 justify-between">
              <h2 className="text-xl font-semibold capitalize">Add {activePlatform} handle</h2>
              <button
                className="text-gray-400 hover:bg-black p-1 px-3 rounded-full text-lg"
                onClick={() => {
                  setActivePlatform(null);
                  setInputValue("");
                }}
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <label className="block text-gray-500 dark:text-white mb-1">{activePlatform} handle</label>
              <input
                type="text"
                value={inputValue}
                placeholder={placeholderUrls[activePlatform] || ""}
                className={`w-full px-4 py-2  rounded-md dark:bg-black focus:outline-none ${errorMessage ? "border-red-500" : "border-gray-300"
                  }`}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputValue(val);
                  if (!validateUrl(activePlatform, val)) {
                    setErrorMessage("Please enter a valid profile URL.");
                  } else {
                    setErrorMessage(null);
                  }
                }}
              />
              {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
              <div className="flex justify-end mt-6 gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md"
                  onClick={() => {
                    setActivePlatform(null);
                    setInputValue("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-70"
                  disabled={!inputValue}
                  onClick={() => {
                    handleSocialLinkSave(activePlatform, inputValue);
                    setActivePlatform(null);
                    setInputValue("");
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePlatform === "add" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-card rounded-lg w-full max-w-xl shadow-lg relative">
            <div className="flex items-center border-b border-gray-500 shadow p-4 px-6 justify-between">
              <h3 className="text-lg font-semibold">Add a social platform</h3>
              <button
                className="text-gray-500 hover:bg-black p-1 px-3 rounded-full text-xl"
                onClick={() => setActivePlatform(null)}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 p-4">
              {socialPlatforms
                .filter((p) => !linkedKeys.includes(p.key))
                .map(({ key, label }) => (
                  <button
                    key={key}
                    title={label}
                    className="p-2 rounded hover:bg-card border border-black flex flex-col items-center bg-black text-white"
                    onClick={() => {
                      setActivePlatform(key);
                      setInputValue("");
                    }}
                  >
                    <img src={socialIcons[key]} alt={label} className="w-6 h-6 mb-1" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinks;
