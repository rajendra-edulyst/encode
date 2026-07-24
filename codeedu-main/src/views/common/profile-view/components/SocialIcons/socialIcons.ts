// socialIcons.ts
// Updated to match the available SVG filenames in the SocialIcons folder.
import Facebook from './Facebook.svg';
import X from './X.svg';
import LinkedIn from './LinkedIn.svg';
import Instagram from './Instagram.svg';
import Youtube from './Youtube.svg';
import Github from './Github.svg';
import Behance from './Behance.svg';
import Figma from './Figma.svg';
import Notion from './Notion.svg';
import Dribbble from './Dribbble.svg';
import Discord from './Discord.svg';
import ORCID from './ORCID.svg';
import Reddit from './Reddit.svg';
import Snapchat from './Snapchat.svg';
import Pinterest from './Pinterest.svg';
import Thread from './Thread.svg';
import HackerRank from './HackerRank.svg';
import Vidwan from './Vidwan.svg';

// Some icons in older code may reference keys that aren't present as files
// (for example `vidwan` or `twitter`). Map those keys to reasonable fallbacks
// so <img src={socialIcons[key]} /> doesn't break.
export const socialIcons: Record<string, string> = {
  // platform key -> file
  facebook: Facebook,
  twitter: X, // map twitter to X.svg
  linkedin: LinkedIn,
  instagram: Instagram,
  youtube: Youtube,
  github: Github,
  behance: Behance,
  figma: Figma,
  notion: Notion,
  dribbble: Dribbble,
  discord: Discord,
  orcid: ORCID,
  reddit: Reddit,
  snapchat: Snapchat,
  pinterest: Pinterest,
  threads: Thread,
  hackerrank: HackerRank,
  vidwan: Vidwan,
};
