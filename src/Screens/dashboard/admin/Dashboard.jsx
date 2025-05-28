import { useState } from 'react';
import TabsLocales from '../../../components/TabsLocales/TabsLocales';
import './Dashboard.css';

const Dashboard = () => {
    const [selectedLocal, setSelectedLocal] = useState(0);

    const locales = ['Local 1', 'Local 2'];

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
            <TabsLocales
                locales={locales}
                selectedLocal={selectedLocal}
                onSelect={setSelectedLocal}
            />
        </div>
    );
};

export default Dashboard;
