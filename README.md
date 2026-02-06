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

Para verificar que tienes Node.js instalado:
```bash
node --version
npm --version
```

### Paso 1: Clonar o Descargar el Proyecto

Si tienes el proyecto en un repositorio Git:
```bash
git clone <url-del-repositorio>
cd "Mari Jose"
```

Si tienes el proyecto descargado, navega a la carpeta del proyecto:
```bash
cd "Mari Jose"
```

### Paso 2: Instalar Dependencias

Instala todas las dependencias del proyecto (backend y frontend) desde la raíz:

```bash
npm install
```

Este comando instalará todas las dependencias necesarias en el `node_modules/` de la raíz del proyecto.

**Tiempo estimado:** 2-5 minutos dependiendo de tu conexión a internet.

### Paso 3: Configurar Variables de Entorno (Opcional)

Crea un archivo `.env` en la carpeta `back/` para configurar el backend:

```bash
# En Windows (PowerShell)
New-Item -Path "back\.env" -ItemType File

# En Linux/Mac
touch back/.env
```

Edita el archivo `back/.env` y agrega:

```env
PORT=3000
NODE_ENV=development
API_KEY=your-api-key-here
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Nota:** Si no creas el archivo `.env`, el proyecto usará valores por defecto.

### Paso 4: Ejecutar el Proyecto

Ejecuta ambos proyectos (backend + frontend) con un solo comando:

```bash
npm run dev
```

Este comando:
1. Iniciará el backend en `http://localhost:3000`
2. Iniciará el frontend en `http://localhost:5173`
3. Mostrará un mensaje cuando ambos estén listos

**Salida esperada:**
```
============================================================
✅ AMBOS SERVIDORES ESTÁN LEVANTADOS
============================================================
🚀 Backend:  http://localhost:3000
🎨 Frontend: http://localhost:5173
============================================================
```

### Paso 5: Acceder a la Aplicación

Abre tu navegador y visita:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Ejecuta backend y frontend en modo desarrollo |
| `npm run build` | Compila ambos proyectos para producción |
| `npm run start` | Ejecuta ambos proyectos en modo producción |
| `npm run lint` | Ejecuta linter en ambos proyectos |
| `npm run dev:back` | Ejecuta solo el backend |
| `npm run dev:front` | Ejecuta solo el frontend |

### Solución de Problemas

**Error: Puerto 3000 en uso**
```bash
# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

**Error: Dependencias no encontradas**
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Error: TypeScript no compila**
```bash
# Verificar que TypeScript esté instalado
npm list typescript
```

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

### POST `/api/sales`
Crea una nueva venta.

**Body:**
```json
{
  "cliente": "Empresa A",
  "monto": 150000,
  "fecha": "2025-01-10",
  "region": "Metropolitana"
}
```

## 🏗️ Arquitectura y Decisiones Técnicas

### Backend

El backend sigue una **Arquitectura Limpia (Clean Architecture)** con las siguientes capas:

1. **Domain Layer** (`domain/`)
   - Entidades de negocio (`Sale`)
   - Value Objects (`DateRange`, `RegionTotal`, `ClientTotal`)
   - Interfaces de repositorios (`ISalesRepository`)

2. **Application Layer** (`application/`)
   - Servicios de negocio (`SalesService`)
   - Manejo de errores personalizados (`AppErrors`)

3. **Infrastructure Layer** (`infrastructure/`)
   - Implementación de repositorios (`InMemorySalesRepository`)
   - En producción, aquí irían adaptadores para AWS S3, DynamoDB, etc.

4. **Presentation Layer** (`presentation/`)
   - Controladores (`SalesController`)
   - DTOs y validadores (`SalesDTOs`)
   - Middlewares (autenticación, validación, manejo de errores)
   - Rutas (`salesRoutes`)

**Principios SOLID aplicados:**
- **S**ingle Responsibility: Cada clase tiene una única responsabilidad
- **O**pen/Closed: Extensible mediante interfaces (ISalesRepository)
- **L**iskov Substitution: Los repositorios son intercambiables
- **I**nterface Segregation: Interfaces específicas y pequeñas
- **D**ependency Inversion: Dependencias hacia abstracciones (interfaces)

### Frontend

El frontend también sigue **Clean Architecture** y **SOLID**:

1. **Domain Layer** (`domain/`)
   - Entidades y Value Objects
   - Interfaces de repositorios

2. **Application Layer** (`application/`)
   - Servicios de aplicación (`SalesService`)

3. **Infrastructure Layer** (`infrastructure/`)
   - Cliente HTTP (`ApiClient`)
   - Repositorios (`SalesRepository`)

4. **Presentation Layer** (`presentation/`)
   - Componentes React
   - Hooks personalizados (`useSales`)
   - Páginas y estilos

**Características:**
- Separación de responsabilidades clara
- Componentes reutilizables y desacoplados
- Manejo de estado mediante hooks personalizados
- Visualización de datos con gráficos (Recharts)
- Diseño responsive

## 📊 Parte 3 - Respuestas Técnicas

### 1. ¿Cómo escalarías esta solución si los datos estuvieran en AWS S3?

**Estrategia de Escalabilidad Completa:**

#### 1.1 Implementación del Data Access Layer

**Paso 1: Crear Repositorio S3**
```typescript
// back/src/infrastructure/repositories/S3SalesRepository.ts
import { ISalesRepository } from '../../domain/interfaces/ISalesRepository';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Sale } from '../../domain/entities/Sale';

