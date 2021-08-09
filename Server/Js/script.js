let Languages = [];
let QuestionsData = [];

let QuestionsAmount;
let LanguageIndex;
let QuestionIndices;
let QuestionNumber;
let CorrectAmount;

function getQuestions(file, index) {

    $.get(file, function(data) {

        let lines = data.split("\n");

        for (let line of lines) {
            if (line === "") break;

            let lineSplit = line.split("; ");
            let phonList = lineSplit[0].split(" ");
            let wordList = lineSplit[1].split(" ");
            QuestionsData[index].push([phonList, wordList]);

        }

    });

}

function getData() {

    $.get("/Data/languages.txt", function(data) {

        let lines = data.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] === "") break;

            let lineSplit = lines[i].split("; ");
            Languages.push(lineSplit[0]);
            QuestionsData.push([]);

            let element = document.createElement("option");
            element.innerHTML = lineSplit[0];
            element.setAttribute("value", i)
            $("#inputLanguage").append(element);

            getQuestions("/Data/" + lineSplit[1], i);

        }

    })

}

function newGame(questions, language) {

    LanguageIndex = language;
    QuestionIndices = [];
    QuestionNumber = 0;
    CorrectAmount = 0;

    let questionsMax = QuestionsData[LanguageIndex].length;

    while (QuestionIndices.length < Math.min(questions, questionsMax)) {
        let i = Math.floor(Math.random() * questionsMax);
        if (QuestionIndices.indexOf(i) == -1) {
            QuestionIndices.push(i);
        }
    }

    QuestionsAmount = QuestionIndices.length;

    nextQuestion();

}

function nextQuestion() {

    let questionIndex = QuestionIndices[QuestionNumber];
    let question = QuestionsData[LanguageIndex][questionIndex];

    let transcr = "/";
    for (let phon of question[0]) {
        transcr += phon;
    }
    transcr += "/";

    let questionText = "Question: " + (QuestionNumber + 1) + "/" + QuestionsAmount;
    let correctText = "Correct: " + CorrectAmount;

    $("#questionNumber").html(questionText);
    $("#correctCurrect").html(correctText);
    $("#transcription").html(transcr);

    $("#inputWord").val("");
    $("#inputWord").removeClass("color-correct");
    $("#inputWord").removeClass("color-wrong");
    $("#inputWord").prop("disabled", false);
    $("#inputWord").focus();

    $("#buttonNext").hide();
    $("#solutionText").html("");

}

function check() {

    inputWord = $("#inputWord").val()
    inputWord = inputWord.trim();
    inputWord = inputWord.toLowerCase();

    if (inputWord == "") return;

    let questionIndex = QuestionIndices[QuestionNumber];
    let question = QuestionsData[LanguageIndex][questionIndex];

    let correct = false;
    let solutionText = "";

    for (let i = 0; i < question[1].length; i++) {
        let word = question[1][i];

        if (i != 0) {
            solutionText += ", ";
        }
        solutionText += word;

        if (inputWord == word.toLowerCase()) {
            correct = true;
        }
    }

    if (correct) {
        $("#inputWord").addClass("color-correct");
        CorrectAmount++;
    }
    else {
        $("#inputWord").addClass("color-wrong");
    }

    let correctText = "Correct: " + CorrectAmount;

    $("#correctCurrect").html(correctText);
    $("#inputWord").prop("disabled", true);
    $("#buttonNext").show();
    $("#buttonNext").focus();
    $("#solutionText").html(solutionText);

}

function viewResults() {

    let correctText = "Correct: " + CorrectAmount + "/" + QuestionsAmount;
    $("#correctFinal").html(correctText);

}

$(document).ready(function() {

    getData();

});

$("#buttonStart").click(function() {

    let questions = Number($("#inputQuestions").val());
    let language = Number($("#inputLanguage").val());

    $("#menu").hide();
    $("#quiz").show();

    newGame(questions, language);

});

$("#inputWord").keyup(function (event) {

    if (event.keyCode === 13) {
        check();
    }

});

$("#buttonNext").click(function () {

    QuestionNumber++;
    if (QuestionNumber < QuestionsAmount) {
        nextQuestion();
    }
    else {
        $("#quiz").hide();
        $("#results").show();
        viewResults();
    }

});

$("#buttonNewQuiz").click(function() {

    $("#results").hide();
    $("#menu").show();

});
