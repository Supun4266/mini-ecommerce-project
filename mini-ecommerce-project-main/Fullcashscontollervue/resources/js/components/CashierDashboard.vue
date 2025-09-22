<template>
  <div class="min-h-screen bg-slate-900 text-white p-6 pt-2">
   
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">Cash Collector Dashboard</h1>
        <p class="text-slate-400 mt-1">Monitor payment collections and order status</p>
      </div>
       
 

      
      <form @submit.prevent="createOrder" class="flex flex-col md:flex-row gap-2 w-full md:w-auto">
        <input
          v-model="newCustomer.name"
          placeholder="Customer Name"
          required
          class="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="newCustomer.phone"
          placeholder="Phone"
          class="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model.number="newOrder.total_amount"
          type="number"
          placeholder="Total amount"
          required
          class="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
        >
          + Add Order
        </button>
        <div class="flex gap-2">



 
</div>
      </form>
    </div>

    
    <p v-if="successMessage" class="text-center text-green-400 mb-6 font-semibold">
      {{ successMessage }}
    </p>

    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 class="text-slate-400 text-sm mb-2">Total Collected</h3>
        <div class="text-2xl font-bold text-white">Rs. {{ totalCollected.toLocaleString() }}</div>
      </div>

      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 class="text-slate-400 text-sm mb-2">Outstanding</h3>
        <div class="text-2xl font-bold text-orange-400">Rs. {{ totalOutstanding.toLocaleString() }}</div>
      </div>

      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 class="text-slate-400 text-sm mb-2">Fully Paid Orders</h3>
        <div class="text-2xl font-bold text-green-400">{{ fullyPaidCount }}</div>
      </div>

      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 class="text-slate-400 text-sm mb-2">Collection Rate</h3>
        <div class="text-2xl font-bold text-purple-400">{{ collectionRate }}%</div>
      </div>
    </div>

    
    <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div class="p-6 border-b border-slate-700">
        <h2 class="text-xl font-semibold text-white">Order Collections</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-700">
              <th class="p-4 text-left">ID</th>
              <th class="p-4 text-left">Customer</th>
              <th class="p-4 text-left">Phone</th>
              <th class="p-4 text-left">Total</th>
              <th class="p-4 text-left">Paid</th>
              <th class="p-4 text-left">Remaining Balance</th>
              <th class="p-4 text-left">Status</th>
              <th class="p-4 text-left">Payment</th>
              <th class="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-b border-slate-700 hover:bg-slate-750">
              <td class="p-4">{{ order.id }}</td>
              <td class="p-4">{{ order.customer?.name ?? '—' }}</td>
              <td class="p-4">{{ order.customer?.phone ?? '—' }}</td>
              <td class="p-4">Rs. {{ order.total_amount }}</td>
              <td class="p-4">Rs. {{ order.paid_amount }}</td>
               <td class="p-4">Rs. {{ order.remaining }}</td>
              <td class="p-4">
                <span :class="getStatusBadgeClass(order.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ order.status }}
                </span>
              </td>
              <td class="p-4">
                <input
                  v-model.number="paymentAmounts[order.id]"
                  type="number"
                  placeholder="Amount"
                  class="px-2 py-1 rounded bg-slate-700 border border-slate-600 w-24"
                />
                <button
                  @click="updatePayment(order.id)"
                  class="ml-2 bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg"
                >
                  Pay
                </button>
              </td>
              <td class="p-4 flex gap-2">
                <button @click="editOrder(order)" class="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg" title="Edit">
                  ✏️
                </button>
                <button @click="deleteOrder(order.id)" class="p-2 bg-red-600 hover:bg-red-700 rounded-lg" title="Delete">
                  🗑
                </button>
                <button @click="downloadInvoice(order.id)" class="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg" title="Invoice">
                  🧾
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    
    <div v-if="editingOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-slate-800 p-6 rounded-xl max-w-md w-full border border-slate-700">
        <h3 class="text-xl font-semibold text-white mb-4 text-center">
          Edit Order #{{ editingOrder.id }}
        </h3>
        <input v-model.number="editingOrder.total_amount" type="number"
          class="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white mb-4" />
        <div class="flex gap-3">
          <button @click="updateOrder" class="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg">Update</button>
          <button @click="cancelEdit" class="flex-1 bg-slate-600 hover:bg-slate-700 py-2 rounded-lg">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      orders: [],
      newOrder: { total_amount: null },
      newCustomer: { name: '', phone: '' },
      paymentAmounts: {},
      editingOrder: null,
      successMessage: '',

    }
  },
  computed: {
     
    totalCollected() {
      return this.orders.reduce((sum, o) => sum + o.paid_amount, 0)
    },
    totalOutstanding() {
      return this.orders.reduce((sum, o) => sum + (o.total_amount - o.paid_amount), 0)
    },
    fullyPaidCount() {
      return this.orders.filter(o => o.status === 'paid').length
    },
    collectionRate() {
      const total = this.orders.reduce((sum, o) => sum + o.total_amount, 0)
      return total > 0 ? ((this.totalCollected / total) * 100).toFixed(1) : 0
    }
  },
  mounted() {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      const res = await axios.get('/orders')
      this.orders = res.data
    },
    logout() {
    axios.post('/logout')
      .then(() => window.location.href = '/')
      .catch(err => console.error('Logout failed', err));
  },


    
    async createOrder() {
      if (!this.newCustomer.name) return alert('Customer name required');

      try {
        const customerRes = await axios.post('/customers', this.newCustomer);
        const customerId = customerRes.data.id;

        const res = await axios.post('/orders', {
          total_amount: this.newOrder.total_amount,
          customer_id: customerId
        });

        this.successMessage = 'Order and Customer created successfully';
        this.newOrder.total_amount = null;
        this.newCustomer = { name: '', phone: '' };
        this.fetchOrders();
      } catch (err) {
        alert('Error: ' + (err.response?.data?.message || err.message));
      }
    },

    async updatePayment(id) {
      try {
        await axios.post(`/orders/${id}/payment`, { paid_amount: this.paymentAmounts[id] || 0 });
        this.successMessage = 'Payment updated successfully';
        this.paymentAmounts[id] = null;
        this.fetchOrders();
      } catch (err) {
        alert('Error: ' + (err.response?.data?.message || err.message));
      }
    },

    editOrder(order) {
      this.editingOrder = { ...order }
    },
    cancelEdit() {
      this.editingOrder = null
    },
    async updateOrder() {
      try {
        await axios.put(`/orders/${this.editingOrder.id}`, { total_amount: this.editingOrder.total_amount });
        this.successMessage = 'Order updated successfully';
        this.editingOrder = null;
        this.fetchOrders();
      } catch (err) {
        alert('Error: ' + (err.response?.data?.message || err.message));
      }
    },
    async deleteOrder(id) {
      if (confirm('Are you sure?')) {
        await axios.delete(`/orders/${id}`);
        this.successMessage = 'Order deleted successfully';
        this.fetchOrders();
      }
    },
    async downloadInvoice(orderId) {
  try {
    // Request backend to generate a new invoice
    const res = await axios.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });

    const blob = new Blob([res.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    // Optional: filename with timestamp for uniqueness
    const timestamp = new Date().getTime();
    link.download = `invoice-${orderId}-${timestamp}.pdf`;
    link.click();

    this.successMessage = 'Invoice generated successfully';
  } catch (err) {
    alert('Error generating invoice: ' + (err.response?.data?.message || err.message));
  }
}
,
    getStatusBadgeClass(status) {
      switch (status) {
        case 'paid': return 'bg-green-500/20 text-green-400 border border-green-500/30'
        case 'partial': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
        default: return 'bg-red-500/20 text-red-400 border border-red-500/30'
      }
    }
  }
}
</script>
