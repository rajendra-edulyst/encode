import { Button } from "@/components/ui/ShadcnButton";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Image, Loader, Text, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { imagesSerach, fetchCreateContent, videoSearch } from "@/services/generative/GenerativeService";
import { Photo, Video as VideoType } from "@/@types/generativeAi";
import { SidebarContent, SidebarFooter } from "@/components/ui/sidebar";

interface GenerativeProps {
    prompt?: string;
}

export function Generative({ prompt: initialPrompt }: GenerativeProps) {
    const [tab, setTab] = useState("text");
    const [prompt, setPrompt] = useState(initialPrompt || "");
    const [images, setImages] = useState<Photo[]>([]);
    const [videos, setVideos] = useState<VideoType[]>([]);
    const [generatedText, setGeneratedText] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialPrompt) {
            setPrompt(initialPrompt);
        }
    }, [initialPrompt]);

    const getImages = () => {
        if (!prompt) return;
        setLoading(true);
        imagesSerach(prompt).then((data) => {
            setImages(data || []);
        }).finally(() => setLoading(false));
    };

    const getVideos = () => {
        if (!prompt) return;
        setLoading(true);
        videoSearch(prompt).then((data) => {
            setVideos(data);
        }).finally(() => setLoading(false));
    };

    const getText = () => {
        if (!prompt) return;
        setLoading(true);
        fetchCreateContent(prompt, "hello").then((data) => {
            setGeneratedText(data);
        }).finally(() => setLoading(false));
    };

    return (
        <>
            <SidebarContent>
                <div className="grid gap-4 py-4 pb-16">
                    {tab === "image" && (
                        <div className="grid gap-4 grid-cols-2">
                            {images.map((image, index) => (
                                <div key={index} className="relative rounded-md overflow-hidden">
                                    <img src={image.src.original} alt="Generated" className="w-full h-40 object-cover" />
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white">
                                        <span>{image.photographer}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {tab === "video" && (
                        <div className="grid gap-4 grid-cols-2">
                            {videos.map((video, index) => (
                                <div key={index} className="relative rounded-md overflow-hidden">
                                    <video controls className="w-full h-40 object-cover"
                                        draggable={true}
                                    >
                                        <source src={video.video_files[0]?.link} type="video/mp4" />
                                    </video>
                                </div>
                            ))}
                        </div>
                    )}
                    {tab === "text" && generatedText && (
                        <div className="p-3 border rounded-lg bg-gray-100">
                            <p>{generatedText}</p>
                        </div>
                    )}
                </div>
            </SidebarContent>
            <SidebarFooter>
                <div className="mt-auto p-3 backdrop-blur-sm bg-white/50 rounded-lg border">
                    <div className="relative">
                        <Textarea
                            placeholder="Enter your content here"
                            className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <ul className="flex space-x-1 mt-2 absolute bottom-2 left-1">
                            <li onClick={() => setTab("text")}>
                                <Badge variant={"outline"} className={`cursor-pointer text-[10px] ${tab === "text" && "bg-gray-200"}`}>
                                    <Text size={12} className="mr-1" /> Text
                                </Badge>
                            </li>
                            <li onClick={() => setTab("image")}>
                                <Badge variant={"outline"} className={`cursor-pointer text-[10px] ${tab === "image" && "bg-gray-200"}`}>
                                    <Image size={12} className="mr-1" /> Image
                                </Badge>
                            </li>
                            <li onClick={() => setTab("video")}>
                                <Badge variant={"outline"} className={`cursor-pointer text-[10px] ${tab === "video" && "bg-gray-200"}`}>
                                    <Video size={12} className="mr-1" /> Video
                                </Badge>
                            </li>
                        </ul>
                    </div>
                    <Button className="w-full mt-4" onClick={() => {
                        if (tab === "image") getImages();
                        else if (tab === "video") getVideos();
                        else if (tab === "text") getText();
                    }}>
                        Generate
                        <Loader className={`ml-2 ${loading ? "block animate animate-spin" : "hidden"}`} />
                    </Button>
                </div>
            </SidebarFooter>
        </>
    );
}