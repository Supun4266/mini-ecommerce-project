<x-guest-layout>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">

        <!-- ✅ SVG Logo at the Top (Centered, with gap below) -->
        <div class="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 120" width="180" height="55" role="img" aria-labelledby="logoFullTitle logoFullDesc">
                <title id="logoFullTitle">SalesTrack — Sales Tracking System</title>
                <desc id="logoFullDesc">Logo mark animates; text fades in.</desc>
                <style>
                    .bar { fill: #0ea5a4; transform-origin: center bottom; animation: grow 850ms ease-out forwards; }
                    .bar.b2 { fill: #7c3aed; animation-delay: 200ms; }
                    .bar.b3 { fill: #06b6d4; animation-delay: 400ms; }
                    .arrow { stroke: #f59e0b; stroke-width: 4; fill: none; stroke-linecap: round; stroke-linejoin: round;
                            stroke-dasharray: 140; stroke-dashoffset: 140; animation: drawArrow 950ms cubic-bezier(.2,.9,.2,1) forwards; }
                    .pulse { fill: #f97316; animation: pulse 1200ms ease-out infinite; transform-origin: 294px 34px; }
                    .word { font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
                            font-weight:700; fill:#e6eef6; font-size:26px; opacity:0; animation: fadeIn 600ms 1.1s forwards ease-out; }
                    .tag { font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
                           font-weight:500; fill:#9fb3c8; font-size:12px; opacity:0; animation: fadeIn 600ms 1.3s forwards ease-out; }

                    @keyframes grow { from { transform: scaleY(0.06); } to { transform: scaleY(1); } }
                    @keyframes drawArrow { to { stroke-dashoffset: 0; } }
                    @keyframes pulse { 0% { transform: scale(0.9); opacity: 0.95; }
                                       50% { transform: scale(1.35); opacity: 0.35; }
                                       100% { transform: scale(0.9); opacity: 0.95; } }
                    @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
                </style>

                <!-- mark -->
                <g transform="translate(18,14)">
                    <rect x="0" y="0" width="100" height="92" rx="14" fill="#081426"/>
                    <rect class="bar b1" x="22" y="32" width="10" height="40" rx="2" />
                    <rect class="bar b2" x="40" y="20" width="10" height="52" rx="2" />
                    <rect class="bar b3" x="58" y="8" width="10" height="64" rx="2" />
                    <path class="arrow" d="M66 16 L80 2 L94 16" />
                    <path class="arrow" d="M74 8 L74 44" />
                    <circle class="pulse" cx="94" cy="16" r="3.5" />
                </g>

                <!-- wordmark -->
                <g transform="translate(140,52)">
                    <text class="word" x="0" y="0">SalesTrack</text>
                    <text class="tag" x="0" y="26">Sales Tracking System</text>
                </g>
            </svg>
        </div>

        <!-- ✅ Registration Form -->
        <div class="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-none border-none">
            <h2 class="text-3xl font-bold text-center mb-6">
                Create a New Account
            </h2>

            <form method="POST" action="{{ route('register') }}" class="space-y-6">
                @csrf

                <!-- Full Name -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-300">Full Name</label>
                    <input id="name" type="text" name="name"
                        value="{{ old('name') }}" required autofocus autocomplete="name"
                        class="mt-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500" />
                    <x-input-error :messages="$errors->get('name')" class="mt-2 text-red-400" />
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
                    <input id="email" type="email" name="email"
                        value="{{ old('email') }}" required autocomplete="username"
                        class="mt-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500" />
                    <x-input-error :messages="$errors->get('email')" class="mt-2 text-red-400" />
                </div>

                <!-- Password -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
                    <input id="password" type="password" name="password"
                        required autocomplete="new-password"
                        class="mt-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500" />
                    <x-input-error :messages="$errors->get('password')" class="mt-2 text-red-400" />
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-300">Confirm Password</label>
                    <input id="password_confirmation" type="password" name="password_confirmation"
                        required autocomplete="new-password"
                        class="mt-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500" />
                    <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2 text-red-400" />
                </div>

                <!-- Register Button -->
                <button type="submit"
                    class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg shadow-lg transition">
                    {{ __('Register') }}
                </button>

                <p class="mt-4 text-center text-sm text-gray-400">
                    Already have an account?
                    <a href="{{ route('login') }}" class="text-indigo-400 hover:text-indigo-300 font-semibold">
                        Login here
                    </a>
                </p>
            </form>
        </div>
    </div>
</x-guest-layout>
