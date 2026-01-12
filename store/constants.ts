// API Configuration
// For iOS Simulator: use 'http://localhost:3000'
// For Android Emulator: use 'http://10.0.2.2:3000'
// For Physical Device: use your computer's IP address (e.g., 'http://192.168.1.100:3000')
// To find your IP: run 'ipconfig getifaddr en0' on Mac or 'ipconfig' on Windows

export const API_BASE_URL = __DEV__
  ? 'http://10.12.10.220:3000' // Development - change to your local IP if testing on device
  : 'https://your-production-api.com'; // Production
