"use client";
import { useState, useEffect, useCallback } from "react";

const REFRESH = 60000;

const ACCOUNTS = {
  A: {
    id: "A",
    name: "Eastern Counties Police Alliance",
    subtitle: "4 forces · 35 docks · 300-dock tender incoming",
    color: "#6366f1",
    closed: [
      { name: "Priority Support for Drone Units", value: 60000, source: "karen_mbeki", how: "Agreed in discovery session" },
      { name: "Operator Training for New Pilots", value: 45000, source: "karen_mbeki", how: "Agreed in discovery session" },
    ],
    pipeline: [
      { name: "Extra Docks for Metro Central", worth: 180000, blocker: "Ewan Brooks is guarded — needs real cost comparison before he will engage" },
    ],
    lost: [
      { name: "Renew Alliance Contract (35 docks)", worth: 350000, reason: "No force-by-force usage data available to Rhys" },
      { name: "Tarn Valley and Norwold Go Live", worth: 200000, reason: "DPIA blocked — FlytBase never sent data-flow documents to fatima_osei" },
      { name: "300-Dock Framework Tender", worth: 1500000, reason: "Tender spec locked without costed operating model" },
    ],
    people: [
      { id: "rhys_calder", name: "Rhys Calder", title: "Alliance drone programme lead", trust: "Ally", decides: true, pays: false, blocks: false, note: "Leaving January. No successor named." },
      { id: "karen_mbeki", name: "Insp. Karen Mbeki", title: "Drone unit inspector, Westmere", trust: "Ally", decides: false, pays: false, blocks: false, note: "Busiest unit. Raised urgent ticket for 5 Dec event." },
      { id: "ewan_brooks", name: "Ewan Brooks", title: "Finance business partner, Metro Central", trust: "Guarded", decides: false, pays: true, blocks: true, note: "Needs real numbers. Declined offer 3 times." },
      { id: "fatima_osei", name: "Fatima Osei", title: "Data protection officer, Tarn Valley", trust: "Neutral", decides: false, pays: false, blocks: true, note: "Waiting 4 months for data-flow docs from FlytBase." },
      { id: "hannah_doyle", name: "Hannah Doyle", title: "Alliance procurement lead", trust: "Neutral", decides: false, pays: false, blocks: false, note: "Owns tender spec. Does not like surprises." },
    ],
    moves: [
      { rank: 1, action: "Reply to Karen Mbeki ticket in writing — confirm training dates and named support lead for 5 December event", owner: "Kusumanjali", by: "This week", moves: "Operator Training + Priority Support at risk" },
      { rank: 2, action: "Identify Rhys Calder successor before January and brief them on every open relationship", owner: "Kusumanjali + Achal Negi", by: "Before January 2027", moves: "Alliance renewal risk — $350K" },
      { rank: 3, action: "Bring Ewan Brooks a helicopter vs drone cost comparison built from Karen real flight data", owner: "Kusumanjali", by: "This week", moves: "Extra docks Metro Central — $180K" },
    ],
    risks: [
      { title: "Rhys Calder leaving January", detail: "Only contact on record. No successor named. Every deal passes through him alone.", by: "January 2027", level: "Critical", source: "Signal received 17 Nov" },
      { title: "Karen Mbeki ticket unanswered", detail: "Needs training dates and dock support lead confirmed before 5 December public event. No reply sent.", by: "This week", level: "Critical", source: "Signal received 18 Nov · ticket logged" },
      { title: "Ewan Brooks trust not rebuilt", detail: "Metro Central CFO wary after three declined offers. $180K stalled until he sees real numbers.", by: "Next budget round", level: "High", source: "Relationship status: guarded · ewan_brooks" },
      { title: "Tarn Valley docks idle since May", detail: "Engineering committed to data-flow pack but it was never sent to Fatima. Four docks grounded.", by: "Pending SRV delivery", level: "High", source: "fatima_osei conversation · pranjal ticket history" },
    ],
    gaps: [
      { question: "Who replaces Rhys Calder?", matters: "Every open deal goes through him. Without a named successor, renewal and tender work stops.", ask: "Rhys Calder — before January" },
      { question: "What does Ewan finance director need to approve Metro Central docks?", matters: "The $180K offer requires knowing finance director requirements, not just Ewan.", ask: "Ewan Brooks" },
      { question: "Has engineering sent the data-flow pack to Fatima Osei?", matters: "Fatima committed to sign the DPIA the same day it arrives. Tarn Valley + Norwold blocked until then.", ask: "Pranjal Suyal / SRV" },
      { question: "Who funds and staffs the 30-dock stadium plan?", matters: "Rhys was finding out before Friday board. No staffing plan exists. Quote cannot be given without this.", ask: "Rhys Calder + Karen Mbeki" },
    ],
  },
  B: {
    id: "B",
    name: "Aldermoor Industrial Group",
    subtitle: "15 plants · 14 docks · 40-plant sister company opportunity",
    color: "#0ea5e9",
    closed: [
      { name: "Docks for Plant 15 and Two Idle Plants", value: 160000, source: "stefan_roy", how: "Agreed in discovery — real rollout plan in place" },
      { name: "Night-time Priority Support, Plant 7", value: 50000, source: "beatriz_alonso", how: "Agreed — alerts currently going only to Beatriz phone" },
      { name: "Flight-log Reporting by Plant", value: 70000, source: "nadia_rahman", how: "Agreed — finance and insurer both need consistent logs" },
    ],
    pipeline: [],
    lost: [
      { name: "Renew Aldermoor Contract (14 docks)", worth: 140000, reason: "Finance could not verify savings — Stefan spreadsheet never shown to Nadia" },
      { name: "Case Study for 40-plant Sister Company", worth: 1200000, reason: "Every number rested on unverified spreadsheet. Nadia needed insurer letter in writing." },
    ],
    people: [
      { id: "stefan_roy", name: "Stefan Roy", title: "Group head of security", trust: "Ally", decides: true, pays: false, blocks: false, note: "Champion. Accepted verified 180K saving. Deputy leaving soon." },
      { id: "nadia_rahman", name: "Nadia Rahman", title: "Group finance controller", trust: "Warm", decides: false, pays: true, blocks: true, note: "Books only what finance can verify. Confirmed 180K as bookable." },
      { id: "julian_tate", name: "Julian Tate", title: "Insurance and risk manager", trust: "Warm", decides: false, pays: false, blocks: false, note: "6% premium cut across 9 plants = 180K/year. Letter in data room." },
      { id: "beatriz_alonso", name: "Beatriz Alonso", title: "Plant manager, Plant 7", trust: "Warm", decides: false, pays: false, blocks: false, note: "Customised patrol routes herself. Would keep the dock." },
      { id: "owen_fitch", name: "Owen Fitch", title: "Group IT infrastructure lead", trust: "Warm", decides: false, pays: false, blocks: true, note: "Network segmentation in 4 months will cut all docks offline." },
    ],
    moves: [
      { rank: 1, action: "Investigate why three most active docks stopped flying — raise support ticket with Pranjal and inform Stefan", owner: "Kusumanjali + Pranjal Suyal", by: "Today", moves: "Renewal risk + insurance discount at risk" },
      { rank: 2, action: "Send Owen Fitch the dock ports and services list so he can file network exceptions before segmentation starts", owner: "Kusumanjali + Owen Fitch", by: "Within 4 months", moves: "All 14 docks stay online" },
      { rank: 3, action: "Document Stefan deputy rollout knowledge before he leaves — arrange session with Pranjal to capture it", owner: "Kusumanjali + Stefan Roy", by: "Before deputy leaves", moves: "Sister company case study — $1.2M" },
    ],
    risks: [
      { title: "Three docks stopped flying — no ticket raised", detail: "Three most active docks: zero flights in last two weeks. All still online. No one at Aldermoor has noticed.", by: "Investigate today", level: "Critical", source: "Signal received 30 Nov · Account B usage data" },
      { title: "Network segmentation cuts all docks offline", detail: "Owen Fitch IT project starts in four months. Without exceptions filed now, all 14 docks go dark. Plant 3 first.", by: "4 months", level: "Critical", source: "owen_fitch conversation · network plan in data room" },
      { title: "Deputy leaving — rollout knowledge undocumented", detail: "Stefan deputy set up every plant that flies. Nothing is written down. He leaves soon.", by: "Before departure", level: "High", source: "stefan_roy conversation · beatriz_alonso confirmation" },
      { title: "Plant 12 router too old", detail: "Causing dock dropouts. Replacement is in IT wave two, months away. Could fail before then.", by: "Unknown", level: "Medium", source: "owen_fitch conversation" },
    ],
    gaps: [
      { question: "Why did three docks stop flying in the last two weeks?", matters: "Insurance discount depends on consistent flight logs. If docks are idle the insurer can reduce or pull the discount.", ask: "Pranjal Suyal (check tickets) + Stefan Roy" },
      { question: "Has Owen Fitch received the ports and services list?", matters: "We committed to providing it. Without it, Owen cannot file the network exceptions and all docks go offline.", ask: "Owen Fitch" },
      { question: "Who is the sister company security director?", matters: "Stefan described an old colleague who would decide. We were never introduced. The $1.2M opportunity depends on them.", ask: "Stefan Roy" },
      { question: "Are the three guard contract renewals tracking drone savings?", matters: "Three contracts renew in four months. First chance to book verified savings into finance. Currently not in scope.", ask: "Nadia Rahman" },
    ],
  },
};

