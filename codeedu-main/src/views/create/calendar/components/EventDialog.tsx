import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/ShadcnInput";
import { Label } from "@/components/ui/label";
import { CalendarEvent } from "../types/calendar";
import { format } from "date-fns";
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

interface EventDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (event: Partial<CalendarEvent>) => void;
    onDelete?: () => void;
    event?: CalendarEvent | null;
    defaultDate?: Date;
    defaultHour?: number;
}

export const EventDialog = ({ open, onClose, onSave, onDelete, event, defaultDate, defaultHour }: EventDialogProps) => {
    const [title, setTitle] = useState(event?.title || "");
    const [color, setColor] = useState<"blue" | "orange" | "purple" | "primary" | "gray">(event?.color || "blue");
    const [startTime, setStartTime] = useState(
        event?.startTime || (defaultDate && defaultHour !== undefined
            ? new Date(defaultDate.setHours(defaultHour, 0, 0, 0)).toISOString()
            : new Date().toISOString())
    );
    const [endTime, setEndTime] = useState(
        event?.endTime || (defaultDate && defaultHour !== undefined
            ? new Date(defaultDate.setHours(defaultHour + 1, 0, 0, 0)).toISOString()
            : new Date().toISOString())
    );

    const handleSave = () => {
        mixpanelService.track(event ? "Calendar Event Edited" : "Calendar Event Created", {
            event_title: title,
        });
        onSave({
            id: event?.id || Date.now().toString(),
            title,
            startTime,
            endTime,
            color,
        });
        onClose();
    };

    const handleDelete = () => {
        if (onDelete) {
            mixpanelService.track("Calendar Event Deleted", {
                event_title: title,
            });
            onDelete();
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            placeholder="Event title"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="start">Start Time</Label>
                        <Input
                            id="start"
                            type="datetime-local"
                            value={format(new Date(startTime), "yyyy-MM-dd'T'HH:mm")}
                            onChange={(e) => setStartTime(new Date(e.target.value).toISOString())}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="end">End Time</Label>
                        <Input
                            id="end"
                            type="datetime-local"
                            value={format(new Date(endTime), "yyyy-MM-dd'T'HH:mm")}
                            onChange={(e) => setEndTime(new Date(e.target.value).toISOString())}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Color</Label>
                        <div className="flex gap-2">
                            {(["blue", "orange", "purple", "primary", "gray"] as const).map((c) => (
                                <button
                                    key={c}
                                    className={`w-10 h-10 rounded-lg transition-all ${c === "blue"
                                                ? "bg-[hsl(var(--event-blue))]"
                                                : c === "orange"
                                                    ? "bg-[hsl(var(--event-orange))]"
                                                    : c === "primary"
                                                        ? "bg-primary"
                                                        : c === "gray"
                                                            ? "bg-gray-300"
                                                            : "bg-[hsl(var(--event-purple))]"
                                        } ${color === c ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""}`}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-between">
                    {event && onDelete && (
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
