mermaid.initialize({ startOnLoad: true, themeVariables: { fontFamily: 'Fredoka, sans-serif', } });

document.getElementById("loadingAnim").style.display = "none";
let language = "English";
let tagListSN = [];
let tagListMM = [];

let mode = 'qna';
let histories = { qna: "", sn: "", mm: "", chat: {} };

let extractedText = ''; // To store extracted text from PDF
let finishedReading = false; // Flag to indicate if PDF reading is finished

let errorMessage = "We couldn't retrieve the AI response. This might be due to a server issue or<br>a problem with your internet connection. Please try again later.";

// userID = crypto.randomUUID();
userID = '3b79e111-d4d4-4527-bfe1-dd7a0c2229b1';
console.log("User ID: " + userID);

// const proxyUrl = 'https://cors-anywhere.herokuapp.com/https://tcep-vercel-proxy.vercel.app/api/proxy';
const n8nURL = 'https://thedummy.app.n8n.cloud/webhook/0c2588ad-0a69-4a5a-8a55-571fe5789ba7';

// Normal function to get AI response from the backend
async function getAIResponse(_prompt) {
    console.log("waiting for the AI response...");

	const response = await fetch(n8nURL, {
        method: "POST",
        headers: {
            'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Magic-Word',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json',
            'Magic-Word': 'Abracadabra',
        },
        body: JSON.stringify({ 'userID': userID, 'chatInput': false, 'prompt': _prompt })
    }).catch((error) => {
        console.error('Error fetching AI response:', error)
        document.getElementById("loadingAnim").style.display = "none";
        showAnError(errorMessage);
        return { response: "Error" };
    });

    const data = await response.json();
    console.log(data, response.status);
    document.getElementById("loadingAnim").style.display = "none";
    return data.output;
}

async function sendAMessage(_prompt, messageBox) {
    console.log("waiting for the AI response...");

	const response = await fetch(n8nURL, {
        method: "POST",
        headers: {
            'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Magic-Word',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json',
            'Magic-Word': 'Abracadabra',
        },
        body: JSON.stringify({ 'userID': userID, 'chatInput': true, 'prompt': _prompt })
    }).catch((error) => {
        console.error('Error fetching AI response:', error)
        document.getElementById("loadingAnim").style.display = "none";
        showAnErrorMessage(messageBox, errorMessage);
        histories['chat'][`"${errorMessage}"`] = 'ai';
        return { response: "Error" };
    });

    const data = await response.json();
    console.log(data, response.status);
    document.getElementById("loadingAnim").style.display = "none";
    return data.output;
}

document.getElementById("language").addEventListener("change", (event) => {
    event.target.checked ? language = "Sinhala" : language = "English";
    console.log("Language changed to: " + language);
});


