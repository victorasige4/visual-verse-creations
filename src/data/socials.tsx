import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import type { SVGProps } from "react";

function TikTokIcon({size=19,...props}:SVGProps<SVGSVGElement>&{size?:number}){
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}><path d="M14.5 2h3c.25 2.16 1.6 4.02 4.5 4.35v3.02a8.1 8.1 0 0 1-4.5-1.58v8.34a6.25 6.25 0 1 1-6.25-6.25c.4 0 .79.04 1.17.11v3.09a3.25 3.25 0 1 0 2.08 3.05V2Z"/></svg>;
}

// Canonical profile URLs, without share-tracking parameters.
export const SOCIAL_PROFILES = [
  {name:"LinkedIn",url:"https://www.linkedin.com/company/visualverse-creations",Icon:Linkedin},
  {name:"Instagram",url:"https://www.instagram.com/visualverse.creations/",Icon:Instagram},
  {name:"Facebook",url:"https://www.facebook.com/profile.php?id=61596655380659",Icon:Facebook},
  {name:"TikTok",url:"https://www.tiktok.com/@visualverse83",Icon:TikTokIcon},
  {name:"YouTube",url:"https://youtube.com/@visualversecreations",Icon:Youtube},
] as const;
