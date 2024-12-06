let personalizationForm = document.getElementById("personalization-form");
personalizationForm.addEventListener("submit", (e) => {
  e.preventDefault();


  let personalizationName = document.getElementById("personalization-condition_name").value;
  let personalizationConditionBase = document.getElementById("personalization-condition_base").value;
  let personalizationConditionValue = document.getElementById("personalization-condition_value").value;
  let personalizationPageUrl = document.getElementById("personalization-page-url").value;
  let personalizationDOMElement = document.getElementById("personalization-condition_domelement").value;
  let personalizationContent = document.getElementById("personalization-content").value;
  alert(personalizationPageUrl);
  fetch("http://localhost:3000/api/insertpersonalizationrules", {
  method: "POST",
  body: JSON.stringify({
  "id": 1,
  "priority":1,
  "name": personalizationName,
  "channel":"web",
  "condition_base": personalizationConditionBase,
  "condition_comparator":"=",
  "condition_value":personalizationConditionValue,
  "contenttodisplay":personalizationContent,
  "pageurl":personalizationPageUrl,
  "domelement":personalizationDOMElement
})
});
});