export class S3SalesRepository implements ISalesRepository {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({ region: process.env.AWS_REGION });
    this.bucketName = process.env.S3_BUCKET_NAME!;
  }

  async findAll(): Promise<Sale[]> {
    // Leer desde S3 usando S3 Select para consultas SQL
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: 'sales/data.parquet'
    });
    // Implementar lectura y parsing
  }
}
```

**Paso 2: Configurar AWS SDK**
```bash
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

**Paso 3: Variables de Entorno**
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=sales-data-lake
```

#### 1.2 Optimización de Lectura desde S3

**Estrategia de Particionamiento:**
```
s3://sales-data-lake/
  ├── year=2025/
  │   ├── month=01/
  │   │   ├── day=10/sales.parquet
  │   │   └── day=15/sales.parquet
  │   └── month=02/
  │       └── day=02/sales.parquet
```

**Ventajas:**
- Consultas más rápidas (solo lee particiones relevantes)
- Menor costo (menos datos escaneados)
- Escalabilidad horizontal

**Uso de S3 Select:**
```typescript
// Consulta SQL directa sobre archivos Parquet
const selectParams = {
  Bucket: this.bucketName,
  Key: 'sales/data.parquet',
  ExpressionType: 'SQL',
  Expression: "SELECT * FROM s3object s WHERE s.fecha BETWEEN '2025-01-01' AND '2025-01-31'",
  InputSerialization: {
    Parquet: {}
  },
  OutputSerialization: {
    JSON: {}
  }
};
```

#### 1.3 Procesamiento Asíncrono con AWS Services

**Arquitectura de Colas:**
```
Nuevos Datos → S3 → S3 Event → SQS → Lambda → Procesamiento → DynamoDB
```

**Implementación:**
1. **AWS Lambda** para procesamiento ETL
2. **AWS Glue** para transformaciones complejas
3. **AWS Step Functions** para orquestación de workflows
4. **DynamoDB** para índices y consultas rápidas

**Ejemplo Lambda Function:**
```typescript
// lambda/processSales.ts
export const handler = async (event: S3Event) => {
  const records = event.Records;
  for (const record of records) {
    const key = record.s3.object.key;
    // Procesar archivo y actualizar agregaciones
    await updateAggregations(key);
  }
};
```

#### 1.4 Sistema de Caché Multi-Nivel

**Nivel 1: Caché en Memoria (Node.js)**
```typescript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutos
```

**Nivel 2: Redis (ElastiCache)**
```typescript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

