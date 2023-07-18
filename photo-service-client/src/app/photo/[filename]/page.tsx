"use client";

import styles from "../../styles/my-photo/[filename]/[filename].module.css";
import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";

export default function Photo({ params }: { params: { filename: string } }) {
    const [photoInfo, setPhotoInfo] = useState({ theme: "", date: "", user: { username: "", avatar: "", email: "" } });

    useEffect(() => {
        fetch("/api/photo/" + params.filename)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setPhotoInfo(data);
            });
    }, []);

    return (
        <div>
            <div className={styles["wrapper__image"]}>
                <img src={"/images/" + params.filename} alt="Image" className={styles["wrapper__image-image"]}/>
                <div className={styles["wrapper__image-info"]}>
                    <div className={styles["wrapper__image-info-theme"]}>
                        <strong>Theme photo: </strong>{photoInfo.theme}
                    </div>
                    <div className={styles["wrapper__image-info-date"]}><strong>Date: </strong>{photoInfo.date}</div>
                    <div>
                        <div className={styles["wrapper__image-info-author"]}>
                            <h2>Author info:</h2>
                            { photoInfo.user.avatar ? <img src={"/avatars/" + photoInfo.user.avatar} alt="Avatar"/> : <img src="/profile.png"/>}
                            <Link href={"/users/" + photoInfo.user.username}>{photoInfo.user.username}</Link>
                            <span>Email: {photoInfo.user.email}</span>
                        </div>
                    </div>
                    <a className={styles["wrapper__image-info-download-photo-link-public"]} download
                       href={"/api/photo/download/" + params.filename}>Download photo</a>
                </div>
            </div>
        </div>
    )
}
