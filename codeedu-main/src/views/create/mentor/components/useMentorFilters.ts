import { useMemo } from 'react';
import type { AllMentorList, Mentor } from '@/@types/create/mentor';
import type { TabKey } from './tabsConfig';
import { LMSMentor } from '@/@types/create/mentor';

export interface FilterInputs {
  mentors: Mentor[];
  myMentors: LMSMentor[];
  recommendedMentors: LMSMentor[];
  mentorListV2: AllMentorList[];
  selectedTab: TabKey;
  locationFilter: string;
  domainFilter: string;
  sortBy: string;
  searchTerm: string;
}

export interface FilterOutputs {
  filteredMentors: Mentor[];
  locations: string[];
  domains: string[];
}

const normalize = (s?: string) => (s ?? '').toString().trim();
const lower = (s?: string) => normalize(s).toLowerCase();

export function useMentorFilters({
  mentors,
  myMentors,
  recommendedMentors,
  mentorListV2,
  selectedTab,
  locationFilter,
  domainFilter,
  sortBy,
  searchTerm,
}: FilterInputs): FilterOutputs {
  // 1. Create a unified base list of all 146 mentors from mentorListV2,
  // enriched with detailed profile data from 'mentors' if available.
  const unifiedBase = useMemo(() => {
    const mentorMapById = new Map(mentors.map(m => [m.uniqueIdentifier.toString(), m]));

    return mentorListV2.map(v2 => {
      const idStr = v2.id.toString();
      const existing = mentorMapById.get(idStr);
      if (existing) return { ...existing, rating: v2.rating, slot_available: v2.slot_available };

      // synthesize a Mentor object for those not in the detailed list
      return {
        _id: `v2-${idStr}`,
        name: v2.name,
        uniqueIdentifier: idStr,
        org_id: v2.organization_id?.toString() || '',
        role: 'mentor',
        status: 'active',
        isVerified: true,
        rating: v2.rating,
        slot_available: v2.slot_available,
        profileSection: {
          basic_info: [{
            name: v2.name,
            email: v2.email,
            profilePicture: 'https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/ojQf0ridmqH69aWJAtLqfFotJFG4aDmXOazdHNXM.jpg',
            username: v2.email?.split('@')[0] || '',
            phone: '',
            resume: '',
            verification_status: 'verified',
            show_personal_info: true,
            coverPicture: ''
          }],
          about: [{
            id: idStr,
            about_me: '',
            current_role_head_line: v2.organization_name || 'Mentor',
            location: v2.department_name || '',
            years_of_exp: 0,
            domain: v2.skills?.map(s => s.name).join(', ') || ''
          }],
          social_links: [{
            linkedin: '', behance: '', instagram: '', youtube: '', dribble: '',
            facebook: '', twitter: '', pinterest: '', other: '', vidwan: ''
          }],
          areas_of_expertise: [{
            areas_of_expertise: v2.skills?.map(s => s.name).join(', ') || ''
          }],
          experience: [],
          experience_summary: [{
            experience_summary: ''
          }]
        },
        portfolio_id: '',
        editKey: '',
        __v: 0,
      } as Mentor;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [mentors, mentorListV2]);

  // 2. build sets for filters using unifiedBase
  const { locations, domains } = useMemo(() => {
    const locSet = new Set<string>();
    const domainSet = new Set<string>();

    unifiedBase.forEach(m => {
      const about0 = m?.profileSection?.about?.[0];
      const location = normalize(about0?.location);
      if (location) locSet.add(location);

      // domain can be in about[0].domain OR areas_of_expertise[0].areas_of_expertise
      const domainRaw = normalize(about0?.domain);
      if (domainRaw && domainRaw !== 'nan') {
        domainRaw.split(',').map(s => normalize(s)).filter(Boolean).forEach(d => domainSet.add(d));
      } else {
        const areas = normalize(m?.profileSection?.areas_of_expertise?.[0]?.areas_of_expertise);
        if (areas) areas.split(',').map(s => normalize(s)).filter(Boolean).forEach(d => domainSet.add(d));
      }
    });

    const locations = Array.from(locSet).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    const domains = Array.from(domainSet).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    return { locations, domains };
  }, [unifiedBase]);

  const filteredMentors = useMemo(() => {
    // 3. tab filter using unifiedBase
    let tabFiltered: Mentor[] = unifiedBase;

    if (selectedTab === 'my-mentors') {
      const myIds = new Set(myMentors?.map(mm => mm.id.toString()));
      tabFiltered = unifiedBase.filter(m => myIds.has(m.uniqueIdentifier));
    } else if (selectedTab === 'recommended') {
      const recIds = new Set(recommendedMentors.map(mm => mm.id.toString()));
      tabFiltered = unifiedBase.filter(m => recIds.has(m.uniqueIdentifier.toString()));
    } else if (selectedTab === 'all' || selectedTab === 'explore') {
      // already uses unifiedBase as default
      tabFiltered = unifiedBase;
    }

    // location filter
    const locApplied = locationFilter !== 'All Locations'
      ? tabFiltered.filter(m => {
        const about = m?.profileSection?.about || [];
        return about.some(item => normalize(item?.location) === normalize(locationFilter));
      })
      : tabFiltered;

    // domain filter
    const domApplied = domainFilter !== 'All Domains'
      ? locApplied.filter(m => {
        const about0 = m?.profileSection?.about?.[0];
        const domainRaw = normalize(about0?.domain);
        const areas = normalize(m?.profileSection?.areas_of_expertise?.[0]?.areas_of_expertise);

        const flatDomains: string[] = [];
        if (domainRaw && domainRaw !== 'nan') {
          domainRaw.split(',').map(s => normalize(s)).filter(Boolean).forEach(d => flatDomains.push(d));
        }
        if (areas) {
          areas.split(',').map(s => normalize(s)).filter(Boolean).forEach(d => flatDomains.push(d));
        }
        return flatDomains.some(d => lower(d) === lower(domainFilter));
      })
      : locApplied;

    // search by name
    const search = lower(searchTerm);
    const searchApplied = search
      ? domApplied.filter(m => {
        const nameMatch = lower(m.name).includes(search);
        const emailMatch = lower(m?.profileSection?.basic_info?.[0]?.email).includes(search);
        return nameMatch || emailMatch;
      })
      : domApplied;

    // sort
    let sorted = searchApplied;
    if (sortBy === 'Rating') {
      sorted = [...searchApplied].sort((a, b) => {
        const getRating = (m: Mentor) => {
          const r = parseFloat(m.rating || '0') || 0;
          return r < 3 ? 3 : r;
        };
        const rA = getRating(a);
        const rB = getRating(b);
        return rB - rA;
      });
    } else if (sortBy === 'A-Z') {
      sorted = [...searchApplied].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Z-A') {
      sorted = [...searchApplied].sort((a, b) => b.name.localeCompare(a.name));
    }

    // Prioritize mentors with more open slots (API count) at the top
    return [...sorted].sort((a, b) => {
      const countA = Math.max(0, Math.floor(Number(a.slot_available) || 0));
      const countB = Math.max(0, Math.floor(Number(b.slot_available) || 0));
      if (countA !== countB) {
        return countB - countA;
      }
      return 0;
    });
  }, [mentors, myMentors, recommendedMentors, mentorListV2, selectedTab, locationFilter, domainFilter, sortBy, searchTerm]);

  return { filteredMentors, locations, domains };
}
