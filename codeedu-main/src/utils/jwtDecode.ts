import { jwtDecode } from "jwt-decode";

interface GoogleJwtPayload {
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
    sub: string;
}

const decodeGoogleToken = (idToken: string): GoogleJwtPayload | null => {
    try {
        return jwtDecode<GoogleJwtPayload>(idToken);
    } catch (err) {
        console.error("Failed to decode Google token", err);
        return null;
    }
};


export default decodeGoogleToken;