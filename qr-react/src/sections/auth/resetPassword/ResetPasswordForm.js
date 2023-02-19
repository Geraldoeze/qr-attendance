import { Box, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect,  } from 'react';
import { LoadingButton } from '@mui/lab';

import { useHttpClient } from '../../../hooks/http-hook';

import ErrorModal from '../../../UIElement/Modal/ErrorModal';
import LoadingSpinner from '../../../UIElement/LoadingSpinner';

const registerSchema = object({
  newPassword: string({ required_error: 'Password is required' })
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string({ required_error: 'Please confirm your password' }),
}).refine((data) => data.newPassword === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});

const ResetPasswordForm = () => {
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
    const urlParam = window.location.pathname.split('/');
    const userId = urlParam[urlParam.length - 2];
    const resetString = urlParam[urlParam.length - 1];
    const data = { ...values, userId, resetString };
    console.log(data);
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/resetPassword`, 'POST', JSON.stringify(data),
        {
          'Content-Type': 'application/json'
        }
      );
    } catch (err) {
      console.log(err.message, err.response);
    }
  };
  console.log(errors);

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClose={clearError} response={resMessage} open={error} />
      <Box sx={{ maxWidth: '30rem' }}>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitHandler)}>
          <TextField
            sx={{ mb: 2 }}
            label="New Password"
            fullWidth
            required
            type="password"
            error={!!errors.newPassword}
            helperText={errors.newPassword ? errors.newPassword.message : ''}
            {...register('newPassword')}
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
          <LoadingButton variant="contained" fullWidth type="submit" sx={{ py: '0.8rem', mt: '1rem', backgroundColor: '#4A0404',"&:hover":{backgroundColor:'#900C3F'} }}>
            Submit
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
};

export default ResetPasswordForm;
