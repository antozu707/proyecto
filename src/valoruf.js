import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Card, Button } from "react-bootstrap";

function Prestamo(props) {
  const [cuota, setCuota] = useState(null);
  const [valorUF, setValorUF] = useState(null);
  const [fechaUF, setFechaUF] = useState(null);
  const [botonPresionado, setBotonPresionado] = useState(false);

  useEffect(() => {
    axios.get("https://mindicador.cl/api/uf")
      .then(res => {
        const data = res.data;
        if (data.serie && data.serie.length > 0) {
          setValorUF(data.serie[0].valor);
          setFechaUF(data.serie[0].fecha);
        }
      });
  }, []);

  const calcularCuota = () => {
    const tasaMensual = props.tasa / 100;
    const valorCredito = props.valor * (valorUF || 1);
    const plazo = props.plazo;

    const cuotaCalculada = (valorCredito * tasaMensual) / (1 - Math.pow((1 + tasaMensual), -plazo));
    setCuota(cuotaCalculada.toFixed(2));
    setBotonPresionado(true);
  };

  const formatDate = (fecha) => {
    const date = new Date(fecha);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  // Estilos personalizados
  const cardStyle = {
    width: '100%', // Adaptativo al contenedor
    backgroundColor: '#f8f9fa',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    padding: '15px',
    color: '#333',
    margin: '20px 0'
  };

  const buttonStyle = {
    backgroundColor: '#0056b3',
    borderColor: '#0056b3',
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: '10px'
  };

  return (
    <>
      <Card style={cardStyle}>
        <Card.Body>
          <Card.Title>Datos de la UF</Card.Title>
          {valorUF && <Card.Text><strong>Valor UF:</strong> ${valorUF.toFixed(2)}</Card.Text>}
          {fechaUF && <Card.Text><strong>Fecha UF:</strong> {formatDate(fechaUF)}</Card.Text>}
        </Card.Body>
      </Card>
      <Card style={cardStyle}>
        <Card.Body>
          <Card.Title>Solicitud de Préstamo</Card.Title>
          <Card.Text><strong>ID Solicitud:</strong> {props.idSolicitud}</Card.Text>
          <Card.Text><strong>Beneficiario:</strong> {props.beneficiario}</Card.Text>
          <Card.Text><strong>Valor:</strong> {props.valor}</Card.Text>
          <Card.Text><strong>Fecha:</strong> {props.fecha}</Card.Text>
          <Card.Text><strong>Plazo (meses):</strong> {props.plazo}</Card.Text>
          <Card.Text><strong>Tasa Mensual (%):</strong> {props.tasa}</Card.Text>
          {cuota && <Card.Text><strong>Cuota (en moneda local):</strong> ${cuota}</Card.Text>}
          <Button style={buttonStyle} onClick={calcularCuota} disabled={botonPresionado}>
            {botonPresionado ? "Cuota Calculada" : "Calcular Cuota"}
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default Prestamo;
