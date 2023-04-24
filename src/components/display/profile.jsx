import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import Header from "./Header";
import { IconUserCircle, IconEdit } from "@tabler/icons-react";
import Modal from "../posts/Modal";
import CloseButton from "react-bootstrap/CloseButton";
import Button from "react-bootstrap/Button";
import classes from "./Profile.module.css";
import Form from "react-bootstrap/Form";
import SmallModal from "../utils/SmallModal";

const GeneralEdit = ({ id, which, onClose }) => {
  const [answer, setAnswer] = useState("");

  const onChange = (e) => {
    setAnswer(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (which === "displayName") {
      updateProfile(auth.currentUser, {
        displayName: answer,
      }).then(() => {
        window.location.reload();
      });
    } else {
      const userRef = doc(db, "users", id);
      updateDoc(userRef, {
        [which]: answer,
      }).then(() => {
        window.location.reload();
      });
    }
  };

  return (
    <div>

      <Form>
        <Form.Group className="mb-3">
          <CloseButton onClick={onClose} />
          <br></br>
          <div className={classes.or}></div>
          <br></br>
          <Form.Label className="form-label" style={{ fontSize: "15px" }}>
            Enter your Comment...
          </Form.Label>
          <div class="input-group">
            <textarea
              class="form-control"
              aria-label="With textarea"
              onChange={onChange}
              id="floatingInput"
              name="answer"
              value={answer}
              style={{ resize: "none" }}
              rows="3"
            ></textarea>
          </div>
          <br></br>
          <Form.Text className="text-muted">
            What do you want it to be?
          </Form.Text>
          <br></br>
          <br></br>
          <Button variant="primary" type="submit" onClick={onSubmit}>
            Submit
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

const ChangeImage = ({ onClose }) => {
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

  const handleImageUpload = (event) => {
    event.preventDefault();
    if (!image) return;
    const imageRef = ref(storage, `users/${auth.currentUser.uid}`);
    try {
      uploadBytes(imageRef, image).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            window.location.reload();
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <CloseButton onClick={onClose} style={{ fontSize: "large" }} />
      <br></br>
      <div className={classes.or}></div>
      <form className={classes.form}>
        {image ? (
          <div>
            <br></br>
            <br></br>
            <img
              src={URL.createObjectURL(image)}
              alt="profile"
              style={{
                width: "350px",
                height: "350px",
                borderRadius: "175px",
                margin: "auto",
                display: "block",
              }}
            />
            <br></br>
            <br></br>
          </div>
        ) : (
          <IconUserCircle
            size={400}
            stroke-width={0.75}
            role="img"
            color="#f29263"
            style={{ margin: "auto", display: "block" }}
          />
        )}

        <br></br>

        <input
          class="form-control"
          type="file"
          id="formFile"
          style={{ width: "60%", margin: "auto", display: "block" }}
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
        ></input>
        <br></br>
        <br></br>
        <Button
          onClick={handleImageUpload}
          style={{ width: "60%", margin: "auto", display: "block" }}
        >
          Upload
        </Button>
      </form>
    </div>
  );
};

const Profile = () => {
  const [show, setShow] = useState(true);
  const [showEditImage, setShowEditImage] = useState(false);
  const [which, setWhich] = useState("");
  const [showEditGeneral, setShowEditGeneral] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "A Mysterious User",
    motto: "Life is a mystery, and so am I.",
    year: "Um... Unknown Year",
    major: "Um... Unknown Major",
    gender: "Please Specify",
    region: "Please Specify",
  });

  const onClickImageHandler = () => {
    setShow(false);
    setShowEditImage(true);
  };

  const hideModal = () => {
    setShowEditImage(false);
    setShowEditGeneral(false);
    setShow(true);
  };

  const onClickGeneralHandler = ({ state }) => {
    setShow(false);
    setWhich(state);
    setShowEditGeneral(true);
  };
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const q = query(
        collection(db, "users"),
        where("uid", "==", currentUser.uid)
      );
      const getData = async () => {
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const adjustedData = {
          ...data[0],
          displayName: currentUser.displayName,
        };
        await setFormData(adjustedData);
      };
      getData();
    }
  }, []);

  return (
    <>
      {showEditImage && (
        <Modal>
          <ChangeImage onClose={hideModal} />
        </Modal>
      )}
      {showEditGeneral && (
        <SmallModal>
          <GeneralEdit which={which} onClose={hideModal} id={formData.id} />
        </SmallModal>
      )}
      {show && <Header name="Profile" />}
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
                        <div>
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
                          <IconEdit
                            size={20}
                            role="button"
                            style={{ marginTop: "180px" }}
                            onClick={onClickImageHandler}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <h6
                          class="f-w-600"
                          style={{ marginTop: "30px", fontSize: "x-large" }}
                        >
                          {formData.displayName != null
                            ? formData.displayName
                            : "A Mysterious User"}
                        </h6>
                        <IconEdit
                          size={20}
                          role="button"
                          style={{ marginTop: "25px" }}
                          onClick={() =>
                            onClickGeneralHandler({ state: "displayName" })
                          }
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            marginTop: "25px",
                            alignContent: "center",
                            marginBottom: "5px",
                          }}
                        >
                          {formData.motto}
                        </p>
                        <IconEdit
                          size={20}
                          role="button"
                          onClick={() =>
                            onClickGeneralHandler({ state: "motto" })
                          }
                        />
                      </div>
                      <i class=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                    </div>
                  </div>
                  <div class="col-sm-8">
                    <div class="card-block">
                      <br></br>
                      <h6
                        class="m-b-20 p-b-5 b-b-default f-w-600"
                        style={{ fontSize: "xx-large" }}
                      >
                        Personal Information
                      </h6>
                      <div class="row">
                        <div class="col-sm-6">
                          <p
                            class="m-b-10 f-w-600"
                            style={{ fontSize: "x-large" }}
                          >
                            Email
                          </p>
                          <h6
                            class="text-muted f-w-400"
                            style={{ fontSize: "medium" }}
                          >
                            {auth.currentUser.email}
                          </h6>
                        </div>
                        <div class="col-sm-6">
                          <p
                            class="m-b-10 f-w-600"
                            style={{ fontSize: "x-large" }}
                          >
                            CNet ID
                          </p>
                          <h6
                            class="text-muted f-w-400"
                            style={{ fontSize: "medium" }}
                          >
                            {auth.currentUser.email.split("@")[0]}
                          </h6>
                        </div>
                      </div>

                      <br></br>
                      <div class="row">
                        <div class="col-sm-6">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "center",
                            }}
                          >
                            <p
                              class="m-b-10 f-w-600"
                              style={{ fontSize: "x-large", marginRight: 10 }}
                            >
                              Year
                            </p>
                            <IconEdit
                              size={20}
                              role="button"
                              onClick={() =>
                                onClickGeneralHandler({ state: "year" })
                              }
                            />
                          </div>
                          <h6
                            class="text-muted f-w-400"
                            style={{ fontSize: "medium" }}
                          >
                            {formData.year}
                          </h6>
                        </div>
                        <div class="col-sm-6">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "center",
                            }}
                          >
                            <p
                              class="m-b-10 f-w-600"
                              style={{ fontSize: "x-large", marginRight: 10 }}
                            >
                              Major
                            </p>
                            <IconEdit
                              size={20}
                              role="button"
                              onClick={() =>
                                onClickGeneralHandler({ state: "major" })
                              }
                            />
                          </div>
                          <h6
                            class="text-muted f-w-400"
                            style={{ fontSize: "medium" }}
                          >
                            {formData.major}
                          </h6>
                        </div>
                      </div>
                      <br></br>
                      <h6
                        class="m-b-20 m-t-40 p-b-5 b-b-default f-w-600"
                        style={{ fontSize: "xx-large" }}
                      >
                        More . . .
                      </h6>
                      <div class="row">
                        <div class="col-sm-6">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "center",
                            }}
                          >
                            <p
                              class="m-b-10 f-w-600"
                              style={{ fontSize: "x-large", marginRight: 10 }}
                            >
                              Gender
                            </p>
                            <IconEdit
                              size={20}
                              role="button"
                              onClick={() =>
                                onClickGeneralHandler({ state: "gender" })
                              }
                            />
                          </div>
                          <h6
                            class="text-muted f-w-400"
                            style={{ fontSize: "large" }}
                          >
                            {formData.gender}
                          </h6>
                        </div>
                        <div class="col-sm-6">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "center",
                            }}
                          >
                            <p
                              class="m-b-10 f-w-600"
                              style={{ fontSize: "x-large", marginRight: 10 }}
                            >
                              Region
                            </p>
                            <IconEdit
                              size={20}
                              role="button"
                              onClick={() =>
                                onClickGeneralHandler({ state: "region" })
                              }
                            />
                          </div>
                          <h6
                            class="text-muted f-w-400"
                            style={{ fontSize: "large" }}
                          >
                            {formData.region}
                          </h6>
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
