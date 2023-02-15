import React, { useContext } from 'react'
import { Navigate } from 'react-router';
import { AuthContext } from '../../../context/auth-context'

export default function Logout() {
    const auth = useContext(AuthContext);
    auth.logout()

    return auth.isLoggedIn ? children : <Navigate to="/auth" />;
}