function showAnError(error) {
    document.getElementById("output").innerHTML = error;
    document.getElementById("output").style.color = "#ff2929ff";
    document.getElementById("output").style.alignItems = "center";
    document.getElementById("output").style.textAlign = "center";
}
function showAnErrorMessage(messageBox, error) {
    messageBox.querySelector('div').innerHTML = error;
    messageBox.querySelector('div').style.color = "#ff2929ff";
    messageBox.querySelector('div').style.alignItems = "center";

    messageBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function generate(_prompt, _reload) {
    document.getElementById("loadingAnim").style.display = "flex";

    if (document.getElementById("output").hasAttribute('data-processed')) document.getElementById("output").removeAttribute('data-processed');

    getAIResponse(_prompt).then(result => {
        document.getElementById("output").innerHTML = result;
        document.getElementById("output").style.color = "white";
        document.getElementById("output").style.alignItems = "flex-start";
        document.getElementById("output").style.textAlign = "left";

        if (mode === 'chat') histories[mode].push(result);
        else histories[mode] = result;

        // MathJax.typeset();  // LaTeX rendering (MathJax)
        switch (_reload) {
            case "m":
                mermaid.run();  // Mermaid rendering
                break;
            case "l":
                MathJax.typeset();  // LaTeX rendering (MathJax)
                break;
            default:
                break;
        }
    });
}

function generateQnA() {
    const grade = document.getElementById("gradeqna").value;
    const subject = document.getElementById("subjectqna").value;
    const difficulty = document.getElementById("difficultyqna").value;
    const noq = document.getElementById("noqqna").value;
    const syllabusSection = document.getElementById("syllabusSectionqna").value;
    const _prompt = `Generate ${noq} ${difficulty} difficulty level questions within the ${syllabusSection} of the ${grade} ${subject} Syllabus in only ${language} language.`;
    generate(_prompt, 'l');

    // console.log('Selected variables:', grade, subject, difficulty, noq, syllabusSection);
    console.log('Prompt:', _prompt);
}
function generateShortNotes() {
    const grade = document.getElementById("gradesn").value;
    const subject = document.getElementById("subjectsn").value;
    const units = tagListSN.join(', ');

    if (units.length !== 0) {
        const _prompt = `Generate a short note on ${units} unit(s) of ${grade} ${subject} in only ${language} language.`;
        generate(_prompt, 'l');
        // console.log('Selected variables:', grade, subject, units);
        console.log('Prompt:', _prompt);
    } else {
        showAnError("Please select at least one unit.");
    }
}
function generateMindMaps() {
    const grade = document.getElementById('grademm').value;
    const subject = document.getElementById("subjectmm").value;
    const units = tagListMM.join(', ');
    console.log(units);

    if (units.length !== 0) {
        const _prompt = `Generate a mind map containing every important part on ${units} unit(s) of the ${grade} ${subject} in only ${language} language. (strictly follow the guidelines provided in the System Message)`;
        document.getElementById("output").classList.add('mermaid');
        generate(_prompt, 'm');
        // console.log('Selected variables:', grade, subject, units);
        console.log('Prompt:', _prompt);
    } else {
        showAnError('Please select at least one unit.');
    }
}
function chatWithAI() {
    const chatInput = document.getElementById("chatInputField").value;
    let _prompt = `${chatInput}. Respond only in ${language} language.`;

    if (chatInput === '') return; 

    const userMessageBox = document.createElement('div');
    document.getElementById("output").appendChild(userMessageBox);
    userMessageBox.classList.add('message-box', 'userMessageBox');
    userMessageBox.innerHTML = `<div class="message userMessage"><span>${chatInput}</span></div>`;
    histories['chat'][`"${chatInput}"`] = 'user';

    const messageBox = document.createElement('div');
    document.getElementById("output").appendChild(messageBox);
    messageBox.classList.add('message-box');
    messageBox.innerHTML = `<div class="message"><l-dot-pulse size="40" speed="1.2" color="white" ></l-dot-pulse></div>`;

    if (extractedText !== '') {
        _prompt = `${chatInput}. Respond only in ${language} language. Use the following information extracted from the attached PDF file to answer the question more accurately: ${extractedText}`;
    }
    sendAMessage(_prompt, messageBox).then(result => {
        // Append user message
        messageBox.innerHTML = `<div class="message"><span>${result}</span></div>`;
        histories['chat'][`"${result}"`] = 'ai';
        MathJax.typeset();  // LaTeX rendering (MathJax)
        // Scroll to the bottom of the output div
        messageBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    messageBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    console.log('Chat Input:', chatInput);
    console.log('Prompt:', _prompt);
    document.getElementById("chatInputField").value = ""; // Clear input field after sending
}


// Add an event listener for the 'keydown' event
document.getElementById('chatInputField').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // Prevent the default form submission behavior (if the input is inside a form)
        event.preventDefault(); 
        
        // Execute your desired function or action here
        console.log('Enter key pressed in the input field!');
        // Trigger the send button click
        document.getElementById('sendbtn').click(); 
    }
});


