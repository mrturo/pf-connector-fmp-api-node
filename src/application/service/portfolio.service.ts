import { Portfolio as PortfolioModel } from '../../domain/model/portfolio.model';
import { Stock as StockModel } from '../../domain/model/stock.model';
import { FMP as FmpService } from '../../infrastructure/service/fmp.service';

export class Portfolio {
  public static async update(
    portfolio: PortfolioModel
  ): Promise<PortfolioModel> {
    const stocks: Map<string, StockModel> = portfolio.stocks;
    const symbols: string[] = portfolio.symbols;
    const profiles = await FmpService.profile(symbols);
    for (const p of profiles) {
      const stock: StockModel | undefined = stocks.get(p.symbol);
      if (stock) {
        stock.unitPriceUSD = p.price;
        stock.name = p.companyName;
        stock.industry = p.industry;
        stock.sector = p.sector;
        stock.type =
          p.isEtf === true
            ? StockModel.type.ETF
            : p.isFund === true
            ? StockModel.type.MUTUAL_FUND
            : StockModel.type.COMPANY;
        stocks.set(stock.symbol, stock);
      }
    }
    portfolio.stocks = stocks;
    return portfolio;
  }
  public static async createBySymbols(
    symbols: string[]
  ): Promise<PortfolioModel> {
    const stockMap: Map<string, StockModel> = new Map<string, StockModel>();
    for (const s of symbols) {
      if (s.trim().length > 0) {
        stockMap.set(s, new StockModel(s));
      }
    }
    return new PortfolioModel(
      (await Portfolio.update(new PortfolioModel(stockMap))).stocks
    );
  }
  public static async getExtended(
    portfolio: PortfolioModel,
    maxIterations = 1
  ): Promise<PortfolioModel> {
    // Crea una copia del objeto portfolio en la variable toAnalyze utilizando el constructor PortfolioModel.
    let toAnalyze = new PortfolioModel(portfolio.stocks);
    // Verifica si el portfolio tiene alguna acción (stocks). Si la cantidad de acciones es mayor que cero, continúa con el análisis. De lo contrario, devuelve el toAnalyze original sin cambios.
    if (portfolio.stocks.size > 0) {
      // Realiza un bucle for que se ejecuta hasta maxIterations veces (por defecto, 2).
      for (let i = 0; i < maxIterations; i++) {
        // Filtra las acciones en toAnalyze.stocks para obtener solo aquellas de tipo ETF (Exchange Traded Fund) y las guarda en la variable etfStocks.
        const etfStocks: StockModel[] = Array.from(
          toAnalyze.stocks.values()
        ).filter((stock) => {
          return stock.type === StockModel.type.ETF;
        });
        // Comprueba si no hay acciones ETF.
        if (etfStocks.length <= 0) {
          // Si es así, establece i en maxIterations para salir del bucle.
          i = maxIterations;
        } else {
          // De lo contrario, continúa con el análisis.
          // Crea un objeto allStocks vacío, que será utilizado para almacenar información sobre todas las acciones no ETF.
          const allStocks: Map<string, { amountUSD: number }> = new Map<
            string,
            { amountUSD: number }
          >();
          // Filtra las acciones en toAnalyze.stocks para obtener solo aquellas que no son de tipo ETF y las guarda en la variable notEtfSymbols.
          const notEtfSymbols: StockModel[] = Array.from(
            toAnalyze.stocks.values()
          ).filter((stock) => {
            return stock.type !== StockModel.type.ETF;
          });
          // Recorre cada acción no ETF en notEtfSymbols y agrega una entrada correspondiente en el objeto allStocks, donde la clave es el símbolo de la acción y el valor es un objeto con la cantidad en USD (amountUSD) calculada multiplicando la cantidad de acciones (quantity) por el precio unitario (unitPriceUSD).
          for (const noEtf of notEtfSymbols) {
            allStocks.set(noEtf.symbol, {
              amountUSD: noEtf.quantity * noEtf.unitPriceUSD
            });
          }
          // Realiza una llamada a un servicio llamado FmpService.etfHolder, pasando los símbolos de las acciones ETF (etfStocks.map((s) => s.symbol)) como argumento. Esto devuelve una lista de información sobre los titulares de los ETF.
          for (const etf of await FmpService.etfHolder(
            etfStocks.map((s) => s.symbol)
          )) {
            // Por cada ETF en la respuesta de FmpService.etfHolder, busca la acción ETF correspondiente en toAnalyze.stocks y la guarda en la variable etfStock.
            const etfStock: StockModel = Array.from(
              toAnalyze.stocks.values()
            ).filter((stock) => {
              return (
                stock.type === StockModel.type.ETF &&
                stock.symbol === etf.symbol
              );
            })[0];
            // Calcula el valor en USD del ETF (amountUSDEtfStock) multiplicando la cantidad de acciones del ETF (etfStock.quantity) por el precio unitario del ETF (etfStock.unitPriceUSD).
            const amountUSDEtfStock: number =
              etfStock.quantity * etfStock.unitPriceUSD;
            // Recorre cada titular (holders) en la lista de titulares del ETF.
            for (const holders of etf.holders) {
              // calcula el porcentaje de peso (weightPercentage) dividiendo holders.weightPercentage por 100.
              const weightPercentage =
                (holders.weightPercentage || 0) === 0
                  ? 0
                  : holders.weightPercentage / 100;
              // Si el porcentaje de peso es mayor que cero, realiza lo siguiente:
              if (weightPercentage > 0) {
                // Obtiene el valor de la acción en allStocks utilizando la clave (holders.asset).
                const value = allStocks.get(holders.asset);
                // Calcula el nuevo valor en USD de la acción sumando el valor actual (value.amountUSD) multiplicado por el porcentaje de peso y el valor en USD del ETF (amountUSDEtfStock).
                const amountUSD =
                  (value ? value.amountUSD : 0) +
                  weightPercentage * amountUSDEtfStock;
                // Actualiza el valor de la acción en allStocks con el nuevo valor y el mapa de fuentes actualizado.
                allStocks.set(holders.asset, {
                  amountUSD: amountUSD
                });
              }
            }
          }
          // Obtiene las claves de todas las acciones en allStocks y las guarda en allStocksKeys.
          const allStocksKeys: string[] = Array.from(allStocks.keys());
          // Crea un nuevo portfolio (resultStocks) llamando a un método estático createBySymbols de la clase Portfolio y pasando las claves de las acciones como argumento. Este método devuelve un nuevo objeto PortfolioModel que contiene solo las acciones cuyas claves se pasaron.
          const resultStocks: Map<string, StockModel> = (
            await Portfolio.createBySymbols(allStocksKeys)
          ).stocks;
          // Recorre cada clave de acción en allStocksKeys.
          for (const stockKey of allStocksKeys) {
            // Obtiene la acción correspondiente en resultStocks utilizando la clave (resultStocks.get(stockKey)). La acción se guarda en la variable stock.
            const stock = resultStocks.get(stockKey);
            if (stock) {
              stock.quantity = 0; // Se establece la cantidad de acciones en cero.
              // Obtiene el valor de la acción en allStocks utilizando la clave (allStocks.get(stockKey)). El valor se guarda en la variable localStock.
              const localStock = allStocks.get(stockKey);
              // Comprueba si localStock existe.
              if (localStock) {
                // Calcula la cantidad de acciones (quantity) dividiendo el valor en USD de localStock por el precio unitario de stock.
                stock.quantity = localStock.amountUSD / stock.unitPriceUSD;
              }
              // Actualiza la acción en resultStocks con la cantidad de acciones actualizada.
              resultStocks.set(stockKey, stock);
            }
          }
          // Asigna el objeto resultStocks a la variable toAnalyze para que sea el nuevo objeto de análisis en la próxima iteración del bucle.
          toAnalyze = new PortfolioModel(resultStocks);
        }
      }
      // Calcula la diferencia en USD entre el valor inicial del portfolio (portfolio.amountUSD) y el valor actualizado del objeto toAnalyze (toAnalyze.amountUSD). La diferencia se guarda en la variable amountUSDDiff.
      const amountUSDDiff = portfolio.amountUSD - toAnalyze.amountUSD;
      // Comprueba si amountUSDDiff es mayor que cero.
      if (amountUSDDiff > 0) {
        // Si es así, crea una nueva acción llamada OTHERS con el valor de amountUSDDiff como precio unitario y tipo desconocido. Luego, agrega esta acción al mapa de acciones de toAnalyze.stocks.
        const temp = toAnalyze.stocks;
        const otherStock = new StockModel('OTHERS');
        otherStock.unitPriceUSD = amountUSDDiff;
        otherStock.type = StockModel.type.UNKNOWN;
        temp.set(otherStock.symbol, otherStock);
        toAnalyze.stocks = temp;
      }
    }
    // Devuelve el objeto toAnalyze como resultado de la función.
    return toAnalyze;
  }
}
