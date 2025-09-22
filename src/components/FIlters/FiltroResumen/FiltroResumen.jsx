import styles from "./FiltroResumen.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCalendar,faDollarSign,faUser,faBriefcaseMedical,faXmark
} from "@fortawesome/free-solid-svg-icons";

const FiltroResumen = ({
  fechaInicio,
  fechaFin,
  precioMin,
  precioMax,
  usuarioSeleccionado,
  rolSeleccionado,
  medicamentoSeleccionado,
  // Callbacks para eliminar filtros individualmente
  onRemoveFecha,
  onRemovePrecio,
  onRemoveUsuario,
  onRemoveRol,
  onRemoveMedicamento,

  expandFecha,
  expandPrecio,
  expandRol,
  expandMedicamento
}) => {
  const pills = [];
  

  if (fechaInicio || fechaFin) {
    const fechaTexto = `${fechaInicio?.toLocaleDateString() || "?"} - ${fechaFin?.toLocaleDateString() || "?"}`;
    pills.push({
      icon: faCalendar,
      title: "FECHA: ",
      label: fechaTexto,
      onClick: expandFecha,
      onRemove: onRemoveFecha
    });
  }

  if (precioMin || precioMax) {
    const precioTexto = `$${precioMin || "?"} - $${precioMax || "?"}`;
    pills.push({
      icon: faDollarSign,
      title: "RANGO DE PRECIO: ",
      label: precioTexto,
      onClick: expandPrecio,
      onRemove: onRemovePrecio
    });
  }

  if (rolSeleccionado) {
    pills.push({
      icon: faUser,
      title: "ROL DE USUARIOS:",
      label: `${rolSeleccionado.label || usuarioSeleccionado}`,
      onClick: expandRol,
      onRemove: onRemoveRol
    });
  }

  if (usuarioSeleccionado) {
    pills.push({
      icon: faUser,
      title: "USUARIOS",
      label: `${usuarioSeleccionado.label || usuarioSeleccionado}`,
      onClick: expandRol,
      onRemove: onRemoveUsuario
    });
  }

  // if (medicamentoSeleccionado) {
  //   pills.push({
  //     icon: faBriefcaseMedical,
  //     title: "TIPO DE MEDICAMENTO",
  //     label: medicamentoSeleccionado,
  //     onClick: expandMedicamento,
  //     onRemove: onRemoveMedicamento
  //   });
  // }
  if (Array.isArray(medicamentoSeleccionado) && medicamentoSeleccionado.length > 0) {
  medicamentoSeleccionado.forEach((tipo, index) => {
    pills.push({
      icon: faBriefcaseMedical,
      title: index === 0 ? "TIPO DE MEDICAMENTO" : "", // Solo el primero tiene título
      label: tipo.label,
      onClick: expandMedicamento,
      onRemove: () => onRemoveMedicamento(tipo) // Necesitarás ajustar esta función
    });
  });
}


  if (pills.length === 0) return null;

  return (
    <div className={styles.pillContainer}>
      {pills.map((pill, index) => (
        <button key={index} className={styles.pill} onClick={pill.onClick}>
          <FontAwesomeIcon icon={pill.icon} className={styles.icon} />
          <p className={styles.titleoptionfill}><strong>{pill.title}</strong></p>
          
          <span>{pill.label}</span>
          {pill.onRemove && (
            <FontAwesomeIcon
              icon={faXmark}
              className={styles.removeIcon}
              onClick={pill.onRemove}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default FiltroResumen;
