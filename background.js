// Load and apply the last saved proxy settings when Chrome starts
chrome.runtime.onStartup.addListener(() => {
    applySavedProxySettings();
});

// Load and apply the last saved proxy settings when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    applySavedProxySettings();
});

// Function to load and apply proxy settings
function applySavedProxySettings() {
    chrome.storage.sync.get(['proxyHost', 'proxyPort', 'proxyScheme'], function(result) {
        if (result.proxyHost && result.proxyPort && result.proxyScheme) {
            const config = {
                mode: "fixed_servers",
                rules: {
                    singleProxy: {
                        scheme: result.proxyScheme,
                        host: result.proxyHost,
                        port: parseInt(result.proxyPort)
                    },
                    bypassList: ["localhost", "127.0.0.1"]
                }
            };
            
            chrome.proxy.settings.set({ value: config, scope: 'regular' }, function() {
                console.log(`Proxy applied: ${result.proxyScheme}://${result.proxyHost}:${result.proxyPort}`);
            });
        } else {
            console.log("No proxy settings found.");
        }
    });
}
