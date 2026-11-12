import { Link, useParams } from 'react-router-dom';
import { useApp, useSchool } from '../context/AppProvider';
import { ClassCard } from '../components/ClassCard';
import { PhotoCard } from '../components/PhotoCard';
import { visiblePhotos } from '../lib/search';

export function SchoolPage() {
  const { schoolId = '' } = useParams();
  const school = useSchool(schoolId);
  const { state, session, joinedClassIds } = useApp();

  if (!school) {
    return (
      <div className="page empty-state">
        <h1>未找到该学校</h1>
        <Link to="/" className="btn primary">
          返回首页
        </Link>
      </div>
    );
  }

  const classes = state.classes.filter((c) => c.schoolId === schoolId);
  const photos = visiblePhotos(
    state.photos,
    session?.userId ?? null,
    joinedClassIds,
    undefined,
    schoolId,
  );

  return (
    <div className="page school-page">
      <nav className="breadcrumb">
        <Link to="/">首页</Link>
        <span>/</span>
        <span>{school.name}</span>
      </nav>
      <header className="school-hero card">
        <p className="eyebrow">
          {school.region.province} · {school.region.city}
        </p>
        <h1>{school.name}</h1>
        <p>{school.description}</p>
        <div className="chip-row">
          {school.stages.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
          {school.foundedYear && (
            <span className="chip muted-chip">建校 {school.foundedYear}</span>
          )}
        </div>
      </header>

      <section>
        <h2 className="section-title">班级档案库</h2>
        <div className="card-grid">
          {classes.map((c) => (
            <ClassCard key={c.id} cls={c} school={school} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">校园影像</h2>
        <div className="photo-grid">
          {photos.map((p) => (
            <PhotoCard key={p.id} photo={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
