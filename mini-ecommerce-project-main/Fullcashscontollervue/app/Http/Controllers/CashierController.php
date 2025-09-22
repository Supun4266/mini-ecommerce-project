<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Order;
use App\Models\Invoice;

class CashierController extends Controller
{
    public function index()
    {
        return view('cashier'); 
    }

    public function getOrders()
    {
        $orders = Order::where('user_id', auth()->id())
            ->with('customer')
            ->get()
            ->map(function ($order) {
                $order->remaining = $order->total_amount - $order->paid_amount;
                return $order;
            });

        return response()->json($orders);
    }

    public function createOrder(Request $request)
    {
        $request->validate([
            'customer_id'   => 'required|exists:customers,id',
            'total_amount'  => 'required|numeric|min:0'
        ]);

        $order = Order::create([
            'customer_id'  => $request->customer_id,
            'user_id'      => auth()->id(), 
            'total_amount' => $request->total_amount,
            'paid_amount'  => 0,
            'status'       => 'pending',
            'invoice_id'   => null, // remove invoice assignment here
        ]);

        return response()->json($order->load('customer'));
    }

    public function update(Request $request, $id)
    {
        $request->validate(['total_amount' => 'required|numeric|min:0']);

        $order = Order::where('user_id', auth()->id())->findOrFail($id);

        $order->total_amount = $request->total_amount;
        $order->status = $order->paid_amount >= $order->total_amount 
            ? 'paid' 
            : ($order->paid_amount > 0 ? 'partial' : 'pending');

        $order->save();

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order
        ]);
    }

    public function destroy($id)
    {
        $order = Order::where('user_id', auth()->id())->findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }

    public function updatePayment(Request $request, $id)
    {
        $request->validate(['paid_amount' => 'required|numeric|min:0']);

        $order = Order::where('user_id', auth()->id())->findOrFail($id);

        $order->paid_amount += $request->paid_amount;
        $order->status = $order->paid_amount >= $order->total_amount ? 'paid' : 'partial';
        $order->save();

        return response()->json($order);
    }

    public function generateInvoice($id)
    {
        $order = Order::where('user_id', auth()->id())->findOrFail($id);

        // ✅ Always create a new invoice for each PDF generation
        $invoice = Invoice::create([
            'order_id' => $order->id,
            'amount'   => $order->total_amount,
        ]);

        // Update order's latest invoice_id (optional)
        $order->invoice_id = $invoice->id;
        $order->save();

        $remaining = $order->total_amount - $order->paid_amount;

        $pdf = Pdf::loadView('invoices.invoice', [
            'order'     => $order,
            'invoice'   => $invoice,
            'remaining' => $remaining
        ]);

        return $pdf->download("invoice-{$invoice->id}.pdf");
    }
}
