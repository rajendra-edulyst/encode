/**
 * Shared country tax data utility
 * Used by BillingDetails and CourseInvoice to show the correct
 * tax type name (VAT / GST / Sales Tax / etc.) and standard rate
 * for any selected country.
 *
 * India always uses GST (18%) split as CGST+SGST (intra-state)
 * or IGST (inter-state) — handled separately in each component.
 */

export type TaxInfo = { label: string; rate: string };

/**
 * Map of lowercase country name → { label, rate }
 * Covers 100+ countries across all regions.
 * Unknown countries fall back to "Tax (18%)" via getTaxLabel().
 */
export const COUNTRY_TAX_DATA: Record<string, TaxInfo> = {
    // ── Asia-Pacific ──────────────────────────────────────────────
    'australia':              { label: 'GST',              rate: '10%' },
    'new zealand':            { label: 'GST',              rate: '15%' },
    'singapore':              { label: 'GST',              rate: '9%' },
    'japan':                  { label: 'Consumption Tax',  rate: '10%' },
    'china':                  { label: 'VAT',              rate: '13%' },
    'south korea':            { label: 'VAT',              rate: '10%' },
    'thailand':               { label: 'VAT',              rate: '7%' },
    'malaysia':               { label: 'SST',              rate: '6%–10%' },
    'indonesia':              { label: 'PPN',              rate: '11%' },
    'philippines':            { label: 'VAT',              rate: '12%' },
    'vietnam':                { label: 'VAT',              rate: '10%' },
    'pakistan':               { label: 'GST',              rate: '17%' },
    'bangladesh':             { label: 'VAT',              rate: '15%' },
    'sri lanka':              { label: 'VAT',              rate: '18%' },
    'nepal':                  { label: 'VAT',              rate: '13%' },
    'myanmar':                { label: 'Commercial Tax',   rate: '5%' },
    'cambodia':               { label: 'VAT',              rate: '10%' },
    'laos':                   { label: 'VAT',              rate: '10%' },
    'taiwan':                 { label: 'VAT',              rate: '5%' },
    'hong kong':              { label: 'No VAT/GST',       rate: '0%' },
    'mongolia':               { label: 'VAT',              rate: '10%' },

    // ── Europe ────────────────────────────────────────────────────
    'united kingdom':         { label: 'VAT',              rate: '20%' },
    'germany':                { label: 'VAT (MwSt)',       rate: '19%' },
    'france':                 { label: 'VAT (TVA)',        rate: '20%' },
    'italy':                  { label: 'VAT (IVA)',        rate: '22%' },
    'spain':                  { label: 'VAT (IVA)',        rate: '21%' },
    'netherlands':            { label: 'VAT (BTW)',        rate: '21%' },
    'belgium':                { label: 'VAT (BTW)',        rate: '21%' },
    'austria':                { label: 'VAT (MwSt)',       rate: '20%' },
    'portugal':               { label: 'VAT (IVA)',        rate: '23%' },
    'greece':                 { label: 'VAT (ΦΠΑ)',        rate: '24%' },
    'ireland':                { label: 'VAT',              rate: '23%' },
    'luxembourg':             { label: 'VAT',              rate: '17%' },
    'sweden':                 { label: 'VAT (Moms)',       rate: '25%' },
    'norway':                 { label: 'VAT (MVA)',        rate: '25%' },
    'denmark':                { label: 'VAT (Moms)',       rate: '25%' },
    'finland':                { label: 'VAT (ALV)',        rate: '24%' },
    'iceland':                { label: 'VAT (VSK)',        rate: '24%' },
    'switzerland':            { label: 'VAT (MWST)',       rate: '8.1%' },
    'poland':                 { label: 'VAT (PTU)',        rate: '23%' },
    'czech republic':         { label: 'VAT (DPH)',        rate: '21%' },
    'hungary':                { label: 'VAT (ÁFA)',        rate: '27%' },
    'romania':                { label: 'VAT (TVA)',        rate: '19%' },
    'bulgaria':               { label: 'VAT (ДДС)',        rate: '20%' },
    'croatia':                { label: 'VAT (PDV)',        rate: '25%' },
    'slovakia':               { label: 'VAT (DPH)',        rate: '20%' },
    'slovenia':               { label: 'VAT (DDV)',        rate: '22%' },
    'estonia':                { label: 'VAT (KM)',         rate: '22%' },
    'latvia':                 { label: 'VAT (PVN)',        rate: '21%' },
    'lithuania':              { label: 'VAT (PVM)',        rate: '21%' },
    'cyprus':                 { label: 'VAT',              rate: '19%' },
    'malta':                  { label: 'VAT',              rate: '18%' },
    'ukraine':                { label: 'VAT (ПДВ)',        rate: '20%' },
    'russia':                 { label: 'VAT (НДС)',        rate: '20%' },
    'turkey':                 { label: 'VAT (KDV)',        rate: '20%' },
    'serbia':                 { label: 'VAT (PDV)',        rate: '20%' },
    'albania':                { label: 'VAT (TVSH)',       rate: '20%' },
    'north macedonia':        { label: 'VAT (ДДВ)',        rate: '18%' },
    'moldova':                { label: 'VAT (TVA)',        rate: '20%' },
    'belarus':                { label: 'VAT (НДС)',        rate: '20%' },

    // ── Americas ──────────────────────────────────────────────────
    'united states':          { label: 'Sales Tax',        rate: 'varies' },
    'canada':                 { label: 'GST/HST',          rate: '5%–15%' },
    'mexico':                 { label: 'IVA',              rate: '16%' },
    'brazil':                 { label: 'ICMS/ISS',         rate: 'varies' },
    'argentina':              { label: 'IVA',              rate: '21%' },
    'colombia':               { label: 'IVA',              rate: '19%' },
    'chile':                  { label: 'IVA',              rate: '19%' },
    'peru':                   { label: 'IGV',              rate: '18%' },
    'venezuela':              { label: 'IVA',              rate: '16%' },
    'ecuador':                { label: 'IVA',              rate: '12%' },
    'bolivia':                { label: 'IVA',              rate: '13%' },
    'uruguay':                { label: 'IVA',              rate: '22%' },
    'paraguay':               { label: 'IVA',              rate: '10%' },
    'costa rica':             { label: 'IVA',              rate: '13%' },
    'panama':                 { label: 'ITBMS',            rate: '7%' },
    'guatemala':              { label: 'IVA',              rate: '12%' },
    'honduras':               { label: 'ISV',              rate: '15%' },
    'el salvador':            { label: 'IVA',              rate: '13%' },
    'nicaragua':              { label: 'IVA',              rate: '15%' },
    'dominican republic':     { label: 'ITBIS',            rate: '18%' },

    // ── Middle East & Africa ──────────────────────────────────────
    'united arab emirates':   { label: 'VAT',              rate: '5%' },
    'saudi arabia':           { label: 'VAT',              rate: '15%' },
    'bahrain':                { label: 'VAT',              rate: '10%' },
    'oman':                   { label: 'VAT',              rate: '5%' },
    'qatar':                  { label: 'No VAT',           rate: '0%' },
    'kuwait':                 { label: 'No VAT',           rate: '0%' },
    'israel':                 { label: 'VAT (מע"מ)',       rate: '17%' },
    'egypt':                  { label: 'VAT',              rate: '14%' },
    'south africa':           { label: 'VAT',              rate: '15%' },
    'kenya':                  { label: 'VAT',              rate: '16%' },
    'nigeria':                { label: 'VAT',              rate: '7.5%' },
    'ghana':                  { label: 'VAT',              rate: '15%' },
    'ethiopia':               { label: 'VAT',              rate: '15%' },
    'tanzania':               { label: 'VAT',              rate: '18%' },
    'uganda':                 { label: 'VAT',              rate: '18%' },
    'rwanda':                 { label: 'VAT',              rate: '18%' },
    'morocco':                { label: 'VAT (TVA)',        rate: '20%' },
    'tunisia':                { label: 'VAT (TVA)',        rate: '19%' },
    'algeria':                { label: 'VAT (TVA)',        rate: '19%' },
    'cameroon':               { label: 'VAT',              rate: '19.25%' },
    'senegal':                { label: 'VAT (TVA)',        rate: '18%' },
    'ivory coast':            { label: 'VAT (TVA)',        rate: '18%' },
    'zimbabwe':               { label: 'VAT',              rate: '15%' },
    'zambia':                 { label: 'VAT',              rate: '16%' },
    'jordan':                 { label: 'GST',              rate: '16%' },
    'lebanon':                { label: 'VAT',              rate: '11%' },
};

