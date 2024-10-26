
    // Toggle nav menu on hamburger menu click
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu ul');
    
    burgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });
    
    
    document.addEventListener("DOMContentLoaded", function() {
        // Get current date
        const now = new Date();
    
        // Define months array to get the month name
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"];
    
        // Format date to -DD Month YYYY-
        const year = now.getFullYear();
        const month = monthNames[now.getMonth()]; // Get month name
        const day = now.getDate().toString().padStart(2, '0');
        const formattedDate = `${day} ${month} ${year}`;
    
        // Set the value of the text input field to the formatted date
        document.getElementById("date").value = formattedDate;
    });
    
    
     const key = "fca_live_S0ITpMUWC5xHXN9m73xwDD2R9mcqKGUOBwkueHB8";
    
    const state = {
      openedDrawer: null,
      currencies: [], // get currencies array  
      filteredCurrencies: [], // search currency array
      base: 'USD',
      target: 'CAD',
      rates: {},
      baseValue: 1,
    };
    
    const ui = {
      controls: document.getElementById('controls'),
      drawer: document.getElementById('drawer'),
      dismissBtn: document.getElementById('dismiss-btn'),
      currencyList: document.getElementById('currency-List'), // for currency
      searchInput: document.getElementById('search'),
      baseBtn: document.getElementById("base"),
      targetBtn: document.getElementById("target"),
      exchangeRate: document.getElementById("exchange-rate"),
      baseInput: document.getElementById("base-input"),
      targetInput: document.getElementById("target-input"),
    };
    
    // Event listeners setup
    const setupEventListeners = () => {
      document.addEventListener('DOMContentLoaded', initApp);
      ui.controls.addEventListener('click', showDrawer);
      ui.dismissBtn.addEventListener('click', hideDrawer);
      ui.searchInput.addEventListener('input', filterCurrency);
      ui.currencyList.addEventListener("click", selectPair);
      ui.baseInput.addEventListener("input", convertInput);
    };
    
    // Initialize the application
    const initApp = async () => {
      await fetchCurrencies();
      await fetchExchangeRate();
    }
    
    // Convert input amount dynamically
    const convertInput = async () => {
      state.baseValue = parseFloat(ui.baseInput.value) || 1;
      await fetchExchangeRate();
    };
    
    // Load exchange rate
    const loadExchangeRate = async () => {
      const { base, rates } = state;
      if (typeof rates[base] !== "undefined") {
        displayConversion();
      } else {
        await fetchExchangeRate();
      }
    };
    
    // Display currencies in the list
    const displayCurrencies = () => {
      ui.currencyList.innerHTML = state.filteredCurrencies.map(({ code }) => `
        <li data-code="${code}">
          <img src="${getImageURL(code)}" alt="${name}" />
          <div>
            <h4>${code}</h4>
           
          </div>
        </li>
      `).join("");
    };
    
    // Display conversion result
    const displayConversion = () => {
      updateButtons();
      updateInputs();
      updateExchangeRate();
    };
    
    // Update button labels with selected currency codes
    const updateButtons = () => {
      [ui.baseBtn, ui.targetBtn].forEach((btn) => {
        const code = state[btn.id];
        btn.textContent = code;
        btn.style.setProperty("--image", `url(${getImageURL(code)})`);
      });
    };
    
    // Update input fields with conversion result
    const updateInputs = () => {
      const { base, baseValue, target, rates } = state;
      const result = baseValue * rates[base][target];
      ui.targetInput.value = result.toFixed(4);
      ui.baseInput.value = baseValue;
    };
    
    // Update exchange rate display
    const updateExchangeRate = () => {
      const { base, target, rates } = state;
      const rate = rates[base][target].toFixed(4);
      ui.exchangeRate.textContent = `1 ${base} = ${rate} ${target}`;
    };
    
    // Get available currencies excluding base and target
    const getAvailableCurrencies = () => {
      return state.currencies.filter(({ code }) => {
        return state.base !== code && state.target !== code;
      });
    };
    
    // Clear search input
    const clearSearchInput = () => {
      ui.searchInput.value = "";
      ui.searchInput.dispatchEvent(new Event('input'));
    };
    
    // Get image URL for a currency code
    const getImageURL = (code) => {
      const flag = "https://wise.com/public-resources/assets/flags/rectangle/{code}.png";
      return flag.replace("{code}", code.toLowerCase());
    };
    
    // Fetch exchange rate
    const fetchExchangeRate = async () => {
      const { base, target } = state;
      try {
        const response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${key}&base_currency=${base}`);
        const { data } = await response.json();
        state.rates[base] = data;
        displayConversion();
      } catch (error) {
        console.error(error);
      }
    };
    
    // Fetch currencies
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(`https://api.freecurrencyapi.com/v1/currencies?apikey=${key}`);
        const { data } = await response.json();
        state.currencies = Object.values(data); // fetching data of all the currency
        state.filteredCurrencies = getAvailableCurrencies();
        displayCurrencies();
      } catch (error) {
        console.error(error);
      }
    };
    
    // Show the drawer
    const showDrawer = (e) => {
      if (e.target.hasAttribute('data-drawer')) {
        state.openedDrawer = e.target.id; // targeting id from data-drawer
        ui.drawer.classList.add('show');
      }
    };
    
    // Hide the drawer
    const hideDrawer = () => {
      clearSearchInput();
      state.openedDrawer = null;
      ui.drawer.classList.remove('show');
    };
    
    // Filter currencies based on search input
    const filterCurrency = () => {
      const keyword = ui.searchInput.value.trim().toLowerCase();
      state.filteredCurrencies = getAvailableCurrencies().filter(({ code}) => {
        return code.toLowerCase().includes(keyword);
      });
      displayCurrencies();
    };
    
    // Select currency pair and load exchange rate
    const selectPair = async (e) => {
      if (e.target.hasAttribute("data-code")) {
        const { openedDrawer } = state;
        state[openedDrawer] = e.target.dataset.code;
        await loadExchangeRate();
        [ui.baseBtn, ui.targetBtn].forEach((btn) => {
          const code = state[btn.id];
          btn.textContent = code;
          btn.style.setProperty("--image", `url(${getImageURL(code)})`);
        });
        hideDrawer();
      }
    };
    
    // Initialize event listeners
    setupEventListeners();
      

    /* card scrolling */
    document.addEventListener('DOMContentLoaded', function() {
      const container = document.getElementById('scroll-container');
      let scrollAmount = 0;

      function autoScroll() {
          scrollAmount += 1;
          if (scrollAmount >= container.scrollWidth - container.clientWidth) {
              scrollAmount = 0;
          }
          container.scrollTo({
              left: scrollAmount,
              behavior: 'smooth'
          });
      }

      setInterval(autoScroll, 10);
  });

    /* card scrolling  */