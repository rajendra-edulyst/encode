/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 04 April 2025
@author:: Edulyst Ventures  
@purpose : This utils function is used to show the time ago in words
@dependency : This function is dependent on the date-fns library to show the time ago in words

@@ Use case (if any use case) and solutions 

**/


import { formatDistanceToNow } from "date-fns";

export function timeAgo(date: string | Date): string {
    try {
        const parsedDate = typeof date === "string" ? new Date(date) : date;
        if (isNaN(parsedDate.getTime())) {
            throw new Error("Invalid date format");
        }
        return formatDistanceToNow(parsedDate, { addSuffix: true });
    }
    catch (error) {
        console.error("Error in timeAgo function:", error);
        return "Invalid date";
    }
}
