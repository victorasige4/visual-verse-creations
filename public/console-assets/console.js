import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/+esm";
const SUPABASE_URL="https://jajkrkeaatksmleohzif.supabase.co";
const PUBLISHABLE="sb_publishable_PTHazoDBGgz9Jnjil1SyVQ_XZpvFpsG";
const baseUrl=new URL("./console-preview.html",location.href).href;
let inviteLink=location.hash.includes("type=invite");
let recovering=location.hash.includes("type=recovery");
// Keep console sessions in this tab only. Previous long-lived browser sessions must authenticate again.
const supabase=createClient(SUPABASE_URL,PUBLISHABLE,{auth:{flowType:"implicit",detectSessionInUrl:true,persistSession:true,autoRefreshToken:true,storage:window.sessionStorage,storageKey:"vv-studio-console-session-v2"}});
const $=(id)=>document.getElementById(id);
// Console appearance is local to this browser; no account or auth details are stored.
const THEME_KEY="vv-console-theme";
function applyConsoleTheme(mode,save=true){
  const next=mode==="dark"?"dark":"light";
  document.documentElement.dataset.consoleTheme=next;
  document.querySelectorAll(".console-theme-toggle").forEach(button=>{
    button.setAttribute("aria-pressed",String(next==="dark"));
    button.setAttribute("aria-label",next==="dark"?"Switch to light mode":"Switch to dark mode");
    button.title=next==="dark"?"Switch to light mode":"Switch to dark mode";
  });
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.content=next==="dark"?"#0b1720":"#003f5c";
  if(save){try{localStorage.setItem(THEME_KEY,next);}catch{}}
}
document.querySelectorAll(".console-theme-toggle").forEach(button=>{
  button.addEventListener("click",()=>applyConsoleTheme(document.documentElement.dataset.consoleTheme==="dark"?"light":"dark"));
});
applyConsoleTheme(document.documentElement.dataset.consoleTheme,false);

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
// Enforce a seven-minute inactivity limit inside this tab, including page reloads.
const IDLE_LIMIT_MS=7*60*1000;
const IDLE_STAMP_KEY="vv-studio-last-user-activity-v1";
const AUTH_SESSION_KEY="vv-studio-console-session-v2";
let idleTracking=false;
let idleSigningOut=false;
let lastIdleWrite=0;
function readLastActivity(){try{return Number(sessionStorage.getItem(IDLE_STAMP_KEY)||0);}catch{return 0;}}
function writeLastActivity(now=Date.now()){
  if(!idleTracking||now-lastIdleWrite<1000)return;
  lastIdleWrite=now;
  try{sessionStorage.setItem(IDLE_STAMP_KEY,String(now));}catch{}
}
function clearIdleTracking(){idleTracking=false;try{sessionStorage.removeItem(IDLE_STAMP_KEY);}catch{}}
function isPastIdleDeadline(now=Date.now()){
  const last=readLastActivity();
  return !last||!Number.isFinite(last)||now-last>=IDLE_LIMIT_MS||last>now+60000;
}
async function enforceIdleLogout(){
  if(idleSigningOut||!idleTracking)return;
  idleSigningOut=true;
  clearIdleTracking();
  state.user=null;state.membership=null;state.clients=[];state.projects=[];state.tasks=[];state.documents=[];state.members=[];
  $("login-password").value="";
  document.dispatchEvent(new Event("vv:unmount-upload"));
  state.uploadFiles=[];
  $("modal-overlay").hidden=true;
  $("modal-form").innerHTML="";
  showLogin("login");
  notify("Signed out after 7 minutes without activity. Please sign in again.");
  try{await supabase.auth.signOut({scope:"local"});}catch{}
  finally{try{sessionStorage.removeItem(AUTH_SESSION_KEY);}catch{}idleSigningOut=false;}
}
function startIdleTracking(){
  idleTracking=true;
  const last=readLastActivity();
  if(!last){clearIdleTracking();return false;}
  if(isPastIdleDeadline()){void enforceIdleLogout();return false;}
  return true;
}
function recordStudioActivity(){
  if(!idleTracking||$("workspace").hidden||idleSigningOut)return;
  if(isPastIdleDeadline()){void enforceIdleLogout();return;}
  if(document.visibilityState==="visible")writeLastActivity();
}
for(const eventName of ["pointerdown","keydown","touchstart","wheel"]){
  document.addEventListener(eventName,recordStudioActivity,{passive:true,capture:true});
}
document.addEventListener("visibilitychange",()=>{if(!document.hidden)recordStudioActivity();});
window.addEventListener("focus",recordStudioActivity);
setInterval(()=>{if(idleTracking&&isPastIdleDeadline())void enforceIdleLogout();},10000);
// Lightweight, accessible workspace navigation with no extra dependencies.
function setProfileMenu(open){
  const menu=$("profile-menu"),trigger=$("profile-menu-toggle");
  if(!menu||!trigger)return;
  menu.hidden=!open;
  trigger.setAttribute("aria-expanded",String(open));
}
function setNavigationDrawer(open){
  const workspace=$("workspace"),trigger=$("console-menu-toggle"),backdrop=$("console-nav-backdrop");
  if(!workspace||!trigger||!backdrop)return;
  const show=open&&!workspace.hidden;
  workspace.classList.toggle("nav-open",show);
  backdrop.hidden=!show;
  trigger.setAttribute("aria-expanded",String(show));
  trigger.setAttribute("aria-label",show?"Close navigation":"Open navigation");
}
function closeNavigationMenus(){setProfileMenu(false);setNavigationDrawer(false);}
let completingPasswordSetup=false;
function showLogin(mode="email"){
  closeNavigationMenus();
  $("workspace").hidden=true;$("auth-screen").hidden=false;
  $("setup-email-form").hidden=mode!=="email";
  $("setup-email-sent").hidden=mode!=="sent";
  $("login-form").hidden=mode!=="login";
  $("set-password-form").hidden=mode!=="password";
  $("setup-complete").hidden=mode!=="complete";
  $("mfa-login-form").hidden=mode!=="mfa";
  const headings={email:"Set up your studio access.",sent:"Check your email.",login:"Welcome back.",password:"Create your password.",complete:"Password set successfully.",mfa:"One more secure step."};
  const descriptions={
    email:"Enter the email address where you received your invitation.",
    sent:"Open the secure email link to choose and confirm your password.",
    login:"Sign in with your Visual Verse team account.",
    password:"Choose and confirm a strong password to complete your studio access.",
    complete:"Your password is saved. You can now sign in securely to your studio.",
    mfa:"Enter the six-digit code from your authenticator app."
  };
  const steps={email:"STEP 01 / YOUR EMAIL",sent:"CHECK YOUR INBOX",login:"EXISTING TEAM MEMBER",password:"STEP 02 / CREATE PASSWORD",complete:"STEP 03 / SIGN IN",mfa:"VERIFY YOUR IDENTITY"};
  $("auth-heading").textContent=headings[mode]??headings.email;
  $("auth-description").textContent=descriptions[mode]??descriptions.email;
  $("auth-step").textContent=steps[mode]??steps.email;
}
// An invitation/recovery token grants only password-setup access, not a studio session.
// Server-side RLS independently checks the Auth JWT method before returning private data.
function passwordWasEnteredForSession(session){
  try{
    const payload=session?.access_token?.split(".")[1];
    if(!payload)return false;
    const base64=payload.replace(/-/g,"+").replace(/_/g,"/");
    const jwt=JSON.parse(atob(base64.padEnd(Math.ceil(base64.length/4)*4,"=")));
    return Array.isArray(jwt.amr)&&jwt.amr.some(factor=>factor.method==="password");
  }catch{return false;}
}
async function loadSession(){
  const {data:{session},error}=await supabase.auth.getSession();
  if(error||!session){showLogin("email");return;}
  const {data:{user},error:identityError}=await supabase.auth.getUser();
  if(identityError||!user){showLogin("email");return;}
  state.user=user;
  // Auth can establish a temporary session when an invitation or recovery email is opened.
  // Require the user to create a password, then sign out and sign in with that password.
  if(inviteLink||recovering||!passwordWasEnteredForSession(session)){
    showLogin("password");
    return;
  }
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
  if(!startIdleTracking()){
    if(!idleSigningOut){await supabase.auth.signOut({scope:"local"});showLogin("login");notify("Please sign in again to open your studio.");}
    return;
  }
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
function addButton(label,what){return '<button class="btn primary" type="button" data-create="'+esc(what)+'">'+esc(label)+'</button>';}
function empty(title,copy){return '<div class="empty"><strong>'+esc(title)+'</strong>'+esc(copy)+'</div>';}
function item(title,detail,status){return '<div class="item"><div class="item-main"><strong>'+esc(title)+'</strong><small>'+esc(detail)+'</small></div>'+(status?tag(status):"")+'</div>';}
function renderOverview(){
  const now=new Date(),parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Africa/Nairobi",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);
  const p=(type)=>parts.find(x=>x.type===type)?.value??"";
  const todayIso=p("year")+"-"+p("month")+"-"+p("day");
  const today=new Intl.DateTimeFormat("en-KE",{dateStyle:"long",timeZone:"Africa/Nairobi"}).format(now);
  const hour=Number(new Intl.DateTimeFormat("en-GB",{hour:"2-digit",hour12:false,timeZone:"Africa/Nairobi"}).format(now));
  const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const active=state.projects.filter(x=>x.status==="in_progress").length;
  const todo=state.tasks.filter(x=>x.status!=="done"),done=state.tasks.length-todo.length;
  const rate=state.tasks.length?Math.round(done/state.tasks.length*100):0;
  const overdue=todo.filter(x=>x.due_date&&x.due_date.slice(0,10)<todayIso).length;
  const soon=todo.filter(x=>x.due_date).slice().sort((a,b)=>a.due_date.localeCompare(b.due_date)).slice(0,5);
  const actions=isAdmin()?'<button class="hero-action" type="button" data-create="project">+ New project</button><button class="hero-action" type="button" data-create="client">+ Add client</button>':canEdit()?'<button class="hero-action" type="button" data-create="task">+ New task</button>':"";
  return '<section class="studio-hero" aria-labelledby="studio-welcome"><div class="studio-hero-copy">'+
    '<span class="eyebrow">VISUAL VERSE / STUDIO CONSOLE</span><h2 id="studio-welcome">'+esc(greeting)+'.<br/>Let’s make it happen.</h2>'+
    '<p>Your creative headquarters. Keep projects moving, people connected, and the next big idea within reach.</p>'+
    '<div class="studio-hero-actions">'+actions+'<button class="hero-action" type="button" data-nav="projects">Explore projects</button></div></div>'+
    '<div class="studio-hero-date">'+esc(today)+'</div></section>'+
    '<div class="studio-section-label"><h3>Studio snapshot</h3><span>Based on your workspace data</span></div>'+
    '<div class="kpi-grid">'+
    '<article class="kpi"><span class="kpi-mark" aria-hidden="true"><svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><span class="name">Client relationships</span><strong>'+state.clients.length+'</strong><small>TOTAL CLIENTS</small></article>'+
    '<article class="kpi"><span class="kpi-mark" aria-hidden="true"><svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 18l6-6 4 3 6-8M15 7h5v5"/></svg></span><span class="name">Projects in motion</span><strong>'+active+'</strong><small>ACTIVE PROJECTS</small></article>'+
    '<article class="kpi"><span class="kpi-mark" aria-hidden="true"><svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></span><span class="name">On your to-do list</span><strong>'+todo.length+'</strong><small>'+esc(overdue?overdue+" OVERDUE · REVIEW":"OPEN TASKS")+'</small></article></div>'+
    '<div class="content-grid">'+
    '<section class="panel"><div class="panel-head"><h3>Recent projects</h3><button class="panel-link" type="button" data-nav="projects">View all</button></div>'+
    '<p class="panel-subtitle">The creative work on your radar</p><div class="item-list">'+
    (state.projects.length?state.projects.slice(0,5).map(x=>item(x.name,findClient(x.client_id),x.status)).join(""):empty("A fresh canvas for what comes next.","Add a client and project to get started."))+'</div></section>'+
    '<section class="panel"><div class="panel-head"><h3>Up next</h3><button class="panel-link" type="button" data-nav="tasks">All tasks</button></div>'+
    '<p class="panel-subtitle">Upcoming deadlines, in order</p><div class="item-list">'+
    (soon.length?soon.map(x=>item(x.title,findProject(x.project_id)+" · "+x.due_date,x.status)).join(""):empty("Nothing pressing right now.","Upcoming work with due dates appears here."))+'</div></section></div>'+
    '<div class="content-grid"><section class="panel"><div class="panel-head"><h3>Studio momentum</h3><span class="status">TASK PROGRESS</span></div>'+
    '<div class="studio-pulse"><div class="studio-pulse-text"><strong>'+done+' of '+state.tasks.length+' tasks completed</strong>'+
    'A clear picture of progress across the tasks you can access.'+
    '<span class="studio-quick-note">'+esc(overdue?overdue+" overdue task"+(overdue===1?"":"s")+" to review":"Ready for what’s next")+'</span></div>'+
    '<div class="studio-progress" style="--progress:'+rate+'%" role="img" aria-label="'+rate+' percent of tasks completed"><span>'+rate+'%</span><small>COMPLETE</small></div></div></section>'+
    '<section class="panel"><div class="panel-head"><h3>Your next move</h3></div>'+
    '<p class="page-copy">Every good project starts with a clear plan. Review the next task or gather files for your deliverables.</p>'+
    '<div class="studio-hero-actions"><button class="btn secondary" type="button" data-nav="tasks">Open tasks</button>'+
    '<button class="btn minimal" type="button" data-nav="documents">Project files</button></div></section></div>';
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
    name="Upload document";content=selectField("Project","project_id",options(state.projects,p=>p.name))+'<label>Choose a file (max 25 MB)</label><div id="vv-upload-mount"><input id="upload-file" type="file" required accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.ppt,.pptx,.txt,.zip" aria-label="Choose a document to upload"/></div><p class="secondary-note">Files are privately stored against the chosen project. Only authorized studio members can access them.</p>';
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
  $("modal-overlay").hidden=false;if(kind==="mfa")$("mfa-setup-qr").src=state.mfaQr;
  if(kind==="upload"){state.uploadFiles=[];document.dispatchEvent(new Event("vv:mount-upload"));}
  form.querySelector("select,input")?.focus();
}
function closeModal(){document.dispatchEvent(new Event("vv:unmount-upload"));state.uploadFiles=[];$("modal-overlay").hidden=true;$("modal-form").innerHTML="";}
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
      const file=state.uploadFiles?.[0]??$("upload-file")?.files?.[0];
      if(!file||file.size<=0||file.size>26214400)throw new Error("Please choose a document under 25 MB.");
      if(!/\.(pdf|png|jpe?g|webp|docx?|pptx?|txt|zip)$/i.test(file.name))throw new Error("That file type is not supported.");
      const path=raw.project_id+"/"+crypto.randomUUID()+"-"+file.name.replace(/[^A-Za-z0-9._-]/g,"_").slice(-100);
      const upload=await supabase.storage.from("studio-documents").upload(path,file,{upsert:false});
      if(upload.error)throw upload.error;
      const result=await supabase.from("documents").insert({
        project_id:raw.project_id,storage_path:path,file_name:file.name,
        content_type:file.type||"application/octet-stream",size_bytes:file.size,uploaded_by:state.user.id,
      });
      if(result.error){await supabase.storage.from("studio-documents").remove([path]);throw result.error;}
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
  idleTracking=true;writeLastActivity();
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
    idleTracking=true;writeLastActivity();
    await loadSession();
  }catch(error){notify(error.message||"Verification failed.");}finally{btn.disabled=false;}
});
$("mfa-logout").addEventListener("click",async()=>{await supabase.auth.signOut();showLogin();});
function openExistingLogin(){
  $("login-email").value=$("setup-email").value.trim()||$("login-email").value;
  showLogin("login");
}
$("open-login").addEventListener("click",openExistingLogin);
$("sent-login").addEventListener("click",openExistingLogin);
$("back-setup").addEventListener("click",()=>{
  $("setup-email").value=$("login-email").value.trim()||$("setup-email").value;
  showLogin("email");
});
$("return-setup").addEventListener("click",()=>showLogin("email"));
// Email delivery is rate-limited by the Auth provider, not by the browser.
// Keep the existing password and invitation flows intact; never create an account here.
const setupSubmit=$("setup-email-form").querySelector('button[type="submit"]');
const setupLabel=setupSubmit.innerHTML;
const setupFeedback=$("setup-email-feedback");
const COOLDOWN_KEY="vv-studio-email-setup-cooldown";
let emailCooldownUntil=0;
try{emailCooldownUntil=Number(sessionStorage.getItem(COOLDOWN_KEY)||0);}catch{}
function showSetupFeedback(message,kind="warning"){
  setupFeedback.textContent=message;
  setupFeedback.dataset.kind=kind;
  setupFeedback.hidden=false;
}
function renderEmailCooldown(){
  const seconds=Math.max(0,Math.ceil((emailCooldownUntil-Date.now())/1000));
  if(seconds){
    setupSubmit.disabled=true;
    const mm=Math.floor(seconds/60),ss=String(seconds%60).padStart(2,"0");
    setupSubmit.textContent="Retry available in "+mm+":"+ss;
  }else{
    setupSubmit.disabled=false;
    setupSubmit.innerHTML=setupLabel;
  }
}
function limitEmailRetries(seconds){
  emailCooldownUntil=Date.now()+seconds*1000;
  try{sessionStorage.setItem(COOLDOWN_KEY,String(emailCooldownUntil));}catch{}
  renderEmailCooldown();
}
renderEmailCooldown();
setInterval(renderEmailCooldown,1000);
$("setup-email-form").addEventListener("submit",async(e)=>{
  e.preventDefault();
  if(Date.now()<emailCooldownUntil)return;
  const email=$("setup-email").value.trim();
  if(!email)return;
  setupFeedback.hidden=true;
  setupSubmit.disabled=true;
  setupSubmit.textContent="Requesting secure email…";
  try{
    const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:baseUrl});
    if(error)throw error;
    $("login-email").value=email;
    // A successful API request may be intentionally generic for unknown emails.
    limitEmailRetries(75);
    showLogin("sent");
  }catch(error){
    const code=String(error?.code||"");
    const message=String(error?.message||"");
    if(error?.status===429||code==="over_email_send_rate_limit"||/email rate limit|too many requests/i.test(message)){
      showSetupFeedback("Supabase's email-sending limit has been reached. No new link was sent. Wait until the email quota resets (which may take about an hour), or contact the studio administrator to configure a custom SMTP email provider.");
      limitEmailRetries(300);
    }else if(code==="email_address_not_authorized"||/email address not authorized/i.test(message)){
      showSetupFeedback("Supabase's default email service only sends to authorized organization addresses. A studio administrator must configure custom SMTP before sending setup links to other teammates.");
      limitEmailRetries(90);
    }else{
      showSetupFeedback("We could not request your setup link. "+(message||"Please try again later or contact the studio administrator."));
      renderEmailCooldown();
    }
  }finally{renderEmailCooldown();}
});
$("continue-signin").addEventListener("click",()=>{
  completingPasswordSetup=false;
  $("login-email").value=$("setup-email").value.trim()||state.user?.email||$("login-email").value;
  $("login-password").value="";
  showLogin("login");
});
$("set-password-form").addEventListener("submit",async(e)=>{
  e.preventDefault();const a=$("new-password").value,b=$("confirm-password").value;
  if(a.length<12||a!==b){notify("Passwords must match and contain at least 12 characters.");return;}
  const result=await supabase.auth.updateUser({password:a});
  if(result.error){notify(result.error.message);return;}
  const registeredEmail=state.user?.email??"";
  $("login-email").value=registeredEmail||$("login-email").value;
  $("setup-email").value=registeredEmail||$("setup-email").value;
  inviteLink=false;recovering=false;history.replaceState(null,"",baseUrl);
  completingPasswordSetup=true;
  const logout=await supabase.auth.signOut();
  if(logout.error){completingPasswordSetup=false;notify("Password saved. Please sign out before signing in again.");showLogin("login");return;}
  clearIdleTracking();state.user=null;state.membership=null;
  showLogin("complete");
});
async function signOut(){clearIdleTracking();closeModal();state.user=null;state.membership=null;showLogin("login");await supabase.auth.signOut({scope:"local"});}
$("sign-out").addEventListener("click",signOut);
$("profile-sign-out").addEventListener("click",()=>{closeNavigationMenus();void signOut();});
$("profile-menu-toggle").addEventListener("click",()=>{
  const open=$("profile-menu").hidden;
  setNavigationDrawer(false);
  setProfileMenu(open);
});
$("console-menu-toggle").addEventListener("click",()=>{
  const open=!$("workspace").classList.contains("nav-open");
  setProfileMenu(false);
  setNavigationDrawer(open);
});
$("console-nav-backdrop").addEventListener("click",()=>setNavigationDrawer(false));
document.addEventListener("pointerdown",(event)=>{
  if(!$("profile-menu").hidden&&!event.target.closest("#console-profile-wrap"))setProfileMenu(false);
});
document.addEventListener("keydown",(event)=>{
  if(event.key==="Escape")closeNavigationMenus();
});
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{state.view=b.dataset.tab;render();closeNavigationMenus();window.scrollTo({top:0,behavior:"instant"});}));
$("screen-content").addEventListener("click",async(e)=>{
  const jump=e.target.closest("[data-nav]");
  if(jump){const page=jump.dataset.nav;if(["overview","clients","projects","tasks","documents","security","team"].includes(page)&&(page!=="team"||isAdmin())){state.view=page;render();window.scrollTo({top:0,behavior:"instant"});}return;}
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
document.addEventListener("vv:upload-selection",(event)=>{state.uploadFiles=Array.from(event.detail?.files??[]);});
$("modal-form").addEventListener("submit",submitModal);
$("modal-close").addEventListener("click",closeModal);
$("modal-overlay").addEventListener("click",(e)=>{if(e.target===$("modal-overlay"))closeModal();});
document.addEventListener("keydown",(e)=>{if(e.key==="Escape")closeModal();});
supabase.auth.onAuthStateChange((event)=>{
  if(event==="PASSWORD_RECOVERY")setTimeout(()=>showLogin("password"),0);
  if(event==="SIGNED_OUT"&&!completingPasswordSetup)setTimeout(()=>showLogin("login"),0);
});
loadSession().catch((err)=>{showLogin();notify("Could not load the console: "+(err?.message||"network error"));});
