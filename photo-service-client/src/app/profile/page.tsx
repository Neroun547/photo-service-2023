"use client";

import {FormEvent, useEffect, useState} from "react";
import { checkToken } from "../auth/check-token/check-token";
import formComponent from "../styles/components/form.module.css";
import styles from "../styles/profile/profile.module.css";

async function getUserData() {
    const response = await fetch("/api/users/get-info-auth-user", {
        headers: {
            authorization: "Bearer " + localStorage.getItem("token")
        }
    });
    return await response.json();
}

export default function Profile() {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [username, setUsername] = useState("");

    const [avatar, setAvatar] = useState();
    const [createObjectUrl, setCreateObjectUrl] = useState();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [changePassword, setChangePassword] = useState(false);

    useEffect(() => {
        checkToken()
            .then(() => {
                getUserData()
                    .then((user) => {
                        setUsername(user.username);
                        setEmail(user.email);
                    })
            })
    }, []);

    const changeUserParams = async (e: FormEvent) => {
        e.preventDefault();

        let newToken;
        let response;

        if(changePassword) {
            if(avatar) {
                const formData = new FormData();

                formData.append("username", username);
                formData.append("email", email);
                formData.append("password", password);
                formData.append("avatar", avatar);

                response = await fetch("/api/users", {
                    method: "PATCH",
                    headers: {
                        authorization: "Bearer " + localStorage.getItem("token")
                    },
                    body: formData
                });
            } else {
                response = await fetch("/api/users", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                });
            }
        } else {
            if(avatar) {
                const formData = new FormData();

                formData.append("username", username);
                formData.append("email", email);
                formData.append("avatar", avatar);

                response = await fetch("/api/users", {
                    method: "PATCH",
                    headers: {
                        authorization: "Bearer " + localStorage.getItem("token")
                    },
                    body: formData
                });
            } else {
                response = await fetch("/api/users", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email
                    })
                });
            }
        }
        if(response.ok) {
            newToken = (await response.json()).token;
            localStorage.setItem("token", newToken);
            setErrorMessage("");
            setSuccessMessage("Params changed success");
        } else {
            let error = (await response.json()).message;

            setSuccessMessage("");

            if(typeof error === "string") {
                setErrorMessage(error);
            } else {
                setErrorMessage(error[0]);
            }
        }
    }
    return (
        <div>
            {createObjectUrl ? <img src={createObjectUrl} className={styles["upload-avatar-image"]}></img> : ""}
            <form className={formComponent.wrapper__form} onSubmit={changeUserParams}>
                <input type="file" onChange={(e) => {
                    //@ts-ignore
                    setAvatar(e.target.files[0])
                    //@ts-ignore
                    setCreateObjectUrl(URL.createObjectURL(e.target.files[0]));
                }} required={false}/>
                <input type="text" placeholder="Username:" value={username} onChange={(e) => setUsername(e.target.value)} required={true}/>
                <input type="text" placeholder="Email:" value={email} onChange={(e) => setEmail(e.target.value)} required={true}/>
                <button onClick={() => setChangePassword((prevState) => !prevState)} type="button">Change password</button>
                {changePassword
                    ? <input type="password" placeholder="Password:" value={password} onChange={(e) => setPassword(e.target.value)} min={6} max={30} required={true}/>
                    : ""}
                <button type="submit">Save change</button>
                {errorMessage.length ? <div className={formComponent.error_message}>{errorMessage}</div> : ""}
                {successMessage.length ? <div className={formComponent.success_message}>{successMessage}</div> : ""}
            </form>
        </div>
    )
}
