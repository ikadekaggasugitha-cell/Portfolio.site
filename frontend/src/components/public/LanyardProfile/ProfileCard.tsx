'use client';

import { ProfileData } from './LanyardProfile';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  profile: ProfileData | null;
}

/* Deterministic barcode pattern – alternating thin/thick bars */
const BARCODE_BARS = [
  3,1,2,1,1,3,2,1,1,2,3,1,2,1,1,3,1,2,3,1,
  1,2,1,3,2,1,1,3,2,1,3,1,1,2,3,1,2,1,1,2,
  1,3,1,2,1,1,3,2,1,2,3,1,1,2,1,3,2,1,3,1,
  2,1,1,3,2,1,1,2,3,1,3,1,2,1,1,3,2,1,3,1,
];

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className={styles.badgeOuter}>
      {/* ── Chrome connection ring (hangs from clip) ── */}
      <div className={styles.clipRing} />

      <div className={styles.badge}>
        {/* ═══ Radial glow overlay ═══ */}
        <div className={styles.glow} />

        {/* ═══ Header ═══ */}
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitle}>PORTFOLIO IT</div>
            <div className={styles.headerSubtitle}>DEVELOPER</div>
          </div>
          <span className={styles.codeIcon}>&lt;/&gt;</span>
        </div>

        {/* ═══ Photo ═══ */}
        <div className={styles.photoFrame}>
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.name}
              className={styles.photo}
            />
          ) : (
            <div className={styles.photoPlaceholder}>
              <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
                <circle cx="40" cy="30" r="16" fill="currentColor" opacity="0.15" />
                <path
                  d="M18 100C18 78 28 66 40 66C52 66 62 78 62 100"
                  fill="currentColor"
                  opacity="0.1"
                />
              </svg>
            </div>
          )}
        </div>

        {/* ═══ Identity Info ═══ */}
        <div className={styles.info}>
          <h2 className={styles.name}>{profile.name}</h2>
          <p className={styles.title}>{profile.title}</p>
          <div className={styles.divider} />
        </div>

        {/* ═══ Contact Details ═══ */}
        <div className={styles.contact}>
          {/* Email */}
          <div className={styles.contactRow}>
            <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4L12 13 2 4" />
            </svg>
            <span>{profile.email}</span>
          </div>

          {/* Location */}
          <div className={styles.contactRow}>
            <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>{profile.location}</span>
          </div>

          {/* Website */}
          <div className={styles.contactRow}>
            <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2c2.76 3.33 4 6.67 4 10s-1.24 6.67-4 10c-2.76-3.33-4-6.67-4-10s1.24-6.67 4-10z" />
            </svg>
            <span>{profile.website}</span>
          </div>
        </div>

        {/* ═══ Digital Barcode ═══ */}
        <div className={styles.barcode}>
          {BARCODE_BARS.map((w, i) => (
            <div
              key={i}
              className={styles.bar}
              style={{ width: `${w}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};