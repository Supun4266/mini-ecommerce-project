<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $invoice->id }}</title>
    <style>
        body { font-family: sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { border: 1px solid #000; padding: 8px; text-align: center; }
        .summary { margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Product Delivery System - Invoice</h2>
        <p>Invoice ID: {{ $invoice->id }}</p> <!-- use order id as invoice id -->
<p>Order ID: {{ $order->id }}</p>
<p>Date: {{ $order->created_at->format('Y-m-d') }}</p>

<table class="table">
    <tr>
        <th>Order ID</th>
        <th>Customer name</th>
        <th>Customer no</th>
        
        <th>Total Amount</th>
        <th>Paid Amount</th>
        <th>Remaining Balance</th>
        <th>Status</th>
    </tr>
    <tr>
         <td>{{ number_format($order->id) }}</td>
    <td>{{ $order->customer->name }}</td>
<td>{{ $order->customer->phone ?? 'N/A' }}</td>
        <td>Rs. {{ number_format($order->total_amount, 2) }}</td>
        <td>Rs. {{ number_format($order->paid_amount, 2) }}</td> <!-- directly from order -->
        <td>Rs. {{ number_format($remaining, 2) }}</td>
        <td>{{ ucfirst($order->status) }}</td>
    </tr>
</table>


    <div class="summary">
        <p><strong>Payment Status:</strong> 
            {{ $order->status == 'paid' ? 'Fully Paid' : 'Partially Paid / Pending' }}
        </p>
    </div>
</body>
</html>
