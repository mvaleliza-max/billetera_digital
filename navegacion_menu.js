$(document).ready(function() {
    $('.btn-menu').on('click', function(event) {
        event.preventDefault();

        // Guardar la URL exacta del atributo href
        const destinoUrl = $(this).attr('href');
        const nombrePantalla = $(this).text().trim(); 

        if (!destinoUrl || destinoUrl === '#') return;

        // Inyectar la alerta de Bootstrap
        $('#menuAlertContainer').html(`
            <div class="alert alert-info border-0 text-center py-2 mb-3" 
                 style="background-color: rgba(59, 130, 246, 0.15); color: #60a5fa; font-weight: 500;" role="alert">
                Redirigiendo a "${nombrePantalla}"...
            </div>
        `);

        // Deshabilitar clics durante los 5 segundos de espera
        $('.btn-menu').css({
            'opacity': '0.6',
            'pointer-events': 'none'
        });

        // Ejecutar la navegación forzada
        setTimeout(function() {
            window.location.assign(destinoUrl);
        }, 5000);
    });
});