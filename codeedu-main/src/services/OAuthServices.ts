import { OAuthSignUpApiResponse, OAuthSignUpData, User } from '@/@types/auth';
import { apiGoogleOauthSignIn as GoogleAuthService } from '@/services/AuthService';
import ApiService from './ApiService';

type OAuthResponse = {
    token: string;
    user: User
}

type googleOauthSignIn = {
    token: string;
    type?: 'google'
}

type appleOauthSignIn = {
    token: string;
    type?: 'apple'
}

type OAuthResponseData = {
    data: {
        token: string;
        user: User;
    }
}

export async function apiGoogleOauthSignIn(data: googleOauthSignIn): Promise<OAuthResponse> {
    const response = (await GoogleAuthService(data)) as OAuthResponseData;
    // set authority array in user object add learner
    if (response?.data?.user) {
        response.data.user.role = 'Learner';
        // and profile_image set to avatar if not present
        if (!response.data.user.profile_image) {
            response.data.user.avatar = response?.data?.user?.profile_image;
        }
        else {
            response.data.user.avatar = 'https://ui-avatars.com/api/?name=' + response.data.user.name + '&background=random&color=fff';
        }
    }

    return {
        token: response.data.token,
        user: response.data.user,
    };
}

export async function apiAppleOauthSignIn(data: appleOauthSignIn): Promise<OAuthSignUpData> {
    const response = await ApiService.fetchDataWithAxios<OAuthSignUpApiResponse>({
        url: `/apple-signup-details`,
        method: 'post',
        data,
    })
    return response.data;
}