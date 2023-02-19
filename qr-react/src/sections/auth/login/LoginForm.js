import { Box, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import {  object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useContext } from 'react';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';


import { AuthContext } from '../../../context/auth-context';
import { useHttpClient } from '../../../hooks/http-hook';


import ErrorModal from '../../../UIElement/Modal/ErrorModal';
import LoadingSpinner from '../../../UIElement/LoadingSpinner';
  
  const registerSchema = object({
    email: string({required_error: 'Email is required'}).email('Email is invalid'),
    password: string({required_error: 'Password is required'})
      .min(6, 'Password must be more than 6 characters')
      .max(32, 'Password must be less than 32 characters'),
  });
  
  
  const LoginForm = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    
    
    const { isLoading, error, sendRequest, clearError, } = useHttpClient();
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
      try {

        const data = JSON.stringify(values)
        
        const send = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, 'POST', data, 
          {
            'Content-Type': 'application/json'
          }
        );
        console.log(send);
        auth.login(send?.userDetails._id, send?.token, send?.userDetails, send?.userDetails.type)
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.log(err);
      }
    }; 
    
  
    return (
      <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} open={error} onClose={clearError} response={null}  /> 
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
          <TextField
            sx={{ mb: 2 }}
            label='Password'
            fullWidth
            required
            type='password'
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
            {...register('password')}
          />
          <LoadingButton
            variant='contained'
            fullWidth
            type='submit'
            
            sx={{ py: '0.8rem', mt: '1rem', backgroundColor: '#FF0000', "&:hover":{backgroundColor:'#4A0404'}}}
          >
            Login
          </LoadingButton>
        </Box>
      </Box>
      </>
    );
  };
  
  export default LoginForm;
  
  