import type { Audience, FaqFormData, SchoolLevel, TeacherCheck, Tone } from "../types/faq";

const DEFAULT_API_URL = "https://script.google.com/macros/s/AKfycbzpYNcrr8uhvbTiOlelfVoBMJD7A1hf2tuwRp2rn9VbQ90TLko4x1qnEHS2iZLT39V-/exec";
export const API_URL = import.meta.env.VITE_FAQ_API_URL || DEFAULT_API_URL;
export const FALLBACK_TEXT = "해당 문구는 학교 기준에 맞게 작성해 주세요.";
export const PRIVACY_NOTICE = "이 도구에는 학생 이름, 학번, 반번호, 질병명, 진단명, 상담 내용, 건강검진 결과 등 개인정보와 민감정보를 입력하지 마세요. 입력한 내용은 저장되지 않으며, 생성된 문구는 학교 규정과 보건실 운영 방침에 맞게 검토 후 사용해 주세요.";
export const RESULT_PRIVACY_NOTICE = "개인정보와 민감정보는 입력하지 마세요.\n입력 내용은 저장되지 않으며 화면에서만 사용됩니다.\n학교 규정과 보건실 운영 방침에 맞게 검토 후 사용하세요.";

export const audienceOptions: Audience[] = ["학생", "담임교사", "교직원", "전체"];
export const schoolLevelOptions: SchoolLevel[] = ["초등학교", "중학교", "고등학교", "전체"];
export const toneOptions: Tone[] = ["부드럽게", "단호하게", "공지형", "학생 눈높이", "담임 전달형"];
export const teacherCheckOptions: TeacherCheck[] = ["필요", "선택", "학교 기준에 따름"];

export const initialFormData: FaqFormData = {
  topic: "faq_002",
  audience: "전체",
  schoolLevel: "전체",
  tone: "부드럽게",
  officeHours: "쉬는 시간, 점심시간, 응급상황 시",
  visitProcedure: "수업 중에는 교과 선생님께 먼저 알린 뒤 보건실 방문",
  teacherCheck: "학교 기준에 따름",
  guardianContactPolicy: "응급상황, 귀가, 병원 진료 권유 등 학교 기준에 따라 필요할 때",
  medicationPolicy: "학생 상태 확인 후 학교 기준에 따라 제한적으로 제공",
  bedRestPolicy: "일시적인 안정이 필요한 경우 학교 기준에 따라 제한적으로 이용",
  extraNotice: "",
  customQuestion: "",
};
