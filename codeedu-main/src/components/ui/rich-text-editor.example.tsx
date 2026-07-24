/**
 * Rich Text Editor - Example Usage
 * 
 * This file demonstrates how to use the RichTextEditor component
 * in your React application.
 */

import React, { useState } from "react";
import RichTextEditor from "./rich-text-editor";

const RichTextEditorExample: React.FC = () => {
    const [content, setContent] = useState("<p>Start typing your answer here...</p>");

    const handleChange = (value: string) => {
        setContent(value);
        console.log("Content changed:", value);
    };

    const handleBlur = () => {
        console.log("Editor lost focus, saving content...");
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Rich Text Editor Example</h1>
            
            <RichTextEditor
                value={content}
                maxLength={5000}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Output (HTML):</h2>
                <pre className="text-xs overflow-auto">{content}</pre>
            </div>
        </div>
    );
};

export default RichTextEditorExample;
