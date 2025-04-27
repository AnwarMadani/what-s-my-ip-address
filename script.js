function lookupIP(ip = '') {
    const url = ip ? `https://ipwho.is/${ip}` : `https://ipwho.is/`;

    fetch(url)
    .then(res => res.json())
    .then(data => {
        if(!data.success){
            alert('Invalid IP address!');
            return;
        }
        console.log(data)

        document.getElementById('ip').innerText = data.ip || 'N/A';
    })
}