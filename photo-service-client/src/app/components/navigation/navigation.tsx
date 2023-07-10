"use client"

import Link from "next/link"
import styles from "../../styles/navigation/navigation.module.css";
import { useEffect, useState } from "react";
import {checkToken} from "../../auth/check-token/check-token";
import Image from "next/image";

export default function DashboardLayout() {
    const [auth, setAuth] = useState(false);
    const [avatar, setAvatar] = useState(false);

    useEffect(() => {
        checkToken(false)
            .then((value: boolean) => {
                setAuth(value);
            });
        fetch("/api/users/", {
            headers: {
                authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setAvatar(data.avatar);
            })
    });

    const exit = () => {
        localStorage.setItem("token", "");

        window.location.href = "/";
    }

    if(auth) {
        return (
            <div className={styles.wrapper__nav}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.link}>Main</Link>
                    <Link href="/my-photo" className={styles.link}>My photo</Link>
                    <Link href="/profile" className={styles.link}>
                        {avatar ? <Image src={"/avatars/" + avatar} width={35} height={35} style={{ borderRadius: "50%" }}/> : <Image src="/profile.png" width={35} height={35}/>}
                    </Link>
                    <button onClick={exit} className={styles.exit}>Exit</button>
                </nav>
            </div>
        )
    } else {
        return (
            <div className={styles.wrapper__nav}>
                <nav className={styles.nav}>
                    <Link href="/auth" className={styles.link}>Sign in</Link>
                    <Link href="/signup" className={styles.link}>Sign up</Link>
                    <Link href="/" className={styles.link}>Main</Link>
                </nav>
            </div>
        )
    }
}
