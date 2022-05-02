const LoginButton = ({label, handleAction}) => {
    return (
        <button className="generic-button" onClick={handleAction}>{ label }</button>
    );
}

export default LoginButton