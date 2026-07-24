export const getFileType = (fileUrlOrName: string): string => {
    // Extract file extension
    const extension = fileUrlOrName.split('.').pop()?.toLowerCase();

    if (!extension) return "unknown";

    // Define file type categories
    const fileTypes: { [key: string]: string } = {
        pdf: "pdf",
        jpg: "image", jpeg: "image", png: "image", gif: "image", webp: "image",
        mp4: "video", mov: "video", avi: "video", mkv: "video", webm: "video",
        ppt: "ppt", pptx: "ppt",
        doc: "docx", docx: "docx",
        xls: "excel", xlsx: "excel",
        txt: "text", csv: "text",
        zip: "compressed", rar: "compressed",
    };

    return fileTypes[extension] || "unknown";
};
