import { useMemo } from 'react';
import type { Mentor, AllMentorList } from '@/@types/create/mentor';

export interface FilterInputs {
  mentors: Mentor[];
  mentorRatings: AllMentorList[];
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

export function usePublicMentorFilters({
  mentors,
  mentorRatings,
  locationFilter,
  domainFilter,
  sortBy,
  searchTerm,
}: FilterInputs): FilterOutputs {
  
  // 1. Build unified base
  const unifiedBase = useMemo(() => {
    const ratingsMap = new Map(mentorRatings.map(r => [r.id.toString(), r]));
    const emailRatingsMap = new Map(mentorRatings.filter(r => r.email).map(r => [r.email, r]));

    return mentors.map(m => {
        const uid = m.uniqueIdentifier.toString();
        const mEmail = m?.profileSection?.basic_info?.[0]?.email;
        const ratingData = ratingsMap.get(uid) || (mEmail ? emailRatingsMap.get(mEmail) : undefined);
        
        return {
            ...m,
            rating: ratingData?.rating || m.rating || '0',
            slot_available: ratingData?.slot_available ?? m.slot_available ?? 0,
        };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [mentors, mentorRatings]);

  // 2. Build sets for filters using unifiedBase
  const { locations, domains } = useMemo(() => {
    const locSet = new Set<string>();
    const domainSet = new Set<string>();

    unifiedBase.forEach(m => {
      const about0 = m?.profileSection?.about?.[0];
      const location = normalize(about0?.location);
      if (location) locSet.add(location);

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
    const tabFiltered: Mentor[] = unifiedBase;

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
        const rA = parseFloat(a.rating || '0') || 0;
        const rB = parseFloat(b.rating || '0') || 0;
        return rB - rA;
      });
    } else if (sortBy === 'A-Z') {
      sorted = [...searchApplied].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Z-A') {
      sorted = [...searchApplied].sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
  }, [unifiedBase, locationFilter, domainFilter, sortBy, searchTerm]);

  return { filteredMentors, locations, domains };
}
