"use client"

import styles from "../styles/auth/auth.module.css";
import formComponent from "../styles/components/form.module.css";
import { useState } from "react";

export default function Auth() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const auth = async (e: any) => {
        e.preventDefault();

        const response = await fetch("/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if(response.ok) {
            const token = (await response.json()).token;

            localStorage.setItem("token", token);
            window.location.href = "/";
        } else {
            const errorMessage = (await response.json()).message;

            if(typeof errorMessage === "string") {
                setErrorMessage(errorMessage);
            } else {
                setErrorMessage(errorMessage[0]);
            }
        }
    }

    return (
        <div>
            <form className={formComponent.wrapper__form} onSubmit={auth}>
                <input type="text" placeholder="Username or email:" onChange={(e) => setUsername(e.target.value)} required={true}/>
                <input type="password" placeholder="Password:" onChange={(e) => setPassword(e.target.value)} required={true}/>
                <button type="submit">Auth</button>
                {errorMessage.length ? <div className={formComponent.error_message}>{errorMessage}</div> : ""}
            </form>
        </div>
    )
}
