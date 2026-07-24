import appConfig from "@/configs/app.config";

export const ENVIRONMENT_TYPE: 'local' | 'live' = 'local';

export const SVC_API_BASE_URL = 'https://profiles.edulystventures.com/api';

export const SHARE_PROFILE_URL = `${appConfig.appUrl}/portfolio`;
// export const SHARE_PROFILE_URL = `http://localhost:5173/portfolio`;

const LocalKey = 'e430f4c6473ee3b465be4c06f0078b85df63b91c8c644dfcd1b6106eadd90811';

export const getFrontendKey = (): { FRONTEND_KEY: string | null } => {
  if (ENVIRONMENT_TYPE === 'local') {
    return { FRONTEND_KEY: LocalKey };
  } else {
    try {
      const sessionUser = localStorage.getItem('sessionUser');
      if (sessionUser) {
        const user = JSON.parse(sessionUser);
        return { FRONTEND_KEY: user?.state?.user?.FrontendOpenApiKey ?? null };
      }
    } catch (err) {
      console.error('Error parsing sessionUser from localStorage:', err);
    }
    return { FRONTEND_KEY: null };
  }
};

export const setProfileEditKey = (EditKey: string): void => {
  localStorage.setItem('editKey', EditKey);
};