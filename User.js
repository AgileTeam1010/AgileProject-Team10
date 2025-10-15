// User.js
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

export default class User {
  constructor(firebaseUser, db) {
    this.uid = firebaseUser.uid;
    this.email = firebaseUser.email;
    this.db = db;
  }

  /**
   * Ensures the Firestore document exists for this user.
   * Creates a default progress structure if missing.
   */
  async init() {
    const userRef = doc(this.db, "users", this.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: this.email,
        progress: {
          addition: {},
          subtraction: {},
          multiplication: {},
          division: {},
          mixed: {}
        }
      });
      console.log("✅ New user document created in Firestore");
    }
  }

  /**
   * Save progress for a specific category and level.
   */
  async saveProgress(category, level, question) {
    const userRef = doc(this.db, "users", this.uid);
    const path = `progress.${category}.${level}`;
    await updateDoc(userRef, { [path]: question });
    console.log(`✅ Progress saved: ${category} Level ${level}`);
  }

  /**
   * Load the user's full progress object from Firestore.
   */
  async loadProgress() {
    const snap = await getDoc(doc(this.db, "users", this.uid));
    if (!snap.exists()) return null;
    return snap.data().progress;
  }
}
