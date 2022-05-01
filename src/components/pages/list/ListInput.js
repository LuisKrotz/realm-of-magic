const ListInput = ({id, name, disabled, value}) => {
    const formattedName = `${name.charAt(0).toUpperCase() + name.slice(1)}:`

    return (
       <>
        <label htmlFor={`${name}-${id}`}>{formattedName}</label>
        <input id={`${name}-${id}`}
                name={name}
                type="text"
                defaultValue={value}
                disabled={disabled}
                required/>
       </>
    );
}

export default ListInput