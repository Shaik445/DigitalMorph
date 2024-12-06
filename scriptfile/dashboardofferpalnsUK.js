document.addEventListener("DOMContentLoaded", async function() {
    const response = await fetch("https://sit-api-aggregator.lebara.co.uk/api-aggregator", {
    "headers": {
       "accept": "application/json, text/plain, */*",
       "accept-language": "en-US,en;q=0.9,te;q=0.8",
       "cache-control": "no-cache",
       "channel": "Web",
       "content-type": "application/json",
       "country": "GB",
       "locale": "en-GB",
       "pragma": "no-cache",
       "priority": "u=1, i",
       "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
       "sec-ch-ua-mobile": "?0",
       "sec-ch-ua-platform": "\"Windows\"",
       "sec-fetch-dest": "empty",
       "sec-fetch-mode": "cors",
       "sec-fetch-site": "same-site"
     },
     "referrer": "https://sit.lebara.co.uk/",
     "referrerPolicy": "strict-origin",
     "body": "{\"query\":\"\\n  query getSessionStatus($selectedMsisdn: String) {\\n    getSessionStatus(selectedMsisdn: $selectedMsisdn) {\\n      email\\n      isPortInUser\\n      msisdn\\n      crmId\\n      showfor\\n      user {\\n        tenure\\n        primary_offer_id\\n        balance\\n      }\\n      products {\\n        id\\n        name\\n        variant\\n        renewal_days\\n        remaining_data\\n      }\\n    }\\n  }\\n\",\"variables\":{\"selectedMsisdn\":\"\"}}",
     "method": "POST",
     "mode": "cors",
     "credentials": "include"
   });
   const results = await response.json();
    if (results && results.data) {
    const email = results.data.getSessionStatus.email;
    const respPersonization = await fetch(
            `http://localhost:3000/api/personalizationRules?email=${email}`
         );
         const datapr = await respPersonization.json();
         if (datapr && datapr.length > 0) {
          setTimeout(() => {
                                   document.getElementById(datapr[0].domelement).innerHTML = datapr[0].contenttodisplay;
                               }, 5000);
         }
    }
   
   });