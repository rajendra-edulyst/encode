export type TabKey = 'all' | 'my-mentors' | 'recommended' | 'explore';

export const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'my-mentors', label: 'My Mentors' },
  { key: 'recommended', label: 'Recommended' },
  { key: 'explore', label: 'Explore' },
];
