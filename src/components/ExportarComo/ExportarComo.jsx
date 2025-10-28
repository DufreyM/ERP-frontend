import ButtonDisplay from "../ButtonDisplay/ButtonDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDownload, faFileExcel, faFilePdf} from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import Options from "../OrderBy/Options/Options";



const ExportarComo = ({
    onChangeExcel,
    onChangePDF

}) => {
    const [panelAbierto, setPanelAbierto] = useState(false);


    return(
        <main>
            <ButtonDisplay
                icon = {faDownload}
                title = {"Exportar"}
                abierto = {panelAbierto}
                setAbierto = {setPanelAbierto}
            >
                <Options 
                    icon={faFileExcel}
                    text={"Exportar como documento de Excel"}
                    onChange = {onChangeExcel}
                />
                <Options 
                    icon={faFilePdf}
                    text={"Exportar como documento de PDF"}
                    onChange = {onChangePDF}
                />

                

            </ButtonDisplay>
        </main>

    );
}

export default ExportarComo;