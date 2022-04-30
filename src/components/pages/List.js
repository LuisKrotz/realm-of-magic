import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const List= () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate(!sessionStorage.getItem(global.config.tokens.authToken) ?? global.config.routes.login)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const getSpells = () => {
        fetch(global.config.api.path + global.config.api.spells, {
            crossDomain:true,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        .then((response) => {
            console.log(response);

            return response.json();
        })
        .then((data) => {
            console.log('DATA', data);
        })
        .catch((error)=> console.log(error))
    }


    const postSpell = () => {
        fetch(global.config.api.path + global.config.api.spells, {
            method: 'POST',
            mode: 'cors',
            crossDomain:true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Test 2",
                type: "test 2"
            })
          }).then((response) => {
            console.log(response)
            return response.json()
          }).then((data) =>  {
            console.log('DATA', data);
          }).catch((error)=> console.log(error))
    }

    const updateSpell = () => {
        fetch(`${global.config.api.path + global.config.api.spells}`, {
            method: 'PUT',
            mode: 'cors',
            crossDomain:true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: "07a3e8b229be25c38b19168a8e5fe101",
                name: "Test 3",
                type: "test 3",
                version: "1-8ab651cfca0f24fda36d9607d646cb0d"
            })
          }).then((response) => {
            console.log(response)
            return response.json()
          }).then((data) =>  {
            console.log('DATA', data);
          }).catch((error)=> console.log(error))
    }

    const deleteSpell = () => {
        fetch(global.config.api.path + global.config.api.spells, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            mode: 'cors',
            crossDomain:true,
            body: JSON.stringify({
                id: "29598ea47a6fc727940ef0cae247b8c6"
            })
          }).then((response) => {
            console.log(response)
            return response.json()
          }).then((data) =>  {
            console.log('DATA', data);
          }).catch((error)=> console.log(error))
    }

    const findByID = () => {
        fetch(`${global.config.api.path + global.config.api.findByID}`, {
            method: 'POST',
            crossDomain:true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: "07a3e8b229be25c38b19168a8e5fe101"
            })
          }).then((response) => {
            console.log(response)
            return response.json()
          }).then((data) =>  {
            console.log('DATA', data);
          }).catch((error)=> console.log(error))
    }

    return (
        <>
            TODO:
            <br/><br/><br/>
            <button onClick={getSpells}>TEST GET</button><br/><br/>
            <button onClick={postSpell}>TEST POST</button><br/><br/>
            <button onClick={updateSpell}>TEST UPDATE</button><br/><br/>
            <button onClick={deleteSpell}>TEST DELETE</button><br/><br/>
            <button onClick={findByID}>TEST ID</button><br/><br/>
            <br/><br/>
            <ul>
                <li>Get Api Request</li>
                <li>List Magics</li>
                <li>Edit Magics</li>
                <li>Delete Magics</li>
                <li>Create Route to add magic</li>
                <li>Create a logout function</li>
                <li>Add Styles</li>
            </ul>
        </>
    )
}

export default List