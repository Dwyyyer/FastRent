<template>
  <div class="schedule-container">

    <!-- Local -->
    <div class="schedule-field">
      <input
        type="text"
        placeholder="Onde você quer seu carro?"
      />

      <i class="fa-solid fa-location-dot"></i>
    </div>

    <!-- Data -->
    <div class="schedule-field">
      <input type="date" />

      <i class="fa-regular fa-calendar"></i>
    </div>

    <!-- Hora -->
    <div class="schedule-field">
      <input type="time" />

      <i class="fa-regular fa-clock"></i>
    </div>

  </div>
</template>

<script setup>
// sem lógica por enquanto
</script>

<style scoped>
.schedule-container {
  width: 100%;

  display: flex;
  gap: 14px;

  padding: 18px;

  border-radius: 28px;

  background: rgba(40, 44, 52, 0.92);

  backdrop-filter: blur(12px);

  box-shadow:
    0 10px 40px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.04);
}

.schedule-field {
  flex: 1;

  height: 58px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #f5f5f5;

  border-radius: 16px;

  padding: 0 18px;

  transition: 0.2s ease;
}

.schedule-field:hover {
  transform: translateY(-2px);
  background: white;
}

.schedule-field input {
  width: 100%;
  height: 100%;

  border: none;
  outline: none;

  background: transparent;

  font-size: 15px;
  font-weight: 500;

  color: #333;
}

.schedule-field input::placeholder {
  color: #9a9a9a;
}

.schedule-field i {
  font-size: 18px;
  color: #111;

  margin-left: 12px;
}

/* remove ícone nativo */
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
}

/* MOBILE */
@media (max-width: 768px) {
  .schedule-container {
    flex-direction: column;

    padding: 14px;
    gap: 10px;

    border-radius: 22px;
  }

  .schedule-field {
    height: 52px;
  }
}
</style>