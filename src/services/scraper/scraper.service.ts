import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { chromium, Page, Locator } from 'playwright';

@Injectable()
export class ScraperService {
  private readonly BASE_URLSRI = 'https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente';
  private readonly BASE_URLFJ = 'https://consultas.funcionjudicial.gob.ec/informacionjudicial/public/informacion.jsf';
  private readonly BASE_URLINT = 'https://ws-public.interpol.int/notices/v1';
  private readonly BASE_URLFIS = 'https://www.fiscalia.gob.ec/consulta-de-noticias-del-delito/';

  async obtenerDatosConsultaSRI(ruc: string, tipoConsulta: number) {
    if(tipoConsulta==1){
      try {
      
        // 1. Verificar si el RUC Existe
        const checkResponse = await axios.get(`${this.BASE_URLSRI}/existePorNumeroRuc`, {
          params: { numeroRuc: ruc }
        });
  
        // La API suele devolver true/false o un objeto indicando existencia
        if (!checkResponse.data) {
          throw new Error('El RUC no existe o no se encuentra registrado.');
        }
  
        // 2. Obtener los datos del contribuyente
        const dataResponse = await axios.get(`${this.BASE_URLSRI}/obtenerPorNumerosRuc`, {
          params: { ruc: ruc }
        });
  
        return {
          success: true,
          data: dataResponse.data
        };
  
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || error.message
        };
      }  
    }
    else{
      try {
        const checkResponse = await axios.get(`${this.BASE_URLSRI}/cantidadObtenidaPorRazonSocial`, {
          params: { razonSocial: ruc }
        });
        
        if (checkResponse.data>0) {
          const dataResponse = await axios.get(`${this.BASE_URLSRI}/numerosRucPorRazonSocialToken`, {
            params: { razonSocial: ruc }
          });
        
            const finalResponse = await axios.get(`${this.BASE_URLSRI}/obtenerPorNumerosRuc`, {
              params: { ruc: dataResponse.data },
              paramsSerializer: {
                indexes: null // Esto evita que axios agregue corchetes [] a los parámetros
              }
            });
            return {
              success: true,
              data: finalResponse.data
            };
        }
        return {
          success: false,
          data: []
        };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || error.message
        };
      }
    }
  }

  async buscarProcesoJudicial(
  criterio: string,
  tipoConsulta: number | string,
) {
  const tipo = Number(tipoConsulta);

  const criterioNormalizado =
    (criterio ?? '').trim();

  if (!criterioNormalizado) {
    return {
      success: false,
      encontrado: false,
      resultados: [],
      message:
        'No se recibió un criterio de búsqueda.',
    };
  }

  if (tipo !== 1 && tipo !== 2) {
    return {
      success: false,
      encontrado: false,
      resultados: [],
      message:
        `Tipo de consulta inválido: ${tipoConsulta}`,
    };
  }

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/119.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  page.setDefaultTimeout(45_000);

  await page.addInitScript(() => {
    Object.defineProperty(
      navigator,
      'webdriver',
      {
        get: () => undefined,
      },
    );
  });

  try {
    await page.goto(this.BASE_URLFJ, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });

    const inputCedula = page.locator(
      '#form1\\:txtDemandadoCedula',
    );

    const inputApellido = page.locator(
      '#form1\\:txtDemandadoApellido',
    );

    const botonBuscar = page.locator(
      '#form1\\:butBuscarJuicios',
    );

    const cuerpoTabla = page.locator(
      '#form1\\:dataTableJuicios2_data',
    );

    /*
     * Esperamos que el formulario esté disponible.
     */
    await botonBuscar.waitFor({
      state: 'visible',
      timeout: 45_000,
    });

    /*
     * Se llena el campo correspondiente.
     *
     * tipo 1 = identificación
     * tipo 2 = nombres/apellidos
     */
    if (tipo === 1) {
      await inputCedula.waitFor({
        state: 'visible',
        timeout: 30_000,
      });

      await inputCedula.fill(
        criterioNormalizado,
      );

      console.log(
        'Consulta judicial por identificación:',
        await inputCedula.inputValue(),
      );
    } else {
      await inputApellido.waitFor({
        state: 'visible',
        timeout: 30_000,
      });

      await inputApellido.fill(
        criterioNormalizado.toUpperCase(),
      );

      console.log(
        'Consulta judicial por nombres:',
        await inputApellido.inputValue(),
      );
    }

    /*
     * La tabla normalmente ya existe antes de buscar,
     * aunque inicialmente esté vacía o muestre un mensaje.
     */
    await cuerpoTabla.waitFor({
      state: 'attached',
      timeout: 45_000,
    });

    /*
     * Ejecuta la búsqueda con reintentos.
     */
    const datos =
      await this.ejecutarBusquedaJudicial(
        page,
        botonBuscar,
        cuerpoTabla,
      );

   // await page
     // .screenshot({
       // path:
         // 'debug-funcion-judicial.png',
        //fullPage: true,
      //})
      //.catch(() => undefined);

    console.log(
      'Datos obtenidos de Función Judicial:',
      JSON.stringify(datos, null, 2),
    );

    return {
      success: true,
      encontrado: datos.encontrado,
      resultados: datos.resultados,
      intentos: datos.intentos,
      message:
        datos.encontrado
          ? 'Consulta judicial realizada correctamente.'
          : 'No se encontraron procesos judiciales después de los reintentos.',
    };

  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Error desconocido';

    console.error(
      'Error consultando Función Judicial:',
      message,
    );

    //await page
     // .screenshot({
       // path:
         // 'error-funcion-judicial.png',
        //fullPage: true,
      //})
      //.catch(() => undefined);

    return {
      success: false,
      encontrado: false,
      resultados: [],
      message,
    };

  } finally {
    await context
      .close()
      .catch(() => undefined);

    await browser
      .close()
      .catch(() => undefined);
  }
}

