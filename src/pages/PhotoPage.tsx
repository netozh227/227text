import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp, useClass, usePhoto, useSchool } from '../context/AppProvider';
import { canViewPhoto } from '../lib/search';
import { PRIVACY_LABELS, type PrivacyScope } from '../types';

export function PhotoPage() {
  const { photoId = '' } = useParams();
  const photo = usePhoto(photoId);
  const cls = useClass(photo?.classId ?? '');
  const school = useSchool(photo?.schoolId ?? '');
  const navigate = useNavigate();
  const {
    session,
    joinedClassIds,
    updatePhotoPrivacy,
    deletePhoto,
  } = useApp();
  const [msg, setMsg] = useState('');

  if (!photo) {
    return (
      <div className="page empty-state">
        <h1>照片不存在</h1>
        <Link to="/" className="btn primary">
          返回首页
        </Link>
      </div>
    );
  }

  const visible = canViewPhoto(
    photo,
    session?.userId ?? null,
    joinedClassIds,
  );

  if (!visible) {
    return (
      <div className="page empty-state">
        <h1>无权查看</h1>
        <p>该影像的隐私范围为「{PRIVACY_LABELS[photo.privacy]}」。</p>
        <Link to={cls ? `/classes/${cls.id}` : '/'} className="btn primary">
          返回
        </Link>
      </div>
    );
  }

  const isOwner =
    session && photo.uploadedBy === session.userId;
  const isSeed = photo.uploadedBy === 'system-seed';

  const onPrivacyChange = (privacy: PrivacyScope) => {
    updatePhotoPrivacy(photo.id, privacy);
    setMsg('隐私范围已更新');
  };

  const onDelete = () => {
    const result = deletePhoto(photo.id);
    if (result.ok) navigate(cls ? `/classes/${cls.id}` : '/');
    else setMsg(result.message);
  };

  return (
    <div className="page photo-detail-page">
      <nav className="breadcrumb">
        <Link to="/">首页</Link>
        <span>/</span>
        {school && (
          <>
            <Link to={`/schools/${school.id}`}>{school.name}</Link>
            <span>/</span>
          </>
        )}
        {cls && (
          <>
            <Link to={`/classes/${cls.id}`}>{cls.className}</Link>
            <span>/</span>
          </>
        )}
        <span>照片详情</span>
      </nav>

      <article className="photo-detail card">
        <MotionFigure src={photo.imageUrl} title={photo.title} />
        <div className="photo-detail-meta">
          <span className="tag">{photo.category}</span>
          <h1>{photo.title}</h1>
          <p>{photo.description}</p>
          <dl className="meta-dl">
            <ToolPair term="拍摄日期" value={photo.takenAt} />
            <ToolPair term="隐私" value={PRIVACY_LABELS[photo.privacy]} />
            {school && <ToolPair term="学校" value={school.name} />}
            {cls && (
              <ToolPair
                term="班级"
                value={`${cls.className}（${cls.graduationYear} 届）`}
              />
            )}
          </dl>

          {isOwner && !isSeed && (
            <div className="manage-box">
              <h2>照片管理</h2>
              <label className="field">
                <span>隐私范围</span>
                <select
                  value={photo.privacy}
                  onChange={(e) =>
                    onPrivacyChange(e.target.value as PrivacyScope)
                  }
                >
                  {(
                    Object.keys(PRIVACY_LABELS) as PrivacyScope[]
                  ).map((key) => (
                    <option key={key} value={key}>
                      {PRIVACY_LABELS[key]}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="btn danger" onClick={onDelete}>
                删除照片
              </button>
            </div>
          )}
          {msg && <p className="form-message">{msg}</p>}
        </div>
      </article>
    </div>
  );
}

function ToolPair({ term, value }: { term: string; value: string }) {
  return (
    <>
      <dt>{term}</dt>
      <dd>{value}</dd>
    </>
  );
}

function MotionFigure({ src, title }: { src: string; title: string }) {
  return (
    <figure className="photo-detail-figure">
      <img src={src} alt={title} />
    </figure>
  );
}
