import { API_URL, FALLBACK_TEXT, RESULT_PRIVACY_NOTICE } from "../data/defaults";
import { fallbackRelatedTools, fallbackTopics } from "../data/fallbackData";
import type { AppData, FaqTopic, RelatedTool } from "../types/faq";

const requiredOrder = [
  ["faq_001", "보건실 기본 이용", "Q. 보건실은 언제 이용할 수 있나요?"],
  ["faq_002", "수업 중 보건실 방문·출결", "Q. 수업 중 보건실에 가면 출석 처리는 어떻게 되나요?"],
  ["faq_003", "침상 안정·귀가", "Q. 보건실 침대에서 쉬거나 조퇴할 수 있나요?"],
  ["faq_004", "약품 제공", "Q. 머리 아프거나 배 아플 때 바로 약을 받을 수 있나요?"],
  ["faq_005", "생리통·비상용 생리대", "Q. 생리통이 심하거나 생리대가 없으면 어떻게 하나요?"],
  ["faq_006", "셀프처치대 이용", "Q. 밴드나 물품만 필요할 때는 어떻게 하나요?"],
  ["faq_007", "응급상황·보호자 연락", "Q. 어떤 경우에 보호자에게 연락하나요?"],
  ["faq_008", "병원 진료 권유", "Q. 보건실에서 병원에 가보라고 하면 꼭 가야 하나요?"],
  ["faq_009", "감염병 의심 증상", "Q. 열이 나거나 감염병 증상이 있으면 어떻게 하나요?"],
  ["faq_010", "감염병 출결·증빙", "Q. 감염병으로 결석하면 출석 인정이 되나요?"],
  ["faq_011", "결핵검진 안내", "Q. 결핵검진은 꼭 받아야 하나요?"],
  ["faq_012", "결핵검진 미참여·결과", "Q. 결핵검진을 못 받았거나 결과 안내를 받으면 어떻게 하나요?"],
  ["faq_013", "직접 입력", "Q. 직접 입력한 질문"],
] as const;

type Row = Record<string, unknown>;
const safe = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : "");
const byId = (rows: Row[] | undefined): Map<string, Row> => {
  const result = new Map<string, Row>();
  for (const row of rows ?? []) {
    const id = safe(row.topicId);
    if (id) result.set(id, row);
  }
  return result;
};
const first = (...values: unknown[]) => values.map(safe).find(Boolean) ?? FALLBACK_TEXT;

