// const BASE_URL = "https://liberal-chigger-blindly.ngrok-free.app/";
const BASE_URL = "43.203.71.112/"; // AWS EC2

export const executeFetch = async ({
  method = "POST",
  path = "auth/loginCheck/",
  data = undefined,
  //formData = undefined,
}) => {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type":
          //data === undefined ? "multipart/form-data" : "application/json",
          "application/json",
      },
      credentials: "include",
      //body: data === undefined ? formData : JSON.stringify(data),
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    throw new Error(`fialed fetch [${method}] :: ${error}`);
  }
};
