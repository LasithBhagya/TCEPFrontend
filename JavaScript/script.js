document.getElementById("loadingAnim").style.display = "none";
var language = "English";
let tagList = [];

const proxyUrl = 'https://cors-anywhere.herokuapp.com/https://tcep-vercel-proxy.vercel.app/api/proxy';

async function getAIResponse(_prompt) {
    console.log("waiting for the AI response...");

    // const response = await fetch(proxyUrl, {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ _prompt })
    // }).catch((error) => {
    //     console.error('Error fetching AI response:', error)
    //     document.getElementById("loadingAnim").style.display = "none";
    //     showAnError("We couldn't retrieve the AI response. This might be due to a server issue or<br>a problem with your internet connection. Please try again later.");
    //    return { response: "Error" };
    //});

	const response = await fetch('https://thedummy.app.n8n.cloud/webhook/0c2588ad-0a69-4a5a-8a55-571fe5789ba7', {
        method: "POST",
        headers: {
            'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json',
			// changed some things
        },
        body: JSON.stringify({ _prompt })
    }).catch((error) => {
        console.error('Error fetching AI response:', error)
        document.getElementById("loadingAnim").style.display = "none";
        showAnError("We couldn't retrieve the AI response. This might be due to a server issue or<br>a problem with your internet connection. Please try again later.");
        return { response: "Error" };
    });

    const data = await response.json();
    console.log(data);
    console.log(response.status);
    document.getElementById("loadingAnim").style.display = "none";
    return data.response;
}

// document.getElementById("sendToAgent").addEventListener("click", () => {
//     document.getElementById("loadingAnim").style.display = "block";
//     getAIResponse(_prompt).then(result => {
//         document.getElementById("output").innerHTML = result;
//     });
// });

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


function generate(_prompt) {
    document.getElementById("loadingAnim").style.display = "flex";
    getAIResponse(_prompt).then(result => {
        document.getElementById("output").innerHTML = result;
        document.getElementById("output").style.color = "white";
        document.getElementById("output").style.alignItems = "flex-start";
        document.getElementById("output").style.textAlign = "left";
        MathJax.typeset();  // LaTeX rendering (MathJax)
    });
}

function generateQnA() {
    const grade = document.getElementById("gradeqna").value;
    const subject = document.getElementById("subjectqna").value;
    const difficulty = document.getElementById("difficultyqna").value;
    const noq = document.getElementById("noqqna").value;
    const syllabusSection = document.getElementById("syllabusSectionqna").value;
    const _prompt = `Generate ${noq} ${difficulty} difficulty level questions within the ${syllabusSection} of the ${grade} ${subject} Syllabus in only ${language} language.`;
    generate(_prompt);

    console.log('Selected variables:', grade, subject, difficulty, noq, syllabusSection);
    console.log('Prompt:', _prompt);
}
function generateShortNotes() {
    const grade = document.getElementById("gradesn").value;
    const subject = document.getElementById("subjectsn").value;
    const units = tagList.join(', ');

    if (units.length !== 0) {
        const _prompt = `Generate a short note on ${units} unit(s) of ${grade} ${subject} in only ${language} language.`;
        generate(_prompt);
        console.log('Selected variables:', grade, subject, units);
        console.log('Prompt:', _prompt);
    } else {
        showAnError("Please select at least one unit.");
    }
}
function generateMindMaps() {
    const _prompt = 'Generate a mind map on the 1st and 2nd terms of the grade 12 physics Syllabus.';
    generate(_prompt);
}

// getAIResponse(_prompt).then(result => {
//     document.getElementById("output").innerHTML = result;
// });



// UI Handling
var _btn = document.getElementById("btn");
var _qna = document.getElementById("qna");
var _shortnotes = document.getElementById("shortnotes");
var _mindmaps = document.getElementById("mindmaps");

function qna() {
    _qna.style.left = "calc(100% / 3)";
    _shortnotes.style.left = "calc(100% / 3)";
    _mindmaps.style.left = "calc(100% / 3)";
    _btn.style.left = "0rem";

    _qna.classList.add("active");
    _shortnotes.classList.remove("active");
    _mindmaps.classList.remove("active");
    console.log("Q&A");
}

function shortnotes() {
    _qna.style.left = "0px";
    _shortnotes.style.left = "0px";
    _mindmaps.style.left = "0px";
    _btn.style.left = "10rem";

    _qna.classList.remove("active");
    _shortnotes.classList.add("active");
    _mindmaps.classList.remove("active");
    console.log("Short Notes");
}

