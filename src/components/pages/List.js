import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import FormattedDate from "../common/FormattedDate"
import ListHidden from "./list/ListHidden"
import ListInput from "./list/ListInput"

import '../../sass/list.scss'


const List = (props) => {
    const [deleting, setDeleting] = useState(false)
    const [editing, setEditing] = useState(false)
    const [sending, setSending] = useState(false)
    const [spells, setSpells] = useState([])
    const [version, setVersion] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        if(!sessionStorage.getItem(global.config.tokens.authToken)) 
            navigate( global.config.routes.login)
        else
            getSpells()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        document.title = props.title
    }, [props.title])


    const changeVersion = () => {
        // Re-render list after data is changed but array references are the same
        // Re-render with updated values
        let change = version + 1

        setVersion(change)
    }

    const getSpells = () => {
        const promise = new Promise((resolve) => {
                setSending(true)

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
                    if (spells.length > 0) {
                        setSpells(sortArray(spellListJSON.spells))
                        changeVersion()
                    } else 
                        setSpells(sortArray(spellListJSON.spells))

                    resolve()
                })).catch((error) => {
                    toast.error(`Could't fetch the spells, please report this error: ${error}`)
                }).finally(() => {
                    setSending(false)
                })
            }
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
                let filteredArray = spells.filter((element) => { return element.id !== actionJSON.id })

                setSpells(sortArray([...spells.splice(0, 0), ...filteredArray]))

                setTimeout(() => resolve(actionJSON), 100)
                changeVersion()
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
                    let filteredArray = spells.filter((element) => { return element.id !== actionJSON.id && element.version !== actionJSON.version })

                    filteredArray.push(detailsJSON)
                    filteredArray = sortArray(filteredArray)

                    setSpells(filteredArray)

                    setTimeout(() => resolve(actionJSON), 100)
                    changeVersion()
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
                <div className="magic-list">
                    <div >
                        <h2 className="magic-list-title">Spell List:</h2>

                        <div className="magic-list-mode">
                            <p className="magic-list-mode-title">Mode:</p>

                            <div>
                                <label className="checkmark-container">
                                    <span className="checkmark-label">Read Only</span>
                                    <input type="checkbox"
                                        id="read-only"
                                        name="mode"
                                        value="read-only"
                                        checked={ !deleting && !editing}
                                        disabled={ sending }
                                        onChange={(e) => setMode(e.target.value)} />
                                    <span className="checkmark"></span>
                                </label>

                                <label className="checkmark-container">
                                    <span className="checkmark-label">Edit</span>
                                    <input type="checkbox"
                                        id="edit-mode"
                                        name="mode"
                                        value="edit-mode"
                                        checked={ editing }
                                        disabled={ sending }
                                        onChange={(e) => setMode(e.target.value)} />
                                    <span className="checkmark"></span>
                                </label>

                                <label className="checkmark-container">
                                    <span className="checkmark-label">Delete</span>
                                    <input type="checkbox"
                                        id="delete-mode"
                                        name="mode"
                                        value="delete-mode"
                                        checked={ deleting }
                                        disabled={ sending }
                                        onChange={(e) => setMode(e.target.value)} />
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <ul className={`magic-list-itemlist ${sending ? 'sending' : ''}`}>
                        { spells.map((spell, key) => (
                            <li key={`list-${key}-v${version}`}>
                                <form className="magic-list-form"
                                    onSubmit={(e) => handleSubmitAction(e)} >

                                    <ListHidden name={'id'}
                                                value={spell.id}/>

                                    <ListInput id={key}
                                                name={'name'}
                                                value={spell.name}
                                                disabled={sending || !editing} />
                                    <ListInput id={key}
                                                name={'type'}
                                                value={spell.type}
                                                disabled={sending || !editing} />

                                    <ListHidden name={'version'}
                                                value={spell.version}/>

                                    <FormattedDate cssClass={'magic-list-form-date'}
                                                date={spell.createdAt} />

                                    { (deleting || editing) &&
                                        <button className="generic-button"
                                            type="submit"
                                            disabled={sending}>
                                            {deleting && 'Delete Item'}
                                            {editing && 'Send Edit'}
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