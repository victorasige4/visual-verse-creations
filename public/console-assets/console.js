import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/+esm";
const URL="https://jajkrkeaatksmleohzif.supabase.co";
const PUBLISHABLE="sb_publishable_PTHazoDBGgz9Jnjil1SyVQ_XZpvFpsG";
const baseUrl=new URL("./console-preview.html",location.href).href;
const inviteLink=location.hash.includes("type=invite");
const recovering=location.hash.includes("type=recovery");
const supabase=createClient(URL,PUBLISHABLE,{auth:{flowType:"implicit",detectSessionInUrl:true,persistSession:true,autoRefreshToken:true,storageKey:"vv-studio-console-session"}});
const $=(id)=>document.getElementById(id);
const esc=(value)=>String(value??"").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const state={user:null,membership:null,view:"overview",clients:[],projects:[],tasks:[],documents:[],members:[]};
const nice=(s)=>String(s??"").replaceAll("_"," ").replace(/\b\w/g,(c)=>c.toUpperCase());
const isAdmin=()=>["super_admin","admin"].includes(state.membership?.role);
const canEdit=()=>["super_admin","admin","project_manager"].includes(state.membership?.role);
const canUpload=()=>["super_admin","admin","project_manager","creative"].includes(state.membership?.role);
const findProject=(id)=>state.projects.find((p)=>p.id===id)?.name??"Unassigned project";
const findClient=(id)=>state.clients.find((c)=>c.id===id)?.name??"Private client";
const tag=(value)=>'<span class="badge '+(value==="suspended"?"suspended":"")+'">'+esc(nice(value))+"</span>";
let toastTimer;
function notify(message){const el=$("notice");el.className="notice-toast";el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,6000);}
function showLogin(mode="login"){
  $("workspace").hidden=true;$("auth-screen").hidden=false;
  $("login-form").hidden=mode!=="login";$("set-password-form").hidden=mode!=="password";$("reset-form").hidden=mode!=="reset";$("mfa-login-form").hidden=mode!=="mfa";
  $("auth-heading").textContent=mode==="password"?"Secure your invitation.":mode==="reset"?"Reset your password.":mode==="mfa"?"One more secure step.":"Welcome back.";
  $("auth-description").textContent=mode==="password"?"Choose a strong password to complete your studio access.":mode==="reset"?"We'll send a recovery link to your verified email.":"Sign in with your Visual Verse team account.";
}
async function loadSession(){
  const {data:{session},error}=await supabase.auth.getSession();
  if(error||!session){showLogin();return;}
  const {data:{user},error:identityError}=await supabase.auth.getUser();
  if(identityError||!user){showLogin();return;}
  state.user=user;
  const assurance=await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if(assurance.error){showLogin();notify(assurance.error.message);return;}
  state.mfaAal=assurance.data?.currentLevel??"aal1";
  if(assurance.data?.currentLevel==="aal1"&&assurance.data?.nextLevel==="aal2"){
    showLogin("mfa");return;
  }
  const {data:member,error:memberError}=await supabase.from("team_memberships").select("role,status,user_id").eq("user_id",user.id).maybeSingle();
  if(memberError||!member||member.status!=="active"){
    await supabase.auth.signOut();showLogin();
    notify("Your account is not authorized for this workspace. Contact the Studio Console owner.");
    return;
  }
  state.membership=member;
  if(inviteLink||recovering){showLogin("password");return;}
  $("auth-screen").hidden=true;$("workspace").hidden=false;
  $("signed-in-email").textContent=user.email??"";
  $("profile-circle").textContent=(user.email??"VV").slice(0,2).toUpperCase();
  $("team-nav").hidden=!isAdmin();$("mobile-team-nav").hidden=!isAdmin();
  await refresh();
}
async function refresh(){
  const [clients,projects,tasks,documents]=await Promise.all([
    supabase.from("clients").select("id,name,email,phone,created_at").order("created_at",{ascending:false}),
    supabase.from("projects").select("id,name,client_id,status,due_date,created_at").order("created_at",{ascending:false}),
    supabase.from("tasks").select("id,title,project_id,status,due_date,assigned_to").order("created_at",{ascending:false}),
    supabase.from("documents").select("id,file_name,storage_path,project_id,created_at,size_bytes").order("created_at",{ascending:false}),
  ]);
  for(const [name,result] of [["Clients",clients],["Projects",projects],["Tasks",tasks],["Documents",documents]])if(result.error)notify(name+": "+result.error.message);
  state.clients=clients.data??[];state.projects=projects.data??[];state.tasks=tasks.data??[];state.documents=documents.data??[];
  if(isAdmin()){
    const result=await supabase.functions.invoke("studio-team",{body:{action:"members"}});
    state.members=(!result.error&&result.data?.ok)?result.data.members:[];
  }
  render();
}
function heading(kicker,title,description,button=""){return '<div class="page-heading"><div><span class="page-eyebrow">'+esc(kicker)+'</span><h1 class="page-title">'+esc(title)+'</h1><p class="page-copy">'+esc(description)+'</p></div>'+button+'</div>';}
function addButton(label,what){return '<button class="btn primary" type="button" data-create="'+esc(what)+'">'+esc(label)+' <span class="diagonal-arrow" aria-hidden="true"></span></button>';}
function empty(title,copy){return '<div class="empty"><strong>'+esc(title)+'</strong>'+esc(copy)+'</div>';}
function item(title,detail,status){return '<div class="item"><div class="item-main"><strong>'+esc(title)+'</strong><small>'+esc(detail)+'</small></div>'+(status?tag(status):"")+'</div>';}
function renderOverview(){
  const today=new Intl.DateTimeFormat("en-KE",{dateStyle:"long",timeZone:"Africa/Nairobi"}).format(new Date());
  const active=state.projects.filter((p)=>p.status==="in_progress").length;
  const soon=state.tasks.filter((t)=>t.due_date&&t.status!=="done").slice().sort((a,b)=>a.due_date.localeCompare(b.due_date)).slice(0,5);
  return heading("YOUR STUDIO AT A GLANCE","Make good work happen.","A clear view of your studio, people, projects and momentum.")+
  '<span class="page-eyebrow">'+esc(today)+'</span>'+
  '<div class="kpi-grid"><article class="kpi"><span class="name">Total clients</span><strong>'+state.clients.length+'</strong><small>YOUR NETWORK</small></article>'+
  '<article class="kpi"><span class="name">Active projects</span><strong>'+active+'</strong><small>IN PROGRESS</small></article>'+
  '<article class="kpi"><span class="name">Tasks to do</span><strong>'+state.tasks.filter(t=>t.status!=="done").length+'</strong><small>NEXT ACTIONS</small></article></div>'+
  '<div class="content-grid"><div class="panel"><h3>Recent projects</h3><div class="item-list">'+(state.projects.length?state.projects.slice(0,5).map(p=>item(p.name,findClient(p.client_id),p.status)).join(""):empty("Your next great project starts here.","Add a client and create your first project."))+'</div></div>'+
  '<div class="panel"><h3>Upcoming work</h3><div class="item-list">'+(soon.length?soon.map(t=>item(t.title,findProject(t.project_id)+" · "+t.due_date,t.status)).join(""):empty("All clear for now.","Your upcoming tasks will appear here."))+'</div></div></div>';
}
function renderClients(){
  return heading("PEOPLE WE CREATE WITH","Clients","Keep every relationship organized and close to the work.",isAdmin()?addButton("Add client","client"):"")+
    '<div class="table-card"><div class="table-row heading"><span>Client</span><span>Email</span><span>Phone</span><span></span></div>'+
    (state.clients.length?state.clients.map(c=>'<div class="table-row"><strong>'+esc(c.name)+'</strong><span>'+esc(c.email??"—")+'</span><span>'+esc(c.phone??"—")+'</span><span>'+tag("Active")+'</span></div>').join(""):empty("No clients yet.","Add a client to start planning work together."))+'</div>';
}
function renderProjects(){
  return heading("THE WORK IN MOTION","Projects","Your creative work, organized from first idea to delivery.",isAdmin()?'<div class="page-actions">'+addButton("New project","project")+addButton("Assign teammate","assign")+"</div>":"")+
  '<div class="table-card"><div class="table-row heading"><span>Project</span><span>Client</span><span>Status</span><span>Deadline</span></div>'+
  (state.projects.length?state.projects.map(p=>'<div class="table-row"><strong>'+esc(p.name)+'</strong><span>'+esc(findClient(p.client_id))+'</span><span>'+tag(p.status)+'</span><span>'+esc(p.due_date??"Not set")+'</span></div>').join(""):empty("No projects yet.","Create your first project to track its work."))+'</div>';
}
function renderTasks(){
  return heading("THE NEXT STEPS","Tasks & deadlines","Stay focused on what matters most, one task at a time.",canEdit()?addButton("New task","task"):"")+
  '<div class="table-card"><div class="table-row heading"><span>Task</span><span>Project</span><span>Status</span><span></span></div>'+
  (state.tasks.length?state.tasks.map(t=>'<div class="table-row"><strong>'+esc(t.title)+'</strong><span>'+esc(findProject(t.project_id))+'</span><span>'+tag(t.status)+'</span>'+(canEdit()?'<button type="button" data-task="'+esc(t.id)+'">'+(t.status==="done"?"Reopen":"Mark done")+'</button>':"<span></span>")+'</div>').join(""):empty("No tasks yet.","Break a project down into achievable steps."))+'</div>';
}
function renderDocuments(){
  return heading("CREATIVE FILES, SECURELY KEPT","Documents","Upload briefs, references and deliverables to protected project folders.",canUpload()?addButton("Upload document","upload"):"")+
  '<div class="table-card"><div class="table-row heading"><span>File</span><span>Project</span><span>Added</span><span></span></div>'+
  (state.documents.length?state.documents.map(d=>'<div class="table-row"><strong>'+esc(d.file_name)+'</strong><span>'+esc(findProject(d.project_id))+'</span><span>'+esc(d.created_at?.slice(0,10))+'</span><button type="button" data-download="'+esc(d.id)+'">Open file</button></div>').join(""):empty("No documents yet.","Upload a file to a project to keep your team in sync."))+'</div>'+
  '<p class="secondary-note">Private storage · Up to 25 MB per file · Access follows project assignments.</p>';
}
function renderSecurity(){
  return heading("PROTECT YOUR STUDIO","Security","Keep your studio account and client information protected.")+
   '<div class="content-grid"><div class="panel"><h3>Authenticator protection</h3><p class="page-copy">Use an authenticator app for a second verification step. Team invitations and permission changes require this extra protection.</p>'+
   '<p class="secondary-note">Current session: <strong>'+esc(state.mfaAal==="aal2"?"Two-factor verified":"Password verified")+'</strong></p>'+
   (state.mfaAal==="aal2"?'<span class="status">Two-factor authentication is active for this session.</span>':addButton("Set up authenticator","mfa"))+
   '</div><div class="panel"><h3>Private by design</h3><div class="item-list">'+
   item("Invitation-only membership","Access is assigned by a studio administrator","active")+
   item("Project-level permissions","Only assigned projects and documents are visible","active")+
   item("Private file storage","Your creative files are not publicly browsable","active")+
   '</div></div></div>';
}
function renderTeam(){
  if(!isAdmin())return empty("Restricted area","Only studio administrators can access the team directory.");
  return heading("THE PEOPLE BEHIND THE WORK","Team & access","Invite trusted collaborators and manage their studio permissions.",addButton("Invite teammate","invite"))+
  '<div class="table-card"><div class="table-row heading"><span>Member</span><span>Role</span><span>Status</span><span></span></div>'+
  (state.members.length?state.members.map(m=>'<div class="table-row"><strong>'+esc(m.email||m.display_name||m.user_id)+'</strong><span>'+esc(nice(m.role))+'</span><span>'+tag(m.status)+'</span><span>'+(m.role==="super_admin"?"Owner":'<div class="row-actions"><button type="button" data-role="'+esc(m.user_id)+'">Change role</button><button type="button" data-member="'+esc(m.user_id)+'" data-change="'+(m.status==="active"?"suspend":"reactivate")+'">'+(m.status==="active"?"Suspend":"Reactivate")+'</button></div>')+'</span></div>').join(""):empty("The studio team","Invite collaborators to build together."))+'</div>'+
  '<p class="secondary-note">Each person has individual credentials. Suspended accounts lose access to protected studio data immediately.</p>';
}
function render(){
  if($("workspace").hidden)return;
  const titles={overview:"Overview",clients:"Clients",projects:"Projects",tasks:"Tasks & deadlines",documents:"Documents",team:"Team & access",security:"Security"};
  $("page-crumb").textContent=(titles[state.view]??"Overview").toUpperCase();
  document.querySelectorAll("[data-tab]").forEach(b=>{b.classList.toggle("active",b.dataset.tab===state.view);b.setAttribute("aria-current",b.dataset.tab===state.view?"page":"false");});
  const pages={overview:renderOverview,clients:renderClients,projects:renderProjects,tasks:renderTasks,documents:renderDocuments,team:renderTeam,security:renderSecurity};
  $("screen-content").innerHTML=(pages[state.view]??renderOverview)();
}
function options(rows,mapper){return rows.map(r=>'<option value="'+esc(r.id)+'">'+esc(mapper(r))+'</option>').join("");}
function field(label,name,type="text",required=true){return '<label for="field-'+name+'">'+esc(label)+'</label><input id="field-'+name+'" name="'+name+'" type="'+type+'" '+(required?"required":"")+'/>';}
function selectField(label,name,opts){return '<label for="field-'+name+'">'+esc(label)+'</label><select id="field-'+name+'" name="'+name+'" required>'+opts+'</select>';}
function openModal(kind){
  let content="",name="";
  if(kind==="mfa"){
    if(!state.mfaPending){notify("Start authenticator setup first.");return;}
    name="Set up two-factor authentication";
    content='<p class="secondary-note">Scan this QR code with an authenticator app, or enter the setup key manually.</p>'+
      '<div class="mfa-setup"><img id="mfa-setup-qr" alt="Authenticator QR code"/><code>'+esc(state.mfaSecret||"")+'</code></div>'+
      field("Six-digit verification code","code");
  }else if(kind==="client"){
    name="Add client";content=field("Client or company name","name")+field("Email address","email","email",false)+field("Phone number","phone","tel",false);
  }else if(kind==="project"){
    if(!state.clients.length){notify("Create a client first.");return;}
    name="Create project";content=field("Project name","name")+selectField("Client","client_id",options(state.clients,c=>c.name))+field("Due date","due_date","date",false);
  }else if(kind==="task"){
    if(!state.projects.length){notify("Create a project first.");return;}
    name="Create task";content=field("Task title","title")+selectField("Project","project_id",options(state.projects,p=>p.name))+field("Due date","due_date","date",false);
  }else if(kind==="upload"){
    if(!state.projects.length){notify("Create a project first.");return;}
    name="Upload document";content=selectField("Project","project_id",options(state.projects,p=>p.name))+'<label for="upload-file">Choose a file (max 25 MB)</label><input id="upload-file" type="file" required accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.ppt,.pptx,.txt,.zip"/>';
  }else if(kind==="assign"){
    const candidates=state.members.filter(m=>m.role!=="super_admin"&&m.status==="active");
    if(!state.projects.length||!candidates.length){notify("Create a project and invite a teammate first.");return;}
    name="Assign teammate to project";
    content=selectField("Project","project_id",options(state.projects,p=>p.name))+
      selectField("Team member","user_id",candidates.map(m=>'<option value="'+esc(m.user_id)+'">'+esc(m.email||m.display_name||m.user_id)+" · "+esc(nice(m.role))+'</option>').join(""));
  }else if(kind==="role"){
    const member=state.members.find(m=>m.user_id===state.roleTarget);
    if(!member){notify("Select a teammate.");return;}
    const allowed=state.membership.role==="super_admin"?["admin","project_manager","creative","viewer"]:["project_manager","creative","viewer"];
    if(member.role==="super_admin"||(state.membership.role!=="super_admin"&&member.role==="admin")){notify("This role cannot be changed.");return;}
    name="Change team role";
    content='<p class="secondary-note">Update access for '+esc(member.email||member.display_name||"teammate")+'</p>'+
      selectField("New role","role",allowed.map(r=>'<option value="'+esc(r)+'" '+(r===member.role?"selected":"")+'>'+esc(nice(r))+'</option>').join(""));
  }else if(kind==="invite"){
    name="Invite a teammate";const allowed=state.membership.role==="super_admin"?["admin","project_manager","creative","viewer"]:["project_manager","creative","viewer"];
    content=field("Email address","email","email")+selectField("Team role","role",allowed.map(r=>'<option value="'+r+'">'+nice(r)+'</option>').join(""));
  }else return;
  $("modal-heading").textContent=name;
  const form=$("modal-form");form.innerHTML=content+'<button class="btn primary" type="submit">'+(kind==="invite"?"Send invitation":kind==="upload"?"Upload securely":"Save")+'</button>';form.dataset.kind=kind;
  $("modal-overlay").hidden=false;if(kind==="mfa")$("mfa-setup-qr").src=state.mfaQr;form.querySelector("input,select")?.focus();
}
function closeModal(){$("modal-overlay").hidden=true;$("modal-form").innerHTML="";}
async function submitModal(event){
  event.preventDefault();const form=$("modal-form"),kind=form.dataset.kind;
  const submit=form.querySelector("button[type=submit]");submit.disabled=true;
  try{
    const raw=Object.fromEntries(new FormData(form).entries());
    if(kind==="mfa"){
      const result=await supabase.auth.mfa.challengeAndVerify({factorId:state.mfaPending,code:String(raw.code??"").trim()});
      if(result.error)throw result.error;
      state.mfaPending=null;state.mfaSecret=null;state.mfaQr=null;
      closeModal();notify("Two-factor authentication enabled.");await loadSession();return;
    }else if(kind==="assign"){
      const result=await supabase.from("project_members").insert({project_id:raw.project_id,user_id:raw.user_id});
      if(result.error)throw result.error;
    }else if(kind==="role"){
      const result=await supabase.functions.invoke("studio-team",{body:{action:"change_role",user_id:state.roleTarget,role:raw.role}});
      if(result.error||!result.data?.ok)throw new Error(result.data?.error||result.error?.message||"Role update failed");
    }else if(kind==="invite"){
      const res=await supabase.functions.invoke("studio-team",{body:{action:"invite",email:raw.email,role:raw.role}});
      if(res.error||!res.data?.ok)throw new Error(res.data?.error||res.error?.message||"Invitation failed");
    }else if(kind==="upload"){
      const file=$("upload-file").files?.[0];if(!file||file.size>26214400)throw new Error("Please select a file smaller than 25 MB.");
      const path=raw.project_id+"/"+crypto.randomUUID()+"-"+file.name.replace(/[^A-Za-z0-9._-]/g,"_").slice(-100);
      const upload=await supabase.storage.from("studio-documents").upload(path,file,{upsert:false});
      if(upload.error)throw upload.error;
      const result=await supabase.from("documents").insert({
        project_id:raw.project_id,storage_path:path,file_name:file.name,
        content_type:file.type||"application/octet-stream",size_bytes:file.size,uploaded_by:state.user.id,
      });
      if(result.error)throw result.error;
    }else{
      const map={client:"clients",project:"projects",task:"tasks"};
      const table=map[kind];if(!table)throw new Error("Unknown action");
      const payload={...raw,created_by:state.user.id};
      for(const [key,value] of Object.entries(payload))if(value==="")payload[key]=null;
      
      const result=await supabase.from(table).insert(payload);
      if(result.error)throw result.error;
    }
    closeModal();notify(kind==="invite"?"Team invitation sent.":"Saved successfully.");await refresh();
  }catch(error){notify(error?.message||"Unable to save. Please try again.");}finally{submit.disabled=false;}
}
$("login-form").addEventListener("submit",async(e)=>{
  e.preventDefault();const b=e.currentTarget.querySelector("button[type=submit]");b.disabled=true;
  const email=$("login-email").value.trim(),password=$("login-password").value;
  const result=await supabase.auth.signInWithPassword({email,password});
  b.disabled=false;if(result.error){notify(result.error.message);return;}
  await loadSession();
});
$("mfa-login-form").addEventListener("submit",async(e)=>{
  e.preventDefault();const btn=e.currentTarget.querySelector("button[type=submit]");btn.disabled=true;
  try{
    const factors=await supabase.auth.mfa.listFactors();
    if(factors.error)throw factors.error;
    const factor=factors.data?.totp?.find(f=>f.status==="verified")??factors.data?.totp?.[0];
    if(!factor)throw new Error("No verified authenticator was found for this account.");
    const verified=await supabase.auth.mfa.challengeAndVerify({factorId:factor.id,code:$("mfa-login-code").value.trim()});
    if(verified.error)throw verified.error;
    await loadSession();
  }catch(error){notify(error.message||"Verification failed.");}finally{btn.disabled=false;}
});
$("mfa-logout").addEventListener("click",async()=>{await supabase.auth.signOut();showLogin();});
$("forgot-password").addEventListener("click",()=>showLogin("reset"));
$("back-login").addEventListener("click",()=>showLogin("login"));
$("reset-form").addEventListener("submit",async(e)=>{e.preventDefault();const email=$("reset-email").value.trim();const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:baseUrl});notify(error?error.message:"If the email is registered, a recovery link has been sent.");});
$("set-password-form").addEventListener("submit",async(e)=>{
  e.preventDefault();const a=$("new-password").value,b=$("confirm-password").value;
  if(a.length<12||a!==b){notify("Passwords must match and contain at least 12 characters.");return;}
  const result=await supabase.auth.updateUser({password:a});
  if(result.error){notify(result.error.message);return;}
  notify("Password secured. Welcome to the studio.");history.replaceState(null,"",baseUrl);
  $("auth-screen").hidden=true;$("workspace").hidden=false;await refresh();
});
async function signOut(){await supabase.auth.signOut();state.user=null;state.membership=null;showLogin();}
$("sign-out").addEventListener("click",signOut);
$("mobile-sign-out").addEventListener("click",signOut);
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{state.view=b.dataset.tab;render();window.scrollTo({top:0,behavior:"instant"});}));
$("screen-content").addEventListener("click",async(e)=>{
  const create=e.target.closest("[data-create]");
  if(create){
    if(create.dataset.create==="mfa"){
      const factor=await supabase.auth.mfa.enroll({factorType:"totp",friendlyName:"Visual Verse Console"});
      if(factor.error){notify(factor.error.message);return;}
      state.mfaPending=factor.data.id;state.mfaQr=factor.data.totp.qr_code;state.mfaSecret=factor.data.totp.secret;openModal("mfa");
    }else openModal(create.dataset.create);
    return;
  }
  const task=e.target.closest("[data-task]");
  if(task){const t=state.tasks.find(x=>x.id===task.dataset.task);if(!t)return;const status=t.status==="done"?"todo":"done";
    const res=await supabase.from("tasks").update({status}).eq("id",t.id);if(res.error)notify(res.error.message);else{notify("Task updated.");await refresh();}return;}
  const download=e.target.closest("[data-download]");
  if(download){const d=state.documents.find(x=>x.id===download.dataset.download);if(!d)return;
    const res=await supabase.storage.from("studio-documents").createSignedUrl(d.storage_path,60);
    if(res.error)notify(res.error.message);else window.open(res.data.signedUrl,"_blank","noopener,noreferrer");return;}
  const role=e.target.closest("[data-role]");if(role){state.roleTarget=role.dataset.role;openModal("role");return;}
  const member=e.target.closest("[data-member]");
  if(member){const action=member.dataset.change;if(!confirm(action==="suspend"?"Suspend this teammate?":"Reactivate this teammate?"))return;
    const res=await supabase.functions.invoke("studio-team",{body:{action,user_id:member.dataset.member}});
    if(res.error||!res.data?.ok)notify(res.data?.error||res.error?.message||"Update failed");else{notify("Team updated.");await refresh();}}
});
$("modal-form").addEventListener("submit",submitModal);
$("modal-close").addEventListener("click",closeModal);
$("modal-overlay").addEventListener("click",(e)=>{if(e.target===$("modal-overlay"))closeModal();});
document.addEventListener("keydown",(e)=>{if(e.key==="Escape")closeModal();});
supabase.auth.onAuthStateChange((event)=>{
  if(event==="PASSWORD_RECOVERY")setTimeout(()=>showLogin("password"),0);
  if(event==="SIGNED_OUT")setTimeout(()=>showLogin("login"),0);
});
loadSession().catch((err)=>{showLogin();notify("Could not load the console: "+(err?.message||"network error"));});
