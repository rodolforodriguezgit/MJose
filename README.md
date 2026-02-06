# Sales Data Lake - Prueba Técnica

Sistema de consulta y análisis de ventas desde un Data Lake, implementado con arquitectura limpia y principios SOLID.

## 📋 Estructura del Proyecto

```
.
├── back/          # Backend API REST (Node.js + Express + TypeScript)
├── front/         # Frontend React (Vite + TypeScript)
└── README.md      # Este archivo
```

## 🚀 Instrucciones de Instalación y Ejecución

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js) o **yarn**
- **Git** ( para clonar el repositorio)




### Paso 1: Clonar o Descargar el Proyecto


git clone https://github.com/rodolforodriguezgit/MJose

### Paso 2: Instalar Dependencias

Instala todas las dependencias del proyecto (backend y frontend) desde la raíz de proyecto (no es necesario ir a cada carpeta front y back para hacer el npm i) desde la raiz del proyecto:


npm install







### Paso 3: Ejecutar el Proyecto

Ejecuta ambos proyectos (backend + frontend) con un solo comando:


npm run dev


Este comando:
1. Iniciará el backend en `http://localhost:3000`
2. Iniciará el frontend en `http://localhost:5173`
3. Mostrará un mensaje cuando ambos estén listos


============================================================
✅ AMBOS SERVIDORES ESTÁN LEVANTADOS
============================================================
🚀 Backend:  http://localhost:3000
🎨 Frontend: http://localhost:5173
============================================================


### Paso 5: Acceder a la Aplicación

Abre tu navegador y visita:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api

|

### Solución de Problemas

## 📚 Endpoints de la API

### GET `/api/sales`
Obtiene todas las ventas.

### GET `/api/sales/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
Filtra ventas por rango de fechas.

### GET `/api/sales/total-by-region`
Obtiene el total de ventas agrupado por región.

### GET `/api/sales/top-client`
Obtiene el cliente con mayor monto acumulado.

### GET `/api/sales/clients-totals`
Obtiene todos los clientes con sus totales acumulados.

### GET `/api/sales/statistics`
Obtiene estadísticas generales del sistema.



Este proyecto cumple con todas las restricciones establecidas:

✅ **No usar frameworks de generación automática de código**
- **Backend**: No se utilizó `express-generator`, `nest-cli` ni ningún otro generador
- **Frontend**: No se utilizó `create-react-app`, `vite create`, `angular-cli` ni ningún otro generador
- Todo el código (backend y frontend) fue escrito manualmente desde cero

### 1. ¿Cómo escalarías esta solución si los datos estuvieran en AWS S3?

**Estrategia de escalabilidad:**

1. **Repositorio S3**: Crear `S3SalesRepository` que implemente `ISalesRepository` usando AWS SDK
2. **Formato Parquet**: Usar Parquet en lugar de JSON para mejor compresión y lectura
3. **Particionamiento**: Organizar datos en S3 por fecha (`s3://bucket/year=2025/month=01/`)
4. **S3 Select**: Usar consultas SQL directas sobre archivos sin descargarlos
5. **Caché Redis**: Implementar caché en ElastiCache para consultas frecuentes
6. **DynamoDB**: Usar como índice para búsquedas rápidas y pre-agregaciones
7. **AWS Glue**: Para ETL y transformación de datos
8. **Lambda**: Para procesamiento asíncrono de grandes volúmenes

**Arquitectura propuesta:**
```
S3 (Data Lake) → AWS Glue (ETL) → DynamoDB (Índice) → API Express
                                      ↓
                                   Redis (Caché)
```

### 2. ¿Cómo optimizarías el rendimiento si el volumen creciera 100 veces?

**Optimizaciones principales:**

1. **Caché Multi-nivel**:
   - Memoria (Node.js) para datos muy frecuentes
   - Redis para consultas intermedias
   - TTL inteligente según tipo de dato

2. **Paginación**:
   - Implementar paginación cursor-based en todos los endpoints
   - Lazy loading en frontend
   - Cargar datos bajo demanda

3. **Pre-agregaciones**:
   - Tablas con datos pre-calculados (totales por región, estadísticas)
   - Actualización incremental (no recalcular todo)
   - Mantener agregaciones actualizadas con eventos

4. **Índices**:
   - Índices en BD para campos de búsqueda frecuente (fecha, región, cliente)
   - Particionamiento por fecha para consultas de rango
   - Índices compuestos para consultas complejas

5. **Compresión**:
   - Gzip/Brotli en respuestas API
   - Minimizar payloads JSON (solo campos necesarios)
   - CDN (CloudFront) para datos estáticos

6. **Procesamiento Paralelo**:
   - Paralelizar consultas independientes
   - Workers/threads para cálculos pesados
   - Streaming para grandes datasets

### 3. ¿Cómo asegurarías la API frente a accesos no autorizados?

**Estrategia de seguridad:**

1. **Autenticación**:
   - JWT Tokens para autenticación de usuarios
   - API Keys con rotación periódica
   - OAuth 2.0 para integraciones externas

2. **Rate Limiting**:
   - Ya implementado con `express-rate-limit`
   - Límites por usuario/API key
   - Diferentes límites según tipo de endpoint

3. **Validación**:
   - Validación estricta de inputs (ya implementada)
   - Sanitización de datos
   - Validación de esquemas (Joi/Zod)

4. **HTTPS y Headers**:
   - Forzar HTTPS en producción
   - Headers de seguridad (Helmet ya implementado)
   - CORS configurado correctamente

5. **Logging y Auditoría**:
   - Logs de todas las peticiones autenticadas
   - Alertas por intentos no autorizados
   - Auditoría de cambios en datos sensibles

6. **Secrets Management**:
   - AWS Secrets Manager para credenciales
   - No hardcodear secrets
   - Rotación automática

7. **WAF (Web Application Firewall)**:
   - AWS WAF para protección adicional
   - Reglas para bloquear patrones sospechosos
   - Protección DDoS
