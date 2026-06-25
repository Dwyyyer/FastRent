<!-- pages/Register.vue -->
<template>
  <AuthFormContainer
    title="Criar Conta"
    subtitle="Faça seu cadastro"
    buttonText="Registrar"
    footerText="Já possui conta?"
    footerLinkText="Entrar"
    footerLink="/login.html"
    @submit="register"
  >
    <input
      type="text"
      placeholder="Nome"
      v-model="form.name"
      class="input"
    />

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
        name: "",
        email: "",
        password: ""
      },

      isSubmitting: false
    };
  },

  methods: {
    async register() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;

      try {
        await request("/auth/register", {
          method: "POST",
          body: JSON.stringify(this.form)
        });

        // backend retorna { user }, aqui não precisamos do payload
        window.location.href = "/login.html";
      } catch (err) {
        alert(err?.message || "Falha ao cadastrar");
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