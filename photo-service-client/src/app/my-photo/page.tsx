"use client";

import {useEffect, useState} from "react";
import { checkToken } from "../auth/check-token/check-token";
import Image from "next/image";
import styles from "../styles/my-photo/my-photo.module.css";
import photoComponent from "../styles/components/photo.module.css";
import Link from "next/link";

async function getPhoto(count: number, skip: number) {
    const response = await fetch(`/api/photo/user-photo?count=${count}&skip=${skip}`, {
        headers: {
            authorization: 'Bearer ' + localStorage.getItem("token")
        }
    });

    return await response.json();
}

export default function MyPhoto() {
    const [loadMorePhotoState, setLoadMorePhotoState] = useState(false);
    const [skipPhoto, setSkipPhoto] = useState(0);
    const [photo, setPhoto] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkToken()
            .then(() => {
                getPhoto(10, skipPhoto)
                    .then(data => {

                        if(data.length < 10) {
                            setLoadMorePhotoState(false);
                        } else {
                            setLoadMorePhotoState(true);
                        }
                        setPhoto(data);
                        setSkipPhoto((prevState: number) => prevState + 10);
                        setLoading(false);
                    })
            })

    }, []);

    const loadMorePhoto = async () => {
        const data = await getPhoto(10, skipPhoto);

        if(data.length < 10) {
            setLoadMorePhotoState(false);
        }
        setSkipPhoto((prevState: number) => prevState + 10);
        setPhoto((prevState) => [...prevState, ...data]);
    }

    if(photo.length) {
        return (
            <div>
                <Link className={styles["upload-image-link"]} href="/my-photo/upload-image">
                    <Image src="/upload-image.png" width={100} height={100}></Image>
                </Link>
                <div className={photoComponent.wrapper__photo}>
                    {photo.map((el, i) => {
                        return (

                            <Link href={"/my-photo/" + el.filename}>
                                <img src={"/images/" + el.filename} className={photoComponent['wrapper__photo-item']} />
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
        return (
            <div>
                <Link className={styles["upload-image-link"]} href="/my-photo/upload-image">
                    <Image src="/upload-image.png" width={100} height={100}></Image>
                </Link>
                <h2  className={styles["no-photo-logo"]}>You don't have photo ...</h2>
            </div>
        )
    }
}
