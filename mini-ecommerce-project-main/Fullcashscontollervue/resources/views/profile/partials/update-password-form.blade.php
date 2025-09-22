<div class="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-none border-none space-y-6">
    <header class="mb-4 text-center">
        <h2 class="text-3xl font-bold mb-2">{{ __('Update Password') }}</h2>
        <p class="text-sm text-gray-400">{{ __('Ensure your account is using a long, random password to stay secure.') }}</p>
    </header>

    <form method="post" action="{{ route('password.update') }}" class="space-y-6">
        @csrf
        @method('put')

        <div>
            <x-input-label for="update_password_current_password" :value="__('Current Password')" class="text-gray-300" />
            <x-text-input id="update_password_current_password" name="current_password" type="password"
                class="mt-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500" />
            <x-input-error :messages="$errors->updatePassword->get('current_password')" class="mt-2 text-red-400" />
        </div>

        <div>
            <x-input-label for="update_password_password" :value="__('New Password')" class="text-gray-300" />
            <x-text-input id="update_password_password" name="password" type="password"
                class="mt-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500" />
            <x-input-error :messages="$errors->updatePassword->get('password')" class="mt-2 text-red-400" />
        </div>

        <div>
            <x-input-label for="update_password_password_confirmation" :value="__('Confirm Password')" class="text-gray-300" />
            <x-text-input id="update_password_password_confirmation" name="password_confirmation" type="password"
                class="mt-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500" />
            <x-input-error :messages="$errors->updatePassword->get('password_confirmation')" class="mt-2 text-red-400" />
        </div>

        <div class="flex flex-col items-center gap-4">
            <x-primary-button class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition">
                {{ __('Save') }}
            </x-primary-button>

            @if (session('status') === 'password-updated')
                <p x-data="{ show: true }" x-show="show" x-transition x-init="setTimeout(() => show = false, 2000)" class="text-sm text-gray-400 mt-2">
                    {{ __('Saved.') }}
                </p>
            @endif
        </div>
    </form>
</div>
