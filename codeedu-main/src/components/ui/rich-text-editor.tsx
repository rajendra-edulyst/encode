import React, { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Node, Extension, mergeAttributes } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List as ListIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Undo,
    Redo,
    Code,
    Quote,
    Highlighter,
    Superscript as SuperscriptIcon,
    Subscript as SubscriptIcon,
    Strikethrough,
    Video,
    ChevronDown,
    Link2,
    Image as ImageIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DEFAULT_MAX_IMAGE_BYTES = 10 * 1024 * 1024;
/** Max images per file-picker batch (TipTap insert). */
const MAX_IMAGES_PER_INSERT = 10;

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    className?: string;
    maxLength?: number;
    /** When set (e.g. blog = 10), caps total inline image count in the document. */
    maxInlineImages?: number;
    /** Max size per picked image file (default 10MB). */
    maxImageFileBytes?: number;
    /** Enable inline video upload/insert controls. */
    allowInlineVideos?: boolean;
    /** When set, caps total inline <video> count in the document. */
    maxInlineVideos?: number;
    /** Max size per picked video file (default 50MB). */
    maxVideoFileBytes?: number;
    /** Hide upload/attachment buttons */
    hideUploads?: boolean;
}

const CharacterLimit = Extension.create({
    name: "characterLimit",
    addOptions() {
        return {
            limit: null,
        };
    },
    addProseMirrorPlugins() {
        return [
            new Plugin({
                filterTransaction: (transaction, state) => {
                    const limit = this.options.limit;
                    
                    // Nothing has changed or no limit
                    if (!limit || !transaction.docChanged) {
                        return true;
                    }

                    const newLength = transaction.doc.textBetween(0, transaction.doc.content.size, '\n\n').length;
                    if (newLength > limit) {
                        toast.error(`Maximum character limit of ${limit} reached.`);
                        return false;
                    }

                    return true;
                },
            }),
        ];
    },
});

// Custom resizable image extension
const ResizableImage = Image.extend({
    name: "resizableImage",

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            width: {
                default: null,
                parseHTML: (element: HTMLElement) => element.getAttribute("width"),
                renderHTML: (attributes: { width?: number | null }) => {
                    if (!attributes.width) {
                        return {};
                    }
                    return {
                        width: attributes.width,
                    };
                },
            },
        };
    },

    addNodeView() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return ({ node, editor, getPos }: any) => {
            const container = document.createElement("div");
            container.className = "image-wrapper";
            container.style.position = "relative";
            container.style.display = "inline-block";
            container.style.maxWidth = "100%";

            const img = document.createElement("img");
            img.src = node.attrs.src;
            img.alt = node.attrs.alt || "";
            img.className = "rounded-lg";

            if (node.attrs.width) {
                img.style.width = `${node.attrs.width}px`;
            } else {
                img.style.width = "auto";
                img.style.maxWidth = "100%";
            }
            img.style.height = "auto";
            img.style.display = "block";

            let isResizing = false;
            let startX = 0;
            let startWidth = 0;

            img.addEventListener("mousedown", (e) => {
                if (!editor.isEditable) return;

                const rect = img.getBoundingClientRect();
                const isNearEdge = e.clientX > rect.right - 10;

                if (isNearEdge) {
                    e.preventDefault();
                    isResizing = true;
                    startX = e.clientX;
                    startWidth = rect.width;
                    img.style.cursor = "ew-resize";
                }
            });

            document.addEventListener("mousemove", (e) => {
                if (!isResizing) return;
                e.preventDefault();

                const deltaX = e.clientX - startX;
                const newWidth = Math.max(100, Math.min(startWidth + deltaX, 800));

                img.style.width = `${newWidth}px`;
            });

            document.addEventListener("mouseup", () => {
                if (!isResizing) return;
                isResizing = false;
                img.style.cursor = "pointer";

                const width = parseInt(img.style.width);
                if (typeof getPos === "function") {
                    editor.commands.updateAttributes("resizableImage", { width });
                }
            });

            container.appendChild(img);
            return {
                dom: container,
            };
        };
    },
});

