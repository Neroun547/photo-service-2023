"use client";

import styles from "./styles/main-page.module.css";
import photoComponent from "./styles/components/photo.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Main() {
    const [photo, setPhoto] = useState([]);

    useEffect(() => {
        fetch("/api/photo/random-photo")
            .then(response => {
                return response.json();
            })
            .then(data => {
                setPhoto(data);
            });
    }, []);

    if(photo.length) {
        return (
            <main>
                <div className={styles["wrapper__info-service"]}>
                    <h2>It's photo service</h2>
                    <p>This service give you possibility for publish photo, search photo, download photo</p>
                </div>
                <form className={styles["search-photo-form"]}>
                    <input type="text" placeholder="Search by theme:"/>
                    <button type="submit">Search</button>
                </form>
                <div className={photoComponent.wrapper__photo}>
                    {photo.map((el, i) => {
                        return (
                            <Link href={"/photo/" + el.filename}>
                                <img src={"/images/" + el.filename} className={photoComponent['wrapper__photo-item']}/>
                            </Link>
                        )
                    })}
                </div>
            </main>
        )
    } else {
        return <div>Loading ...</div>
    }
}
