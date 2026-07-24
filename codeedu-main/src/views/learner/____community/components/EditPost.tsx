import React, { useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Post as PostType } from '@/@types/learner/community'
import { Input } from '@/components/ui/ShadcnInput'
import JoditEditor from 'jodit-react';
import type { IJodit } from 'jodit/esm/types/jodit';
import { fetchCreateContent } from '@/services/generative/GenerativeService';
import { Button } from '@/components/ui/ShadcnButton';
import { editCommunityPost } from '@/services/public/CommunityService';
import { toast } from 'sonner';
import type { IUIButtonState } from "jodit/esm/types";

interface EditPostProps {
    show: boolean
    onClose: (show: boolean) => void
    post?: PostType | null
}

const EditPost = ({ show, onClose, post }: EditPostProps) => {

    const [title, setTitle] = React.useState<string>('');

    const editorInstance = useRef<IJodit | null>(null);
    const handleEditorRef = (editor: IJodit) => {
        editorInstance.current = editor;
    };

    const config = {
        readonly: false,
        height: 400,
        toolbarButtonSize: 'middle' as IUIButtonState['size'],
        buttons: [
            'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', '|',
            'font', 'fontsize', '|', 'align', 'outdent', 'indent', '|', 'ul', 'ol', '|',
            'fullsize', 'preview', '|', 'image', 'video', 'table', '|',
        ],
        spellcheck: true,
        iframe: true,
        allowResizeX: false,
        allowResizeY: true,
        showXPathInStatusbar: false,
        showCharsCounter: true,
        showWordsCounter: true,
        useSplitMode: false,
        // direction: 'ltr',
        cache: true,
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        askBeforePasteSVG: false,
        uploader: { insertImageAsBase64URI: true },
        extraButtons: [{
            name: 'ai-assistant',
            tooltip: 'AI Assistant',
            iconURL: `${window.location.origin}/img/logo/imageai.png`,
        }],
        aiAssistant: {
            enabled: true,
            command: 'ai-assistant',
            async aiAssistantCallback(prompt: string, htmlFragment: string) {
                const refinedPrompt = `${prompt}, Create community content as HTML (not Markdown) optimized for Jodit editor, using semantic HTML tags without < style > or < body > tags.Apply Tailwind CSS classes for styling(e.g., text sizes, colors like text - gray - 700, text - blue - 600).Include bold URLs with <b> tags for emphasis where needed, and use <h1>, <h2>, <p>, and other tags as appropriate.If a table is relevant, include one with Tailwind classes, but avoid full-page card-like designs.Focus on clean, reusable content without inline CSS or complete page layouts.;`
                return fetchCreateContent(refinedPrompt, htmlFragment).then(data => data.replace(/```html/g, "").replace(/```/g, ""));
            }
        }
    };

    const editData = () => {
        if (!post) return;
        editCommunityPost(post?.id, {
            title,
            description: editorInstance.current?.value || '',
        }).then(() => {
            onClose(false);
            toast.success('Post updated successfully');
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className='max-w-7xl'>
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <Input
                            required
                            type="text"
                            id="title"
                            defaultValue={post?.title}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                            placeholder="Enter post title"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <div>
                            <label className="block mb-2">Description</label>
                            <JoditEditor editorRef={handleEditorRef} value={post?.description} config={config} tabIndex={1} />
                        </div>
                    </div>
                </form>
                <div className="flex justify-end mt-4">
                    <Button
                        type="button"
                        className="bg-primary text-white"
                        onClick={editData}
                    >
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EditPost