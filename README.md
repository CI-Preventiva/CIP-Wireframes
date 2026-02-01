# CIP Wireframes - Sprint 1

Wireframes interactivos para el Sistema de Centro de Inteligencia Preventiva (Prevención de Riesgos Laborales).

## 🚀 Ejecutar el proyecto

```bash
# Instalar dependencias (si aún no lo has hecho)
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

El proyecto se ejecutará en `http://localhost:5173`

## 📁 Estructura de Wireframes

### Autenticación
- `/login` - Inicio de sesión
- `/forgot-password` - Recuperar contraseña
- `/reset-password` - Restablecer contraseña
- `/activate` - Activar cuenta (invitación)

### Dashboard
- `/` - Home / Dashboard principal
- `/onboarding` - Checklist de configuración inicial

### Administración
- `/admin/subsidiaries` - Gestión de Filiales
- `/admin/areas` - Gestión de Áreas (jerarquía)
- `/admin/roles` - Roles y Permisos (RBAC)
- `/admin/users` - Gestión de Usuarios
- `/admin/users/bulk-import` - Carga masiva de usuarios

### SuperAdmin
- `/superadmin/organizations` - Gestión de Organizaciones

## 📋 Cobertura de Historias de Usuario

### EPIC S1-01 — Base SaaS + Autenticación
- ✅ S1-01.2: Login
- ✅ S1-01.3: Recuperar contraseña
- ✅ S1-01.4: Navegación según permisos

### EPIC S1-02 — Onboarding Organización
- ✅ S1-02.1: Crear Owner/Admin e invitar
- ✅ S1-02.2: Activar cuenta Owner

### EPIC S1-03 — Estructura organizacional
- ✅ S1-03.0: CRUD Filiales
- ✅ S1-03.1: Áreas jerárquicas
- ✅ S1-03.2: Validación configuración mínima (checklist)

### EPIC S1-04 — Roles y Permisos
- ✅ S1-04.1: Catálogo de permisos
- ✅ S1-04.2: Crear/editar roles
- ✅ S1-04.3: Asignar rol a usuarios

### EPIC S1-05 — Administración de Usuarios
- ✅ S1-05.1: Ver usuarios y estados
- ✅ S1-05.2: Invitar usuario
- ✅ S1-05.3: Reenviar/revocar invitaciones
- ✅ S1-05.4: Suspender/reactivar usuarios
- ✅ S1-05.5: Definir área principal y alcance
- ✅ S1-05.7: Carga masiva por archivo
- ✅ S1-05.8: Procesar válidos y enviar invitaciones
- ✅ S1-05.9: Activar cuenta (usuario invitado)

### EPIC S1-07 — SuperAdmin interno
- ✅ S1-07.1: Crear organización
- ✅ S1-07.2: Suspender organización

## 🎨 Características

- **Mantine UI**: Sistema de diseño moderno y accesible
- **Wireframes genéricos**: Colores neutros para enfocarse en la funcionalidad
- **Datos mock**: Datos de ejemplo para visualizar flujos
- **Anotaciones**: Cada página incluye alertas con criterios de aceptación (AC)
- **Navegación completa**: Sidebar con módulos según permisos
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 📝 Notas

Estos wireframes son prototipos interactivos que **no** están conectados a un backend real. 
Los datos son simulados y las acciones no persisten.

El objetivo es visualizar y validar:
- Flujos de usuario
- Estructura de información
- Interacciones principales
- Criterios de aceptación de las HUs

## 🛠️ Tecnologías

- React 18 + TypeScript
- Vite
- Mantine UI v7
- React Router v6
- Tabler Icons
