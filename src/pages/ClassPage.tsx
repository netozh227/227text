import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp, useClass, useSchool } from '../context/AppProvider';
import { PhotoCard } from '../components/PhotoCard';
import { visiblePhotos } from '../lib/search';

export function ClassPage() {
  const { classId = '' } = useParams();
  const cls = useClass(classId);
  const school = useSchool(cls?.schoolId ?? '');
  const navigate = useNavigate();
  const { state, session, joinedClassIds, joinClass, leaveClass } = useApp();
  const [message, setMessage] = useState('');

  if (!cls) {
    return (
      <div className="page empty-state">
        <h1>班级不存在</h1>
        <Link to="/" className="btn primary">
          返回首页
        </Link>
      </div>
    );
  }

  const photos = visiblePhotos(
    state.photos,
    session?.userId ?? null,
    joinedClassIds,
    classId,
  );
  const isMember = joinedClassIds.includes(classId);

  const handleJoin = () => {
    const result = joinClass(classId);
    setMessage(result.ok ? '已加入班级档案' : result.message);
  };

  const handleLeave = () => {
    leaveClass(classId);
    setMessage('已退出班级档案');
  };

  return (
    <div className="page class-page">
      <nav className="breadcrumb">
        <Link to="/">首页</Link>
        <span>/</span>
        {school && (
          <>
            <Link to={`/schools/${school.id}`}>{school.name}</Link>
            <span>/</span>
          </>
        )}
        <span>{cls.className}</span>
      </nav>

      <header className="class-hero card">
        <span className="class-stage-badge">{cls.stage}</span>
        <h1>{cls.className}</h1>
        <p className="muted">
          {school?.name} · {cls.graduationYear} 届 · {cls.memberCount} 人
        </p>
        {cls.motto && <p className="motto">「{cls.motto}」</p>}

        <div className="action-row">
          {session ? (
            isMember ? (
              <>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => navigate(`/classes/${classId}/upload`)}
                >
                  上传照片
                </button>
                <button type="button" className="btn ghost" onClick={handleLeave}>
                  退出班级
                </button>
              </>
            ) : (
              <button type="button" className="btn primary" onClick={handleJoin}>
                加入班级档案
              </button>
            )
          ) : (
            <p className="hint">
              <Link to="/login">登录</Link> 后可加入班级并上传照片
            </p>
          )}
        </div>
        {message && <p className="form-message">{message}</p>}
      </header>

      <section>
        <h2 className="section-title">班级影像 ({photos.length})</h2>
        {photos.length === 0 ? (
          <p className="empty">暂无可见照片（部分影像可能仅对班级成员开放）。</p>
        ) : (
          <div className="photo-grid">
            {photos.map((p) => (
              <PhotoCard key={p.id} photo={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