async getCachedData(key: string) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await this.fetchFromS3();
  await redis.setex(key, 3600, JSON.stringify(data)); // 1 hora
  return data;
}
```

**Nivel 3: DynamoDB (Índice)**
- Pre-agregaciones calculadas
- Actualización incremental
- Consultas en milisegundos

#### 1.5 Arquitectura Completa Propuesta

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              API Gateway / Load Balancer                 │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌───────────────┐            ┌─────────────────┐
│  API Express  │            │  API Express    │
│  (Instancia 1)│            │  (Instancia N)  │
└───────┬───────┘            └────────┬────────┘
        │                              │
        └──────────────┬───────────────┘
                       ▼
        ┌──────────────────────────┐
        │    ElastiCache (Redis)   │  ← Caché L2
        └──────────────┬───────────┘
                       │
        ┌──────────────┴───────────┐
        ▼                          ▼
┌───────────────┐         ┌──────────────┐
│   DynamoDB    │         │  AWS S3      │
│  (Índices)    │         │ (Data Lake)  │
└───────────────┘         └──────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
            ┌──────────────┐         ┌──────────────┐
            │  AWS Glue    │         │  AWS Lambda   │
            │  (ETL Jobs)  │         │ (Processing) │
            └──────────────┘         └──────────────┘
```

#### 1.6 Implementación Paso a Paso

**Fase 1: Migración Inicial**
1. Configurar bucket S3 con estructura particionada
2. Migrar datos existentes a S3 en formato Parquet
3. Implementar `S3SalesRepository` básico
4. Testing con datos de prueba

**Fase 2: Optimización**
1. Implementar caché Redis
2. Crear índices en DynamoDB
3. Configurar pre-agregaciones
4. Implementar S3 Select para consultas

**Fase 3: Escalabilidad**
1. Configurar Auto Scaling para API
2. Implementar Lambda para procesamiento
3. Configurar AWS Glue para ETL
4. Monitoreo con CloudWatch

**Costo Estimado (mensual para 1M de registros):**
- S3 Storage: ~$23 (estándar)
- DynamoDB: ~$25 (on-demand)
- ElastiCache: ~$15 (t2.micro)
- Lambda: ~$5 (1M invocaciones)
- **Total: ~$68/mes**

### 2. ¿Cómo optimizarías el rendimiento si el volumen creciera 100 veces?

**Escenario:** De 5 registros actuales a 500 registros (o de 1M a 100M en producción)

#### 2.1 Estrategia de Caché Avanzada

**Implementación de Caché Multi-Nivel:**

```typescript
// back/src/infrastructure/cache/MultiLevelCache.ts
class MultiLevelCache {
  private memoryCache: Map<string, CacheEntry>;
  private redisClient: Redis;
  
  async get(key: string): Promise<any> {
    // Nivel 1: Memoria (más rápido, ~1ms)
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key).data;
    }
    
    // Nivel 2: Redis (rápido, ~5ms)
    const redisData = await this.redisClient.get(key);
    if (redisData) {
      this.memoryCache.set(key, JSON.parse(redisData));
      return JSON.parse(redisData);
    }
    
    // Nivel 3: Base de datos (lento, ~50-100ms)
    return null;
  }
}
```

**Estrategias de Invalidación:**
- **TTL (Time To Live)**: Datos expiran automáticamente
- **Invalidación por Eventos**: Cuando se actualizan datos
- **Cache Warming**: Pre-cargar datos frecuentes al inicio

#### 2.2 Paginación y Lazy Loading

**Implementación de Paginación Cursor-Based:**

```typescript
// Backend
interface PaginatedResponse<T> {
  data: T[];
  cursor: string | null;
  hasMore: boolean;
  total?: number;
}

async getSalesPaginated(cursor?: string, limit: number = 50) {
  const query = cursor 
    ? `SELECT * FROM sales WHERE id > $1 ORDER BY id LIMIT $2`
    : `SELECT * FROM sales ORDER BY id LIMIT $1`;
  // Retornar cursor para siguiente página
}
```

**Frontend - Infinite Scroll:**
```typescript
// front/src/presentation/hooks/useInfiniteSales.ts
const useInfiniteSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  
  const loadMore = async () => {
    const response = await salesService.getSalesPaginated(cursor);
    setSales(prev => [...prev, ...response.data]);
    setCursor(response.cursor);
  };
  
  return { sales, loadMore, hasMore: cursor !== null };
};
```

#### 2.3 Pre-agregaciones y Materializaciones

**Tabla de Agregaciones Pre-calculadas:**

