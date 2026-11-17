import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import { SearchPanel } from '../components/SearchPanel';
import { ClassCard } from '../components/ClassCard';
import { PhotoCard } from '../components/PhotoCard';
import type { SearchFilters } from '../types';
import {
  filterClasses,
  filterSchools,
  visiblePhotos,
} from '../lib/search';

const emptyFilters: SearchFilters = {
  query: '',
  province: '',
  city: '',
  stage: '',
  graduationYear: '',
  className: '',
};

export function HomePage() {
  const { state, session, joinedClassIds } = useApp();
  const [filters, setFilters] = useState<SearchFilters>(emptyFilters);

  const schools = useMemo(
    () => filterSchools(state.schools, filters),
    [state.schools, filters],
  );
  const schoolIdSet = useMemo(() => new Set(schools.map((s) => s.id)), [schools]);

  const classes = useMemo(
    () => filterClasses(state.classes, filters, schoolIdSet),
    [state.classes, filters, schoolIdSet],
  );

  const photos = useMemo(
    () =>
      visiblePhotos(
        state.photos,
        session?.userId ?? null,
        joinedClassIds,
      ).filter((p) => {
        if (!schoolIdSet.has(p.schoolId)) return false;
        const classIds = new Set(classes.map((c) => c.id));
        return classIds.has(p.classId);
      }),
    [state.photos, session, joinedClassIds, schoolIdSet, classes],
  );

  return (
    <div className="page home-page">
      <section className="hero">
        <p className="eyebrow">找回学生时代的影响档案</p>
        <h1>毕业照档案馆</h1>
        <p className="lead">
          小学、初中、高中、中职与大学——按学校、地区、届别与班级，共同收录毕业照与校园记忆。
        </p>
      </section>

      <SearchPanel filters={filters} onChange={setFilters} />

      <section className="results-section">
        <h2 className="section-title">学校</h2>
        {schools.length === 0 ? (
          <p className="empty">没有符合筛选条件的学校。</p>
        ) : (
          <ul className="school-list">
            {schools.map((s) => (
              <li key={s.id}>
                <Link to={`/schools/${s.id}`} className="school-row card">
                  <div>
                    <h3>{s.name}</h3>
                    <p className="muted">
                      {s.region.province} · {s.region.city} ·{' '}
                      {s.stages.join(' / ')}
                    </p>
                  </div>
                  <span className="chevron" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="results-section">
        <h2 className="section-title">班级档案</h2>
        <div className="card-grid">
          {classes.map((c) => (
            <ClassCard
              key={c.id}
              cls={c}
              school={state.schools.find((s) => s.id === c.schoolId)}
            />
          ))}
        </div>
      </section>

      <section className="results-section">
        <h2 className="section-title">精选照片</h2>
        <div className="photo-grid">
          {photos.slice(0, 8).map((p) => (
            <PhotoCard key={p.id} photo={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
