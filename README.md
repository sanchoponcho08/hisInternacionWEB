# Sistema de Gestión Hospitalaria (HIS) - Práctico Integrador

Este proyecto es un Sistema de Información Hospitalaria (HIS) desarrollado como parte del Trabajo Práctico Integrador para la materia Programación Web 2. La aplicación permite gestionar el ciclo completo de una internación de un paciente, desde su admisión hasta el alta, incluyendo flujos de emergencia y seguimiento clínico.

## Características Principales

- **Gestión de Pacientes:** CRUD completo para la administración de pacientes.
- **Flujo de Admisión:** Registro de nuevas internaciones, con un flujo de dos pasos para asignación de cama.
- **Lógica de Asignación de Camas:** Sistema de asignación que considera disponibilidad, estado de higiene y el sexo de los ocupantes en habitaciones compartidas.
- **Flujo de Emergencia:** Camino rápido para admitir pacientes de emergencia, creando un registro temporal y asignando una cama en el ala de Emergencia de forma automática.
- **Seguimiento Clínico:** Ficha de detalle por internación donde el personal puede registrar y consultar evaluaciones de enfermería (signos vitales, observaciones).
- **Alta Hospitalaria:** Funcionalidad para dar de alta a un paciente, actualizando el estado de la internación y liberando la cama para su posterior higienización.
- **Notificaciones:** Sistema de notificaciones emergentes (modales) para informar al usuario sobre el resultado de las operaciones.

## Tecnologías Utilizadas

- **Backend:** Node.js, Express.js
- **Base de Datos:** MariaDB (Desarrollo) y TiDB Cloud (Producción).
- **ORM:** Sequelize
- **Motor de Plantillas:** Pug (Server-Side Rendering)
- **Frontend:** HTML5, CSS3, Bootstrap 5
- **Despliegue:** Render

## Guía de Instalación y Ejecución Local

Para ejecutar este proyecto en un entorno local, sigue estos pasos:

1.  **Clonar el repositorio:**

    ```bash
    git clone [https://github.com/sanchoponcho08/hisInternacionWEB.git](https://github.com/sanchoponcho08/hisInternacionWEB.git)
    cd hisInternacionWEB
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo llamado `.env` en la raíz del proyecto y llénalo con tus credenciales de base de datos locales. Puedes usar esta plantilla:

    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=his_internacion
    DB_PORT=3306
    SESSION_SECRET= ???  (No te olvides de asignar una propia)
    ```

4.  **Restaurar la base de datos:**
    Asegúrate de tener un servidor de MySQL/MariaDB corriendo. Luego, importa el archivo `database_backup.sql` que se encuentra en la raíz del proyecto usando una herramienta como phpMyAdmin o la línea de comandos.

5.  **Ejecutar la aplicación:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

## Usuarios de Prueba

NOTA:actualmente el login por roles está planificado pero no implementado.
Podes usar las siguientes credenciales para probar los diferentes roles del sistema :

| Rol                | Email              | Contraseña     |
| :----------------- | :----------------- | :------------- |
| **Administrativo** | admin@his.com      | `admin123`     |
| **Enfermería**     | juan.perez@his.com | `enfermero123` |
| **Médico**         | ana.gomez@his.com  | `medico123`    |

## Despliegue

La aplicación está desplegada y funcionando en la siguiente URL pública:

**[https://hisinternacionwebkeving.onrender.com](https://hisinternacionwebkeving.onrender.com)**

## Desafíos y Soluciones (Informe Breve)

Durante el desarrollo de este proyecto, me encontré con varios desafíos técnicos que me permitieron aplicar y profundizar mis conocimientos:

- **Desafío 1: Dependencias Circulares en Sequelize:**

  - **Problema:** Al definir las asociaciones (`hasMany`, `belongsTo`) dentro de cada archivo de modelo, se generaban errores al arrancar la aplicación.
  - **Solución:** La solución fue centralizar todas las definiciones de las asociaciones en el archivo principal `app.js`, asegurando que todos los modelos estuvieran cargados antes de crear las relaciones.

- **Desafío 2: Despliegue en Servidores Case-Sensitive (Linux):**

  - **Problema:** La aplicación fallaba en Render con errores `MODULE_NOT_FOUND`, aunque funcionaba en Windows. Esto se debía a inconsistencias en las mayúsculas/minúsculas de los nombres de archivo (ej: `Ala.js` vs `ala.js`).
  - **Solución:** Se tuvo que forzar a Git a reconocer el renombrado de los archivos usando el comando `git mv`. Esto estandarizó todos los nombres de modelos a `PascalCase` y aseguró que las importaciones (`require`) coincidieran exactamente con los nombres de archivo.

- **Desafío 3: Configuración de Base de Datos en la Nube:**
  - **Problema:** La conexión a TiDB Cloud fallaba por dos motivos: la exigencia de conexiones seguras (SSL) y el bloqueo de IPs desconocidas.
  - **Solución:** Se modificó la configuración de Sequelize para incluir las opciones de `ssl`, y se configuró la lista de IPs permitidas en el panel de TiDB Cloud para aceptar conexiones desde cualquier origen (`0.0.0.0/0`), como lo requieren plataformas como Render.
