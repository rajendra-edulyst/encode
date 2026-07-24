import { fetchCreateContent } from "@/services/generative/GenerativeService";
import { IUIButtonState } from "jodit/esm/types";

export const JoEditConfig = {
    readonly: false,
    height: 400,
    toolbarButtonSize: 'middle' as IUIButtonState['size'],
    buttons: [
        'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', '|',
        'font', 'fontsize', '|', 'align', 'outdent', 'indent', '|', 'ul', 'ol', '|',
        'fullsize', 'preview', '|','table', '|', 'link','unlink', '|',  
    ],
    style: {
      background: '#262626',
      color: 'rgba(255,255,255,0.5)',
    },
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
            const refinedPrompt = `${prompt}, Generate only the inner HTML content intended for use inside a WYSIWYG editor like Jodit. Do NOT include <html>, <head>, <meta>, <title>, <link>, <style>, or <body> tags. Use clean semantic HTML tags such as <h1>, <h2>, <p>, <ul>, <table>, etc., with Tailwind CSS classes (e.g., text-gray-700, text-blue-600). Do not use inline styles. Use <b> tags to emphasize URLs. Make the output reusable, concise, and free of layout boilerplate or external links.`;
            return fetchCreateContent(refinedPrompt, htmlFragment).then(data => data.replace(/```html/g, "").replace(/```/g, ""));
        }
    }
};