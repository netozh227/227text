import type {
  ClassArchive,
  Photo,
  School,
  SearchFilters,
  PrivacyScope,
} from '../types';

export function uniqueProvinces(schools: School[]): string[] {
  return [...new Set(schools.map((s) => s.region.province))].sort();
}

export { citiesForProvince } from '../data/chinaCities';

export function filterSchools(schools: School[], filters: SearchFilters): School[] {
  const q = filters.query.trim().toLowerCase();
  return schools.filter((s) => {
    if (filters.province && s.region.province !== filters.province) return false;
    if (filters.city && s.region.city !== filters.city) return false;
    if (filters.stage && !s.stages.includes(filters.stage)) return false;
    if (q && !s.name.toLowerCase().includes(q) && !s.description.includes(filters.query))
      return false;
    return true;
  });
}

export function filterClasses(
  classes: ClassArchive[],
  filters: SearchFilters,
  schoolIds?: Set<string>,
): ClassArchive[] {
  const q = filters.query.trim().toLowerCase();
  return classes.filter((c) => {
    if (schoolIds && !schoolIds.has(c.schoolId)) return false;
    if (filters.stage && c.stage !== filters.stage) return false;
    if (filters.graduationYear && String(c.graduationYear) !== filters.graduationYear)
      return false;
    if (
      filters.className &&
      !c.className.toLowerCase().includes(filters.className.toLowerCase())
    )
      return false;
    if (
      q &&
      !c.className.toLowerCase().includes(q) &&
      !String(c.graduationYear).includes(q)
    )
      return false;
    return true;
  });
}

export function canViewPhoto(
  photo: Photo,
  viewerUserId: string | null,
  joinedClassIds: string[],
): boolean {
  if (photo.privacy === 'public') return true;
  if (photo.privacy === 'private') {
    return viewerUserId !== null && photo.uploadedBy === viewerUserId;
  }
  if (photo.privacy === 'class_only') {
    return joinedClassIds.includes(photo.classId);
  }
  return false;
}

export function visiblePhotos(
  photos: Photo[],
  viewerUserId: string | null,
  joinedClassIds: string[],
  classId?: string,
  schoolId?: string,
): Photo[] {
  return photos.filter((p) => {
    if (classId && p.classId !== classId) return false;
    if (schoolId && p.schoolId !== schoolId) return false;
    return canViewPhoto(p, viewerUserId, joinedClassIds);
  });
}

export function graduationYears(classes: ClassArchive[]): number[] {
  return [...new Set(classes.map((c) => c.graduationYear))].sort((a, b) => b - a);
}

export function privacyLabel(scope: PrivacyScope): string {
  const map = { public: '公开', class_only: '仅班级成员', private: '仅自己可见' };
  return map[scope];
}
