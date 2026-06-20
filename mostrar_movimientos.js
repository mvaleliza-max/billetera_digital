$(document).ready(function() {

    // 1. REEMPLAZAR LISTA DE TRANSACCIONES: Lista ficticia inicial de respaldo
    const listaTransaccionesFicticia = [
        { tipo: 'deposito', detalle: 'Depósito desde Banco Galicia', fecha: '15 Jun, 14:20', monto: 5000.00 },
        { tipo: 'envio', detalle: 'Envío a Juan Pérez', fecha: '14 Jun, 09:15', monto: 1200.00 },
        { tipo: 'compra', detalle: 'Pago en Supermercado Coto', fecha: '12 Jun, 21:40', monto: 3450.50 },
        { tipo: 'deposito', detalle: 'Acreditación de Haberes', fecha: '01 Jun, 08:00', monto: 25000.00 },
        { tipo: 'compra', detalle: 'Suscripción Netflix', fecha: '28 May, 23:11', monto: 890.00 }
    ];

    // 2. OBTENER TU LISTA REAL: Intentamos leer desde el Local Storage
    let listaReal = localStorage.getItem('historialBilletera');
    
    if (listaReal === null) {
        // Si el usuario nunca ha operado, guardamos la lista ficticia como base real inicial
        localStorage.setItem('historialBilletera', JSON.stringify(listaTransaccionesFicticia));
        listaReal = listaTransaccionesFicticia;
    } else {
        listaReal = JSON.parse(listaReal);
    }

    // 3. FUNCIÓN REQUERIDA: Traducir tipos a formato legible
    function getTipoTransaccion(tipo) {
        switch(tipo) {
            case 'deposito':
                return 'Depósito';
            case 'envio':
                return 'Transferencia Enviada';
            case 'compra':
                return 'Compra con Tarjeta';
            default:
                return 'Operación';
        }
    }

    // 4. FUNCIÓN REQUERIDA: Renderizar y filtrar dinámicamente con jQuery
    function mostrarUltimosMovimientos(filtro) {
        const $container = $('#transactionContainer');
        $container.empty(); // Limpiar la lista previa

        // Filtrar el arreglo según la opción del select
        const movimientosFiltrados = listaReal.filter(function(tx) {
            if (filtro === 'todos') return true;
            return tx.tipo === filtro;
        });

        // Validar si el filtro actual no arrojó resultados
        if (movimientosFiltrados.length === 0) {
            $container.html(`
                <div class="text-center text-muted py-4 animate-fade-in" style="font-size: 0.9rem;">
                    No hay registros para este tipo de movimiento.
                </div>
            `);
            return;
        }

        // Construir e inyectar cada elemento utilizando jQuery
        movimientosFiltrados.forEach(function(tx) {
            const esEntrada = (tx.tipo === 'deposito');
            const signo = esEntrada ? '+' : '-';
            const claseMonto = esEntrada ? 'amount-positive' : 'amount-negative';
            const claseBadge = `badge-${tx.tipo}`;
            const tipoLegible = getTipoTransaccion(tx.tipo);

            const montoFormateado = tx.monto.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Estructura adaptada dinámicamente
            $container.append(`
                <div class="transaction-item d-flex align-items-center justify-content-between p-3 mb-2 animate-fade-in">
                    <div>
                        <div class="tx-title">${tx.detalle}</div>
                        <div class="tx-date">${tx.fecha}</div>
                        <span class="tx-badge ${claseBadge}">${tipoLegible}</span>
                    </div>
                    <div class="${claseMonto}">${signo}$${montoFormateado}</div>
                </div>
            `);
        });
    }

    // 5. EVENTO SELECT: Escuchar cambios en el filtro usando jQuery
    $('#filterType').on('change', function() {
        const filtroSeleccionado = $(this).val(); // Obtiene 'deposito', 'envio', 'compra' o 'todos'
        mostrarUltimosMovimientos(filtroSeleccionado);
    });

    // 6. Carga inicial por defecto (Muestra todos al abrir la página)
    mostrarUltimosMovimientos('todos');
});