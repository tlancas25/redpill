import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './useAuth';
import { CourseProgress } from '../types';

export const useCourseProgress = (courseId: string) => {
  const { user, userProfile } = useAuth();
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.courseProgress?.[courseId]) {
      setProgress(userProfile.courseProgress[courseId]);
    }
    setLoading(false);
  }, [userProfile, courseId]);

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const updatedLessons = [
        ...(progress?.completedLessons || []),
        lessonId,
      ].filter((v, i, a) => a.indexOf(v) === i); // dedupe

      await updateDoc(userRef, {
        [`courseProgress.${courseId}.completedLessons`]: updatedLessons,
        [`courseProgress.${courseId}.lastWatched`]: lessonId,
        [`courseProgress.${courseId}.courseId`]: courseId,
      });

      setProgress((prev) => ({
        courseId,
        completedLessons: updatedLessons,
        lastWatched: lessonId,
        progressPercentage: prev?.progressPercentage || 0,
      }));
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const isLessonComplete = (lessonId: string): boolean => {
    return progress?.completedLessons?.includes(lessonId) || false;
  };

  return {
    progress,
    loading,
    markLessonComplete,
    isLessonComplete,
  };
};
