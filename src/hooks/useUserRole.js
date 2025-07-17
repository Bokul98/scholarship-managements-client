import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import useAuth from './useAuth';

const useUserRole = () => {
    const { user } = useAuth();

    const { data: userData = null, isLoading: roleLoading } = useQuery({
        queryKey: ['userData', user?.uid], // Changed from email to uid
        enabled: !!user?.uid,
        queryFn: async () => {
            try {
                const userRef = doc(db, 'users', user.uid); // Changed from email to uid
                const userSnap = await getDoc(userRef);
                
                if (userSnap.exists()) {
                    return userSnap.data();
                }
                return null;
            } catch (error) {
                console.error('Error fetching user data:', error);
                return null;
            }
        }
    });

    return { 
        role: userData?.role || null, 
        roleLoading,
        userData
    };
};

export default useUserRole; 