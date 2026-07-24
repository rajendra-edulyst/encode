export function phoneMask(phone: string, personalInfoHide: boolean): string {
    if (personalInfoHide ) {
        return phone.replace(
            /^(.)(.*)(.{2})$/,
            (_: string, first: string, middle: string, last: string) =>
                first + '*'.repeat(middle.length) + last
        );
    }
    else {
        return phone
    }

}