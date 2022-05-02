const ListInput = ({id, name, disabled, value}) => {
    const formattedName = `${name.charAt(0).toUpperCase() + name.slice(1)}:`

    return (
       <>
        <label className="magic-list-form-label"
                htmlFor={`${name}-${id}`}>
            {formattedName}
        </label>

        <input className="magic-list-form-field"
                id={`${name}-${id}`}
                name={name}
                type="text"
                defaultValue={value}
                disabled={disabled}
                required/>
       </>
    );
}

export default ListInput