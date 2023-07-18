"use client";

import {useEffect, useState} from "react";
import photoComponent from "@/app/styles/components/photo.module.css";
import styles from "@/app/styles/users/users.module.css";
import Link from "next/link";

export default function User({ params }: { params: { username: string } }) {
    const [photo, setPhoto] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({ username: "", email: "", avatar: "" });

    useEffect( () => {
        fetch("/api/users/" + params.username)
            .then(response => {
                return response.json();
            })
            .then(data => {
                setUserInfo(data);

                fetch("/api/photo/by-username/" + params.username)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        setPhoto(data);
                        setLoading(false);
                    });
            });
    }, []);

    if(!loading && photo.length) {
        return (
            <div>
                <div className={styles["wrapper__author-photo-info"]}>
                    { userInfo.avatar ? <img src={"/avatars/" + userInfo.avatar} alt="Avatar"/> : <img src="/profile.png" alt="Avatar"/>}
                    <span>{params.username}</span>
                    <span>Email: {userInfo.email}</span>
                </div>
                <div className={photoComponent.wrapper__photo}>
                    {photo.map((el, i) => {
                        return (
                            <Link href={"/photo/" + el.filename}>
                                <img src={"/images/" + el.filename} className={photoComponent["wrapper__photo-item"]}/>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    } else if(loading) {
        return <div>Loading ...</div>
    } else {
        return <div>This user don't have photo ...</div>
    }
}
