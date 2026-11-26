const origins=new Set(["https://victorasige4.github.io"]);
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get("origin")||"";
 const headers={"Content-Type":"application/json","Vary":"Origin","Access-Control-Allow-Origin":origins.has(origin)?origin:"null","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"content-type, apikey, authorization"};
 const reply=(status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers});
 if(!origins.has(origin))return reply(403,{error:"Origin not permitted"});
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="POST")return reply(405,{error:"Method not permitted"});
 try{
  if(!req.headers.get("content-type")?.startsWith("application/json"))return reply(415,{error:"JSON required"});
  const reader=req.body?.getReader();if(!reader)return reply(400,{error:"Missing request"});
  const decoder=new TextDecoder();let raw="",size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>24000){await reader.cancel();return reply(413,{error:"Request too large"});}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();
  const b=JSON.parse(raw);
  if(!b||typeof b!=="object"||Array.isArray(b))return reply(400,{error:"Invalid request"});
  const val=(key:string)=>typeof b[key]==="string"?b[key].trim():"";
  const id=val("id"),source=val("source"),channel=val("channel"),name=val("name"),email=val("email"),subject=val("subject"),brief=val("brief");
  if(val("website"))return reply(400,{error:"Invalid request"});
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)||!["contact","quote"].includes(source)||!["email","whatsapp"].includes(channel)||name.length<2||name.length>100||email.length>200||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||subject.length<3||subject.length>240||brief.length<10||brief.length>6000)return reply(400,{error:"Please check your enquiry details."});
  const key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),url=Deno.env.get("SUPABASE_URL");
  if(!key||!url)return reply(503,{error:"Request service unavailable"});
  const result=await fetch(url+"/rest/v1/rpc/capture_website_request",{method:"POST",headers:{"Content-Type":"application/json",apikey:key,Authorization:"Bearer "+key},body:JSON.stringify({p_id:id,p_source:source,p_channel:channel,p_name:name,p_email:email,p_subject:subject,p_brief:brief})});
  if(!result.ok)return reply(503,{error:"Could not save your request. Please retry."});
  if(await result.json()==="limited")return reply(429,{error:"Too many requests. Please try later or contact us directly."});
  return reply(200,{saved:true,id});
 }catch{return reply(400,{error:"Could not process your request."});}
});