"use client";

import styles from "../../styles/my-photo/[filename]/[filename].module.css"
import {useEffect, useState} from "react";

export default function Photo({ params }: { params: { filename: string } }) {
    const [photoInfo, setPhotoInfo] = useState({ theme: "", date: "" });

    useEffect(() => {
        fetch("/api/photo/" + params.filename)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setPhotoInfo(data);
            });
    }, []);

    const deletePhoto = async () => {
        await fetch("/api/photo/" + params.filename, {
            method: "DELETE",
            headers: {
                authorization: "Bearer " + localStorage.getItem("token")
            }
        });

        window.location.href = "/my-photo";
    }

    return (
        <div>
            <div className={styles["wrapper__image"]}>
                <img src={"/images/" + params.filename} alt="Image"/>
                <div className={styles["wrapper__image-info"]}>
                    <div className={styles["wrapper__image-info-theme"]}><strong>Theme photo: </strong>{photoInfo.theme}</div>
                    <div className={styles["wrapper__image-info-date"]}><strong>Date: </strong>{photoInfo.date}</div>
                    <button className={styles["wrapper__image-info-delete-photo-btn"]} onClick={deletePhoto}>Delete photo</button>
                    <a className={styles["wrapper__image-info-download-photo-link"]} download href={"/api/photo/download/" + params.filename}>Download photo</a>
                </div>
            </div>
        </div>
    )
}