private async ejecutarBusquedaJudicial(
  page: Page,
  botonBuscar: Locator,
  cuerpoTabla: Locator,
): Promise<{
  encontrado: boolean;
  intentos: number;
  resultados: {
    numero: string;
    fecha: string;
    proceso: string;
    accion: string;
    detalle: string;
  }[];
}> {
  const maxIntentos = 2;

  for (
    let intento = 1;
    intento <= maxIntentos;
    intento++
  ) {
    console.log(
      `Función Judicial: intento ${intento} de ${maxIntentos}`,
    );

    /*
     * Guardamos el texto previo para detectar
     * si PrimeFaces actualizó la tabla.
     */
    const contenidoAnterior =
      await cuerpoTabla
        .innerText()
        .catch(() => '');

    await botonBuscar.click({
      timeout: 30_000,
    });

    /*
     * Esperamos que termine la solicitud AJAX
     * utilizada por PrimeFaces.
     */
    await this.esperarAjaxFuncionJudicial(
      page,
    );

    /*
     * Intentamos detectar un cambio en la tabla.
     *
     * Este timeout no cancela toda la consulta:
     * si no detectamos el cambio, igualmente
     * leemos el contenido disponible.
     */
    await page
      .waitForFunction(
        ({
          idTabla,
          contenidoPrevio,
        }) => {
          const tabla =
            document.getElementById(
              idTabla,
            );

          if (!tabla) {
            return false;
          }

          const contenidoActual =
            tabla.textContent
              ?.replace(/\s+/g, ' ')
              .trim() ?? '';

          return (
            contenidoActual !==
            contenidoPrevio
          );
        },
        {
          idTabla:
            'form1:dataTableJuicios2_data',

          contenidoPrevio:
            contenidoAnterior
              .replace(/\s+/g, ' ')
              .trim(),
        },
        {
          timeout: 12_000,
        },
      )
      .catch(() => undefined);

    /*
     * PrimeFaces puede terminar el AJAX antes
     * de completar el renderizado visual.
     */
    await page.waitForTimeout(1_200);

    const resultado =
      await this.leerResultadoJudicial(
        page,
      );

    console.log(
      `Intento ${intento}:`,
      {
        encontrados:
          resultado.resultados.length,
        sinResultados:
          resultado.sinResultados,
        textoTabla:
          resultado.textoTabla,
      },
    );

    if (
      resultado.resultados.length > 0
    ) {
      return {
        encontrado: true,
        intentos: intento,
        resultados:
          resultado.resultados,
      };
    }

    /*
     * No consideramos el mensaje inicial
     * "No se encuentran resultados" como definitivo,
     * porque el portal puede devolver datos
     * en el segundo intento.
     */
    if (intento < maxIntentos) {
      const esperaReintento =
        intento === 1
          ? 3_000
          : 5_000;

      console.warn(
        `Función Judicial no devolvió registros en el intento ${intento}. ` +
        `Se repetirá la consulta en ${esperaReintento / 1000} segundos.`,
      );

      await page.waitForTimeout(
        esperaReintento,
      );
    }
  }

  return {
    encontrado: false,
    intentos: maxIntentos,
    resultados: [],
  };
}

