import styles from "./LittleOptions.module.css";

const LittleOptions = ({
    title,
    onClick


}) => {
    return(
        <>
            <button onClick={onClick}>
                {title}
            </button>
        </>
    )
}

export default LittleOptions;