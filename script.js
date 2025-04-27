let map;

function lookupIP(ip = '') {
  const url = ip ? `https://ipwho.is/${ip}` : `https://ipwho.is/`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert('Invalid IP address!');
        return;
      }

      // Set values by ID
      document.getElementById('ip').innerText = data.ip || 'N/A';
      document.getElementById('isp').innerText = data.connection?.isp || 'N/A';
      document.getElementById('city').innerText = data.city || 'N/A';
      document.getElementById('region').innerText = data.region || 'N/A';

      const countryFlag = data.flag?.img ? `<img src="${data.flag.img}" alt="Flag" style="width:25px;vertical-align:middle;margin-right:5px;">` : '';
      document.getElementById('country').innerHTML = countryFlag + (data.country || 'N/A');

      document.getElementById('latitude').innerText = data.latitude ?? 'N/A';
      document.getElementById('longitude').innerText = data.longitude ?? 'N/A';
      document.getElementById('timezone').innerText = data.timezone?.id || 'N/A';

      // Format local time
      let localTime = 'N/A';
      if (data.timezone?.id) {
        try {
          const now = new Date();
          localTime = new Intl.DateTimeFormat('en-US', {
            timeZone: data.timezone.id,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).format(now);
        } catch (error) {
          console.error('Timezone error:', error);
        }
      }
      document.getElementById('localtime').innerText = localTime;


      document.getElementById('org').innerText = data.connection?.org || 'N/A';

      // Update Map
      const lat = data.latitude;
      const lon = data.longitude;
      if (map) {
        map.remove();
        map = null;
      }
      map = L.map('map').setView([lat, lon], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>Approximate Location</b><br>${data.city}, ${data.country}`)
        .openPopup();
    })
    .catch(() => {
      alert('Failed to load IP information.');
    });
}


// Call initially to get user's IP
lookupIP();

// Hook up the search input
document.getElementById('ip-search-button').addEventListener('click', () => {
  const ip = document.getElementById('ip-input').value.trim();
  lookupIP(ip);
});
