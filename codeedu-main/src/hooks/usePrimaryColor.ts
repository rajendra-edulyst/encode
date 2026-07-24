import { hexToHSL } from "@/lib/color";

export function setPrimaryColorFromHex(hex: string | null | undefined) {

    if (!hex || hex === '') return;

    document.documentElement.style.setProperty('--primary', hex);

    // Optional: set appropriate foreground
    const lightness = parseInt(hexToHSL(hex).split(' ')[2]);
    const fg = lightness > 60 ? '0 0% 0%' : '0 0% 100%';
    document.documentElement.style.setProperty('--primary-foreground', fg);
}