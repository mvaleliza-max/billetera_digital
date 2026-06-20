// Función global para registrar un nuevo movimiento en el historial
function registrarTransaccion(tipo, detalle, monto) {
    // 1. Obtener el historial existente o crear uno vacío si es la primera vez
    let historial = localStorage.getItem('historialBilletera');
    if (historial === null) {
        historial = [];
    } else {
        historial = JSON.parse(historial);
    }

    // 2. Obtener la fecha y hora actual formateada de forma limpia
    const ahora = new Date();
    const opcionesFecha = { day: '2-digit', month: 'short' };
    const opcionesHora = { hour: '2-digit', minute: '2-digit' };
    const fechaTexto = `${ahora.toLocaleDateString('es-ES', opcionesFecha)}, ${ahora.toLocaleTimeString('es-ES', opcionesHora)}`;

    // 3. Crear el objeto de la nueva transacción
    const nuevaTransaccion = {
        tipo: tipo,       // 'deposito' o 'envio'
        detalle: detalle, // Ej: "Depósito desde Banco" o "Envío a Juan Pérez"
        fecha: fechaTexto,
        monto: parseFloat(monto)
    };

    // 4. Agregar la transacción al principio del arreglo (para que se muestre primero la más reciente)
    historial.unshift(nuevaTransaccion);

    // 5. Guardar de vuelta en el localStorage convertido en texto JSON
    localStorage.setItem('historialBilletera', JSON.stringify(historial));
}