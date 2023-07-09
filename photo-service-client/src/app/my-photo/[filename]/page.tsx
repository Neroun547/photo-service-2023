"use client";

import styles from "../../styles/my-photo/[filename]/[filename].module.css"
import {useEffect, useState} from "react";

export default function Photo({ params }: { params: { filename: string } }) {
    const [photoInfo, setPhotoInfo] = useState({ theme: "", date: "" });
    const [showRedactInputTheme, setShowRedactInputTheme] = useState(false);

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

    const showRedactThemeInput = () => {
        setShowRedactInputTheme((prevState: boolean) => !prevState);
    }

    const saveChangeTheme = async () => {
        await fetch("/api/photo/" + params.filename, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                theme: photoInfo.theme
            })
        });
        setShowRedactInputTheme(false);
    }

    if(!showRedactInputTheme) {
        return (
            <div>
                <div className={styles["wrapper__image"]}>
                    <img src={"/images/" + params.filename} alt="Image" className={styles["wrapper__image-image"]}/>
                    <div className={styles["wrapper__image-info"]}>
                        <div className={styles["wrapper__image-info-theme"]}>
                            <strong>Theme photo: </strong>{photoInfo.theme}
                            <img src="/redact-theme.png" alt="redact" className={styles["redact-theme-img"]}
                                 onClick={showRedactThemeInput}/>
                        </div>
                        <div className={styles["wrapper__image-info-date"]}><strong>Date: </strong>{photoInfo.date}
                        </div>
                        <button className={styles["wrapper__image-info-delete-photo-btn"]} onClick={deletePhoto}>Delete
                            photo
                        </button>
                        <a className={styles["wrapper__image-info-download-photo-link"]} download
                           href={"/api/photo/download/" + params.filename}>Download photo</a>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className={styles["wrapper__image"]}>
                    <img src={"/images/" + params.filename} alt="Image" className={styles["wrapper__image-image"]}/>
                    <div className={styles["wrapper__image-info"]}>
                        <div className={styles["wrapper__image-info-theme"]}>
                            <input type="text" placeholder="Theme" value={photoInfo.theme} onChange={(e) =>
                                setPhotoInfo((prevState) => ({ ...prevState, theme: e.target.value }))}
                            />
                            <button onClick={saveChangeTheme}>Save change</button>
                        </div>
                        <div className={styles["wrapper__image-info-date"]}><strong>Date: </strong>{photoInfo.date}
                        </div>
                        <button className={styles["wrapper__image-info-delete-photo-btn"]} onClick={deletePhoto}>Delete
                            photo
                        </button>
                        <a className={styles["wrapper__image-info-download-photo-link"]} download
                           href={"/api/photo/download/" + params.filename}>Download photo</a>
                    </div>
                </div>
            </div>
        )
    }
}
