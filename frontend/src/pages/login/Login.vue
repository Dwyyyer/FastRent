<!-- pages/Login.vue -->
<template>
  <AuthFormContainer
    title="Entrar"
    subtitle="Acesse sua conta"
    buttonText="Login"
    footerText="Não possui conta?"
    footerLinkText="Registrar"
    footerLink="/register.html"
    @submit="login"
  >
    <input
      type="email"
      placeholder="Email"
      v-model="form.email"
      class="input"
    />

    <input
      type="password"
      placeholder="Senha"
      v-model="form.password"
      class="input"
    />
  </AuthFormContainer>
</template>

<script>
import AuthFormContainer from "../../components/AuthFormContainer.vue";
import { request } from "../../api.js";

export default {
  components: {
    AuthFormContainer
  },

  data() {
    return {
      form: {
        email: "",
        password: ""
      },

      isSubmitting: false
    };
  },

  methods: {
    async login() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;

      try {
        const envelope = await request("/auth/login", {
          method: "POST",
          body: JSON.stringify(this.form)
        });

        // sendResponse() envolve o payload em { success, message, data }
        // os tokens estão em envelope.data, não diretamente em envelope
        const payload = envelope?.data ?? envelope;

        localStorage.setItem("accessToken", payload?.accessToken ?? "");
        localStorage.setItem("refreshToken", payload?.refreshToken ?? "");
        if (payload?.user) localStorage.setItem("authUser", JSON.stringify(payload.user));

        // Notifica o Navbar (mesma aba) que o estado de auth mudou.
        // O evento 'storage' nativo não dispara na própria aba.
        window.dispatchEvent(new CustomEvent("auth:changed"));

        window.location.href = "/index.html";
      } catch (err) {
        alert(err?.message || "Falha ao fazer login");
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #0f172a;
  color: white;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
}
</style>