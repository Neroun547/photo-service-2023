"use client";

import {useEffect, useState} from "react";
import { checkToken } from "../auth/check-token/check-token";
import Image from "next/image";
import styles from "../styles/my-photo/my-photo.module.css";
import Link from "next/link";

async function getPhoto() {
    const response = await fetch("/api/photo/user-photo", {
        headers: {
            authorization: 'Bearer ' + localStorage.getItem("token")
        }
    });

    return await response.json();
}

export default function MyPhoto() {
    const [photo, setPhoto] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkToken()
            .then(() => {
                getPhoto()
                    .then(data => {
                        setPhoto(data);
                        setLoading(false);
                    })
            })

    }, []);

    if(photo.length) {
        return (
            <div>
                <Link className={styles["upload-image-link"]} href="/my-photo/upload-image">
                    <Image src="/upload-image.png" width={100} height={100}></Image>
                </Link>
                <div className={styles.wrapper__photo}>
                    {photo.map((el, i) => {
                        return (

                            <Link href={"/my-photo/" + el.filename}>
                                <img src={"/images/" + el.filename} className={styles['wrapper__photo-item']} />
                            </Link>
                        )
                    })}
                </div>
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
