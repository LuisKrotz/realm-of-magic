// eslint-disable-next-line no-unused-vars
import { app } from '../../app/firebase.config'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword }  from 'firebase/auth'

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../common/LoginButton"


const LoginFields = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState('')

    const navigate = useNavigate()
    let token = sessionStorage.getItem(global.config.tokens.authToken)

    useEffect(() => {
        navigate(!token ? global.config.routes.login : global.config.routes.list)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const login = (data) => {
        sessionStorage.setItem(global.config.tokens.authToken, data)
        navigate(global.config.routes.list)
    }

    const handleAction = (action) => {
        const authentication = getAuth()

        if (action === 'register')
          createUserWithEmailAndPassword(authentication, email, password)
          .then((response) => login(response._tokenResponse.refreshToken))
          .catch((error) => {
                let array = [];

                console.log(error)

                if (error.code === 'auth/email-already-in-use') array.push('Email in use, please sign in!')
                if (error.code === 'auth/auth/invalid-email') array.push('Please, provide a valid email.')
                if (error.code === 'auth/weak-password') array.push('Please, provide a stronger password.')
                if (error.code === 'auth/internal-error') array.push('An unexpected error occoured, please reload the page and try again.')

                setErrors(array);
          })
        else
            signInWithEmailAndPassword(authentication, email, password)
            .then((response) => login(response._tokenResponse.refreshToken))
            .catch((error) => {
                let array = [];

                if (error.code === 'auth/wrong-password') array.push('Please check the Password.')
                if (error.code === 'auth/user-not-found') array.push('Please check the Email.')
                if (error.code === 'auth/internal-error') array.push('An unexpected error occoured, please reload the page and try again.')

                setErrors(array);
            })
      }

    const preventDefault = (e) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={preventDefault}>
            <h2>Login</h2>

            <label htmlFor="email">Email</label>
            <input id="email"
                    type="email"
                    placeholder="sample@email.com"
                    required
                    minLength="5"
                    onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input id="password"
                    type="password"
                    placeholder="****"
                    required
                    minLength="8"
                    onChange={(e) => setPassword(e.target.value)} />

            <Button label={'Sign In'}
                    handleAction={() => handleAction('login')} />
            <Button label={'Sign Up'}
                    handleAction={() => handleAction('register')} />


            { errors.length > 0 &&
                <ul>
                    { errors.map((error, key) => (
                        <li key={key}>{error}</li>
                    ))}
                </ul>
            }
        </form>
    )
}

export default LoginFields