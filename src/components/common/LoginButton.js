const LoginButton = ({label, handleAction}) => {
    return (
        <button className="login-button" onClick={handleAction}>{ label }</button>
    );
}

export default LoginButton