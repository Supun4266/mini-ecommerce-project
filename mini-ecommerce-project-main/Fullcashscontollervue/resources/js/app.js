import './bootstrap';
import Alpine from 'alpinejs';
import '../css/app.css'; // <-- Tailwind CSS file

window.Alpine = Alpine;
Alpine.start();

// Vue (for Cashier Dashboard)
import { createApp } from 'vue';
import CashierDashboard from './components/CashierDashboard.vue';

if (document.getElementById('app')) {
    createApp(CashierDashboard).mount('#app');
}
