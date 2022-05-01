const FormattedDate = ({date}) => {
    const convertDate = () => {
        const dateOptions = { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' };
        const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);

        return dateFormatter.format(new Date(date));
    }

    return (
        <span >{ convertDate() }</span>
    );
}

export default FormattedDate