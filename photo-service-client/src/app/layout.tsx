import Navigation from "./components/navigation/navigation";
import "./styles/normalize.css";
import styles from "./styles/main.module.css";
import { Roboto } from 'next/font/google'

export const metadata = {
  title: 'Photo service'
}

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body className={roboto.className}>
        <Navigation/>
        <div className={styles.wrapper__main}>
            {children}
        </div>
      </body>
    </html>
  )
}
