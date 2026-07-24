import { ZoomMtg } from "@zoom/meetingsdk";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useParams } from "react-router-dom";
import { fetchZoomContentJoinContext } from "@/services/create/AssessmentService";
import { useSessionUser } from "@/store/authStore";
import { Button } from "@/components/ui/ShadcnButton";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { INDUSTRY, LEARNER } from "@/constants/roles.constant";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

const AUTH_ENDPOINT = 'https://zooom-integration.vercel.app/api/zoom/signature';
const CLIENT_ID = import.meta.env.VITE_ZOOM_CLIENT_ID || import.meta.env.VITE_ZOOM_SDK_KEY;

type ParsedJoinContext = {
    meetingNumber: string;
    passWord: string;
    registrantToken: string;
    zakToken: string;
    role: 0 | 1;
};

function extractPasscode(raw: string, parsedUrl: URL): string {
    const direct =
        parsedUrl.searchParams.get("pwd") ||
        parsedUrl.searchParams.get("passcode") ||
        parsedUrl.searchParams.get("password") ||
        "";
    if (direct) return direct;

    const hash = (parsedUrl.hash || "").replace(/^#/, "");
    if (hash) {
        const hashParams = new URLSearchParams(hash);
        const hashPwd =
            hashParams.get("pwd") ||
            hashParams.get("passcode") ||
            hashParams.get("password") ||
            "";
        if (hashPwd) return hashPwd;
    }

    const decoded = decodeURIComponent(raw);
    const match = decoded.match(/(?:[?&#]|^)(?:pwd|passcode|password)=([^&#]+)/i);
    return match?.[1] || "";
}

function parseMeetingUrl(joinUrl: string): ParsedJoinContext {
    const normalized = joinUrl.replace(/\\\//g, "/");
    const parsedUrl = new URL(normalized);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
    const meetingNumber = pathSegments[pathSegments.length - 1] || "";
    const passWord = extractPasscode(normalized, parsedUrl);
    const registrantToken = parsedUrl.searchParams.get("tk") || "";
    const zakToken = parsedUrl.searchParams.get("zak") || "";
    const role: 0 | 1 = zakToken ? 1 : 0;

    return { meetingNumber, passWord, registrantToken, zakToken, role };
}

export default function ZoomMeeting() {
    const { content_id } = useParams<{ content_id: string }>();
    const [searchParams] = useSearchParams();
    const mentoringQueryValue = searchParams.get("is_mentoring");
    const { user, profile } = useSessionUser();
    const [isJoining, setIsJoining] = useState(false);
    const [isZoomReady, setIsZoomReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const userName = useMemo(
        () => user?.name || user?.userName || "Learner",
        [user?.name, user?.userName],
    );
    const userEmail = useMemo(() => user?.email || "", [user?.email]);
    const leaveUrl = useMemo(() => {
        const isIndustryUser = (user?.authority || []).includes(INDUSTRY);
        const homePath = isIndustryUser ? "/collaborate" : "/create";
        return `${window.location.origin}${homePath}`;
    }, [user?.authority]);

    const startMeeting = ({
        signature,
        meetingNumber,
        passWord,
        registrantToken,
        zakToken,
        role,
    }: {
        signature: string;
        meetingNumber: string;
        passWord: string;
        registrantToken?: string;
        zakToken?: string;
        role: 0 | 1;
    }) => {
        const root = document.getElementById("zmmtg-root");
        if (root) root.style.display = "block";

        console.log("[ZoomMeeting] SDK join payload", {
            meetingNumber: String(meetingNumber),
            role,
            hasPassWord: Boolean(passWord),
            hasRegistrantToken: Boolean(registrantToken),
            hasZakToken: Boolean(zakToken),
            sdkKeyPreview: CLIENT_ID ? `${CLIENT_ID.slice(0, 8)}...` : "missing",
        });

        ZoomMtg.init({
            leaveUrl,
            patchJsMedia: true,
            leaveOnPageUnload: true,
            success: () => {
                console.log("[ZoomMeeting] init success! calling join...");
                ZoomMtg.join({
                    signature,
                    sdkKey: CLIENT_ID,
                    meetingNumber: String(meetingNumber),
                    passWord,
                    userName,
                    userEmail,
                    tk: registrantToken || undefined,
                    zak: role === 1 ? zakToken || undefined : undefined,
                    success: () => {
                        console.log("[ZoomMeeting] join success!");
                        toast.success("Joined meeting successfully");
                        setIsZoomReady(true);
                    },
                    error: (err: unknown) => {
                        console.error("[ZoomMeeting] join error:", err);
                        setErrorMessage("Unable to join Zoom meeting.");
                        setIsZoomReady(true);
                    },
                });
            },
            error: (err: unknown) => {
                console.error("[ZoomMeeting] init error:", err);
                setErrorMessage("Unable to initialize Zoom.");
                setIsZoomReady(true);
            },
        });
    };

    const joinMeeting = async () => {
        if (!content_id) {
            setErrorMessage("Invalid meeting content.");
            return;
        }

        setIsJoining(true);
        setErrorMessage("");

        try {
            const isMentoring: 0 | 1 =
                mentoringQueryValue === "1" ? 1 : mentoringQueryValue === "0" ? 0 : profile === "mentor" ? 1 : 0;
            const { joinUrl, openUrl, startUrl } = await fetchZoomContentJoinContext(Number(content_id), isMentoring);
            if (!joinUrl && !openUrl && !startUrl) {
                throw new Error("No Zoom URL found for this content.");
            }

            const isHostUser = isMentoring === 1 ? true : !((user?.authority || []).includes(LEARNER));

            // Data-first for both learner and host.
            // Fallback order keeps backward compatibility if `data` is missing.
            const selectedJoinUrl = joinUrl || openUrl || startUrl;
            if (!selectedJoinUrl) {
                throw new Error("Zoom join URL is missing.");
            }

            console.log("[ZoomMeeting] Raw join link preview", {
                length: selectedJoinUrl.length,
                preview: `${selectedJoinUrl.slice(0, 140)}...`,
            });

            const parsed = parseMeetingUrl(selectedJoinUrl);
            const parsedOpenUrl = openUrl ? parseMeetingUrl(openUrl) : null;
            const parsedJoinUrl = joinUrl ? parseMeetingUrl(joinUrl) : null;
            const parsedStartUrl = startUrl ? parseMeetingUrl(startUrl) : null;

            const fallbackPassWord = parsed.passWord || parsedJoinUrl?.passWord || parsedOpenUrl?.passWord || parsedStartUrl?.passWord || "";
            const fallbackZakToken = parsed.zakToken || parsedJoinUrl?.zakToken || parsedOpenUrl?.zakToken || parsedStartUrl?.zakToken || "";

            const mergedParsed = isHostUser
                ? {
                    ...parsed,
                    zakToken: fallbackZakToken,
                    passWord: fallbackPassWord,
                    role: 1 as const,
                }
                : {
                    ...parsed,
                    passWord: fallbackPassWord,
                    role: 0 as const,
                };

            if (!mergedParsed.meetingNumber) {
                throw new Error("Meeting number not found in join link.");
            }

            console.log("[ZoomMeeting] Parsed join link", {
                meetingNumber: mergedParsed.meetingNumber,
                role: mergedParsed.role,
                hasPassWord: Boolean(mergedParsed.passWord),
                hasRegistrantToken: Boolean(mergedParsed.registrantToken),
                hasZakToken: Boolean(mergedParsed.zakToken),
            });

            const response = await fetch(AUTH_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    meetingNumber: mergedParsed.meetingNumber,
                    role: mergedParsed.role,
                    hasPassWord: Boolean(mergedParsed.passWord),
                    passWordLength: mergedParsed.passWord ? mergedParsed.passWord.length : 0,
                    hasZakToken: Boolean(mergedParsed.zakToken),
                }),
            });

            if (!response.ok) {
                throw new Error(`Signature API failed: ${response.status}`);
            }

            const signatureData = await response.json();
            if (!signatureData?.signature) {
                throw new Error("Signature not returned by auth service.");
            }

            startMeeting({
                signature: signatureData.signature,
                meetingNumber: mergedParsed.meetingNumber,
                passWord: mergedParsed.passWord,
                registrantToken: mergedParsed.registrantToken || "",
                zakToken: mergedParsed.zakToken || "",
                role: mergedParsed.role
            });
        } catch (error) {
            console.error("Unable to load Zoom meeting:", error);
            setErrorMessage("Unable to load Zoom meeting. Please try again.");
        } finally {
            setIsJoining(false);
        }
    };

    const initRef = useRef(false);

    useEffect(() => {
        if (!initRef.current) {
            initRef.current = true;
            joinMeeting();
        }

        return () => {
            const root = document.getElementById("zmmtg-root");
            if (root) {
                root.style.display = "none";
            }
            // Zoom Web SDK injects global CSS that ruins the UI for the rest of the SPA.
            // If the user navigates away (e.g. hits the Back button), we force a reload 
            // to cleanly reset the DOM and CSS state for the rest of the app.
            if (!window.location.pathname.includes('/zoom/meeting')) {
                // Instantly inject a full-screen loader so the user doesn't see a broken UI flash
                const loader = document.createElement("div");
                loader.innerHTML = `
                    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 2147483647; background: #0b0c10; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                            <div style="width: 64px; height: 64px; border: 4px solid #0ea5e9; border-bottom-color: transparent; border-left-color: transparent; border-radius: 50%; animation: zoom-spin 1s linear infinite;"></div>
                        </div>
                        <p style="color: #9ca3af; font-family: system-ui, -apple-system, sans-serif; font-weight: 500; font-size: 1.125rem; letter-spacing: 0.025em;">Returning to dashboard...</p>
                    </div>
                    <style>
                        @keyframes zoom-spin { to { transform: rotate(360deg); } }
                    </style>
                `;
                document.body.appendChild(loader);
                window.location.reload();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content_id, mentoringQueryValue, profile]);


    return (
        <>
            <style>{`
                /* Fix for Tailwind resetting Zoom SDK's text alignment */
                #zmmtg-root {
                    text-align: center !important;
                }
                #zmmtg-root * {
                    text-align: inherit;
                }
                /* Specifically target the loading text container if possible */
                #zmmtg-root .suspense-loading,
                #zmmtg-root .loading-text,
                #zmmtg-root .zm-client-video-loading {
                    text-align: center !important;
                    justify-content: center !important;
                    align-items: center !important;
                }
            `}</style>
            <div className="fixed inset-0 z-[9999] bg-[#0b0c10] flex flex-col items-center justify-center">
                {errorMessage ? (
                    <div className="bg-[#1D1D1D] rounded-2xl p-8 max-w-md w-full text-center border border-gray-800">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-500 text-2xl">!</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">Connection Failed</h3>
                        <p className="text-red-400 text-sm mb-6">{errorMessage}</p>
                        <Button
                            onClick={joinMeeting}
                            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl h-12"
                            disabled={isJoining}
                        >
                            {isJoining ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    Retrying...
                                </span>
                            ) : (
                                "Retry Join"
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full animate-ping"></div>
                            <div className="w-16 h-16 border-4 border-t-sky-500 border-r-sky-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-400 font-medium text-lg tracking-wide">
                            {isJoining ? "Establishing connection..." : "Starting Zoom Session..."}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}