<div class="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-none border-none space-y-6">
    <header class="mb-4 text-center">
        <h2 class="text-3xl font-bold mb-2">{{ __('Profile Information') }}</h2>
        <p class="text-sm text-gray-400">{{ __("Update your account's profile information and email address.") }}</p>
    </header>

    <form id="send-verification" method="post" action="{{ route('verification.send') }}">
        @csrf
    </form>

    <form method="post" action="{{ route('profile.update') }}" class="space-y-6">
        @csrf
        @method('patch')

        <div>
            <label for="name" class="block text-sm font-medium text-gray-300">{{ __('Name') }}</label>
            <input id="name" name="name" type="text" value="{{ old('name', $user->name) }}" required autofocus autocomplete="name"
                class="mt-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500" />
            <x-input-error class="mt-2 text-red-400" :messages="$errors->get('name')" />
        </div>

        <div>
            <label for="email" class="block text-sm font-medium text-gray-300">{{ __('Email') }}</label>
            <input id="email" name="email" type="email" value="{{ old('email', $user->email) }}" required autocomplete="username"
                class="mt-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500" />
            <x-input-error class="mt-2 text-red-400" :messages="$errors->get('email')" />
        </div>

        <div class="flex items-center gap-4">
            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition">
                {{ __('Save') }}
            </button>

            @if (session('status') === 'profile-updated')
                <p x-data="{ show: true }" x-show="show" x-transition x-init="setTimeout(() => show = false, 2000)" class="text-sm text-green-400">
                    {{ __('Saved.') }}
                </p>
            @endif
        </div>
    </form>
</div>
