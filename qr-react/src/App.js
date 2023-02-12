// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
// hooks
import { useAuth } from './hooks/auth-hook';
import { AuthContext } from './context/auth-context';

// ----------------------------------------------------------------------

export default function App() {

  const { token, login, logout, userDetails, userId } = useAuth();

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!token,  // The !! in from of token converts token to true if there's a value or data type
      token,
      userId,
      userDetails,
      login,
      logout}}>  
    <ThemeProvider>
      <ScrollToTop />
      <Router />
    </ThemeProvider>
    </AuthContext.Provider>
  );
}
