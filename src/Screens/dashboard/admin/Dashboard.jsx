import { useOutletContext } from 'react-router-dom';

const Dashboard = () => {
    const { selectedLocal } = useOutletContext();

    const dataLocales = [
        {
            nombre: 'Local 1',
            notificaciones: ['Notif 1', 'Notif 2'],
            tareas: ['Tarea A', 'Tarea B']
        },
        {
            nombre: 'Local 2',
            notificaciones: ['Notif 3', 'Notif 4'],
            tareas: ['Tarea C', 'Tarea D']
        }
    ];

    const localActual = dataLocales[selectedLocal];

    return (
        <div>
            <h2>{localActual.nombre}</h2>
            <p>Notificaciones: {localActual.notificaciones.join(', ')}</p>
            <p>Tareas: {localActual.tareas.join(', ')}</p>
        </div>
    );
};

export default Dashboard;