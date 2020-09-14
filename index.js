require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true, headless: false });
  const page = await browser.newPage();
  //https://dmitripavlutin.com/catch-the-xmlhttp-request-in-plain-javascript/
  //https://stackoverflow.com/questions/47107465/puppeteer-how-to-listen-to-object-events
  //https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pageevaluateonnewdocumentpagefunction-args
  await page.goto('http://www.checkmywash2.com/');
  //await page.screenshot({path: 'example.png'});

  await page.type('#ctl00_cph_primary_txtLoginEmail',    process.env.WASHMON_EMAIL);
  await page.type('#ctl00_cph_primary_txtLoginPassword', process.env.WASHMON_PASSWORD);

  await page.screenshot({path: 'login-fill.png'});

  
  await page.click('[name="ctl00$cph_primary$btnLogIn"]',{waitUntil: 'domcontentloaded'});
  //await page.waitForNavigation();
  await page.goto('http://www.checkmywash2.com/laundryRoom.aspx?d=46541767F213D1CFEEC875D2F1A51D7E00F63658A0398A91862F3D3F0D0D854E846A11C80A37AD723E8E521732E53A29&g=8EE7B2B48689D217447D9217CA18E25D763A47A428677B68F9C376E9FFE48203353D29EDFC1DE06ABDA60518374D8637',{ waitUntil: 'domcontentloaded'});

  await page.screenshot({path: 'laundree.png'});

  const machines = await page.$$('[id$="plUpdatePanel"]');

  //console.log(machines);

  const suffixes = [
    "lblMachineName",
    "lblAvailability",
    "lblTimeRemaining",
    "lblVendPrice",
    "lblMachineType"
  ];

  for (var machine of machines)
  {
    var machineData = {};

    for (var suffix of suffixes)
    {
      var res;
      try {
	res = await machine.$eval(`[id$="${suffix}"]`, e => e.innerText);
      }
      catch(e)
      {
	res = "error";
      }
      machineData[suffix] = res;
    }

    console.log(machineData);
  }

  //console.log(results);

  await browser.close();
})();



