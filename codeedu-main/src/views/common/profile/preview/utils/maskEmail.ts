const maskEmail = (email: string, personalInfoHide: boolean): string => {

    if (personalInfoHide) {


    const [localPart, domain] = email.split('@');
    if (!domain) return email; // Return the original email if no domain is found

    const maskedLocalPart = localPart.length > 2
        ? localPart.slice(0, 3) + '*'.repeat(localPart.length - 2)
        : localPart;

    return `${maskedLocalPart}@${domain}`;

    }
    else {
        return email;
    }
}


export default maskEmail;