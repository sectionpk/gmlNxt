  // Function to fetch country data
  function fetchCountries() {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const select = document.getElementById('country');
        data.forEach(country => {
          const option = document.createElement('option');
          option.value = '+' + country.callingCodes[0];
          option.textContent = country.flag.emoji + ' +' + country.callingCodes[0] + ' (' + country.name.common + ')';
          select.appendChild(option);
        });
      })
      .catch(error => console.error('Error fetching countries:', error));
  }

  // Call the function to fetch countries when the page loads
  window.onload = fetchCountries;