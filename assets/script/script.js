const urlApiFip = 'https://parallelum.com.br/fipe/api/v1'
const selectVehicleBrand = document.querySelector('#brand')
const selectVehicleModel = document.querySelector('#model')
const selectVehicleYear = document.querySelector('#year')
const vehicleTypeClick = document.querySelectorAll('.btn-vehicle')
const divSelectBrand = document.querySelector('.vehicle-brand')
const divSelectModel = document.querySelector('.vehicle-model')
const divSelectYear = document.querySelector('.vehicle-year')
const chooseVehicle = document.querySelector('.choose-vehicle')
const showResult = document.querySelector('.show-result')
const formGroup = document.querySelectorAll('.form-group')
const btnMobile = document.querySelector('.btn-mobile')
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

      async function getSrcImage() {

        try {
          
          if (document.querySelector('.img-container').style.display = 'flex') {
            document.querySelector('.img-container').style.display = 'none'
            formGroup.forEach((form) => {
              form.style.display = 'none';
              // form.style.opacity = 1
            })
          }

          document.querySelector('.loader-wrapper').style.display = 'flex';

          const response = await fetch(`http://localhost:3300/?vehicleBrand=${Marca}&vehicleModel=${Modelo}&vehicleYear=${AnoModelo}`);
          
          const data = await response.text();

          const vehicleImg = document.querySelector('.img-container img');
          vehicleImg.src = data

          document.querySelector('.loader-wrapper').style.display = 'none';

          document.querySelector('.img-container').style.display = 'flex';

        } catch (error) {
          console.error(error)
        }
      }

      document.querySelector('.show-result-img').style.filter = 'blur(10px)';

      getSrcImage().then(() => {
        document.querySelector('.show-result-img').style.display = 'none';
        formGroup.forEach((form) => {
          form.style.display = 'block';
          // form.style.opacity = 1
        })
  
        if (window.innerWidth <= 430) {
  
          chooseVehicle.style.opacity = 0
          chooseVehicle.style.zIndex = -1
  
          showResult.style.zIndex = 1
  
          btnMobile.style.display = 'block'
        }
  
      })
      
    })
    
})

btnMobile.addEventListener('click', () => {

  /**
   * *.show-result: z-index = -1;
   * *.choose-vehicle: z-index = 1 / opacity = 1;
   * *.form-group: opacity = 0;
   * *.divSelectBrand, .divSelectModel, .divSelectYear = visibility = 'hidden'
   * *btnMobile.style.display = 'none'
   */

  setTimeout(() => {
    showResult.style.zIndex = -1;
    chooseVehicle.style.zIndex = 1
    chooseVehicle.style.opacity = 1
    formGroup.forEach((form) => {
      form.style.display = 'none';
      // form.style.opacity = 0
    })
  }, 400)

  const vehicleSelects = document.querySelectorAll('.selects-vehicle')

  vehicleSelects.forEach((vehicleSelect) => {
    const defaultOptionSelect = vehicleSelect.querySelector("option[data-js-type='default-option']");
    
    vehicleSelect.innerHTML = ''

    vehicleSelect.appendChild(defaultOptionSelect)

    defaultOptionSelect.selected = true
  })


  divSelectBrand.style.visibility = 'hidden'
  divSelectModel.style.visibility = 'hidden'
  divSelectYear.style.visibility = 'hidden'

  setTimeout(() => {
    btnMobile.style.display = 'none'
  }, 420)


})