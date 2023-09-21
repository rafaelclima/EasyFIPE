const urlApiFip = 'https://parallelum.com.br/fipe/api/v1'
const selectVehicleBrand = document.querySelector('#brand')
const selectVehicleModel = document.querySelector('#model')
const selectVehicleYear = document.querySelector('#year')
const vehicleTypeClick = document.querySelectorAll('.btn-vehicle')
const divSelectBrand = document.querySelector('.vehicle-brand')
const divSelectModel = document.querySelector('.vehicle-model')
const divSelectYear = document.querySelector('.vehicle-year')
let vehicleType

async function fipModel(vehicleType) {
  const url = await fetch (urlApiFip + `/${vehicleType}/marcas`)
  const response = await url.json()

  return response
}

async function fipBrand(vehicleType , id) {
  const url = await fetch (urlApiFip + `/${vehicleType}/marcas/${id}/modelos`)
  const response = await url.json()

  return response
}


async function fipYear(vehicleType , id, model) {
  const url = await fetch (urlApiFip + `/${vehicleType}/marcas/${id}/modelos/${model}/anos`)
  const response = await url.json()

  return response
}

async function fipValue(vehicleType , id, model, year) {
  const url = await fetch (urlApiFip + `/${vehicleType}/marcas/${id}/modelos/${model}/anos/${year}`)
  const response = await url.json()

  return response
}

vehicleTypeClick.forEach(item => {
  item.addEventListener('click', function() {
    vehicleType = item.dataset.jsType
    if (divSelectBrand.style.visibility === 'visible') {

      selectVehicleBrand.innerHTML = ''

      const defaultOption = document.createElement("option")
      defaultOption.value = ''
      defaultOption.textContent = 'Qual a marca do veículo?'
      defaultOption.selected = true
      defaultOption.disabled = true
      selectVehicleBrand.appendChild(defaultOption)

      divSelectBrand.style.visibility = 'hidden'
    }

    fipModel(item.dataset.jsType).then(vehicleBrand => {
      vehicleBrand.forEach((brands) => {

        const { codigo, nome } = brands
        
        const fipOption = document.createElement("option");
        fipOption.value = `${codigo}`;
        fipOption.textContent = `${nome}`;
        selectVehicleBrand.appendChild(fipOption);

      })
    }).then(() => {
      divSelectBrand.style.visibility = 'visible'
    })

  })
})


selectVehicleBrand.addEventListener('change', function() {
  
  const vehicleId = selectVehicleBrand.value

  fipBrand(vehicleType, vehicleId).then(models => {

    if (divSelectModel.style.visibility === 'visible') {
      selectVehicleModel.innerHTML = ''

      const defaultOption = document.createElement("option")
      defaultOption.value = ''
      defaultOption.textContent = 'Qual o modelo do veículo?'
      defaultOption.selected = true
      defaultOption.disabled = true
      selectVehicleModel.appendChild(defaultOption)

      divSelectModel.style.visibility = 'hidden'
    }

    const { modelos, anos } = models
    
    modelos.forEach(model => {
      const { codigo, nome } = model
      const fipOption = document.createElement("option");
      
      fipOption.value = `${codigo}`;
      fipOption.textContent = `${nome}`;
      
      selectVehicleModel.appendChild(fipOption);

      
    })
  }).then(() => {
    divSelectModel.style.visibility = 'visible'
  })
    
})

selectVehicleModel.addEventListener('change', function() {
  
  const vehicleId = selectVehicleBrand.value
  const vehicleModel = selectVehicleModel.value
  
  fipYear(vehicleType, vehicleId, vehicleModel).then(models => {

    if (divSelectYear.style.visibility === 'visible') {
      selectVehicleYear.innerHTML = ''

      const defaultOption = document.createElement("option")
      defaultOption.value = ''
      defaultOption.textContent = 'Qual o ano do veículo?'
      defaultOption.selected = true
      defaultOption.disabled = true
      selectVehicleYear.appendChild(defaultOption)

      divSelectYear.style.visibility = 'hidden'
    }

    models.forEach(year => {
      const { codigo, nome } = year

      const fipOption = document.createElement("option")
      fipOption.value = `${codigo}`
      fipOption.textContent = `${nome}`

      selectVehicleYear.appendChild(fipOption)
    })

  }).then(() => {
    divSelectYear.style.visibility = 'visible'
  })

})

selectVehicleYear.addEventListener('change', function() {
  
  const vehicleId = selectVehicleBrand.value
  const vehicleModel = selectVehicleModel.value
  const vehicleYear = selectVehicleYear.value
  
  fipValue(vehicleType, vehicleId, vehicleModel, vehicleYear)
    .then(amountValue => {

      const { TipoVeiculo, Valor, Marca, Modelo, AnoModelo, Combustivel, CodigoFipe, MesReferencia, SiglaCombustivel } = amountValue
      
      const inputValor = document.querySelector('#valor')
      const inputAno = document.querySelector('#ano')
      const inputMarca = document.querySelector('#marca')
      const inputModelo = document.querySelector('#modelo')
      const inputCombustivel = document.querySelector('#tipoDeCombustivel')

      inputValor.value = Valor
      inputAno.value = AnoModelo
      inputMarca.value = Marca
      inputModelo.value = Modelo
      inputCombustivel.value = Combustivel

    }).then(() => {
      const formGroup = document.querySelectorAll('.form-group')
      const resultImg = document.querySelector('.show-result-img')

      resultImg.style.opacity = 0

      formGroup.forEach((form) => {
        form.style.opacity = 1
      })
    })

})