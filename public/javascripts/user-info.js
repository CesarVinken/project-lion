$(document).ready(function() {
  getLanguageList();
  getCountryList();

  $("#multi-select-known").dropdown({
    onChange: val => {
      console.log("known languages!");
      console.log(val);
    }
  });

  $("#multi-select-learning").dropdown({
    onChange: val => {
      console.log("learning languages!");
      console.log(val);
    }
  });

  //the user object should only be passed on on the edit pages.
  if (user) {
    setUserLanguages();
    setUserCountry();
  }
});
