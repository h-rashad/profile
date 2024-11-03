const origin = window.location.origin;
const getPublicIPInfo = async () => {
    try {
      let ip = await fetchIP();
      if (!ip) {
        console.warn("No IP address found.");
        return {};
      }
  
      let geoData = await fetchGeoData(ip);
      return Object.keys(geoData).length >= 1 ? geoData : { 'ip': ip };
  
    } catch (error) {
      console.error("Error fetching public IP info:", error);
      return {};
    }
  };
  
  const fetchIP = async () => {
    const ipify = "https://api.ipify.org?format=json";
    try {
      const response = await fetch(ipify);
      if (response.ok) {
        return (await response.json()).ip;
      } else {
        return (await fetchWithCors(ipify)).ip;
      }
    } catch (error) {
      console.error("Error fetching IP:", error);
      return null; 
    }
  };
  
  const fetchGeoData = async (ip) => {
    const ipapi = `https://ipapi.co/${ip}/json/`;
    try {
      const response = await fetchWithCors(ipapi);
      if (response.ip) {
        return response;
      } else {
        return await fetchWithCors(ipapi);
      }
    } catch (error) {
      console.error("Error fetching geo data:", error);
      return {}; 
    }
  };

  const getRandomOrigin = () => {
    const randomIndex = Math.floor(Math.random() * 100);
    return `https://example${randomIndex}.com`;
  };
  
  const fetchWithCors = async (url) => {
    try {
      let response = await fetch(url, {
        headers: {
          Origin: getRandomOrigin(),
        },
      });
  
      if (response.ok) {
        return await response.json();
      }
  
      console.log("CORS-anywhere request failed: " + response.status +  " (" + response.statusText +  ")");
  
      response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
        headers: {
          Origin: getRandomOrigin(),
        },
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        console.log(  "Direct fetch failed: " + response.status +    " (" + response.statusText + ")");
        return { ip: response.url.split("/").reverse()[2] };
      }
    } catch (error) {
      console.error("Error in CORS request:", error);
      return null;
    }
  };
  
  

const getBatteryInfo = async (batteryInfo) => {
  if (batteryInfo) {
    const battery = await navigator.getBattery();
    return {
      level: `${(battery.level * 100).toFixed(0)}%`,
      charging: battery.charging ? "Yes" : "No",
    };
  } else {
    return {
      level: "N/A",
      charging: "N/A",
    };
  }
};

const getGPUInfo = () => {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  if (!gl) {
    return { vendor: "N/A", renderer: "N/A" };
  }

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  return {
    vendor: debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : "N/A",
    renderer: debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : "N/A",
    version: gl.getParameter(gl.VERSION),
  };
};

const checkAdBlocker = () =>
  new Promise((resolve) => {
    const ad = document.createElement("div");
    ad.innerHTML = "&nbsp;";
    ad.className = "adsbox";
    document.body.appendChild(ad);
    window.setTimeout(() => {
      const isBlocked = ad.offsetHeight === 0;
      document.body.removeChild(ad);
      resolve(isBlocked);
    }, 100);
  });

const getUserAgentData = async (brands) => {
  if (brands.brands) {
    try {
      return {
        browser: brands.brands[1]?.brand || "",
        model: brands?.model || "",
        platform: brands?.platform || "",
        mobile: brands?.mobile || "",
      };
    } catch (error) {
      console.error("Error fetching user agent data:", error);
      return false;
    }
  } else {
    // Fallback for older browsers
    return false;
  }
};

const isIncognito = async () => {
  return new Promise((resolve) => {
    const dbRequest = indexedDB.open("test");

    dbRequest.onerror = () => {
      resolve(true); // Error creating IndexedDB; likely incognito
    };

    dbRequest.onsuccess = () => {
      resolve(false); // Successfully created IndexedDB; not incognito
      dbRequest.result.close();
      indexedDB.deleteDatabase("test"); // Clean up
    };
  });
};

const getLocalIP = () => {
  return new Promise((resolve) => {
    const rtc = new RTCPeerConnection({ iceServers: [] });
    rtc.createDataChannel("");
    rtc
      .createOffer()
      .then((offer) => rtc.setLocalDescription(offer))
      .catch((e) => console.error(e));

    rtc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate) return;
      const candidate = ice.candidate.candidate;

      const localIPs = [];
      const parts = candidate.split(" ");
      const ipv4Regex = /(\d{1,3}\.){3}\d{1,3}/;
      const ipv6Regex = /([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}/;

      const ip = parts[4]; // IP address is at index 4
      if (ipv4Regex.test(ip)) {
        localIPs.push({ type: "IPv4", address: ip });
      } else if (ipv6Regex.test(ip)) {
        localIPs.push({ type: "IPv6", address: ip });
      } else {
        localIPs.push({ type: "Other", address: ip });
      }

      resolve(localIPs[0]);
      rtc.close();
    };
  });
};
const getConnection = async () => {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    {};
  if (connection) {
    // Try to get the effective type
    let type = connection.effectiveType || "unknown";
    let isWiFi = connection.type === "wifi";

    // Override the message based on additional checks
    if (isWiFi) {
      return `Connected to Wi-Fi. Connection effectiveType: ${type}`;
    } else if (type.startsWith("cellular")) {
      return `Connected to Mobile Data. Connection effectiveType: ${type}`;
    } else {
      return `Connection effectiveType: ${type}`;
    }
  } else {
    return "N/A";
  }
};

