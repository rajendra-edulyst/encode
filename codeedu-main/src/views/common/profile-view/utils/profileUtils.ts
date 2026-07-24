// profileUtils.ts
import { getprofile } from '../services/profileService';

export const getProfileImage = async () => {
  const profile = await getprofile();
  return profile?.portfolio?.profileSection?.basic_info?.[0]?.profilePicture;
};
