import { createApp } from 'vue'
import Navbar from './components/Navbar.vue'
import Schedule from './components/Schedule.vue'
import '@fortawesome/fontawesome-free/css/all.min.css'

createApp(Navbar).mount('#navbar')
createApp(Schedule).mount('#schedule')