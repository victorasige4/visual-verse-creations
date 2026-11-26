import { useRef, useState } from "react";

type Enquiry = {source:"contact"|"quote";channel:"email"|"whatsapp";name:string;email:string;subject:string;brief:string};
const endpoint="https://jajkrkeaatksmleohzif.supabase.co/functions/v1/website-enquiry";

/** Submit only after the visitor chooses a send channel. Retries reuse the ID. */
export function useWebsiteEnquiry(){
  const attempt=useRef<{signature:string;id:string;saved:boolean}|null>(null);
  const busy=useRef(false);
  const [saving,setSaving]=useState(false);
  const [feedback,setFeedback]=useState("");
  const [reference,setReference]=useState("");
  async function save(data:Enquiry,website:string){
    if(busy.current)return null;
    busy.current=true;setSaving(true);setFeedback("");
    const signature=JSON.stringify({...data,channel:undefined});
    if(attempt.current?.signature!==signature)attempt.current={signature,id:crypto.randomUUID(),saved:false};
    const current=attempt.current;
    const id=current.id;
    try{
      if(website)throw new Error("Invalid request.");
      if(!current.saved){
        const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,id,website}),signal:AbortSignal.timeout(15000)});
        const result=await response.json();
        if(!response.ok||result.saved!==true||result.id!==id)throw new Error(typeof result.error==="string"?result.error:"Could not save your enquiry.");
        current.saved=true;
      }
      const ref=id.slice(0,8).toUpperCase();
      setReference(ref);setFeedback("Request "+ref+" saved. You can now send your prepared message.");
      return ref;
    }catch(e){
      setFeedback((e instanceof Error?e.message:"Could not save your enquiry.")+" Your details are still here. Please retry, or contact us directly.");
      return null;
    }finally{busy.current=false;setSaving(false);}
  }
  return {save,saving,feedback,reference};
}
