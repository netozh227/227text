import type { AppState, EducationStage } from '../types';
import { gradientPlaceholder } from '../lib/placeholders';

export const STORAGE_VERSION = 1;

function buildSeed(): AppState {
  const schools = [
    {
      id: 'sch-hz-primary',
      name: '杭州市胜利小学',
      region: { province: '浙江省', city: '杭州市' },
      stages: ['小学'] as EducationStage[],
      description: '创办于上世纪四十年代的市属小学，校友遍布大江南北。',
      foundedYear: 1947,
    },
    {
      id: 'sch-nj-middle',
      name: '南京市第一中学',
      region: { province: '江苏省', city: '南京市' },
      stages: ['初中', '高中'] as EducationStage[],
      description: '梧桐夹道的百年名校，记录着几代学子的青春。',
      foundedYear: 1907,
    },
    {
      id: 'sch-cd-voc',
      name: '成都市财贸职业高级中学',
      region: { province: '四川省', city: '成都市' },
      stages: ['中职'] as EducationStage[],
      description: '培养技能人才的摇篮，班级合影里总带着实训楼的背景。',
      foundedYear: 1958,
    },
    {
      id: 'sch-wh-univ',
      name: '武汉大学',
      region: { province: '湖北省', city: '武汉市' },
      stages: ['大学'] as EducationStage[],
      description: '珞珈山下，樱花与毕业照同等驰名。',
      foundedYear: 1893,
    },
    {
      id: 'sch-gz-high',
      name: '华南师范大学附属中学',
      region: { province: '广东省', city: '广州市' },
      stages: ['高中'] as EducationStage[],
      description: '珠江畔的学府，走廊里挂满历届毕业合影。',
      foundedYear: 1952,
    },
  ];

  const classes = [
    {
      id: 'cls-hz-p-2014',
      schoolId: 'sch-hz-primary',
      stage: '小学' as const,
      graduationYear: 2014,
      className: '六年三班',
      motto: '博学笃行',
      memberCount: 42,
    },
    {
      id: 'cls-nj-m-2018',
      schoolId: 'sch-nj-middle',
      stage: '初中' as const,
      graduationYear: 2018,
      className: '初三（7）班',
      motto: '乘风好去',
      memberCount: 48,
    },
    {
      id: 'cls-nj-h-2020',
      schoolId: 'sch-nj-middle',
      stage: '高中' as const,
      graduationYear: 2020,
      className: '高三12班',
      memberCount: 45,
    },
    {
      id: 'cls-gz-h-2016',
      schoolId: 'sch-gz-high',
      stage: '高中' as const,
      graduationYear: 2016,
      className: '2016届7班',
      memberCount: 50,
    },
    {
      id: 'cls-cd-v-2019',
      schoolId: 'sch-cd-voc',
      stage: '中职' as const,
      graduationYear: 2019,
      className: '会计173班',
      motto: '精算未来',
      memberCount: 38,
    },
    {
      id: 'cls-wh-u-2022',
      schoolId: 'sch-wh-univ',
      stage: '大学' as const,
      graduationYear: 2022,
      className: '新闻学1801',
      memberCount: 32,
    },
  ];

  const photoSpecs: Array<{
    id: string;
    classId: string;
    schoolId: string;
    title: string;
    category: '毕业照' | '校园风景' | '活动合影' | '其他';
    year: number;
    seed: number;
  }> = [
    {
      id: 'ph-hz-1',
      classId: 'cls-hz-p-2014',
      schoolId: 'sch-hz-primary',
      title: '2014届六年三班毕业合影',
      category: '毕业照',
      year: 2014,
      seed: 1,
    },
    {
      id: 'ph-hz-2',
      classId: 'cls-hz-p-2014',
      schoolId: 'sch-hz-primary',
      title: '操场运动会开幕式',
      category: '活动合影',
      year: 2013,
      seed: 2,
    },
    {
      id: 'ph-nj-m-1',
      classId: 'cls-nj-m-2018',
      schoolId: 'sch-nj-middle',
      title: '初三（7）班毕业照',
      category: '毕业照',
      year: 2018,
      seed: 3,
    },
    {
      id: 'ph-nj-h-1',
      classId: 'cls-nj-h-2020',
      schoolId: 'sch-nj-middle',
      title: '高考前夕教学楼天台合影',
      category: '活动合影',
      year: 2020,
      seed: 4,
    },
    {
      id: 'ph-gz-1',
      classId: 'cls-gz-h-2016',
      schoolId: 'sch-gz-high',
      title: '2016届7班全班毕业照',
      category: '毕业照',
      year: 2016,
      seed: 5,
    },
    {
      id: 'ph-gz-2',
      classId: 'cls-gz-h-2016',
      schoolId: 'sch-gz-high',
      title: '木棉花开时的校门',
      category: '校园风景',
      year: 2015,
      seed: 6,
    },
    {
      id: 'ph-cd-1',
      classId: 'cls-cd-v-2019',
      schoolId: 'sch-cd-voc',
      title: '会计173班实训楼前合影',
      category: '毕业照',
      year: 2019,
      seed: 7,
    },
    {
      id: 'ph-wh-1',
      classId: 'cls-wh-u-2022',
      schoolId: 'sch-wh-univ',
      title: '樱花大道上的学位服合影',
      category: '毕业照',
      year: 2022,
      seed: 8,
    },
    {
      id: 'ph-wh-2',
      classId: 'cls-wh-u-2022',
      schoolId: 'sch-wh-univ',
      title: '图书馆通宵复习周',
      category: '其他',
      year: 2021,
      seed: 9,
    },
  ];

  const photos = photoSpecs.map((p, i) => ({
    id: p.id,
    classId: p.classId,
    schoolId: p.schoolId,
    title: p.title,
    description: `来自示例档案的第 ${i + 1} 张影像，记录校园时光的片段。`,
    takenAt: `${p.year}-06-15`,
    category: p.category,
    privacy: 'public' as const,
    uploadedBy: 'system-seed',
    imageUrl: gradientPlaceholder(p.seed, p.title),
    createdAt: new Date(p.year, 5, 15).toISOString(),
  }));

  return {
    schools: schools.map((s) => ({
      ...s,
      stages: [...s.stages],
    })),
    classes,
    photos,
    users: [],
    version: STORAGE_VERSION,
  };
}

export const seedData = buildSeed();
