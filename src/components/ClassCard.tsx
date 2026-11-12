import { Link } from 'react-router-dom';
import type { ClassArchive, School } from '../types';

interface ClassCardProps {
  cls: ClassArchive;
  school?: School;
}

export function ClassCard({ cls, school }: ClassCardProps) {
  return (
    <Link to={`/classes/${cls.id}`} className="class-card card">
      <div className="class-card-stage">{cls.stage}</div>
      <h3>{cls.className}</h3>
      <p className="muted">
        {school?.name ?? '学校'} · {cls.graduationYear} 届
      </p>
      {cls.motto && <p className="motto">「{cls.motto}」</p>}
      <span className="member-count">{cls.memberCount} 人存档</span>
    </Link>
  );
}
