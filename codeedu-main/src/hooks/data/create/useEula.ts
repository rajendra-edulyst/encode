import { updateEulaAcceptance } from "@/views/common/profile-view/services/profileService";
import { useQuery } from "@tanstack/react-query";

export const useAcceptEula = (
  isEula: string,
  isTNC: string,
  isPrivacy: string | undefined
) => {
  return useQuery({
    queryKey: ['Eula', isEula, isTNC, isPrivacy],
    queryFn: async () => {
      const formData = new FormData();
      formData.append('is_eula', isEula);
      formData.append('is_tnc', isTNC);
      if (isPrivacy) {
        formData.append('is_privacy', isPrivacy);
      }

      const res = await updateEulaAcceptance(formData);
      return res || null;
    },
    retry: 1,
    enabled: !!isEula,
    staleTime: 1000 * 60 * 5,
  });
};