const specialAudience: Record<string, Pick<FaqTopic, "studentAnswer" | "homeroomGuide" | "staffGuide">> = {
  faq_006: {
    studentAnswer: "가벼운 상처 처치나 밴드 등 간단한 물품이 필요할 때는 셀프처치대를 이용할 수 있습니다. 사용 후에는 주변을 정리하고, 물품은 필요한 만큼만 사용해 주세요.",
    homeroomGuide: "학생이 간단한 물품 사용만 필요한 경우 셀프처치대 이용을 안내할 수 있습니다. 다만 통증이 심하거나 처치가 필요한 상황은 보건실 확인이 필요합니다.",
    staffGuide: "셀프처치대는 가벼운 상처 처치와 간단한 물품 사용을 위한 공간입니다. 사용 후 정리와 물품 반납이 이루어질 수 있도록 함께 안내해 주세요.",
  },
  faq_007: {
    studentAnswer: "응급상황이거나 귀가, 병원 진료가 필요하다고 판단되는 경우 보호자에게 연락할 수 있습니다. 몸 상태가 갑자기 나빠지면 혼자 참지 말고 가까운 선생님이나 보건실에 알려 주세요.",
    homeroomGuide: "귀가, 병원 진료, 응급상황 등 보호자 연락이 필요한 경우 보건실과 담임교사가 상황을 공유해 안내합니다. 보호자에게 안내가 필요한 경우 담임교사를 통해 학생 상태와 학교에서 확인한 절차를 중심으로 안내해 주세요.",
    staffGuide: "응급상황이 의심되는 경우 지체 없이 보건실과 관리자에게 공유해 주세요. 보호자 연락, 119 신고, 병원 이송 등은 학교 응급대응 절차에 따라 진행됩니다.",
  },
  faq_008: {
    studentAnswer: "보건실에서 병원 진료를 권유하는 것은 증상이 계속되거나 학교에서 확인하기 어려운 상태가 있을 때입니다. 정확한 진단과 치료는 의료기관에서 받아야 합니다.",
    homeroomGuide: "보건실에서 병원 진료를 권유한 경우 학생 상태가 지속 관찰 또는 의료기관 확인이 필요한 상황일 수 있습니다. 보호자에게 안내가 필요한 경우 담임 안내 절차에 따라 증상과 진료 권유 사유를 전달해 주세요.",
    staffGuide: "보건실은 의료기관이 아니므로 진단이나 치료를 대신할 수 없습니다. 증상이 지속되거나 악화되는 경우 의료기관 이용을 권유할 수 있음을 교직원이 함께 이해해 주세요.",
  },
  faq_009: {
    studentAnswer: "열, 기침, 인후통, 설사, 발진 등 감염병이 의심되는 증상이 있으면 보건실이나 가까운 선생님께 알려 주세요. 필요하면 보호자 연락, 귀가, 병원 진료 안내가 이루어질 수 있습니다.",
    homeroomGuide: "감염병 의심 증상이 있는 학생은 보건실 확인 후 학교 기준에 따라 보호자 연락, 귀가, 진료 안내가 필요할 수 있습니다. 담임교사는 학생의 증상, 출결 상황, 보호자 연락 여부를 함께 확인해 주세요.",
    staffGuide: "감염병 의심 증상은 학급 내 확산 예방과 관련되므로 신속한 공유가 필요합니다. 다만 확진 여부는 의료기관에서 판단하며, 보건실은 증상 확인과 학교 절차 안내를 지원합니다.",
  },
  faq_010: {
    studentAnswer: "감염병으로 결석, 지각, 조퇴를 하는 경우 출결은 학교 기준과 증빙자료 확인 절차에 따라 처리됩니다. 필요한 서류는 담임 선생님 안내에 따라 제출해 주세요.",
    homeroomGuide: "감염병 관련 결석·지각·조퇴는 학교 출결 기준과 증빙자료 확인 절차에 따라 처리될 수 있도록 안내해 주세요. 보호자에게 안내가 필요한 경우 담임교사를 통해 증상, 진료 여부, 등교 가능 시점, 제출 서류를 확인하도록 안내하면 좋습니다.",
    staffGuide: "감염병 관련 출결은 보건실 방문만으로 자동 결정되지 않습니다. 보건실은 증상 확인과 일반 안내를 지원하며, 출결 최종 처리는 학교 기준과 증빙자료 확인 절차에 따라 이루어집니다.",
  },
  faq_011: {
    studentAnswer: "결핵검진 대상 학생은 안내된 일정과 장소에 따라 검진을 받아야 합니다. 검진 당일 결석하거나 부득이하게 참여하지 못한 경우에는 학교에서 안내하는 미검자 절차를 확인해 주세요.",
    homeroomGuide: "결핵검진 대상 학생이 정해진 시간에 검진을 받을 수 있도록 학급 이동과 출석 상황을 확인해 주세요. 결석, 조퇴, 이동수업 등으로 검진을 받지 못한 학생은 보건실과 공유해 주세요.",
    staffGuide: "결핵검진은 대상 학생의 건강 확인과 감염병 예방 관리를 위해 실시됩니다. 검진 장소 이동, 학급 순서, 미검자 확인 과정에서 교직원의 협조가 필요합니다.",
  },
  faq_012: {
    studentAnswer: "결핵검진을 받지 못한 경우 학교에서 안내하는 미검자 절차를 확인해야 합니다. 검진 결과 추가 확인이 필요한 경우에는 담임교사를 통해 개별 안내가 필요할 수 있으며, 결과는 공개적으로 이야기하지 않습니다.",
    homeroomGuide: "결핵검진 미참여 학생은 결석, 조퇴, 이동수업, 기타 사유를 확인하여 보건실과 공유해 주세요. 검진 결과와 관련된 세부 건강정보는 개인정보에 해당하므로 공개된 메신저나 학급 전체 안내에서 언급하지 않도록 유의해 주세요.",
    staffGuide: "결핵검진 결과는 학생 건강정보에 해당하므로 필요한 범위에서만 안내됩니다. 미검자 확인과 추가 안내 과정에서 개인정보가 공개되지 않도록 주의해 주세요.",
  },
  faq_013: {
    studentAnswer: "궁금한 내용은 개인정보나 민감정보를 제외하고 질문해 주세요. 학생 이름, 학번, 진단명, 상담 내용 등은 입력하거나 공개하지 않습니다.",
    homeroomGuide: "직접 입력 질문을 바탕으로 담임 안내 문구를 만들 때도 개별 학생의 건강정보는 포함하지 않습니다. 학교 기준과 절차 중심으로 안내해 주세요.",
    staffGuide: "직접 입력 문구는 일반 안내용으로만 사용합니다. 개별 학생 사례, 진단명, 상담 내용, 건강검진 결과 등 민감정보가 포함되지 않도록 확인해 주세요.",
  },
};

