// Variables for data/config

let LanguageNames = []; // List of all language names
let QuestionData  = []; // List of question data for all languages
let PhonemeHelp   = []; // List of phoneme help for all languages
let Difficulties  = []; // List of difficulty levels for all languages
let QuestionsMin  = 1;  // Minimal amount of questions allowed
let QuestionsMax  = 20; // Maximal amount of questions allowed

// Variables for the current game

let QuestionsAmount; // Amount of questions
let LanguageIndex;   // Index of the language
let QuestionIndices; // List of indices of the questions
let QuestionNumber;  // Number of current question
let CorrectAmount;   // Number of questions correctly answered
let Answers;         // List of answers given


// #############
// ### Setup ###
// #############

// Download the data and fill the selects at the beginning
$(document).ready(async function() {

    await getData();
    fillLanguageSelect();
    updateDifficultySelect();

});

// Get the data for all languages
async function getData() {

    // Download data
    let data = await $.get("Data/languages.txt");

    let lines = data.split("\n");

    // Process each language
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === "") break;

        let lineSplit = lines[i].split("; ");

        // Store language name
        LanguageNames.push(lineSplit[0]);
        QuestionData.push([]);
        PhonemeHelp.push([]);
        Difficulties.push([]);

        // Get questions of the language
        await getQuestions("Data/" + lineSplit[1], i);

        // Get phoneme help of the language if available
        if (lineSplit[2] !== "") {
            await getPhonemeHelp("Data/" + lineSplit[2], i);
        }

        // Process and store difficulty levels
        let difficultiesSplit = lineSplit[3].split(", ");

        for (let j = 0; j < difficultiesSplit.length; j += 2) {

            let difficultyName = difficultiesSplit[j];
            let difficultyValue = Number(difficultiesSplit[j + 1]);
            Difficulties[i].push([difficultyName, difficultyValue]);

        }

    }

}

// Get all questions for a particular language
function getQuestions(filePath, languageIndex) {

    // Download data
    return $.get(filePath, function(data) {

        let lines = data.split("\n");

        // Process each question
        for (let line of lines) {
            if (line === "") break;

            // Split line into phonemes and word
            let lineSplit = line.split("; ");
            let phonemes = lineSplit[0].split(" ");
            let words = lineSplit[1].split(" ");

            // Append to question list
            QuestionData[languageIndex].push([phonemes, words]);

        }

    });

}

// Get the phoneme help for a particular language
function getPhonemeHelp(filePath, languageIndex) {

    // Download data
    return $.get(filePath, function(data) {

        let lines = data.split("\n");

        // Process each help entry
        for (let line of lines) {
            if (line === "") break;

            // Split line into phoneme and help word
            let lineSplit = line.split("; ");
            let phoneme = lineSplit[0];
            let helpWord = lineSplit[1];

            // Replace brackets in help word with span
            helpWord = helpWord.replace("(", "<span class=\"highlight\">");
            helpWord = helpWord.replace(")", "</span>");

            // Create HTML element for help entry
            let element = document.createElement("p");
            element.setAttribute("class", "text-normal");
            element.innerHTML = helpWord;

            PhonemeHelp[languageIndex][phoneme] = element.outerHTML;

        }

    });

}

// Fill the language select with language names
function fillLanguageSelect() {

    for (let i = 0; i < LanguageNames.length; i++) {

        // Create option and append to select
        let element = document.createElement("option");
        element.innerHTML = LanguageNames[i];
        element.setAttribute("value", i);
        $("#selectLanguage").append(element);

    }

}

// ####################
// ### Game Control ###
// ####################

// Update the levels of the difficulty select
function updateDifficultySelect() {

    // Get language index from select
    let languageIndex = Number($("#selectLanguage").val());

    // Get difficulty levels
    let difficulties = Difficulties[languageIndex];

    // Insert difficulty levels into select
    $("#selectDifficulty").empty();

    for (let i = 0; i < difficulties.length; i++) {

        let element = document.createElement("option");
        element.innerHTML = difficulties[i][0];
        element.setAttribute("value", i);
        $("#selectDifficulty").append(element);

    }

}