// Render history
function recoverHistory(){
    document.getElementById('output').innerHTML = "";
    if (document.getElementById("output").hasAttribute('data-processed')) document.getElementById("output").removeAttribute('data-processed');

    if (mode !== 'chat') {
        document.getElementById('output').innerHTML = histories[mode];
        if (mode !== 'mm') document.getElementById('output').classList.remove('mermaid')
    }
    else {
        for (const message in histories['chat']) {
            const messageBox = document.createElement('div');
            document.getElementById("output").appendChild(messageBox);
            messageBox.classList.add('message-box');
            if (histories['chat'][message] === 'user') {
                messageBox.classList.add('userMessageBox');
                messageBox.innerHTML = `<div class="message userMessage"><span>${message.replaceAll('"', '')}</span></div>`;
            } else {
                messageBox.innerHTML = `<div class="message"><span>${message.replaceAll('"', '')}</span></div>`;
            }
        }
    }

    if (mode === 'mm' && histories[mode] !== "") {
        document.getElementById('output').classList.add('mermaid');
        mermaid.run();
    }
    else {
		document.addEventListener("DOMContentLoaded", () => {
			MathJax.typeset();
		}
	}
}
recoverHistory();


// Download mind map as an PNG file
function downloadMindMap() {
    const svg = document.getElementById('output').querySelector('svg');
    if (!svg) {
        alert("Mind map is not rendered yet!");
        return;
    }

    // Serialize SVG
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();

    // Optional: preserve styles/fonts from the page
    const svgStyle = getComputedStyle(svg);
    img.onload = function () {
        const rect = svg.getBoundingClientRect();
        const scale = 4; // scale up for retina resolution
        const canvas = document.createElement('canvas');
        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale); // scale context
        ctx.drawImage(img, 0, 0, rect.width, rect.height);

        // Trigger download
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Add 1 and pad
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // const timeStamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `mindmap-${year}-${month}-${day}_${hours}-${minutes}-${seconds}.png`;
        link.click();

        URL.revokeObjectURL(url);
    };

    img.onerror = function (e) {
        console.error("Failed to load SVG as image", e);
        URL.revokeObjectURL(url);
    };

    img.src = url;
}


// Extract text from PDF file using pdf.js (something is wrong in the function. moved the code to the attachPDF function)
function extractTextFromPDF(file) {
    const reader = new FileReader();

    reader.onload = function() {
        const pdfData = new Uint8Array(reader.result);

        // Load PDF using pdf.js
        pdfjsLib.getDocument(pdfData).promise.then(pdf => {
            let extractedText = '';

            // Loop through each page in the PDF
            const extractPageText = async (pageNum) => {
                if (pageNum > pdf.numPages) {
                    // console.log(extractedText); // All text extracted
                    return extractedText;
                }

                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                
                // Append the text from each item
                textContent.items.forEach(item => {
                    extractedText += item.str + ' ';
                });

                extractPageText(pageNum + 1); // Recursively process the next page
            };

            // Start extracting text from the first page
            extractPageText(1);
        }).catch(error => {
            console.error('Error loading PDF: ', error);
        });
    };

    reader.readAsArrayBuffer(file);
}

// Attach a PDF file
function attachPDF() {
    const fileInput = document.getElementById('attachPDF');
    const customText = document.getElementById('custom-text');

    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected PDF file:", file);
            customText.innerText = 'Reading the PDF...';
            console.log("File size (bytes):", file.size);
            console.log("File type:", file.type);


            // process the uploaded file as needed

            const reader = new FileReader();

            reader.onload = function() {
                const pdfData = new Uint8Array(reader.result);

                // Load PDF using pdf.js
                pdfjsLib.getDocument(pdfData).promise.then(pdf => {
                    // Loop through each page in the PDF
                    const extractPageText = async (pageNum) => {
                        if (pageNum > pdf.numPages) {
                            // console.log(extractedText); // All text extracted
                            finishedReading = true;
                            console.log("Finished reading the PDF.");
                            customText.innerText = file.name;
                            document.getElementById('attachFiles').style.border = "2px dashed #00970e"; // Change border color to indicate success
                            return;
                        }

                        const page = await pdf.getPage(pageNum);
                        const textContent = await page.getTextContent();
                        
                        // Append the text from each item
                        textContent.items.forEach(item => {
                            extractedText += item.str + ' ';
                        });

                        extractPageText(pageNum + 1); // Recursively process the next page
                    };

                    // Start extracting text from the first page
                    extractPageText(1);
                }).catch(error => {
                    console.error('Error loading PDF: ', error);
                });
            };

            reader.readAsArrayBuffer(file);

            // const data = extractTextFromPDF(file);
        } else {
            customText.innerText = "No file chosen, yet";
            document.getElementById('attachFiles').style.border = "2px dashed #444"; // Change border color to indicate success
        }
    };

    // input.click();
}



