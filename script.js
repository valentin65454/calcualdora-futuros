// Configuración de activos TopStep
const assets = {
    'ES': {
        name: 'E-mini S&P 500',
        tickValue: 12.50,
        tickSize: 0.25,
        standardMultiplier: 50,
        microMultiplier: 5,
        pointsToTicks: 4,
        symbol: 'ES/MES'
    },
    'NQ': {
        name: 'E-mini NASDAQ',
        tickValue: 5.00,
        tickSize: 0.25,
        standardMultiplier: 20,
        microMultiplier: 2,
        pointsToTicks: 4,
        symbol: 'NQ/MNQ'
    },
    'YM': {
        name: 'E-mini Dow Jones',
        tickValue: 5.00,
        tickSize: 1,
        standardMultiplier: 5,
        microMultiplier: 0.5,
        pointsToTicks: 1,
        symbol: 'YM/MYM'
    },
    'RTY': {
        name: 'E-mini Russell 2000',
        tickValue: 5.00,
        tickSize: 0.10,
        standardMultiplier: 50,
        microMultiplier: 5,
        pointsToTicks: 10,
        symbol: 'RTY/M2K'
    },
    'CL': {
        name: 'Crude Oil',
        tickValue: 10.00,
        tickSize: 0.01,
        standardMultiplier: 1000,
        microMultiplier: 100,
        pointsToTicks: 100,
        symbol: 'CL/MCL'
    },
    'GC': {
        name: 'Gold',
        tickValue: 10.00,
        tickSize: 0.10,
        standardMultiplier: 100,
        microMultiplier: 10,
        pointsToTicks: 10,
        symbol: 'GC/MGC'
    },
    'SI': {
        name: 'Silver',
        tickValue: 25.00,
        tickSize: 0.005,
        standardMultiplier: 5000,
        microMultiplier: 1000,
        pointsToTicks: 200,
        symbol: 'SI/SIL'
    },
    'ZB': {
        name: '30-Year Bond',
        tickValue: 31.25,
        tickSize: 0.03125,
        standardMultiplier: 1000,
        microMultiplier: 100,
        pointsToTicks: 32,
        symbol: 'ZB/UB'
    },
    'ZN': {
        name: '10-Year Note',
        tickValue: 15.625,
        tickSize: 0.015625,
        standardMultiplier: 1000,
        microMultiplier: 100,
        pointsToTicks: 64,
        symbol: 'ZN/TN'
    },
    'ZF': {
        name: '5-Year Note',
        tickValue: 7.8125,
        tickSize: 0.0078125,
        standardMultiplier: 1000,
        microMultiplier: 100,
        pointsToTicks: 128,
        symbol: 'ZF/F5'
    },
    'ZS': {
        name: 'Soybeans',
        tickValue: 12.50,
        tickSize: 0.25,
        standardMultiplier: 5000,
        microMultiplier: 1000,
        pointsToTicks: 4,
        symbol: 'ZS/XK'
    },
    'ZC': {
        name: 'Corn',
        tickValue: 12.50,
        tickSize: 0.25,
        standardMultiplier: 5000,
        microMultiplier: 1000,
        pointsToTicks: 4,
        symbol: 'ZC/XC'
    },
    'ZW': {
        name: 'Wheat',
        tickValue: 12.50,
        tickSize: 0.25,
        standardMultiplier: 5000,
        microMultiplier: 1000,
        pointsToTicks: 4,
        symbol: 'ZW/XW'
    },
    '6E': {
        name: 'Euro',
        tickValue: 12.50,
        tickSize: 0.00005,
        standardMultiplier: 125000,
        microMultiplier: 12500,
        pointsToTicks: 10000,
        symbol: '6E/E7'
    },
    '6B': {
        name: 'British Pound',
        tickValue: 6.25,
        tickSize: 0.0001,
        standardMultiplier: 62500,
        microMultiplier: 6250,
        pointsToTicks: 10000,
        symbol: '6B/M6B'
    },
    '6J': {
        name: 'Japanese Yen',
        tickValue: 12.50,
        tickSize: 0.000001,
        standardMultiplier: 12500000,
        microMultiplier: 1250000,
        pointsToTicks: 1000000,
        symbol: '6J/J7'
    }
};

// Variables globales
let selectedAsset = 'ES';
let slType = 'ticks';

// Elementos del DOM
const assetSelect = document.getElementById('asset-select');
const riskAmountInput = document.getElementById('risk-amount');
const slValueInput = document.getElementById('sl-value');
const ticksBtn = document.getElementById('ticks-btn');
const pointsBtn = document.getElementById('points-btn');
const resultsContent = document.getElementById('results-content');

// Elementos de información del activo
const tickValueSpan = document.getElementById('tick-value');
const tickSizeSpan = document.getElementById('tick-size');
const pointsToTicksSpan = document.getElementById('points-to-ticks');
const symbolSpan = document.getElementById('symbol');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeAssetSelect();
    updateAssetInfo();
    attachEventListeners();
});

