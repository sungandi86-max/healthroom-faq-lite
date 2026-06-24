import { copyrightNotice, footerUsageNotice } from "../data/legalNotices";

export function FooterNotice() {
  return (
    <footer className="border-t border-[#DDF7F2] py-8 text-center text-xs font-semibold leading-6 text-slate-500 md:text-sm">
      <p>{copyrightNotice}</p>
      <p className="mx-auto mt-2 max-w-3xl px-2">{footerUsageNotice}</p>
      <p className="mt-2 text-slate-500">
        쑤캥T 보건실 도구모음 Lite / 개인정보를 입력하지 마세요 / 학교 기준에 맞게 검토 후 사용
      </p>
    </footer>
  );
}
