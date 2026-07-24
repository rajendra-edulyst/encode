// import React from "react";
// import DOMPurify from "dompurify";
// import { cn } from "@/lib/utils";

// interface SafeHtmlProps {
//     html: string;
//     className?: string;
// }

// const SafeHtml: React.FC<SafeHtmlProps> = ({ html, className }) => {
//     const sanitizedHtml = DOMPurify.sanitize(html, {
//         USE_PROFILES: { html: true },
//     });
//     return (
//         <div
//             className={cn('max-w-none', className)}
//             dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
//         />
//     );
// };

// export default SafeHtml;
// import React from "react";
// import DOMPurify from "dompurify";
// import { cn } from "@/lib/utils";

// interface SafeHtmlProps {
//     html: string;
//     className?: string;
//     preserveLineBreaks?: boolean;
//     prose?: boolean;
//     maxLines?: number;
// }

// const SafeHtml: React.FC<SafeHtmlProps> = ({ 
//     html, 
//     className, 
//     preserveLineBreaks = true,
//     prose = true,
//     maxLines
// }) => {
//     const formatHtml = (content: string): string => {
//         if (!content.trim()) return '';

//         const hasHtmlTags = /<[^>]*>/.test(content);

//         if (hasHtmlTags) {
//             return DOMPurify.sanitize(content, {
//                 USE_PROFILES: { html: true },
//                 ALLOWED_TAGS: [
//                     'p', 'br', 'div', 'span', 'strong', 'em', 'b', 'i', 'u',
//                     'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
//                     'a', 'img', 'blockquote', 'code', 'pre', 'hr'
//                 ],
//                 ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target']
//             });
//         } else {
//             let formattedContent = content;

//             if (preserveLineBreaks) {
//                 // Handle different types of line breaks and whitespace
//                 formattedContent = content
//                     .replace(/\r\n/g, '\n') // Normalize line breaks
//                     .split(/\n\s*\n/) // Split on paragraph breaks
//                     .map(paragraph => {
//                         const trimmed = paragraph.trim();
//                         if (!trimmed) return '';

//                         // Handle bullet points or list-like content
//                         if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
//                             return `<ul><li>${trimmed.substring(2)}</li></ul>`;
//                         }

//                         return `<p>${trimmed}</p>`;
//                     })
//                     .join('');

//                 // Replace single newlines with line breaks within paragraphs
//                 formattedContent = formattedContent.replace(/(?<!<\/p>)\n(?!<p>)/g, '<br>');
//             } else {
//                 formattedContent = `<p>${content.trim()}</p>`;
//             }

//             return DOMPurify.sanitize(formattedContent, {
//                 USE_PROFILES: { html: true },
//                 ALLOWED_TAGS: ['p', 'br', 'ul', 'li'],
//                 ALLOWED_ATTR: []
//             });
//         }
//     };

//     const sanitizedHtml = formatHtml(html);

//     if (!sanitizedHtml) {
//         return (
//             <div className={cn('text-white italic', className)}>
//                 No description available
//             </div>
//         );
//     }

//     const containerClasses = cn(
//         'max-w-none text-white',
//         {
//             'prose prose-gray prose-sm max-w-none': prose,
//             'line-clamp-3': maxLines === 3,
//             'line-clamp-4': maxLines === 4,
//             'line-clamp-5': maxLines === 5,
//         },
//         className
//     );

//     const style = maxLines ? { WebkitLineClamp: maxLines } : undefined;

//     return (
//         <div
//             className={containerClasses}
//             style={style}
//             dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
//         />
//     );
// };

// export default SafeHtml;
import React from "react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

interface SafeHtmlProps {
    html: string;
    className?: string;
    preserveLineBreaks?: boolean;
    prose?: boolean;
    maxLines?: number;
}

const SafeHtml: React.FC<SafeHtmlProps> = ({
    html,
    className,
    preserveLineBreaks = true,

    maxLines
}) => {
    const formatHtml = (content: string): string => {
        if (!content?.trim()) return '';

        const hasHtmlTags = /<[^>]*>/.test(content);

        if (hasHtmlTags) {
            return DOMPurify.sanitize(content, {
                USE_PROFILES: { html: true },
                ALLOWED_TAGS: [
                    'p', 'br', 'div', 'span', 'strong', 'em', 'b', 'i', 'u',
                    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'a', 'img', 'blockquote', 'code', 'pre', 'hr'
                ],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target']
            });
        } else {
            let formattedContent = content;

            if (preserveLineBreaks) {
                formattedContent = content
                    .replace(/\r\n/g, '\n')
                    .split(/\n\s*\n/)
                    .map(paragraph => {
                        const trimmed = paragraph.trim();
                        if (!trimmed) return '';

                        if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                            return `<ul><li>${trimmed.substring(2)}</li></ul>`;
                        }

                        return `<p>${trimmed}</p>`;
                    })
                    .join('');

                formattedContent = formattedContent.replace(/(?<!<\/p>)\n(?!<p>)/g, '<br>');
            } else {
                formattedContent = `<p>${content.trim()}</p>`;
            }

            return DOMPurify.sanitize(formattedContent, {
                USE_PROFILES: { html: true },
                ALLOWED_TAGS: ['p', 'br', 'ul', 'li'],
                ALLOWED_ATTR: []
            });
        }
    };

    const sanitizedHtml = formatHtml(html);

    if (!sanitizedHtml) {
        return (
            <div className={cn('text-white italic', className)}>
                No description available
            </div>
        );
    }

    const containerClasses = cn(
        // ✅ Ensures white text in all themes
        'max-w-none prose prose-invert prose-sm !text-white dark:[&_*]:!text-white leading-relaxed',
        {
            'line-clamp-3': maxLines === 3,
            'line-clamp-4': maxLines === 4,
            'line-clamp-5': maxLines === 5,
        },
        className
    );

    const style = maxLines ? { WebkitLineClamp: maxLines } : undefined;

    return (
        <div
            className={containerClasses}
            style={style}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
};

export default SafeHtml;
