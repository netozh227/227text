import { describe, expect, it } from 'vitest';
import { seedData } from '../data/seedData';
import {
  canViewPhoto,
  citiesForProvince,
  filterClasses,
  filterSchools,
} from '../lib/search';
import type { SearchFilters } from '../types';

const baseFilters: SearchFilters = {
  query: '',
  province: '',
  city: '',
  stage: '',
  graduationYear: '',
  className: '',
};

describe('search helpers', () => {
  it('lists all cities when no province is selected', () => {
    const all = citiesForProvince('');
    expect(all.length).toBeGreaterThan(300);
    expect(all).toContain('杭州市');
    expect(all).toContain('广州市');
  });

  it('lists only cities in the selected province', () => {
    const zj = citiesForProvince('浙江省');
    expect(zj).toContain('杭州市');
    expect(zj).not.toContain('南京市');
  });

  it('filters schools by province and stage', () => {
    const schools = filterSchools(seedData.schools, {
      ...baseFilters,
      province: '浙江省',
      stage: '小学',
    });
    expect(schools).toHaveLength(1);
    expect(schools[0].name).toContain('胜利');
  });

  it('filters classes by graduation year', () => {
    const classes = filterClasses(seedData.classes, {
      ...baseFilters,
      graduationYear: '2022',
    });
    expect(classes).toHaveLength(1);
    expect(classes[0].stage).toBe('大学');
  });

  it('respects photo privacy for class-only items', () => {
    const photo = {
      ...seedData.photos[0],
      privacy: 'class_only' as const,
    };
    expect(canViewPhoto(photo, null, [])).toBe(false);
    expect(canViewPhoto(photo, 'u1', [photo.classId])).toBe(true);
  });
});
