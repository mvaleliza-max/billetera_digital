$(document).ready(function() {
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();

        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const $alertContainer = $('#alertContainer');

        // Limpiamos cualquier alerta previa antes de validar
        $alertContainer.empty();

        if (email === "" || password === "") {
            // ALERTA DE ERROR (Campos vacíos)
            $alertContainer.html(`
                <div class="alert alert-danger alert-dismissible fade show border-0 text-center" role="alert"
                     style="background-color: rgba(239, 68, 68, 0.15); color: #f87171; font-weight: 500;">
                    <strong>¡Error!</strong> Por favor, completa todos los campos.
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
        } else {
            // ALERTA DE ÉXITO (Simulación de entrada correcta)
            $alertContainer.html(`
                <div class="alert alert-success alert-dismissible fade show border-0 text-center" role="alert"
                     style="background-color: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 500;">
                    <strong>¡Éxito!</strong> Autenticación completada. Redirigiendo...
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);

            // Deshabilitar botón para evitar doble clic
            $(this).find('button[type="submit"]').prop('disabled', true);

            // Redirección fluida después de 1.2 segundos
            setTimeout(function() {
                window.location.href = 'menu.html';
            }, 1200);
        }
    });
});