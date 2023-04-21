// TODO: add profile functionality
// can use auth.currentUser.updateProfile({displayName: 'Jane Q. User', photoURL: 'https://example.com/jane-q-user/profile.jpg'})

import React, { useState } from "react";
import { auth, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {  updateProfile } from "firebase/auth";

const Profile = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg"];
    const maxSize = 2 * 1024 * 1024; // 2mb
  
    if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
      setImage(file);
    } else {
      setImage(null);
      alert("Please select a PNG or JPEG file that is less than 2MB in size.");
    }
  };
  
  const handleImageUpload = () => {
    if(!image) return;
    const imageRef = ref(storage, `users/${auth.currentUser.uid}`);
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        updateProfile(auth.currentUser, {
            photoURL: downloadURL,
        });
        console.log(auth.currentUser);
        console.log("File available at", downloadURL);
      });
      console.log(auth.currentUser);
    });
  };

  return (
    <div>
      <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
      <button onClick={handleImageUpload}>Upload</button>
    </div>
  );
};

export default Profile;