private async esperarAjaxFuncionJudicial(
  page: Page,
): Promise<void> {
  await page
    .waitForFunction(
      () => {
        const ventana =
          window as any;

        const cola =
          ventana.PrimeFaces
            ?.ajax
            ?.Queue;

        /*
         * Si no encontramos la cola AJAX,
         * permitimos continuar y posteriormente
         * revisamos directamente la tabla.
         */
        if (!cola) {
          return true;
        }

        if (
          typeof cola.isEmpty ===
          'function'
        ) {
          return cola.isEmpty();
        }

        if (
          Array.isArray(cola.requests)
        ) {
          return (
            cola.requests.length === 0
          );
        }

        return true;
      },
      null,
      {
        timeout: 25_000,
      },
    )
    .catch((error: unknown) => {
      console.warn(
        'No se pudo confirmar el fin del AJAX judicial:',
        error instanceof Error
          ? error.message
          : error,
      );
    });

  /*
   * Tiempo breve para que se pinte el nuevo tbody.
   */
  await page.waitForTimeout(500);
}

private async leerResultadoJudicial(
  page: Page,
): Promise<{
  sinResultados: boolean;
  textoTabla: string;
  resultados: {
    numero: string;
    fecha: string;
    proceso: string;
    accion: string;
    detalle: string;
  }[];
}> {
  return page.evaluate(() => {
    const tabla =
      document.getElementById(
        'form1:dataTableJuicios2_data',
      );

    if (!tabla) {
      return {
        sinResultados: false,
        textoTabla: '',
        resultados: [],
      };
    }

    const textoTabla =
      tabla.textContent
        ?.replace(/\s+/g, ' ')
        .trim() ?? '';

    const textoNormalizado =
      textoTabla.toLowerCase();

    const sinResultados =
      textoNormalizado.includes(
        'no se encuentran resultados',
      ) ||
      textoNormalizado.includes(
        'no se encontraron resultados',
      ) ||
      textoNormalizado.includes(
        'no existen resultados',
      ) ||
      textoNormalizado.includes(
        'sin resultados',
      );

    const filas = Array.from(
      tabla.querySelectorAll('tr'),
    );

    const resultados = filas
      .map((fila) => {
        const columnas = Array.from(
          fila.querySelectorAll('td'),
        );

        /*
         * Una fila real debe tener las columnas
         * de número, fecha, proceso, acción y detalle.
         *
         * La fila "No se encuentran resultados"
         * suele tener una sola columna.
         */
        if (columnas.length < 3) {
          return null;
        }

        const obtenerTexto = (
          indice: number,
        ): string => {
          return columnas[indice]
            ?.textContent
            ?.replace(/\s+/g, ' ')
            .trim() ?? '';
        };

        return {
          numero:
            obtenerTexto(0),

          fecha:
            obtenerTexto(1),

          proceso:
            obtenerTexto(2),

          accion:
            obtenerTexto(3),

          detalle:
            obtenerTexto(4),
        };
      })
      .filter(
        (
          registro,
        ): registro is {
          numero: string;
          fecha: string;
          proceso: string;
          accion: string;
          detalle: string;
        } => {
          if (!registro) {
            return false;
          }

          /*
           * Evita devolver filas estructurales
           * o vacías.
           */
          return Boolean(
            registro.numero ||
            registro.fecha ||
            registro.proceso ||
            registro.accion ||
            registro.detalle,
          );
        },
      );

    return {
      sinResultados,
      textoTabla,
      resultados,
    };
  });
}

  async buscarEnInterpol(apellido: string, nombre: string, tipoConsulta:number) {
    try {
      if (tipoConsulta==1) {
        return { success: false, message:  [] };
      }
        const response = await axios.get(`${this.BASE_URLINT}/red`, {
            params: { name: apellido, forename: nombre },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'es-ES,es;q=0.9',
                'Referer': 'https://www.interpol.int/',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'Connection': 'keep-alive'
            },
            timeout: 10000 
        });

        return { success: true, ...response.data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

//TIENE CAPTCHA
  async buscarDenunciasFiscalia(nombres: string) {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
  
    try {
      await page.goto(this.BASE_URLFIS);
  
      // 1. Llenar los campos de búsqueda (ajusta los selectores según el formulario)
      await page.fill('#txt_nombres', nombres); // Reemplaza con el ID real del input
      
      // 2. Clic en el botón buscar
      await page.click('#btn_buscar'); // Reemplaza con el ID real del botón
  
      // 3. Esperar a que el contenido se renderice
      // Esperamos a que el div con clase 'general' aparezca
      await page.waitForSelector('.general', { timeout: 15000 });
  
      // 4. Captura de la sección de resultados
      // Capturamos el primer contenedor que envuelve las tablas
      const resultadosContainer = await page.$('.general');
      
      if (resultadosContainer) {
        const fileName = `capturas/fiscalia-${nombres}-${Date.now()}.png`;
        await resultadosContainer.screenshot({ path: fileName });
        return { success: true, captura: fileName };
      }
  
      return { success: false, message: 'No se encontraron tablas de resultados' };
  
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      await browser.close();
    }
  }
}