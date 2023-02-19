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
        await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/passwordReset`, 'POST', JSON.stringify(data),
          {
            'Content-Type': 'application/json',
          }
        );
          
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
            
            sx={{ py: '0.8rem', mt: '1rem', backgroundColor: '#FF0000', "&:hover":{backgroundColor:'#4A0404'}}}
          >
            Submit
          </LoadingButton>
        </Box>
      </Box>
      </>
    );
  };
  
  export default ForgotPasswordForm;
  
  