/**
 * Parses the rate string from COUNTRY_TAX_DATA into a numeric percentage.
 *
 * Examples:
 *   getNumericRate('India')          → 18   (default)
 *   getNumericRate('Australia')      → 10
 *   getNumericRate('Germany')        → 19
 *   getNumericRate('Switzerland')    → 8.1
 *   getNumericRate('Canada')         → 5    (takes first value of "5%–15%")
 *   getNumericRate('United States')  → 0    ("varies" → no fixed rate)
 *   getNumericRate('Qatar')          → 0    (no VAT)
 */
export const getNumericRate = (countryName: string): number => {
    const key = (countryName || '').toLowerCase().trim();
    if (!key || key === 'india') return 18;
    const info = COUNTRY_TAX_DATA[key];
    if (!info) return 18; // fallback to India default
    // Extract the first numeric value from the rate string
    const match = info.rate.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
};

/**
 * Returns the formatted tax label for a given country name.
 *
 * Examples:
 *   getTaxLabel('India')          → "GST (18%)"
 *   getTaxLabel('Germany')        → "VAT (MwSt) (19%)"
 *   getTaxLabel('United States')  → "Sales Tax (varies)"
 *   getTaxLabel('Australia')      → "GST (10%)"
 *   getTaxLabel('Unknown')        → "Tax (18%)"   ← safe fallback
 */
export const getTaxLabel = (countryName: string): string => {
    const key = (countryName || '').toLowerCase().trim();
    if (!key || key === 'india') return 'GST (18%)';
    const info = COUNTRY_TAX_DATA[key];
    if (!info) return 'Tax (18%)';
    return `${info.label} (${info.rate})`;
};
