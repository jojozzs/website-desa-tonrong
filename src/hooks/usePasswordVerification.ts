import { useState, useCallback } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function usePasswordVerification() {
    const [verifying, setVerifying] = useState(false);

    const verifyCurrentPassword = useCallback(async (email: string, password: string): Promise<boolean> => {
        try {
            setVerifying(true);
            // const currentUser = auth.currentUser;
            
            await signInWithEmailAndPassword(auth, email, password);

            return true;
        } catch (error) {
            console.error('Password verification failed:', error);
            
            if (error instanceof Error) {
                if (error.message.includes('wrong-password') || 
                    error.message.includes('invalid-credential') ||
                    error.message.includes('invalid-login-credentials')) {
                    return false;
                }
            }
            
            throw error;
            
        } finally {
            setVerifying(false);
        }
    }, []);

    return {
        verifyCurrentPassword,
        verifying
    };
}