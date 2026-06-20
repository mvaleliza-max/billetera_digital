$(document).ready(function() {
    // === REQUERIMIENTO 1: Obtener y mostrar el saldo actual desde Local Storage al cargar ===
    let saldoActual = localStorage.getItem('saldoBilletera');
    
    if (saldoActual === null) {
        saldoActual = 10500; // Saldo por defecto si está limpio
        localStorage.setItem('saldoBilletera', "10500");
    } else {
        saldoActual = parseFloat(saldoActual);
    }

    // Formatear y pintar el saldo actual en el contenedor con jQuery
    $('#saldoActualDisplay').text(`$${saldoActual.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

    // === Escuchar el evento de envío (submit) del formulario con jQuery ===
    $('#depositForm').on('submit', function(event) {
        event.preventDefault(); // Detener envío por defecto

        const montoIngresado = parseFloat($('#amountInput').val());

        // Validación de seguridad para el monto
        if (isNaN(montoIngresado) || montoIngresado <= 0) {
            return;
        }

        // Calcular y guardar el nuevo saldo en localStorage
        const nuevoSaldo = saldoActual + montoIngresado;
        localStorage.setItem('saldoBilletera', nuevoSaldo.toString());


        // === ACTUALIZACIÓN INTEGRADA DEL HISTORIAL DE MOVIMIENTOS ===
        // Obtener el historial actual o inicializarlo con la base por defecto si está vacío
        let historial = localStorage.getItem('historialBilletera');
        if (historial === null) {
            const listaFicticia = [
                { tipo: 'deposito', detalle: 'Depósito desde Banco Galicia', fecha: '15 Jun, 14:20', monto: 5000.00 },
                { tipo: 'envio', detalle: 'Envío a Juan Pérez', fecha: '14 Jun, 09:15', monto: 1200.00 },
                { tipo: 'compra', detalle: 'Pago en Supermercado Coto', fecha: '12 Jun, 21:40', monto: 3450.50 },
                { tipo: 'deposito', detalle: 'Acreditación de Haberes', fecha: '01 Jun, 08:00', monto: 25000.00 },
                { tipo: 'compra', detalle: 'Suscripción Netflix', fecha: '28 May, 23:11', monto: 890.00 }
            ];
            historial = listaFicticia;
        } else {
            historial = JSON.parse(historial);
        }

        // Generar la fecha y hora actual con un formato limpio (Ej: "20 Jun, 09:42")
        const opcionesFecha = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' };
        const fechaActual = new Date().toLocaleString('es-ES', opcionesFecha).replace('.', '');

        // Construir el objeto de la nueva transacción de depósito
        const nuevoDeposito = {
            tipo: 'deposito',
            detalle: 'Depósito realizado (Efectivo/Transferencia)',
            fecha: fechaActual,
            monto: montoIngresado
        };

        // Agregar el depósito al principio del arreglo usando unshift
        historial.unshift(nuevoDeposito);

        // Guardar el historial actualizado en LocalStorage
        localStorage.setItem('historialBilletera', JSON.stringify(historial));


        // Formatear monto ingresado para los mensajes visuales
        const montoFormateado = `$${montoIngresado.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;

        // === REQUERIMIENTO 3: Crear e Inyectar dinámicamente la alerta de éxito de Bootstrap ===
        $('#alert-container').html(`
            <div class="alert alert-success border-0 text-center py-2 mb-3 fade show" 
                 style="background-color: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 500;" role="alert">
                <strong>¡Depósito Exitoso!</strong> El dinero ha sido acreditado en tu cuenta.
            </div>
        `);

        // === REQUERIMIENTO 2: Agregar leyenda del monto depositado debajo del formulario ===
        // Remueve leyendas previas si existieran para no duplicar y la añade al final de la tarjeta
        $('.monto-leyenda').remove();
        $('.deposit-container').append(`
            <div class="monto-leyenda text-center mt-3 p-2 rounded animate-fade-in" 
                 style="background-color: rgba(56, 189, 248, 0.1); color: #38bdf8; font-size: 0.95rem; border: 1px dashed rgba(56, 189, 248, 0.3);">
                Confirmación: Has depositado un total de <strong>${montoFormateado}</strong>
            </div>
        `);

        // Deshabilitar controles para evitar procesar dos veces el mismo depósito
        $('#btnRealizarDeposito').prop('disabled', true);
        $('#amountInput').prop('disabled', true);

        // === REQUERIMIENTO 4: Redirigir al menú después de un retraso de 2 segundos (2000ms) ===
        setTimeout(function() {
            window.location.assign("menu.html");
        }, 2000);
    });
});