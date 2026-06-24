import { compactPrivacyNotice, detailedUsageNotice, USAGE_BADGES } from "../data/legalNotices";

export function UsageNotice() {
  return (
    <section className="rounded-2xl border border-[#DDF7F2] bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm md:p-6">
      <div className="flex flex-col gap-2 border-b border-[#DDF7F2] pb-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-extrabold text-[#1A3B8B]">이용 범위 안내</h2>
        <span className="w-fit rounded-full bg-[#E6FAF6] px-3 py-1 text-xs font-bold text-[#1A3B8B]">
          공개용 Lite
        </span>
      </div>
      <div className="mt-4 grid gap-3">
        <div className="flex flex-wrap gap-2">
          {USAGE_BADGES.map((badge) => (
            <span key={badge} className="rounded-full bg-[#E6FAF6] px-3 py-1 text-xs font-bold text-[#1A3B8B] ring-1 ring-[#BFEDE5]">
              {badge}
            </span>
          ))}
        </div>
        {detailedUsageNotice.map((text) => (
          <p key={text}>{text}</p>
        ))}
        <p className="rounded-xl bg-[#F7F9FC] px-4 py-3 text-xs font-semibold leading-6 text-slate-600">
          {compactPrivacyNotice}
        </p>
      </div>
    </section>
  );
}
