import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/ShadcnButton';
import { Link } from 'react-router-dom';
import ConnectSearch from '../components/ConnectSearch';

interface Props {
  active?: 'encode' | 'myposts' | 'communities' | 'discover';
  children: React.ReactNode;
  isCCI?: boolean;
}

const ConnectLayout = ({ active, children, isCCI = false }: Props) => {

  return (
    <div className={isCCI ? 'w-full min-h-screen bg-black py-10 px-6 flex flex-col items-center' : 'mt-5 px-4'}>
      {!isCCI && (
        <Card className="grid grid-cols-1 md:grid-cols-2 rounded-2xl py-0 p-2 md:p-0">
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant={active === 'encode' ? 'default' : 'ghost'}
              className={`text-lg dark:text-white hover:bg-primary/10 md:p-8 rounded-2xl dark:border-gray-700 ${active === 'encode' ? 'font-bold' : ''
                }`}
            >
              <Link to="/connect">Encode</Link>
            </Button>
            <Button
              asChild
              variant={active === 'communities' ? 'default' : 'ghost'}
              className={`text-lg dark:text-white hover:bg-primary/10 md:p-8 rounded-2xl dark:border-gray-700 ${active === 'communities' ? 'font-bold' : ''
                }`}
            >
              <Link to="/connect/communities">Communities</Link>
            </Button>
            <Button
              asChild
              variant={active === 'discover' ? 'default' : 'ghost'}
              className={`text-lg dark:text-white hover:bg-primary/10 md:p-8 rounded-2xl dark:border-gray-700 ${active === 'discover' ? 'font-bold' : ''
                }`}
            >
              <Link to="/connect/discover">Discover</Link>
            </Button>
          </div>

          <div className="flex items-center justify-end pr-4">
            <ConnectSearch />
          </div>
        </Card>
      )}
      <div className={isCCI ? 'w-full max-w-[1260px]' : 'mt-8'}>{children}</div>
    </div>
  );
};

export default ConnectLayout;
