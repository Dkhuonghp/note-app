import React, { useContext } from 'react'
import { Typography, Button } from '@mui/material'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate, Navigate } from 'react-router-dom';
import { graphQlRequest } from '../utils/request';


export default function Login() {

  const auth = getAuth()
  // const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const {
      user: { uid, displayName },
    } = await signInWithPopup(auth, provider);

    const { data } = await graphQlRequest({
      query: `mutation register($uid: String!, $name: String!) {
      register(uid: $uid, name: $name) {
        uid
        name
      }
    }`,
      variables: {
        uid,
        name: displayName,
      },
    });
    console.log('register', { data });
  };

  if (localStorage.getItem('accessToken')) {
    return <Navigate to="/" />
  }
  
  // if(user?.uid) {
  //   navigate('/')
  //   return
  // }
  return (
    <>
      <Typography variant='h5' sx={{ marginBottom: '10px' }}>Wellcome To Note App</Typography>
      <Button variant='outlined' onClick={handleLoginWithGoogle}>
        Login with Google
      </Button>
    </>
  )
}



// import React from 'react';
// import { Button, Typography } from '@mui/material';
// import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthProvider';
// import { useNavigate, Navigate } from 'react-router-dom';
// import { graphQlRequest } from '../utils/request';

// export default function Login() {
//   const auth = getAuth();
//   // const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const handleLoginWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();

//     const {
//       user: { uid, displayName },
//     } = await signInWithPopup(auth, provider);

//     const { data } = await graphQlRequest({
//       query: `mutation register($uid: String!, $name: String!) {
//       register(uid: $uid, name: $name) {
//         uid
//         name
//       }
//     }`,
//       variables: {
//         uid,
//         name: displayName,
//       },
//     });
//     console.log('register', { data });
//   };

//   if (localStorage.getItem('accessToken')) {
//     return <Navigate to="/" />
//   }

//   return (
//     <>
//       <Typography variant='h5' sx={{ marginBottom: '10px' }}>
//         Welcome to Note App
//       </Typography>
//       <Button variant='outlined' onClick={handleLoginWithGoogle}>
//         Login with Google
//       </Button>
//     </>
//   );
// }



