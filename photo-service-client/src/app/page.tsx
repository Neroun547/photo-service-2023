"use client";

import styles from "./styles/main-page.module.css";
import photoComponent from "./styles/components/photo.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

async function getPhoto(count: number, skip: number) {
    const response = await fetch(`/api/photo/random-photo/?count=${count}&skip=${skip}`);

    return await response.json();
}

async function getPhotoByTheme(theme: string, count: number, skip: number) {
    const response = await fetch(`/api/photo/by-theme/${theme}?count=${count}&skip=${skip}`);

    return await response.json();
}

export default function Main() {
    const [loadMorePhotoState, setLoadMorePhotoState] = useState(false);
    const [skipPhoto, setSkipPhoto] = useState(0);
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState([]);
    const [theme, setTheme] = useState("");

    useEffect(() => {
        getPhoto(10, skipPhoto)
            .then(data => {
                setLoading(false);
                setPhoto(data);

                if(data.length < 10) {
                    setLoadMorePhotoState(false);
                } else {
                    setLoadMorePhotoState(true);
                }
                setSkipPhoto((prevState: number) => prevState + 10);
            });
    }, []);

    const searchPhotoByTheme = async (e) => {
        e.preventDefault();

        const data = await getPhotoByTheme(theme, 10, 0);

        if(data.length < 10) {
            setLoadMorePhotoState(false);
        } else {
            setLoadMorePhotoState(true);
        }
        setSkipPhoto(10);
        setPhoto(data);
    }

    const loadMorePhoto = async () => {

        if(theme) {
            const data = await getPhotoByTheme(theme, 10, skipPhoto);

            if (data.length < 10) {
                setLoadMorePhotoState(false);
            }
            setPhoto((prevState) => [...prevState, ...data]);
            setSkipPhoto((prevState: number) => prevState + 10);
        } else {
            const data = await getPhoto(10, skipPhoto);

            if (data.length < 10) {
                setLoadMorePhotoState(false);
            }
            setPhoto((prevState) => [...prevState, ...data]);
            setSkipPhoto((prevState: number) => prevState + 10);
        }
    }

    if(photo.length) {
        return (
            <main>
                <div className={styles["wrapper__info-service"]}>
                    <h2>It's photo service</h2>
                    <p>This service give you possibility for publish photo, search photo, download photo</p>
                </div>
                <form className={styles["search-photo-form"]} onSubmit={searchPhotoByTheme}>
                    <input type="text" placeholder="Search by theme:" onChange={(e) => setTheme(e.target.value)}/>
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

                {loadMorePhotoState ? <button className={photoComponent["load-more-btn"]} onClick={loadMorePhoto}>Load more photo</button> : ""}
            </main>
        )
    } else if(loading) {
        return <div>Loading ...</div>
    } else {
        return (
            <main>
                <div className={styles["wrapper__info-service"]}>
                    <h2>It's photo service</h2>
                    <p>This service give you possibility for publish photo, search photo, download photo</p>
                </div>
                <form className={styles["search-photo-form"]} onSubmit={searchPhotoByTheme}>
                    <input type="text" placeholder="Search by theme:" onChange={(e) => setTheme(e.target.value)}/>
                    <button type="submit">Search</button>
                </form>
                <h2 className={styles["not-found-photo"]}>Photo not found ...</h2>
            </main>
        )
    }
}
