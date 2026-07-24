import { Button } from "@/components/ui";
import React from "react";

interface CustomToolbarProps {
    label: string;
    onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
    onView: (view: "month" | "week" | "day") => void;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ label, onNavigate, onView }) => {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0" }}>
            <div className="flex">
                <Button variant="solid" className="text-white rounded-none rounded-l-md" onClick={() => onNavigate("TODAY")}>Today</Button>
                <Button variant="solid" className="text-white rounded-none border-x border-ac-dark" onClick={() => onNavigate("PREV")}>Prev</Button>
                <Button variant="solid" className="text-white rounded-none rounded-r-md" onClick={() => onNavigate("NEXT")}>Next</Button>
            </div>
            <div>
                <h3 className="text-primary">{label}</h3>
            </div>
            <div>
                <Button variant="solid" className="text-white rounded-none rounded-l-md" onClick={() => onView("month")}>Month</Button>
                <Button variant="solid" className="text-white rounded-none border-x border-ac-dark" onClick={() => onView("week")}>Week</Button>
                <Button variant="solid" className="text-white rounded-none rounded-r-md" onClick={() => onView("day")}>Day</Button>
            </div>
        </div>
    );
};

export default CustomToolbar;