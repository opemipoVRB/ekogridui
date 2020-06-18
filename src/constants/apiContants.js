
const env = process.env.NODE_ENV;
export const API_BASE_URL = (env ==="development") ? 'http://127.0.0.1:8000/'  : 'http://ec2-34-244-62-183.eu-west-1.compute.amazonaws.com/';
export const WS_BASE_URL = (env ==="development") ? 'ws://127.0.0.1:8000/'  : 'ws://ec2-34-244-62-183.eu-west-1.compute.amazonaws.com/';
export const MapboxAccessToken=process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
console.log("BAse: ", API_BASE_URL);
console.log("Map .. ", MapboxAccessToken);
console.log("Naa .. ", process.env.REACT_APP_PAYSTACK_PUBLIC_KEY);