export async function fetchFaqData(): Promise<AppData> {
  const response = await fetch(API_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("FAQ 데이터를 불러오지 못했습니다.");
  const raw = await response.json();
  return normalizeApiData(raw);
}

export function normalizeApiData(raw: any): AppData {
  const sheets = raw?.sheets ?? {};
  const base = byId(sheets.baseTemplates);
  const posts = byId(sheets.postTemplates);
  const misunderstands = byId(sheets.misunderstandingTexts);
  const seed = new Map(fallbackTopics.map((topic) => [topic.topicId, topic]));

  const topics = requiredOrder.map(([topicId, topicName, questionTitle]) => {
    const fallback = seed.get(topicId);
    const baseRow = base.get(topicId) ?? {};
    const postRow = posts.get(topicId) ?? {};
    const misRow = misunderstands.get(topicId) ?? {};
    const audience = fallback ?? specialAudience[topicId];
    return {
      topicId,
      topicName: first(postRow["FAQ 주제"], fallback?.topicName, topicName),
      questionTitle: first(fallback?.questionTitle, questionTitle),
      coreMessage: first(baseRow["핵심 안내 문장"], fallback?.coreMessage),
      defaultPolicy: first(baseRow["기본 운영 원칙"], fallback?.defaultPolicy),
      variableKey: first(baseRow["추가 안내 연결 변수"], fallback?.variableKey),
      cautionExpression: first(baseRow["주의할 표현"], fallback?.cautionExpression),
      studentAnswer: first(audience?.studentAnswer),
      homeroomGuide: first(audience?.homeroomGuide),
      staffGuide: first(audience?.staffGuide),
      shortNotice: first(postRow["짧은 게시문"], fallback?.shortNotice),
      onlinePost: first(postRow["온라인 보건실 게시용 문구"], fallback?.onlinePost),
      frontNotice: first(postRow["보건실 앞 안내문 문구"], fallback?.frontNotice),
      misunderstanding: first(misRow["오해 방지 문구"], fallback?.misunderstanding),
      privacyNotice: RESULT_PRIVACY_NOTICE,
    } satisfies FaqTopic;
  });

  const relatedTools = (sheets.relatedTools ?? []).map((row: Row) => ({
    toolName: first(row["도구명"]),
    description: first(row["설명"]),
    buttonLabel: first(row["버튼 문구"]),
    link: safe(row["링크"]) === "링크 입력" ? "#" : safe(row["링크"]) || "#",
  })).filter((tool: RelatedTool) => tool.toolName !== FALLBACK_TEXT);

  return { topics, relatedTools: relatedTools.length ? relatedTools : fallbackRelatedTools, updatedAt: safe(raw?.updatedAt) };
}

