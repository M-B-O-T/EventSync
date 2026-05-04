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
  },

  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem("token")
      ? Promise.resolve()
      : Promise.reject();
  },

  checkError: () => Promise.resolve(),

  getPermissions: () => Promise.resolve(),
};

export default authProvider;