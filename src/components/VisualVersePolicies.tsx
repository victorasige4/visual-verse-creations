import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpRight, ShieldCheck, FileText, RotateCcw } from "lucide-react";

type PolicyKey = "terms" | "privacy" | "cancellations";
type Section = { heading: string; paragraphs: string[] };
const policies: Record<PolicyKey,{title:string;eyebrow:string;sections:Section[]}> = {
  terms: {
    title:"Terms & Conditions",eyebrow:"WORKING TOGETHER",
    sections:[
      {heading:"1. About Visual Verse",paragraphs:["Visual Verse Creations provides creative services including graphic design, branding, photography, videography, web/UI/UX design and digital marketing. These website terms explain how enquiries and projects generally work; a signed proposal, quotation or service agreement takes precedence where it states different terms."]},
      {heading:"2. Quotes, scope and starting work",paragraphs:["Quotations normally remain valid for 14 calendar days unless otherwise stated. A project begins after scope, deliverables, timeline, fees and required approvals are agreed in writing.","A 50% deposit may be required before work begins, with the remaining balance due before delivery of final approved files, unless your quotation specifies a different arrangement."]},
      {heading:"3. Content, feedback and changes",paragraphs:["You are responsible for supplying accurate project information and obtaining rights or permissions for assets you provide. Revision rounds and project milestones are defined in the proposal. Requests beyond the agreed scope may require a revised fee and delivery date."]},
      {heading:"4. Rights and delivery",paragraphs:["Rights to approved final deliverables transfer only to the extent set out in the signed agreement and after full payment. Third-party fonts, photographs, software or licensed assets retain their own licensing terms.","Working files, raw photographs, unedited footage, source files and unused concepts are not automatically included unless expressly listed in your quotation."]},
      {heading:"5. Portfolio and confidentiality",paragraphs:["We may request permission to display completed public-facing work in our portfolio. Confidential material, unreleased concepts or information covered by an agreed nondisclosure obligation will not be shared without appropriate permission."]},
      {heading:"6. Responsibility and disputes",paragraphs:["Please inspect deliverables promptly and raise concerns within the review period in your agreement. Each party remains responsible for its own legal obligations, third-party rights and agreed approvals.","These terms are intended for projects based in Kenya. Any dispute-resolution procedure or liability limits in a signed service agreement take precedence, subject to applicable law."]},
    ]
  },
  privacy:{
    title:"Privacy & Cookies Policy",eyebrow:"YOUR INFORMATION MATTERS",
    sections:[
      {heading:"1. Information we collect",paragraphs:["When you enquire or work with us, we may receive your name, email address, phone number, organisation, project brief, files and correspondence. Website hosting and security providers may process basic technical records such as IP address, browser details and pages visited."]},
      {heading:"2. How we use information",paragraphs:["We use this information to reply to enquiries, prepare quotations, organise creative projects, manage billing, deliver work, maintain website security and meet legal obligations. Promotional updates are only sent where we have an appropriate basis, including consent where required."]},
      {heading:"3. Sharing and storage",paragraphs:["We do not sell personal information. We may share necessary project data with trusted hosting, email, payments, file-storage or contracted production service providers, subject to applicable privacy protections.","We retain information only for a reasonable period needed for the relevant project, legal or business purpose, then delete or anonymise it where appropriate."]},
      {heading:"4. Cookies and third-party links",paragraphs:["Essential website technologies may be used for performance or security. Optional analytics or marketing cookies, if enabled, will be governed by an appropriate consent mechanism where legally required.","Clicking our WhatsApp link opens a third-party platform governed by its own privacy terms; do not send sensitive personal data through public messaging channels."]},
      {heading:"5. Your privacy rights",paragraphs:["You may ask about your data or request access, correction or deletion, subject to lawful retention requirements. To make a privacy request, contact us using the details below.","This policy should be read in the context of the Kenya Data Protection Act, 2019 and other applicable rules."]},
    ]
  },
  cancellations:{
    title:"Cancellation & Refund Policy",eyebrow:"FAIR PROJECT EXPECTATIONS",
    sections:[
      {heading:"1. Before work begins",paragraphs:["If your project is cancelled before work starts, we will review any payment received and itemise non-recoverable costs or reserved resources in accordance with the accepted quotation and applicable consumer law."]},
      {heading:"2. After work begins",paragraphs:["A deposit reserves time and helps cover early project work. Deposits may be non-refundable once work has started or costs have been incurred, where allowed by the signed agreement and applicable law.","If you cancel during a project, fees for completed work and approved third-party expenses may remain payable. Any unused balance will be assessed against the written scope, payments and project costs."]},
      {heading:"3. Rescheduling and delays",paragraphs:["Please request changes or cancellations in writing. Rescheduling photography, filming or event coverage depends on availability and costs already committed. Extended client-caused delays may require a revised schedule."]},
      {heading:"4. Problems with deliverables",paragraphs:["If a delivery does not match the agreed specification, notify us promptly. We will review the issue and provide the revisions or other remedies required under your agreement and applicable law."]},
    ]
  }
};
export const policyKeys: PolicyKey[]=["terms","privacy","cancellations"];