```sql
-- Crear tabla de agregaciones
CREATE TABLE sales_aggregations (
  date DATE,
  region VARCHAR(50),
  total_amount DECIMAL,
  total_count INT,
  last_updated TIMESTAMP,
  PRIMARY KEY (date, region)
);

-- Actualización incremental (no recalcular todo)
UPDATE sales_aggregations 
SET total_amount = total_amount + NEW.amount,
    total_count = total_count + 1,
    last_updated = NOW()
WHERE date = NEW.date AND region = NEW.region;
```

**Implementación en Código:**
```typescript
// Actualizar agregaciones cuando se inserta nueva venta
async createSale(sale: Sale): Promise<void> {
  await this.repository.save(sale);
  
  // Actualizar agregación de forma incremental
  await this.updateAggregation({
    date: sale.fecha,
    region: sale.region,
    amount: sale.monto
  });
}
```

#### 2.4 Índices y Particionamiento

**Índices Estratégicos:**

```sql
-- Índice compuesto para consultas por fecha y región
CREATE INDEX idx_sales_date_region ON sales(fecha, region);

-- Índice para búsqueda por cliente
CREATE INDEX idx_sales_cliente ON sales(cliente);

-- Índice para ordenamiento por monto
CREATE INDEX idx_sales_monto ON sales(monto DESC);
```

