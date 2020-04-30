
const env = process.env.NODE_ENV;
if (env ==="development")
{
    export const API_BASE_URL = 'http://127.0.0.1:8000/';
}
else if (env ==="production"){
export const API_BASE_URL = 'http://ec2-34-244-62-183.eu-west-1.compute.amazonaws.com/';
}
