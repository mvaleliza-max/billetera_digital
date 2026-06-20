$(document).ready(function() {

    // === 0. AGENDA PERSISTENTE: Cargar contactos desde LocalStorage ===
    const contactosPorDefecto = [
        { id: "1", nombre: "Juan Pérez", alias: "jperez", search: "juan perez jperez" },
        { id: "2", nombre: "María Gómez", alias: "mariago", search: "maria gomez mariago" },
        { id: "3", nombre: "Lucas Díaz", alias: "lucas.d", search: "lucas diaz lucas.d" }
    ];

    function cargarAgenda() {
        let agenda = localStorage.getItem('agendaContactos');
        if (agenda === null) {
            localStorage.setItem('agendaContactos', JSON.stringify(contactosPorDefecto));
            return contactosPorDefecto;
        }
        return JSON.parse(agenda);
    }

    function pintarContactos() {
        const agenda = cargarAgenda();
        // Limpiamos el selector dejando únicamente la opción por defecto
        $('#contactSelect').html('<option value="" selected disabled>-- Elige un contacto de tu agenda --</option>');
        
        // Inyectamos dinámicamente cada contacto guardado
        agenda.forEach(function(contacto) {
            $('#contactSelect').append(`
                <option value="${contacto.id}" data-search="${contacto.search}">${contacto.nombre} (Alias: ${contacto.alias})</option>
            `);
        });
    }

    // Ejecutar la carga inicial de contactos al abrir la pantalla
    pintarContactos();


    // === 1. MOSTRAR Y OCULTAR FORMULARIO DE NUEVO CONTACTO ===
    $('#btnMostrarAgregar').on('click', function() {
        $('#nuevoContactoForm').slideDown(); // Despliega el formulario con animación
        $(this).hide(); // Oculta el botón principal para limpiar espacio
    });

    $('#btnCancelarContacto').on('click', function() {
        $('#nuevoContactoForm').slideUp(); // Guarda el formulario
        $('#btnMostrarAgregar').show(); // Reaparece el botón
        // Limpiar campos del formulario cancelado
        $('#newName, #newAlias, #newCbu').val('');
        $('#alertContacto').empty();
    });


    // === 2. VALIDAR E INCORPORAR EL NUEVO CONTACTO (PERSISTENTE) ===
    $('#btnGuardarContacto').on('click', function() {
        const nombre = $('#newName').val().trim();
        const alias = $('#newAlias').val().trim();
        const cbu = $('#newCbu').val().trim();
        const $alertBox = $('#alertContacto');

        // Validar campos vacíos
        if (nombre === "" || alias === "" || cbu === "") {
            $alertBox.html(`
                <div class="alert alert-danger py-1 text-center" style="font-size:0.85rem;">
                    Todos los campos son obligatorios.
                </div>
            `);
            return;
        }

        // Validar formato del número de cuenta (Debe contener solo números)
        const cuentaRegex = /^\d+$/;
        if (!cuentaRegex.test(cbu)) {
            $alertBox.html(`
                <div class="alert alert-danger py-1 text-center" style="font-size:0.85rem;">
                    El número de cuenta debe contener solo caracteres numéricos.
                </div>
            `);
            return;
        }

        // --- LÓGICA DE GUARDADO REAL EN LOCALSTORAGE ---
        const agendaActual = cargarAgenda();
        const nuevoContacto = {
            id: Date.now().toString(),
            nombre: nombre,
            alias: alias,
            search: `${nombre.toLowerCase()} ${alias.toLowerCase()}`
        };

        // Guardar en el arreglo y subirlo a la memoria del navegador
        agendaActual.push(nuevoContacto);
        localStorage.setItem('agendaContactos', JSON.stringify(agendaActual));

        // Volver a renderizar la lista completa de contactos actualizada
        pintarContactos();

        // Notificar éxito, limpiar campos y cerrar formulario
        alert("Contacto agregado a la agenda con éxito.");
        $('#btnCancelarContacto').click();
    });


    // === 3. REALIZAR BÚSQUEDA EN LA AGENDA DE TRANSFERENCIAS ===
    $('#searchContact').on('input', function() {
        const term = $(this).val().toLowerCase().trim();
        
        // Filtrar cada opción del select basándose en el atributo data-search
        $('#contactSelect option').each(function() {
            const searchString = $(this).data('search');
            
            // Omitir la opción por defecto deshabilitada
            if (!searchString) return;

            if (searchString.includes(term)) {
                $(this).show().prop('disabled', false);
            } else {
                $(this).hide().prop('disabled', true);
            }
        });
        
        // Resetear la selección si el elemento seleccionado actualmente quedó oculto
        if ($('#contactSelect option:selected').is(':hidden')) {
            $('#contactSelect').val('');
            $('#btnEnviarDinero').fadeOut(); // Asegura ocultar el botón si pierde el contacto
        }
    });


    // === 4. MOSTRAR Y OCULTAR EL BOTÓN "ENVIAR DINERO" ===
    $('#contactSelect').on('change', function() {
        const seleccionado = $(this).val();

        if (seleccionado) {
            // Si hay un contacto seleccionado, muestra el botón y cambia el diseño visual del select
            $(this).css('border-color', '#10b981'); 
            $('#btnEnviarDinero').fadeIn(); 
        } else {
            $(this).css('border-color', '#475569');
            $('#btnEnviarDinero').fadeOut();
        }
    });


    // === 5. MOSTRAR MENSAJE DE CONFIRMACIÓN DESPUÉS DE ENVIAR DINERO ===
    $('#mainSendForm').on('submit', function(event) {
        event.preventDefault(); // Cancelar recarga

        const monto = parseFloat($('#amountInput').val());
        const contactoTexto = $('#contactSelect option:selected').text();

        // Simulación lógica de actualización de fondos
        let saldoActual = parseFloat(localStorage.getItem('saldoBilletera') || "10500");

        if (monto > saldoActual) {
            $('#alertContainerGlobal').html(`
                <div class="alert alert-danger text-center border-0" style="background-color: rgba(239, 68, 68, 0.15); color: #f87171;">
                    <strong>Fondos insuficientes.</strong> Tu saldo es de $${saldoActual.toLocaleString('es-ES')}.\n                </div>
            `);
            return;
        }

        // Guardar nuevo saldo
        localStorage.setItem('saldoBilletera', (saldoActual - monto).toString());

        // --- NUEVO CÓDIGO: GUARDAR EN EL HISTORIAL ---
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

        const opcionesFecha = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' };
        const fechaActual = new Date().toLocaleString('es-ES', opcionesFecha).replace('.', '');

        const nuevaTransaccion = {
            tipo: 'envio',
            detalle: `Envío a ${contactoTexto.split(' (Alias:')[0]}`,
            fecha: fechaActual,
            monto: monto
        };

        historial.unshift(nuevaTransaccion);
        localStorage.setItem('historialBilletera', JSON.stringify(historial));

        // Inyectar el mensaje de confirmación exitosa de Bootstrap
        $('#alertContainerGlobal').html(`
            <div class="alert alert-success border-0 text-center py-3 mb-4" 
                 style="background-color: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 500;" role="alert">
                <strong>¡Envío Realizado con Éxito!</strong><br>
                Has enviado $${monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })} a <strong>${contactoTexto}</strong>.
            </div>
        `);

        $('#btnEnviarDinero, #contactSelect, #amountInput, #searchContact').prop('disabled', true);

        setTimeout(function() {
            window.location.assign('menu.html');
        }, 2500);
    });
});