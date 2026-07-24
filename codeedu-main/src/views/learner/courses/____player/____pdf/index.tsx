import * as React from 'react';
import { DocumentLoadEvent, Viewer, Worker } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import type { ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import { useState, useCallback, useEffect } from 'react';
import { fetchContentCompletion } from '@/services/learner/ContentCompletionService';
import { useContentCompletionStore } from '@/store/learner/contentCompletionStore';

interface PdfRenderToolbarProps {
    fileUrl: string;
    contentId: string;
}

const PdfRenderToolbar: React.FC<PdfRenderToolbarProps> = ({ fileUrl, contentId }) => {
    const toolbarPluginInstance = toolbarPlugin();
    const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;
    const { setContentCompletion, setLoading, setError } = useContentCompletionStore();

    const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
        ...slot,
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        SwitchTheme: () => <></>,
        SwitchThemeMenuItem: () => <></>,
        Open: () => <></>,
        OpenMenuItem: () => <></>,
        Print: () => <></>,
        PrintMenuItem: () => <></>,
    });

    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [maxPageVisited, setMaxPageVisited] = useState<number>(1);
    const bookmark = 2;

    const getCompletion = useCallback(async (bookmark: number, page: number, completion: number) => {
        if (!contentId) {
            setError("contentId is missing");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const updateContentResp = await fetchContentCompletion(bookmark.toString(), contentId, completion.toString());
            setContentCompletion(updateContentResp);
        } catch (error) {
            setError("Error fetching module");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [contentId, setContentCompletion, setError, setLoading]);

    useEffect(() => {
        if (numPages > 0) {
            getCompletion(bookmark, 2, Math.floor((1 / numPages) * 100));
        }
    }, [numPages, getCompletion]);


    const handleDocumentLoadSuccess = (e: DocumentLoadEvent) => {
        const numPages = e.file.data.length;
        console.log("Document loaded with pages:", numPages);
        setNumPages(numPages);

        if (numPages > 0) {
            const completion = Math.floor((1 / numPages) * 100);
            console.log("Initial completion percentage:", completion);
            getCompletion(bookmark, 1, completion);
        }
    };


    // const handlePageChange = (e: { currentPage: number }) => {
    //     const currentPageNumber = e.currentPage + 1;
    //     setCurrentPage(currentPageNumber);

    //     if (currentPageNumber > maxPageVisited) {
    //         setMaxPageVisited(currentPageNumber);
    //     }

    //     const completionPercentage = numPages > 0 ? Math.floor((maxPageVisited / numPages) * 100) : 0;
    //     getCompletion(bookmark, currentPageNumber, completionPercentage);
    // };

    const handlePageChange = (e: { currentPage: number }) => {
        const currentPageNumber = e.currentPage + 1;
        console.log("Page changed:", currentPageNumber);

        setCurrentPage(currentPageNumber);

        if (currentPageNumber > maxPageVisited) {
            console.log("Updating maxPageVisited from", maxPageVisited, "to", currentPageNumber);
            setMaxPageVisited(currentPageNumber);
        }

        const completionPercentage = numPages > 0 ? Math.floor((maxPageVisited / numPages) * 100) : 0;
        console.log("Completion percentage calculated:", completionPercentage);

        getCompletion(bookmark, currentPageNumber, completionPercentage);
    };

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
            <div
                className="rpv-core__viewer"
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        backgroundColor: '#eeeeee',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        padding: '0.25rem',
                    }}
                >
                    <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
                </div>
                <div
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Viewer
                        fileUrl={fileUrl}
                        plugins={[toolbarPluginInstance]}
                        onDocumentLoad={handleDocumentLoadSuccess}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </Worker>
    );
};

export default PdfRenderToolbar;
