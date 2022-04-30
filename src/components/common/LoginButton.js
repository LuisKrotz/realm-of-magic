const LoginButton = ({label, handleAction}) => {
    return (
        <button onClick={handleAction}>{ label }</button>
    );
}

export default LoginButton