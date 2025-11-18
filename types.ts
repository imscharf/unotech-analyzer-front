export interface AnalysisData {
  coeficiente: number;
  intercepto: number;
  r2: number;
  rmse: number;
  dados: {
    t: number[];
    elapsed: number[];
    predito: number[];
    erro: number[];
    future_t: number[];
    future_pred: number[];
  };
}

export interface ChartDataPoint {
  t: number;
  [key: string]: number;
}