// Start a new game
function newGame(questionsAmount, languageIndex, difficultyLevel) {

    // Reset game variables
    LanguageIndex = languageIndex;
    QuestionIndices = [];
    QuestionNumber = 0;
    CorrectAmount = 0;
    Answers = [];

    // Randomly choose questions
    let difficultyValue = Difficulties[languageIndex][difficultyLevel][1];

    while (QuestionIndices.length < Math.min(questionsAmount, difficultyValue)) {
        let i = Math.floor(Math.random() * difficultyValue);
        if (QuestionIndices.indexOf(i) == -1) {
            QuestionIndices.push(i);
        }
    }

    QuestionsAmount = QuestionIndices.length;

    // Go to quiz page
    $("#menu").hide();
    $("#quiz").show();

    // Display first question
    nextQuestion();

}

// Display the next question
function nextQuestion() {

    // Get new question
    let questionIndex = QuestionIndices[QuestionNumber];
    let question = QuestionData[LanguageIndex][questionIndex];

    // Display number of new question
    let questionNumberText = "Question: " + (QuestionNumber + 1) + "/" + QuestionsAmount;
    $("#questionNumber").html(questionNumberText);

    // Update correct counter
    let correctText = "Correct: " + CorrectAmount;
    $("#correctCounter").html(correctText);

    // Insert transcription
    $(".phoneme").tooltip("dispose");
    $("#transcription").empty();
    $("#transcription").append("/");

    // Insert each phonemes of transcription
    for (let phoneme of question[0]) {

        // Create span element
        let element = document.createElement("span");
        element.innerHTML = phoneme;

        // Add tooltip if available
        let phonemeHelpHTML = PhonemeHelp[LanguageIndex][phoneme];
        if (phonemeHelpHTML != undefined) {

            element.setAttribute("class", "phoneme");

            $(element).tooltip({
                html: true,
                title: phonemeHelpHTML
            });

        }

        // Display phoneme
        $("#transcription").append(element);

    }

    $("#transcription").append("/");

    // Empty, enable, and focus word input
    $("#inputAnswer").val("");
    $("#inputAnswer").removeClass("color-correct");
    $("#inputAnswer").removeClass("color-wrong");
    $("#inputAnswer").prop("disabled", false);
    $("#inputAnswer").focus();

    // Hide next question button
    $("#buttonNextQuestion").hide();

    // Clear previous solution text
    $("#solutionText").html("");

}

// Check the answer given by user user
function check() {

    // Get user answer
    let answer = $("#inputAnswer").val();
    answer = answer.trim();
    answer = answer.toLowerCase();

    if (answer == "") return;

    // Get current question
    let questionIndex = QuestionIndices[QuestionNumber];
    let question = QuestionData[LanguageIndex][questionIndex];

    let correct = false;
    let solutionText = "";

    // Iterate over all solutions
    for (let i = 0; i < question[1].length; i++) {
        let word = question[1][i];

        // Add solution to solution list
        if (i != 0) {
            solutionText += ", ";
        }
        solutionText += word;

        // Check if answer matches solution
        if (answer == word.toLowerCase()) {
            correct = true;
        }
    }

    // Increase correct amount by 1 if answer is correct
    if (correct) CorrectAmount++;

    // Save answer
    Answers.push([answer, correct]);

    // Update correct counter
    let correctText = "Correct: " + CorrectAmount;
    $("#correctCounter").html(correctText);

    // Update color of answer accordingly and disable input
    coloClass = correct ? "color-correct" : "color-wrong";
    $("#inputAnswer").addClass(coloClass);
    $("#inputAnswer").prop("disabled", true);

    // Show and focus next question button
    $("#buttonNextQuestion").show();
    $("#buttonNextQuestion").focus();

    // Display all solutions
    $("#solutionText").html(solutionText);

}

