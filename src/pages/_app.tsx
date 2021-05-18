import { AppProps } from "next/app"
import React from "react"
import GlobalStyle from "../styles/global"
import Login from './components/Login/Login'
import { useToken } from './components/Login/UseToken'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    const { token, setToken } = useToken()

    if (!token) {
        return <Login setToken={setToken} />
    }
    return (
        <>
            <Component {...pageProps} />
            <GlobalStyle />
        </>
    )
}

export default MyApp
