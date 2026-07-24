// /**  

// @@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

// @date of Version 1 : 21 March 2025
// @author:: Edulyst Ventures  
// @purpose : This Component is used to render the PDF file in the viewer
// @dependency : This component is dependent on react-pdf and pdfjs-dist packages and fileUrl, onPageChange, onDocumentLoad, initialPage props

// @@ Use case (if any use case) and solutions 

// **/

// import React, { useState, useCallback, useRef, useEffect } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
// import Copyright from './copyright';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface PdfRenderProps {
//     fileUrl: string;
//     onPageChange?: (page: number, numPages: number) => void;
//     onDocumentLoad?: (numPages: number) => void;
//     initialPage?: number;
//     content?: string;
// }

// const ZOOM_STEP = 0.2;
// const MIN_ZOOM = 0.5;
// const MAX_ZOOM = 3.0;

// type ScrollMode = 'vertical' | 'horizontal' | 'wrapped' | 'page';
// type PageLayout = 'single' | 'dual' | 'dual-cover';

// const PdfRender: React.FC<PdfRenderProps> = ({ fileUrl, content, onPageChange, onDocumentLoad, initialPage = 0 }) => {
//     const [numPages, setNumPages] = useState<number>(0);
//     const [currentPage, setCurrentPage] = useState<number>(initialPage + 1);
//     const [scale, setScale] = useState<number>(1);
//     const [fitWidth, setFitWidth] = useState<boolean>(true);
//     const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
//     const [containerWidth, setContainerWidth] = useState<number>(0);
//     const [pageInputValue, setPageInputValue] = useState<string>(String(initialPage + 1));
//     const [rotation, setRotation] = useState<number>(0);
//     const [scrollMode, setScrollMode] = useState<ScrollMode>('vertical');
//     const [pageLayout, setPageLayout] = useState<PageLayout>('single');
//     const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

//     // Search state
//     const [showSearch, setShowSearch] = useState<boolean>(false);
//     const [searchText, setSearchText] = useState<string>('');
//     const [matchCase, setMatchCase] = useState<boolean>(false);
//     const [wholeWords, setWholeWords] = useState<boolean>(false);
//     const [searchResults, setSearchResults] = useState<{ page: number; index: number }[]>([]);
//     const [currentMatch, setCurrentMatch] = useState<number>(0);

//     const viewerRef = useRef<HTMLDivElement>(null);
//     const fullScreenRef = useRef<HTMLDivElement>(null);
//     const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
//     const isScrollingToPage = useRef<boolean>(false);
//     const moreMenuRef = useRef<HTMLDivElement>(null);
//     const searchInputRef = useRef<HTMLInputElement>(null);
//     const pdfDocRef = useRef<any>(null);

//     // Measure container width for fit-to-width
//     useEffect(() => {
//         const updateWidth = () => {
//             if (viewerRef.current) {
//                 setContainerWidth(viewerRef.current.clientWidth - 32);
//             }
//         };
//         updateWidth();
//         const observer = new ResizeObserver(updateWidth);
//         if (viewerRef.current) observer.observe(viewerRef.current);
//         return () => observer.disconnect();
//     }, [isFullScreen]);

//     // Listen for fullscreen changes (e.g. user presses Escape)
//     useEffect(() => {
//         const handleFullScreenChange = () => {
//             if (!document.fullscreenElement) {
//                 setIsFullScreen(false);
//             }
//         };
//         document.addEventListener('fullscreenchange', handleFullScreenChange);
//         return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
//     }, []);

//     // Close more menu on outside click
//     useEffect(() => {
//         const handleClickOutside = (e: MouseEvent) => {
//             if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
//                 setShowMoreMenu(false);
//             }
//         };
//         if (showMoreMenu) {
//             document.addEventListener('mousedown', handleClickOutside);
//         }
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [showMoreMenu]);

//     // IntersectionObserver to track which page is currently visible
//     useEffect(() => {
//         if (numPages === 0 || !viewerRef.current || scrollMode === 'page') return;

//         const observer = new IntersectionObserver(
//             (entries) => {
//                 if (isScrollingToPage.current) return;
//                 let mostVisiblePage = currentPage;
//                 let maxRatio = 0;
//                 entries.forEach((entry) => {
//                     if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
//                         maxRatio = entry.intersectionRatio;
//                         const pageNum = Number(entry.target.getAttribute('data-page-number'));
//                         if (pageNum) mostVisiblePage = pageNum;
//                     }
//                 });
//                 if (mostVisiblePage !== currentPage) {
//                     setCurrentPage(mostVisiblePage);
//                     setPageInputValue(String(mostVisiblePage));
//                     onPageChange?.(mostVisiblePage - 1, numPages);
//                 }
//             },
//             {
//                 root: viewerRef.current,
//                 threshold: [0, 0.25, 0.5, 0.75, 1],
//             }
//         );

