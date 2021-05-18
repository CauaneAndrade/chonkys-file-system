import React, { useState } from 'react'

async function loginUser(credentials) {
    return fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export default function Login({ setToken }) {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = async e => {
        e.preventDefault()
        const data = await loginUser({
            email,
            password
        })
        setToken(data.data)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <p>Username</p>
                <input type='text' onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
                <p>Password</p>
                <input type='password' onChange={e => setPassword(e.target.value)} />
            </label>
            <div>
                <button type='submit'>Submit</button>
            </div>
        </form>
    )
}
