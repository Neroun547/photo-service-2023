import styles from "./styles/main-page.module.css";

export default function Main() {
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
    </main>
  )
}
