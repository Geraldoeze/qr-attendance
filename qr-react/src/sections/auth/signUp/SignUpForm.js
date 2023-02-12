import { Box, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { number, object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

import { useHttpClient } from '../../../hooks/http-hook';

import ErrorModal from '../../../UIElement/Modal/ErrorModal';
import LoadingSpinner from '../../../UIElement/LoadingSpinner';

const registerSchema = object({
  name: string({ required_error: 'Name is required' })
    .min(4, 'Name must be more than 4 characters')
    .max(32, 'Name must be less than 100 characters'),
  email: string({ required_error: 'Email is required' }).email('Email is invalid'),
  adminNumber: string({ required_error: 'Admin Number is required.' }).min(6, 'Admin Number is 6 digit'),
  password: string({ required_error: 'Password is required' })
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string({ required_error: 'Please confirm your password' }),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});

const SignUpForm = () => {
  const navigate = useNavigate();

  const { isLoading, error, sendRequest, clearError, resMessage } = useHttpClient();
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    
  }, [isSubmitSuccessful]);


  const onSubmitHandler = async (values) => {
    console.log(values)
    try {
      await sendRequest(`https://biometric-node.vercel.app/auth/register`, 'POST', values);

      navigate('/auth/login', { replace: true });
    } catch (err) {
      console.log(err.message, err.response);
    }
  };
  console.log(errors);

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClose={clearError} response={resMessage} open={resMessage} />
      <Box sx={{ maxWidth: '30rem' }}>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitHandler)}>
          <TextField
            sx={{ mb: 2 }}
            label="Name"
            fullWidth
            required
            type="email"
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
            {...register('name')}
          />
          <TextField
            sx={{ mb: 2 }}
            label="Email"
            fullWidth
            required
            type="email"
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
            {...register('email')}
          />
           <TextField
            sx={{ mb: 2 }}
            label="Admin Number"
            fullWidth
            required
            type="number"
            error={!!errors.adminNumber}
            helperText={errors.adminNumber ? errors.adminNumber.message : ''}
            {...register('adminNumber')}
          />
          <TextField
            sx={{ mb: 2 }}
            label="Password"
            fullWidth
            required
            type="password"
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
            {...register('password')}
          />
          <TextField
            sx={{ mb: 2 }}
            label="Confirm Password"
            fullWidth
            required
            type="password"
            error={!!errors.passwordConfirm}
            helperText={errors.passwordConfirm ? errors.passwordConfirm.message : ''}
            {...register('passwordConfirm')}
          />
          <LoadingButton variant="contained" fullWidth type="submit" sx={{ py: '0.8rem', mt: '1rem' }}>
            Submit
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
};

export default SignUpForm;

// import { useState, useReducer } from 'react';
// import { useNavigate } from 'react-router-dom';
// // @mui
// import { Link, Stack, TextField } from '@mui/material';
// import { LoadingButton } from '@mui/lab';
// // components
// import { useHttpClient } from '../../../hooks/http-hook';
// // UIElement
// import LoadingSpinner from '../../../UIElement/LoadingSpinner'
// import Modal from '../../../UIElement/Modal/Modal';

// // ----------------------------------------------------------------------

// // initial reducer state
// const inputReducer = (state, action) => {
//   switch (action.type) {
//     case 'HANDLE_INPUT':
//       return {
//         ...state,
//         [action.field]: action.payload,

//       };
//     default:
//       return state;
//   }
// };
// export default function ResetPasswordForm() {
//   const navigate = useNavigate();
//   const [response, setResponse] = useState()
//   const { isLoading, error, sendRequest, clearError } = useHttpClient();
//   const [inputState, dispatch] = useReducer(inputReducer, {
//     newPassword: ''
//   });

//   const changeHandler = e => {
//     dispatch({
//       type: 'HANDLE_INPUT',
//       field: e.target.name,
//       payload: e.target.value
//     });
//   };
//   const [showPassword, setShowPassword] = useState(false);
//   const closeRes = () => {
//     setResponse(null);
//   }
//   const handleClick = async () => {
//    const urlParam = window.location.pathname.split('/');
//    const userId = urlParam[urlParam.length - 2];
//    const resetString = urlParam[urlParam.length - 1];
//    const data = {...inputState, userId, resetString};
//     try {
//       const send = await sendRequest(`http://localhost:7000/auth/resetPassword`, 'POST', data);
//       setResponse(send);
//       navigate('/dashboard', { replace: true });

//     } catch (err) {
//       console.log(err.message, err.response)
//     }

//   };

//   return (
//     <>
//      {isLoading && <LoadingSpinner asOverlay />}
//      <Modal error={error} onClose={clearError } res={response} closeRes={closeRes}/>

//       <Stack spacing={1}>
//       <TextField
//           name="newPassword"
//           label="New Password"
//           onChange={(e) => changeHandler(e)}
//           value={inputState.newPassword}
//           type={showPassword ? 'text' : 'password'}
//         />
//       </Stack>

//         <Link href='/auth/login' variant="subtitle2" underline="hover" sx={{ my:1}}>
//           Login
//         </Link>

//       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
//         <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
//         Submit
//       </LoadingButton>
//         </Stack>
//     </>
//   );
// }

// import { useState, useReducer } from 'react';
// import { useNavigate } from 'react-router-dom';
// // @mui
// import { Link, Stack, TextField, Checkbox } from '@mui/material';
// import { LoadingButton } from '@mui/lab';
// // components
// import { useHttpClient } from '../../../hooks/http-hook';
// // UIElement
// import LoadingSpinner from '../../../UIElement/LoadingSpinner'
// import Modal from '../../../UIElement/Modal/Modal';

// // ----------------------------------------------------------------------

// // initial reducer state
// const inputReducer = (state, action) => {
//   switch (action.type) {
//     case 'HANDLE_INPUT':
//       return {
//         ...state,
//         [action.field]: action.payload,
//       };
//     default:
//       return state;
//   }
// };

// export default function SignUpForm() {
//   const navigate = useNavigate();
//   const { isLoading, error, sendRequest, clearError } = useHttpClient();
//   const [inputState, dispatch] = useReducer(inputReducer, {
//     name: '',
//     email: '',
//     password: '',
//   });

//   const changeHandler = (e) => {
//     dispatch({
//       type: 'HANDLE_INPUT',
//       field: e.target.name,
//       payload: e.target.value,
//     });
//   };
//   const [showPassword, setShowPassword] = useState(false);
//   const [response, setResponse] = useState()

//   const handleClick = async () => {
//     try {
//       const send = await sendRequest(`http://localhost:7000/auth/register`, 'POST', inputState);
//       console.log(send);
//       setResponse(send);
//     } catch (err) {
//       console.log(err);

//     }
//   };

//   const closeRes = () => {
//     setResponse(null);
//   }

//   return (
//     <>
//       {isLoading && <LoadingSpinner asOverlay />}
//       <Modal onClose={clearError} closeRes={closeRes} error={error} res={response}/>
//       <Stack spacing={2}>
//         <TextField name="name" label="Username" onChange={(e) => changeHandler(e)} value={inputState.name} />
//         <TextField name="email" label="Email address" onChange={(e) => changeHandler(e)} value={inputState.email} />

//         <TextField
//           name="password"
//           label="Password"
//           onChange={(e) => changeHandler(e)}
//           value={inputState.password}
//           type={showPassword ? 'text' : 'password'}

//         />
//       </Stack>
//       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 0.1 }}>
//         <Checkbox name="remember" label="Remember me" />
//       </Stack>

//       <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
//         Submit
//       </LoadingButton>
//     </>
//   );
// }
