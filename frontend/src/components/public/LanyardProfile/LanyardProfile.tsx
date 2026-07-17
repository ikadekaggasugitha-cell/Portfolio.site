'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import api from '@/lib/api';
import { LanyardStrap } from './LanyardStrap';
import { ProfileCard } from './ProfileCard';
import styles from './LanyardProfile.module.css';

export interface ProfileData {
  name: string;
  title: string;
  photo?: string;
  email?: string;
  location?: string;
  website?: string;
}

/**
 * Physics-based pendulum simulation for a hanging lanyard.
 * 
 * The lanyard swings from its top anchor point (like a real clip),
 * reacting to scroll velocity with damped harmonic oscillation.
 */
export const LanyardProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Physics state refs (avoid re-renders)
  const angleRef = useRef(0);         // Current rotation angle (degrees)
  const velocityRef = useRef(0);      // Angular velocity
  const lastScrollY = useRef(0);      // Previous scroll position
  const lastScrollTime = useRef(0);   // Time of last scroll event
  const rafId = useRef<number>(0);    // requestAnimationFrame handle
  const isSimulating = useRef(false); // Whether physics loop is active
  const hasEntryPlayed = useRef(false); // Entry animation guard

  // Physics constants — tuned for natural lanyard feel
  const DAMPING = 0.92;              // Energy loss per frame (lower = more damped)
  const STIFFNESS = 0.08;            // Spring return force (higher = snappier)
  const SCROLL_SENSITIVITY = 0.15;   // How much scroll affects swing
  const MAX_ANGLE = 18;              // Maximum rotation in degrees
  const REST_THRESHOLD = 0.05;       // When to stop simulating

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        const data = response.data?.data?.[0] ?? response.data?.data;
        if (data) {
          setProfile({
            name: data.name || 'Developer',
            title: data.title || 'Full Stack Developer',
            photo: data.photo || data.media?.url,
            email: data.email || 'hello@example.com',
            location: data.location || 'Bali, Indonesia',
            website: data.website || 'example.dev',
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setProfile({
          name: 'Developer',
          title: 'Full Stack Developer',
          email: 'hello@example.com',
          location: 'Bali, Indonesia',
          website: 'example.dev',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Apply the current angle to the DOM element
  const applyTransform = useCallback(() => {
    if (containerRef.current) {
      const angle = angleRef.current;
      // Subtle vertical displacement based on angle (pendulum arc)
      const verticalShift = Math.abs(angle) * 0.3;
      containerRef.current.style.transform =
        `rotate(${angle}deg) translateY(${verticalShift}px)`;
    }
  }, []);

  // Physics simulation loop
  const simulate = useCallback(() => {
    // Spring force: pulls angle back toward 0
    const springForce = -STIFFNESS * angleRef.current;

    // Update velocity with spring force, then apply damping
    velocityRef.current += springForce;
    velocityRef.current *= DAMPING;

    // Update angle
    angleRef.current += velocityRef.current;

    // Clamp to max angle
    angleRef.current = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, angleRef.current));

    // Apply to DOM
    applyTransform();

    // Check if at rest
    if (
      Math.abs(angleRef.current) < REST_THRESHOLD &&
      Math.abs(velocityRef.current) < REST_THRESHOLD
    ) {
      angleRef.current = 0;
      velocityRef.current = 0;
      applyTransform();
      isSimulating.current = false;
      return;
    }

    rafId.current = requestAnimationFrame(simulate);
  }, [applyTransform]);

  // Start or continue the physics simulation
  const startSimulation = useCallback(() => {
    if (!isSimulating.current) {
      isSimulating.current = true;
      rafId.current = requestAnimationFrame(simulate);
    }
  }, [simulate]);

  // Entry swing animation (plays once on mount)
  useEffect(() => {
    if (loading || hasEntryPlayed.current) return;
    hasEntryPlayed.current = true;

    // Simulate a gentle push from the left on entry
    const entryTimer = setTimeout(() => {
      angleRef.current = -12;
      velocityRef.current = 2.5;
      startSimulation();
    }, 300);

    return () => clearTimeout(entryTimer);
  }, [loading, startSimulation]);

  // Scroll-reactive physics
  useEffect(() => {
    if (loading) return;

    const handleScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const dt = now - lastScrollTime.current;

      if (dt > 0 && lastScrollTime.current > 0) {
        // Calculate scroll velocity (pixels per millisecond)
        const scrollVelocity = (currentScrollY - lastScrollY.current) / dt;

        // Apply scroll velocity as an impulse to the angular velocity
        // Scrolling down → positive impulse (swing right)
        // Scrolling up → negative impulse (swing left)
        const impulse = scrollVelocity * SCROLL_SENSITIVITY;

        // Add impulse but don't overwhelm existing motion
        velocityRef.current += impulse;

        // Clamp velocity to prevent wild swings
        velocityRef.current = Math.max(-4, Math.min(4, velocityRef.current));

        startSimulation();
      }

      lastScrollY.current = currentScrollY;
      lastScrollTime.current = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [loading, startSimulation]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={styles.container}
    >
      <LanyardStrap />
      <ProfileCard profile={profile} />
    </div>
  );
};
