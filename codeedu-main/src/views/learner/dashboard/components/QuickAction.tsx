/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 20 March 2025
@author:: Edulyst Ventures  
@purpose : This page use to shoow Quick action for the learner dashboard

@@ Use case (if any use case) and solutions 

**/


import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpenText, Notebook, ScrollText, TvMinimalPlay } from "lucide-react";
import { Link } from "react-router-dom";

const QuickAction: React.FC = () => {

    return (
        <Card className="gap-0">
            <CardHeader>
                <h1 className='font-semibold capitalize text-lg mb-1 text-primary'>Quick Access</h1>
            </CardHeader>
            <CardContent>
                <Link to="/course/library?type=assessment" className='text-lg flex items-center justify-start gap-2 py-1 dark:text-white hover:dark:text-primary hover:text-primary cursor-pointer transform transition-transform hover:scale-[0.98]'>
                    <ScrollText className="dark:text-white" size={20} />
                    <p>Assessments</p>
                </Link>
                {/* assignment */}
                <Link to="/course/library?type=assignment" className='text-lg flex items-center justify-start gap-2 py-1 dark:text-white hover:dark:text-primary hover:text-primary cursor-pointer transform transition-transform hover:scale-[0.98]'>
                    <BookOpenText className="dark:text-white" size={20} />
                    <p>Assignments</p>
                </Link>
                {/* notes */}
                <Link to="/course/library?type=notes" className='text-lg flex items-center justify-start gap-2 py-1 dark:text-white hover:dark:text-primary hover:text-primary cursor-pointer transform transition-transform hover:scale-[0.98]'>
                    <Notebook className="dark:text-white" size={20} />
                    <p>Notes</p>
                </Link>
                {/* videos */}
                <Link to="/course/library?type=video" className='text-lg flex items-center justify-start gap-2 py-1 dark:text-white hover:dark:text-primary hover:text-primary cursor-pointer transform transition-transform hover:scale-[0.98]'>
                    <TvMinimalPlay className="dark:text-white" size={20} />
                    <p>Videos</p>
                </Link>
            </CardContent>
        </Card>
    )
}

export default QuickAction;