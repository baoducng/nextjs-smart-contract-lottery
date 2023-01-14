import Head from "next/head"
//import ManualHeader from "../components/ManualHeader"
import LotteryEntrance from "../components/LotteryEntrance"
import Header from "../components/Header"
import styles from "../styles/Home.module.css"

export default function Home() {
    return (
        <>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Our smart contract lottery" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <LotteryEntrance />
        </>
    )
}
