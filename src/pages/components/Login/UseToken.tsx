import { useState } from 'react'


// const getToken = () => {
//     const tokenString = localStorage.getItem('auth-token')
//     const userToken = JSON.parse(tokenString)
//     return userToken?.token
// }

const getToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdGVAZ21haWwuY29tIiwiaWQiOiI2MGEzYmQ0ZTU3ZjEzZjQxZDQyNWVjZjIiLCJpYXQiOjE2MjEzNDM1NzJ9.Onj5UDCGufiS-DMtxG9ALjSsupuu11iNOfIqvrPxJDc"
}

function useToken() {
    const [token, setToken] = useState(getToken())

    const saveToken = userToken => {
        if (userToken) {
            localStorage.setItem('auth-token', JSON.stringify(userToken))
            setToken(userToken.token)
        }
    }

    return {
        setToken: saveToken,
        token
    }
}

export { getToken, useToken }

