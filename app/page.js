"use client";
import { useState, useEffect, useCallback } from "react";

const REFRESH = 60000;

const TRUST_STYLES = {
  ally:    { bg: "#dcfce7", text: "#15803d", border: "#16a34a" },
  warm:    { bg: "#dbeafe", text: "#1d4ed8", border: "#2563eb" },
  neutral: { bg: "#f1f5f9", text: "#475569", border: "#64748b" },
  guarded: { bg: "#ffedd5", text: "#c2410c", border: "#ea580c" },
  cold:    { bg: "#fee2e2", text: "#b91c1c", border: "#dc2626" },
};

const ACCOUNT_COLORS = { A: "#6366f1", B: "#0ea5e9" };

const STATIC_INTEL = {
  A: {
    moves: [
      { rank:1, action:"Reply to Karen Mbeki ticket — confirm training dates and support lead for 5 December public event", owner:"Kusumanjali", by:"This week", deal:"a_priority_support + a_training" },
      { rank:2, action:"Identify Rhys Calder successor before January and brief them on every open relationship", owner:"Kusumanjali + Achal Negi", by:"Before January 2027", deal:"a_renewal" },
      { rank:3, action:"Bring Ewan Brooks helicopter vs drone cost comparison from Karen real flight data", owner:"Kusumanjali", by:"This week", deal:"a_extra_docks" },
    ],
    risks: [
      { title:"Rhys Calder leaving January", detail:"Only contact on record. No successor named. Every deal passes through him alone.", by:"January 2027", level:"Critical", source:"Signal 17-Nov · rhys_calder" },
      { title:"Karen Mbeki ticket unanswered", detail:"Needs training dates and dock support lead confirmed before 5 December public event. No reply sent.", by:"This week", level:"Critical", source:"Signal 18-Nov · karen_mbeki" },
      { title:"Ewan Brooks trust not rebuilt", detail:"Metro Central CFO wary after three declined offers. $180K stalled until he sees real numbers.", by:"Next budget round", level:"High", source:"Relationship: guarded · ewan_brooks" },
      { title:"Tarn Valley docks idle since May", detail:"FlytBase support never replied to Fatima data-flow request. Engineering committed but pack never sent.", by:"Pending SRV delivery", level:"High", source:"fo_dpia_2 · pj_ticket" },
    ],
    gaps: [
      { question:"Who replaces Rhys Calder?", matters:"Every open deal goes through him. Without successor, renewal and tender work stops.", ask:"Rhys Calder — before January" },
      { question:"What does Ewan finance director need to approve Metro Central docks?", matters:"$180K offer requires knowing finance director requirements beyond just Ewan.", ask:"Ewan Brooks" },
      { question:"Has engineering sent the data-flow pack to Fatima Osei?", matters:"Fatima will sign DPIA same day it arrives. Tarn Valley + Norwold blocked until then.", ask:"Pranjal Suyal / SRV · fact: srv_dataflow" },
      { question:"Who funds and staffs the 30-dock stadium plan?", matters:"Rhys investigating before Friday board. No staffing plan exists. Quote cannot be given without this.", ask:"Rhys Calder + Karen Mbeki" },
    ],
  },
  B: {
    moves: [
      { rank:1, action:"Investigate why three most active docks stopped flying — raise support ticket with Pranjal and inform Stefan", owner:"Kusumanjali + Pranjal Suyal", by:"Today", deal:"b_renewal + b_insurance" },
      { rank:2, action:"Send Owen Fitch dock ports and services list so he can file network exceptions before segmentation", owner:"Kusumanjali + Owen Fitch", by:"Within 4 months", deal:"b_idle · fact: of_seg_2" },
      { rank:3, action:"Document Stefan deputy rollout knowledge before he leaves — arrange session with Pranjal", owner:"Kusumanjali + Stefan Roy", by:"Before deputy leaves", deal:"b_sister · fact: sr_repl_2" },
    ],
    risks: [
      { title:"Three docks stopped flying — no ticket raised", detail:"Three most active docks: zero flights last two weeks. All online. No one at Aldermoor has noticed.", by:"Investigate today", level:"Critical", source:"Signal 30-Nov · Account B" },
      { title:"Network segmentation cuts all docks offline", detail:"Owen Fitch IT project starts in four months. Without exceptions filed now, all 14 docks go dark. Plant 3 first.", by:"4 months", level:"Critical", source:"of_seg_2 · network_plan (verified)" },
      { title:"Deputy leaving — rollout knowledge undocumented", detail:"Stefan deputy set up every plant that flies. Nothing written down. Leaves soon.", by:"Before departure", level:"High", source:"sr_repl_2 · ba_deputy_0" },
      { title:"Insurance review in 5 months", detail:"Insurer reviews discount in 5 months. Idle docks put the 180K saving at risk. Consistent logs needed.", by:"5 months", level:"High", source:"jt_review_2 · insurer_premium_letter (verified)" },
    ],
    gaps: [
      { question:"Why did three docks stop flying in the last two weeks?", matters:"Insurance discount depends on consistent flight logs. Churn signal if unresolved.", ask:"Pranjal Suyal (tickets) + Stefan Roy" },
      { question:"Has Owen Fitch received the ports and services list?", matters:"We committed to providing it. Without it Owen cannot file exceptions and all docks go offline.", ask:"Owen Fitch · fact: of_offer_3" },
      { question:"Who is the sister company security director?", matters:"Stefan described an old colleague who decides. Never introduced. $1.2M depends on them.", ask:"Stefan Roy" },
      { question:"Are the three guard contract renewals tracking drone savings?", matters:"Three contracts renew in four months. First chance to book verified savings into finance.", ask:"Nadia Rahman · fact: nr_evidence_2" },
    ],
  },
};

