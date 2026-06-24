export type Audience = "학생" | "담임교사" | "교직원" | "전체";
export type SchoolLevel = "초등학교" | "중학교" | "고등학교" | "전체";
export type Tone = "부드럽게" | "단호하게" | "공지형" | "학생 눈높이" | "담임 전달형";
export type TeacherCheck = "필요" | "선택" | "학교 기준에 따름";

export type FaqFormData = {
  topic: string;
  audience: Audience;
  schoolLevel: SchoolLevel;
  tone: Tone;
  officeHours: string;
  visitProcedure: string;
  teacherCheck: TeacherCheck;
  guardianContactPolicy: string;
  medicationPolicy: string;
  bedRestPolicy: string;
  extraNotice: string;
  customQuestion?: string;
};

export type FaqResult = {
  questionTitle: string;
  studentAnswer: string;
  homeroomGuide: string;
  staffGuide: string;
  shortNotice: string;
  onlinePost: string;
  frontNotice: string;
  misunderstanding: string;
  privacyNotice: string;
};

export type FaqTopic = FaqResult & {
  topicId: string;
  topicName: string;
  coreMessage: string;
  defaultPolicy: string;
  variableKey: string;
  cautionExpression: string;
};

export type RelatedTool = {
  toolName: string;
  description: string;
  buttonLabel: string;
  link: string;
};

export type AppData = {
  topics: FaqTopic[];
  relatedTools: RelatedTool[];
  updatedAt?: string;
};
