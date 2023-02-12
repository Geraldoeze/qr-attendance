export { default as LoginForm } from './LoginForm';


// import {
//     Box,
//     FormControlLabel,
//     FormGroup,
//     FormHelperText,
//     TextField,
//     Typography,
//   } from '@mui/material';
//   import { useForm, SubmitHandler } from 'react-hook-form';
//   import { literal, object, string, TypeOf } from 'zod';
//   import { zodResolver } from '@hookform/resolvers/zod';
//   import { useEffect, useState } from 'react';
//   import { LoadingButton } from '@mui/lab';
//   import Checkbox from '@mui/material/Checkbox';

//   import { useHttpClient } from '../../../hooks/http-hook';

  
//   const registerSchema = object({
//     name: string({required_error: "Name is required",})
//       .min(2, 'Name is too short')
//       .max(32, 'Name must be less than 100 characters'),
//     email: string({required_error: 'Email is required'}).email('Email is invalid'),
//     password: string({required_error: 'Password is required'})
//       .min(8, 'Password must be more than 8 characters')
//       .max(32, 'Password must be less than 32 characters'),
//     passwordConfirm: string({required_error: 'Please confirm your password'})
    
//   });
  
// //  
  
//   const RegisterPage = () => {
//     const [loading, setLoading] = useState(false);
//     const { isLoading, error, sendRequest, clearError, } = useHttpClient();
//     const {
//       register,
//       formState: { errors, isSubmitSuccessful },
//       reset,
//       handleSubmit,
//     } = useForm({
//       resolver: zodResolver(registerSchema),
//     });
  
//     useEffect(() => {
//       if (isSubmitSuccessful) {
//         reset();
//       }
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [isSubmitSuccessful]);
  
//     const onSubmitHandler = (values) => {
//       console.log(values);
//     }; 
//     console.log(errors);
  
//     return (
//       <Box sx={{ maxWidth: '30rem' }}>
//         <Typography variant='h6' component='h1' sx={{ mb: '2rem' }}>
//           Register
//         </Typography>
//         <Box
//           component='form'
//           noValidate
//           autoComplete='off'
//           onSubmit={handleSubmit(onSubmitHandler)}
//         >
//           <TextField
//             sx={{ mb: 2 }}
//             label='Name'
//             fullWidth
//             required
//             error={!!errors.name}
//             helperText={errors.name ? (errors.name.message) : ''}
//             {...register('name')}
//           />
//           <TextField
//             sx={{ mb: 2 }}
//             label='Email'
//             fullWidth
//             required
//             type='email'
//             error={!!errors.email}
//             helperText={errors.email ? errors.email.message : ''}
//             {...register('email')}
//           />
//           <TextField
//             sx={{ mb: 2 }}
//             label='Password'
//             fullWidth
//             required
//             type='password'
//             error={!!errors.password}
//             helperText={errors.password ? errors.password.message : ''}
//             {...register('password')}
//           />
//           <TextField
//             sx={{ mb: 2 }}
//             label='Confirm Password'
//             fullWidth
//             required
//             type='password'
//             error={!!errors.passwordConfirm}
//             helperText={
//               errors.passwordConfirm ? errors.passwordConfirm.message : ''
//             }
//             {...register('passwordConfirm')}
//           />
  
          
  
//           <LoadingButton
//             variant='contained'
//             fullWidth
//             type='submit'
//             loading={loading}
//             sx={{ py: '0.8rem', mt: '1rem' }}
//           >
//             Register
//           </LoadingButton>
//         </Box>
//       </Box>
//     );
//   };
  
//   export default RegisterPage;
  
  