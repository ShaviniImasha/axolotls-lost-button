/**
 * Backend Firebase Configuration
 */

import { firebaseAdminService } from '../services/FirebaseAdminService';

export const getAdminAuth = () => firebaseAdminService.getAuth();
export const getAdminDb = () => firebaseAdminService.getFirestore();
export const isFirebaseReady = () => firebaseAdminService.isReady();
