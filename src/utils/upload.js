// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import firebase from "firebase/compat/app";
// import { storage } from "../config/firebase";


// const uploadFile = async (file) => {
//     try {
//         if (!file) throw new Error("No file provided");

//         const storageRef = firebase.storage().ref(`images/${file.name}`);
//         const response = await uploadBytes(storageRef, file);
//         const downloadURL = await getDownloadURL(response.ref);

//         return downloadURL;
//     } catch (error) {
//         console.error("File upload failed:", error);
//         throw error; // Có thể xử lý lỗi bên ngoài
//     }
// };

// export default uploadFile;

import { storage, ref, uploadBytesResumable, getDownloadURL } from "../config/firebase"; 

 const uploadFile = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `skin-types/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            null,
            (error) => {
                console.error("Upload failed:", error);
                toast.error("Lỗi tải ảnh lên Firebase!");
                reject(null);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
            }
        );
    });
};

export default uploadFile;
