import { Link } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import { ClassCard } from '../components/ClassCard';
import { PhotoCard } from '../components/PhotoCard';
import { visiblePhotos } from '../lib/search';

export function MyClassesPage() {
  const { state, session, isLoggedIn, joinedClassIds } = useApp();

  if (!isLoggedIn || !session) {
    return (
      <div className="page empty-state">
        <h1>我的班级</h1>
        <p>登录后即可查看已加入的班级与上传记录。</p>
        <Link to="/login" className="btn primary">
          登录
        </Link>
      </div>
    );
  }

  const myClasses = state.classes.filter((c) =>
    joinedClassIds.includes(c.id),
  );
  const myPhotos = state.photos.filter(
    (p) => p.uploadedBy === session.userId,
  );
  const visibleMyUploads = visiblePhotos(
    myPhotos,
    session.userId,
    joinedClassIds,
  );

  return (
    <div className="page my-page">
      <h1>我的班级</h1>
      <p className="muted">你好，{session.displayName}</p>

      <section>
        <h2 className="section-title">已加入班级 ({myClasses.length})</h2>
        {myClasses.length === 0 ? (
          <p className="empty">
            尚未加入班级。在<Link to="/">浏览档案</Link>中打开班级页并点击「加入班级档案」。
          </p>
        ) : (
          <div className="card-grid">
            {myClasses.map((c) => (
              <ClassCard
                key={c.id}
                cls={c}
                school={state.schools.find((s) => s.id === c.schoolId)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="section-title">我上传的照片</h2>
        {visibleMyUploads.length === 0 ? (
          <p className="empty">暂无上传记录。</p>
        ) : (
          <div className="photo-grid">
            {visibleMyUploads.map((p) => (
              <PhotoCard key={p.id} photo={p} showPrivacy />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
