<!-- components/AuthFormContainer.vue -->
<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <slot />

        <button type="submit" class="submit-btn">
          {{ buttonText }}
        </button>
      </form>

      <div class="auth-footer">
        <span>{{ footerText }}</span>

        <a :href="footerLink">
          {{ footerLinkText }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthFormContainer",

  props: {
    title: {
      type: String,
      required: true
    },

    subtitle: {
      type: String,
      default: ""
    },

    buttonText: {
      type: String,
      required: true
    },

    footerText: {
      type: String,
      required: true
    },

    footerLinkText: {
      type: String,
      required: true
    },

    footerLink: {
      type: String,
      required: true
    }
  },

  methods: {
    handleSubmit() {
      this.$emit("submit");
    }
  }
};
</script>

<style scoped>
.auth-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  padding: 20px;
  box-sizing: border-box;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #1e293b;
  border-radius: 16px;
  padding: 32px;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.auth-header {
  margin-bottom: 24px;
  text-align: center;
}

.auth-header h1 {
  color: white;
  margin-bottom: 8px;
  font-size: 2rem;
}

.auth-header p {
  color: #94a3b8;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.submit-btn {
  width: 100%;
  border: none;
  background: #3b82f6;
  color: white;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: 0.2s;
}

.submit-btn:hover {
  background: #2563eb;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  color: #94a3b8;
}

.auth-footer a {
  color: #3b82f6;
  text-decoration: none;
  margin-left: 6px;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>