# UChicago Tree Hole Project

This is the repository for the UChicago Tree Hole Project. The project is an implementation of website for the UChicago students to anonymously post their thoughts and feelings. The website is built using __Firebase__ and __React__.

## Backend:
The backend is a mixture of Firebase and Azure-hosted virtual machines. Redirect to the following link to find the repo for the backend codes:
 https://github.com/MuyanXie/Project-Tree-Hole-Backend

## Technical Highlights:
- React, with Redux and React Hooks heavily utilized
- Material UI for the Spring System
- Bootstrap UI for the Tree Hole Post System
- the post system is deployed serverlessly using Firebase
- the spring system is a new feature with a new server added on Azure 

## Getting Started
This platform is not able to be deployed on your own. The hosting is run on firebase and the database is run on Google Cloud Platform. For security measures, I've removed the firebase config file.


If you would like to run this project on your own, you will need to create a firebase project and inject a file called `firebase.js` into the `src` folder. The file should look like this:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id",
  storageBucket: "your-storage-bucket",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

Then running `npm start` will start the project on your local machine. (You may need to run `npm install` first.)

![Alt Text](public/giphy.gif)
