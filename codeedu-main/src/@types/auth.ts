export type SignInCredential = {
    email: string
    password: string
    org_check_required?: number
}

// export type SignInResponse = {
//     token: string
//     user: {
//         userId: string
//         userName: string
//         authority: string[]
//         avatar: string
//         email: string
//     }
// }

export type SignInResponse = {
    status: number,
    error: string,
    data: {
        token: string,
        user: User
    }
}


export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    name: string
    email: string
    password?: string
    // extra fields
    dob: string
    profilePic: string,
    first_name: string,
    last_name: string,
    gender: string,
    mobile_no: string,
    alternate_mobile_no: string,
    email_address: string,
    date_of_birth: string,
    db_code: string,
    username: string,
    locale: string,
    created_timezone: string,
    wp_center_id: number | null,
    wp_course_id: number | null,
}


export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
    // email: string
}

export type AuthRequestStatus = 1 | 0 | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string,
    error: string
    response?: {
        user: User
        token: string
    }
}>

export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    authority?: string[]
    // api
    id: number | null,
    organization_id: number,
    name: string,
    email: string,
    status: string,
    department: string,
    designation: string,
    mec_regd_id: string,
    sso_token: string,
    role: string,
    mobile_no: number,
    locale: string,
    username: string,
    is_trainer: number,
    is_ignite_user: number,
    profile_image: string,
    language_id: number,
    english_name: string,
    is_primary_language: number,
    show_interest: number,
    category_ids: string,
    default_video_url_on_category: string,
    wp_center_id: number | null,
    wp_course_id: number | null,
    is_kyc_verifed?: number
    abc_id?: string
    eula_accepted: string,
    terms_condition_accepted: string,
    privacy_policy_accepted: string,
    aadhaar_number?: string
    profile_svc_editkey?: string
    show_course_reg?: string
    permanent_address?: string
    isPersonalEmailVerified?: number
    isPersonalPhoneVerified?: number
    isUserConsentTaken?: number
    isUserWhatsappConsentTaken?: number
    alternate_email?: string
    enrollment_number?: string
    date_of_birth?: string
    gender?: string
    father_email_verified?: number
    father_mobile_verified?: number
    mother_email_verified?: number
    mother_mobile_verified?: number
    guardian_email_verified?: number
    guardian_mobile_verified?: number
    is_interest_save?: number | null
    org_logo?: string
    org_name?: string
    user_org_type?: 'industry' | 'coe' | 'institute' | 'university'
    is_mentor: number
    user_roles?: string[]
}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}


export type SendOtpMailApiResponse = {
    status: number
    message: string
    error?: string
    data?: {
        verification_type?: 'mobile' | 'email'
        token?: string
        [key: string]: unknown
    }
}


export type SendOtpMobileApiResponse = {
    status: number
    message: string
    data: {
        otp: string
    }
    error?: [string]
}



export type SignUpRequestReponseData = {
    reference_code: string
    email: string
    name: string
    mobile_no: string
    type: string
}

export type SignUpRequestApiReponse = {
    status: number
    message: string
    data: SignUpRequestReponseData
}

export type SignUpOtpSendRequest = {
    email: string;
    // is_signup: number;
    // forgot_pass: number;
    // locale: string;
}

export type SignUpOtpSendApiResponse = {
    status: number
    message: string
    data: {
        token: string
        verification_type?: 'mobile' | 'email'
        [key: string]: unknown
    }
}

export type SignUpTokenData = {
    id: number;
    name: string;
    email: string;
    mobile_number: string;
    /** When present (1/true), mobile OTP was verified on the lead — used for personal-info badge. */
    mobile_verified?: number | string | boolean;
    is_mobile_verified?: number | string | boolean;
    mobile_otp_verified?: number | string | boolean;
    email_verified?: number | string | boolean;
    is_email_verified?: number | string | boolean;
    verification_type?: 'mobile' | 'email';
    reference_number: string;
    organization_id: number;
    type: string;
    status: string;
    role: string;
    data: {
        city: string;
        name: string;
        phone: string;
        state: string;
        country: number;
        pinCode: number;
        institute: string;
        hearAboutUs: string;
        country_code: string;
        qualification: string;
        alternateEmail: string;
        profile_image: string;
        [key: string]: unknown
    }
}

export type SignUpTokenApiResponse = {
    status: number
    message: string
    data: SignUpTokenData
    email: string
}

export type SignUpResendOtpRequest = {
    email: string;
}

export type SignUpResendOtpApiResponse = {
    status: number
    message: string
    data: {
        token: string
    }
}



// signup request
export type OAuthSignUpData = {
    signup_lead: {
        email: string;
        name: string;
        type: string;
        status: string;
        organization_id: number;
        reference_number: string;
        updated_at: string;
        created_at: string;
        id: number;
    };
    email_token: string;
    name: string;
    profile_pic: string;
    isProfileCreatedNow: boolean;
    doesHaveProfile: boolean;
    token: string;
    user: User;
}

export type OAuthSignUpApiResponse = {
    status: number;
    data: OAuthSignUpData;
    error: string;
}