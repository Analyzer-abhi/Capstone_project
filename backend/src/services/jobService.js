import { getFirestore } from '../db.js';

const COLLECTIONS = {
  JOB_PROFILES: 'jobProfiles',
  FAANG_ALERTS: 'faangAlerts',
};

/**
 * Create a job profile (resume + extracted skills)
 */
export async function createJobProfile(data) {
  const db = getFirestore();
  const docRef = await db.collection(COLLECTIONS.JOB_PROFILES).add({
    ...data,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
}

/**
 * Get job profile by ID
 */
export async function getJobProfileById(id) {
  const db = getFirestore();
  const doc = await db.collection(COLLECTIONS.JOB_PROFILES).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

/**
 * Create a FAANG alert
 */
export async function createFaangAlert(data) {
  const db = getFirestore();
  const docRef = await db.collection(COLLECTIONS.FAANG_ALERTS).add({
    ...data,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
}

/**
 * Get FAANG alerts by email
 */
export async function getFaangAlertsByEmail(email) {
  const db = getFirestore();
  const snapshot = await db
    .collection(COLLECTIONS.FAANG_ALERTS)
    .where('email', '==', email)
    .where('active', '==', true)
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Delete (deactivate) a FAANG alert
 */
export async function deleteFaangAlertById(id) {
  const db = getFirestore();
  await db.collection(COLLECTIONS.FAANG_ALERTS).doc(id).update({
    active: false,
    deletedAt: new Date().toISOString(),
  });
}
