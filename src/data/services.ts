/** Canonical public service catalogue: order, labels and numbering. Keep route IDs stable. */
export const SERVICE_CATALOG = [
  { id: "graphic-design", name: "Graphic Design" },
  { id: "photography", name: "Photography" },
  { id: "web-ui-ux", name: "Web & UI/UX Design" },
  { id: "videography", name: "Videography" },
  { id: "branding", name: "Branding & Identity" },
  { id: "social-media", name: "Social Media & Digital Marketing" },
] as const;
export type PublicServiceId = typeof SERVICE_CATALOG[number]["id"];
export function orderedServices<T extends {id:string}>(entries:readonly T[]):T[] {
  return SERVICE_CATALOG.flatMap(({id}) => entries.filter(entry => entry.id === id));
}
export function serviceLabel(id:string):string {
  return SERVICE_CATALOG.find(service => service.id === id)?.name ?? id;
}
export function serviceNumber(id:string):string {
  return String(SERVICE_CATALOG.findIndex(service => service.id === id)+1).padStart(2,"0");
}