const TRUST_STYLES = {
  Ally:    { bg: "#dcfce7", text: "#15803d", border: "#16a34a" },
  Warm:    { bg: "#dbeafe", text: "#1d4ed8", border: "#2563eb" },
  Neutral: { bg: "#f1f5f9", text: "#475569", border: "#64748b" },
  Guarded: { bg: "#ffedd5", text: "#c2410c", border: "#ea580c" },
  Cold:    { bg: "#fee2e2", text: "#b91c1c", border: "#dc2626" },
};

const LEVEL_STYLES = {
  Critical: { bg: "#fee2e2", text: "#b91c1c", border: "#ef4444", left: "#ef4444" },
  High:     { bg: "#ffedd5", text: "#c2410c", border: "#f97316", left: "#f97316" },
  Medium:   { bg: "#fef9c3", text: "#854d0e", border: "#eab308", left: "#eab308" },
};

function TrustTag({ trust }) {
  const s = TRUST_STYLES[trust] || TRUST_STYLES.Neutral;
  return (
    <span style={{ background: s.bg, color: s.text, border: `1.5px solid ${s.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
      {trust}
    </span>
  );
}

function LevelTag({ level }) {
  const s = LEVEL_STYLES[level] || LEVEL_STYLES.Medium;
  return (
    <span style={{ background: s.bg, color: s.text, border: `1.5px solid ${s.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
      {level}
    </span>
  );
}

function AccountPanel({ id, signals }) {
  const [tab, setTab] = useState("Overview");
  const acc = ACCOUNTS[id];
  const totalClosed = acc.closed.reduce((s, d) => s + d.value, 0);
  const acctSignals = signals.filter(s => s.account === id || s.account_id === id);
  const tabs = ["Overview", "People", "Deals", "Risks", "Gaps"];

  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>

      {/* Coloured top bar */}
      <div style={{ background: acc.color, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>{acc.name}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>{acc.subtitle}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "white" }}>${totalClosed.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>closed this run</div>
        </div>
      </div>

      {/* Signal bar */}
      {acctSignals.length > 0 && (
        <div style={{ background: "#fef2f2", borderBottom: "2px solid #ef4444", padding: "10px 28px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#b91c1c" }}>Action needed — </span>
          {acctSignals.map((s, i) => (
            <span key={i} style={{ fontSize: 13, color: "#7f1d1d" }}>{s.summary || s.title || s.text}</span>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: "1px solid #f1f5f9" }}>
        {[
          { label: "Closed", val: `$${totalClosed.toLocaleString()}`, bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
          { label: "Pipeline", val: acc.pipeline.length > 0 ? `$${acc.pipeline.reduce((s,d)=>s+d.worth,0).toLocaleString()}` : "None", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
          { label: "Out of reach", val: acc.lost.length, bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
          { label: "Critical risks", val: acc.risks.filter(r => r.level === "Critical").length, bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "14px 20px", background: s.bg, borderRight: i < 3 ? `1px solid ${s.border}` : "none" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginTop: 2 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "2px solid #f1f5f9", paddingLeft: 28 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "12px 18px", border: "none",
            borderBottom: tab === t ? `3px solid ${acc.color}` : "3px solid transparent",
            background: "none", cursor: "pointer",
            fontSize: 13, fontWeight: tab === t ? 700 : 500,
            color: tab === t ? acc.color : "#64748b",
            marginBottom: -2, transition: "all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: 28 }}>

        {/* OVERVIEW */}
        {tab === "Overview" && (
          <div>
            {/* Q1 */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Q1 — What is the book worth?</div>
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                {acc.closed.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: i % 2 === 0 ? "#f8fafc" : "white", borderBottom: i < acc.closed.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Source: <span style={{ color: "#6366f1", fontWeight: 600 }}>{d.source}</span> — {d.how}</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#15803d", background: "#dcfce7", padding: "4px 12px", borderRadius: 8, marginLeft: 20, flexShrink: 0 }}>${d.value.toLocaleString()}</div>
                  </div>
                ))}
                {acc.pipeline.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#eff6ff", borderTop: "1px solid #bfdbfe" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1d4ed8" }}>{d.name} <span style={{ fontSize: 11, fontWeight: 500, color: "#64748b" }}>pipeline</span></div>
                      <div style={{ fontSize: 12, color: "#dc2626", marginTop: 2 }}>Blocker: {d.blocker}</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1d4ed8", marginLeft: 20, flexShrink: 0 }}>up to ${d.worth.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Q3 — What do you do first?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {acc.moves.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 14 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: acc.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{m.rank}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", lineHeight: 1.5 }}>{m.action}</div>
                      <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: "white", background: "#475569", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>{m.owner}</span>
                        <span style={{ fontSize: 12, color: "white", background: "#0ea5e9", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>By: {m.by}</span>
                        <span style={{ fontSize: 12, color: "#0f172a", background: "#fef9c3", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>{m.moves}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PEOPLE */}
        {tab === "People" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Q2 — Who holds the power?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 12 }}>
              {acc.people.map((p, i) => (
                <div key={i} style={{ border: "2px solid #e2e8f0", borderRadius: 12, padding: 16, background: "white", transition: "border-color 0.15s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{p.title}</div>
                    </div>
                    <TrustTag trust={p.trust} />
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {p.decides && <span style={{ fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#15803d", border: "1.5px solid #16a34a", padding: "2px 8px", borderRadius: 6 }}>Decides</span>}
                    {p.pays && <span style={{ fontSize: 11, fontWeight: 700, background: "#dbeafe", color: "#1d4ed8", border: "1.5px solid #2563eb", padding: "2px 8px", borderRadius: 6 }}>Pays</span>}
                    {p.blocks && <span style={{ fontSize: 11, fontWeight: 700, background: "#fee2e2", color: "#b91c1c", border: "1.5px solid #ef4444", padding: "2px 8px", borderRadius: 6 }}>Can block</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{p.note}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, fontFamily: "monospace" }}>ID: {p.id}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEALS */}
        {tab === "Deals" && (
          <div>
            {acc.closed.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, background: "#dcfce7", display: "inline-block", padding: "3px 10px", borderRadius: 6 }}>Closed</div>
                {acc.closed.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: "#16a34a", marginTop: 2 }}>Source: <span style={{ fontWeight: 700 }}>{d.source}</span> — {d.how}</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#15803d", marginLeft: 20, flexShrink: 0 }}>${d.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
            {acc.pipeline.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, background: "#dbeafe", display: "inline-block", padding: "3px 10px", borderRadius: 6 }}>Pipeline</div>
                {acc.pipeline.map((d, i) => (
                  <div key={i} style={{ padding: "12px 16px", background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 10, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1d4ed8" }}>{d.name}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1d4ed8" }}>up to ${d.worth.toLocaleString()}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4, fontWeight: 500 }}>Blocker: {d.blocker}</div>
                  </div>
                ))}
              </div>
            )}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#b91c1c", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, background: "#fee2e2", display: "inline-block", padding: "3px 10px", borderRadius: 6 }}>Out of reach</div>
              {acc.lost.map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{d.reason}</div>
                  </div>
                  <div style={{ fontSize: 14, color: "#94a3b8", marginLeft: 20, flexShrink: 0 }}>${d.worth.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISKS */}
        {tab === "Risks" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Q4 — What is about to go wrong?</div>
            {acc.risks.map((r, i) => {
              const s = LEVEL_STYLES[r.level] || LEVEL_STYLES.Medium;
              return (
                <div key={i} style={{ background: s.bg, border: `2px solid ${s.border}`, borderLeft: `5px solid ${s.left}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{r.title}</div>
                    <LevelTag level={r.level} />
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{r.detail}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#64748b", fontStyle: "italic" }}>Source: {r.source}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.text, background: "white", padding: "2px 10px", borderRadius: 6, border: `1px solid ${s.border}` }}>By: {r.by}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GAPS */}
        {tab === "Gaps" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Q5 — What do you still not know?</div>
            {acc.gaps.map((g, i) => (
              <div key={i} style={{ background: "#faf5ff", border: "2px solid #c084fc", borderLeft: "5px solid #9333ea", borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#6b21a8", marginBottom: 6 }}>{g.question}</div>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 8 }}>Why it matters: {g.matters}</div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "white", background: "#9333ea", padding: "3px 10px", borderRadius: 6 }}>Ask: {g.ask}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [signals, setSignals] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [noteAccount, setNoteAccount] = useState("A");
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteMsg, setNoteMsg] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      const [sRes] = await Promise.all([fetch("/api/signals")]);
      const sJson = await sRes.json();
      if (sJson.success) setSignals(Array.isArray(sJson.data) ? sJson.data : sJson.data?.signals || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) { console.error(e); }
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: noteAccount, kind: "next_step", text: noteText }),
      });
      const j = await res.json();
      if (j.success) { setNoteMsg("Saved."); setNoteText(""); }
      else setNoteMsg("Error: " + (j.error || "Failed"));
    } catch (e) { setNoteMsg("Error: " + e.message); }
    setNoteSaving(false);
    setTimeout(() => setNoteMsg(""), 3000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      {/* Nav */}
      <div style={{ background: "#0f172a", padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "white" }}>FlytBase CRM</span>
            <span style={{ fontSize: 12, color: "#94a3b8", background: "#1e293b", padding: "3px 10px", borderRadius: 20 }}>Kusumanjali · Questathon 2026</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {signals.length > 0 && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fca5a5", background: "#7f1d1d", padding: "3px 10px", borderRadius: 20 }}>
                {signals.length} new signal{signals.length > 1 ? "s" : ""}
              </span>
            )}
            <span style={{ fontSize: 12, color: "#64748b" }}>{lastUpdated ? `Updated ${lastUpdated}` : "Loading..."}</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#34d399" }}>$385,000 closed</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "28px auto", padding: "0 24px" }}>
        <AccountPanel id="A" signals={signals} />
        <AccountPanel id="B" signals={signals} />

        {/* Notes */}
        <div style={{ background: "white", border: "2px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Write a note</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select value={noteAccount} onChange={e => setNoteAccount(e.target.value)}
              style={{ padding: "9px 14px", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: 13, fontWeight: 600, color: "#374151", background: "white" }}>
              <option value="A">Police Alliance</option>
              <option value="B">Aldermoor</option>
            </select>
            <input value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="Next step, risk or action..."
              style={{ flex: 1, padding: "9px 14px", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: 13, minWidth: 200 }}
              onKeyDown={e => e.key === "Enter" && saveNote()} />
            <button onClick={saveNote} disabled={noteSaving}
              style={{ padding: "9px 20px", background: "#0f172a", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
              {noteSaving ? "Saving..." : "Save note"}
            </button>
          </div>
          {noteMsg && <p style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: noteMsg.startsWith("Saved") ? "#15803d" : "#b91c1c" }}>{noteMsg}</p>}
        </div>

        <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 11, paddingBottom: 32 }}>
          FlytBase Account CRM · Kusumanjali · Questathon 2026 · Live via MCP · refreshes every 60s
        </div>
      </div>
    </div>
  );
}