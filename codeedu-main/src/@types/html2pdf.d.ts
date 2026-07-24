declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | number[];
        filename?: string;
        image?: { type: string; quality: number };
        html2canvas?: {
            scale?: number;
            useCORS?: boolean;
            logging?: boolean;
            letterRendering?: boolean;
        };
        jsPDF?: {
            unit: string;
            format: string;
            orientation: string;
        };
        pagebreak?: { mode: string[] };
    }

    interface Html2Pdf {
        set(options: Html2PdfOptions): Html2Pdf;
        from(element: HTMLElement): Html2Pdf;
        save(): Promise<void>;
        output(type: string, options?: Record<string, unknown>): Promise<Blob | string>;
        outputPdf(type?: string): Promise<Blob | string>;
        outputImg(type?: string): Promise<Blob | string>;
    }

    function html2pdf(): Html2Pdf;

    export default html2pdf;
}
