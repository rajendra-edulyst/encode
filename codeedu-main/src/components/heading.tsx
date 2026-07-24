import { cn } from "@/lib/utils";
import { stripHtmlTags } from "@/utils/stripHtmlTags";

export default function Heading({ title, description, className }: { title: string; description?: string; className?: string }) {
    return (
        <div className={cn("mb-8 space-y-0.5", className)}>
            <h2 className="text-xl font-semibold tracking-tight dark:text-white capitalize">{title}</h2>
            {description && <p className="text-muted-foreground text-sm line-clamp-1">{stripHtmlTags(description)}</p>}
        </div>
    );
}