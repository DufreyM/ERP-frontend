import React, { useState } from 'react';
import SimpleTitle from '../../components/Titles/SimpleTitle.jsx';
import IconoInput from '../../components/Inputs/InputIcono.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPen, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const initialData = [
  {
    nombre: 'Dr. Juan Pérez',
    correo: 'juan.perez@email.com',
    telefono: '+52 123 456 7890',
    proveedor: 'Proveedor A',
    documentos: 'https://example.com/doc1.pdf',
    estatus: 'Activo',
  },
  {
    nombre: 'Dra. Ana López',
    correo: 'ana.lopez@email.com',
    telefono: '+52 987 654 3210',
    proveedor: 'Proveedor B',
    documentos: 'https://example.com/doc2.pdf',
    estatus: 'Inactivo',
  },
];

const VisitadoresAdmin = () => {
  const [nombre, setNombre] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [data, setData] = useState(initialData);
  const [filtered, setFiltered] = useState(initialData);

  const handleBuscar = () => {
    setFiltered(
      data.filter((item) => {
        const matchNombre = nombre === '' || item.nombre.toLowerCase().includes(nombre.toLowerCase());
        const matchProveedor = proveedor === '' || item.proveedor.toLowerCase().includes(proveedor.toLowerCase());
        return matchNombre && matchProveedor;
      })
    );
  };

  const toggleEstatus = (index) => {
    const updated = [...filtered];
    updated[index].estatus = updated[index].estatus === 'Activo' ? 'Inactivo' : 'Activo';
    setFiltered([...updated]);
    const originalIdx = data.findIndex(d => d.nombre === updated[index].nombre);
    if (originalIdx !== -1) {
      const newData = [...data];
      newData[originalIdx].estatus = updated[index].estatus;
      setData(newData);
    }
  };

  return (
    <div style={{ padding: '32px 24px 0 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <SimpleTitle text="Visitadores médicos" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '220px' }}>
          <label style={{ color: '#5a60a5', fontWeight: 500, marginBottom: 4 }}>Nombre</label>
          <IconoInput
            icono={faSearch}
            placeholder="Ingrese el nombre del médico"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            type="text"
            name="nombre"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '220px' }}>
          <label style={{ color: '#5a60a5', fontWeight: 500, marginBottom: 4 }}>Proveedor</label>
          <IconoInput
            icono={faSearch}
            placeholder="Ingrese un proveedor"
            value={proveedor}
            onChange={e => setProveedor(e.target.value)}
            type="text"
            name="proveedor"
          />
        </div>
        <button
          onClick={handleBuscar}
          style={{
            background: '#fff',
            color: '#5a60a5',
            border: '2px solid #5a60a5',
            borderRadius: '20px',
            padding: '10px 28px',
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 22,
            height: 40,
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          Buscar
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr style={{ background: '#f2f2f2', color: '#222' }}>
              <th style={{ padding: '12px 8px', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '12px 8px', textAlign: 'left' }}>Correo</th>
              <th style={{ padding: '12px 8px', textAlign: 'left' }}>Teléfono</th>
              <th style={{ padding: '12px 8px', textAlign: 'left' }}>Proveedor</th>
              <th style={{ padding: '12px 8px', textAlign: 'left' }}>Documentos</th>
              <th style={{ padding: '12px 8px', textAlign: 'left' }}>Estatus</th>
              <th style={{ padding: '12px 8px', textAlign: 'left' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={item.nombre} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '10px 8px' }}>{item.nombre}</td>
                <td style={{ padding: '10px 8px' }}>{item.correo}</td>
                <td style={{ padding: '10px 8px' }}>{item.telefono}</td>
                <td style={{ padding: '10px 8px' }}>{item.proveedor}</td>
                <td style={{ padding: '10px 8px' }}>
                  <a href={item.documentos} target="_blank" rel="noopener noreferrer" style={{ color: '#5a60a5', textDecoration: 'none' }}>
                    <FontAwesomeIcon icon={faFilePdf} /> PDF
                  </a>
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <span
                    onClick={() => toggleEstatus(idx)}
                    style={{
                      display: 'inline-block',
                      padding: '4px 16px',
                      borderRadius: '16px',
                      background: item.estatus === 'Activo' ? '#e6f7ec' : '#fdeaea',
                      color: item.estatus === 'Activo' ? '#1bbf5c' : '#e74c3c',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                      border: `1.5px solid ${item.estatus === 'Activo' ? '#1bbf5c' : '#e74c3c'}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    {item.estatus}
                  </span>
                </td>
                <td style={{ padding: '10px 8px', display: 'flex', gap: 12 }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a60a5' }} title="Editar">
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c' }} title="Eliminar">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitadoresAdmin;