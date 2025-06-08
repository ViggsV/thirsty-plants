import axios from "axios";

export class ApiClient {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "http://localhost:3001", // 👉 server base
      withCredentials: true,             // 👉 send & receive cookies
    });

    

    // Attach access token to every request
    this.axiosInstance.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // If 401, try refreshing once
    this.axiosInstance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;
        if (
          error.response?.status === 401 &&
          !original._retry
        ) {
          original._retry = true;
          const newToken = await this.refreshAccessToken();
          if (newToken) {
            this.setToken(newToken);
            original.headers.Authorization = `Bearer ${newToken}`;
            return this.axiosInstance(original);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // 🔑 Check if token is present
  isLoggedIn() {
    return !!this.getToken();
  }

  getToken() {
    return typeof window !== "undefined"
      ? localStorage.getItem("authToken")
      : null;
  }

  setToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }

  async refreshAccessToken() {
    try {
      const { data } = await this.axiosInstance.post("auth/refreshToken");
      return data.accessToken; 
    } catch {
      return null;
    }
  }

  // Generic API call (paths are relative)
  async apiCall(method, path, data) {
    return this.axiosInstance({ method, url: path, data });
  }

  // Domain methods
  getPlants() {
    return this.apiCall("get", "api/plants");
  }

  addPlant(title, desc, freq) {
    const wateringFrequency = Number(freq);
    if (isNaN(wateringFrequency)) {
      return Promise.reject(
        new Error("Watering frequency must be a valid number")
      );
    }
    return this.apiCall("post", "api/plants", {
      title,
      description: desc,
      wateringFrequency,
    });
  }

  removePlant(id) {
    return this.apiCall("delete", `api/plants/${id}`);
  }

  updatePlants(id, title, desc, freq) {
    return this.apiCall("put", `api/plants/${id}`, {
      title,
      description: desc,
      wateringFrequency: freq,
    });
  }

  // Auth
async login(email, password) {
  try {
    const response = await this.axiosInstance.post("api/auth/login", { email, password });
    console.log("Login response data:", response.data);
    const { accessToken } = response.data;
    if (accessToken) {
      this.setToken(accessToken);
      return response.data;
    }
    throw new Error("No accessToken in response");
  } catch (err) {
    console.error("Login failed:", err.response?.data || err);
    throw err;
  }
}


  async register(email, password) {
    const { data } = await this.axiosInstance.post("api/auth/register", {
      email,
      password,
    });
    if (data.accessToken) {
      this.setToken(data.accessToken);
      return data;
    }
    throw new Error("No access token received");
  }

  logout() {
    this.removeToken();
    if (typeof window !== "undefined") {
      window.location.href = "/user";
    }
  }
}