const LEVEL_STYLES = {
  Critical: { bg:"#fee2e2", text:"#b91c1c", border:"#ef4444", left:"#ef4444" },
  High:     { bg:"#ffedd5", text:"#c2410c", border:"#f97316", left:"#f97316" },
  Medium:   { bg:"#fefce8", text:"#854d0e", border:"#eab308", left:"#eab308" },
};

function TrustTag({ trust }) {
  const s = TRUST_STYLES[trust?.toLowerCase()] || TRUST_STYLES.neutral;
  return <span style={{ background:s.bg, color:s.text, border:`1.5px solid ${s.border}`, padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:700, textTransform:"capitalize" }}>{trust}</span>;
}

function LevelTag({ level }) {
  const s = LEVEL_STYLES[level] || LEVEL_STYLES.Medium;
  return <span style={{ background:s.bg, color:s.text, border:`1.5px solid ${s.border}`, padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:700 }}>{level}</span>;
}

function AccountPanel({ account, signals }) {
  const [tab, setTab] = useState("Overview");
  if (!account) return null;

  const intel = STATIC_INTEL[account.id] || STATIC_INTEL.A;
  const color = ACCOUNT_COLORS[account.id] || "#6366f1";
  const acctSignals = signals.filter(s => s.account === account.id);

  const offers = account.offers || [];
  const opportunities = account.opportunities || [];
  const stakeholders = account.stakeholders || [];
  const facts = account.facts || [];
  const files = account.files || [];
  const deadlines = account.deadlines || [];

  const wonOffers = offers.filter(o => o.status === "won");
  const declinedOffers = offers.filter(o => o.status === "declined");
  const totalClosed = wonOffers.reduce((s, o) => s + (o.value || 0), 0);

  const verifiedFacts = facts.filter(f => f.status === "verified");
  const toldFacts = facts.filter(f => f.status === "told");
  const claimFacts = facts.filter(f => f.status === "claim");

  const tabs = ["Overview", "People", "Deals", "Facts", "Risks", "Gaps"];

  return (
    <div style={{ background:"white", borderRadius:16, border:"1px solid #e2e8f0", overflow:"hidden", marginBottom:28, boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
      
      {/* Header */}
      <div style={{ background:color, padding:"20px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:"white" }}>{account.name}</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", marginTop:3 }}>{account.official_story}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:28, fontWeight:900, color:"white" }}>${totalClosed.toLocaleString()}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>closed · source: API offers[status=won]</div>
        </div>
      </div>

      {/* Signal bar */}
      {acctSignals.length > 0 && (
        <div style={{ background:"#fef2f2", borderBottom:"2px solid #ef4444", padding:"10px 28px", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#ef4444", flexShrink:0 }} />
          <span style={{ fontSize:13, fontWeight:700, color:"#b91c1c" }}>Action needed — </span>
          {acctSignals.map((s,i) => <span key={i} style={{ fontSize:13, color:"#7f1d1d" }}>{s.summary||s.title||s.text}</span>)}
        </div>
      )}

      {/* Deadlines */}
      {deadlines.length > 0 && (
        <div style={{ background:"#fefce8", borderBottom:"2px solid #eab308", padding:"8px 28px" }}>
          {deadlines.map((d,i) => (
            <span key={i} style={{ fontSize:12, fontWeight:600, color:"#854d0e" }}>Deadline: {d.text}</span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", borderBottom:"1px solid #f1f5f9" }}>
        {[
          { label:"Closed", val:`$${totalClosed.toLocaleString()}`, bg:"#f0fdf4", color:"#15803d", border:"#bbf7d0" },
          { label:"Opportunities", val:opportunities.length, bg:"#eff6ff", color:"#1d4ed8", border:"#bfdbfe" },
          { label:"Verified facts", val:verifiedFacts.length, bg:"#f5f3ff", color:"#6d28d9", border:"#c4b5fd" },
          { label:"Files", val:files.length, bg:"#fefce8", color:"#854d0e", border:"#fef08a" },
          { label:"Critical risks", val:intel.risks.filter(r=>r.level==="Critical").length, bg:"#fef2f2", color:"#b91c1c", border:"#fecaca" },
        ].map((s,i) => (
          <div key={i} style={{ padding:"12px 16px", background:s.bg, borderRight:i<4?`1px solid ${s.border}`:"none" }}>
            <div style={{ fontSize:10, fontWeight:700, color:s.color, textTransform:"uppercase", letterSpacing:"0.07em" }}>{s.label}</div>
            <div style={{ fontSize:20, fontWeight:800, color:s.color, marginTop:2 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"2px solid #f1f5f9", paddingLeft:28 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:"12px 16px", border:"none",
            borderBottom: tab===t ? `3px solid ${color}` : "3px solid transparent",
            background:"none", cursor:"pointer",
            fontSize:13, fontWeight: tab===t ? 700 : 500,
            color: tab===t ? color : "#64748b",
            marginBottom:-2,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding:28 }}>

        {/* OVERVIEW */}
        {tab==="Overview" && (
          <div>
            {/* Q1 */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Q1 — What is the book worth?</div>
              <div style={{ border:"1px solid #e2e8f0", borderRadius:10, overflow:"hidden" }}>
                {wonOffers.map((o,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background: i%2===0?"#f8fafc":"white", borderBottom: i<wonOffers.length-1?"1px solid #f1f5f9":"none" }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#0f172a" }}>{o.title}</div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>
                        Source: <span style={{ color:color, fontWeight:700, fontFamily:"monospace" }}>{o.id}</span> · pitched to: {o.pitch_to} · status: {o.status}
                      </div>
                    </div>
                    <div style={{ fontSize:16, fontWeight:800, color:"#15803d", background:"#dcfce7", padding:"4px 12px", borderRadius:8, marginLeft:20, flexShrink:0 }}>${o.value.toLocaleString()}</div>
                  </div>
                ))}
                {declinedOffers.map((o,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"#fef2f2", borderTop:"1px solid #fecaca" }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#94a3b8" }}>{o.title} <span style={{ fontSize:11, color:"#ef4444" }}>declined</span></div>
                      <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>Source: <span style={{ fontFamily:"monospace" }}>{o.id}</span> · {o.pitch_to}</div>
                    </div>
                    <div style={{ fontSize:14, color:"#94a3b8", marginLeft:20 }}>${o.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div>
              <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Q3 — What do you do first?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {intel.moves.map((m,i) => (
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:14 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:color, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, flexShrink:0 }}>{m.rank}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#0f172a", lineHeight:1.5 }}>{m.action}</div>
                      <div style={{ display:"flex", gap:8, marginTop:6, flexWrap:"wrap" }}>
                        <span style={{ fontSize:12, color:"white", background:"#475569", padding:"2px 8px", borderRadius:6, fontWeight:600 }}>{m.owner}</span>
                        <span style={{ fontSize:12, color:"white", background:color, padding:"2px 8px", borderRadius:6, fontWeight:600 }}>By: {m.by}</span>
                        <span style={{ fontSize:12, color:"#0f172a", background:"#fef9c3", padding:"2px 8px", borderRadius:6, fontWeight:600, fontFamily:"monospace" }}>{m.deal}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PEOPLE */}
        {tab==="People" && (
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Q2 — Who holds the power?</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
              {stakeholders.map((p,i) => (
                <div key={i} style={{ border:"2px solid #e2e8f0", borderRadius:12, padding:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>{p.name}</div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{p.role}</div>
                    </div>
                    <TrustTag trust={p.relationship} />
                  </div>
                  <div style={{ fontSize:11, color:"#94a3b8", fontFamily:"monospace" }}>ID: {p.id}</div>
                  <div style={{ fontSize:11, color:p.available?"#15803d":"#b91c1c", marginTop:4, fontWeight:600 }}>
                    {p.available ? "Available" : "Unavailable"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEALS */}
        {tab==="Deals" && (
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:"#15803d", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, background:"#dcfce7", display:"inline-block", padding:"3px 10px", borderRadius:6 }}>Closed (offers won)</div>
            {wonOffers.map((o,i) => (
              <div key={i} style={{ padding:"12px 16px", background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:10, marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div style={{ fontSize:14, fontWeight:600, color:"#0f172a" }}>{o.title}</div>
                  <div style={{ fontSize:16, fontWeight:800, color:"#15803d" }}>${o.value.toLocaleString()}</div>
                </div>
                <div style={{ fontSize:12, color:"#16a34a", marginTop:4 }}>ID: <span style={{ fontFamily:"monospace" }}>{o.id}</span> · {o.pitch_to}</div>
              </div>
            ))}

            <div style={{ fontSize:11, fontWeight:800, color:"#1d4ed8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, marginTop:20, background:"#dbeafe", display:"inline-block", padding:"3px 10px", borderRadius:6 }}>Opportunities (pipeline)</div>
            {opportunities.map((o,i) => (
              <div key={i} style={{ padding:"12px 16px", background:"#eff6ff", border:"1.5px solid #bfdbfe", borderRadius:10, marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div style={{ fontSize:14, fontWeight:600, color:"#1d4ed8" }}>{o.title}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#1d4ed8" }}>up to ${(o.worth_up_to||0).toLocaleString()}</div>
                </div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>Stage: {o.stage} · ID: <span style={{ fontFamily:"monospace" }}>{o.id}</span></div>
                {o.blocker && <div style={{ fontSize:12, color:"#dc2626", marginTop:4, fontWeight:500 }}>Blocker: {o.blocker.text}</div>}
                {o.deadline && <div style={{ fontSize:12, color:"#b45309", marginTop:4, fontWeight:600 }}>Deadline: {o.deadline.text}</div>}
              </div>
            ))}
          </div>
        )}

        {/* FACTS */}
        {tab==="Facts" && (
          <div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#6d28d9", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, background:"#f5f3ff", display:"inline-block", padding:"3px 10px", borderRadius:6 }}>Verified ({verifiedFacts.length})</div>
              {verifiedFacts.map((f,i) => (
                <div key={i} style={{ padding:"10px 14px", background:"#f5f3ff", border:"1.5px solid #c4b5fd", borderRadius:8, marginBottom:8 }}>
                  <div style={{ fontSize:13, color:"#4c1d95", fontWeight:500 }}>{f.text}</div>
                  <div style={{ fontSize:11, color:"#7c3aed", marginTop:4 }}>ID: <span style={{ fontFamily:"monospace" }}>{f.id}</span> · {f.said_by} · verified by: <span style={{ fontFamily:"monospace" }}>{f.verified_by}</span></div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#1d4ed8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, background:"#dbeafe", display:"inline-block", padding:"3px 10px", borderRadius:6 }}>Told ({toldFacts.length})</div>
              {toldFacts.map((f,i) => (
                <div key={i} style={{ padding:"10px 14px", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, marginBottom:6 }}>
                  <div style={{ fontSize:13, color:"#1e293b" }}>{f.text}</div>
                  <div style={{ fontSize:11, color:"#94a3b8", marginTop:3 }}>ID: <span style={{ fontFamily:"monospace" }}>{f.id}</span> · {f.said_by}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:800, color:"#854d0e", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, background:"#fefce8", display:"inline-block", padding:"3px 10px", borderRadius:6 }}>Claims — unverified ({claimFacts.length})</div>
              {claimFacts.map((f,i) => (
                <div key={i} style={{ padding:"10px 14px", background:"#fefce8", border:"1px solid #fef08a", borderRadius:8, marginBottom:6 }}>
                  <div style={{ fontSize:13, color:"#78350f" }}>{f.text}</div>
                  <div style={{ fontSize:11, color:"#92400e", marginTop:3 }}>ID: <span style={{ fontFamily:"monospace" }}>{f.id}</span> · {f.said_by} · unverified claim</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISKS */}
        {tab==="Risks" && (
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Q4 — What is about to go wrong?</div>
            {intel.risks.map((r,i) => {
              const s = LEVEL_STYLES[r.level] || LEVEL_STYLES.Medium;
              return (
                <div key={i} style={{ background:s.bg, border:`2px solid ${s.border}`, borderLeft:`5px solid ${s.left}`, borderRadius:10, padding:16, marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#0f172a" }}>{r.title}</div>
                    <LevelTag level={r.level} />
                  </div>
                  <div style={{ fontSize:13, color:"#374151", lineHeight:1.6 }}>{r.detail}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, flexWrap:"wrap", gap:6 }}>
                    <span style={{ fontSize:12, color:"#64748b", fontFamily:"monospace" }}>Source: {r.source}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:s.text, background:"white", padding:"2px 10px", borderRadius:6, border:`1px solid ${s.border}` }}>By: {r.by}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GAPS */}
        {tab==="Gaps" && (
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Q5 — What do you still not know?</div>
            {intel.gaps.map((g,i) => (
              <div key={i} style={{ background:"#faf5ff", border:"2px solid #c084fc", borderLeft:"5px solid #9333ea", borderRadius:10, padding:16, marginBottom:12 }}>
                <div style={{ fontSize:15, fontWeight:700, color:"#6b21a8", marginBottom:6 }}>{g.question}</div>
                <div style={{ fontSize:13, color:"#374151", lineHeight:1.6, marginBottom:8 }}>Why it matters: {g.matters}</div>
                <span style={{ fontSize:12, fontWeight:700, color:"white", background:"#9333ea", padding:"3px 10px", borderRadius:6 }}>Ask: {g.ask}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [signals, setSignals] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [noteAccount, setNoteAccount] = useState("A");
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteMsg, setNoteMsg] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      const [dRes, sRes] = await Promise.all([
        fetch("/api/data"),
        fetch("/api/signals"),
      ]);
      const dJson = await dRes.json();
      const sJson = await sRes.json();
      if (dJson.success) setData(dJson.data);
      else setError(dJson.error);
      if (sJson.success) setSignals(Array.isArray(sJson.data) ? sJson.data : sJson.data?.signals || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => {
    fetchAll();
    const t = setInterval(fetchAll, REFRESH);
    return () => clearInterval(t);
  }, [fetchAll]);

  async function saveNote() {
    if (!noteText.trim()) return;
    setNoteSaving(true);
    try {
      const res = await fetch("/api/notes", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ account:noteAccount, kind:"next_step", text:noteText }),
      });
      const j = await res.json();
      if (j.success) { setNoteMsg("Saved."); setNoteText(""); }
      else setNoteMsg("Error: " + (j.error||"Failed"));
    } catch(e) { setNoteMsg("Error: "+e.message); }
    setNoteSaving(false);
    setTimeout(() => setNoteMsg(""), 3000);
  }

  const accounts = data?.accounts || [];
  const files = data?.files || [];
  const totalClosed = accounts.reduce((s,a) =>
    s + (a.offers||[]).filter(o=>o.status==="won").reduce((x,o)=>x+(o.value||0),0), 0);

  return (
    <div style={{ minHeight:"100vh", background:"#f1f5f9", fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      {/* Nav */}
      <div style={{ background:"#0f172a", padding:"0 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", height:56 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <span style={{ fontSize:16, fontWeight:800, color:"white" }}>FlytBase CRM</span>
            <span style={{ fontSize:12, color:"#94a3b8", background:"#1e293b", padding:"3px 10px", borderRadius:20 }}>Kusumanjali · Questathon 2026 · Live via MCP</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            {signals.length > 0 && (
              <span style={{ fontSize:12, fontWeight:700, color:"#fca5a5", background:"#7f1d1d", padding:"3px 10px", borderRadius:20 }}>
                {signals.length} new signal{signals.length>1?"s":""}
              </span>
            )}
            <span style={{ fontSize:12, color:"#64748b" }}>{lastUpdated ? `Updated ${lastUpdated}` : "Loading..."}</span>
            <span style={{ fontSize:16, fontWeight:800, color:"#34d399" }}>${totalClosed.toLocaleString()} closed</span>
          </div>
        </div>
      </div>

      {/* Global signal bar */}
      {signals.length > 0 && (
        <div style={{ background:"#fef2f2", borderBottom:"2px solid #ef4444", padding:"10px 32px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", fontSize:13, color:"#7f1d1d" }}>
            <strong>Live signals ({signals.length}) — </strong>
            {signals.map(s => s.summary||s.title||s.text||"").join(" · ")}
          </div>
        </div>
      )}

      <div style={{ maxWidth:1100, margin:"28px auto", padding:"0 24px" }}>
        {error && (
          <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:10, padding:14, marginBottom:20, color:"#b91c1c", fontSize:13 }}>
            API error: {error}
          </div>
        )}

        {/* Accounts from live API */}
        {accounts.map((acc,i) => (
          <AccountPanel key={i} account={{
            ...acc,
            files: files.filter(f => f.account === acc.id)
          }} signals={signals} />
        ))}

        {/* Files section */}
        {files.length > 0 && (
          <div style={{ background:"white", border:"1px solid #e2e8f0", borderRadius:12, padding:20, marginBottom:24 }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Data room files</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:8 }}>
              {files.map((f,i) => (
                <div key={i} style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>{f.title}</div>
                  <div style={{ fontSize:11, color:"#94a3b8", fontFamily:"monospace", marginTop:3 }}>ID: {f.id} · Account {f.account}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div style={{ background:"white", border:"2px solid #e2e8f0", borderRadius:12, padding:20, marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Write a note to MCP</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <select value={noteAccount} onChange={e=>setNoteAccount(e.target.value)}
              style={{ padding:"9px 14px", borderRadius:8, border:"2px solid #e2e8f0", fontSize:13, fontWeight:600, color:"#374151", background:"white" }}>
              <option value="A">Account A — Police Alliance</option>
              <option value="B">Account B — Aldermoor</option>
            </select>
            <input value={noteText} onChange={e=>setNoteText(e.target.value)}
              placeholder="Next step, risk or action..."
              style={{ flex:1, padding:"9px 14px", borderRadius:8, border:"2px solid #e2e8f0", fontSize:13, minWidth:200 }}
              onKeyDown={e=>e.key==="Enter"&&saveNote()} />
            <button onClick={saveNote} disabled={noteSaving}
              style={{ padding:"9px 20px", background:"#0f172a", color:"white", border:"none", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13 }}>
              {noteSaving?"Saving...":"Save note"}
            </button>
          </div>
          {noteMsg && <p style={{ marginTop:8, fontSize:13, fontWeight:600, color:noteMsg.startsWith("Saved")?"#15803d":"#b91c1c" }}>{noteMsg}</p>}
        </div>

        <div style={{ textAlign:"center", color:"#94a3b8", fontSize:11, paddingBottom:32 }}>
          FlytBase Account CRM · Kusumanjali · Questathon 2026 · All data live from MCP API · refreshes every 60s
        </div>
      </div>
    </div>
  );
}