//         pageRefs.current.forEach((el) => observer.observe(el));
//         return () => observer.disconnect();
//     }, [numPages, currentPage, onPageChange, scrollMode]);

//     // Scroll to initial page after document loads
//     useEffect(() => {
//         if (numPages > 0 && initialPage > 0) {
//             const targetEl = pageRefs.current.get(initialPage + 1);
//             if (targetEl) {
//                 setTimeout(() => {
//                     targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
//                 }, 100);
//             }
//         }
//     }, [numPages, initialPage]);

//     const onDocumentLoadSuccess = useCallback((pdf: any) => {
//         setNumPages(pdf.numPages);
//         pdfDocRef.current = pdf;
//         onDocumentLoad?.(pdf.numPages);
//     }, [onDocumentLoad]);

//     const scrollToPage = useCallback((page: number) => {
//         const clamped = Math.max(1, Math.min(page, numPages));
//         setCurrentPage(clamped);
//         setPageInputValue(String(clamped));
//         onPageChange?.(clamped - 1, numPages);

//         if (scrollMode !== 'page') {
//             const targetEl = pageRefs.current.get(clamped);
//             if (targetEl) {
//                 isScrollingToPage.current = true;
//                 targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                 setTimeout(() => { isScrollingToPage.current = false; }, 800);
//             }
//         }
//     }, [numPages, onPageChange, scrollMode]);

//     // Search logic
//     const performSearch = useCallback(async () => {
//         if (!searchText.trim() || !pdfDocRef.current) {
//             setSearchResults([]);
//             setCurrentMatch(0);
//             return;
//         }

//         const results: { page: number; index: number }[] = [];
//         const doc = pdfDocRef.current;

//         for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
//             const page = await doc.getPage(pageNum);
//             const textContent = await page.getTextContent();
//             const pageText = textContent.items.map((item: any) => item.str).join('');

//             const query = matchCase ? searchText : searchText.toLowerCase();
//             const text = matchCase ? pageText : pageText.toLowerCase();

//             let startIndex = 0;
//             let matchIndex = 0;
//             while ((startIndex = text.indexOf(query, startIndex)) !== -1) {
//                 if (wholeWords) {
//                     const before = startIndex > 0 ? text[startIndex - 1] : ' ';
//                     const after = startIndex + query.length < text.length ? text[startIndex + query.length] : ' ';
//                     if (/\w/.test(before) || /\w/.test(after)) {
//                         startIndex += 1;
//                         continue;
//                     }
//                 }
//                 results.push({ page: pageNum, index: matchIndex++ });
//                 startIndex += query.length;
//             }
//         }

//         setSearchResults(results);
//         setCurrentMatch(results.length > 0 ? 1 : 0);

//         // Scroll to first match
//         if (results.length > 0) {
//             scrollToPage(results[0].page);
//         }
//     }, [searchText, matchCase, wholeWords, scrollToPage]);

//     const goToNextMatch = useCallback(() => {
//         if (searchResults.length === 0) return;
//         const next = currentMatch >= searchResults.length ? 1 : currentMatch + 1;
//         setCurrentMatch(next);
//         scrollToPage(searchResults[next - 1].page);
//     }, [searchResults, currentMatch, scrollToPage]);

//     const goToPrevMatch = useCallback(() => {
//         if (searchResults.length === 0) return;
//         const prev = currentMatch <= 1 ? searchResults.length : currentMatch - 1;
//         setCurrentMatch(prev);
//         scrollToPage(searchResults[prev - 1].page);
//     }, [searchResults, currentMatch, scrollToPage]);

//     const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter') {
//             if (searchResults.length > 0) {
//                 goToNextMatch();
//             } else {
//                 performSearch();
//             }
//         } else if (e.key === 'Escape') {
//             setShowSearch(false);
//         }
//     }, [searchResults, goToNextMatch, performSearch]);

//     // Re-search when options change
//     useEffect(() => {
//         if (searchText.trim()) performSearch();
//     }, [matchCase, wholeWords]);

