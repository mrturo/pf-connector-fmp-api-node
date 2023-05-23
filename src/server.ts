import App from './application/app';
import { Base as BaseController } from './application/controllers/base.controller';
import { Portfolio as PortfolioController } from './application/controllers/portfolio.controller';
import { StockPerformance as StockPerformanceController } from './application/controllers/stockPerformance.controller';

export class Server {
  public static init(): App {
    return new App([
      new BaseController(),
      new PortfolioController(),
      new StockPerformanceController()
    ]);
  }
}
Server.init().listen();
