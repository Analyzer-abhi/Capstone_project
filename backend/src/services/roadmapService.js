import { getFirestore } from '../db.js';

const COLLECTION = 'roadmaps';

const defaultProgress = () => ({ completedPhaseIndices: [] });

export async function createRoadmap(data) {
  const db = getFirestore();
  const progress = defaultProgress();
  const ref = await db.collection(COLLECTION).add({
    ...data,
    progress,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { id: ref.id, ...data, progress };
}

export async function getRoadmapById(id) {
  const db = getFirestore();
  const snap = await db.collection(COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  const data = snap.data();
  const progress = data.progress || defaultProgress();
  const phases = data.result?.roadmap?.phases || [];
  const allPhasesCompleted =
    phases.length > 0 &&
    phases.length === (progress.completedPhaseIndices || []).length;
  return {
    id: snap.id,
    targetJobTitle: data.targetJobTitle,
    result: data.result,
    resumeText: data.resumeText,
    progress,
    allPhasesCompleted: !!allPhasesCompleted,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
  };
}

export async function updateProgress(id, completedPhaseIndices) {
  const db = getFirestore();
  const ref = db.collection(COLLECTION).doc(id);
  await ref.update({
    progress: { completedPhaseIndices },
    updatedAt: new Date(),
  });
  return getRoadmapById(id);
}
