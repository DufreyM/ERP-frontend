import styles from "./LittleOptions.module.css";

const LittleOptions = ({
    title,
    onClick,
    isActive


}) => {
    return(
        <>
            <button 
            onClick={onClick} 
            className={`${styles.LittleOptionsButtons} ${isActive? styles.LittleOptionsButtonsActive : ""}`}>
                {title}
            </button>
        </>
    )
}

export default LittleOptions;