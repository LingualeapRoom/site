function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var dropzone = event.target;

    // Asegúrate de que el elemento de destino sea una zona de caída
    if (dropzone.classList.contains('dropzone') && !dropzone.hasChildNodes()) {
        dropzone.appendChild(document.getElementById(data));
    }
}

function checkAnswers() {
    const correctAnswers = {
        q1: 'a1',
        q2: 'a2',
        q3: 'a3',
        q4: 'a4',
        q5: 'a5',
        q6: 'a6',
        q7: 'a7'
    };

    for (const [questionId, answerId] of Object.entries(correctAnswers)) {
        const questionElement = document.getElementById(questionId);
        const answerElement = questionElement.firstChild;

        if (answerElement && answerElement.id === answerId) {
            questionElement.classList.add('correct');
            questionElement.classList.remove('incorrect');
        } else {
            questionElement.classList.add('incorrect');
            questionElement.classList.remove('correct');
        }
    }
}

function retry() {
    const dropzones = document.querySelectorAll('.dropzone');
    dropzones.forEach(dropzone => {
        if (dropzone.hasChildNodes()) {
            const answer = dropzone.firstChild;
            document.querySelector('.answers-container').appendChild(answer);
        }
        dropzone.classList.remove('correct', 'incorrect');
    });
}