import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowDownShortWide, faCalendarDays, faArrowTrendDown, faArrowTrendUp, faArrowDownAZ, faArrowDownZA, faArrowDown19, faArrowDown91} from '@fortawesome/free-solid-svg-icons';
import ButtonDisplay from "../ButtonDisplay/ButtonDisplay"
import Options from "./Options/Options";



const OrderBy = ({
    FAbecedario = true,
    FExistencias = true,
    FPrecio = true,
    FFecha = true,

}) => {
    return (
        <>
            <ButtonDisplay
                icon={faArrowDownShortWide}
                title={"Ordenar"}
            >
                {FAbecedario ? (
                    <div>
                        <Options
                            icon={faArrowDownAZ}
                            text={"Alfabeticamente ascente (A - Z)"}
                        />

                        <Options
                            icon={faArrowDownZA}
                            text={"Alfabeticamente descendente (Z - A)"}
                        />
                    </div>
                ) : <div/>}

                {FExistencias ? (
                    <div>
                        <Options
                            icon={faArrowDown91}
                            text={"Mayor cantidad de existencias"}
                        />

                        <Options
                            icon={faArrowDown19}
                            text={"Menor cantidad de existencias"}
                        />

                    </div>
                ) : <div/>}

                {FPrecio ? (
                    <div>
                        <Options
                            icon={faArrowTrendUp}
                            text={"Precio más alto"}
                        />

                        <Options
                            icon={faArrowTrendDown}
                            text={"Precio más bajo"}
                        />

                    </div>
                ) : <div/>}

                {FFecha ? (
                    <div>
                       <Options
                            icon={faCalendarDays}
                            text={"Realizado recientemente"}
                        />

                        <Options
                            icon={faCalendarDays}
                            text={"Realizado más antiguo"}
                        />

                    </div>
                ) : <div/>}

                
              
                

                
                


            </ButtonDisplay>
        
        </>
    )
}

export default OrderBy;