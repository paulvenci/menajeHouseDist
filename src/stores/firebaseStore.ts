// en un composable o store
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export async function login(email: string, password: string) {
    const user = await signInWithEmailAndPassword(auth, email, password)
    return user
}
