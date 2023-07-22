"use client";

import {useEffect, useState} from "react";
import photoComponent from "@/app/styles/components/photo.module.css";
import styles from "@/app/styles/users/users.module.css";
import Link from "next/link";

async function getUserInfo(username: string) {
    const response = await fetch(`/api/users/${username}`);

    return await response.json();
}

async function getPhoto(username: string, count: number, skip: number) {
    const response = await fetch(`/api/photo/by-username/${username}?count=${count}&skip=${skip}`);

    return await response.json();
}

export default function User({ params }: { params: { username: string } }) {
    const [loadMorePhotoState, setLoadMorePhotoState] = useState(false);
    const [skipPhoto, setSkipPhoto] = useState(0);
    const [photo, setPhoto] = useState<never[] | any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({ username: "", email: "", avatar: "" });

    useEffect( () => {
        getUserInfo(params.username)
            .then(data => {
                setUserInfo(data)
                    getPhoto(params.username, 10, skipPhoto)
                        .then(data => {
                            setPhoto(data);

                            if(data.length < 10) {
                                setLoadMorePhotoState(false);
                            } else {
                                setLoadMorePhotoState(true);
                            }
                            setSkipPhoto((prevState: number) => prevState + 10);
                            setLoading(false);
                        });
            });
    }, []);

    const loadMorePhoto = async () => {
        const data = await getPhoto(params.username, 10, skipPhoto);

        if(data.length < 10) {
            setLoadMorePhotoState(false);
        }
        setPhoto((prevState) => [...prevState, ...data]);
        setSkipPhoto((prevState: number) => prevState + 10);
    }

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
                {loadMorePhotoState ? <button className={photoComponent["load-more-btn"]} onClick={loadMorePhoto}>Load more photo</button> : ""}
            </div>
        )
    } else if(loading) {
        return <div>Loading ...</div>
    } else {
        return <div>This user don't have photo ...</div>
    }
}
