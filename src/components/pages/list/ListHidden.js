const ListHidden = ({name, value}) => {
    return (
        <input name={name}
        type="hidden"
        defaultValue={value}/>
    );
}

export default ListHidden