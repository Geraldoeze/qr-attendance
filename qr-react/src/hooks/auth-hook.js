import {useState, useCallback, useEffect} from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [tokenExpDate, setTokenExpDate] = useState();
    const [userId, setUserId] = useState(null); 
    const [userDetails, setUserDetails] = useState(null);
    const [ accountType, setAccountType ] = useState(null);
  
    const login = useCallback((id, token, userDetails, type, expirationDate) => {
      
      setToken(token);
      setUserId(id);
      setAccountType(type);
      setUserDetails(userDetails);
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 6);
      setTokenExpDate(tokenExpirationDate);
      
      
      localStorage.setItem(
        'userData',
         JSON.stringify({
           userId: id, 
           token,
           userDetails,
           accountType: type,
           expiration: tokenExpirationDate.toISOString() }));
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpDate(null)
      setUserId(null);
      setUserDetails(null);
      setAccountType(null);
      localStorage.removeItem('userData');
    }, []);
  
    useEffect(() => {
      if (token && tokenExpDate) {
        const remainingTime = tokenExpDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        clearTimeout(logoutTimer);
      }
    }, [token, logout, tokenExpDate]);
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if (
        storedData &&
        storedData.token && 
        new Date(storedData.expiration) > new Date()) {
          
        login(storedData.userId, storedData.token, storedData.userDetails, storedData.accountType, new Date(storedData.expiration));
      }
    }, [login]);

    return { token, login, logout, userId, userDetails, accountType }
}; 