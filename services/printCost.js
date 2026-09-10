const DEFAULT_PRINTER_COST_SETTINGS = Object.freeze({
  printerPurchasePrice: 850,
  expectedPrinterLifetimeHours: 5000,
  expectedMaintenanceCost: 500,
  averagePrinterPowerWatts: 120,
  electricityPricePerKwh: 0.18,
  minimumSuccessRate: 0.1,
  currency: 'SAR'
});

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function nonNegativeNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function normalizeSettings(value = {}) {
  return {
    printerPurchasePrice: nonNegativeNumber(value.printerPurchasePrice, DEFAULT_PRINTER_COST_SETTINGS.printerPurchasePrice),
    expectedPrinterLifetimeHours: positiveNumber(value.expectedPrinterLifetimeHours, DEFAULT_PRINTER_COST_SETTINGS.expectedPrinterLifetimeHours),
    expectedMaintenanceCost: nonNegativeNumber(value.expectedMaintenanceCost, DEFAULT_PRINTER_COST_SETTINGS.expectedMaintenanceCost),
    averagePrinterPowerWatts: nonNegativeNumber(value.averagePrinterPowerWatts, DEFAULT_PRINTER_COST_SETTINGS.averagePrinterPowerWatts),
    electricityPricePerKwh: nonNegativeNumber(value.electricityPricePerKwh, DEFAULT_PRINTER_COST_SETTINGS.electricityPricePerKwh),
    minimumSuccessRate: Math.min(1, positiveNumber(value.minimumSuccessRate, DEFAULT_PRINTER_COST_SETTINGS.minimumSuccessRate)),
    currency: typeof value.currency === 'string' && value.currency.trim() ? value.currency.trim().slice(0, 8) : DEFAULT_PRINTER_COST_SETTINGS.currency
  };
}

/**
 * Calculates monetary values only. Data access and UI formatting deliberately
 * stay outside this service so every caller uses the same formula.
 */
function calculatePrintCost({ gramsUsed, durationMinutes, filament, ownerSuccessRate, globalSuccessRate, result, settings }) {
  const config = normalizeSettings(settings);
  const missing = [];
  const grams = nonNegativeNumber(gramsUsed, 0);
  const minutes = nonNegativeNumber(durationMinutes, 0);
  const durationHours = minutes / 60;
  const filamentPrice = Number(filament?.priceSar);
  const filamentWeight = Number(filament?.totalGrams);

  let filamentCost = null;
  if (!Number.isFinite(filamentPrice) || filamentPrice < 0) missing.push('filamentPrice');
  else if (!Number.isFinite(filamentWeight) || filamentWeight <= 0) missing.push('filamentWeight');
  else filamentCost = grams * (filamentPrice / filamentWeight);

  const machineCostPerHour = (config.printerPurchasePrice + config.expectedMaintenanceCost) / config.expectedPrinterLifetimeHours;
  const machineCost = durationHours * machineCostPerHour;
  const electricityCost = (config.averagePrinterPowerWatts / 1000) * durationHours * config.electricityPricePerKwh;
  const baseCost = filamentCost === null ? null : filamentCost + machineCost + electricityCost;
  const rawSuccessRate = Number.isFinite(Number(ownerSuccessRate)) ? Number(ownerSuccessRate) :
    (Number.isFinite(Number(globalSuccessRate)) ? Number(globalSuccessRate) : 1);
  const successRateUsed = Math.max(config.minimumSuccessRate, Math.min(1, rawSuccessRate));
  const adjusted = result === 'Completed' && baseCost !== null ? baseCost / successRateUsed : baseCost;
  const failureRiskCost = result === 'Completed' && baseCost !== null ? adjusted - baseCost : 0;

  return {
    currency: config.currency,
    gramsUsed: grams,
    durationMinutes: minutes,
    durationHours,
    filamentCost,
    machineCost,
    electricityCost,
    baseCost,
    failureRiskCost,
    totalCost: adjusted,
    successRateUsed,
    ownerSuccessRate: Number.isFinite(Number(ownerSuccessRate)) ? Number(ownerSuccessRate) : null,
    globalSuccessRate: Number.isFinite(Number(globalSuccessRate)) ? Number(globalSuccessRate) : null,
    usedGlobalSuccessRate: !Number.isFinite(Number(ownerSuccessRate)) && Number.isFinite(Number(globalSuccessRate)),
    missing,
    isComplete: missing.length === 0
  };
}

module.exports = { DEFAULT_PRINTER_COST_SETTINGS, normalizeSettings, calculatePrintCost };
