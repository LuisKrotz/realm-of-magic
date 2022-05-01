import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { toast } from 'react-toastify'

const Create = () => {
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [sending, setSending] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        navigate(!sessionStorage.getItem(global.config.tokens.authToken) ?? global.config.routes.login)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const postSpell = (e) => {
        e.preventDefault();

        const fields = Array.prototype.slice.call(e.target)
        .filter(field => field.name)
        .reduce((form, field) => ({
            ...form,
            [field.name]: field.value,
        }), {})

        setSending(true)

        const promise = new Promise((resolve) =>
            fetch(global.config.api.path + global.config.api.spells, {
                method: 'POST',
                mode: 'cors',
                crossDomain:true,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fields)
            })
            .then((response) => response.json())
            .then((json) => {
                setName('')
                setType('')

                resolve(json)
            })
            .catch((error) => {
                console.log(error)

            }).finally(() => {
                setSending(false)
            })
        )

        toast.promise(promise, {
            pending: `Creating spell`,
            success: `"${fields.name}" created with success`,
            error: `Could't create "${fields.name}" , please try again later`
        });
    }


    return (
            <form onSubmit={(e) => postSpell(e)} className={sending ? 'sending': ''}>
            <h2>Create Spell</h2>

            <label htmlFor="name">Name</label>
            <input id="name"
                    name="name"
                    type="text"
                    placeholder="Wingardium Leviosa"
                    disabled={sending}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required/>

            <label htmlFor="type">Type</label>
            <input id="type"
                    name="type"
                    type="text"
                    placeholder="Charm"
                    disabled={sending}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required/>

            <button type="submit" disabled={sending}>submit</button>
        </form>
    )
}

export default Create