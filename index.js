// @ts-check
const { chromium } = require('playwright')

const shops = [
  {
    vendor: 'Amazon',
    hasSchema: false,
    url: 'https://www.amazon.es/dp/B08H93ZRLL/ref=cm_sw_r_cp_apa_glt_i_91H0Z62WVDRT6FMW033Z?tag=eol00-21',
    checkStock: async ({ page }) => {
      const addToCartButton = await page.$$('#add-to-cart-button')
      return addToCartButton.length > 0
    }
  },
  {
    vendor: 'Microsoft',
    hasSchema: false,
    url: 'https://www.xbox.com/es-es/configure/8WJ714N3RBTL',
    checkStock: async ({ page }) => {
      const content = await page.textContent('[aria-label="Finalizar la compra del pack"]')
      return content.includes('Sin existencias') === false
    }
  },
  {
    vendor: 'Fnac',
    hasSchema: true,
    url: 'https://www.fnac.es/Consola-Xbox-Series-X-1TB-Negro-Videoconsola-Consola/a7732201',
    checkStock: async ({ page }) => {
      const notAvailableIcon = await page.$$('.f-buyBox-availabilityStatus-unavailable')
      return notAvailableIcon.length === 0
    }
  },
  {
    vendor: 'Corte Ingles',
    hasSchema: false,
    url: 'https://www.elcorteingles.es/videojuegos/A37047078',
    checkStock: async ({ page }) => {
      const content = await page.textContent('#js_add_to_cart_desktop')
      return content.includes('Agotado temporalmente') === false
    }
  }
  // disabled for now because it0s not working properly
  // {
  // vendor: 'MediaMarkt',
  // hasSchema: true,
  // url: 'https://www.mediamarkt.es/es/product/_consola-microsoft-xbox-series-x-1-tb-ssd-negro-1487615.html',
  // checkStock: async ({ page }) => {
  // const content = await page.textContent('StyledInfoTypo-sc-1jga2g7-0.jlGGjh')
  // return content.includes('Este artículo no está disponible actualmente.') === false
  // }
  // }
]

  ; (async () => {
    const browser = await chromium.launch({ headless: false })


    for (const shop of shops) {
      const { checkStock, vendor, url } = shop
      const page = await browser.newPage()
      await page.goto(url)

      const hasStock = await checkStock({ page })
      console.log(`${vendor}: ${hasStock ? 'HAS STOCK!!!!' : 'Out Of Stock'}`)
      await page.screenshot({ path: `screenshots/${vendor}.png` })
      await page.close()
    }

    await browser.close()
  })()
