import { db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Saves or updates a user profile in Firestore.
 * For new users: creates a doc with uid, fullName, email, photoURL, createdAt, lastLogin
 * For existing users: updates lastLogin and any extra fields, preserves createdAt
 *
 * @param {Object} user - Firebase user object with uid, email, displayName, photoURL
 * @param {Object} extraData - Additional fields to merge (optional)
 * @returns {Promise<void>}
 */
export async function saveUserProfile(user, extraData = {}) {
  if (!user || !user.uid) {
    console.warn('saveUserProfile: Invalid user object');
    return;
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const now = serverTimestamp();

    if (userSnap.exists()) {
      // User already exists: update lastLogin and any provided extra fields
      const updateData = {
        lastLogin: now,
        ...extraData,
      };

      await setDoc(userRef, updateData, { merge: true });
      console.log(`[Firestore] Updated user profile for ${user.uid}`);
    } else {
      // New user: create profile with all fields
      const profileData = {
        uid: user.uid,
        fullName: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        photoURL: user.photoURL || null,
        createdAt: now,
        lastLogin: now,
        ...extraData,
      };

      await setDoc(userRef, profileData);
      console.log(`[Firestore] Created user profile for ${user.uid}`);
    }
  } catch (error) {
    console.error('[Firestore] Error saving user profile:', error);
    throw error;
  }
}
