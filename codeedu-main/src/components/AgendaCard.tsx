import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import React from 'react'

interface AgendaData {
  banner: string;
  type: string;
  title: string;
  description: string;
}

interface AgendaCardProps {
  data: AgendaData;
}

const AgendaCard: React.FC<AgendaCardProps> = ({ data }) => {

  const getBadgeColor = (type: string) => {
    const typeLower = type;

    switch (typeLower) {
      case 'Masterclass':
        return 'bg-codeblue text-white';
      case 'Workshops':
        return 'bg-codepink text-white';
      case 'Industry Visits':
        return 'bg-codegreen text-white';
      case 'Competitions':
        return 'bg-codeyellow text-white';
      default:
        return 'bg-[#7FBC42]';
    }
  }

  return (
    <Card className="hover:shadow-md bg-[#323232] transition-shadow duration-300 rounded-lg overflow-hidden py-0">
      <CardHeader className="p-0 relative">
        <div className="h-48 bg-cover bg-center w-full" style={{ backgroundImage: `url(${data.banner})` }}>
          <div className="absolute top-0 -right-1">
            <span className={`px-3 py-1 ${getBadgeColor(data?.type)} text-[#323232] text-sm font-medium rounded-md`}>
              {data?.type}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <h4
            className="text-xl font-bold text-white mb-3 leading-tight"
            dangerouslySetInnerHTML={{ __html: data?.title }}
          />

          <div className="flex-1 flex flex-row gap-4 justify-between items-center">
            <p className="text-white text-sm leading-relaxed line-clamp-3 flex-grow mb-4">
              {data?.description}
            </p>

            <button className="flex items-center h-14 px-4 py-2 bg-[#7FBC42] text-[#323232] rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium text-sm">
              <ArrowRight height={16} width={16} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AgendaCard;