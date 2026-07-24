import { NavigationMenu } from "@/components/ui/navigation-menu"
import { useThemeStore } from "@/store/themeStore"
import { Button } from "@/components/ui/ShadcnButton"
import { setPrimaryColorFromHex } from "@/hooks/usePrimaryColor"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import cciRoutes from "@/configs/routes.config/cciRoutes"
import ccatRoutes from "@/configs/routes.config/ccatRoutes"

const HeaderNav = () => {

  const { group, setGroup } = useThemeStore((state) => state);

  const navigate = useNavigate();
  const location = useLocation();

  const handleGroupChange = (newGroup: string) => {
    setGroup(newGroup);
    if (newGroup === 'create') {
      setPrimaryColorFromHex('#009BD8');
      navigate('/create');
    }
    else if (newGroup === 'connect') {
      setPrimaryColorFromHex('#E60086');
      navigate('/connect');
    }
    else if (newGroup === 'collaborate') {
      setPrimaryColorFromHex('#7FBC42');
      navigate('/collaborate');
    }
    else {
      setPrimaryColorFromHex('#FF0000');
    }
  }

  useEffect(() => {
    if (group === 'create') {
      setPrimaryColorFromHex('#009BD8');
    } else if (group === 'connect') {
      setPrimaryColorFromHex('#E60086');
    } else if (group === 'collaborate') {
      setPrimaryColorFromHex('#7FBC42');
    } else {
      setPrimaryColorFromHex('#FF0000');
    }
  }, [group]);

  const hiddenRoutes = [...cciRoutes, ...ccatRoutes].map(route => route.path);
  const searchParams = new URLSearchParams(location.search);
  const hasCciQueryParam = Number(searchParams.get('cci')) > 0 || Number(searchParams.get('is_cci')) > 0;
  const isHiddenRoute = hasCciQueryParam || hiddenRoutes.some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

  if (isHiddenRoute) {
    return null;
  }

  return (
    <NavigationMenu className={`gap-0 rounded-2xl overflow-hidden md:flex hidden p-2 border dark:border-[#5A5A5A] gap-4`}>
      <Button className={`font-bold font-c rounded-xl uppercase px-10 text-2xl ${group === 'create' ? 'text-white dark:text-white' : 'bg-transparent text-black dark:text-white '}`} onClick={() => handleGroupChange('create')}>Create</Button>
      <Button className={`font-bold rounded-xl uppercase px-10 text-2xl ${group === 'connect' ? 'text-white dark:text-white' : 'bg-transparent text-black dark:text-white'}`} onClick={() => handleGroupChange('connect')}>Connect</Button>
      <Button className={`font-bold rounded-xl uppercase px-10 text-2xl ${group === 'collaborate' ? 'text-white dark:text-white' : 'bg-transparent text-black dark:text-white'}`} onClick={() => handleGroupChange('collaborate')}>Collaborate</Button>
    </NavigationMenu>
  )
}

export default HeaderNav