const InlineVideo = Node.create({
    name: "inlineVideo",
    group: "block",
    atom: true,
    selectable: true,
    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            controls: {
                default: true,
            },
            preload: {
                default: "metadata",
            },
            playsinline: {
                default: true,
            },
            class: {
                default: "w-full rounded-lg my-2",
            },
        };
    },

    parseHTML() {
        return [{ tag: "video" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["video", mergeAttributes(HTMLAttributes)];
    },
});

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    onBlur,
    className,
    maxLength,
    maxInlineImages,
    maxImageFileBytes = DEFAULT_MAX_IMAGE_BYTES,
    allowInlineVideos = false,
    maxInlineVideos = 1,
    maxVideoFileBytes = 50 * 1024 * 1024,
    hideUploads = false,
}) => {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
    const imageFileInputRef = React.useRef<HTMLInputElement>(null);
    const videoFileInputRef = React.useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4],
                },
                codeBlock: false,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: ["left", "center", "right", "justify"],
            }),
            Underline,
            TextStyle,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Highlight.configure({
                multicolor: false,
            }),
            Superscript,
            Subscript,
            CodeBlock.configure({
                HTMLAttributes: {
                    class: "bg-gray-100 dark:bg-gray-800 rounded p-2 font-mono text-sm",
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline hover:text-primary/80 cursor-pointer",
                    rel: "noopener noreferrer",
                    target: "_blank",
                },
            }),
            ResizableImage.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: "max-w-full h-auto rounded-lg my-2",
                },
            }),
            InlineVideo,
            ...(maxLength ? [CharacterLimit.configure({ limit: maxLength })] : []),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const text = editor.getText();

            // Check max length if specified
            if (maxLength && text.length > maxLength) {
                return;
            }

            onChange(html);
        },
        onBlur: () => {
            if (onBlur) {
                onBlur();
            }
        },
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] p-4",
                    "break-words whitespace-pre-wrap overflow-wrap-anywhere",
                    "dark:prose-invert prose-headings:font-semibold prose-p:my-2",
                    className
                ),
            },
        },
    });

    // Update editor content when value changes externally
    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    // Handler functions for Link
    const handleSetLink = useCallback(() => {
        const previousUrl = editor.getAttributes("link").href || "";
        setLinkUrl(previousUrl);
        setLinkDialogOpen(true);
    }, [editor]);

    const handleSaveLink = useCallback(() => {
        if (linkUrl === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            // If there's a selection or we're extending an existing link
            if (editor.state.selection.empty) {
                // No selection, just set the link at cursor
                editor.chain().focus().setLink({ href: linkUrl }).run();
            } else {
                // There's a selection, apply link to it
                editor.chain().focus().setLink({ href: linkUrl }).run();
            }
        }
        setLinkDialogOpen(false);
        setLinkUrl("");
    }, [editor, linkUrl]);

    const handleRemoveLink = useCallback(() => {
        editor.chain().focus().unsetLink().run();
        setLinkDialogOpen(false);
        setLinkUrl("");
    }, [editor]);

    const mbLimit = Math.round(maxImageFileBytes / (1024 * 1024));
    const videoMbLimit = Math.round(maxVideoFileBytes / (1024 * 1024));

    // Handler functions for Image
    const handleSetImage = useCallback(() => {
        if (maxInlineImages != null && editor) {
            const n = (editor.getHTML().match(/<img\b/gi) || []).length;
            if (n >= maxInlineImages) {
                alert(
                    maxInlineImages === 0
                        ? 'Images are disabled for this Buzz type.'
                        : `Maximum ${maxInlineImages} images allowed in this post.`
                );
                return;
            }
        }
        setImageFiles([]);
        setImagePreviews([]);
        if (imageFileInputRef.current) imageFileInputRef.current.value = "";
        setImageDialogOpen(true);
    }, [editor, maxInlineImages]);

    const handleImageFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const picked = e.target.files ? Array.from(e.target.files) : [];
            if (picked.length === 0) return;

            const editorHtml = editor?.getHTML() ?? "";
            const existingCount = (editorHtml.match(/<img\b/gi) || []).length;
            const room =
                maxInlineImages != null ? Math.max(0, maxInlineImages - existingCount) : Infinity;

            if (maxInlineImages != null && room === 0) {
                alert(`Maximum ${maxInlineImages} images allowed in this post. Remove an image to add more.`);
                e.target.value = "";
                return;
            }

            const batchCap = Math.min(MAX_IMAGES_PER_INSERT, room);
            const toScan = picked.slice(0, batchCap);

            if (picked.length > batchCap) {
                alert(
                    maxInlineImages != null
                        ? `Only ${batchCap} more image(s) allowed (max ${maxInlineImages} total). Extra files were ignored.`
                        : `Only the first ${batchCap} file(s) were taken from your selection.`
                );
            }

            const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
            const accepted: File[] = [];
            const skipped: string[] = [];

            for (const file of toScan) {
                if (!validTypes.includes(file.type)) {
                    skipped.push(`${file.name} (unsupported type)`);
                    continue;
                }
                if (file.size > maxImageFileBytes) {
                    skipped.push(`${file.name} (over ${mbLimit}MB)`);
                    continue;
                }
                accepted.push(file);
            }

            if (skipped.length) {
                alert(
                    `Skipped ${skipped.length} file(s):\n${skipped.slice(0, 5).join("\n")}${skipped.length > 5 ? "\n…" : ""}\n\nAllowed: PNG, JPG, WebP — max ${mbLimit}MB each, up to ${batchCap} image(s) in this batch.`
                );
            }

            if (accepted.length === 0) {
                e.target.value = "";
                return;
            }

            setImageFiles(accepted);

            Promise.all(
                accepted.map(
                    (file) =>
                        new Promise<string>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.onerror = () => reject(new Error("read failed"));
                            reader.readAsDataURL(file);
                        })
                )
            )
                .then((dataUrls) => setImagePreviews(dataUrls))
                .catch(() => {
                    setImageFiles([]);
                    setImagePreviews([]);
                    alert("Could not read one or more images.");
                });
        },
        [editor, maxInlineImages, maxImageFileBytes, mbLimit]
    );

    const escapeAttr = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const handleSaveImage = useCallback(() => {
        if (imagePreviews.length === 0 || !editor) return;

        if (maxInlineImages != null) {
            const existing = (editor.getHTML().match(/<img\b/gi) || []).length;
            if (existing + imagePreviews.length > maxInlineImages) {
                alert(
                    `Maximum ${maxInlineImages} images allowed. You can add ${Math.max(0, maxInlineImages - existing)} more.`
                );
                return;
            }
        }

        // Chaining multiple setImage() calls is unreliable in TipTap — only one block may remain.
        // Insert a single HTML fragment with one <img> per paragraph so all images persist.
        if (imagePreviews.length === 1) {
            editor
                .chain()
                .focus()
                .setImage({
                    src: imagePreviews[0],
                    alt: imageFiles[0]?.name || "Uploaded image",
                })
                .run();
        } else {
            const html = imagePreviews
                .map((src, index) => {
                    const alt = escapeAttr(imageFiles[index]?.name || `Image ${index + 1}`);
                    return `<p><img src="${src}" alt="${alt}" class="max-w-full h-auto rounded-lg my-2" /></p>`;
                })
                .join("");
            editor.chain().focus().insertContent(html).run();
        }

        setImageDialogOpen(false);
        setImageFiles([]);
        setImagePreviews([]);
        if (imageFileInputRef.current) imageFileInputRef.current.value = "";
    }, [editor, imagePreviews, imageFiles, maxInlineImages]);

    const handleCancelImage = useCallback(() => {
        setImageDialogOpen(false);
        setImageFiles([]);
        setImagePreviews([]);
        if (imageFileInputRef.current) imageFileInputRef.current.value = "";
    }, []);

    const handleSetVideo = useCallback(() => {
        if (!allowInlineVideos) {
            alert('Inline video is only available for Blog Buzz.');
            return;
        }
        if (maxInlineVideos != null && editor) {
            const n = (editor.getHTML().match(/<video\b/gi) || []).length;
            if (n >= maxInlineVideos) {
                alert(`Maximum ${maxInlineVideos} inline video(s) allowed in this post.`);
                return;
            }
        }
        setVideoFiles([]);
        setVideoPreviews([]);
        if (videoFileInputRef.current) videoFileInputRef.current.value = "";
        setVideoDialogOpen(true);
    }, [allowInlineVideos, editor, maxInlineVideos]);

    const handleVideoFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const picked = e.target.files ? Array.from(e.target.files) : [];
            if (picked.length === 0) return;

            const existingCount = (editor.getHTML().match(/<video\b/gi) || []).length;
            const room = maxInlineVideos != null ? Math.max(0, maxInlineVideos - existingCount) : Infinity;
            if (room === 0) {
                alert(`Maximum ${maxInlineVideos} inline video(s) allowed in this post.`);
                e.target.value = "";
                return;
            }

            const toScan = picked.slice(0, Math.min(room, 3));
            const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"];
            const accepted: File[] = [];
            const skipped: string[] = [];

            for (const file of toScan) {
                if (!validTypes.includes(file.type)) {
                    skipped.push(`${file.name} (unsupported type)`);
                    continue;
                }
                if (file.size > maxVideoFileBytes) {
                    skipped.push(`${file.name} (over ${videoMbLimit}MB)`);
                    continue;
                }
                accepted.push(file);
            }

            if (skipped.length) {
                alert(
                    `Skipped ${skipped.length} file(s):\n${skipped.slice(0, 5).join("\n")}${skipped.length > 5 ? "\n…" : ""}\n\nAllowed: MP4, WEBM, OGG, MOV, AVI — max ${videoMbLimit}MB each.`
                );
            }

            if (accepted.length === 0) {
                e.target.value = "";
                return;
            }

            setVideoFiles(accepted);
            Promise.all(
                accepted.map(
                    (file) =>
                        new Promise<string>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.onerror = () => reject(new Error("read failed"));
                            reader.readAsDataURL(file);
                        })
                )
            )
                .then((urls) => setVideoPreviews(urls))
                .catch(() => {
                    setVideoFiles([]);
                    setVideoPreviews([]);
                    alert("Could not read one or more videos.");
                });
        },
        [editor, maxInlineVideos, maxVideoFileBytes, videoMbLimit]
    );

    const handleSaveVideo = useCallback(() => {
        if (videoPreviews.length === 0 || !editor) return;
        if (!allowInlineVideos) {
            alert('Inline video is only available for Blog Buzz.');
            return;
        }

        if (maxInlineVideos != null) {
            const existing = (editor.getHTML().match(/<video\b/gi) || []).length;
            if (existing + videoPreviews.length > maxInlineVideos) {
                alert(
                    `Maximum ${maxInlineVideos} inline video(s) allowed. You can add ${Math.max(
                        0,
                        maxInlineVideos - existing
                    )} more.`
                );
                return;
            }
        }

        // Insert as TipTap node (not raw HTML) so mixed content order stays stable.
        for (const src of videoPreviews) {
            editor
                .chain()
                .focus()
                .insertContent({
                    type: "inlineVideo",
                    attrs: {
                        src,
                        controls: true,
                        preload: "metadata",
                        playsinline: true,
                        class: "w-full rounded-lg my-2",
                    },
                })
                .run();
        }

        setVideoDialogOpen(false);
        setVideoFiles([]);
        setVideoPreviews([]);
        if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    }, [allowInlineVideos, editor, maxInlineVideos, videoFiles, videoPreviews]);

    const handleCancelVideo = useCallback(() => {
        setVideoDialogOpen(false);
        setVideoFiles([]);
        setVideoPreviews([]);
        if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    }, []);

    const MenuButton = ({
        onClick,
        isActive,
        disabled,
        children,
        title,
    }: {
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <button
            type="button"
            disabled={disabled}
            title={title}
            className={cn(
                "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                isActive && "bg-gray-200 dark:bg-gray-600",
                disabled && "opacity-50 cursor-not-allowed"
            )}
            onMouseDown={(e) => {
                e.preventDefault(); // Prevent losing focus
            }}
            onClick={onClick}
        >
            {children}
        </button>
    );

    // Get character count - recalculates on every render when content changes
    const charCount = editor ? editor.getText().length : 0;
    const inlineImageCount = editor ? (editor.getHTML().match(/<img\b/gi) || []).length : 0;
    const inlineVideoCount = editor ? (editor.getHTML().match(/<video\b/gi) || []).length : 0;
    const atInlineImageLimit =
        maxInlineImages != null && inlineImageCount >= maxInlineImages;
    const atInlineVideoLimit =
        !allowInlineVideos || (maxInlineVideos != null && inlineVideoCount >= maxInlineVideos);

    return (
        <div className="relative border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden focus-within:border-primary transition-colors">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {/* Undo/Redo - First */}
                <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
                    <MenuButton
                        disabled={!editor.can().undo()}
                        title="Undo (Ctrl+Z)"
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        <Undo className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        disabled={!editor.can().redo()}
                        title="Redo (Ctrl+Y)"
                        onClick={() => editor.chain().focus().redo().run()}
                    >
                        <Redo className="w-4 h-4" />
                    </MenuButton>
                </div>

                {/* Heading Dropdown */}
                <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    "flex items-center gap-1 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                    (editor.isActive("heading", { level: 1 }) ||
                                        editor.isActive("heading", { level: 2 }) ||
                                        editor.isActive("heading", { level: 3 }) ||
                                        editor.isActive("heading", { level: 4 })) && "bg-gray-200 dark:bg-gray-600"
                                )}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {editor.isActive("heading", { level: 1 }) ? "Heading 1" : editor.isActive("heading", { level: 2 }) ? "Heading 2" : editor.isActive("heading", { level: 3 }) ? "Heading 3" : editor.isActive("heading", { level: 4 }) ? "Heading 4" : "Heading"}
                                <ChevronDown className="w-3 h-3" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem
                                className={cn(editor.isActive("heading", { level: 1 }) && "bg-gray-100 dark:bg-gray-700")}
                                onMouseDown={(e) => e.preventDefault()}
                                onSelect={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            >
                                <span className="font-bold text-lg">H1</span>
                                <span className="ml-2">Heading 1</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={cn(editor.isActive("heading", { level: 2 }) && "bg-gray-100 dark:bg-gray-700")}
                                onMouseDown={(e) => e.preventDefault()}
                                onSelect={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            >
                                <span className="font-bold text-base">H2</span>
                                <span className="ml-2">Heading 2</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={cn(editor.isActive("heading", { level: 3 }) && "bg-gray-100 dark:bg-gray-700")}
                                onMouseDown={(e) => e.preventDefault()}
                                onSelect={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            >
                                <span className="font-bold text-sm">H3</span>
                                <span className="ml-2">Heading 3</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={cn(editor.isActive("heading", { level: 4 }) && "bg-gray-100 dark:bg-gray-700")}
                                onMouseDown={(e) => e.preventDefault()}
                                onSelect={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                            >
                                <span className="font-bold text-xs">H4</span>
                                <span className="ml-2">Heading 4</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Text Formatting */}
                <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
                    <MenuButton
                        isActive={editor.isActive("bold")}
                        title="Bold (Ctrl+B)"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        isActive={editor.isActive("italic")}
                        title="Italic (Ctrl+I)"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        isActive={editor.isActive("underline")}
                        title="Underline (Ctrl+U)"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        isActive={editor.isActive("strike")}
                        title="Strikethrough"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <Strikethrough className="w-4 h-4" />
                    </MenuButton>
                </div>

                {/* Superscript / Subscript */}
                <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
                    <MenuButton
                        isActive={editor.isActive("superscript")}
                        title="Superscript"
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    >
                        <SuperscriptIcon className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        isActive={editor.isActive("subscript")}
                        title="Subscript"
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                    >
                        <SubscriptIcon className="w-4 h-4" />
                    </MenuButton>
                </div>

                {/* List Dropdown */}
                <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    "flex items-center gap-1 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                    (editor.isActive("bulletList") ||
                                        editor.isActive("orderedList") ||
                                        editor.isActive("taskList")) && "bg-gray-200 dark:bg-gray-600"
                                )}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <ListIcon className="w-4 h-4" />
                                <ChevronDown className="w-3 h-3" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem
                                className={cn(editor.isActive("bulletList") && "bg-gray-100 dark:bg-gray-700")}
                                onMouseDown={(e) => e.preventDefault()}
                                onSelect={() => editor.chain().focus().toggleBulletList().run()}
                            >
                                <span className="mr-2">•</span>
                                <span>Bullet List</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={cn(editor.isActive("orderedList") && "bg-gray-100 dark:bg-gray-700")}
                                onMouseDown={(e) => e.preventDefault()}
                                onSelect={() => editor.chain().focus().toggleOrderedList().run()}
                            >
                                <span className="mr-2">1.</span>
                                <span>Ordered List</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Text Alignment */}
                <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
                    <MenuButton
                        isActive={editor.isActive({ textAlign: "left" })}
                        title="Align Left"
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    >
                        <AlignLeft className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        isActive={editor.isActive({ textAlign: "center" })}
                        title="Align Center"
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    >
                        <AlignCenter className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        isActive={editor.isActive({ textAlign: "right" })}
                        title="Align Right"
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    >
                        <AlignRight className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        isActive={editor.isActive({ textAlign: "justify" })}
                        title="Justify"
                        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                    >
                        <AlignJustify className="w-4 h-4" />
                    </MenuButton>
                </div>

                {/* Code Block / Quote / Highlight */}
                <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
                    <MenuButton
                        isActive={editor.isActive("codeBlock")}
                        title="Code Block"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    >
                        <Code className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        isActive={editor.isActive("blockquote")}
                        title="Quote"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        <Quote className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        isActive={editor.isActive("highlight")}
                        title="Highlight"
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                    >
                        <Highlighter className="w-4 h-4" />
                    </MenuButton>
                </div>

                {/* Link & Image */}
                {!hideUploads && (
                    <div className="flex gap-1">
                        <MenuButton
                            isActive={editor.isActive("link")}
                            title="Insert Link"
                            onClick={handleSetLink}
                        >
                            <Link2 className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            title={
                                atInlineImageLimit
                                    ? (maxInlineImages === 0
                                        ? 'Images disabled for this Buzz type'
                                        : `Maximum ${maxInlineImages} images in this post`)
                                    : 'Insert Image'
                            }
                            disabled={atInlineImageLimit}
                            onClick={handleSetImage}
                        >
                            <ImageIcon className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            title={
                                !allowInlineVideos
                                    ? 'Video is available in Blog only'
                                    : atInlineVideoLimit
                                    ? `Maximum ${maxInlineVideos} inline video(s) in this post`
                                    : 'Insert Video'
                            }
                            disabled={atInlineVideoLimit}
                            onClick={handleSetVideo}
                        >
                            <Video className="w-4 h-4" />
                        </MenuButton>
                    </div>
                )}
            </div>

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className="bg-transparent max-h-[350px] overflow-y-auto overflow-x-hidden w-full"
            />

            {/* Disabled floating bubble menu due positioning artifacts in editor UI. */}

            {/* Character Count */}
            {maxLength && (
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <span>Maximum {maxLength} characters</span>
                    <span className={cn(charCount > maxLength && "text-red-500")}>
                        {charCount}/{maxLength}
                    </span>
                </div>
            )}

            {/* Link Dialog */}
            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Link</DialogTitle>
                        <DialogDescription>
                            Enter the URL for the link. Leave empty to remove the link.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="link-url">URL</Label>
                            <Input
                                id="link-url"
                                type="url"
                                value={linkUrl}
                                placeholder="https://example.com"
                                onChange={(e) => setLinkUrl(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        {editor.isActive("link") && (
                            <Button
                                variant="solid"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={handleRemoveLink}
                            >
                                Remove Link
                            </Button>
                        )}
                        <Button
                            variant="plain"
                            onClick={() => setLinkDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="solid" onClick={handleSaveLink}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Image Dialog */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload images</DialogTitle>
                        <DialogDescription>
                            Select one or more images (PNG, JPG, WebP). Max {mbLimit}MB per file; up to{' '}
                            {MAX_IMAGES_PER_INSERT} files per batch.
                            {maxInlineImages != null
                                ? ` This post type allows up to ${maxInlineImages} images total.`
                                : ''}{' '}
                            You can resize after inserting by dragging an image edge.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="image-upload">Choose images</Label>
                            <Input
                                ref={imageFileInputRef}
                                id="image-upload"
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                multiple
                                onChange={handleImageFileChange}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Hold Ctrl (Windows) or Cmd (Mac) to select multiple files in the picker.
                            </p>
                            {imageFiles.length > 0 && (
                                <ul className="text-sm font-medium text-green-600 dark:text-green-400 space-y-1">
                                    {imageFiles.map((f, i) => (
                                        <li key={`${f.name}-${i}`}>
                                            ✓ {f.name} ({(f.size / 1024).toFixed(0)} KB)
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {imagePreviews.length > 0 && (
                            <div className="grid gap-2">
                                <Label>Preview</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                                    {imagePreviews.map((src, i) => (
                                        <img
                                            key={i}
                                            src={src}
                                            alt=""
                                            className="w-full h-24 object-contain rounded border border-gray-200 dark:border-gray-600"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="plain"
                            onClick={handleCancelImage}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            disabled={imagePreviews.length === 0}
                            onClick={handleSaveImage}
                        >
                            {imagePreviews.length > 1
                                ? `Insert ${imagePreviews.length} images`
                                : "Insert image"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Video Dialog */}
            <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload video</DialogTitle>
                        <DialogDescription>
                            Select video files (MP4, WEBM, OGG, MOV, AVI). Max {videoMbLimit}MB per file.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="video-upload-inline">Choose video</Label>
                            <Input
                                ref={videoFileInputRef}
                                id="video-upload-inline"
                                type="file"
                                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
                                multiple
                                onChange={handleVideoFileChange}
                            />
                            {videoFiles.length > 0 && (
                                <ul className="text-sm font-medium text-green-600 dark:text-green-400 space-y-1">
                                    {videoFiles.map((f, i) => (
                                        <li key={`${f.name}-${i}`}>
                                            ✓ {f.name} ({(f.size / (1024 * 1024)).toFixed(1)} MB)
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {videoPreviews.length > 0 && (
                            <div className="grid gap-2">
                                <Label>Preview</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                                    {videoPreviews.map((src, i) => (
                                        <video key={i} src={src} controls className="w-full h-28 rounded border border-gray-200 dark:border-gray-600 bg-black" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button variant="plain" onClick={handleCancelVideo}>
                            Cancel
                        </Button>
                        <Button variant="solid" disabled={videoPreviews.length === 0} onClick={handleSaveVideo}>
                            {videoPreviews.length > 1 ? `Insert ${videoPreviews.length} videos` : "Insert video"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RichTextEditor;
