import { ExternalLink, MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "./ui/ShadcnButton";
import { Resource } from "@/@types/learner/Courses";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface ToolCardProps {
    item: Resource;
    mapResource: (id: number) => void;
    showRemove?: boolean;
}

const ToolCard = ({ item, mapResource, showRemove }: ToolCardProps) => (
    <Card>
        <CardHeader className="pb-3">
            <div className="flex justify-between items-center gap-2">
                <img src={item.logo_url ?? `https://ui-avatars.com/api/?name=${item.name}&background=random&size=64`} alt={item.name} className="w-6 h-6 object-cover rounded-lg"
                    onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${item.name}&background=random&size=64`;
                    }}
                />
                <div className="flex justify-between items-center w-full">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-600 font-medium">
                        {item.paid_status ?? 'Free'}
                    </span>
                </div>
            </div>
            <div>
                <p className="text-cblack dark:text-white font-bold">{item.category}</p>
            </div>
        </CardHeader>
        <CardContent className="pb-3">
            <p className="text-sm text-gray-500 dark:text-white line-clamp-3">
                {item.description || item.purpose}
            </p>
        </CardContent>
        <CardFooter className="pb-3">
            <div className="flex justify-between items-center w-full">
                <Button variant={'link'} className="px-0 text-cblack dark:text-white font-semibold" onClick={() => mapResource(item.id)}>
                    {item.saved == 0 && <PlusCircle className="text-pink-600" />} {item.saved == 0 && 'Add'}
                    {item.saved != 0 && showRemove && <MinusCircle className="text-red-600" />} {item.saved != 0 && showRemove && 'Remove'}
                </Button>
                <Button variant={'link'} className='px-0 text-cblack dark:text-white font-semibold' onClick={() => item.official_url && window.open(item.official_url, "_blank")}>
                    <ExternalLink className="w-4 h-4 text-pink-600 " /> Visit
                </Button>
            </div>
        </CardFooter>
    </Card>
)


export default ToolCard;