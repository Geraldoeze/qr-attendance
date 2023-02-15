import axios from 'axios';

import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [resMessage, setResMessage] = useState();



  const sendRequest = useCallback(
    async (urlink, methodlink = 'GET', body = null, headers= {} ) => {
      setIsLoading(true);

      try {
        const response = await axios({
            url: urlink,
            method: methodlink,
            data: body,
            headers
        });

        const responseData = await response.data;
        
        if (!response.status === 200) {
          
          throw new Error(responseData.message);
        }
        setResMessage(responseData)
        setIsLoading(false);
        
        return responseData;
      } catch (err) {
        const errMess = err.response?.data || 'Error Occurred'
        setError(errMess);
        setIsLoading(false);
        
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
    setResMessage(null);
  };

  useEffect(() => {
    // useEffect serves as clean up whenever our code un-mounts.
 
  }, []);

  return { isLoading, error, sendRequest, clearError, resMessage };
};
