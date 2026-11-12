export type EducationStage =
  | '小学'
  | '初中'
  | '高中'
  | '中职'
  | '大学';

export const EDUCATION_STAGES: EducationStage[] = [
  '小学',
  '初中',
  '高中',
  '中职',
  '大学',
];

export type PrivacyScope = 'public' | 'class_only' | 'private';

export const PRIVACY_LABELS: Record<PrivacyScope, string> = {
  public: '公开',
  class_only: '仅班级成员',
  private: '仅自己可见',
};

export interface Region {
  province: string;
  city: string;
}

export interface School {
  id: string;
  name: string;
  region: Region;
  stages: EducationStage[];
  description: string;
  foundedYear?: number;
}

export interface ClassArchive {
  id: string;
  schoolId: string;
  stage: EducationStage;
  graduationYear: number;
  className: string;
  motto?: string;
  memberCount: number;
}

export interface Photo {
  id: string;
  classId: string;
  schoolId: string;
  title: string;
  description: string;
  takenAt: string;
  category: '毕业照' | '校园风景' | '活动合影' | '其他';
  privacy: PrivacyScope;
  uploadedBy: string;
  imageUrl: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  joinedClassIds: string[];
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  username: string;
  displayName: string;
}

export interface AppState {
  schools: School[];
  classes: ClassArchive[];
  photos: Photo[];
  users: UserAccount[];
  version: number;
}

export interface SearchFilters {
  query: string;
  province: string;
  city: string;
  stage: EducationStage | '';
  graduationYear: string;
  className: string;
}
