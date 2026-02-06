import { ExpressApp } from './app/ExpressApp';
import { InMemorySalesRepository } from './infrastructure/repositories/InMemorySalesRepository';
import { SalesService } from './application/services/SalesService';
import { SalesController } from './presentation/controllers/SalesController';
import { createSalesRoutes } from './presentation/routes/salesRoutes';
import { Sale } from './domain/entities/Sale';
import { initialSalesData } from './app/initialData';


class Application {
  private expressApp: ExpressApp;
  private port: number;

  constructor() {
    this.port = Number(process.env.PORT) || 3000;
    this.expressApp = new ExpressApp();
    this.initializeDependencies();
  }


  private initializeDependencies(): void {
    console.log('🔧 Inicializando dependencias...');


    const initialSales = initialSalesData.map(data => Sale.fromJSON(data));
    const salesRepository = new InMemorySalesRepository(initialSales);
    console.log(`✅ Repositorio inicializado con ${salesRepository.size()} ventas`);


    const salesService = new SalesService(salesRepository);
    console.log('✅ Servicio de ventas creado');

 
    const salesController = new SalesController(salesService);
    console.log('✅ Controlador de ventas creado');


    const salesRoutes = createSalesRoutes(salesController);
    console.log('✅ Rutas configuradas');

 
    this.expressApp.registerRoutes('/api/sales', salesRoutes);

  
    this.expressApp.configureErrorHandling();
    console.log('✅ Manejo de errores configurado\n');
  }


  public start(): void {
    const app = this.expressApp.getApp();
    
    app.listen(this.port, () => {
      this.printServerInfo();
    });
  }

  private printServerInfo(): void {
    const environment = process.env.NODE_ENV || 'development';
    const isDev = environment === 'development';

    console.log('═'.repeat(60));
    console.log('🚀 SERVIDOR INICIADO CORRECTAMENTE');
    console.log('═'.repeat(60));
    console.log(`📍 Puerto:        ${this.port}`);
    console.log(`🌍 Entorno:       ${environment}`);
    console.log(`🔗 URL Base:      http://localhost:${this.port}`);
    console.log(`💚 Health Check:  http://localhost:${this.port}/health`);
    console.log(`📚 API Info:      http://localhost:${this.port}/api`);
    console.log('═'.repeat(60));
    console.log('\n📚 ENDPOINTS DISPONIBLES:\n');
    console.log(`  GET    /api/sales`);
    console.log(`         → Obtener todas las ventas\n`);
    console.log(`  GET    /api/sales/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`);
    console.log(`         → Filtrar ventas por rango de fechas\n`);
    console.log(`  GET    /api/sales/total-by-region`);
    console.log(`         → Total de ventas por región\n`);
    console.log(`  GET    /api/sales/top-client`);
    console.log(`         → Cliente con mayor monto acumulado\n`);
    console.log(`  GET    /api/sales/clients-totals`);
    console.log(`         → Todos los clientes con totales\n`);
    console.log(`  GET    /api/sales/statistics`);
    console.log(`         → Estadísticas generales\n`);
    console.log(`  POST   /api/sales`);
    console.log(`         → Crear nueva venta\n`);
    console.log('═'.repeat(60));
    
    if (isDev) {
      console.log(`\n🔑 API Key (desarrollo): ${process.env.API_KEY}`);
      console.log(`   Header: x-api-key (opcional en desarrollo)\n`);
    } else {
      console.log(`\n🔒 Autenticación requerida con API Key`);
      console.log(`   Header: x-api-key\n`);
    }
    
    console.log('═'.repeat(60));
    console.log('✨ Servidor listo para recibir peticiones\n');
  }
}


const application = new Application();
application.start();


process.on('unhandledRejection', (reason: Error) => {
  console.error('❌ Unhandled Rejection:', reason);
  console.error('Stack:', reason.stack);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});


process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT recibido, cerrando servidor...');
  process.exit(0);
});
