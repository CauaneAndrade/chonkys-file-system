import { useState } from 'react'


// const getToken = () => {
//     const tokenString = localStorage.getItem('auth-token')
//     const userToken = JSON.parse(tokenString)
//     return userToken?.token
// }

const getToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW8yQGdtYWlsLmNvbSIsImlkIjoiNjBhNTZlZDdkZDY1OTk0YTBjNDBjMTBiIiwiaWF0IjoxNjIxNDU0NTU2fQ.WpneCSs7FvoCKUsrXhOjYIcdCNSGlkhQwn5Jq6xXkYs"
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

