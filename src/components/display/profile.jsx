import React, { useState } from "react";
import { auth, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import Header from "./Header";
import { IconUserCircle } from "@tabler/icons-react";

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
    if (!image) return;
    const imageRef = ref(storage, `users/${auth.currentUser.uid}`);
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        }).then(() => {
          window.location.reload();
        });
      });
    });
  };

  return (
    <>
      <Header name="Profile" />
      <div>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
        />
        <button onClick={handleImageUpload}>Upload</button>
      </div>
      <div class="page-content page-container" id="page-content">
        <style>
          {`
          body {
            background-color: #f9f9fa
        }
        .page-content {
            padding: 0 0 60px !important;
            margin: 0px auto;
            align-items: center;
            display: block;
            position: relative;
        }
        .page-container{
          padding: 0 0 60px !important;
          margin: 0px auto;
          align-items: center;
          display: block;
          position: relative;
        }
        .padding {
            padding: 3rem !important
        }
        .user-card-full {
            overflow: hidden;
        }
        .card {
            border-radius: 5px;
            -webkit-box-shadow: 0 1px 20px 0 rgba(69,90,100,0.08);
            box-shadow: 0 1px 20px 0 rgba(69,90,100,0.08);
            border: none;
            margin-bottom: 30px;
            width: 800px;
            height: 500px;
        }
        .m-r-0 {
            margin-right: 0px;
        }
        .m-l-0 {
            margin-left: 0px;
        }
        .user-card-full .user-profile {
            border-radius: 5px 0 0 5px;
        }
        .bg-c-lite-green {
            background: -webkit-gradient(linear, left top, right top, from(#f29263), to(#ee5a6f));
            background: linear-gradient(to right, #ee5a6f, #f29263);
        }
        .user-profile {
            padding: 20px 0;
            height: 500px;
        }
        .card-block {
            padding: 1.25rem;
            height: 500px;
        }
        .m-b-25 {
            margin-bottom: 25px;
        }
        .img-radius {
            border-radius: 100px;
        }
        h6 {
            font-size: 14px;
        }
        .card .card-block p {
            line-height: 25px;
        }
        @media only screen and (min-width: 1400px){
        p {
            font-size: 14px;
        }
        }
        .card-block {
            padding: 1.25rem;
        }
        .b-b-default {
            border-bottom: 1px solid #e0e0e0;
        }
        .m-b-20 {
            margin-bottom: 20px;
        }
        .p-b-5 {
            padding-bottom: 5px !important;
        }
        .card .card-block p {
            line-height: 25px;
        }
        .m-b-10 {
            margin-bottom: 10px;
        }
        .text-muted {
            color: #919aa3 !important;
        }
        .b-b-default {
            border-bottom: 1px solid #e0e0e0;
        }
        .f-w-600 {
            font-weight: 600;
        }
        .m-b-20 {
            margin-bottom: 20px;
        }
        .m-t-40 {
            margin-top: 20px;
        }
        .p-b-5 {
            padding-bottom: 5px !important;
        }
        .m-b-10 {
            margin-bottom: 10px;
        }
        .m-t-40 {
            margin-top: 20px;
        }
        .user-card-full .social-link li {
            display: inline-block;
        }
        .user-card-full .social-link li a {
            font-size: 20px;
            margin: 0 10px 0 0;
            -webkit-transition: all 0.3s ease-in-out;
            transition: all 0.3s ease-in-out;
        }
        .justify-content-center{
          display: flex;
          justify-content: center;
          width: 1050px;
        }
          `}
        </style>
        <div class="padding">
          <div class="row container d-flex justify-content-center">
            <div class="col-xl-6 col-md-12">
              <div class="card user-card-full">
                <div class="row m-l-0 m-r-0">
                  <div class="col-sm-4 bg-c-lite-green user-profile">
                    <div class="card-block text-center text-white">
                      <div class="m-b-25">
                        {auth.currentUser.photoURL != null ? (
                          <img
                            alt=""
                            src={auth.currentUser.photoURL}
                            class="img-radius"
                            style={{ width: 200, height: 200 }}
                          />
                        ) : (
                          <IconUserCircle size={200} />
                        )}
                      </div>
                      <h6
                        class="f-w-600"
                        style={{ marginTop: "50px", fontSize: "x-large" }}
                      >
                        {auth.currentUser.displayName != null ? (
                          auth.currentUser.displayName
                        ) : (
                          "A Mysterious User"
                        )}
                      </h6>
                      <p>Designer</p>
                      <i class=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                    </div>
                  </div>
                  <div class="col-sm-8">
                    <br></br>
                    <div class="card-block">
                      <h6 class="m-b-20 p-b-5 b-b-default f-w-600">
                        Information
                      </h6>
                      <div class="row">
                        <div class="col-sm-6">
                          <p class="m-b-10 f-w-600">
                            Email
                          </p>
                          <h6 class="text-muted f-w-400">{auth.currentUser.email}</h6>
                        </div>
                        <div class="col-sm-6">
                          <p class="m-b-10 f-w-600">Phone</p>
                          <h6 class="text-muted f-w-400">98979989898</h6>
                        </div>
                      </div>
                      <h6 class="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">
                        Projects
                      </h6>
                      <div class="row">
                        <div class="col-sm-6">
                          <p class="m-b-10 f-w-600">Recent</p>
                          <h6 class="text-muted f-w-400">Sam Disuja</h6>
                        </div>
                        <div class="col-sm-6">
                          <p class="m-b-10 f-w-600">Most Viewed</p>
                          <h6 class="text-muted f-w-400">Dinoter husainm</h6>
                        </div>
                      </div>
                      <br></br>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
