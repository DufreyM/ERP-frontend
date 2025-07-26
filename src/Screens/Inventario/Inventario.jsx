import { Table } from "../../components/Tables/Table"



export const Inventario = () => {
    const columnas = [
        { key: 'name', titulo: 'Nombre platillo' },
        { key: 'description', titulo: 'Descripción' },
        { key: 'category', titulo: 'Categoría' },
        { key: 'type', titulo: 'Tipo de plato' },
        { key: 'location', titulo: 'Local Disponible' },
        { key: 'preparation_minutes', titulo: 'Tiempo de receta (min)' },
        { key: 'base_price', titulo: 'Precio base' },
        { key: 'current_price', titulo: 'Precio actual' },
        { key: 'showMore', titulo: 'Mostrar más' },
    
    ]

    return (
        <div>
            <Table 
                nameColumns={columnas}
                
            ></Table>
        </div>
    )
}