//     // Custom text renderer for highlighting
//     const textRenderer = useCallback((textItem: { str: string }) => {
//         if (!searchText.trim()) return textItem.str;
//         const query = matchCase ? searchText : searchText.toLowerCase();
//         const text = matchCase ? textItem.str : textItem.str.toLowerCase();
//         const original = textItem.str;

//         const parts: string[] = [];
//         let lastIndex = 0;

//         let idx = text.indexOf(query, lastIndex);
//         while (idx !== -1) {
//             if (wholeWords) {
//                 const before = idx > 0 ? text[idx - 1] : ' ';
//                 const after = idx + query.length < text.length ? text[idx + query.length] : ' ';
//                 if (/\w/.test(before) || /\w/.test(after)) {
//                     idx = text.indexOf(query, idx + 1);
//                     continue;
//                 }
//             }
//             if (idx > lastIndex) parts.push(original.slice(lastIndex, idx));
//             parts.push(`<mark style="background:#FFEB3B;padding:0;border-radius:2px">${original.slice(idx, idx + query.length)}</mark>`);
//             lastIndex = idx + query.length;
//             idx = text.indexOf(query, lastIndex);
//         }
//         if (lastIndex < original.length) parts.push(original.slice(lastIndex));
//         return parts.join('');
//     }, [searchText, matchCase, wholeWords]);



//     const goToPrevPage = useCallback(() => scrollToPage(currentPage - 1), [currentPage, scrollToPage]);
//     const goToNextPage = useCallback(() => scrollToPage(currentPage + 1), [currentPage, scrollToPage]);
//     const goToFirstPage = useCallback(() => scrollToPage(1), [scrollToPage]);
//     const goToLastPage = useCallback(() => scrollToPage(numPages), [numPages, scrollToPage]);

//     const handlePageInput = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter') {
//             const val = parseInt(pageInputValue, 10);
//             if (!isNaN(val)) scrollToPage(val);
//         }
//     }, [pageInputValue, scrollToPage]);

//     const handlePageInputBlur = useCallback(() => {
//         const val = parseInt(pageInputValue, 10);
//         if (!isNaN(val)) scrollToPage(val);
//         else setPageInputValue(String(currentPage));
//     }, [pageInputValue, scrollToPage, currentPage]);

//     const zoomIn = useCallback(() => {
//         setFitWidth(false);
//         setScale((s) => Math.min(s + ZOOM_STEP, MAX_ZOOM));
//     }, []);

//     const zoomOut = useCallback(() => {
//         setFitWidth(false);
//         setScale((s) => Math.max(s - ZOOM_STEP, MIN_ZOOM));
//     }, []);

//     const fitToWidth = useCallback(() => {
//         setFitWidth(true);
//         setScale(1);
//     }, []);

//     const rotateClockwise = useCallback(() => {
//         setRotation((r) => (r + 90) % 360);
//     }, []);

//     const rotateCounterClockwise = useCallback(() => {
//         setRotation((r) => (r - 90 + 360) % 360);
//     }, []);

//     const toggleFullScreen = useCallback(() => {
//         if (!isFullScreen) {
//             fullScreenRef.current?.requestFullscreen?.();
//             setIsFullScreen(true);
//         } else {
//             document.exitFullscreen?.();
//             setIsFullScreen(false);
//         }
//     }, [isFullScreen]);

//     const effectiveWidth = fitWidth && containerWidth > 0
//         ? (pageLayout === 'dual' || pageLayout === 'dual-cover'
//             ? (containerWidth - 16) / 2
//             : containerWidth)
//         : undefined;
//     const effectiveScale = fitWidth ? undefined : scale;
//     const fileSource = fileUrl || content || '';

//     const zoomPercentage = fitWidth
//         ? (containerWidth > 0 ? '100%' : '—')
//         : `${Math.round(scale * 100)}%`;

//     const setPageRef = useCallback((pageNum: number, el: HTMLDivElement | null) => {
//         if (el) pageRefs.current.set(pageNum, el);
//         else pageRefs.current.delete(pageNum);
//     }, []);

