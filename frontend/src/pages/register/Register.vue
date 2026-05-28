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
      }
    };
  },

  methods: {
    register() {
      console.log(this.form);
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