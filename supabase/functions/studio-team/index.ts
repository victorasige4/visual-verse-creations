import { createClient } from "npm:@supabase/supabase-js@2.119.0";
const REDIRECT = "https://victorasige4.github.io/visual-verse-creations/console-preview.html";
const ORIGINS = new Set(["https://victorasige4.github.io","http://localhost:5173","http://127.0.0.1:5173"]);
type StudioRole = "super_admin"|"admin"|"project_manager"|"creative"|"viewer";
const roles: StudioRole[] = ["admin","project_manager","creative","viewer"];
function output(obj: unknown, status: number, origin: string|null) {
  const headers: Record<string,string> = {
    "content-type":"application/json","cache-control":"no-store","vary":"Origin",
    "access-control-allow-headers":"authorization, apikey, x-client-info, content-type",
    "access-control-allow-methods":"POST, OPTIONS",
  };
  if (origin && ORIGINS.has(origin)) headers["access-control-allow-origin"]=origin;
  return new Response(JSON.stringify(obj), {status,headers});
}
Deno.serve(async (req:Request) => {
  const origin=req.headers.get("origin");
  const fail=(error:string,status=400)=>output({ok:false,error},status,origin);
  if (origin&&!ORIGINS.has(origin)) return fail("Origin not allowed",403);
  if (req.method==="OPTIONS") return output({ok:true},200,origin);
  if (req.method!=="POST") return fail("POST required",405);
  const jwt=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"").trim();
  if (!jwt) return fail("Sign in first",401);
  const url=Deno.env.get("SUPABASE_URL");
  const secrets=Deno.env.get("SUPABASE_SECRET_KEYS");
  const key=(secrets?JSON.parse(secrets)["default"] as string:"")||Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url||!key) return fail("Server configuration unavailable",503);
  const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:identity,error:authError}=await admin.auth.getUser(jwt);
  if (authError||!identity.user?.id||!identity.user.email_confirmed_at) return fail("Verified sign-in required",401);
  const actor=identity.user.id;
  const {data:membership,error:memberError}=await admin.from("team_memberships").select("role,status").eq("user_id",actor).maybeSingle();
  if (memberError||membership?.status!=="active"||!["super_admin","admin"].includes(membership.role)) return fail("Studio administrator permission required",403);
  // The caller's JWT has already been verified with Supabase Auth above.
  // Team administration always requires a step-up TOTP-verified AAL2 session.
  let assurance = "";
  try{
    const segment=jwt.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");
    assurance=JSON.parse(atob(segment)).aal;
  }catch{return fail("Invalid authenticator session",401);}
  if(assurance!=="aal2")return fail("Verify two-factor authentication in Security before managing the team",403);
  const isOwner=membership.role==="super_admin";
  let body:Record<string,unknown>;
  try {body=await req.json()}catch{return fail("Invalid JSON")}
  const action=String(body.action??"");
  if (action==="members") {
    const [m,p,u]=await Promise.all([
      admin.from("team_memberships").select("user_id,role,status,created_at").order("created_at"),
      admin.from("profiles").select("user_id,display_name"),
      admin.auth.admin.listUsers({page:1,perPage:1000}),
    ]);
    if (m.error||p.error||u.error) return fail("Could not list the team",500);
    const names=new Map((p.data??[]).map((v)=>[v.user_id,v.display_name]));
    const emails=new Map((u.data.users??[]).map((v)=>[v.id,v.email]));
    return output({ok:true,members:(m.data??[]).map((v)=>({...v,display_name:names.get(v.user_id),email:emails.get(v.user_id)}))},200,origin);
  }
  if (action==="invite") {
    const email=String(body.email??"").toLowerCase().trim(),role=String(body.role??"") as StudioRole;
    if (email.length>250||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Invalid email address");
    if (!roles.includes(role)||(!isOwner&&role==="admin")) return fail("Role not permitted",403);
    const {data:invited,error}=await admin.auth.admin.inviteUserByEmail(email,{redirectTo:REDIRECT});
    if (error||!invited.user?.id) return fail(error?.message||"Invitation failed");
    const id=invited.user.id;
    const [profile,member]=await Promise.all([
      admin.from("profiles").upsert({user_id:id,display_name:email.split("@")[0]},{onConflict:"user_id"}),
      admin.from("team_memberships").upsert({user_id:id,role,status:"active",invited_by:actor},{onConflict:"user_id"}),
    ]);
    if (profile.error||member.error) return fail("Invitation sent; membership setup needs review",500);
    await admin.from("activity_logs").insert({actor_id:actor,action:"team.invite",entity_type:"team_membership",entity_id:id,metadata:{role}});
    return output({ok:true,message:"Invitation sent"},200,origin);
  }
  if (["change_role","suspend","reactivate"].includes(action)) {
    const id=String(body.user_id??"");
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))return fail("Invalid user id");
    const {data:target,error}=await admin.from("team_memberships").select("role,status").eq("user_id",id).maybeSingle();
    if(error||!target)return fail("Team member not found",404);
    if(id===actor||target.role==="super_admin"||(!isOwner&&target.role==="admin"))return fail("Cannot change this account",403);
    const patch: {role?:StudioRole;status?:"active"|"suspended"}={};
    if(action==="change_role"){
      const role=String(body.role??"") as StudioRole;
      if(!roles.includes(role)||(!isOwner&&role==="admin"))return fail("Role not permitted",403);
      patch.role=role;
    } else patch.status=action==="suspend"?"suspended":"active";
    const {error:updated}=await admin.from("team_memberships").update(patch).eq("user_id",id);
    if(updated)return fail("Could not update the team member",500);
    await admin.from("activity_logs").insert({actor_id:actor,action:"team."+action,entity_type:"team_membership",entity_id:id,metadata:patch});
    return output({ok:true,message:"Team member updated"},200,origin);
  }
  return fail("Unknown team action");
});