// UI Handling
var _btn = document.getElementById("btn");
var _qna = document.getElementById("qna");
var _shortnotes = document.getElementById("shortnotes");
var _mindmaps = document.getElementById("mindmaps");

function qna() {
    mode = 'qna';
    document.getElementById("form-box").style.display = "flex";
    _qna.style.left = "calc(100% / 3)";
    _shortnotes.style.left = "calc(100% / 3)";
    _mindmaps.style.left = "calc(100% / 3)";
    _btn.classList.add("selected0");
    _btn.classList.remove("selected1");
    _btn.classList.remove("selected2");
    _btn.classList.remove("selected3");

    _qna.classList.add("active");
    _shortnotes.classList.remove("active");
    _mindmaps.classList.remove("active");
    console.log("Q&A");

    document.getElementById("downloadMindMap").style.display = "none"; // Disable the download button
    document.getElementById("chatInput").style.display = "none"; // Hide chat section
    document.getElementById("attachFiles").style.display = "none"; // Hide attach section
    recoverHistory();
}

function shortnotes() {
    mode = 'sn';
    document.getElementById("form-box").style.display = "flex";
    _qna.style.left = "0px";
    _shortnotes.style.left = "0px";
    _mindmaps.style.left = "0px";
    _btn.classList.remove("selected0");
    _btn.classList.add("selected1");
    _btn.classList.remove("selected2");
    _btn.classList.remove("selected3");

    _qna.classList.remove("active");
    _shortnotes.classList.add("active");
    _mindmaps.classList.remove("active");
    console.log("Short Notes");

    document.getElementById("downloadMindMap").style.display = "none"; // Disable the download button
    document.getElementById("chatInput").style.display = "none"; // Hide chat section
    document.getElementById("attachFiles").style.display = "none"; // Hide attach section
    recoverHistory();
}

function mindmaps() {
    mode = 'mm';
    document.getElementById("form-box").style.display = "flex";
    _qna.style.left = "calc(-100% / 3)";
    _shortnotes.style.left = "calc(-100% / 3)";
    _mindmaps.style.left = "calc(-100% / 3)";
    _btn.classList.remove("selected0");
    _btn.classList.remove("selected1");
    _btn.classList.add("selected2");
    _btn.classList.remove("selected3");

    _qna.classList.remove("active");
    _shortnotes.classList.remove("active");
    _mindmaps.classList.add("active");
    console.log("Mind Maps");

    document.getElementById("downloadMindMap").style.display = "block"; // Enable the download button
    document.getElementById("chatInput").style.display = "none"; // Hide chat section
    document.getElementById("attachFiles").style.display = "none"; // Hide attach section
    recoverHistory();
}

function chatMode() {
    mode = 'chat';
    document.getElementById("form-box").style.display = "none";
    _btn.classList.remove("selected0");
    _btn.classList.remove("selected1");
    _btn.classList.remove("selected2");
    _btn.classList.add("selected3");

    _qna.classList.remove("active");
    _shortnotes.classList.remove("active");
    _mindmaps.classList.remove("active");
    console.log("Chat");

    document.getElementById("downloadMindMap").style.display = "none"; // Disable the download button
    document.getElementById("chatInput").style.display = "flex"; // Show chat section
    document.getElementById("attachFiles").style.display = "flex"; // Show attach section
    recoverHistory();
    document.getElementById('chatInputField').focus(); // Keep the focus on the input field
}