**Particionamiento por Fecha (PostgreSQL):**
```sql
-- Crear tabla particionada
CREATE TABLE sales (
  id SERIAL,
  cliente VARCHAR(100),
  monto DECIMAL,
  fecha DATE,
  region VARCHAR(50)
) PARTITION BY RANGE (fecha);

-- Crear particiones mensuales
CREATE TABLE sales_2025_01 PARTITION OF sales
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

#### 2.5 Compresión y Optimización de Payloads

**Compresión en Express:**
```typescript
import compression from 'compression';
app.use(compression({
  level: 6, // Nivel de compresión
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));
```

**Respuestas Selectivas (solo campos necesarios):**
```typescript
// Endpoint optimizado
app.get('/api/sales/summary', async (req, res) => {
  // Solo retornar campos necesarios, no toda la entidad
  const summary = await salesService.getSummary({
    fields: ['cliente', 'monto', 'fecha'] // Solo estos campos
  });
  res.json(summary);
});
```

#### 2.6 Procesamiento Paralelo

**Worker Threads para Cálculos Pesados:**
```typescript
import { Worker } from 'worker_threads';

async calculateStatisticsParallel(sales: Sale[]) {
  const chunkSize = Math.ceil(sales.length / 4);
  const chunks = [];
  
  for (let i = 0; i < sales.length; i += chunkSize) {
    chunks.push(sales.slice(i, i + chunkSize));
  }
  
  const workers = chunks.map(chunk => 
    new Promise((resolve) => {
      const worker = new Worker('./statistics-worker.js', {
        workerData: chunk
      });
      worker.on('message', resolve);
    })
  );
  
  const results = await Promise.all(workers);
  return mergeResults(results);
}
```

#### 2.7 Monitoreo y Optimización

**Implementación de Métricas:**
```typescript
import prometheus from 'prom-client';

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

// Middleware de métricas
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    }, duration);
  });
  next();
});
```

**Dashboard de Monitoreo:**
- **Grafana** para visualización
- **Prometheus** para métricas
- **ELK Stack** para logs
- **AWS CloudWatch** en producción

#### 2.8 Resultados Esperados

| Métrica | Antes (5 registros) | Después (500 registros) | Mejora |
|---------|---------------------|-------------------------|--------|
| Tiempo de respuesta | 50ms | 60ms | +20% |
| Throughput | 100 req/s | 1000 req/s | 10x |
| Uso de memoria | 50MB | 200MB | 4x |
| Tiempo de carga inicial | 200ms | 300ms | +50% |

**Con optimizaciones aplicadas:**
- Caché: Reduce 80% de consultas a BD
- Paginación: Reduce payload en 90%
- Pre-agregaciones: Consultas 10x más rápidas
- Índices: Búsquedas 100x más rápidas

### 3. ¿Cómo asegurarías la API frente a accesos no autorizados?

**Estrategia de Seguridad:**

1. **Autenticación y Autorización:**
   - **JWT Tokens**: Implementar autenticación basada en tokens
   - **API Keys**: Sistema de API keys con rotación periódica
   - **OAuth 2.0**: Para integración con sistemas externos
   - **RBAC**: Role-Based Access Control para diferentes niveles de acceso

2. **Rate Limiting:**
   - Ya implementado con `express-rate-limit`
   - Extender con límites por usuario/API key
   - Diferentes límites según tipo de endpoint (más restrictivo en escritura)

3. **Validación y Sanitización:**
   - Validación estricta de inputs (ya implementada)
   - Sanitización de datos para prevenir inyecciones
   - Validación de esquemas con librerías como Joi o Zod

4. **HTTPS y Headers de Seguridad:**
   - Forzar HTTPS en producción
   - Headers de seguridad (Helmet ya implementado)
   - CORS configurado correctamente

5. **Logging y Auditoría:**
   - Logs de todas las peticiones autenticadas
   - Alertas por intentos de acceso no autorizado
   - Auditoría de cambios en datos sensibles

6. **Secrets Management:**
   - Usar AWS Secrets Manager o similar
   - No hardcodear credenciales
   - Rotación automática de secrets

7. **WAF (Web Application Firewall):**
   - AWS WAF para protección adicional
   - Reglas para bloquear patrones sospechosos
   - Protección DDoS

8. **Implementación Propuesta:**
```typescript
// Middleware de autenticación mejorado
export const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new UnauthorizedError('Token requerido');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError('Token inválido');
  }
};
```

## 🎯 Parte 4 - Validación de Autoría

### Estructura de la Solución

La solución está estructurada siguiendo principios de **Clean Architecture** y **SOLID**, tanto en backend como frontend:

**Backend:**
- Separación clara de capas (Domain, Application, Infrastructure, Presentation)
- Inversión de dependencias mediante interfaces
- Servicios de negocio desacoplados
- Manejo centralizado de errores
- Validación robusta de datos

**Frontend:**
- Arquitectura similar al backend para consistencia
- Componentes reutilizables y desacoplados
- Hooks personalizados para lógica de negocio
- Separación de concerns (presentación vs lógica)

### Decisiones Técnicas

1. **TypeScript**: Para type safety y mejor DX
2. **Clean Architecture**: Para mantener el código mantenible y testeable
3. **SOLID**: Para facilitar extensibilidad y cambios
4. **Recharts**: Para visualización de datos profesional
5. **Vite**: Para desarrollo rápido y build optimizado
6. **Express**: Framework maduro y flexible para API REST

### Parte Más Compleja

La parte más compleja fue **diseñar la arquitectura del frontend** manteniendo los mismos principios del backend:

1. **Desafío**: Aplicar Clean Architecture en React, que tradicionalmente se estructura por componentes
2. **Solución**: Separar en capas (domain, application, infrastructure, presentation) manteniendo la reactividad de React
3. **Implementación**: 
   - Hooks personalizados para encapsular lógica de negocio
   - Servicios que dependen de interfaces (no implementaciones)
   - Repositorios que abstraen el acceso a datos
   - Componentes puros que solo se encargan de presentación

Esta estructura permite:
- Testear lógica de negocio sin componentes React
- Cambiar la fuente de datos sin afectar componentes
- Reutilizar lógica en diferentes contextos
- Mantener el código escalable y mantenible

### Tiempo Total Utilizado

- **Backend**: ~4 horas
- **Frontend**: ~5 horas
- **Documentación**: ~1 hora
- **Total**: ~10 horas

## 📝 Notas Adicionales

- El backend incluye manejo de errores robusto y validación de parámetros
- El frontend es completamente responsive
- Se implementaron todos los endpoints requeridos
- La solución es escalable y mantenible
- Código documentado y siguiendo mejores prácticas

## 🛠️ Tecnologías Utilizadas

**Backend:**
- Node.js
- Express
- TypeScript
- Clean Architecture

**Frontend:**
- React 18
- TypeScript
- Vite
- Recharts
- Axios

## 📄 Licencia

MIT
