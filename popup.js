// Load the last saved theme and update the dark mode icon
function updateTheme() {
    const darkMode = localStorage.getItem('dark-mode') === 'true';
    const iconElement = document.getElementById('dark-mode-icon');
    const titleElement = document.getElementById('title');
    const inputs = document.querySelectorAll('input, select');

    if (darkMode) {
        document.body.classList.add('dark-mode');
        titleElement.classList.add('dark-mode');

        // Change the icon to day_icon.svg when in dark mode
        iconElement.src = 'day_icon.svg'; // Change to day icon
        
        // Apply dark mode styles to inputs
        inputs.forEach(input => {
            input.classList.add('dark-mode');
        });
    } else {
        document.body.classList.remove('dark-mode');
        titleElement.classList.remove('dark-mode');

        // Change the icon to night_icon.svg when in light mode
        iconElement.src = 'night_icon.svg'; // Change to night icon

        // Apply light mode styles to inputs
        inputs.forEach(input => {
            input.classList.remove('dark-mode');
        });
    }

    // Change title color based on theme
    titleElement.style.color = darkMode ? 'var(--text-color-dark)' : 'var(--text-color-light)';
}

// Show or hide SOCKS5 authentication fields based on the selected scheme
document.getElementById('proxy-scheme').addEventListener('change', function() {
    const authFields = document.getElementById('socks-auth');
    if (this.value === 'socks5') {
        authFields.style.display = 'block';
    } else {
        authFields.style.display = 'none';
    }
});

// Toggle dark mode on icon click
document.getElementById('dark-mode-icon').addEventListener('click', function() {
    const darkMode = localStorage.getItem('dark-mode') === 'true';
    localStorage.setItem('dark-mode', !darkMode);
    updateTheme();
});

// Initial theme setup
updateTheme();

// Set Proxy button click event
document.getElementById('set-proxy-btn').addEventListener('click', function() {
    const host = document.getElementById('proxy-host').value;
    const port = document.getElementById('proxy-port').value;
    const scheme = document.getElementById('proxy-scheme').value;
    const username = document.getElementById('proxy-username').value;
    const password = document.getElementById('proxy-password').value;

    // Construct the proxy configuration
    const proxyConfig = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: scheme,
                host: host,
                port: parseInt(port)
            }
        }
    };

    // If using SOCKS5 and authentication is provided, add that to the config
    if (scheme.startsWith('socks') && username && password) {
        proxyConfig.rules.singleProxy.username = username;
        proxyConfig.rules.singleProxy.password = password;
    }

    // Set the proxy
    chrome.proxy.settings.set(
        { value: proxyConfig, scope: 'regular' },
        function() {
            document.getElementById('status').textContent = 'Proxy set successfully!';
        }
    );

    // Log to console for demonstration purposes
    console.log(`Setting proxy: ${scheme}://${host}:${port}`);
    if (username && password) {
        console.log(`With auth: ${username}:${password}`);
    }
});

// Clear Proxy button click event
document.getElementById('clear-proxy-btn').addEventListener('click', function() {
    // Logic for clearing the proxy
    chrome.proxy.settings.clear({}, function() {
        document.getElementById('status').textContent = 'Proxy cleared!';
    });
    
    // Log to console for demonstration purposes
    console.log('Clearing proxy');
});
