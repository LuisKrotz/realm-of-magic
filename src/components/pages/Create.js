import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Create = () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate(!sessionStorage.getItem(global.config.tokens.authToken) ?? global.config.routes.login)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            TODO:
            <ul>
                <li>Create magic</li>
            </ul>
        </>
    )
}

export default Create