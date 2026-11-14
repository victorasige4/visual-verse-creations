import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, FolderKanban, KeyRound, LockKeyhole, LogOut, Plus, ShieldCheck, Users, X } from "lucide-react";
import { consoleClient, consoleConfigured } from "./client";

type Member = { user_id: string; display_name: string; role: "owner" | "admin" | "member"; is_active: boolean };
type Client = { id: string; name: string; contact_email: string | null; created_at: string };
type Project = { id: string; title: string; status: string; client_id: string | null; created_at: string };
type Tab = "overview" | "clients" | "projects";
type CreateMode = "client" | "project" | null;
const client = consoleClient;
const brandMark = import.meta.env.BASE_URL + "logo-mark.png";

function readableDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

export function StudioConsole() {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [ready, setReady] = useState(!consoleConfigured);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMode, setPasswordMode] = useState(
    typeof window !== "undefined" && /type=(?:invite|recovery)/.test(window.location.hash + window.location.search)
  );
  const [tab, setTab] = useState<Tab>("overview");
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [entryName, setEntryName] = useState("");
  const [entryEmail, setEntryEmail] = useState("");
  const [projectClientId, setProjectClientId] = useState("");

  const checkMembership = useCallback(async (account: User | null) => {
    if (!client || !account) {
      setUser(null);
      setMember(null);
      setReady(true);
      return;
    }
    setUser(account);
    const { data, error: membershipError } = await client.from("console_members")
      .select("user_id,display_name,role,is_active").eq("user_id", account.id).maybeSingle();
    if (membershipError) {
      setError("Could not verify team access. Ask the console administrator to check the database configuration.");
      setMember(null);
    } else {
      setMember(data?.is_active ? data as Member : null);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!client) return;
    let active = true;
    void client.auth.getUser().then(({ data, error: authError }) => {
      if (!active) return;
      if (authError) setError("Unable to verify your session. Please sign in again.");
      void checkMembership(data.user);
    });
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY") setPasswordMode(true);
      // Defer calls into Supabase until the auth callback has exited.
      setTimeout(() => { if (active) void checkMembership(session?.user ?? null); }, 0);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [checkMembership]);

  const loadRecords = useCallback(async () => {
    if (!client || !member) return;
    setLoadingRecords(true);
    const [clientsResult, projectsResult] = await Promise.all([
      client.from("console_clients").select("id,name,contact_email,created_at").order("created_at", { ascending: false }),
      client.from("console_projects").select("id,title,status,client_id,created_at").order("created_at", { ascending: false }),
    ]);
    if (clientsResult.error || projectsResult.error) {
      setError("Your account is signed in, but business records could not be loaded.");
    } else {
      setClients(clientsResult.data as Client[]);
      setProjects(projectsResult.data as Project[]);
    }
    setLoadingRecords(false);
  }, [member]);

  useEffect(() => { void loadRecords(); }, [loadRecords]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setError(""); setNotice(""); setBusy(true);
    const { error: signInError } = await client.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) setError("Sign-in failed. Check your credentials or ask your administrator for an invitation.");
    setBusy(false);
  }

  async function requestReset() {
    if (!client || !email.trim()) { setError("Enter your email address first."); return; }
    setBusy(true); setError(""); setNotice("");
    const { error: resetError } = await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + window.location.pathname,
    });
    if (resetError) setError("Unable to send a reset link. Please try again later.");
    else setNotice("If this address belongs to an account, a password reset email has been sent.");
    setBusy(false);
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    if (newPassword.length < 12) { setError("Use at least 12 characters for your password."); return; }
    setBusy(true); setError("");
    const { error: updateError } = await client.auth.updateUser({ password: newPassword });
    if (updateError) setError("Could not update your password. The invitation link may have expired.");
    else {
      setPasswordMode(false); setNewPassword(""); setNotice("Password saved.");
      window.history.replaceState({}, "", window.location.pathname);
    }
    setBusy(false);
  }

  async function signOut() {
    if (!client) return;
    setError(""); setNotice("");
    await client.auth.signOut();
    setUser(null); setMember(null); setClients([]); setProjects([]);
  }

  async function createRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || !member || member.role === "member" || !entryName.trim() || !createMode) return;
    setBusy(true); setError("");
    const result = createMode === "client"
      ? await client.from("console_clients").insert({ name: entryName.trim(), contact_email: entryEmail.trim() || null })
      : await client.from("console_projects").insert({ title: entryName.trim(), client_id: projectClientId || null, status: "Planned" });
    if (result.error) setError("Unable to save. Verify your permissions and try again.");
    else { setCreateMode(null); setEntryName(""); setEntryEmail(""); setProjectClientId(""); await loadRecords(); }
    setBusy(false);
  }

  if (!consoleConfigured) {
    return <div className="vv-console-gate"><div className="vv-console-auth-card">
      <img className="vv-console-mark" src={brandMark} alt="Visual Verse logo" />
      <span className="vv-console-overline">VISUAL VERSE · PRIVATE WORKSPACE</span>
      <h1>Console setup in progress.</h1>
      <p>The independent sign-in interface has been prepared. An administrator must connect the private authentication project before accounts can sign in.</p>
      <div className="vv-console-note"><ShieldCheck size={20} /> Business information is not published on this page.</div>
      <a className="vv-console-text-link" href={import.meta.env.BASE_URL}>Return to Visual Verse</a>
    </div></div>;
  }

  if (!ready) return <div className="vv-console-loading" role="status">Verifying secure access…</div>;

  if (passwordMode && user) {
    return <div className="vv-console-gate"><section className="vv-console-auth-card">
      <img className="vv-console-mark" src={brandMark} alt="Visual Verse logo" />
      <span className="vv-console-overline"><KeyRound size={14} /> INVITATION / ACCOUNT RECOVERY</span>
      <h1>Create your password.</h1>
      <p>Set a private password to finish accessing the Studio Console.</p>
      <form onSubmit={updatePassword} className="vv-console-form">
        <label htmlFor="new-password">New password (12+ characters)</label>
        <input id="new-password" type="password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={12} />
        <button className="vv-console-primary" disabled={busy}>{busy ? "Saving…" : "Save password"} <ArrowRight size={18} /></button>
      </form>
      {error && <p className="vv-console-error" role="alert">{error}</p>}
    </section></div>;
  }

  if (!user) {
    return <div className="vv-console-gate">
      <div className="vv-console-brand-panel"><img src={brandMark} alt="" /><div><span>THE STUDIO, CONNECTED.</span>
        <h2>Your work.<br />Your team.<br /><em>Your space.</em></h2>
        <p>A dedicated home for Visual Verse projects and the people behind them.</p></div>
        <small>PRIVATE WORKSPACE · VISUAL VERSE CREATIONS</small>
      </div>
      <section className="vv-console-auth-card">
        <img className="vv-console-mark" src={brandMark} alt="Visual Verse logo" />
        <span className="vv-console-overline"><LockKeyhole size={15} /> TEAM ACCESS ONLY</span>
        <h1>Welcome back.</h1>
        <p>Sign in using your Visual Verse team email. New accounts are invitation-only.</p>
        <form onSubmit={signIn} className="vv-console-form">
          <label htmlFor="console-email">Email address</label>
          <input id="console-email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <label htmlFor="console-password">Password</label>
          <input id="console-password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={busy} className="vv-console-primary">{busy ? "Signing in…" : "Sign in securely"} <ArrowRight size={18} /></button>
        </form>
        <button type="button" className="vv-console-link-button" onClick={requestReset} disabled={busy}>Forgot password?</button>
        {error && <p className="vv-console-error" role="alert">{error}</p>}
        {notice && <p className="vv-console-success" role="status">{notice}</p>}
        <div className="vv-console-security"><ShieldCheck size={17} /> Restricted to invited Visual Verse team members.</div>
      </section>
    </div>;
  }

  if (!member) return <div className="vv-console-gate"><section className="vv-console-auth-card">
    <img className="vv-console-mark" src={brandMark} alt="Visual Verse logo" />
    <span className="vv-console-overline"><LockKeyhole size={15} /> ACCESS RESTRICTED</span>
    <h1>Permission required.</h1>
    <p>Your email is signed in, but it hasn't been granted an active Visual Verse team membership. Contact the console administrator for access.</p>
    {error && <p className="vv-console-error" role="alert">{error}</p>}
    <button className="vv-console-primary" onClick={signOut}>Sign out <LogOut size={18} /></button>
  </section></div>;

  const canEdit = member.role !== "member";
  return <div className="vv-console-shell">
    <aside className="vv-console-sidebar">
      <div className="vv-console-sidebar-head"><img src={brandMark} alt="" /><div><strong>Visual Verse</strong><small>STUDIO CONSOLE</small></div></div>
      <span className="vv-console-menu-label">WORKSPACE</span>
      <nav aria-label="Studio sections">
        <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}><BriefcaseBusiness size={19} /> Overview</button>
        <button className={tab === "clients" ? "active" : ""} onClick={() => setTab("clients")}><Users size={19} /> Clients</button>
        <button className={tab === "projects" ? "active" : ""} onClick={() => setTab("projects")}><FolderKanban size={19} /> Projects</button>
      </nav>
      <div className="vv-console-sidebar-foot"><div className="vv-console-member-badge"><span>{(member.display_name || user.email || "VV").slice(0,1).toUpperCase()}</span><div><strong>{member.display_name || user.email}</strong><small>{member.role} · signed in</small></div></div>
        <button onClick={signOut}><LogOut size={16} /> Sign out</button>
      </div>
    </aside>
    <main className="vv-console-main">
      <div className="vv-console-topline"><span><ShieldCheck size={16} /> PRIVATE TEAM WORKSPACE</span><span>{member.role.toUpperCase()} ACCESS</span></div>
      <header className="vv-console-main-head"><div><span className="vv-console-overline">VISUAL VERSE / STUDIO</span><h1>{tab === "overview" ? "Studio overview." : tab === "clients" ? "Our clients." : "Our projects."}</h1>
        <p>{tab === "overview" ? "Your work, thoughtfully organised." : tab === "clients" ? "Keep your client relationships in one secure place." : "Track the creative work that moves your studio forward."}</p></div>
        {canEdit && tab !== "overview" && <button className="vv-console-primary vv-console-add" onClick={() => { setCreateMode(tab === "clients" ? "client" : "project"); setError(""); }}>
          <Plus size={18} /> {tab === "clients" ? "New client" : "New project"}</button>}
      </header>
      {error && <p className="vv-console-error" role="alert">{error}</p>}
      {tab === "overview" && <>
        <div className="vv-console-stats">
          <article><span>CLIENTS</span><strong>{loadingRecords ? "…" : clients.length}</strong><small>Registered in the console</small></article>
          <article><span>PROJECTS</span><strong>{loadingRecords ? "…" : projects.length}</strong><small>Across all statuses</small></article>
          <article><span>ACTIVE PROJECTS</span><strong>{loadingRecords ? "…" : projects.filter(p => p.status === "In progress").length}</strong><small>Currently being worked on</small></article>
        </div>
        <section className="vv-console-panel"><div className="vv-console-panel-head"><div><span className="vv-console-overline">LATEST WORK</span><h2>Recent projects</h2></div><button onClick={() => setTab("projects")}>View all <ArrowRight size={16} /></button></div>
          {projects.length ? <div className="vv-console-rows">{projects.slice(0,5).map(p => <div className="vv-console-data-row" key={p.id}><strong>{p.title}</strong><span>{p.status}</span><small>{readableDate(p.created_at)}</small></div>)}</div> : <div className="vv-console-empty">No projects have been added yet. Existing ChatGPT workspace data has not been migrated.</div>}
        </section>
      </>}
      {tab === "clients" && <section className="vv-console-panel">
        <div className="vv-console-panel-head"><h2>Client directory</h2><span>{clients.length} total</span></div>
        {clients.length ? <div className="vv-console-rows">{clients.map(c => <div className="vv-console-data-row" key={c.id}><strong>{c.name}</strong><span>{c.contact_email || "No email added"}</span><small>{readableDate(c.created_at)}</small></div>)}</div> : <div className="vv-console-empty">No clients yet. Start with a new client when your data is ready.</div>}
      </section>}
      {tab === "projects" && <section className="vv-console-panel">
        <div className="vv-console-panel-head"><h2>Project board</h2><span>{projects.length} total</span></div>
        {projects.length ? <div className="vv-console-rows">{projects.map(p => <div className="vv-console-data-row" key={p.id}><strong>{p.title}</strong><span className="vv-console-pill">{p.status}</span><small>{readableDate(p.created_at)}</small></div>)}</div> : <div className="vv-console-empty">No projects yet. Your previous workspace is untouched.</div>}
      </section>}
      <footer className="vv-console-footer"><CheckCircle2 size={15} /> Signed-in access is checked against your team membership. Records are protected by database access policies.</footer>
    </main>
    {createMode && <div className="vv-console-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setCreateMode(null); }}>
      <div className="vv-console-modal" role="dialog" aria-modal="true" aria-labelledby="vv-create-title">
        <button className="vv-console-close" aria-label="Close" onClick={() => setCreateMode(null)}><X size={20} /></button>
        <span className="vv-console-overline">STUDIO CONSOLE</span><h2 id="vv-create-title">New {createMode}.</h2>
        <form className="vv-console-form" onSubmit={createRecord}>
          <label htmlFor="entry-name">{createMode === "client" ? "Client name" : "Project title"}</label>
          <input id="entry-name" value={entryName} onChange={e => setEntryName(e.target.value)} required autoFocus />
          {createMode === "client" ? <><label htmlFor="entry-email">Contact email (optional)</label><input id="entry-email" type="email" value={entryEmail} onChange={e => setEntryEmail(e.target.value)} /></>
            : <><label htmlFor="project-client">Client (optional)</label><select id="project-client" value={projectClientId} onChange={e => setProjectClientId(e.target.value)}><option value="">No client assigned</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></>}
          <button className="vv-console-primary" disabled={busy}>{busy ? "Saving…" : "Save " + createMode} <ArrowRight size={18} /></button>
        </form>
        {error && <p className="vv-console-error" role="alert">{error}</p>}
      </div>
    </div>}
  </div>;
}