//     // Build pages array based on layout
//     const renderPages = () => {
//         if (scrollMode === 'page') {
//             // Page scrolling: show only current page
//             if (pageLayout === 'dual' || pageLayout === 'dual-cover') {
//                 const startPage = pageLayout === 'dual-cover'
//                     ? (currentPage === 1 ? 1 : currentPage % 2 === 0 ? currentPage : currentPage - 1)
//                     : (currentPage % 2 !== 0 ? currentPage : currentPage - 1);
//                 const pages = [startPage];
//                 if (startPage + 1 <= numPages && !(pageLayout === 'dual-cover' && startPage === 1)) {
//                     pages.push(startPage + 1);
//                 }
//                 return (
//                     <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
//                         {pages.map((p) => (
//                             <div key={`page_${p}`} style={{ position: 'relative' }}>
//                                 <Page pageNumber={p} width={effectiveWidth} scale={effectiveScale} rotate={rotation}
//                                     renderAnnotationLayer={true} renderTextLayer={true} loading={<LoadingIndicator />}
//                                     customTextRenderer={searchText.trim() ? textRenderer : undefined} />
//                                 <Copyright scale={effectiveScale ?? 1} />
//                             </div>
//                         ))}
//                     </div>
//                 );
//             }
//             return (
//                 <div style={{ position: 'relative' }}>
//                     <Page pageNumber={currentPage} width={effectiveWidth} scale={effectiveScale} rotate={rotation}
//                         renderAnnotationLayer={true} renderTextLayer={true} loading={<LoadingIndicator />}
//                         customTextRenderer={searchText.trim() ? textRenderer : undefined} />
//                     <Copyright scale={effectiveScale ?? 1} />
//                 </div>
//             );
//         }

//         // Scrollable modes: render all pages
//         const scrollContainerStyle: React.CSSProperties = {
//             display: 'flex',
//             gap: '12px',
//             ...(scrollMode === 'vertical' ? { flexDirection: 'column', alignItems: 'center' } : {}),
//             ...(scrollMode === 'horizontal' ? { flexDirection: 'row', alignItems: 'flex-start' } : {}),
//             ...(scrollMode === 'wrapped' ? { flexWrap: 'wrap', justifyContent: 'center' } : {}),
//         };

//         if (pageLayout === 'dual' || pageLayout === 'dual-cover') {
//             const rows: number[][] = [];
//             let i = pageLayout === 'dual-cover' ? 0 : -1;
//             const allPages = Array.from({ length: numPages }, (_, idx) => idx + 1);

//             if (pageLayout === 'dual-cover') {
//                 rows.push([1]); // cover page alone
//                 i = 1;
//             }
//             while (i < allPages.length) {
//                 if (pageLayout !== 'dual-cover' && i === -1) { i = 0; continue; }
//                 const row = [allPages[i]];
//                 if (i + 1 < allPages.length) row.push(allPages[i + 1]);
//                 rows.push(row);
//                 i += 2;
//             }

//             return (
//                 <div style={scrollContainerStyle}>
//                     {rows.map((row, rowIdx) => (
//                         <div key={`row_${rowIdx}`} style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
//                             {row.map((p) => (
//                                 <div key={`page_${p}`} ref={(el) => setPageRef(p, el)} data-page-number={p}
//                                     style={{ position: 'relative' }}>
//                                     <Page pageNumber={p} width={effectiveWidth} scale={effectiveScale} rotate={rotation}
//                                         renderAnnotationLayer={true} renderTextLayer={true} loading={<LoadingIndicator />}
//                                         customTextRenderer={searchText.trim() ? textRenderer : undefined} />
//                                     <Copyright scale={effectiveScale ?? 1} />
//                                 </div>
//                             ))}
//                         </div>
//                     ))}
//                 </div>
//             );
//         }

