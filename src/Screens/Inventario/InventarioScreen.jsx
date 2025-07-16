import React, { useState } from 'react';

const InventarioScreen = () => {
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio] = useState('');
    const [foto, setFoto] = useState(null);
    const [tipo, setTipo] = useState('');
    const [laboratorio, setLaboratorio] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

