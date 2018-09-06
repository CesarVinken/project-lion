function getCountryList() {
  let countries = `<option value="">Country</option>`;

  countryList.forEach(country => {
    countries += `<option class="item" data-value='${country}'>${country}</option>`;
  });

  $("#user-country").html(countries);
}

function setUserCountry() {
  if (user.location.country) {
    var userCountry = countryList.find(element => {
      return element === user.location.country;
    });
    $("#user-country").dropdown("set selected", userCountry);
  }
}

function setEventCountry() {
  if (data.event.location.country) {
    var eventCountry = countryList.find(element => {
      return element === data.event.location.country;
    });
    $("#user-country").dropdown("set selected", eventCountry);
  }
}
