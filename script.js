document.addEventListener('DOMContentLoaded', () => {

  const btnContrast = document.getElementById('btn-contrast');
  const btnFontInc = document.getElementById('btn-font-inc');
  const btnFontDec = document.getElementById('btn-font-dec');
  let currentFontSize = 16;

  btnContrast.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });

  btnFontInc.addEventListener('click', () => {
    if (currentFontSize < 22) {
      currentFontSize += 1;
      document.documentElement.style.fontSize = `${currentFontSize}px`;
    }
  });

  btnFontDec.addEventListener('click', () => {
    if (currentFontSize > 13) {
      currentFontSize -= 1;
      document.documentElement.style.fontSize = `${currentFontSize}px`;
    }
  });


  const selectColor = document.getElementById('material-color');
  const selectReflector = document.getElementById('reflector-type');
  const inputSun = document.getElementById('solar-intensity');
  const sunValDisplay = document.getElementById('sun-val');

  const plateVisual = document.getElementById('plate-visual');
  const metricEff = document.getElementById('metric-eff');
  const metricTemp = document.getElementById('metric-temp');

  function calculateThermalEfficiency() {
    const absorptivity = parseFloat(selectColor.value);
    const concentration = parseFloat(selectReflector.value);
    const sunPower = parseFloat(inputSun.value);

    sunValDisplay.textContent = sunPower;

    const selectedOption = selectColor.options[selectColor.selectedIndex];
    const hexColor = selectedOption.getAttribute('data-color');
    plateVisual.style.backgroundColor = hexColor;

    plateVisual.style.color = (absorptivity > 0.5 && hexColor !== '#2b5278') ? '#ffffff' : '#000000';

    let efficiency = (absorptivity * concentration * 0.82) * 100;
    if (efficiency > 98) efficiency = 98; // Limite físico plausível

    const baseTemp = 18;
    const tempGain = (sunPower / 100) * (efficiency / 100) * 1.8;
    const finalTemp = baseTemp + tempGain;

    metricEff.textContent = `${efficiency.toFixed(1)}%`;
    metricTemp.textContent = `${finalTemp.toFixed(1)}°C`;
  }

  selectColor.addEventListener('change', calculateThermalEfficiency);
  selectReflector.addEventListener('change', calculateThermalEfficiency);
  inputSun.addEventListener('input', calculateThermalEfficiency);

  calculateThermalEfficiency();


  const sensorPlate = document.getElementById('sensor-plate');
  const sensorPool = document.getElementById('sensor-pool');
  const logicOutput = document.getElementById('logic-output');
  const actuatorStatus = document.getElementById('actuator-status');
  const actuatorReason = document.getElementById('actuator-reason');

  function updateRoboticLogic() {
    const tPlate = parseFloat(sensorPlate.value) || 0;
    const tPool = parseFloat(sensorPool.value) || 0;
    const deltaT = tPlate - tPool;

    if (deltaT >= 5) {
      logicOutput.className = 'logic-output status-on';
      actuatorStatus.textContent = 'Atuador: BOMBA LIGADA (Circulando)';
      actuatorReason.textContent = `Diferencial térmico ideal (ΔT = ${deltaT.toFixed(1)}°C). A água está absorvendo calor das placas!`;
    } else if (deltaT < 0) {
      logicOutput.className = 'logic-output status-off';
      actuatorStatus.textContent = 'Atuador: DESLIGADO (Válvula Fechada)';
      actuatorReason.textContent = `A placa está mais fria que a piscina (${deltaT.toFixed(1)}°C). Circulação bloqueada para evitar resfriamento.`;
    } else {
      logicOutput.className = 'logic-output status-off';
      actuatorStatus.textContent = 'Atuador: DESLIGADO (Aguardando)';
      actuatorReason.textContent = `Diferencial térmico insuficiente (ΔT = ${deltaT.toFixed(1)}°C). Mínimo exigido para acionamento: 5.0°C.`;
    }
  }

  sensorPlate.addEventListener('input', updateRoboticLogic);
  sensorPool.addEventListener('input', updateRoboticLogic);

  updateRoboticLogic();
});

