import PortfolioApiService from "./axios";
import type { Section } from "./sectionService";


export interface BasicInfoSection {
    _id?: string;
    name: string;
    username?: string;
    email?: string;
    phone?: string;
    profilePicture?: string;
    coverPicture?: string;
    resume?: string;
    platform_name?: string;
    verification_status: 'not_applied' | 'pending' | 'verified' | 'rejected'
    show_personal_info: boolean
    current_role_head_line?: string
}


export interface Profile {
  _id: string;
  name: string;
  portfolio_id: string;
  org_id: string;
  role: string;
  uniqueIdentifier: string;
  isVerified: boolean;
  profileSection: {
    basic_info: BasicInfoSection[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socialLinks: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [sectionKey: string]: any[];
  };
}


export interface getProfileResponse {
    status: number
    data: {
        portfolio: Profile
        sections?: [Section]
    }
    message: string
}


export const getprofile = async () => {
    try {
        const response = await PortfolioApiService.get<getProfileResponse>('/user/profile');
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
};  

export const addProfileSectionEntry = async (formData: FormData) => {
    try {
        const response = await PortfolioApiService.post<getProfileResponse>(
            '/user/profile/add',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data.data;
    } catch (error) {
        console.error('Update profile failed:', error);
    }
};


export const acceptEula = async (formData: FormData) => {
    try {
        const response = await PortfolioApiService.post<getProfileResponse>(
            '/user/accept-eula',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data.data;
    } catch (error) {
        console.error('Update profile failed:', error);
    }
};




export const updateProfileSectionEntry = async (
  id: string,
  sectionKey: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profileSection: { Key: string; value: any }[],
  files: Record<string, File | null>,
) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("SectionKey", sectionKey);
    formData.append("profileSection", JSON.stringify(profileSection));

    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    const response = await PortfolioApiService.post(
      "/user/profile/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Update profile section entry failed:", error);
    throw error;
  }
};


export const deleteProfileSectionEntry = async (sectionKey: string, id: string) => {
    try {
        const response = await PortfolioApiService.post(
            `/user/profile/delete`,
            { SectionKey: sectionKey, id },
        );

        return response.data.data;
    } catch (error) {
        console.error('Delete profile section entry failed:', error);
    }
}


export const updateProfileImage = async (formData: FormData) => {
    try {
        const response = await PortfolioApiService.post(
            '/user/profile/update/profile-image',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Update profile image failed:', error);
    }
};


export const updateEulaAcceptance = async (formData: FormData) => {
  try {
    const response = await PortfolioApiService.post(
      '/api/v1/update-acceptance',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Update EULA acceptance failed:', error);
    throw error;
  }
};





export const updateCoverImage = async (formData: FormData) => {
    try {
        const response = await PortfolioApiService.post(
            '/user/profile/update/cover-image',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Update cover image failed:', error);
    }
};


export const RequestVerification = async () => {
    try {
        const response = await PortfolioApiService.post(
            '/user/profile/request-verification',
        );
        return response.data.data;
    } catch (error) {
        console.error('Update cover image failed:', error);
    }
};


export const UpatePreferences = async (data: { show_personal_info: boolean }) => {
  try {
    const response = await PortfolioApiService.post(
      '/user/profile/update/show-personal-info',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Update preferences failed:', error);
    throw error;
  }
};



export const addSocialLinks = async (fieldKey: string, value: string) => {
  try {
    const response = await PortfolioApiService.post(
      `/user/profile/add/social-links`,
      {
        fieldKey,
        value,
      }
    );
    return response.data?.data;
  } catch (error) {
    console.error('Add social link failed:', error);
    throw error;
  }
};


export const uploadResume = async (file: File, title: string) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('title', title);

    const response = await PortfolioApiService.post(
      '/user/profile/upload-resume',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Upload resume failed:', error);
    throw error;
  }
};


export const deleteResumeById = async (id: string) => {
  try {
    const response = await PortfolioApiService.post(
      '/user/profile/delete-resume',
      { id }
    );
    return response.data.data;
  } catch (error) {
    console.error('Delete resume failed:', error);
    throw error;
  }
};



export const markHighlighted = async (SectionKey: string, id: string, isHighlighted: boolean) => {
  try {
    const response = await PortfolioApiService.post(
      '/user/profile/mark-highlighted',
      { SectionKey, id, isHighlighted }
    );
    return response.data.data;
  } catch (error) {
    console.error('Mark highlighted failed:', error);
    throw error;
  }
};