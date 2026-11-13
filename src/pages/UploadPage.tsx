import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp, useClass, useSchool } from '../context/AppProvider';
import type { Photo, PrivacyScope } from '../types';
import { PRIVACY_LABELS } from '../types';
import { gradientPlaceholder } from '../lib/placeholders';

const MAX_FILE_BYTES = 800_000;

export function UploadPage() {
  const { classId = '' } = useParams();
  const cls = useClass(classId);
  const school = useSchool(cls?.schoolId ?? '');
  const navigate = useNavigate();
  const { session, isLoggedIn, joinedClassIds, addPhoto } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [takenAt, setTakenAt] = useState('');
  const [category, setCategory] = useState<Photo['category']>('毕业照');
  const [privacy, setPrivacy] = useState<PrivacyScope>('class_only');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  if (!cls || !school) {
    return (
      <div className="page empty-state">
        <h1>班级不存在</h1>
        <Link to="/" className="btn primary">
          返回首页
        </Link>
      </div>
    );
  }

  if (!isLoggedIn || !session) {
    return (
      <div className="page empty-state">
        <h1>请先登录</h1>
        <Link to="/login" className="btn primary">
          去登录
        </Link>
      </div>
    );
  }

  if (!joinedClassIds.includes(classId)) {
    return (
      <div className="page empty-state">
        <h1>请先加入该班级</h1>
        <Link to={`/classes/${classId}`} className="btn primary">
          班级档案
        </Link>
      </div>
    );
  }

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError('图片过大，请使用小于 800KB 的文件（MVP 本地存储限制）');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(String(reader.result));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const url =
      imageUrl || gradientPlaceholder(Date.now() % 10, title || '上传照片');
    const result = addPhoto({
      classId,
      schoolId: school.id,
      title: title.trim() || '未命名照片',
      description: description.trim(),
      takenAt: takenAt || new Date().toISOString().slice(0, 10),
      category,
      privacy,
      uploadedBy: session.userId,
      imageUrl: url,
    });
    if (result.ok) navigate(`/photos/${result.photo.id}`);
    else setError(result.message);
  };

  return (
    <div className="page upload-page">
      <nav className="breadcrumb">
        <Link to={`/classes/${classId}`}>← {cls.className}</Link>
      </nav>
      <form className="upload-form card" onSubmit={onSubmit}>
        <h1>上传照片</h1>
        <p className="muted">
          {school.name} · {cls.className}
        </p>

        <label className="field">
          <span>标题</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className="field">
          <span>说明</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>
        <label className="field">
          <span>拍摄日期</span>
          <input
            type="date"
            value={takenAt}
            onChange={(e) => setTakenAt(e.target.value)}
          />
        </label>
        <label className="field">
          <span>分类</span>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as Photo['category'])
            }
          >
            {(['毕业照', '校园风景', '活动合影', '其他'] as const).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>隐私范围</span>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as PrivacyScope)}
          >
            {(Object.keys(PRIVACY_LABELS) as PrivacyScope[]).map((key) => (
              <option key={key} value={key}>
                {PRIVACY_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>选择图片</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
        {imageUrl && (
          <img src={imageUrl} alt="预览" className="upload-preview" />
        )}
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn primary wide">
          保存到班级档案
        </button>
      </form>
    </div>
  );
}
