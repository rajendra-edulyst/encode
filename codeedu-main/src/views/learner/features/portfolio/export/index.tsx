/* eslint-disable import/no-unresolved */
import React, { useRef, useState } from 'react'
import { UserPortfolio } from '@/@types/learner/portfolio';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import Template1 from '../template/Template1';
import Template2 from '../template/Template2';
import Template3 from '../template/Templete3';
import Template4 from '../template/Template4';
// import Template5 from '../template/Template5';
import Template6 from '../template/Template6';
import { Card, CardContent } from '@/components/ui/card';
import temp1 from '@/assets/icons/temp_1.png';
import temp2 from '@/assets/icons/temp_2.jpeg';
import temp3 from '@/assets/icons/temp3.png';
import temp4 from '@/assets/icons/temp4.png';
import temp5 from '@/assets/icons/temp5.png';
import defaultImmg from '@/assets/icons/default.png';

interface ExportProps {
    show: boolean;
    setShow: (show: boolean) => void;
    portfolio: UserPortfolio;
}

const Export: React.FC<ExportProps> = ({ show, setShow, portfolio }) => {
    const portfolioRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('none');
    const [showPreview, setShowPreview] = useState(false);


    const exportToPDF = async () => {
        setLoading(true);
        if (!portfolioRef.current) return;

        try {
            // Ensure all content is visible and rendered
            portfolioRef.current.style.overflow = 'visible';
            portfolioRef.current.style.height = 'auto';

            // Wait for any dynamic content to load
            // await new Promise(resolve => setTimeout(resolve, 500));
            const images = portfolioRef.current.querySelectorAll("img");

            images.forEach((img) => {
                img.crossOrigin = "anonymous"; // Ensure CORS for external images
            });
        
            await Promise.all(
                Array.from(images).map( 
                    img =>
                        new Promise(resolve => {
                            if (img.complete) {
                                console.log('Image already loaded:', img.src);
                                resolve(null);
                            }
                            else {
                                console.log('Image loading:', img.src);
                                img.onload = resolve;
                                img.onerror = resolve;
                                img.crossOrigin = "anonymous"; // Ensure CORS for external images
                            }
                        })
                )
            );
            // Calculate dimensions
            const contentWidth = portfolioRef.current.scrollWidth;
            const contentHeight = portfolioRef.current.scrollHeight;

            // Calculate optimal scale (higher for better quality)
            const optimalScale = 3; // Fixed high scale for quality

            const canvas = await html2canvas(portfolioRef.current, {
                scale: optimalScale,
                useCORS: true,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
                windowWidth: contentWidth,
                windowHeight: contentHeight,
                backgroundColor: '#ffffff' // Ensure white background
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

            // Add additional pages if content is taller than one page
            let heightLeft = imgHeight;
            let position = 0;
            const pageHeight = 297; // A4 height in mm

            while (heightLeft >= pageHeight) {
                position = heightLeft - pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pageHeight;
            }


            const fileName = `${portfolio?.portfolio_profile[0]?.name}_resume.pdf`;
            pdf.save(fileName);


            toast.success('Portfolio exported successfully');
            setShow(false);
            setShowPreview(false);
        } catch (error) {
            toast.error('Failed to export portfolio');
            console.error('Export error:', error);
        } finally {
            setLoading(false);
        }
    };

    const templates = [
        {
            id: 'template1',
            name: 'Template 1',
            component: <Template1 portfolio={portfolio} />,
            imageUrl: temp1
        },
        {
            id: 'template2',
            name: 'Template 2',
            component: <Template2 portfolio={portfolio} />,
            imageUrl: temp2
        },
        {
            id: 'template3',
            name: 'Template 3',
            component: <Template3 portfolio={portfolio} />,
            imageUrl: temp3
        },
        {
            id: 'template4',
            name: 'Template 4',
            component: <Template4 portfolio={portfolio} />,
            imageUrl: temp4
        },
        {
            id: 'template6',
            name: 'Template 5',
            component: <Template6 portfolio={portfolio} />,
            imageUrl: temp5
        },
        {
            id: 'none',
            name: 'Default View',
            component: null,
            imageUrl: defaultImmg
        },
    ];

    const getSelectedTemplateComponent = () => {
        if (selectedTemplate === 'none') {
            return (
                <div className="bg-white p-8 border border-gray-300 text-gray-900">
                    {/* Name and Contact */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">{portfolio?.portfolio_profile[0]?.name} {portfolio?.portfolio_profile[0]?.lastName}</h1>
                        <p className="text-gray-600">{portfolio?.portfolio_profile[0]?.state}, {portfolio?.portfolio_profile[0]?.country}</p>
                        <p className="text-gray-600">{portfolio?.portfolio_social[0]?.email} | {portfolio?.portfolio_social[0]?.linkedin}</p>
                    </div>
                    <hr className="my-4 border-gray-400" />
                    {/* About Me */}
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">About Me</h2>
                        <p className="text-gray-700 text-sm">{portfolio?.portfolio_profile[0]?.about_me}</p>
                    </div>
                    {/* Skills */}
                    {portfolio?.skill?.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">Skills</h2>
                            <ul className="text-gray-700 text-sm grid grid-cols-2 gap-2">
                                {portfolio?.skill.map((skill, index) => (
                                    <li key={index}>• {skill.name} ({skill.self_proficiency}%)</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Experience */}
                    {portfolio?.Experience?.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Experience</h2>
                            {portfolio?.Experience.map((exp, index) => (
                                <div key={index} className="mb-2">
                                    <h3 className="text-sm font-semibold">{exp.title}</h3>
                                    <p className="text-gray-700 text-sm">{exp.institute} | {exp.location}</p>
                                    <p className="text-gray-500 text-xs">{exp.start_date} - {exp.end_date || "Present"}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Education */}
                    {portfolio?.Education?.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Education</h2>
                            {portfolio?.Education.map((edu, index) => (
                                <div key={index} className="mb-2">
                                    <h3 className="text-sm font-semibold">{edu.title}</h3>
                                    <p className="text-gray-700 text-sm">{edu.institute} | {edu.location}</p>
                                    <p className="text-gray-500 text-xs">{edu.start_date} - {edu.end_date || "Present"}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Projects */}
                    {portfolio?.Project?.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Projects</h2>
                            {portfolio?.Project.map((project, index) => (
                                <div key={index} className="mb-2">
                                    <h3 className="text-sm font-semibold">{project.title}</h3>
                                    <p className="text-gray-700 text-sm">{project.description}</p>
                                    {project.action && <p className="text-indigo-600 text-xs">{project.action}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        return templates.find((t) => t.id === selectedTemplate)?.component;
    };

    const handleApplyTemplate = () => {
        setShowPreview(true);
    };

    const handleBackToSelection = () => {
        setShowPreview(false);
    };

    return (
        <Dialog open={show} onOpenChange={() => {
            setShow(false);
            setShowPreview(false);
            setSelectedTemplate('none');
        }}>
            <DialogContent className='max-w-6xl'>
                <DialogHeader>
                    <DialogTitle>Export Portfolio</DialogTitle>
                    <DialogDescription>
                        {showPreview ? 'Preview your portfolio before exporting' : 'Choose a template for your portfolio'}
                    </DialogDescription>
                </DialogHeader>

                {!showPreview ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4 m-60">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedTemplate === template.id
                                        ? "ring-2 ring-blue-500 shadow-md"
                                        : "border border-gray-200"
                                        } rounded-lg overflow-hidden bg-white`}
                                >
                                    <Card className="border-0 shadow-none h-full">
                                        <div className="aspect-[3/2] w-full overflow-hidden">
                                            <img
                                                src={template.imageUrl}
                                                alt={template.name}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </div>
                                        <CardContent className="p-4 text-center">
                                            <h3 className="font-medium text-sm text-gray-900 whitespace-nowrap">
                                                {template.name}
                                            </h3>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>

                        <DialogFooter>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
                                onClick={handleApplyTemplate}
                                disabled={!selectedTemplate}
                            >
                                Apply Selected Template
                            </button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <div className="h-[500px] overflow-auto border rounded-lg p-4" ref={portfolioRef}>
                            {getSelectedTemplateComponent()}
                        </div>

                        <DialogFooter className="gap-2">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                                onClick={handleBackToSelection}
                            >
                                Back to Templates
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
                                onClick={exportToPDF}
                                disabled={loading}
                            >
                                {loading ? 'Exporting...' : 'Export to PDF'}
                            </button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Export;