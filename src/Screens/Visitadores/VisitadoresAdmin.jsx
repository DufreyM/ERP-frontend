import React, { useState, useEffect } from 'react';
import SimpleTitle from '../../components/Titles/SimpleTitle.jsx';
import IconoInput from '../../components/Inputs/InputIcono.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPen, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const VisitadoresAdmin = () => {
  const [nombre, setNombre] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const mapVisitadorToView = (v) => {
    const nombreCompleto = `${v?.usuario?.nombre ?? ''} ${v?.usuario?.apellidos ?? ''}`.trim();
    const correo = v?.usuario?.correo ?? v?.usuario?.email ?? '-';
    const telefono = v?.usuario?.telefono ?? v?.usuario?.telefono_movil ?? '-';
    const proveedorNombre = v?.proveedor?.nombre ?? v?.proveedor?.razon_social ?? v?.proveedor?.name ?? (v?.proveedor_id ? `ID ${v.proveedor_id}` : '-');
    const documentos = v?.documentos ?? v?.documento?.url ?? v?.usuario?.documento ?? '';
    const estatus = v?.usuario?.status === 'activo' ? 'Activo' : 'Inactivo';
    return {
      id: v?.id,
      nombre: nombreCompleto || '- ',
      correo,
      telefono,
      proveedor: proveedorNombre,
      documentos,
      estatus,
      raw: v,
    };
  };

  const fetchVisitadores = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/visitadores`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list = Array.isArray(json) ? json.map(mapVisitadorToView) : [];
      setData(list);
      setFiltered(list);
    } catch (e) {
      setError('Error al cargar visitadores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitadores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuscar = () => {
    const termNombre = nombre.trim().toLowerCase();
    const termProv = proveedor.trim().toLowerCase();
    setFiltered(
      data.filter((item) => {
        const matchNombre = termNombre === '' || item.nombre.toLowerCase().includes(termNombre);
        const matchProveedor = termProv === '' || item.proveedor.toLowerCase().includes(termProv);
        return matchNombre && matchProveedor;
      })
    );
  };

  const toggleEstatus = async (index) => {
    const current = filtered[index];
    if (!current?.id) return;
    const activar = current.estatus !== 'Activo';
    try {
      const url = `${API_BASE_URL}/visitadores/${current.id}/${activar ? 'activate' : 'deactivate'}`;
      const res = await fetch(url, { method: 'PATCH' });
      if (!res.ok) throw new Error('No se pudo cambiar el estado');
      // actualizar en memoria
      const nextFiltered = filtered.map((it, i) =>
        i === index ? { ...it, estatus: activar ? 'Activo' : 'Inactivo' } : it
      );
      setFiltered(nextFiltered);
      const nextData = data.map((it) =>
        it.id === current.id ? { ...it, estatus: activar ? 'Activo' : 'Inactivo' } : it
      );
      setData(nextData);
    } catch (e) {
      alert('Error al actualizar estado');
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const confirm = window.confirm('¿Eliminar este visitador?');
    if (!confirm) return;
    try {
      const res = await fetch(`${API_BASE_URL}/visitadores/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar');
      const nextData = data.filter((d) => d.id !== id);
      setData(nextData);
      // Reaplicar filtros con términos actuales
      const termNombre = nombre.trim().toLowerCase();
      const termProv = proveedor.trim().toLowerCase();
      setFiltered(
        nextData.filter((item) => {
          const matchNombre = termNombre === '' || item.nombre.toLowerCase().includes(termNombre);
          const matchProveedor = termProv === '' || item.proveedor.toLowerCase().includes(termProv);
          return matchNombre && matchProveedor;
        })
      );
    } catch (e) {
      alert('Error al eliminar visitador');
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

      {loading && <div style={{ color: '#5a60a5', fontWeight: 600, marginBottom: 12 }}>Cargando visitadores...</div>}
      {error && <div style={{ color: '#e74c3c', fontWeight: 600, marginBottom: 12 }}>{error}</div>}

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
              <tr key={item.id ?? item.nombre} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '10px 8px' }}>{item.nombre}</td>
                <td style={{ padding: '10px 8px' }}>{item.correo}</td>
                <td style={{ padding: '10px 8px' }}>{item.telefono}</td>
                <td style={{ padding: '10px 8px' }}>{item.proveedor}</td>
                <td style={{ padding: '10px 8px' }}>
                  {item.documentos ? (
                    <a href={item.documentos} target="_blank" rel="noopener noreferrer" style={{ color: '#5a60a5', textDecoration: 'none' }}>
                      <FontAwesomeIcon icon={faFilePdf} /> PDF
                    </a>
                  ) : (
                    <span style={{ color: '#888' }}>-</span>
                  )}
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
                  <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c' }} title="Eliminar">
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