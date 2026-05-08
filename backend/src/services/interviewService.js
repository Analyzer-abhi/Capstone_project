import { getFirestore } from '../db.js';
import admin from 'firebase-admin';

const COLLECTION = 'interviews';

/**
 * Create a new interview
 */
export async function createInterview(data) {
  const db = getFirestore();
  const docRef = await db.collection(COLLECTION).add({
    ...data,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
}

/**
 * Get interview by ID
 */
export async function getInterviewById(id) {
  const db = getFirestore();
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

/**
 * Add a message to the interview
 */
export async function addInterviewMessage(id, message) {
  const db = getFirestore();
  const docRef = db.collection(COLLECTION).doc(id);
  
  await docRef.update({
    messages: admin.firestore.FieldValue.arrayUnion(message),
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Update interview status and report
 */
export async function updateInterviewStatus(id, status, report = null) {
  const db = getFirestore();
  const updateData = {
    status,
    updatedAt: new Date().toISOString(),
  };
  
  if (report) {
    updateData.report = report;
  }
  
  await db.collection(COLLECTION).doc(id).update(updateData);
}
