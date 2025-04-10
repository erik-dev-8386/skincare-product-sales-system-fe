import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyClRlFfyqLPUs3mf-2tWdPd2IgEafQcWPI",
  authDomain: "haven-skin-03-2025-d1f5f.firebaseapp.com",
  projectId: "haven-skin-03-2025-d1f5f",
  storageBucket: "haven-skin-03-2025-d1f5f.firebasestorage.app",
  messagingSenderId: "664378071005",
  appId: "1:664378071005:web:a7f4e9daaf99b507634834",
  measurementId: "G-66FFXZ5P13"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