// Display the results at the end of the game
function viewResults() {

    // Go to results page
    $("#quiz").hide();
    $("#results").show();

    // Clear previous results
    $("#resultsList").empty();

    // Fill in new results
    for (let i = 0; i < QuestionsAmount; i++) {

        // Get question
        let questionIndex = QuestionIndices[i];
        let question = QuestionData[LanguageIndex][questionIndex];

        // Create new row with two columns
        let row = document.createElement("div");
        row.setAttribute("class", "row");

        let colTranscription = document.createElement("div");
        colTranscription.setAttribute("class", "col-6");
        row.append(colTranscription);

        let colAnswer = document.createElement("div");
        colAnswer.setAttribute("class", "col-6");
        row.append(colAnswer);

        $("#resultsList").append(row);

        // Join phonemes together
        let transcription = "/";
        for (let phoneme of question[0]) {
            transcription += phoneme;
        }
        transcription += "/";

        // Insert transcription
        let pTranscription = document.createElement("p");
        pTranscription.setAttribute("class", "text-result text-center");
        pTranscription.innerHTML = transcription;
        colTranscription.append(pTranscription);

        // Determine color of answer
        let classes = "text-result text-center";
        if (Answers[i][1]) {
            classes += " color-correct";
        }
        else {
            classes += " color-wrong";
        }

        // Insert answer
        let pAnswer = document.createElement("p");
        pAnswer.setAttribute("class", classes);
        pAnswer.innerHTML = Answers[i][0];
        colAnswer.append(pAnswer);

    }

    // Display final correct amount
    let correctText = "Correct: " + CorrectAmount + "/" + QuestionsAmount;
    $("#correctFinal").html(correctText);

    // Focus new quiz button
    $("#buttonNewQuiz").focus();

}


// #################
// ### UI Events ###
// #################

// Button for decreasing the questions amount clicked
$("#buttonDecrease").click(function() {

    // Get questions amount
    let questionsAmount = Number($("#inputQuestions").val());

    // Decrease by 1 if possible
    if (Number.isInteger(questionsAmount) && QuestionsMin < questionsAmount && questionsAmount <= QuestionsMax) {
        $("#inputQuestions").val(questionsAmount - 1);
    }

});

// Button for increasing the questions amount clicked
$("#buttonIncrease").click(function() {

    // Get questions amount
    let questions = Number($("#inputQuestions").val());

    // Increase by 1 if possible
    if (Number.isInteger(questions) && QuestionsMin <= questions && questions < QuestionsMax) {
        $("#inputQuestions").val(questions + 1);
    }

});

// Selected language changed
$("#selectLanguage").change(function() {

    // Update the selectable difficulty options
    updateDifficultySelect();

});

// Button for starting the game clicked
$("#buttonStartQuiz").click(function() {

    // Get amount of questions, language index, and difficulty level chosen
    let questionsAmount = Number($("#inputQuestions").val());
    let languageIndex = Number($("#selectLanguage").val());
    let difficultyLevel = Number($("#selectDifficulty").val());

    // If amount of questions is in valid range
    if (Number.isInteger(questionsAmount) && QuestionsMin <= questionsAmount && questionsAmount <= QuestionsMax) {

        // Start a new game
        newGame(questionsAmount, languageIndex, difficultyLevel);

    }

    // Else, add a range waring to input
    else {

        let text = "Input must be a number between " + QuestionsMin + " and " + QuestionsMax;

        let element = document.createElement("p");
        element.setAttribute("class", "wrong-input-message");
        element.innerHTML = text;

        $("#inputQuestions").tooltip({
            trigger: "manual",
            html: true,
            title: element.outerHTML
        }).tooltip("show");

    }

});

// Remove range warning if input is focused
$("#inputQuestions").focus(function() {

    $("#inputQuestions").tooltip("hide");

});

// Enter pressed for submitting an answer
$("#inputAnswer").keyup(function (event) {

    if (event.keyCode === 13) {
        check();
    }

});

// Button for moving on to next questing clicked
$("#buttonNextQuestion").click(function () {

    QuestionNumber++;

    // Go to next question
    if (QuestionNumber < QuestionsAmount) {
        nextQuestion();
    }

    // View results
    else {
        viewResults();
    }

});

// Button for new game clicked
$("#buttonNewQuiz").click(function() {

    // Show menu page
    $("#results").hide();
    $("#menu").show();

    // Focus start button
    $("#buttonStartQuiz").focus();

});
