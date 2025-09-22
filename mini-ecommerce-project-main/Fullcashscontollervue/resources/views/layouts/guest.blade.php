<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans antialiased bg-gray-900 text-white">
        <div class="min-h-screen flex flex-col sm:justify-center items-center">
            
            <!-- OPTIONAL: Add Your Logo (Replace with your own image) -->
            {{-- 
            <div class="mb-6">
                <img src="{{ asset('images/logo.png') }}" alt="App Logo" class="h-20 w-auto">
            </div>
            --}}
            
            <!-- Content Slot Without Box -->
            {{ $slot }}
            
        </div>
    </body>
</html>
