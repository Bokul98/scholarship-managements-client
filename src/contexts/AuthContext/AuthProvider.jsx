import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';
import AuthContext from './Authcontext.jsx';
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Create user with email and password
    const createUser = async (email, password) => {
        setLoading(true);
        // Sign out any existing user first
        if (auth.currentUser) {
            await signOut(auth);
        }
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Sign in with email and password
    const signIn = async (email, password) => {
        setLoading(true);
        // Sign out any existing user first
        if (auth.currentUser) {
            await signOut(auth);
        }
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            // Force sign out first
            await signOut(auth);
            
            // Clear any cached credentials
            googleProvider.setCustomParameters({
                prompt: 'select_account'
            });
            
            return await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google sign in error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateUserProfile = (name) => {
        return updateProfile(auth.currentUser, {
            displayName: name
        });
    };

    // Sign out
    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            // Clear any stored credentials
            if (window.google && window.google.accounts && window.google.accounts.id) {
                window.google.accounts.id.disableAutoSelect();
            }
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Observer
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            console.log('Auth state changed:', currentUser?.email);
            setUser(currentUser);
            setLoading(false);
        });
        return () => {
            return unsubscribe();
        };
    }, []);

    const authInfo = {
        user,
        loading,
        setLoading,
        createUser,
        signIn,
        signInWithGoogle,
        updateUserProfile,
        logOut
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;