function updateUnitList(key) {
    var grade, subject, unitSelect, unitSelection;
    switch (key) {
        case 'SN':
            grade = document.getElementById("gradesn").value;
            subject = document.getElementById("subjectsn").value;
            unitSelect = document.getElementById("unitssn");
            unitSelection = document.getElementById("unitSelectionSN");
            break;
        case 'MM':
            grade = document.getElementById("grademm").value;
            subject = document.getElementById("subjectmm").value;
            unitSelect = document.getElementById("unitsmm");
            unitSelection = document.getElementById("unitSelectionMM");
            break;
    
        default:
            break;
    }

    // Clear existing options
    unitSelect.innerHTML = "";
    // Clear the tag list and displayed tags
    if (key === 'SN') tagListSN = [];
    else tagListMM = [];
    unitSelection.innerHTML = "";

    // NEED ATTENTION ................................................................................................................................................

    // Define unit options based on grade and subject
    let units = {};
    if (grade === "grade 12" && subject === "Combined Mathematics") units = CM12;
    else if (grade === "grade 12" && subject === "Physics") units = Phy12;
    else if ((grade === "grade 12" || grade === "grade 13") && subject === "ICT") units = ICTAL;
    else if (grade === "grade 12" && subject === "Chemistry") units = Chem12;
    else if (grade === "grade 13" && subject === "Combined Mathematics") units = CM13;
    else if (grade === "grade 13" && subject === "Physics") units = Phy13;
    else if (grade === "grade 13" && subject === "Chemistry") units = Chem13;

    // Loop through the 'units' object to create <optgroup> and <option> elements
    for (const term in units) {
        if (units.hasOwnProperty(term)) {
            // Create the <optgroup> for each term
            const optgroup = document.createElement('optgroup');
            optgroup.label = term;  // Set the label for the optgroup

            // Loop through the units for each term and create <option> elements
            units[term].forEach(unit => {
                const option = document.createElement('option');
                option.value = unit;  // Set the value of the option
                option.textContent = unit;  // Set the text of the option
                if (optgroup.label === '') {
                    option.disabled = true; // Disable the placeholder option
                    option.selected = true; // Select the placeholder option by default
                }
                optgroup.appendChild(option);  // Append the option to the optgroup
            });

            // Append the <optgroup> to the dropdown
            unitSelect.appendChild(optgroup);
        }
    }
}


// Enable a specific option in the dropdown
function enableOption(unit, dropdown) {
    // const dropdown = document.getElementById('unitssn');
    for (const group of dropdown.getElementsByTagName('optgroup')) {
        for (const option of group.getElementsByTagName('option')) {
            if (option.value === unit) {
                option.disabled = false;  // Enable the option
                break;
            }
        }
    }
}

// Disable a specific option in the dropdown
function disableOption(unit, dropdown) {
    // const dropdown = document.getElementById('unitssn');
    for (const group of dropdown.getElementsByTagName('optgroup')) {
        for (const option of group.getElementsByTagName('option')) {
            if (option.value === unit) {
                option.disabled = true;  // Disable the option
                break;
            }
        }
    }
}

function addTag(key) {
    var unitSelect, unitSelection;
    switch (key) {
        case 'SN':
            unitSelect = document.getElementById('unitssn');
            unitSelection = document.getElementById('unitSelectionSN');
            break;
        case 'MM':
            unitSelect = document.getElementById('unitsmm');
            unitSelection = document.getElementById('unitSelectionMM');
    
        default:
            break;
    }
    // const unitSelect = document.getElementById('unitssn');
    const selectedUnit = unitSelect.value;
    if (!selectedUnit) return;  // If no unit is selected, do nothing (fail safe)


    // Create a tag for the selected unit
    const tag = document.createElement('div');
    tag.classList.add('tag');
    tag.textContent = selectedUnit;

    // Create a close button for the tag
    const closeButton = document.createElement('p');
    closeButton.textContent = '✖';
    closeButton.onclick = function() {
        tag.remove();

        // Enable the option back in the dropdown
        enableOption(selectedUnit, unitSelect);
        if (key === 'SN') tagListSN = tagListSN.filter(item => item !== selectedUnit);
        else tagListMM = tagListMM.filter(item => item !== selectedUnit);
    };

    tag.appendChild(closeButton);
    // document.getElementById('unitSelection').appendChild(tag);
    unitSelection.appendChild(tag);

    // Disable the selected unit option in the dropdown
    disableOption(selectedUnit, unitSelect);
    if (key === 'SN') tagListSN.push(selectedUnit);
    else tagListMM.push(selectedUnit);
}

// Update the unit list
updateUnitList('SN');
updateUnitList('MM');

const inputs = document.querySelectorAll(".input");

function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}
function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}
inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});
