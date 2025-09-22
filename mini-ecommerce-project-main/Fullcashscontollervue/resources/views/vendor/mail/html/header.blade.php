@props(['url'])

<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            @if (trim($slot) === 'SalesTrack')
                <img src="https://i.imgur.com/izucPnJ.png" alt="SalesTrack Logo" style="height: 64px; width: auto;">
            @else
                {!! $slot !!}
            @endif
        </a>
    </td>
</tr>
