import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();

router.post('/verify', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'Missing idToken' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return res.json({ user: decodedToken });
  } catch (error) {
    console.error('Auth verification failed', error);
    return res.status(401).json({ error: 'Failed to verify token' });
  }
});

export default router;