//         return (
//             <div style={scrollContainerStyle}>
//                 {Array.from({ length: numPages }, (_, index) => (
//                     <div
//                         key={`page_${index + 1}`}
//                         ref={(el) => setPageRef(index + 1, el)}
//                         data-page-number={index + 1}
//                         style={{ position: 'relative' }}
//                     >
//                         <Page
//                             pageNumber={index + 1}
//                             width={effectiveWidth}
//                             scale={effectiveScale}
//                             rotate={rotation}
//                             loading={<LoadingIndicator />}
//                             renderAnnotationLayer={true}
//                             renderTextLayer={true}
//                             customTextRenderer={searchText.trim() ? textRenderer : undefined}
//                         />
//                         <Copyright scale={effectiveScale ?? 1} />
//                     </div>
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div
//             ref={fullScreenRef}
//             className="rpv-core__viewer rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-[#323232]"
//             style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 height: '100%',
//                 minHeight: '500px',
//             }}
//         >
//             {/* Search Popover */}
//             {showSearch && (
//                 <div
//                     className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 shadow-sm"
//                     style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         padding: '10px 16px',
//                         gap: '8px',
//                         flexShrink: 0,
//                     }}
//                 >
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                         <div style={{ flex: 1, position: 'relative' }}>
//                             <input
//                                 ref={searchInputRef}
//                                 type="text"
//                                 value={searchText}
//                                 onChange={(e) => setSearchText(e.target.value)}
//                                 onKeyDown={handleSearchKeyDown}
//                                 placeholder="Enter to search"
//                                 className="w-full text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 pr-14 outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
//                                 autoFocus
//                             />
//                             <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500 select-none">
//                                 {searchResults.length > 0 ? `${currentMatch}/${searchResults.length}` : '0/0'}
//                             </span>
//                         </div>
//                         <ToolbarButton onClick={goToPrevMatch} disabled={searchResults.length === 0} title="Previous match">
//                             <ChevronUpIcon />
//                         </ToolbarButton>
//                         <ToolbarButton onClick={goToNextMatch} disabled={searchResults.length === 0} title="Next match">
//                             <ChevronDownIcon />
//                         </ToolbarButton>
//                         <ToolbarButton onClick={performSearch} title="Search">
//                             <SearchIcon />
//                         </ToolbarButton>
//                     </div>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                         <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
//                             <input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)}
//                                 className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
//                             Match case
//                         </label>
//                         <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
//                             <input type="checkbox" checked={wholeWords} onChange={(e) => setWholeWords(e.target.checked)}
//                                 className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
//                             Whole words
//                         </label>
//                         <div style={{ flex: 1 }} />
//                         <button
//                             onClick={() => { setShowSearch(false); setSearchText(''); setSearchResults([]); setCurrentMatch(0); }}
//                             className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Toolbar */}
//             <div
//                 className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 shadow-sm"
//                 style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     padding: '6px 12px',
//                     gap: '4px',
//                     flexShrink: 0,
//                     flexWrap: 'wrap',
//                 }}
//             >
//                 {/* Search Toggle */}
//                 <ToolbarButton onClick={() => { setShowSearch(!showSearch); if (!showSearch) setTimeout(() => searchInputRef.current?.focus(), 100); }} title="Search">
//                     <SearchIcon />
//                 </ToolbarButton>

//                 <Divider />
//                 {/* Page Navigation */}
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                     <ToolbarButton onClick={goToPrevPage} disabled={currentPage <= 1} title="Previous page">
//                         <ChevronUpIcon />
//                     </ToolbarButton>
//                     <ToolbarButton onClick={goToNextPage} disabled={currentPage >= numPages} title="Next page">
//                         <ChevronDownIcon />
//                     </ToolbarButton>
//                     <input
//                         type="text"
//                         value={pageInputValue}
//                         onChange={(e) => setPageInputValue(e.target.value)}
//                         onKeyDown={handlePageInput}
//                         onBlur={handlePageInputBlur}
//                         className="text-center text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded"
//                         style={{ width: '48px', padding: '2px 4px' }}
//                     />
//                     <span className="text-sm text-gray-500 dark:text-gray-400 select-none">
//                         / {numPages || '—'}
//                     </span>
//                 </div>

//                 <Divider />

//                 {/* Zoom Controls */}
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                     <ToolbarButton onClick={zoomOut} title="Zoom out">
//                         <MinusIcon />
//                     </ToolbarButton>
//                     <span
//                         className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer"
//                         style={{ minWidth: '44px', textAlign: 'center' }}
//                         onClick={fitToWidth}
//                         title="Click to fit to width"
//                     >
//                         {zoomPercentage}
//                     </span>
//                     <ToolbarButton onClick={zoomIn} title="Zoom in">
//                         <PlusIcon />
//                     </ToolbarButton>
//                 </div>

//                 <Divider />

//                 {/* Fullscreen */}
//                 <ToolbarButton onClick={toggleFullScreen} title={isFullScreen ? 'Exit full screen' : 'Full screen'}>
//                     {isFullScreen ? <ExitFullScreenIcon /> : <FullScreenIcon />}
//                 </ToolbarButton>

//                 <Divider />

//                 {/* More Menu */}
//                 <div ref={moreMenuRef} style={{ position: 'relative' }}>
//                     <ToolbarButton onClick={() => setShowMoreMenu(!showMoreMenu)} title="More options">
//                         <MoreIcon />
//                     </ToolbarButton>

