import FormattedDate from "../../common/FormattedDate";

const LatestItem = ({name, value}) => {
    return (
        <span className="magic-create-latest-container-wrapper">
            <span className="magic-create-latest-label">{name} </span>
            { name === 'Date:' ?
             <span className="magic-create-latest-value"><FormattedDate date={value} /></span> :
             <span  className="magic-create-latest-value">{value}</span>
            }
            
        </span>
    );
}

export default LatestItem