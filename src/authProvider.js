const apiUrl = "http://localhost:8080";
const authProvider = {
  login: ({ username, password }) => {
    const request = new Request(`${apiUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ token }) => {
        console.log("Received token:", token);
        localStorage.setItem("authToken", token);
      })
      .catch((error) => {
        throw error;
      });
  },
  logout: () => {
    localStorage.removeItem("authToken");
    return Promise.resolve();
  },
  checkError: (error) => {
    return Promise.resolve();
  },

  checkAuth: () => {
    const token = localStorage.getItem("authToken");
    return token ? Promise.resolve() : Promise.reject();
  },
};

export default authProvider;
