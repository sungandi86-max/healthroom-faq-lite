import { useEffect, useMemo, useState } from "react";
import { audienceOptions, FALLBACK_TEXT, initialFormData, PRIVACY_NOTICE, schoolLevelOptions, teacherCheckOptions, toneOptions } from "./data/defaults";
import { FooterNotice } from "./components/FooterNotice";
import { UsageNotice } from "./components/UsageNotice";
import { fallbackRelatedTools, fallbackTopics } from "./data/fallbackData";
import type { AppData, Audience, FaqFormData, FaqResult, SchoolLevel, TeacherCheck, Tone } from "./types/faq";
import { fetchFaqData } from "./utils/api";
import { generateFaqResult } from "./utils/generateFaqResult";

const resultEntries: Array<[keyof FaqResult, string]> = [
  ["questionTitle", "FAQ 질문 제목"],
  ["studentAnswer", "학생용 답변"],
  ["homeroomGuide", "담임교사용 안내"],
  ["staffGuide", "교직원 협조 안내"],
  ["shortNotice", "짧은 게시문"],
  ["onlinePost", "온라인 보건실 게시용 문구"],
  ["frontNotice", "보건실 앞 안내문 문구"],
  ["misunderstanding", "자주 오해하는 부분 안내"],
  ["privacyNotice", "개인정보 주의 문구"],
];
const tabs: Array<{ label: string; key: keyof FaqResult; title: string }> = [
  { label: "학생용", key: "studentAnswer", title: "학생용 답변" },
  { label: "담임교사용", key: "homeroomGuide", title: "담임교사용 안내" },
  { label: "교직원용", key: "staffGuide", title: "교직원 협조 안내" },
];
const audienceKey: Record<Exclude<Audience, "전체">, keyof FaqResult> = { 학생: "studentAnswer", 담임교사: "homeroomGuide", 교직원: "staffGuide" };
const inputClass = "min-h-12 rounded-xl border border-slate-200 bg-white px-3 py-2 text-base outline-none transition focus:border-[#1A3B8B] focus:ring-4 focus:ring-[#DDF7F2]";
const allText = (result: FaqResult) => resultEntries.map(([key, label]) => `[${label}]\n${result[key]}`).join("\n\n");

