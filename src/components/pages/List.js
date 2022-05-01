import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import FormattedDate from "../common/FormattedDate"


const List= () => {
    const [spells, setSpells] = useState({})
    const [sending, setSending] = useState(false)
    const [editing, setEditing] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if(!sessionStorage.getItem(global.config.tokens.authToken)) 
            navigate(global.config.routes.login)
        else
            getSpells()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const getSpells = () => {
        const promise = new Promise((resolve) => 
            fetch(global.config.api.path + global.config.api.spells, {
                crossDomain:true,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            })
            .then((response) => {
                if (response.ok)
                    return response.json()

                throw new Error(response.statusText);
            })
            .then((spellListJSON => {
                setSpells(sortArray(spellListJSON.spells))

                resolve()
            })).catch((error) => {
                toast.error(`Could't fetch the spells, please report this error: ${error}`)
            })
        )

        toast.promise(promise, {
            pending: `Loading Spells`,
            error: `Something went wrong, please try again later`
        });
    }

    const handleSubmitAction = (e) => {
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
            crossDomain:true,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            method: editing ? 'PUT' : 'DELETE',
            body: JSON.stringify(editing ? fields : {id: fields.id})
        })
        .then((response) => {
            if (response.ok)
                return response.json()

            throw new Error(response.statusText);
        })
        .then((actionJSON) => {
            if (deleting) {
                setSpells(spells.filter((element) => {
                    return element.id !== actionJSON.id
                }))

                setTimeout(() => resolve(actionJSON), 100)
            }

            if (editing) {
                fetch(global.config.api.path + global.config.api.findByID, {
                    method: 'POST',
                    crossDomain:true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: actionJSON.id })
                }).then((response) => {
                    if (response.ok)
                        return response.json()

                    throw new Error(response.statusText);
                }).then((detailsJSON) =>  {
                    let aux = spells.filter((element) => {
                                return element.id !== fields.id && element.version !== fields.version
                            })
                    
                    aux.push(detailsJSON)

                    setSpells(sortArray(aux))

                    setTimeout(() => resolve(actionJSON), 100)
                }).catch((error) => toast.error(`Something went wrong, please report this error: ${error}`))
            }
        })
        .catch((error) => {
            toast.error(`Could't fetch the spells, please report this error: ${error}`)
        }).finally(() => setSending(false)))

        toast.promise(promise, {
            pending: `${editing ? 'Changing' : 'Deleting'} Spell "${fields.name}"`,
            success: `"${fields.name}" ${editing ? 'changed' : 'deleted'} with success!`,
            error: `Could't ${editing ? 'Edit' : 'Delete'} "${fields.name}" , please try again later`
        });
    }

    const setMode = (mode) => {
        if (mode === 'read-only') {
            setDeleting(false)
            setEditing(false)

            return
        }

        if (mode === 'delete-mode') {
            setDeleting(true)
            setEditing(false)

            return
        }

        if (mode === 'edit-mode') {
            setDeleting(false)
            setEditing(true)
        }
    }

    const sortArray = (array) => {
        return array.sort((mainValue, comparisonValue) => mainValue.name.localeCompare(comparisonValue.name))
    }

    return (
        <>
            { spells.length > 0 &&
                <div>
                    <h2>Spell List:</h2>

                    <div>
                        <p>Mode:</p>

                        <span>
                            <label htmlFor="read-only">Read Only</label>
                            <input type="checkbox"
                                id="read-only"
                                name="mode"
                                value="read-only"
                                checked={ !deleting && !editing}
                                disabled={ sending }
                                onChange={(e) => setMode(e.target.value)} />
                        </span>

                        <span>
                            <label htmlFor="edit-mode">Edit</label>
                            <input type="checkbox"
                                id="edit-mode"
                                name="mode"
                                value="edit-mode"
                                checked={ editing }
                                disabled={ sending }
                                onChange={(e) => setMode(e.target.value)} />
                        </span>

                        <span>
                        <label htmlFor="delete-mode">Delete</label>
                            <input type="checkbox"
                                id="delete-mode"
                                name="mode"
                                value="delete-mode"
                                checked={ deleting }
                                disabled={ sending }
                                onChange={(e) => setMode(e.target.value)} />
                        </span>

                        <button onClick={getSpells}>REFRESH</button><br/><br/>
                    </div>

                    <ul>
                        { spells.map((spell, key) => (
                            <li key={key}>
                                <form onSubmit={(e) => handleSubmitAction(e)} >
                                    <input name="id"
                                            type="hidden"
                                            value={spell.id}/>

                                    <label htmlFor={`name-${key}`}>Name: </label>
                                    <input id={`name-${key}`}
                                            name="name"
                                            type="text"
                                            defaultValue={spell.name}
                                            disabled={sending || !editing}
                                            required/>

                                    <label htmlFor={`type-${key}`}>Type: </label>
                                    <input id={`type-${key}`}
                                            name="type"
                                            type="text"
                                            disabled={sending || !editing}
                                            defaultValue={spell.type}
                                            required/>
                                    
                                    <input name="version"
                                            type="hidden"
                                            value={spell.version}/>

                                            {/* TODO >> fix value without onChange */}

                                    <FormattedDate date={spell.createdAt} />

                                    { (deleting || editing) &&
                                        <button type="submit" disabled={sending}>
                                            {deleting && 'REMOVE SPELL'}
                                            {editing && 'EDIT SPELL'}
                                        </button>
                                    }
                                </form>
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </>
    )
}

export default List