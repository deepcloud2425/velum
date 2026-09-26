const ws = new WebSocket('wss://rpc.preprod.midnight.network');

ws.onopen = () => {
  console.log('Connected to rpc.preprod.midnight.network');
  ws.close();
};

ws.onerror = (err) => {
  console.error('Error:', err.message);
};

ws.onclose = (event) => {
  console.log('Closed:', event.code, event.reason);
};
