import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDYyw1IyRDUIG1amrBKF7_p1Ihg_-bb47c",
  authDomain: "magnum-media.firebaseapp.com",
  databaseURL: "https://magnum-media-default-rtdb.firebaseio.com",
  projectId: "magnum-media",
  storageBucket: "magnum-media.firebasestorage.app",
  messagingSenderId: "816334043499",
  appId: "1:816334043499:web:70868992e2ad60feea742e"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export async function getNewsById(id: string) {
  try {
    const docRef = doc(db, 'news', id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return null
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    }
  } catch (error: any) {
    console.error('Fetch error:', error)
    throw new Error(`Failed to fetch news: ${error.message}`)
  }
}

export async function updateNews(id: string, data: Record<string, any>) {
  try {
    const docRef = doc(db, 'news', id)
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true })
    
    return { success: true }
  } catch (error: any) {
    console.error('Update error:', error)
    throw new Error(`Failed to update news: ${error.message}`)
  }
} 