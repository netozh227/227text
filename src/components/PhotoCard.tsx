import { Link } from 'react-router-dom';
import type { Photo } from '../types';
import { PRIVACY_LABELS } from '../types';

interface PhotoCardProps {
  photo: Photo;
  showPrivacy?: boolean;
}

export function PhotoCard({ photo, showPrivacy }: PhotoCardProps) {
  return (
    <article className="photo-card">
      <Link to={`/photos/${photo.id}`} className="photo-card-link">
        <MotionThumbnail src={photo.imageUrl} alt={photo.title} />
        <div className="photo-card-body">
          <span className="tag">{photo.category}</span>
          <h3>{photo.title}</h3>
          <p className="muted">{photo.takenAt}</p>
        </div>
      </Link>
      {showPrivacy && (
        <span className="privacy-badge">{PRIVACY_LABELS[photo.privacy]}</span>
      )}
    </article>
  );
}

function MotionThumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="photo-thumb">
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
