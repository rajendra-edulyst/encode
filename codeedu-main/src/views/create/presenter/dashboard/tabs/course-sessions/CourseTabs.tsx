import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  active: string;
  onChange: (value: string) => void;
  tabs?: string[];
}

const defaultTabs = ["All", "Ongoing", "Completed"];

export default function CourseTabs({ active, onChange, tabs = defaultTabs }: Props) {
  return (
    <Tabs value={active.toLowerCase()} onValueChange={(val) => onChange(val)}>
      <TabsList className='bg-[#5A5A5A] rounded-xl overflow-x-auto custom-scrollbar p-0 h-auto border border-white/10 w-full justify-start sm:justify-center'>
        {tabs.map(tab => (
          <TabsTrigger
            key={tab}
            value={tab.toLowerCase()}
            className='border-r border-white/20 last:border-0 rounded-none text-white py-2 px-3 md:px-4 lg:px-5 data-[state=active]:bg-primary transition-all text-xs md:text-[13px] font-medium whitespace-nowrap'
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
