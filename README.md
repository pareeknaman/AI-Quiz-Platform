
This project is an AI-Powered Quiz Platform designed to make learning, training, and self-assessment simple and engaging. It allows users to create, share, and take quizzes with ease. The standout feature is an AI assistant that can automatically generate quiz questions on any given topic, streamlining the quiz creation process for educators, students, and businesses.

```mermaid
classDiagram
    class User {
        +String userId
        +String email
        +String hashedPassword
        +createQuiz()
        +takeQuiz()
    }

    class Quiz {
        +String quizId
        +String title
        +int timeLimit
        +List~Question~ questions
    }

    class Question {
        +String questionId
        +String questionText
        +List~Option~ options
    }

    class Option {
        +String optionId
        +String optionText
        +boolean isCorrect
    }

    class QuizAttempt {
        +String attemptId
        +int score
    }

    User "1" -- "0..*" Quiz : creates
    User "1" -- "0..*" QuizAttempt : has
    Quiz "1" -- "1..*" Question : contains
    Quiz "1" -- "0..*" QuizAttempt : is taken in
    Question "1" -- "2..*" Option : has
