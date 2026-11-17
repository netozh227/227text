import type { SearchFilters } from '../types';
import { EDUCATION_STAGES } from '../types';
import { CHINA_PROVINCES } from '../data/chinaProvinces';
import { citiesForProvince, graduationYears } from '../lib/search';
interface SearchPanelProps {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
}

export function SearchPanel({
  filters,
  onChange,
}: SearchPanelProps) {
  const provinces = CHINA_PROVINCES;
  const cities = citiesForProvince(filters.province);
  const years = graduationYears();

  const set = (partial: Partial<SearchFilters>) =>
    onChange({ ...filters, ...partial });

  return (
    <section className="search-panel card">
      <h2 className="section-title">按条件查找</h2>
      <div className="search-grid">
        <label className="field">
          <span>关键词</span>
          <input
            type="search"
            placeholder="学校名、班级…"
            value={filters.query}
            onChange={(e) => set({ query: e.target.value })}
          />
        </label>
        <label className="field">
          <span>省份</span>
          <select
            value={filters.province}
            onChange={(e) => set({ province: e.target.value, city: '' })}
          >
            <option value="">全部</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>城市</span>
          <select
            value={filters.city}
            onChange={(e) => set({ city: e.target.value })}
          >
            <option value="">全部</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>教育阶段</span>
          <select
            value={filters.stage}
            onChange={(e) =>
              set({ stage: e.target.value as SearchFilters['stage'] })
            }
          >
            <option value="">全部</option>
            {EDUCATION_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>入学年份</span>
          <select
            value={filters.graduationYear}
            onChange={(e) => set({ graduationYear: e.target.value })}
          >
            <option value="">全部</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>班级名称</span>
          <input
            type="text"
            placeholder="如：高三12班"
            value={filters.className}
            onChange={(e) => set({ className: e.target.value })}
          />
        </label>
      </div>
      <button
        type="button"
        className="btn text"
        onClick={() =>
          onChange({
            query: '',
            province: '',
            city: '',
            stage: '',
            graduationYear: '',
            className: '',
          })
        }
      >
        清除筛选
      </button>
    </section>
  );
}
