chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "search") {
    handleSearch(request.protocol, sendResponse);
    return true;
  } else if (request.action === "connect") {
    applyProxy(request.proxy, request.protocol, () => sendResponse({ success: true }));
    return true;
  } else if (request.action === "stop") {
    chrome.proxy.settings.clear({ scope: 'regular' }, () => sendResponse({ success: true }));
    return true;
  } else if (request.action === "checkStatus") {
    // Kiểm tra xem extension có thực sự đang kiểm soát proxy không
    chrome.proxy.settings.get({ incognito: false }, (details) => {
      const isControlling = details.levelOfControl === 'controlled_by_this_extension' || 
                           details.levelOfControl === 'controllable_by_this_extension';
      sendResponse({ isControlling: isControlling, details: details });
    });
    return true;
  }
});

async function handleSearch(protocol, sendResponse) {
  try {
    const response = await fetch("https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&country=vn&proxy_format=protocolipport&format=json");
    const data = await response.json();
    const candidates = data.proxies.filter(p => p.protocol === protocol);
    
    // Quét toàn bộ danh sách và trả về những con "sống"
    const aliveProxies = await checkAllProxies(candidates, protocol);
    sendResponse({ success: true, proxies: aliveProxies });
  } catch (e) {
    sendResponse({ success: false, proxies: [] });
  }
}

async function checkAllProxies(proxies, protocol) {
  let aliveList = [];
  // Lưu cấu hình proxy hiện tại của người dùng để khôi phục sau khi quét
  const originalConfig = await new Promise(r => chrome.proxy.settings.get({}, r));

  for (let p of proxies) {
    const [host, port] = p.proxy.split('://')[1].split(':');
    
    // Thử áp dụng để test
    await setProxy(protocol, host, port);

    try {
      const start = Date.now();
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 2500); // Mỗi con test 2.5s cho nhanh

      const res = await fetch("https://api.ipify.org?format=json", { signal: controller.signal, cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        p.ip = data.ip;
        p.ping = Date.now() - start;
        aliveList.push(p);
      }
    } catch (e) {}
  }

  // Sau khi quét xong, xóa sạch proxy để người dùng nhấn Kết nối mới áp dụng lại
  chrome.proxy.settings.clear({ scope: 'regular' });
  return aliveList;
}

function applyProxy(proxyData, protocol, callback) {
  const [host, port] = proxyData.proxy.split('://')[1].split(':');
  setProxy(protocol, host, port).then(callback);
}

function setProxy(protocol, host, port) {
  return new Promise(resolve => {
    chrome.proxy.settings.set({
      value: {
        mode: "fixed_servers",
        rules: { singleProxy: { scheme: protocol, host: host, port: parseInt(port) } }
      },
      scope: 'regular'
    }, resolve);
  });
}