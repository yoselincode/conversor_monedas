const inputMonto = document.getElementById("monto");
const selectMoneda = document.getElementById("moneda");
const botonConvertir = document.getElementById("convertir");
const resultado = document.getElementById("resultado");
const contextoGrafico = document.getElementById("grafico").getContext("2d");

let myGrafico = null;
obtenerMonedas();
async function obtenerMonedas() {
  const apiUrl = `https://mindicador.cl/api`;
  try {
    const respuesta = await fetch(apiUrl);
    if (!respuesta.ok) {
      throw new Error("Error al obtener las monedas");
    }
    const datos = await respuesta.json();
    const monedas = [datos.dolar, datos.euro];

    const selectMonedas = document.getElementById("moneda");

    for (const key in monedas) {
      const option = document.createElement("option");
      option.text = monedas[key].codigo;
      option.value = monedas[key].valor;
      selectMonedas.append(option);
    }

    return datos;
  } catch (error) {
    console.error(
      "No se han obtenidos los datos del api obtenerMonedas",
      error
    );
    return [];
  }
}

async function obtenerDatos(moneda) {
  const apiUrl = `https://mindicador.cl/api/${moneda}`;
  try {
    const respuesta = await fetch(apiUrl);
    if (!respuesta.ok) {
      throw new Error("Error al obtener los datos");
    }
    return await respuesta.json();
  } catch (error) {
    console.error("No se han obtenidos los datos del api obtenerDatos", error);
    return [];
  }
}

async function convertirMoneda() {
  const monto = parseFloat(inputMonto.value);
  const moneda = selectMoneda.value;
  const codigoMoneda = selectMoneda[selectMoneda.selectedIndex].text;
  console.log(codigoMoneda);

  if (moneda === "seleccione_moneda") {
    resultado.textContent = "Seleccione una moneda";
    return;
  }
  if (isNaN(monto) || monto <= 0) {
    resultado.textContent = "Ingrese un monto válido";
    return;
  }

  const respuestaApi = await obtenerDatos(codigoMoneda);
  resultado.textContent = `Resultado: $${(monto / moneda).toFixed(2)}`;
  mostrarGrafico(respuestaApi);
}

function mostrarGrafico(datosGrafico) {
  const valores = datosGrafico.serie.slice(0, 10).reverse();
  const labels = valores.map((item) =>
    new Date(item.fecha).toLocaleDateString()
  );
  const precios = valores.map((item) => item.valor);

  if (myGrafico) {
    myGrafico.destroy();
  }

  myGrafico = new Chart(contextoGrafico, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Historial ultimos 10 dias",
          data: precios,
          borderColor: "blue",
          borderWidth: 1,
        },
      ],
    },
  });
}

botonConvertir.addEventListener("click", convertirMoneda);
