console.log("Hello, World!");

const data = 'fname=Lasith&lname=Bhagya';

fetch(`https://thedummy.app.n8n.cloud/webhook-test/0c2588ad-0a69-4a5a-8a55-571fe5789ba7?${data}`, {
    method: 'GET', // or 'POST', 'PUT', etc.
    headers: {
        'Magic-Word': 'Abracadabra'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
