// eslint-disable-next-line no-unused-vars
import { app } from '../../app/firebase.config'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword }  from 'firebase/auth'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import Button from "../common/LoginButton"

import '../../sass/login.scss'


const LoginFields = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    let token = sessionStorage.getItem(global.config.tokens.authToken)

    useEffect(() => {
        navigate(!token ? global.config.routes.login : global.config.routes.list)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        document.title = props.title
    }, [props.title])

    const login = (data) => {
        sessionStorage.setItem(global.config.tokens.authToken, data)
        navigate(global.config.routes.list)
    }

    const handleAction = (action) => {
        const authentication = getAuth()

        if (action === 'register')
          createUserWithEmailAndPassword(authentication, email, password)
          .then((response) => {
              login(response._tokenResponse.refreshToken)

              toast.success('Welcome to Magic Demo!')
            })
          .catch((error) => {
                if (error.code === 'auth/email-already-in-use') toast.info('Email in use, please sign in!')
                if (error.code === 'auth/auth/invalid-email') toast.error('Please, provide a valid email.')
                if (error.code === 'auth/weak-password') toast.error('Please, provide a stronger password.')
                if (error.code === 'auth/internal-error') toast.error('An unexpected error occoured, please reload the page and try again.')
          })
        else
            signInWithEmailAndPassword(authentication, email, password)
            .then((response) => {
                login(response._tokenResponse.refreshToken)

                toast.success('Welcome Back!')
            })
            .catch((error) => {
                if (error.code === 'auth/wrong-password') toast.warn('Please check the Password.')
                if (error.code === 'auth/user-not-found') toast.warn('Please check the Email.')
                if (error.code === 'auth/internal-error') toast.error('An unexpected error occoured, please reload the page and try again.')
            })
      }

    const preventDefault = (e) => {
        e.preventDefault()
    }

    return (
        <form className='magic-login' onSubmit={preventDefault}>
            <video className='magic-login-background' poster="https://media.giphy.com/media/l41lN3o4fk4ZgrSDK/giphy.gif" width="480" height="480" playsInline autoPlay loop muted>
                <source src="https://media.giphy.com/media/l41lN3o4fk4ZgrSDK/giphy.mp4"></source>
            </video>

            <div className='magic-login-wrapper'>
                <h2 className='magic-login-title'>Magic Login</h2>

                <label className='magic-login-label'
                    htmlFor="email">Email</label>
                <input className='magic-login-field'
                    id="email"
                    type="email"
                    placeholder="sample@email.com"
                    required
                    minLength="5"
                    onChange={(e) => setEmail(e.target.value)} />

                <label className='magic-login-label'
                    htmlFor="password">Password</label>
                <input className='magic-login-field'
                    id="password"
                    type="password"
                    placeholder="****"
                    required
                    minLength="8"
                    onChange={(e) => setPassword(e.target.value)} />

                <div className='magic-login-buttons'>
                    <Button label={'Sign In'}
                        handleAction={() => handleAction('login')} />
                    <Button label={'Sign Up'}
                        handleAction={() => handleAction('register')} />
                </div>
            </div>
        </form>
    )
}

export default LoginFields