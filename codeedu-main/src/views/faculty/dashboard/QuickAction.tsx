/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 20 March 2025
@author:: Edulyst Ventures  
@purpose : This page use to shoow Quick action for the learner dashboard

@@ Use case (if any use case) and solutions 

**/


import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

const QuickAction: React.FC = () => {

    return (
        <Card className="p-0 mt-4">
            <CardHeader className="p-2 px-3">
                <h1 className='font-semibold capitalize text-lg mb-1'>Quick Access</h1>
            </CardHeader>
            <CardContent className="px-4">
                <Link to="/sessions" className='flex items-center justify-start gap-2 py-1 dark:text-gray-300 hover:dark:text-primary hover:text-primary cursor-pointer transform transition-transform hover:scale-[0.98]'>
                    <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/video-icon.svg" className="w-5" />
                    <p>Sessions/Classes</p>
                </Link>
                <Link to="/assessments" className='flex items-center justify-start gap-2 py-1 dark:text-gray-300 hover:dark:text-primary hover:text-primary cursor-pointer transform transition-transform hover:scale-[0.98]'>
                    <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/assessment-icon.svg" className="w-5" />
                    <p>Assessments</p>
                </Link>
                {/* assignment */}
                <Link to="/assignments" className='flex items-center justify-start gap-2 py-1 dark:text-gray-300 hover:dark:text-primary hover:text-primary cursor-pointer transform transition-transform hover:scale-[0.98]'>
                    <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/assignment-icon.svg" className="w-5" />
                    <p>Assignments</p>
                </Link>
                <Link to="/course/library" className='flex items-center justify-start gap-2 py-1 dark:text-gray-300 hover:dark:text-primary hover:text-primary cursor-pointer transform transition-transform hover:scale-[0.98]'>
                    <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/notes-icon.svg" className="w-5" />
                    <p>Notes & Videos</p>
                </Link>
            </CardContent>
        </Card>
    )
}

export default QuickAction;