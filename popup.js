let timerInterval;

document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get(['isConnected', 'proxy', 'startTime', 'lastList']);
  
  // Khôi phục danh sách đã tìm thấy trước đó (nếu có)
  if (data.lastList) {
    updateProxyList(data.lastList);
    document.getElementById('status-text').innerText = `Đã tìm thấy ${data.lastList.length} proxy`;
  }

  // KIỂM TRA THỰC TẾ
  chrome.runtime.sendMessage({ action: "checkStatus" }, (status) => {
    if (data.isConnected && status.isControlling) {
      updateUIConnected(data.proxy, data.startTime);
    } else {
      // Nếu storage ghi là connected nhưng thực tế bị extension khác chiếm
      if (data.isConnected && !status.isControlling) {
        console.warn("Proxy đang bị chiếm quyền bởi ứng dụng khác!");
        document.getElementById('status-text').innerText = "Cảnh báo: Proxy bị ứng dụng khác chặn!";
      }
      updateUIDisconnected();
      chrome.storage.local.set({ isConnected: false });
    }
  });
});

// NÚT TÌM KIẾM
document.getElementById('btn-search').addEventListener('click', async () => {
  const protocol = document.getElementById('protocol').value;
  const btnSearch = document.getElementById('btn-search');
  
  btnSearch.disabled = true;
  btnSearch.innerText = "Đang quét...";
  document.getElementById('status-text').innerText = "Đang kiểm tra toàn bộ proxy...";

  chrome.runtime.sendMessage({ action: "search", protocol: protocol }, (response) => {
    btnSearch.disabled = false;
    btnSearch.innerText = "Tìm kiếm proxy";

    if (response && response.success && response.proxies.length > 0) {
      document.getElementById('status-text').innerText = `Đã tìm thấy ${response.proxies.length} proxy hoạt động`;
      updateProxyList(response.proxies);
      chrome.storage.local.set({ lastList: response.proxies });
      document.getElementById('btn-connect').disabled = false;
    } else {
      document.getElementById('status-text').innerText = "Không tìm thấy proxy nào hoạt động";
      updateProxyList([]);
      document.getElementById('btn-connect').disabled = true;
    }
  });
});

// NÚT KẾT NỐI
document.getElementById('btn-connect').addEventListener('click', () => {
  const proxyList = document.getElementById('proxy-list');
  const selectedProxyString = proxyList.value;

  if (!selectedProxyString) return alert("Vui lòng chọn 1 proxy!");

  const proxyData = JSON.parse(selectedProxyString);
  const protocol = document.getElementById('protocol').value;

  chrome.runtime.sendMessage({ action: "connect", proxy: proxyData, protocol: protocol }, (response) => {
    if (response.success) {
      const startTime = Date.now();
      updateUIConnected(proxyData, startTime);
      chrome.storage.local.set({ isConnected: true, proxy: proxyData, startTime: startTime });
    }
  });
});

// NÚT TẠM DỪNG
document.getElementById('btn-stop').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "stop" }, () => {
    updateUIDisconnected();
    chrome.storage.local.set({ isConnected: false, proxy: null });
  });
});

function updateProxyList(proxies) {
  const select = document.getElementById('proxy-list');
  select.innerHTML = '<option value="">-- Chọn proxy từ danh sách --</option>';
  proxies.forEach(p => {
    const opt = document.createElement('option');
    opt.value = JSON.stringify(p);
    opt.innerText = `${p.ip} | Ping: ${p.ping}ms`;
    select.appendChild(opt);
  });
}

function updateUIConnected(proxy, startTime) {
  document.getElementById('btn-search').disabled = true;
  document.getElementById('btn-connect').disabled = true;
  document.getElementById('btn-stop').disabled = false;
  document.getElementById('current-ip').innerText = proxy.ip;
  document.getElementById('ping').innerText = proxy.ping;
  startTimer(startTime);
}

function updateUIDisconnected() {
  document.getElementById('btn-search').disabled = false;
  document.getElementById('btn-connect').disabled = false;
  document.getElementById('btn-stop').disabled = true;
  document.getElementById('current-ip').innerText = "---";
  document.getElementById('ping').innerText = "---";
  stopTimer();
}

function startTimer(startTime) {
  stopTimer();
  timerInterval = setInterval(() => {
    const sec = Math.floor((Date.now() - startTime) / 1000);
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `${h}:${m}:${s}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  document.getElementById('timer').innerText = "00:00:00";
}