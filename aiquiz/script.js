import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBaRNXU82DkbCdiBzYiUAC1wDawAwzHlyY";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const questions = [
    "What are variables in Java?",
    "What is the purpose of a constructor in Java?",
    "Explain inheritance in Java.",
    "What is polymorphism in Java?",
    "How does exception handling work in Java?"
];

let currentQuestionIndex = 0;
const answers = [];

function displayQuestion(index) {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = `
        <h1>${questions[index]}</h1>
        <textarea id="ans"></textarea>
    `;
}

async function submitAnswer() {
    const answer = document.getElementById("ans").value;
    answers.push(answer);
    
    // Hide the result and "Submit Ques" button
    document.getElementById("result").textContent = "";
    document.getElementById("submit").style.display = "none";
    
    // Show the "Next Question" button
    document.getElementById("next-btn").style.display = "block";
}

async function submitQuiz() {
    let totalScore = 0;
    let validRatingsCount = 0;

    for (const answer of answers) {
        const prompt = `Rate this answer out of 10: ${answer}`;
        const result = await model.generateContent(prompt);

        // Extract the text response
        const responseText = result.response.text().trim();
        console.log("Response text:", responseText);

        // Use a regular expression to extract the rating number
        const ratingMatch = responseText.match(/\((\d+)\/10\)/);

        if (ratingMatch && ratingMatch[1]) {
            const rating = parseInt(ratingMatch[1], 10);

            if (!isNaN(rating)) {
                totalScore += rating;
                validRatingsCount++;
            } else {
                console.warn(`Parsed rating is not a valid number: ${rating}`);
            }
        } else {
            console.warn(`Rating not found in response: ${responseText}`);
        }
    }
console.log(averageRating);
    // Calculate and display the average rating
    if (validRatingsCount > 0) {
        const averageRating = totalScore / validRatingsCount;
        document.getElementById('result').innerHTML = `<p>Your average rating: ${averageRating}/10</p>`;
    } else {
        document.getElementById('result').innerHTML = `<p>No valid ratings received.</p>`;
    }
}


document.getElementById("next-btn").addEventListener("click", () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        displayQuestion(currentQuestionIndex);
        document.getElementById("submit-quiz").style.display = "none";
        document.getElementById("next-btn").style.display = "none";
        document.getElementById("submit").style.display = "block";
    } else {
        document.getElementById("submit-quiz").style.display = "block";
        document.getElementById("next-btn").style.display = "none";
        document.getElementById("submit").style.display = "none";
    }
});

document.getElementById("submit").addEventListener("click", submitAnswer);
document.getElementById("submit-quiz").addEventListener("click", submitQuiz);

document.addEventListener("DOMContentLoaded", () => {
    displayQuestion(currentQuestionIndex);
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("submit-quiz").style.display = "none";
    document.getElementById("submit").style.display = "block";
});
