import React, { useState, useEffect } from 'react';
import SimpleTitle from '../../components/Titles/SimpleTitle.jsx';
import IconoInput from '../../components/Inputs/InputIcono.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPen, faTrash, faFilePdf, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const VisitadoresAdmin = () => {
  const [nombre, setNombre] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para edición inline
  const [editingField, setEditingField] = useState(null); // { rowId, fieldName }
  const [editingValue, setEditingValue] = useState('');
  const [saving, setSaving] = useState(false);

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

  // Filtrado reactivo en tiempo real al escribir y cuando cambian los datos
  useEffect(() => {
    const termNombre = nombre.trim().toLowerCase();
    const termProv = proveedor.trim().toLowerCase();
    const next = data.filter((item) => {
      const matchNombre = termNombre === '' || item.nombre.toLowerCase().includes(termNombre);
      const matchProveedor = termProv === '' || item.proveedor.toLowerCase().includes(termProv);
      return matchNombre && matchProveedor;
    });
    setFiltered(next);
  }, [nombre, proveedor, data]);

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
      // El useEffect de filtrado se encargará de actualizar "filtered"
    } catch (e) {
      alert('Error al eliminar visitador');
    }
  };

  // Funciones para edición inline
  const startEditing = (rowId, fieldName, currentValue) => {
    setEditingField({ rowId, fieldName });
    setEditingValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const saveField = async () => {
    if (!editingField || saving) return;
    
    setSaving(true);
    try {
      const { rowId, fieldName } = editingField;
      const visitador = data.find(d => d.id === rowId);
      if (!visitador) throw new Error('Visitador no encontrado');

      // Preparar datos para actualizar según el campo
      // El backend del visitador médico no maneja actualizaciones anidadas del usuario
      // Necesitamos actualizar el usuario directamente
      let updateData = {};
      if (fieldName === 'nombre') {
        // Separar nombre y apellidos
        const parts = editingValue.trim().split(' ');
        const nombre = parts[0] || '';
        const apellidos = parts.slice(1).join(' ') || '';
        updateData = {
          nombre,
          apellidos
        };
      } else if (fieldName === 'correo') {
        updateData = {
          correo: editingValue
        };
      } else if (fieldName === 'telefono') {
        updateData = {
          telefono: editingValue
        };
      }

      // Si no hay datos para actualizar, no proceder
      if (Object.keys(updateData).length === 0) {
        throw new Error('No hay datos para actualizar');
      }

      // Obtener el ID del usuario del visitador
      const usuarioId = visitador.raw?.usuario_id || visitador.raw?.usuario?.id;
      if (!usuarioId) {
        throw new Error('No se encontró el ID del usuario');
      }
      
      console.log('Enviando datos de actualización:', {
        rowId,
        fieldName,
        updateData,
        usuarioId,
        url: `${API_BASE_URL}/api/usuarios/${usuarioId}`
      });

      // Obtener token de autenticación
      const token = localStorage.getItem('token');
      
      // Actualizar directamente el usuario usando el endpoint de usuarios
      const res = await fetch(`${API_BASE_URL}/api/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData)
      });

      const responseData = await res.json().catch(() => ({}));
      console.log('Respuesta del servidor:', { status: res.status, data: responseData });

      if (!res.ok) {
        console.error('Error response:', responseData);
        throw new Error(`Error al actualizar: ${res.status} - ${responseData.error || responseData.message || 'Error desconocido'}`);
      }

      // Actualizar datos locales
      const updatedData = data.map(item => {
        if (item.id === rowId) {
          const updated = { ...item };
          if (fieldName === 'nombre') {
            updated.nombre = editingValue;
          } else if (fieldName === 'correo') {
            updated.correo = editingValue;
          } else if (fieldName === 'telefono') {
            updated.telefono = editingValue;
          }
          return updated;
        }
        return item;
      });

      setData(updatedData);
      setEditingField(null);
      setEditingValue('');
    } catch (e) {
      alert('Error al guardar cambios: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveField();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // Componente para campos editables
  const EditableField = ({ rowId, fieldName, value, onEdit }) => {
    const isEditing = editingField?.rowId === rowId && editingField?.fieldName === fieldName;
    
    if (isEditing) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{
              padding: '4px 8px',
              border: '1px solid #5a60a5',
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '120px'
            }}
            autoFocus
            disabled={saving}
          />
          <button
            onClick={saveField}
            disabled={saving}
            style={{
              background: '#1bbf5c',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              padding: '4px 8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1
            }}
            title="Guardar"
          >
            <FontAwesomeIcon icon={faCheck} size="sm" />
          </button>
          <button
            onClick={cancelEditing}
            disabled={saving}
            style={{
              background: '#e74c3c',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              padding: '4px 8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1
            }}
            title="Cancelar"
          >
            <FontAwesomeIcon icon={faTimes} size="sm" />
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{value}</span>
        <button
          onClick={() => onEdit(rowId, fieldName, value)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#5a60a5',
            padding: '2px'
          }}
          title="Editar"
        >
          <FontAwesomeIcon icon={faPen} size="sm" />
        </button>
      </div>
    );
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
                <td style={{ padding: '10px 8px' }}>
                  <EditableField
                    rowId={item.id}
                    fieldName="nombre"
                    value={item.nombre}
                    onEdit={startEditing}
                  />
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <EditableField
                    rowId={item.id}
                    fieldName="correo"
                    value={item.correo}
                    onEdit={startEditing}
                  />
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <EditableField
                    rowId={item.id}
                    fieldName="telefono"
                    value={item.telefono}
                    onEdit={startEditing}
                  />
                </td>
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