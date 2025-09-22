<div class="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-none border-none space-y-6">
    <header class="space-y-2 text-center">
        <h2 class="text-3xl font-bold">{{ __('Delete Account') }}</h2>
        <p class="text-sm text-gray-400">{{ __('Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.') }}</p>
    </header>

    <x-danger-button x-data="" x-on:click.prevent="$dispatch('open-modal', 'confirm-user-deletion')"
        class="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition">
        {{ __('Delete Account') }}
    </x-danger-button>

    <x-modal name="confirm-user-deletion" :show="$errors->userDeletion->isNotEmpty()" focusable>
        <form method="post" action="{{ route('profile.destroy') }}" class="space-y-6 p-6">
            @csrf
            @method('delete')

            <h2 class="text-lg font-medium text-gray-200">{{ __('Are you sure you want to delete your account?') }}</h2>
            <p class="text-sm text-gray-400">{{ __('Please enter your password to confirm.') }}</p>

            <div>
                <x-input-label for="password" value="{{ __('Password') }}" class="sr-only" />
                <x-text-input id="password" name="password" type="password"
                    class="mt-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="{{ __('Password') }}" required />
                <x-input-error :messages="$errors->userDeletion->get('password')" class="mt-2 text-red-400" />
            </div>

            <div class="flex justify-end space-x-3 mt-4">
                <x-secondary-button x-on:click="$dispatch('close')"
                    class="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition">
                    {{ __('Cancel') }}
                </x-secondary-button>

                <x-danger-button class="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition">
                    {{ __('Delete Account') }}
                </x-danger-button>
            </div>
        </form>
    </x-modal>
</div>
