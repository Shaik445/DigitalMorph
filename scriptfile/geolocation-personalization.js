document.addEventListener("DOMContentLoaded", function() {
           const apiKey = "e188aa8969984d6d95a8d4e3e18d2215"; 
           if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(
                   async (position) => {
                       const { latitude, longitude } = position.coords;
                      
                       const response = await fetch(
                           `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
                       );
					   
                       const data = await response.json();
                       if (data.results && data.results.length > 0) {
                           const countryInfo = data.results[0].components;
                           const country = countryInfo.country;
                           const currentpage = window.location.href.replace("https://", "");
						   
					    const respPersonization = await fetch(
					    `http://localhost:3000/api/personalizationRules?pageurl=${currentpage}&condition_value=${country}`
						);
						const datapr = await respPersonization.json();
						if (datapr && datapr.length > 0) {
							document.getElementById(datapr[0].domelement).innerHTML = datapr[0].contenttodisplay;
						}
                       } 
                   },
                   (error) => {
                       document.getElementById("mainHomepageBannerSmarterDesktop").innerText = `Error: ${error.message}`;
                   }
               );
           } else {
               document.getElementById("mainHomepageBannerSmarterDesktop").innerText =
                   "Geolocation is not supported by this browser.";
           }
});
