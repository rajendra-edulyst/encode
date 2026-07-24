// export type InFocus = {
//     id: string;
//     title: string;
//     description: string;
//     image: string;
//     tags: string[];
// }

// export type InFocusApiResponse = {
//     data: InFocus[];
//     status: number;
//     error?: string;
// }

export type Skill = {
  id: number;
  name: string;
};

export type Profile = {
  id: number;
  profile_image: string;
  org_logo: string;
  role: string;
  skills: Skill[];
  email: string;
  org_type: string;
  org_description: string;
  name: string;
  logo: string;
  address: string;
  country_id: number;
  state_id: string;
  city: string;
  country_name: string;
  state_name: string;
  unknown_key: string;
};

export type InFocus = {
  id: number;
  placeholder: string;
  type: string;
  reference_id: number;
  organization_id: number;
  user_id: number;
  url_ref: number;
  sequence: number;
  tab_name: string;
  display_name: string;
  status: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  profiles: Profile[];
};

export type InFocusApiResponse = {
  status: number;
  data: InFocus[];
  error: string | null;
};