function mindmaps() {
    _qna.style.left = "calc(-100% / 3)";
    _shortnotes.style.left = "calc(-100% / 3)";
    _mindmaps.style.left = "calc(-100% / 3)";
    _btn.style.left = "20rem";

    _qna.classList.remove("active");
    _shortnotes.classList.remove("active");
    _mindmaps.classList.add("active");
    console.log("Mind Maps");
}


function updateSNUnitList() {
    const grade = document.getElementById("gradesn").value;
    const subject = document.getElementById("subjectsn").value;
    const unitSelect = document.getElementById("unitssn");

    // Clear existing options
    unitSelect.innerHTML = '';
    // Clear the tag list and displayed tags
    tagList = [];
    document.getElementById("unitSelection").innerHTML = '';

    // Define unit options based on grade and subject
    let units = {};
    if (grade === "grade 12" && subject === "Combined Mathematics") {
        units = {
            '': [
                'Select the units you want'
            ],
            'First Term': [
                'Real numbers',
                'Functions',
                'Angular measurements',
                'Rectangular cartesian system, Straight line',
                'Circular functions',
                'sine rule, cosine rule',
                'Polynomials',
                'Trigonometric identities',
                'Rational functions',
                'Index laws and logarithmic laws',
                'Basic properties of inequalities and solutions of inequalities',
                'Solving trigonometric equations',
                'Vectors',
                'Systems of coplanar forces acting at a point'
            ],
            'Second Term': [
                'Quadratic functions and quadratic equations',
                'Inverse trigonometric functions',
                'Limits',
                'System of coplanar forces acting on a rigid body',
                'Motion in a straight line'
            ],
            'Third Term': [
                'Derivatives',
                'Applications of derivatives',
                'Projectiles',
                'Equilibirium of three coplanar forces',
                'Friction',
                'Relative mortion',
                "Newton's laws of motion"
            ]
        };
    } else if (grade === "grade 12" && subject === "Physics") {
        units = {
            '': [
                'Select the units you want'
            ],
            'Grade 12 Physics syllabus': [
                'Measurement',
                'Mechanics',
                'Oscillations and Waves',
                'Thermal Physics'
            ],
        };
    } else if (grade === "grade 13" && subject === "Combined Mathematics") {
        units = {
            '': [
                'Select the units you want'
            ],
            'First Term': [
                'Straight line',
                'Intergration',
                'Jointed rods',
                'Frame works',
                'Impulse and collision',
                'Work, power, energy',
                'Circular rotion'
            ],
            'Second Term': [
                'Circle',
                'Permutations and Combinations',
                'Principle of Mathematical Induction',
                'Series',
                'Probability',
                'Simple harmonic motion',
                'Center of mass'
            ],
            'Third Term': [
                'Binomial expansion',
                'Complex numbers',
                'Matrices',
                'Probability',
                'Statistics'
            ]
        };
    } else if (grade === "grade 13" && subject === "Physics") {
        units = {
            '': [
                'Select the units you want'
            ],
            'Grade 13 Physics syllabus': [
                'Gravitational Field',
                'Electrostatic field',
                'Magnetic Field',
                'Current Electricity',
                'Electronics',
                'Mechanical Properties of Matter',
                'Matter and Radiation'
            ],
        };
    }

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
function enableOption(unit) {
    const dropdown = document.getElementById('unitssn');
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
function disableOption(unit) {
    const dropdown = document.getElementById('unitssn');
    for (const group of dropdown.getElementsByTagName('optgroup')) {
        for (const option of group.getElementsByTagName('option')) {
            if (option.value === unit) {
                option.disabled = true;  // Disable the option
                break;
            }
        }
    }
}

function addTag() {
    const unitSelect = document.getElementById('unitssn');
    const selectedUnit = unitSelect.value;
    if (!selectedUnit) return;  // If no unit is selected, do nothing


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
        enableOption(selectedUnit);
        tagList.pop(selectedUnit);
    };

    tag.appendChild(closeButton);
    document.getElementById('unitSelection').appendChild(tag);

    // Disable the selected unit option in the dropdown
    disableOption(selectedUnit);
    tagList.push(selectedUnit);
}

updateSNUnitList(); // Initial call to populate units based on default selections

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