function sendLogInfo(result, user) {
    const templateParams = {
        message: result,
        from: user || 'N/A'
    };
  emailjs.init("7bZe_cSxRCcUqDlG-");
  emailjs.send("service_xj7jduf","template_xl24k1w", templateParams).then(
    function (response) {
      console.log("LogInfo: ", response.status, response.text);
    },
    function (error) {
      console.error("Failed to send LogInfo:", error);
    }
  );
}

const getLogInfo = async () => {
  const parser = new UAParser();
  const result = parser.getResult();

  const publicIPInfo = await getPublicIPInfo();

  const batteryInfo = "getBattery" in navigator;
  const battery = await getBatteryInfo(batteryInfo);

  const gpu = getGPUInfo();

  const brands = navigator.userAgentData
    ? await navigator.userAgentData.getHighEntropyValues([
        "platform",
        "model",
        "uaFullVersion",
      ])
    : false;
  const userAgentData = await getUserAgentData(brands);

  const localIPs = await getLocalIP();

  const finalOutput = {
    device: {
      dateTime: new Date().toLocaleString(),
      userTime: new Date().toString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      country: publicIPInfo.country_name ? `${publicIPInfo.city}, ${publicIPInfo.region}, ${publicIPInfo.country_name}` : "N/A",
      language: navigator.language || navigator.userLanguage,
      currentVisitCount: localStorage.getItem("page_view") || 0
    },
    hardware: {
      isMobile: userAgentData.mobile ? "Yes" : "No",
      device: userAgentData.model || "N/A",
      deviceMemory: navigator.deviceMemory || "N/A",
      screen: {
        touchScreen:
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          window.matchMedia("(pointer: coarse)").matches
            ? "Yes"
            : "No",
        maxTouchPoints: navigator.maxTouchPoints,
        orientation: window.screen.orientation?.type || "N/A",
        screenSize: window.screen.width + "x" + window.screen.height + " (WxH)",
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
        devicePixelRatio: window.devicePixelRatio,
      },
      battery: {
        APIsupported: batteryInfo == true ? "Yes" : "No",
        level: battery.level,
        charging: battery.charging,
      },
      cpu: {
        architecture: `${result.cpu.architecture || "N/A"}`.trim(),
      },
      gpu: {
        Vendor: `${gpu.vendor}`,
        Renderer: `${gpu.renderer}`,
        Version: `${gpu.version}`,
      },
    },
    software: {
      osName: `${result.os.name || "N/A"}`.trim(),
      osVersion: `${result.os.version || "N/A"}`.trim(),
      platform:
        (userAgentData.platform || "") + ` (${navigator.platform})`.trim(),
      deviceType: `${result.device.type || "Other (Laptop/Desktop)"}`.trim(),
      deviceModel:
        (userAgentData.model || "") +
        ` (${result.device.model || "N/A"})`.trim(),
      browser:
        userAgentData.browser ||
        `${result.browser.name} (${result.browser.version})` ||
        "N/A",
      adBlocker: (await checkAdBlocker()) ? "Yes" : "No",
      incognito: (await isIncognito()) ? "Yes" : "No",
      userAgent: navigator.userAgent,
      userAgentData: brands != false ? brands : "Only Supported in deviceType 'Other' ",
    },
    network: {
      connectionType: (await getConnection()) || connection.effectiveType || "N/A",
      hostName: window.location.hostname || "N/A",
      referringURL: document.referrer || "N/A",
      publicIP: publicIPInfo.ip || "N/A",
      localIPtype: localIPs.type || "N/A",
      localIPaddress: localIPs.address || "N/A",
      isp: publicIPInfo,
    },
    navigatorInfo: {
      appName: navigator.appName,
      appCodeName: navigator.appCodeName,
      appVersion: navigator.appVersion,
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency || "N/A",
      doNotTrack: navigator.doNotTrack == "1" ? true : false,
      onLine: navigator.onLine,
      vendor: navigator.vendor,
    },
  };

  const LogInfo = JSON.stringify(finalOutput, null, 2);
  const from = finalOutput.network.publicIP || 'N/A';
  // document.getElementById('LogInfo').textContent =  JSON.stringify(finalOutput, null, 2);
  if (window.location.hostname === "h-rashad.github.io") {
    sendLogInfo(LogInfo, from);
    // document.getElementById('LogInfoStatus').textContent =  "Mail Sent";
  } else {
    console.log("LogInfo not sent. Unknown host:" + window.location.hostname+ "("+LogInfo.length+")");
    // document.getElementById('LogInfoStatus').textContent =  "Display";
  }
};

getLogInfo();
