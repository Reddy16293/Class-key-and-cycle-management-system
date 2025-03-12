import React, { useEffect, useState } from "react";

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/admin/api/user", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div>
            {user ? (
                <div>
                    <h2>Welcome, {user.name}</h2>
                    <p>Email: {user.email}</p>
                    <img src={user.picture} alt="Profile" style={{ borderRadius: "50%", width: "100px" }} />
                    <h3>role={user.role}</h3>
                </div>
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    );
};

export default Home;
