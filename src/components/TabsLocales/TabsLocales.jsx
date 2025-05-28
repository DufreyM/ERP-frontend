import './TabsLocales.css';

const TabsLocales = ({ locales, selectedLocal, onSelect }) => {
    return (
        <div className="tabs-container">
            <div className="tabs-locales">
                {locales.map((local, index) => (
                    <div
                        key={index}
                        className={`tab ${selectedLocal === index ? 'active' : ''}`}
                        onClick={() => onSelect(index)}
                    >
                        {local}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabsLocales;
