
const fileInput = document.getElementById('fileInput');
const searchInput = document.getElementById('searchInput');
const elementList = document.getElementById('elementList');
const loaderContainer = document.getElementById('loader-container');

fileInput.addEventListener('change', handleFileUpload);
searchInput.addEventListener('input', filterElements);

let elements = [];

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        loaderContainer.style.display = 'flex';

        const reader = new FileReader();
        reader.onload = function (e) {
            elements = parseCSV(e.target.result);
            displayElements(elements);
        };

        const chunkSize = 1024 * 1024;
        let offset = 0;

        function readNextChunk() {
            const chunk = file.slice(offset, offset + chunkSize);
            reader.readAsBinaryString(chunk);
            offset += chunkSize;

            if (offset < file.size) {
                setTimeout(readNextChunk, 0);
            }
        }

        readNextChunk();
    }
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const elements = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        const element = {};

        for (let j = 0; j < headers.length; j++) {
            element[headers[j]] = currentLine[j];
        }

        elements.push(element);
    }

    return elements;
}

function displayElements(elementsToDisplay) {
    const noDataMessage = document.querySelector('.no-data-message');
    elementList.innerHTML = '';

    if (elementsToDisplay.length === 0) {
        noDataMessage.style.display = 'block';
    } else {
        noDataMessage.style.display = 'none';
    }

    elementsToDisplay.forEach((element, index) => {
        const li = document.createElement('li');
        const elementValues = Object.values(element).join(',');
        li.textContent = `${index + 1}.${elementValues}`;
        li.style.height = '30px';
        elementList.appendChild(li);
    });

    loaderContainer.style.display = 'none';
}

function filterElements() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredElements = elements.filter((element) => {
        return (
            element.firstName.toLowerCase().includes(searchTerm) ||
            element.lastName.toLowerCase().includes(searchTerm) ||
            element.street.toLowerCase().includes(searchTerm) ||
            element.city.toLowerCase().includes(searchTerm)
        );
    });

    displayElements(filteredElements);
}




