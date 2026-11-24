"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fill } from "@/i18n/config";
import { demoMember } from "@/data/portal";
import { setSession } from "./session";

/** Six boxes for a one-time code; typing jumps to the next box, paste fills all. */
export function OtpInput({ value, onChange, label }) {
  const refs = useRef([]);
  const digits = (value + "      ").slice(0, 6).split("");
  const set = (i, ch) => {
    const next = digits.map((d, j) => (j === i ? ch : d)).join("").replace(/\s+$/, "");
    onChange(next.replace(/ /g, ""));
  };
  return (
    <div className="otp" role="group" aria-label={label}>
      {digits.map((dch, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={dch.trim()}
          aria-label={`${label} ${i + 1}`}
          onChange={(e) => {
            const ch = e.target.value.replace(/\D/g, "").slice(-1);
            set(i, ch || " ");
            if (ch && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => { if (e.key === "Backspace" && !dch.trim() && i > 0) refs.current[i - 1]?.focus(); }}
          onPaste={(e) => {
            const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (p) { e.preventDefault(); onChange(p); refs.current[Math.min(p.length, 5)]?.focus(); }
          }}
        />
      ))}
    </div>
  );
}

// One login form. The person picks their category first (Member / Contributor / Admin);
// the fields below change to match. Contributors & Admins get a 2-step code after the password.
const CATS = [
  { id: "member", icon: "🪪" },
  { id: "contributor", icon: "✍️" },
  { id: "admin", icon: "🏗️" },
];

export function SignInFlow({ lang, a }) {
  const router = useRouter();
  const [cat, setCat] = useState("member");
  const [step, setStep] = useState(1);
  const [user, setUser] = useState("");
  const [code, setCode] = useState("");
  const isMember = cat === "member";
  const pick = (id) => { setCat(id); setStep(1); setCode(""); setUser(""); };

  function submit(e) {
    e.preventDefault();
    if (isMember) { setSession({ role: "member", id: demoMember.id }); router.push(`/${lang}/portal`); return; }
    if (step === 1) { setStep(2); return; }
    setSession({ role: "team", email: user });
    try { localStorage.setItem("wbpcc-console-role", cat); } catch {}
    router.push("/console");
  }

  return (
    <form className="card auth-card login-form" onSubmit={submit}>
      <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend>{a.signInAs}</legend>
        <div className="login-cats" role="radiogroup">
          {CATS.map((x) => (
            <label key={x.id} className={`login-cat${cat === x.id ? " on" : ""}`}>
              <input type="radio" name="cat" value={x.id} checked={cat === x.id} onChange={() => pick(x.id)} />
              <i aria-hidden="true">{x.icon}</i>
              <span>{a.doors[x.id].t}</span>
            </label>
          ))}
        </div>
        <small className="hint">{a.doors[cat].d}</small>
      </fieldset>

      {step === 1 ? (
        <>
          <div className="field">
            <label htmlFor="lu">{isMember ? a.memberId : a.teamEmail}</label>
            <input id="lu" required value={user} onChange={(e) => setUser(e.target.value)} type={isMember ? "text" : "email"} autoComplete="username"
              placeholder={isMember ? "98XXXXXXXX / WB-XXX-XXX-0000" : "name@wbpcc.org"} />
          </div>
          <div className="field">
            <label htmlFor="lp">{a.password}</label>
            <input id="lp" type="password" required autoComplete="current-password" />
          </div>
          <button className={`btn ${isMember ? "btn-saffron" : "btn-navy"}`} type="submit">{a.signin}</button>
          <button type="button" className="text-btn">{a.forgot}</button>
        </>
      ) : (
        <>
          <p className="form-note">🔐 {a.twofaHint}</p>
          <div className="field"><label>{a.twofa}</label><OtpInput value={code} onChange={setCode} label={a.twofa} /></div>
          <button className="btn btn-navy" type="submit" disabled={code.length < 6}>{a.verify}</button>
          <button type="button" className="text-btn" onClick={() => setStep(1)}>← {a.back}</button>
        </>
      )}

      {isMember ? (
        <div className="auth-links">
          <Link href={`/${lang}/activate`} className="link-arrow">{a.firstTime} →</Link>
          <span>{a.notMember} <Link href={`/${lang}/join`} className="link-arrow">{a.join}</Link></span>
        </div>
      ) : (
        <p className="form-note">🛡️ {a.teamNote}</p>
      )}
    </form>
  );
}
export function ActivateFlow({ lang, v }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const mismatch = pw2 && pw !== pw2;

  return (
    <div className="card auth-card">
      <div className="stepper">
        <span className={step >= 1 ? "on" : ""}>1</span><i /><span className={step >= 2 ? "on" : ""}>2</span>
        <small>{fill(v.step, { n: step })}</small>
      </div>
      {step === 1 ? (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <div className="field">
            <label htmlFor="ic">{v.code}</label>
            <input id="ic" required placeholder="XXXX-XXXX" style={{ textTransform: "uppercase", letterSpacing: ".15em", fontWeight: 700 }} />
            <small style={{ color: "var(--muted)" }}>{v.codeHint}</small>
          </div>
          <button className="btn btn-saffron" type="submit">{v.check}</button>
        </form>
      ) : (
        <form className="form" onSubmit={(e) => { e.preventDefault(); if (mismatch) return; setSession({ role: "member", id: demoMember.id }); router.push(`/${lang}/portal`); }}>
          <div className="member-id-card">
            <small>{v.yourId}</small>
            <b>{demoMember.id}</b>
            <span className="tricolour"><span /><span /><span /></span>
          </div>
          <p className="form-note">🔒 {v.idNote}</p>
          <div className="field"><label htmlFor="ae">{v.email}</label><input id="ae" type="email" required autoComplete="email" /></div>
          <div className="field"><label htmlFor="ap">{v.password}</label><input id="ap" type="password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></div>
          <div className="field">
            <label htmlFor="ap2">{v.confirm}</label>
            <input id="ap2" type="password" required value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" />
            {mismatch && <small style={{ color: "var(--red)", fontWeight: 700 }}>{v.mismatch}</small>}
          </div>
          <label className="check"><input type="checkbox" required /> {v.pledge}</label>
          <button className="btn btn-saffron" type="submit" disabled={!!mismatch}>✋ {v.finish}</button>
        </form>
      )}
    </div>
  );
}