function CopyButton({ text, label = "복사하기", onCopied }: { text: string; label?: string; onCopied: () => void }) {
  const [busy, setBusy] = useState(false);
  const copy = async () => { setBusy(true); try { await navigator.clipboard.writeText(text); onCopied(); } finally { setBusy(false); } };
  return <button type="button" onClick={copy} disabled={busy} className="min-h-10 rounded-lg bg-[#1A3B8B] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#142f70] disabled:opacity-70">{busy ? "복사 중" : label}</button>;
}
function TextBlock({ text, variant }: { text: string; variant?: "question" | "structured" }) {
  if (variant === "question") return <p className="whitespace-pre-line rounded-xl border-l-4 border-[#1A3B8B] bg-[#E6FAF6] px-4 py-3 text-base font-extrabold leading-7 text-[#1A3B8B]">{text}</p>;
  return <div className="space-y-3 text-sm leading-[1.78] text-slate-700">{text.split("\n").map((line, i) => { const t = line.trim(); if (!t) return <div key={i} className="h-1" />; if (variant === "structured" && /^\[(FAQ|안내|이용 기준|확인|학교별 확인)\]$/.test(t)) return <p key={i} className="mt-5 font-extrabold text-[#1A3B8B] first:mt-0">{t}</p>; return <p key={i} className="whitespace-pre-wrap">{line}</p>; })}</div>;
}
function ResultCard({ title, content, onCopied, variant }: { title: string; content: string; onCopied: () => void; variant?: "question" | "structured" }) {
  return <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:p-6"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5"><h3 className="text-lg font-bold text-[#1A3B8B]">{title}</h3><CopyButton text={content} onCopied={onCopied} /></div><TextBlock text={content} variant={variant} /></article>;
}
function SelectField<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: T[]; onChange: (value: T) => void }) {
  return <label className="grid gap-2"><span className="font-semibold text-slate-800">{label}</span><select value={value} onChange={(e) => onChange(e.target.value as T)} className={inputClass}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

export default function App() {
  const [data, setData] = useState<AppData>({ topics: fallbackTopics, relatedTools: fallbackRelatedTools });
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [formData, setFormData] = useState<FaqFormData>(initialFormData);
  const [toast, setToast] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<keyof FaqResult>("studentAnswer");

  useEffect(() => { fetchFaqData().then((next) => { setData(next); setLoadState("ready"); }).catch(() => setLoadState("error")); }, []);
  const selectedTopic = data.topics.find((topic) => topic.topicId === formData.topic) ?? data.topics[0] ?? fallbackTopics[0];
  const result = useMemo(() => generateFaqResult(selectedTopic, formData), [selectedTopic, formData]);
  const primaryKey = formData.audience === "전체" ? activeKey : audienceKey[formData.audience];
  const primaryTab = tabs.find((tab) => tab.key === primaryKey) ?? tabs[0];
  const otherTabs = tabs.filter((tab) => tab.key !== primaryKey);
  const update = <K extends keyof FaqFormData>(key: K, value: FaqFormData[K]) => setFormData((current) => ({ ...current, [key]: value }));
  const copied = () => { setToast("복사 완료"); window.setTimeout(() => setToast(""), 1500); };

  return <div className="min-h-screen bg-[#F7F9FC] text-slate-900"><main className="mx-auto grid w-full max-w-[1440px] gap-5 px-4 py-5 md:px-6 md:py-8">
    <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-8"><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-black text-[#1A3B8B] md:text-3xl">보건실 FAQ 문구 정리 도우미</h1><span className="rounded-full bg-[#DDF7F2] px-3 py-1 text-sm font-black text-[#1A3B8B]">Lite</span></div><p className="mt-3 text-base leading-7 text-slate-700 md:text-lg">자주 받는 보건실 FAQ에 대한 학생용 답변, 담임교사용 안내, 교직원 협조 안내, 게시용 문구를 빠르게 확인하고 복사합니다.</p></header>
    <section className="sticky top-3 z-10 rounded-2xl border border-[#D94F70]/20 bg-[#fff7fa] p-4 shadow-sm"><p className="text-sm leading-6 text-slate-700 md:text-base"><strong className="text-[#D94F70]">개인정보 주의 </strong>{PRIVACY_NOTICE}</p></section>
    <UsageNotice />
    {loadState === "loading" && <div className="rounded-2xl bg-white p-4 text-sm font-bold text-[#1A3B8B] shadow-sm ring-1 ring-slate-100">FAQ 데이터를 불러오는 중입니다.</div>}
    {loadState === "error" && <div className="rounded-2xl bg-white p-4 text-sm font-bold text-[#D94F70] shadow-sm ring-1 ring-slate-100">FAQ 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>}
    <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start xl:grid-cols-[380px_minmax(0,1fr)]">
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:p-6 lg:sticky lg:top-32"><h2 className="text-xl font-bold text-[#1A3B8B]">입력</h2><p className="mt-1 text-sm leading-6 text-slate-600">개인정보 없이 학교 운영 기준만 입력해 주세요.</p><div className="mt-5 grid gap-4">
        <label className="grid gap-2"><span className="font-semibold text-slate-800">FAQ 주제</span><select value={formData.topic} onChange={(e) => update("topic", e.target.value)} className={inputClass}>{data.topics.map((topic) => <option key={topic.topicId} value={topic.topicId}>{topic.topicName}</option>)}</select></label>
        <div className="grid gap-4 sm:grid-cols-2"><SelectField label="안내 대상" value={formData.audience} options={audienceOptions} onChange={(value) => update("audience", value)} /><SelectField label="학교급" value={formData.schoolLevel} options={schoolLevelOptions} onChange={(value) => update("schoolLevel", value)} /></div>
        <SelectField label="문체" value={formData.tone} options={toneOptions} onChange={(value) => update("tone", value)} />
        {formData.topic === "faq_013" && <label className="grid gap-2"><span className="font-semibold text-slate-800">직접 입력 질문</span><input value={formData.customQuestion ?? ""} onChange={(e) => update("customQuestion", e.target.value)} placeholder="예: 보건실에서 쉬었다가 바로 교실로 돌아가야 하나요?" className={inputClass} /><span className="text-xs font-semibold leading-5 text-[#D94F70]">학생 이름, 학번, 질병명, 진단명, 상담 내용 등 개인정보와 민감정보는 입력하지 마세요.</span></label>}
        <label className="grid gap-2"><span className="font-semibold text-slate-800">보건실 이용 시간</span><input value={formData.officeHours} onChange={(e) => update("officeHours", e.target.value)} className={inputClass} /></label>
        <label className="grid gap-2"><span className="font-semibold text-slate-800">수업 중 방문 절차</span><input value={formData.visitProcedure} onChange={(e) => update("visitProcedure", e.target.value)} className={inputClass} /></label>
        <SelectField label="담임/교과교사 확인 여부" value={formData.teacherCheck} options={teacherCheckOptions} onChange={(value) => update("teacherCheck", value)} />
        <label className="grid gap-2"><span className="font-semibold text-slate-800">보호자 연락 기준</span><input value={formData.guardianContactPolicy} onChange={(e) => update("guardianContactPolicy", e.target.value)} className={inputClass} /></label>
        <label className="grid gap-2"><span className="font-semibold text-slate-800">약품 제공 기준</span><input value={formData.medicationPolicy} onChange={(e) => update("medicationPolicy", e.target.value)} className={inputClass} /></label>
        <label className="grid gap-2"><span className="font-semibold text-slate-800">침상 이용 기준</span><input value={formData.bedRestPolicy} onChange={(e) => update("bedRestPolicy", e.target.value)} className={inputClass} /></label>
        <label className="grid gap-2"><span className="font-semibold text-slate-800">학교별 추가 안내사항</span><textarea value={formData.extraNotice} onChange={(e) => update("extraNotice", e.target.value)} rows={4} placeholder="개인정보 없이 학교 운영 원칙만 입력하세요." className={`${inputClass} resize-y leading-6`} /></label>
      </div></section>
      <section className="grid gap-5 lg:gap-6"><div className="rounded-2xl bg-[#E6FAF6] p-5 shadow-sm ring-1 ring-emerald-100 md:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-xl font-bold text-[#1A3B8B]">생성 결과</h2><p className="mt-1 text-sm leading-6 text-slate-700">화면에는 핵심 카드만 보이고, 전체 결과 복사는 모든 항목을 포함합니다.</p></div><CopyButton text={allText(result)} label="전체 결과 복사" onCopied={copied} /></div><div className="mt-4 flex flex-wrap gap-2">{[["선택 주제", selectedTopic.topicName], ["대상", formData.audience], ["학교급", formData.schoolLevel], ["문체", formData.tone]].map(([label, value]) => <span key={label} className="inline-flex min-h-8 items-center rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#1A3B8B] ring-1 ring-[#BFEDE5]">{label}: {value || FALLBACK_TEXT}</span>)}</div></div>
        <div className="grid gap-4"><h3 className="text-sm font-extrabold text-[#1A3B8B]">기본 FAQ</h3><ResultCard title="FAQ 질문 제목" content={result.questionTitle} onCopied={copied} variant="question" /></div>
        <div className="grid gap-4"><h3 className="text-sm font-extrabold text-[#1A3B8B]">대상별 답변</h3>{formData.audience === "전체" && <div className="flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab.key} type="button" onClick={() => setActiveKey(tab.key)} className={`min-h-9 rounded-full px-3 text-sm font-bold ${activeKey === tab.key ? "bg-[#1A3B8B] text-white" : "bg-[#E6FAF6] text-[#1A3B8B]"}`}>{tab.label}</button>)}</div>}<ResultCard title={primaryTab.title} content={result[primaryKey]} onCopied={copied} /></div>
        <div className="grid gap-4"><h3 className="text-sm font-extrabold text-[#1A3B8B]">게시용 문구</h3><div className="grid gap-4 xl:grid-cols-[0.9fr_1.35fr]"><ResultCard title="짧은 게시문" content={result.shortNotice} onCopied={copied} /><ResultCard title="온라인 보건실 게시용 문구" content={result.onlinePost} onCopied={copied} variant="structured" /></div></div>
        <div className="grid gap-4"><button type="button" onClick={() => setMoreOpen((v) => !v)} className="flex min-h-11 w-full items-center justify-between rounded-xl bg-[#E6FAF6] px-4 text-sm font-extrabold text-[#1A3B8B] shadow-sm ring-1 ring-[#BFEDE5]"><span>추가 문구 보기</span><span className="text-lg">{moreOpen ? "−" : "+"}</span></button>{moreOpen && <div className="grid gap-4"><div className="grid gap-4 lg:grid-cols-2">{otherTabs.map((tab) => <ResultCard key={tab.key} title={tab.title} content={result[tab.key]} onCopied={copied} />)}</div><div className="grid gap-4 lg:grid-cols-2"><ResultCard title="보건실 앞 안내문 문구" content={result.frontNotice} onCopied={copied} /><ResultCard title="자주 오해하는 부분 안내" content={result.misunderstanding} onCopied={copied} /></div><div className="rounded-xl border border-[#DDF7F2] bg-[#F7FFFD] px-4 py-3 text-sm font-semibold leading-6 text-slate-700">※ 공개 게시물에는 학생 이름, 학번, 질병명, 상담 내용 등 개인정보를 포함하지 마세요.</div></div>}</div>
      </section>
    </div>
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:p-6"><h2 className="text-xl font-bold text-[#1A3B8B]">관련 도구</h2><div className="mt-5 grid gap-3 md:grid-cols-4">{data.relatedTools.map((tool) => <div key={tool.toolName} className="rounded-xl border border-slate-100 bg-[#F7F9FC] p-4 text-sm font-semibold leading-6 text-slate-700"><h3 className="text-base font-bold text-[#1A3B8B]">{tool.toolName}</h3><p className="mt-2 font-medium text-slate-600">{tool.description}</p><span className="mt-4 inline-flex min-h-9 items-center rounded-lg bg-white px-3 text-[12.5px] font-bold text-[#1A3B8B] ring-1 ring-slate-200">{tool.buttonLabel}</span></div>)}</div></section>
    <FooterNotice />
  </main>{toast && <div className="fixed bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[#1A3B8B] px-5 py-3 text-sm font-bold text-white shadow-lg">{toast}</div>}</div>;
}
