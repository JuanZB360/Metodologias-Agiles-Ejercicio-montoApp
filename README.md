# 💰 MoNtO aPp
**Gestión eficiente de ventas, inventarios y cobros pendientes.**

---

## 👥 Integrantes
* **Andrés Felipe Villa Carmona**
* **Deiby Valencia Tobón**
* **Andrés Felipe Mejía Corrales**
* **Johan Hawasly Méndez**
* **Juan David Zapata Barrera**
---

## 📝 1. Problemática
En la actualidad, muchas personas que realizan ventas independientes, rifas o comercio minorista gestionan sus cuentas mediante papel y lápiz. Este método resulta **tedioso e ineficiente**, especialmente cuando:
* Se deben registrar abonos parciales.
* Se necesita verificar rápidamente el saldo pendiente de un cliente específico.
* Se requiere un control histórico de deudas y fechas de pago.

## 💻 2. Tipo de Aplicación
**Plataforma Web (Single Page Application - SPA)** diseñada con un enfoque *Mobile-First* para facilitar su uso en cualquier lugar.

## 💡 3. Solución Propuesta
**MoNtO aPp** es una herramienta digital creada para simplificar el cobro de cualquier tipo de venta. La aplicación permite:
* Registrar ventas detalladas vinculadas a un inventario.
* Gestionar estados de pago (Completo vs. Fiado).
* Realizar un seguimiento preciso de clientes (nombres, teléfonos y documentos).
* Administrar deudas mediante un sistema dinámico de abonos y fechas compromiso.

## 👥 4. Usuarios del Sistema
* **Vendedor / Administrador:** Único perfil encargado de gestionar el inventario, realizar las ventas y controlar el flujo de caja.

## 🚀 5. Funcionalidades Principales
### Gestión de Inventario
* **Agregar:** Registro de nuevos productos con stock y precio.
* **Modificar:** Actualización de datos existentes.
* **Mostrar:** Visualización detallada del inventario disponible.

### Gestión de Ventas y Cobros
* **Registro de Ventas:** Formulario completo con datos de cliente y producto.
* **Control de Deudas:** Filtrado de ventas "fiadas" para actualización de saldos.
* **Seguimiento de Abonos:** Registro histórico de pagos parciales.
* **Mantenimiento:** Posibilidad de modificar y eliminar registros de ventas.

---

## 🔄 6. Flujo del Sistema
El sistema sigue un proceso lógico y secuencial para garantizar la integridad de los datos:

1.  **Acceso:** El usuario se registra e inicia sesión de forma segura.
2.  **Configuración:** Se alimentan los productos al inventario (Nombre, Precio, Cantidad, Descripción).
3.  **Operación:** Al realizar una venta, el usuario selecciona un producto y define el modo de pago.
    * *Si es Fiado:* Se capturan los datos del cliente y el monto inicial abonado.
    * *Impacto:* El sistema resta automáticamente la cantidad vendida del stock disponible.
4.  **Seguimiento:** El usuario accede al módulo de cartera para actualizar abonos o modificar fechas de pago según el compromiso del cliente.

---
*Desarrollado como proyecto de gestión logística y financiera.*