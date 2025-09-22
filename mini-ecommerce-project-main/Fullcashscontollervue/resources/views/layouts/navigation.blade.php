<nav x-data="{ open: false }" class="bg-gray-800 border-b border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex items-center">
                  <a href="{{ route('cashier.index') }}" class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 120" width="180" height="50" role="img" aria-labelledby="logoFullTitle logoFullDesc">
                        <title id="logoFullTitle">SalesTrack — Sales Tracking System</title>
                        <desc id="logoFullDesc">Logo mark animates; text fades in.</desc>
                        <style>
                            .bar { fill: #0ea5a4; transform-origin: center bottom; animation: grow 850ms ease-out forwards; }
                            .bar.b2 { fill: #7c3aed; animation-delay: 200ms; }
                            .bar.b3 { fill: #06b6d4; animation-delay: 400ms; }
                            .arrow { stroke: #f59e0b; stroke-width: 4; fill: none; stroke-linecap: round; stroke-linejoin: round;
                                    stroke-dasharray: 140; stroke-dashoffset: 140; animation: drawArrow 950ms cubic-bezier(.2,.9,.2,1) forwards; }
                            .pulse { fill: #f97316; animation: pulse 1200ms ease-out infinite; transform-origin: 294px 34px; }
                            .word { font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; font-weight:700; fill:#e6eef6; font-size:28px; opacity:0; animation: fadeIn 600ms 1.1s forwards ease-out; }
                            .tag { font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; font-weight:500; fill:#9fb3c8; font-size:12px; opacity:0; animation: fadeIn 600ms 1.3s forwards ease-out; }

                            @keyframes grow { from { transform: scaleY(0.06); } to { transform: scaleY(1); } }
                            @keyframes drawArrow { to { stroke-dashoffset: 0; } }
                            @keyframes pulse {
                              0% { transform: scale(0.9); opacity: 0.95; }
                              50% { transform: scale(1.35); opacity: 0.35; }
                              100% { transform: scale(0.9); opacity: 0.95; }
                            }
                            @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
                        </style>

                        <!-- mark -->
                        <g transform="translate(18,14)">
                            <rect x="0" y="0" width="100" height="92" rx="14" fill="#081426"/>
                            <!-- bars -->
                            <rect class="bar b1" x="22" y="32" width="10" height="40" rx="2" />
                            <rect class="bar b2" x="40" y="20" width="10" height="52" rx="2" />
                            <rect class="bar b3" x="58" y="8" width="10" height="64" rx="2" />
                            <!-- arrow -->
                            <path class="arrow" d="M66 16 L80 2 L94 16" transform="" />
                            <path class="arrow" d="M74 8 L74 44" />
                            <!-- pulse -->
                            <circle class="pulse" cx="94" cy="16" r="3.5" />
                        </g>

                        <!-- wordmark -->
                        <g transform="translate(140,52)">
                            <text class="word" x="0" y="0">SalesTrack</text>
                            <text class="tag" x="0" y="26">Sales Tracking System</text>
                        </g>
                    </svg>
                </a>
                <!-- Navigation Links -->
                <div class="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                    <x-nav-link 
                        :href="route('cashier.index')" 
                        :active="request()->routeIs('cashier.index')"
                        class="text-white text-lg font-semibold"
                    >
                        {{ __('Cashier') }}
                    </x-nav-link>
                </div>
            </div>

            <!-- Settings Dropdown -->
            <div class="hidden sm:flex sm:items-center sm:ml-6">
                <x-dropdown align="right" width="48">
                    <x-slot name="trigger">
                        <button class="inline-flex items-center px-3 py-2 border border-transparent text-lg font-semibold rounded-md text-gray-200 bg-gray-800 hover:text-white focus:outline-none transition ease-in-out duration-150">
                            <div class="text-lg font-semibold">{{ Auth::user()->name }}</div>
                            <div class="ml-1">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </button>
                    </x-slot>

                    <x-slot name="content">
                        <x-dropdown-link :href="route('profile.edit')">
                            {{ __('Profile') }}
                        </x-dropdown-link>

                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <x-dropdown-link :href="route('logout')"
                                    onclick="event.preventDefault(); this.closest('form').submit();">
                                {{ __('Log Out') }}
                            </x-dropdown-link>
                        </form>
                    </x-slot>
                </x-dropdown>
            </div>

            <!-- Hamburger -->
            <div class="-mr-2 flex items-center sm:hidden">
                <button @click="open = ! open" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition duration-150 ease-in-out">
                    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path :class="{'hidden': open, 'inline-flex': ! open }" class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        <path :class="{'hidden': ! open, 'inline-flex': open }" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Responsive Navigation Menu -->
    <div :class="{'block': open, 'hidden': ! open}" class="hidden sm:hidden bg-gray-800">
        <div class="pt-2 pb-3 space-y-1">
            <x-responsive-nav-link :href="route('cashier.index')" :active="request()->routeIs('cashier.index')">
                {{ __('Cashier') }}
            </x-responsive-nav-link>
        </div>

        <div class="pt-4 pb-1 border-t border-gray-700">
            <div class="px-4">
                <div class="font-medium text-lg text-white">{{ Auth::user()->name }}</div>
                <div class="font-medium text-sm text-gray-300">{{ Auth::user()->email }}</div>
            </div>

            <div class="mt-3 space-y-1">
                <x-responsive-nav-link :href="route('profile.edit')">
                    {{ __('Profile') }}
                </x-responsive-nav-link>

                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <x-responsive-nav-link :href="route('logout')"
                            onclick="event.preventDefault(); this.closest('form').submit();">
                        {{ __('Log Out') }}
                    </x-responsive-nav-link>
                </form>
            </div>
        </div>
    </div>
</nav>