//                     {showMoreMenu && (
//                         <div
//                             className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl"
//                             style={{
//                                 position: 'absolute',
//                                 right: 0,
//                                 top: '100%',
//                                 marginTop: '4px',
//                                 zIndex: 50,
//                                 minWidth: '220px',
//                                 padding: '4px 0',
//                                 maxHeight: '400px',
//                                 overflowY: 'auto',
//                             }}
//                         >
//                             {/* First / Last Page */}
//                             <MenuItem onClick={() => { goToFirstPage(); setShowMoreMenu(false); }} icon={<FirstPageIcon />} label="First page" disabled={currentPage <= 1} />
//                             <MenuItem onClick={() => { goToLastPage(); setShowMoreMenu(false); }} icon={<LastPageIcon />} label="Last page" disabled={currentPage >= numPages} />

//                             <MenuDivider />

//                             {/* Rotate */}
//                             <MenuItem onClick={() => { rotateClockwise(); setShowMoreMenu(false); }} icon={<RotateCWIcon />} label="Rotate clockwise" />
//                             <MenuItem onClick={() => { rotateCounterClockwise(); setShowMoreMenu(false); }} icon={<RotateCCWIcon />} label="Rotate counterclockwise" />

//                             <MenuDivider />

//                             {/* Scroll Mode */}
//                             <MenuItem onClick={() => { setScrollMode('page'); setShowMoreMenu(false); }} icon={<PageScrollIcon />} label="Page scrolling" checked={scrollMode === 'page'} />
//                             <MenuItem onClick={() => { setScrollMode('vertical'); setShowMoreMenu(false); }} icon={<VerticalScrollIcon />} label="Vertical scrolling" checked={scrollMode === 'vertical'} />
//                             <MenuItem onClick={() => { setScrollMode('horizontal'); setShowMoreMenu(false); }} icon={<HorizontalScrollIcon />} label="Horizontal scrolling" checked={scrollMode === 'horizontal'} />
//                             <MenuItem onClick={() => { setScrollMode('wrapped'); setShowMoreMenu(false); }} icon={<WrappedScrollIcon />} label="Wrapped scrolling" checked={scrollMode === 'wrapped'} />

//                             <MenuDivider />

//                             {/* Page Layout */}
//                             <MenuItem onClick={() => { setPageLayout('single'); setShowMoreMenu(false); }} icon={<SinglePageIcon />} label="Single page" checked={pageLayout === 'single'} />
//                             <MenuItem onClick={() => { setPageLayout('dual'); setShowMoreMenu(false); }} icon={<DualPageIcon />} label="Dual page" checked={pageLayout === 'dual'} />
//                             <MenuItem onClick={() => { setPageLayout('dual-cover'); setShowMoreMenu(false); }} icon={<DualCoverIcon />} label="Dual page with cover" checked={pageLayout === 'dual-cover'} />
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* PDF Viewer */}
//             <div
//                 ref={viewerRef}
//                 className="bg-gray-200 dark:bg-gray-900"
//                 style={{
//                     flex: 1,
//                     overflow: 'auto',
//                     position: 'relative',
//                     padding: '16px',
//                     ...(scrollMode === 'horizontal' ? { overflowX: 'auto', overflowY: 'hidden' } : {}),
//                 }}
//             >
//                 {fileSource ? (
//                     <Document
//                         file={fileSource}
//                         onLoadSuccess={onDocumentLoadSuccess}
//                         loading={<LoadingIndicator />}
//                         error={<ErrorIndicator />}
//                         rotate={rotation}
//                     >
//                         {renderPages()}
//                     </Document>
//                 ) : (
//                     <div className="h-full w-full flex items-center justify-center p-6">
//                         <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
//                             No PDF file to display.
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// /* ── Toolbar Sub-components ──────────────────────────────────────────── */

// const ToolbarButton: React.FC<{
//     onClick: () => void;
//     disabled?: boolean;
//     title?: string;
//     children: React.ReactNode;
// }> = ({ onClick, disabled, title, children }) => (
//     <button
//         onClick={onClick}
//         disabled={disabled}
//         title={title}
//         className="inline-flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
//         style={{ width: '32px', height: '32px', flexShrink: 0 }}
//     >
//         {children}
//     </button>
// );

