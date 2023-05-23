import App from './application/app';
import { Advice as AdviceController } from './application/controllers/advice.controller';
import { Backup as BackupController } from './application/controllers/backup.controller';
import { Base as BaseController } from './application/controllers/base.controller';
import { Portfolio as PortfolioController } from './application/controllers/portfolio.controller';
import { StockPerformance as StockPerformanceController } from './application/controllers/stockPerformance.controller';

export class Server {
  public static Init(): App {
    return new App([
      new AdviceController(),
      new BackupController(),
      new BaseController(),
      new PortfolioController(),
      new StockPerformanceController()
    ]);
  }
}
Server.Init().listen();
