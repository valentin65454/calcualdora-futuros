const assetData = {
    'ES': { 
        name: 'E-mini S&P 500', 
        tickValue: 12.50, 
        microTickValue: 1.25, 
        tickSize: 0.25,
        description: 'Índice de las 500 empresas más grandes de EE.UU.'
    },
    'NQ': { 
        name: 'E-mini NASDAQ', 
        tickValue: 5.00, 
        microTickValue: 0.50, 
        tickSize: 0.25,
        description: 'Índice tecnológico NASDAQ-100'
    },
    'YM': { 
        name: 'E-mini Dow Jones', 
        tickValue: 5.00, 
        microTickValue: 0.50, 
        tickSize: 1,
        description: 'Índice Dow Jones Industrial Average'
    },
    'RTY': { 
        name: 'E-mini Russell 2000', 
        tickValue: 10.00, 
        microTickValue: 1.00, 
        tickSize: 0.1,
        description: 'Índice de empresas de pequeña capitalización'
    },
    'CL': { 
        name: 'Crude Oil', 
        tickValue: 10.00, 
        microTickValue: 1.00, 
        tickSize: 0.01,
        description: 'Petróleo crudo WTI'
    },
    'GC': { 
        name: 'Gold', 
        tickValue: 10.00, 
        microTickValue: 1.00, 
        tickSize: 0.10,
        description: 'Oro futuro'
    },
    'SI': { 
        name: 'Silver', 
        tickValue: 25.00, 
        microTickValue: 2.50, 
        tickSize: 0.005,
        description: 'Plata futuro'
    },
    'NG': { 
        name: 'Natural Gas', 
        tickValue: 10.00, 
        microTickValue: 1.00, 
        tickSize: 0.001,
        description: 'Gas natural'
    },
    'ZN': { 
        name: '10-Year Treasury Note', 
        tickValue: 15.625, 
        microTickValue: 1.5625, 
        tickSize: 0.015625,
        description: 'Bono del Tesoro a 10 años'
    },
    'ZB': { 
        name: '30-Year Treasury Bond', 
        tickValue: 31.25, 
        microTickValue: 3.125, 
        tickSize: 0.03125,
        description: 'Bono del Tesoro a 30 años'
    },
    '6E': { 
        name: 'Euro FX', 
        tickValue: 12.50, 
        microTickValue: 1.25, 
        tickSize: 0.0001,
        description: 'Euro vs Dólar estadounidense'
    },
    '6B': { 
        name: 'British Pound', 
        tickValue: 6.25, 
        microTickValue: 0.625, 
        tickSize: 0.0001,
        description: 'Libra esterlina vs Dólar estadounidense'
    },
    '6J': { 
        name: 'Japanese Yen', 
        tickValue: 12.50, 
        microTickValue: 1.25, 
        tickSize: 0.000001,
        description: 'Yen japonés vs Dólar estadounidense'
    },
    'ZC': { 
        name: 'Corn', 
        tickValue: 12.50, 
        microTickValue: 1.25, 
        tickSize: 0.0025,
        description: 'Maíz futuro'
    },
    'ZS': { 
        name: 'Soybeans', 
        tickValue: 12.50, 
        microTickValue: 1.25, 
        tickSize: 0.0025,
        description: 'Soja futuro'
    },
    'ZW': { 
        name: 'Wheat', 
        tickValue: 12.50, 
        microTickValue: 1.25, 
        tickSize: 0.0025,
        description: 'Trigo futuro'
    }
};

document.getElementById('asset').addEventListener('change', function() {
    updateAssetInfo(this.value);
});

function updateAssetInfo(asset) {
    const infoContainer = document.getElementById('assetInfo');
    
    if (!asset) {
        infoContainer.innerHTML = `
            <div class="info-card">
                <h4>Selecciona un activo</h4>
                <p>Elige un activo de la lista para ver su información detallada</p>
            </div>
        `;
        return;
    }

    const data = assetData[asset];
    infoContainer.innerHTML = `
        <div class="info-card">
            <h4>${data.name} (${asset})</h4>
            <p>${data.description}</p>
        </div>
        <div class="info-card">
            <h4>Valor por Tick</h4>
            <p>Estándar: $${data.tickValue} | Micro: $${data.microTickValue}</p>
        </div>
        <div class="info-card">
            <h4>Tamaño del Tick</h4>
            <p>${data.tickSize}</p>
        </div>
    `;
}

function calculateContracts() {
    const riskAmount = parseFloat(document.getElementById('riskAmount').value);
    const asset = document.getElementById('asset').value;
    const stopLossTicks = parseInt(document.getElementById('stopLossTicks').value);

    if (!riskAmount || !asset || !stopLossTicks) {
        document.getElementById('results').innerHTML = `
            <div class="warning">
                ⚠️ Por favor completa todos los campos
            </div>
        `;
        return;
    }

    const data = assetData[asset];
    const standardRiskPerContract = data.tickValue * stopLossTicks;
    const microRiskPerContract = data.microTickValue * stopLossTicks;

    // Calcular total en microcontratos
    const totalMicroContracts = Math.floor(riskAmount / microRiskPerContract);
    
    // Calcular la combinación optimizada (1 estándar = 10 micros)
    const standardContracts = Math.floor(totalMicroContracts / 10);
    const remainingMicros = totalMicroContracts % 10;

    // Riesgo total usado
    const totalRiskUsed = totalMicroContracts * microRiskPerContract;
    const unusedRisk = riskAmount - totalRiskUsed;

    let resultsHTML = `
        <div class="result-card" style="border-left-color: #e74c3c;">
            <div class="result-label">📊 Total en Microcontratos</div>
            <div class="result-value">${totalMicroContracts} micros</div>
        </div>
        
        <div class="result-card" style="border-left-color: #f39c12;">
            <div class="result-label">🎯 Recomendación Optimizada</div>
            <div class="result-value">${standardContracts} estándar (${remainingMicros})</div>
        </div>
        
        <div class="result-card">
            <div class="result-label">💰 Riesgo por Contrato Estándar</div>
            <div class="result-value">$${standardRiskPerContract.toFixed(2)}</div>
        </div>
        
        <div class="result-card">
            <div class="result-label">💰 Riesgo por Microcontrato</div>
            <div class="result-value">$${microRiskPerContract.toFixed(2)}</div>
        </div>
        
        <div class="result-card">
            <div class="result-label">📊 Riesgo Total Utilizado</div>
            <div class="result-value">$${totalRiskUsed.toFixed(2)}</div>
        </div>
        
        <div class="result-card">
            <div class="result-label">💵 Capital No Utilizado</div>
            <div class="result-value">$${unusedRisk.toFixed(2)}</div>
        </div>
    `;

    // Advertencia si no se pueden usar contratos
    if (totalMicroContracts === 0) {
        resultsHTML += `
            <div class="warning">
                ⚠️ El capital de riesgo es insuficiente para abrir cualquier posición con este stop loss
            </div>
        `;
    }

    document.getElementById('results').innerHTML = resultsHTML;
}

// Inicializar con información por defecto
updateAssetInfo('');