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


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getStorage } from "firebase/storage";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyClRlFfyqLPUs3mf-2tWdPd2IgEafQcWPI",
//   authDomain: "haven-skin-03-2025-d1f5f.firebaseapp.com",
//   projectId: "haven-skin-03-2025-d1f5f",
//   storageBucket: "haven-skin-03-2025-d1f5f.firebasestorage.app",
//   messagingSenderId: "664378071005",
//   appId: "1:664378071005:web:a7f4e9daaf99b507634834",
//   measurementId: "G-66FFXZ5P13"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
// // Khởi tạo Firebase Storage
// export const storage = getStorage(app);