
const env = process.env.NODE_ENV;
export const API_BASE_URL = (env ==="development") ? 'http://127.0.0.1:8000/'  : 'http://ec2-34-244-62-183.eu-west-1.compute.amazonaws.com/';

console.log(API_BASE_URL);




