import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import FormattedDate from "../common/FormattedDate"

const Create = () => {
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [latestSpells, setLatestSpells] = useState([])
    const [sending, setSending] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        navigate(!sessionStorage.getItem(global.config.tokens.authToken) ?? global.config.routes.login)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const getSpellById = (id) => {
        fetch(global.config.api.path + global.config.api.findByID, {
            method: 'POST',
            crossDomain:true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id })
        }).then((response) => {
            if (response.ok)
                return response.json()

            throw new Error(response.statusText);
        }).then((detailsJSON) =>  {
            setLatestSpells([...latestSpells, detailsJSON].reverse())

        }).catch((error) => toast.error(`Something went wrong, please report this error: ${error}`))
    }


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
            .then((response) => {
                if (response.ok)
                    return response.json()

                throw new Error(response.statusText);
            })
            .then((creationJSON) => {
                setName('')
                setType('')

                setTimeout(() => resolve(creationJSON), 100)
                getSpellById(creationJSON.id)
            })
            .catch((error) => {
                toast.error(`Could't create "${fields.name}", please report this error: ${error}`)
            }).finally(() => {
                setSending(false)
            })
        )

        toast.promise(promise, {
            pending: `Creating spell`,
            success: `"${fields.name}" created with success!`,
            error: `Could't create "${fields.name}" , please try again later`
        });
    }


    return (
        <>
            <form onSubmit={(e) => postSpell(e)}>
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

            { latestSpells.length > 0 &&
                <>
                    <h3>Latest Additions:</h3>
                    <ul>
                        {latestSpells.map((spell, key) => (
                            <li key={key}>
                                <span>Name: {spell.name}</span>
                                <span>Type: {spell.type}</span>
                                <span>Date: <FormattedDate date={spell.createdAt} /></span>
                            </li>
                        ))}
                    </ul>
                </>
            }
        </>
    )
}

export default Create