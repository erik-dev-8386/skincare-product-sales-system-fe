

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
