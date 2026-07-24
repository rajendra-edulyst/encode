const fs = require('fs');

const logContent = fs.readFileSync('june_2026_dev_log.md', 'utf-8');
const lines = logContent.split('\n');

const dateTasks = {};

lines.forEach(line => {
    const match = line.match(/- \*\*(\d{4}-\d{2}-\d{2})\*\* \(([^)]+)\): (.+)/);
    if (match) {
        const date = match[1];
        const author = match[2];
        const task = match[3];

        if (!dateTasks[date]) {
            dateTasks[date] = [];
        }
        dateTasks[date].push(task);
    }
});

let csvContent = 'S.no,Date,Task,Time Spent in Hrs,Remark || Comments\n';
let sno = 1;

// Sort dates ascending
const sortedDates = Object.keys(dateTasks).sort();

sortedDates.forEach(date => {
    // Format date as DD June YYYY
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;
    
    // Join tasks with a newline character for CSV
    // To have multiple lines in a single CSV cell, it must be wrapped in quotes
    const tasks = dateTasks[date].map(t => t.replace(/"/g, '""')).join('\n');
    
    csvContent += `${sno},"${formattedDate}","${tasks}","",\n`;
    sno++;
});

fs.writeFileSync('june_2026_timesheet.csv', csvContent);
console.log('CSV generated at june_2026_timesheet.csv');
