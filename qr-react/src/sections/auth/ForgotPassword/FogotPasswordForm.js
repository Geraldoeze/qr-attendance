import { Box, TextField,  } from '@mui/material';
import { useForm } from 'react-hook-form';
import {  object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, } from 'react';
import { LoadingButton } from '@mui/lab';



import { useHttpClient } from '../../../hooks/http-hook';

import ErrorModal from '../../../UIElement/Modal/ErrorModal';
import LoadingSpinner from '../../../UIElement/LoadingSpinner';
  
  const registerSchema = object({
    email: string({required_error: 'Email is required'}).email('Email is invalid'),
  })
  
  
  const ForgotPasswordForm = () => {
   
    
    
    const { isLoading, error, sendRequest, clearError, resMessage} = useHttpClient();
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
      const data = {...values, redirectUrl: `${window.location.origin}/auth/resetPassword`}
      try {
        await sendRequest(`https://biometric-node.vercel.app/auth/passwordReset`, 'POST', data);
          
        } catch (err) {
          console.log(err.message, err.response)
        }
    }; 
    console.log(errors);
    
    return (
      <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClose={clearError} response={resMessage} open={error} /> 
      <Box sx={{ maxWidth: '30rem' }}>
        <Box
          component='form'
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <TextField
            sx={{ mb: 2 }}
            label='Email'
            fullWidth
            required
            type='email'
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
            {...register('email')}
          />
       
          <LoadingButton
            variant='contained'
            fullWidth
            type='submit'
            
            sx={{ py: '0.8rem', mt: '1rem' }}
          >
            Submit
          </LoadingButton>
        </Box>
      </Box>
      </>
    );
  };
  
  export default ForgotPasswordForm;
  
  



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
// export default function LoginForm() {
  
//   const { isLoading, error, sendRequest, clearError } = useHttpClient();
//   const [inputState, dispatch] = useReducer(inputReducer, {
//     email: ''
//   });
  
//   const changeHandler = e => {
//     dispatch({
//       type: 'HANDLE_INPUT',
//       field: e.target.name,
//       payload: e.target.value
//     });
//   };
//   const [showPassword, setShowPassword] = useState(false);
//   const [ response,setResponse] = useState();
//   const handleClick = async () => {
//     const data = {...inputState, redirectUrl: `${window.location.origin}/auth/resetPassword`}
  
//     try {
//       const send = await sendRequest(`http://localhost:7000/auth/passwordReset`, 'POST', data);
//       setResponse(send)
//     } catch (err) {
//       console.log(err.message, err.response)
//     }

//   };
//   const closeRes = () => {
//     setResponse(null);
//   }

//   return (
//     <>
//      {isLoading && <LoadingSpinner asOverlay />}
//      <Modal error={error} onClose={clearError } res={response} closeRes={closeRes}/>
//       <Stack spacing={1}>
//         <TextField name="email" label="Email address" onChange={(e) => changeHandler(e)} value={inputState.email} />
//       </Stack>
//       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1 }}>
//         <Link href='login' variant="subtitle2" underline="hover">
//           Login
//         </Link>
//       </Stack>
//       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1 }}>
//         <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
//         Submit
//       </LoadingButton> 
//         </Stack>
//     </>
//   );
// }
