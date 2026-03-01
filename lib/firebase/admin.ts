import { initializeApp, getApps, getApp, cert, AppOptions } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

export function getFirebaseAdminApp() {
    if (getApps().length > 0) {
        return getApp();
    }

    // Without a service account, we can try to initialize with just the project ID for
    // some basic functions. For full Admin access, a SERVICE_ACCOUNT_KEY env is needed.
    const config: AppOptions = {
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
    };

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            config.credential = cert(serviceAccount);
        } catch {
            console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY');
        }
    }

    return initializeApp(config);
}

const adminApp = getFirebaseAdminApp();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
