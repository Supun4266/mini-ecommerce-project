<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CashierController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
});


Route::middleware(['auth'])->group(function () {

    
    Route::get('/cashier', [CashierController::class, 'index'])->name('cashier.index');

    Route::get('/orders', [CashierController::class, 'getOrders'])->name('orders.index');
    Route::post('/orders', [CashierController::class, 'createOrder'])->name('orders.store');
    Route::post('/orders/{id}/payment', [CashierController::class, 'updatePayment'])->name('orders.payment');
    Route::put('/orders/{id}', [CashierController::class, 'update'])->name('orders.update');
    Route::delete('/orders/{id}', [CashierController::class, 'destroy'])->name('orders.destroy');
    Route::get('/orders/{id}/invoice', [CashierController::class, 'generateInvoice'])->name('orders.invoice');

    
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');

    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
    Route::post('/logout', function () {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return redirect('/login');
    })->name('logout');
});

require __DIR__.'/auth.php';

