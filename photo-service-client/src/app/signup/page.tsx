"use client";

import styles from "../styles/signup/signup.module.css";
import formComponent from "../styles/components/form.module.css";
import { useState } from "react";

export default function Signup() {
    const [username, setUsername]  = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const signUp = async (e: any) => {
        e.preventDefault();

        const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if(!response.ok) {

            if (typeof data.message === "string") {
                setErrorMessage(data.message);
            }
            if (typeof data.message !== "string") {
                setErrorMessage(data.message[0]);
            }
        } else {
            window.location.href = "/auth";
        }
    }

    return (
        <div>
            <form className={formComponent.wrapper__form} onSubmit={signUp}>
                <input type="text" placeholder="Username:" onChange={(e) => setUsername(e.target.value)} required={true}/>
                <input type="email" placeholder="Email:" onChange={(e) => setEmail(e.target.value)} required={true}/>
                <input type="password" placeholder="Password:" onChange={(e) => setPassword(e.target.value)} required={true}/>
                <button type="submit">Sign up</button>
                {errorMessage.length ? <div className={formComponent.error_message}>{errorMessage}</div> : ""}
            </form>
        </div>
    )
}
