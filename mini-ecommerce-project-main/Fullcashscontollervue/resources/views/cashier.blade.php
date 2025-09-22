<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cashier Dashboard</title>
    @vite('resources/js/app.js')
</head>
<body class="bg-slate-900 p-6 mb-1">
    
  <!-- Top Bar -->
  <div class="flex items-start justify-between -mb-4">
      
      <!-- Left: SVG Logo -->
      <div class="transform scale-50 origin-top-left -mt-4">
          {!! file_get_contents(public_path('images/salestrack.svg')) !!}
      </div>

      <!-- Right: Greeting + Avatar -->
      <div class="flex items-center gap-3 mt-1">
          <span id="user-greeting" class="text-white text-lg font-semibold"></span>
          <div id="user-avatar"
              class="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-lg cursor-pointer hover:bg-slate-600 transition"
              onclick="window.location.href='/profile'">
          </div>
      </div>
  </div>

  {{-- Vue App --}}
  <div id="app" class="w-full -mt-10"></div>

  <script>
      window.user = @json(auth()->user());

      document.addEventListener("DOMContentLoaded", function () {
          if (window.user && window.user.name) {
              document.getElementById("user-greeting").textContent =
                  `Hello, ${window.user.name}`;
              document.getElementById("user-avatar").textContent =
                  window.user.name.charAt(0).toUpperCase();
          }
      });
  </script>

</body>
</html>
