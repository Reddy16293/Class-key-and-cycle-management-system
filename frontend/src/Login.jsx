import React from "react";

const Login = () => {
    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div>
            <h1>Login with Google</h1>
            <button onClick={handleLogin}>Sign in with Google</button>
        </div>
    );
};

export default Login;