// const MenuItem: React.FC<{
//     onClick: () => void;
//     icon: React.ReactNode;
//     label: string;
//     checked?: boolean;
//     disabled?: boolean;
// }> = ({ onClick, icon, label, checked, disabled }) => (
//     <button
//         onClick={onClick}
//         disabled={disabled}
//         className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//         style={{ textAlign: 'left' }}
//     >
//         <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">{icon}</span>
//         <span className="flex-1">{label}</span>
//         {checked !== undefined && (
//             <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-gray-600 dark:text-gray-400">
//                 {checked && <CheckIcon />}
//             </span>
//         )}
//     </button>
// );

// const Divider: React.FC = () => (
//     <div
//         className="bg-gray-300 dark:bg-gray-600"
//         style={{ width: '1px', height: '20px', margin: '0 6px', flexShrink: 0 }}
//     />
// );

// const MenuDivider: React.FC = () => (
//     <div className="bg-gray-200 dark:bg-gray-700" style={{ height: '1px', margin: '4px 0' }} />
// );

// const LoadingIndicator: React.FC = () => (
//     <div className="flex flex-col items-center justify-center gap-3 p-8">
//         <div
//             className="border-4 border-gray-300 dark:border-gray-600 rounded-full animate-spin"
//             style={{ width: '32px', height: '32px', borderTopColor: '#6366f1' }}
//         />
//         <p className="text-gray-600 dark:text-gray-400 text-sm">Loading PDF…</p>
//     </div>
// );

// const ErrorIndicator: React.FC = () => (
//     <div className="flex items-center justify-center p-8">
//         <p className="text-red-500 text-sm">Failed to load PDF. Please try again.</p>
//     </div>
// );

// /* ── Icons ──────────────────────────────────────────────────────────── */

// const ChevronUpIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <polyline points="18 15 12 9 6 15" />
//     </svg>
// );

// const ChevronDownIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <polyline points="6 9 12 15 18 9" />
//     </svg>
// );

// const MinusIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <line x1="5" y1="12" x2="19" y2="12" />
//     </svg>
// );

// const PlusIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <line x1="12" y1="5" x2="12" y2="19" />
//         <line x1="5" y1="12" x2="19" y2="12" />
//     </svg>
// );

// const FullScreenIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M8 3H5a2 2 0 0 0-2 2v3" />
//         <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
//         <path d="M3 16v3a2 2 0 0 0 2 2h3" />
//         <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
//     </svg>
// );

// const ExitFullScreenIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M4 14h6v6" />
//         <path d="M20 10h-6V4" />
//         <path d="M14 10l7-7" />
//         <path d="M3 21l7-7" />
//     </svg>
// );

// const SearchIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <circle cx="11" cy="11" r="8" />
//         <line x1="21" y1="21" x2="16.65" y2="16.65" />
//     </svg>
// );

// const MoreIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <circle cx="12" cy="12" r="1" />
//         <circle cx="12" cy="5" r="1" />
//         <circle cx="12" cy="19" r="1" />
//     </svg>
// );

// const CheckIcon = () => (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//         <polyline points="20 6 9 17 4 12" />
//     </svg>
// );

// const FirstPageIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <polyline points="17 18 11 12 17 6" />
//         <line x1="7" y1="6" x2="7" y2="18" />
//     </svg>
// );

// const LastPageIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <polyline points="7 6 13 12 7 18" />
//         <line x1="17" y1="6" x2="17" y2="18" />
//     </svg>
// );

// const RotateCWIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <polyline points="23 4 23 10 17 10" />
//         <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
//     </svg>
// );

// const RotateCCWIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <polyline points="1 4 1 10 7 10" />
//         <path d="M3.51 15a9 9 0 1 0 2.12-9.36L1 10" />
//     </svg>
// );

// const PageScrollIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="5" y="3" width="14" height="18" rx="2" />
//     </svg>
// );

// const VerticalScrollIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="5" y="2" width="14" height="8" rx="1" />
//         <rect x="5" y="14" width="14" height="8" rx="1" />
//     </svg>
// );

// const HorizontalScrollIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="2" y="5" width="8" height="14" rx="1" />
//         <rect x="14" y="5" width="8" height="14" rx="1" />
//     </svg>
// );

// const WrappedScrollIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="2" y="2" width="8" height="8" rx="1" />
//         <rect x="14" y="2" width="8" height="8" rx="1" />
//         <rect x="2" y="14" width="8" height="8" rx="1" />
//         <rect x="14" y="14" width="8" height="8" rx="1" />
//     </svg>
// );

// const SinglePageIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="6" y="3" width="12" height="18" rx="2" />
//     </svg>
// );

