describe('Pruebas para el portal de Supervisión en Línea', () => {

    // --- Escenario 1.1: Login exitoso ---
    it('Debe permitir el login de un usuario existente', () => {
        cy.login();
        cy.url().should('include', '/almacen');
        cy.screenshot('1.1-login-exitoso-y-redireccion'); // Captura el resultado final
    });

    // --- Escenario 1.2: Validar campos obligatorios en Login ---
    it('Debe mostrar un mensaje de error para campos vacíos en el login', () => {
        cy.visit('https://qatest.supervisionenlinea.com/login');
        cy.screenshot('1.2-formulario-login-vacio'); // Captura el estado inicial
        
        cy.get('#login').click();
        
        cy.contains('Todos los campos son necesarios!').should('be.visible');
        cy.screenshot('1.2-mensaje-error-campos-vacios'); // Captura el resultado final
    });


    // --- Escenarios que requieren autenticación ---
    describe('Funcionalidades que requieren autenticación', () => {
        
        beforeEach(() => {
            cy.login();
            cy.fixture('usuarios').as('datos');
        });

        // --- Escenario 2.1: Registro de usuario exitoso ---
        it('Debe permitir registrar un nuevo usuario con datos únicos', function() {
            cy.contains('Usuarios').click();
            cy.contains('Registrar').click();
            cy.url().should('include', '/users/new');
            cy.screenshot('2.1-formulario-registro-visible'); // Captura el estado inicial

            const uniqueId = Math.floor(Math.random() * 99000) + 1000;
            const uniqueUsername = `${this.datos.nuevo_usuario.username_base}${uniqueId}`;

            cy.get('#user').type(uniqueUsername);
            cy.get('#name').type(this.datos.nuevo_usuario.nombre);
            cy.get('#last').type(this.datos.nuevo_usuario.apellido);
            cy.get('#pass').type('Password123#');
            cy.get('#pass2').type('Password123#');
            cy.screenshot('2.1-formulario-registro-relleno'); // Captura estado intermedio clave
            
            cy.get('.btn').contains('Crear').click();

            cy.url().should('include', '/users');
            cy.screenshot('2.1-redireccion-a-lista-tras-crear'); // Captura el resultado final
        });

        // --- Escenario 2.2: Intentar registrar un usuario duplicado ---
        it('Debe mostrar un error al intentar registrar un usuario duplicado', function() {
            cy.contains('Usuarios').click();
            cy.contains('Registrar').click();
            cy.get('#user').type(this.datos.admin.usuario);
            cy.get('#name').type('Test');
            cy.get('#last').type('Duplicado');
            cy.get('#pass').type('Password123');
            cy.get('#pass2').type('Password123');
            cy.screenshot('2.2-formulario-con-usuario-duplicado'); // Captura estado intermedio
            
            cy.get('.btn').contains('Crear').click();

            cy.contains('Usuario repetido!').should('be.visible');
            cy.screenshot('2.2-mensaje-error-usuario-duplicado'); // Captura el resultado final
        });

        // --- Escenario 2.3: Validar campos obligatorios en Registro ---
        it('Debe mostrar un mensaje de error si los campos de registro están vacíos', function() {
            cy.contains('Usuarios').click();
            cy.contains('Registrar').click();
            cy.get('.btn').contains('Crear').click();
            cy.contains('Todos los campos son necesarios!').should('be.visible');
            cy.screenshot('2.3-mensaje-error-registro-vacio'); // Captura el resultado final
        });

        // --- Escenario 3: Filtros de una tabla ---
        
        // --- Escenario 3.1: Filtrar tabla por Nombre de Usuario ---
        it('Debe filtrar la tabla por la columna "Usuario"', function() {
            cy.contains('Usuarios').click();
            cy.contains('Lista').click();
            cy.screenshot('3.1-tabla-usuarios-sin-filtrar'); // Captura el estado inicial

            const textoBusqueda = this.datos.admin.usuario;
            cy.get('input[type="search"]').type(textoBusqueda);
            cy.screenshot('3.1-tabla-filtrada-por-usuario'); // Captura el resultado final

            cy.get('tbody > tr').should('have.length', 1);
            cy.get('tbody > tr').first().find('td').eq(0).should('contain.text', textoBusqueda);
        });

        // --- Escenario 3.2: Filtrar tabla por Nombres ---
        it('Debe filtrar la tabla por la columna "Nombres"', function() {
            cy.contains('Usuarios').click();
            cy.contains('Lista').click();
            const textoBusqueda = 'Irma';
            cy.get('input[type="search"]').type(textoBusqueda);
            cy.screenshot('3.2-tabla-filtrada-por-nombre'); // Captura el resultado final

            cy.get('tbody > tr').should('have.length.at.least', 1);
            cy.get('tbody > tr').each(($row) => {
                cy.wrap($row).find('td').eq(1).should('contain.text', textoBusqueda);
            });
        });

        // --- Escenario 3.3: Filtrar tabla por Apellidos ---
        it('Debe filtrar la tabla por la columna "Apellidos"', function() {
            cy.contains('Usuarios').click();
            cy.contains('Lista').click();
            const textoBusqueda = 'Archuleta';
            cy.get('input[type="search"]').type(textoBusqueda);
            cy.screenshot('3.3-tabla-filtrada-por-apellido'); // Captura el resultado final

            cy.get('tbody > tr').should('have.length.at.least', 1);
            cy.get('tbody > tr').each(($row) => {
                cy.wrap($row).find('td').eq(2).should('contain.text', textoBusqueda);
            });
        });

        // --- Escenario 3.4: Filtrar tabla por Estado ---
        it('Debe filtrar la tabla por la columna "Estado"', function() {
            cy.contains('Usuarios').click();
            cy.contains('Lista').click();
            const textoBusqueda = 'Inactivo';
            cy.get('input[type="search"]').type(textoBusqueda);
            cy.screenshot('3.4-tabla-filtrada-por-estado'); // Captura el resultado final

            cy.get('tbody > tr').should('have.length.at.least', 1);
            cy.get('tbody > tr').each(($row) => {
                cy.wrap($row).find('td').eq(3).should('contain.text', textoBusqueda);
            });
        });
    });
});