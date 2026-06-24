import { FALLBACK_TEXT, RESULT_PRIVACY_NOTICE } from "../data/defaults";
import { toneRules } from "../data/toneRules";
import type { FaqFormData, FaqResult, FaqTopic } from "../types/faq";

const clean = (value: string) => value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();

const safe = (value: unknown) => {
  if (typeof value !== "string") return FALLBACK_TEXT;
  const text = value.trim();
  return !text || text === "undefined" || text === "null" || text === "NaN" ? FALLBACK_TEXT : text;
};

const question = (value: string) => {
  const text = safe(value);
  return text.startsWith("Q.") ? text : `Q. ${text}`;
};

const appendBlock = (text: string, label: string, value: string) => {
  const cleaned = clean(value);
  return cleaned ? `${safe(text)}\n\n[${label}]\n${cleaned}` : safe(text);
};

const withExtraNotice = (text: string, form: FaqFormData) => appendBlock(text, "학교별 추가 안내사항", form.extraNotice);

const schoolContextLines = (form: FaqFormData) => {
  const lines = [
    clean(form.officeHours) ? `보건실 이용 시간: ${clean(form.officeHours)}` : "",
    clean(form.visitProcedure) ? `수업 중 방문 절차: ${clean(form.visitProcedure)}` : "",
    form.teacherCheck ? `담임/교과교사 확인: ${form.teacherCheck}` : "",
    clean(form.guardianContactPolicy) ? `보호자 연락 기준: ${clean(form.guardianContactPolicy)}` : "",
    clean(form.medicationPolicy) ? `약품 제공 기준: ${clean(form.medicationPolicy)}` : "",
    clean(form.bedRestPolicy) ? `침상 이용 기준: ${clean(form.bedRestPolicy)}` : "",
  ].filter(Boolean);

  return lines.length ? `\n\n[학교별 확인]\n${lines.join("\n")}` : "";
};

const useToneAsReferenceOnly = (form: FaqFormData) => {
  void toneRules[form.tone];
};

export function generateFaqResult(topic: FaqTopic, form: FaqFormData): FaqResult {
  useToneAsReferenceOnly(form);

  const customQuestion = clean(form.customQuestion ?? "");
  const title = topic.topicId === "faq_013" && customQuestion ? customQuestion : topic.questionTitle;
  const schoolContext = schoolContextLines(form);
  const homeroomReference = "담임 안내 시 참고: 보호자에게 안내가 필요한 경우 담임교사를 통해 안내하고, 출결·증빙자료·귀가·병원 진료·검진 미참여 등은 학교 기준에 따라 담임교사와 확인해 주세요. 보건실은 증상 확인과 일반 안내를 지원하며, 최종 처리는 학교 기준에 따라 확인이 필요합니다.";
  const caution = `주의할 표현: ${safe(topic.cautionExpression)}. ${safe(topic.variableKey)} 관련 내용은 학교 기준에 맞게 조정해 주세요.`;

  return {
    questionTitle: question(title),
    studentAnswer: withExtraNotice(`${safe(topic.studentAnswer)}${schoolContext}`, form),
    homeroomGuide: withExtraNotice(`${safe(topic.homeroomGuide)}\n\n${homeroomReference}${schoolContext}`, form),
    staffGuide: withExtraNotice(`${safe(topic.staffGuide)}\n\n${caution}${schoolContext}`, form),
    shortNotice: withExtraNotice(`${safe(topic.shortNotice)} 학교 기준에 따라 확인해 주세요.`, form),
    onlinePost: withExtraNotice(`${safe(topic.onlinePost)}\n\n[학교별 확인]\n생성 문구는 학교 규정과 보건실 운영 방침에 맞게 검토 후 사용해 주세요.${schoolContext.replace("\n\n[학교별 확인]\n", "\n")}`, form),
    frontNotice: withExtraNotice(`${safe(topic.frontNotice)}\n학교 규정과 보건실 운영 방침에 맞게 검토 후 사용해 주세요.`, form),
    misunderstanding: withExtraNotice(safe(topic.misunderstanding), form),
    privacyNotice: RESULT_PRIVACY_NOTICE,
  };
}