export function PolicyLinks({className=""}:{className?:string}) {
  const [active,setActive]=useState<PolicyKey|null>(null);
  const closeRef=useRef<HTMLButtonElement>(null);
  const priorFocus=useRef<HTMLElement|null>(null);

  useEffect(()=>{
    if(!active)return;
    priorFocus.current=document.activeElement as HTMLElement|null;
    const before=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const id=window.requestAnimationFrame(()=>closeRef.current?.focus());
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==="Escape")setActive(null);
      if(e.key==="Tab"){
        const modal=document.querySelector<HTMLElement>(".vv-policy-modal");
        if(!modal)return;
        const focusable=Array.from(modal.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])'));
        if(!focusable.length)return;
        const first=focusable[0],last=focusable[focusable.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
      }
    };
    document.addEventListener("keydown",onKey);
    return ()=>{
      window.cancelAnimationFrame(id);
      document.removeEventListener("keydown",onKey);
      document.body.style.overflow=before;
      priorFocus.current?.focus();
    };
  },[active]);

  return <>
    <div className={"vv-policy-links "+className} aria-label="Legal information">
      <button type="button" onClick={()=>setActive("terms")}>Terms & Conditions</button>
      <button type="button" onClick={()=>setActive("privacy")}>Privacy & Cookies</button>
      <button type="button" onClick={()=>setActive("cancellations")}>Cancellation & Refunds</button>
    </div>
    {active&&createPortal(
      <div className="vv-policy-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setActive(null)}}>
        <section className="vv-policy-modal" role="dialog" aria-modal="true" aria-labelledby="vv-policy-title">
          <div className="vv-policy-head"><span>{policies[active].eyebrow}</span><button ref={closeRef} type="button" aria-label="Close policy" onClick={()=>setActive(null)}><X size={22}/></button></div>
          <h2 id="vv-policy-title">{policies[active].title}</h2>
          <p className="vv-policy-updated">Last updated: 11 November 2026 · Visual Verse Creations, Nairobi, Kenya</p>
          <div className="vv-policy-body">
            {policies[active].sections.map(section=><section key={section.heading}><h3>{section.heading}</h3>{section.paragraphs.map((paragraph,i)=><p key={i}>{paragraph}</p>)}</section>)}
            <div className="vv-policy-contact"><strong>Questions or requests?</strong><a href="tel:+254794044598">+254 794 044 598</a><a href="mailto:hello@visualverse.com">hello@visualverse.com <ArrowUpRight size={14}/></a></div>
            <p className="vv-policy-disclaimer">This is a general website policy summary adapted from Visual Verse's earlier draft terms. Service-specific signed agreements and applicable laws govern individual engagements.</p>
          </div>
        </section>
      </div>,document.body
    )}
  </>;
}

export function WhatsAppFloating(){
  const text=encodeURIComponent("Hello Visual Verse! I'd like to discuss a creative project.");
  return <a className="vv-whatsapp-float" href={"https://wa.me/254794044598?text="+text} target="_blank" rel="noopener noreferrer"
    aria-label="Chat with Visual Verse on WhatsApp" title="Chat with us on WhatsApp">
    <svg viewBox="0 0 32 32" aria-hidden="true" fill="currentColor"><path d="M16 .6a15.2 15.2 0 0 0-13.03 23.06L.8 31.2l7.77-2.03A15.2 15.2 0 1 0 16 .6zm0 27.45a12.22 12.22 0 0 1-6.24-1.71l-.45-.27-4.6 1.2 1.23-4.48-.29-.46A12.2 12.2 0 1 1 16 28.05zm6.69-9.16c-.37-.18-2.18-1.08-2.52-1.2-.33-.12-.58-.18-.82.18-.24.37-.94 1.2-1.15 1.44-.21.25-.42.28-.8.1-.36-.19-1.54-.57-2.94-1.82-1.09-.97-1.83-2.17-2.04-2.53-.21-.37-.02-.56.16-.75.17-.16.36-.42.55-.64.18-.21.24-.36.36-.6.12-.25.06-.46-.03-.65-.09-.18-.82-1.98-1.13-2.71-.3-.71-.6-.61-.82-.62h-.7c-.24 0-.64.09-.97.46s-1.27 1.24-1.27 3.03 1.3 3.52 1.49 3.76c.18.24 2.55 3.9 6.18 5.47.86.37 1.53.6 2.06.76.87.27 1.66.23 2.29.14.7-.1 2.18-.89 2.49-1.75.3-.86.3-1.6.21-1.75-.09-.15-.33-.24-.7-.42z"/></svg>
    <span>Chat with us</span>
  </a>;
}
