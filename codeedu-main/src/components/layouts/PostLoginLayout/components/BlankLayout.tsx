import LayoutBase from '@/components/template/LayoutBase'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import { useThemeStore } from '@/store/themeStore'
import { useEffect } from 'react'
import { setPrimaryColorFromHex } from '@/hooks/usePrimaryColor'

const Blank = ({ children }: CommonProps) => {
  const { group } = useThemeStore((state) => state);

  useEffect(() => {
    if (group === 'create') {
      setPrimaryColorFromHex('#009BD8');
    }
    else if (group === 'connect') {
      setPrimaryColorFromHex('#E60086');
    }
    else if (group === 'collaborate') {
      setPrimaryColorFromHex('#7FBC42');
    }
    else {
      setPrimaryColorFromHex('#009BD8');
    }
  }, [group]);

  return (
    <LayoutBase
      type={LAYOUT_COLLAPSIBLE_SIDE}
      className="flex min-h-screen min-w-0 w-full max-w-full flex-col"
    >
      {children}
    </LayoutBase>
  )
}

export default Blank