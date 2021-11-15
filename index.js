// @ts-check
const { chromium } = require('playwright')

const price = 710

const shops = [
  {
    vendor: 'Plaza Vea',
    hasSchema: false,
    url: 'https://www.plazavea.com.pe/monitor-teros-te-3173n-27--ips-curvo-144-hz-1920x1080-fhd-hdmi---displayport-freesync-100104831/p',
    checkStock: async ({ page }) => {
      const containerHandle = await page.$('.ProductCard__price--online > .ProductCard__content__price > .ProductCard__price__integer')
      const innerHTML = await page.evaluate(([body]) => body.innerHTML, [containerHandle])
      return innerHTML
    }
  },
  {
    vendor: 'Login store',
    hasSchema: false,
    url: 'https://www.loginstore.com/monitor-teros-te-3173n-27-ips-curvo-144-hz-1920x1080-fhd-hdmi-displayport-freesync',
    checkStock: async ({ page }) => {
      const containerHandle = await page.$('#product-price-34699')
      const innerHTML = await page.evaluate(([body]) => body.innerHTML, [containerHandle])
      const getPrice = innerHTML.replace(/[^0-9]/g, '').substr(0, 3)
      return getPrice
    }
  },
  {
    vendor: 'Linio',
    hasSchema: true,
    url: 'https://www.linio.com.pe/p/monitor-teros-gaming-te-3173n-27-ips-curvo-144-hz-hdmi-displayport-freesync-n2kv88',
    checkStock: async ({ page }) => {
      const containerHandle = await page.$('.product-price-lg > .lowest-price >.price-main-md')
      const innerHTML = await page.evaluate(([body]) => body.innerHTML, [containerHandle])
      const getPrice = innerHTML.replace(/[^0-9]/g, '').substr(0, 3)
      console.log('price -> ', getPrice)
      return getPrice
    }
  },
  {
    vendor: 'Ripley',
    hasSchema: true,
    url: 'https://simple.ripley.com.pe/teros-monitor-gamer-te-3173n-27-ips-curvo-144hz-freesync-fhd-1920x1080-pmp00001348361?color80_fijo=negro&s=o',
    checkStock: async ({ page }) => {
      const containerHandle = await page.$('.product-internet-price > .product-price')
      const innerHTML = await page.evaluate(([body]) => body.innerHTML, [containerHandle])
      const getPrice = innerHTML.replace(/[^0-9]/g, '').substr(0, 3)
      return getPrice
    }
  },
  {
    vendor: 'Real Plaza',
    hasSchema: true,
    url: 'https://www.realplaza.com/monitor-teros-te-3173n-27--ips-curvo-144-hz-1920x1080-fhd-hdmi---displayport-freesync-313944/p',
    checkStock: async ({ page }) => {
      const containerHandle = await page.$('.realplaza-product-custom-0-x-productSummaryPrice__Option__OfferPrice__Color')
      const innerHTML = await page.evaluate(([body]) => body.innerHTML, [containerHandle])
      const getPrice = innerHTML.replace(/[^0-9]/g, '').substr(0, 3)
      return getPrice
    }
  },
  {
    vendor: 'Promart',
    hasSchema: true,
    url: 'https://www.promart.pe/monitor-teros-te-3176n-27--ips-75hz-1920x1080-full-hd-hdmi-vga--100046613/p',
    checkStock: async ({ page }) => {
      const containerHandle = await page.$$('.js-price-price > span')
      const innerHTML = await page.evaluate(([body]) => body.innerHTML, [containerHandle[1]])
      const getPrice = innerHTML.replace(/[^0-9]/g, '').substr(0, 3)
      return getPrice
    }
  }
]

  ; (async () => {
    const browser = await chromium.launch({})//headless: false })


    for (const shop of shops) {
      const { checkStock, vendor, url } = shop
      const page = await browser.newPage()
      await page.goto(url)

      const hasStock = await checkStock({ page })

      const validatePrice = hasStock < price

      console.log(`${vendor}: ${validatePrice ? 'Buen precio!!! \n S/ ' + hasStock : 'Muy caro!!! \n S/ ' + hasStock}`)
      await page.screenshot({ path: `screenshots/${vendor}.png` })
      await page.close()
    }

    await browser.close()
  })()
