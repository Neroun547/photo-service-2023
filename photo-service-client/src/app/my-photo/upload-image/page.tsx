"use client";

import formComponent from "../../styles/components/form.module.css";
import {FormEvent, useState} from "react";
import styles from "../../styles/my-photo/upload-image/upload-image.module.css";

export default function uploadImage() {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [theme, setTheme] = useState("");
    const [file, setFile] = useState();
    const [createObjectUrl, setCreateObjectUrl] = useState(null);

    const uploadImage = async (e: any) => {
        e.preventDefault();

        const formData = new FormData();

        //@ts-ignore
        formData.append("theme", theme);
        //@ts-ignore
        formData.append("image", file);

        const response = await fetch("/api/photo/", {
            method: "POST",
            body: formData,
            headers: {
                authorization: "Bearer " + localStorage.getItem("token")
            }
        });

        if(response.ok) {
            setErrorMessage("");
            setSuccessMessage("Image uploaded success");
        } else {
            const errorMessage = (await response.json()).message;

            setSuccessMessage("");

            if(typeof errorMessage === "string") {
                setErrorMessage(errorMessage);
            } else {
                setErrorMessage(errorMessage[0]);
            }
        }
    }
    return (
        <div>
            {createObjectUrl ? <img src={createObjectUrl} className={styles["upload-image-image"]}></img> : ""}
            <form className={formComponent.wrapper__form} onSubmit={uploadImage} style={{marginTop: 100}}>
                <input type="text" placeholder="Theme" onChange={(e) => setTheme(e.target.value)} required={true}/>
                <input type="file" onChange={(e) => {
                    //@ts-ignore
                    setFile(e.target.files[0])
                    //@ts-ignore
                    setCreateObjectUrl(URL.createObjectURL(e.target.files[0]));
                }} required={true}/>
                <button>Upload image</button>
                {errorMessage.length ? <div className={formComponent.error_message}>{errorMessage}</div> : ""}
                {successMessage.length ? <div className={formComponent.success_message}>{successMessage}</div> : ""}
            </form>
        </div>
    )
}
