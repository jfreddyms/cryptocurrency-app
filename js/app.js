const criptomonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

//en este obejto metemos los valores del los select
const objetoBusqueda = {
    criptomoneda : '',
    moneda : ''
};

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    monedaSelect.addEventListener('change', leerValor);

    criptomonedaSelect.addEventListener('change', leerValor);

    formulario.addEventListener('submit', validarFomulario)
});

const obtenerCriptomonedas = criptomonedas => new Promise( reolve => reolve(criptomonedas));

function consultarCriptomonedas() {
    
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}; 

function selectCriptomonedas(criptomonedas) {

    criptomonedas.forEach(cripto => {
        // console.log(cripto)

        const {FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptomonedaSelect.appendChild(option)
    });
};

function leerValor(e) {
    objetoBusqueda[e.target.name] = e.target.value;

    // console.log(objetoBusqueda) 
};

function validarFomulario(e) {
    e.preventDefault();

    const { moneda, criptomoneda} = objetoBusqueda;

    if (moneda ==='' || criptomoneda==='') {
        imprimirAlerta('Please fill all required fields')
        return;
    };

    //consultar la API
    consultarAPI();
     //spinner
};

function imprimirAlerta(msj) {

    const existe = document.querySelector('.error');

    if (!existe) {

        const msjDiv = document.createElement('DIV');
        msjDiv.textContent= msj;
        msjDiv.classList.add('error');

        formulario.appendChild(msjDiv);

        setTimeout(() => {
            msjDiv.remove();
        }, 3000);
    };    
};

function consultarAPI() {

    const {moneda, criptomoneda} = objetoBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    //muestra un spinner antes dd hacer la consulta
    spinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            imprimirCriptomonedaHTML(cotizacion.DISPLAY[criptomoneda][moneda])
        })
};

function imprimirCriptomonedaHTML(cotizacion) {
    // console.log(cotizacion)
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)   
    }

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const parrafoPrice = document.createElement('p');
    parrafoPrice.classList.add('precio');
    parrafoPrice.innerHTML = ` The Price is : <span> ${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = ` The Highest Price of The Day is : <span> ${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = ` The Lowest Price of The Day is : <span> ${LOWDAY}</span>`;

    const ultimaHoras = document.createElement('p');
    ultimaHoras.innerHTML = ` Variation last 24 hours: <span> ${CHANGEPCT24HOUR}</span>`;

    const ultimaActualizacion= document.createElement('p');
    ultimaActualizacion.innerHTML = `Last update: <span> ${LASTUPDATE}</span>`;

    resultado.appendChild(parrafoPrice);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimaHoras);
    resultado.appendChild(ultimaActualizacion);
};

function spinner() {

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)   
    };

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `

        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
};