// Poblar el selector de activos
function initializeAssetSelect() {
    Object.entries(assets).forEach(([key, asset]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${asset.symbol} - ${asset.name}`;
        assetSelect.appendChild(option);
    });
    assetSelect.value = selectedAsset;
}

// Actualizar información del activo
function updateAssetInfo() {
    const asset = assets[selectedAsset];
    tickValueSpan.textContent = `$${asset.tickValue}`;
    tickSizeSpan.textContent = asset.tickSize;
    pointsToTicksSpan.textContent = asset.pointsToTicks;
    symbolSpan.textContent = asset.symbol;
}

// Adjuntar event listeners
function attachEventListeners() {
    assetSelect.addEventListener('change', function() {
        selectedAsset = this.value;
        updateAssetInfo();
        updateSlInputPlaceholder();
        calculate();
    });

    riskAmountInput.addEventListener('input', calculate);
    slValueInput.addEventListener('input', calculate);

    ticksBtn.addEventListener('click', function() {
        setSlType('ticks');
    });

    pointsBtn.addEventListener('click', function() {
        setSlType('points');
    });
}

// Cambiar tipo de stop loss
function setSlType(type) {
    slType = type;
    
    // Actualizar botones
    if (type === 'ticks') {
        ticksBtn.classList.add('active');
        pointsBtn.classList.remove('active');
    } else {
        pointsBtn.classList.add('active');
        ticksBtn.classList.remove('active');
    }
    
    updateSlInputPlaceholder();
    calculate();
}

// Actualizar placeholder del input de SL
function updateSlInputPlaceholder() {
    if (slType === 'ticks') {
        slValueInput.placeholder = 'Ej: 10';
        slValueInput.step = '1';
    } else {
        slValueInput.placeholder = 'Ej: 2.5';
        slValueInput.step = '0.1';
    }
}

// Función principal de cálculo
function calculate() {
    const riskAmount = parseFloat(riskAmountInput.value);
    const slValue = parseFloat(slValueInput.value);

    if (!riskAmount || !slValue || !selectedAsset) {
        showNoResults();
        return;
    }

    const asset = assets[selectedAsset];
    let slTicks = slValue;

    // Convertir puntos a ticks si es necesario
    if (slType === 'points') {
        slTicks = slValue * asset.pointsToTicks;
    }

    // Calcular valor del riesgo por tick
    const riskPerTick = asset.tickValue;
    
    // Calcular contratos estándar
    const standardContracts = Math.floor(riskAmount / (slTicks * riskPerTick));
    const standardRisk = standardContracts * slTicks * riskPerTick;
    
    // Calcular contratos micro
    const microRatio = asset.microMultiplier / asset.standardMultiplier;
    const microTickValue = asset.tickValue * microRatio;
    const microContracts = Math.floor(riskAmount / (slTicks * microTickValue));
    const microRisk = microContracts * slTicks * microTickValue;

    const results = {
        asset: asset,
        slTicks: slTicks,
        slPoints: slTicks / asset.pointsToTicks,
        riskAmount: riskAmount,
        standard: {
            contracts: standardContracts,
            risk: standardRisk,
            remaining: riskAmount - standardRisk
        },
        micro: {
            contracts: microContracts,
            risk: microRisk,
            remaining: riskAmount - microRisk
        }
    };

    displayResults(results);
}

// Mostrar mensaje de no resultados
function showNoResults() {
    resultsContent.innerHTML = `
        <div class="no-results">
            <svg class="calculator-icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="2" width="16" height="20" rx="2"/>
                <line x1="8" y1="6" x2="16" y2="6"/>
                <line x1="8" y1="10" x2="16" y2="10"/>
                <line x1="8" y1="14" x2="16" y2="14"/>
                <line x1="8" y1="18" x2="16" y2="18"/>
            </svg>
            <p>Ingresa los datos para ver los resultados</p>
        </div>
    `;
}

// Mostrar resultados
function displayResults(results) {
    resultsContent.innerHTML = `
        <div class="results-container">
            <!-- Resumen -->
            <div class="summary-card">
                <h3>Resumen</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span>Activo:</span>
                        <p>${results.asset.name}</p>
                    </div>
                    <div class="summary-item">
                        <span>Riesgo Total:</span>
                        <p>$${results.riskAmount}</p>
                    </div>
                    <div class="summary-item">
                        <span>SL (Ticks):</span>
                        <p>${results.slTicks}</p>
                    </div>
                    <div class="summary-item">
                        <span>SL (Puntos):</span>
                        <p>${results.slPoints.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <!-- Contratos Estándar -->
            <div class="contracts-card standard">
                <h3>📈 Contratos Estándar</h3>
                <div class="contracts-grid">
                    <div class="contracts-item">
                        <span>Contratos:</span>
                        <p class="contracts-number green">${results.standard.contracts}</p>
                    </div>
                    <div class="contracts-item">
                        <span>Riesgo Real:</span>
                        <p class="contracts-risk">$${results.standard.risk.toFixed(2)}</p>
                    </div>
                </div>
                ${results.standard.remaining > 0 ? 
                    `<p class="remaining">Sobrante: $${results.standard.remaining.toFixed(2)}</p>` : 
                    ''
                }
            </div>

            <!-- Contratos Micro -->
            <div class="contracts-card micro">
                <h3>📊 Contratos Micro</h3>
                <div class="contracts-grid">
                    <div class="contracts-item">
                        <span>Contratos:</span>
                        <p class="contracts-number blue">${results.micro.contracts}</p>
                    </div>
                    <div class="contracts-item">
                        <span>Riesgo Real:</span>
                        <p class="contracts-risk">${results.micro.risk.toFixed(2)}</p>
                    </div>
                </div>
                ${results.micro.remaining > 0 ? 
                    `<p class="remaining">Sobrante: ${results.micro.remaining.toFixed(2)}</p>` : 
                    ''
                }
            </div>

            <!-- Recomendación -->
            <div class="recommendation-card">
                <h3>💡 Recomendación</h3>
                <p>
                    ${results.standard.contracts > 0 
                        ? `Usa ${results.standard.contracts} contratos estándar para optimizar tu capital.`
                        : `Tu riesgo es muy pequeño para contratos estándar. Considera usar ${results.micro.contracts} contratos micro.`
                    }
                </p>
            </div>
        </div>
    `;
}
