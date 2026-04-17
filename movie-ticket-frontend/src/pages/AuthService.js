const BATCH_URL = "http://172.20.35.147:8888/api/users"; // Gọi thông qua API Gateway

export const authService = {
  // Hàm đăng ký
  register: async (userName, email, password) => {
    try {
      const response = await fetch(`${BATCH_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          email: email,
          password: password,
          role: "USER"
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      return await response.text();
    } catch (error) {
      throw error;
    }
  },

  // Hàm đăng nhập
  login: async (userName, password) => {
    try {
      const response = await fetch(`${BATCH_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Sai danh tính hoặc mật khẩu!");
      }
      const data = await response.json();
      return data; // Trả về Token và thông tin user
    } catch (error) {
      throw error;
    }
  },

  // Hàm lấy thông tin cá nhân
  getMe: async (token) => {
    try {
      const response = await fetch(`${BATCH_URL}/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};
