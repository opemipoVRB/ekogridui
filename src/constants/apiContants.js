
const env = process.env.NODE_ENV;
export const API_BASE_URL = (env ==="development") ? 'http://127.0.0.1:8000/'  : 'http://ec2-34-244-62-183.eu-west-1.compute.amazonaws.com/';
export const WS_BASE_URL = (env ==="development") ? 'ws://127.0.0.1:8000/'  : 'ws://ec2-34-244-62-183.eu-west-1.compute.amazonaws.com/';
export const MapboxAccessToken="pk.eyJ1IjoiZW1tYW51ZWwtY2FzdGVyIiwiYSI6ImNrYmpmemtpdjBucTQydG15ZXNoZXZ3MGkifQ.cZdt37kmI27j-G2Si8eSCQ";
console.log(API_BASE_URL);




