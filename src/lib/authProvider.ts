const authProvider = {
  login: async ({ email, password }: any) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erreur login");
    }

    localStorage.setItem("token", data.token);
    return Promise.resolve();
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.replace("/admin/login");
    return Promise.resolve();
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/admin/login");
      return Promise.reject();
    }

    return Promise.resolve();
  },

  checkError: () => Promise.resolve(),

  getPermissions: () => Promise.resolve(),
};

export default authProvider;