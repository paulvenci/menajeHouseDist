// src/authGuard.ts
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

export function initAuthGuard(callback: () => void) {
    onAuthStateChanged(auth, () => {
        callback()
    })
}
