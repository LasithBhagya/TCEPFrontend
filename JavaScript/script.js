document.getElementById("loadingAnim").style.display = "none";

async function getAIResponse(_prompt) {
    console.log("waiting for the AI response...");

    const response = await fetch('https://thedummy.app.n8n.cloud/webhook-test/0c2588ad-0a69-4a5a-8a55-571fe5789ba7', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Magic-Word': 'Abracadabra',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true'
        },
        body: JSON.stringify({ _prompt })
    });

    const data = await response.json();
    console.log(data);
    console.log(response.status, response.statusText);
    document.getElementById("loadingAnim").style.display = "none";
    return data.response;
}

const _prompt = 'Generate 10 questions within the 1st and 2nd terms of the grade 12 Combined Mathematics Syllabus.'
document.getElementById("sendToAgent").addEventListener("click", () => {
    document.getElementById("loadingAnim").style.display = "block";
    getAIResponse(_prompt).then(result => {
        document.getElementById("output").innerHTML = result;
    });
});

// getAIResponse(_prompt).then(result => {
//     document.getElementById("output").innerHTML = result;
// });
