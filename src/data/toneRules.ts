import type { Tone } from "../types/faq";

export type ToneRule = {
  code: "tone_soft" | "tone_firm" | "tone_notice" | "tone_student" | "tone_homeroom";
  description: string;
  emphasis: string[];
};

export const toneRules: Record<Tone, ToneRule> = {
  부드럽게: {
    code: "tone_soft",
    description: "부담을 낮추고 협조를 요청하는 표현을 참고합니다.",
    emphasis: ["확인해 주세요", "도움을 요청해 주세요", "안내할 수 있습니다"],
  },
  단호하게: {
    code: "tone_firm",
    description: "운영 기준과 절차가 분명히 보이도록 참고합니다.",
    emphasis: ["학교 기준에 따라", "반드시", "제한적으로"],
  },
  공지형: {
    code: "tone_notice",
    description: "게시용 공지처럼 짧고 명확한 표현을 참고합니다.",
    emphasis: ["안내합니다", "확인 바랍니다", "유의해 주세요"],
  },
  "학생 눈높이": {
    code: "tone_student",
    description: "학생이 이해하기 쉬운 표현을 참고합니다.",
    emphasis: ["먼저 선생님께 말해 주세요", "혼자 참지 마세요", "확인해 주세요"],
  },
  "담임 전달형": {
    code: "tone_homeroom",
    description: "담임 안내 시 참고할 절차와 확인 기준을 중심으로 참고합니다.",
    emphasis: ["담임 안내 시 참고", "학교 기준에 따라 확인", "담임교사를 통해 안내"],
  },
};