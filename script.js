document.addEventListener('DOMContentLoaded', () => {
    const classroom = document.getElementById('classroom');
    const classSelect = document.getElementById('classSelect');
    let dragged;

    document.addEventListener('drag', function(event) {
    }, false);

    document.addEventListener('dragstart', function(event) {
        dragged = event.target;
        event.target.style.opacity = .5;
    }, false);

    document.addEventListener('dragend', function(event) {
        event.target.style.opacity = "";
    }, false);

    document.addEventListener('dragover', function(event) {
        event.preventDefault();
    }, false);

    document.addEventListener('dragenter', function(event) {
        if (event.target.className === "student") {
            event.target.style.background = "purple";
        }
    }, false);

    document.addEventListener('dragleave', function(event) {
        if (event.target.className === "student") {
            event.target.style.background = "";
        }
    }, false);

    document.addEventListener('drop', function(event) {
        event.preventDefault();
        if (event.target.className === "student") {
            event.target.style.background = "";
            classroom.insertBefore(dragged, event.target);
        }
    }, false);

    classroom.addEventListener('click', function(event) {
        if (event.target.classList.contains('marks')) {
            const marks = event.target;
            let currentMarks = parseInt(marks.innerText);
            marks.innerText = currentMarks + 1;
        }
        if (event.target.classList.contains('good-comments')) {
            const goodComments = event.target;
            let currentGoodComments = parseInt(goodComments.innerText);
            goodComments.innerText = currentGoodComments + 1;
        }
    });

    loadClassOptions();
    loadSeatingPlan();
});

function addStudent() {
    const studentName = document.getElementById('studentName').value;
    if (studentName.trim() === "") {
        alert("Please enter a student name.");
        return;
    }

    const student = document.createElement('div');
    student.className = 'student';
    student.draggable = true;

    const namePara = document.createElement('p');
    namePara.innerText = studentName;
    student.appendChild(namePara);

    const marks = document.createElement('div');
    marks.className = 'marks';
    marks.innerText = '0';
    student.appendChild(marks);

    const goodComments = document.createElement('div');
    goodComments.className = 'good-comments';
    goodComments.innerText = '0';
    student.appendChild(goodComments);

    document.getElementById('classroom').appendChild(student);

    document.getElementById('studentName').value = "";
}

function setSeatingPlan() {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);

    if (isNaN(rows) || isNaN(columns) || rows <= 0 || columns <= 0) {
        alert("Please enter valid numbers for rows and columns.");
        return;
    }

    const classroom = document.getElementById('classroom');
    classroom.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    classroom.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    // Clear existing students when setting a new seating plan
    classroom.innerHTML = '';
}

function saveSeatingPlan() {
    const className = prompt("Enter the class name:");
    if (!className) {
        alert("Class name is required to save the seating plan.");
        return;
    }

    const classroom = document.getElementById('classroom');
    const students = classroom.getElementsByClassName('student');
    const seatingPlan = [];

    for (let student of students) {
        const name = student.getElementsByTagName('p')[0].innerText;
        const marks = student.getElementsByClassName('marks')[0].innerText;
        const goodComments = student.getElementsByClassName('good-comments')[0].innerText;
        seatingPlan.push({ name, marks, goodComments });
    }

    let allPlans = JSON.parse(localStorage.getItem('allSeatingPlans')) || {};
    allPlans[className] = seatingPlan;
    localStorage.setItem('allSeatingPlans', JSON.stringify(allPlans));

    loadClassOptions();
    alert('Seating plan saved!');
}

function loadSeatingPlan() {
    const classSelect = document.getElementById('classSelect');
    const className = classSelect.value;

    if (!className) {
        alert("Please select a class to load the seating plan.");
        return;
    }

    const allPlans = JSON.parse(localStorage.getItem('allSeatingPlans'));
    if (!allPlans || !allPlans[className]) {
        alert('No saved seating plan found for the selected class.');
        return;
    }

    const seatingPlan = allPlans[className];
    const classroom = document.getElementById('classroom');
    classroom.innerHTML = ''; // Clear existing students

    for (let studentData of seatingPlan) {
        const student = document.createElement('div');
        student.className = 'student';
        student.draggable = true;

        const namePara = document.createElement('p');
        namePara.innerText = studentData.name;
        student.appendChild(namePara);

        const marks = document.createElement('div');
        marks.className = 'marks';
        marks.innerText = studentData.marks;
        student.appendChild(marks);

        const goodComments = document.createElement('div');
        goodComments.className = 'good-comments';
        goodComments.innerText = studentData.goodComments;
        student.appendChild(goodComments);

        classroom.appendChild(student);
    }

    document.getElementById('classNameDisplay').innerText = `Class: ${className}`;
    alert('Seating plan loaded!');
}

function loadClassOptions() {
    const classSelect = document.getElementById('classSelect');
    const allPlans = JSON.parse(localStorage.getItem('allSeatingPlans')) || {};

    classSelect.innerHTML = ''; // Clear existing options
    for (let className in allPlans) {
        const option = document.createElement('option');
        option.value = className;
        option.innerText = className;
        classSelect.appendChild(option);
    }
}