// const DualPageIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="2" y="4" width="8" height="16" rx="1" />
//         <rect x="14" y="4" width="8" height="16" rx="1" />
//     </svg>
// );

// const DualCoverIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="2" y="4" width="8" height="16" rx="1" />
//         <rect x="14" y="4" width="8" height="16" rx="1" />
//         <line x1="6" y1="4" x2="6" y2="20" strokeDasharray="2 2" />
//     </svg>
// );

// export default PdfRender;

/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 21 March 2025
@author:: Edulyst Ventures  
@purpose : This Component is used to render the PDF file in the viewer
@dependency : This component is dependent on the @react-pdf-viewer/core and @react-pdf-viewer/toolbar packages and fileUrl, onPageChange, onDocumentLoad, initialPage props

@@ Use case (if any use case) and solutions 

**/

import * as React from 'react';
import { ProgressBar, RenderPage, RenderPageProps, SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import type { ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import { Maximize, Minimize } from 'lucide-react';
import Copyright from './copyright';


interface PdfRenderProps {
    fileUrl: string;
    onPageChange?: (page: number, numPages: number) => void;
    onDocumentLoad?: (numPages: number) => void;
    initialPage?: number;
    content?: string;
}

const PdfRender: React.FC<PdfRenderProps> = ({ fileUrl, content, onPageChange, onDocumentLoad, initialPage = 0 }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = React.useState(false);

    React.useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, []);

    const toggleFullScreen = React.useCallback(() => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }, []);

    const toolbarPluginInstance = toolbarPlugin();
    const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

    const transformToolbar: TransformToolbarSlot = (slot: ToolbarSlot) => ({
        ...slot,
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        SwitchTheme: () => <></>,
        SwitchThemeMenuItem: () => <></>,
        Open: () => <></>,
        OpenMenuItem: () => <></>,
        Print: () => <></>,
        PrintMenuItem: () => <></>,
        EnterFullScreen: () => (
            <button
                onClick={toggleFullScreen}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors text-gray-700 dark:text-gray-300"
                title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
                {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
        ),
        EnterFullScreenMenuItem: () => (
            <div onClick={toggleFullScreen} className="rpv-core__menu-item" style={{ cursor: 'pointer' }}>
                <div className="rpv-core__menu-item-icon">
                    {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </div>
                <div className="rpv-core__menu-item-label">
                    {isFullScreen ? "Exit Full Screen" : "Full Screen"}
                </div>
            </div>
        )
    });

    const renderPageWithCopyright: RenderPage = (props: RenderPageProps) => (
        <>
            {props.canvasLayer.children}
            {props.textLayer.children}
            <Copyright scale={props.scale} />
            {props.annotationLayer.children}
        </>
    );

    const handleDocumentLoad = (e: { doc: { numPages: number } }) => {
        onDocumentLoad && onDocumentLoad(e.doc.numPages);
    };


    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
            <div
                ref={containerRef}
                className="rpv-core__viewer rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-[#323232]"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minHeight: '500px',
                }}
            >
                {/* Toolbar */}
                <div
                    className='bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 shadow-sm'
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        padding: '0.5rem',
                        flexShrink: 0,
                    }}
                >
                    <Toolbar>{renderDefaultToolbar(transformToolbar)}</Toolbar>
                </div>

                {/* PDF Viewer */}
                <div
                    className="bg-gray-200 dark:bg-gray-900"
                    style={{
                        flex: 1,
                        overflow: 'auto',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }}
                >
                    {fileUrl && <Viewer
                        fileUrl={fileUrl ?? content ?? ''}
                        plugins={[toolbarPluginInstance]}
                        renderPage={renderPageWithCopyright}
                        initialPage={initialPage}
                        defaultScale={SpecialZoomLevel.PageWidth}
                        renderLoader={(percentages: number) => (
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    padding: '2rem',
                                }}
                            >
                                <div style={{ width: '240px' }}>
                                    <ProgressBar progress={Math.round(percentages)} />
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Loading PDF... {Math.round(percentages)}%
                                </p>
                            </div>
                        )}
                        onDocumentLoad={handleDocumentLoad}
                        onPageChange={(e) => onPageChange && onPageChange(e?.currentPage, e?.doc?.numPages)}
                    />}
                    {
                        !fileUrl && (
                            <div className="h-full w-full flex items-center justify-center p-6">
                                <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                                    No PDF file to display.
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        </Worker>
    );
};

export default PdfRender;

