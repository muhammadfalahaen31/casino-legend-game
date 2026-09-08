const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');

const CASINO_QUIZ_DATA = require('./public/js/questions-data.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Explicit Friendly Routes
app.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'teacher.html'));
});

app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student.html'));
});

app.get('/api/state', (req, res) => {
    res.json(gameState);
});

app.get('/api/questions', (req, res) => {
    res.json(CASINO_QUIZ_DATA);
});

// Helper to get question data
function getQuestionData(storyKey, qNum) {
    const story = CASINO_QUIZ_DATA[storyKey] || CASINO_QUIZ_DATA.story1;
    const qIndex = Math.max(0, Math.min(story.questions.length - 1, qNum - 1));
    return {
        storyTitle: story.title,
        storySubtitle: story.subtitle,
        storyIcon: story.icon,
        ...story.questions[qIndex]
    };
}

// Master Game State
function createInitialGameState() {
    const defaultStory = 'story1';
    const defaultQNum = 1;
    const initialQData = getQuestionData(defaultStory, defaultQNum);

    return {
        gameCode: "LGD-5274",
        activeStory: defaultStory,
        currentQuestion: defaultQNum,
        totalQuestions: 10,
        currentQuestionData: initialQData,
        gameStatus: "WAITING", // WAITING, BETTING_OPEN, ANSWERING_OPEN, LOCKED, REVEALED, CALCULATED, ENDED
        correctAnswer: initialQData.correctAnswer[0] || "C",
        finalQuestion: false,
        showLeaderboardToStudents: false,
        groups: {
            group1: { id: "group1", name: "Group 1", capital: 100, bet: null, answer: null, status: "WAITING", lastDelta: 0, lastResult: null },
            group2: { id: "group2", name: "Group 2", capital: 100, bet: null, answer: null, status: "WAITING", lastDelta: 0, lastResult: null },
            group3: { id: "group3", name: "Group 3", capital: 100, bet: null, answer: null, status: "WAITING", lastDelta: 0, lastResult: null },
            group4: { id: "group4", name: "Group 4", capital: 100, bet: null, answer: null, status: "WAITING", lastDelta: 0, lastResult: null },
            group5: { id: "group5", name: "Group 5", capital: 100, bet: null, answer: null, status: "WAITING", lastDelta: 0, lastResult: null }
        },
        roundHistory: []
    };
}

let gameState = createInitialGameState();

// Socket.io Real-time Event Handlers
io.on('connection', (socket) => {
    // Send state immediately on connection
    socket.emit('gameStateUpdate', gameState);

    // Join role room
    socket.on('joinRole', ({ role, groupId }) => {
        socket.join(role);
        if (groupId) {
            socket.join(`group:${groupId}`);
        }
        socket.emit('gameStateUpdate', gameState);
    });

    // Student submit bet & answer
    socket.on('student:submitChoice', ({ groupId, bet, answer }) => {
        if (!gameState.groups[groupId]) return;
        
        if (gameState.gameStatus === 'LOCKED' || gameState.gameStatus === 'CALCULATED' || gameState.gameStatus === 'ENDED') {
            socket.emit('errorMessage', 'Submissions are currently locked.');
            return;
        }

        const group = gameState.groups[groupId];
        const numBet = parseInt(bet, 10);

        if (numBet > group.capital && group.capital > 0) {
            socket.emit('errorMessage', 'Bet exceeds current capital.');
            return;
        }

        group.bet = numBet;
        group.answer = answer ? answer.toUpperCase() : null;
        group.status = "SUBMITTED";

        io.emit('gameStateUpdate', gameState);
    });

    // Teacher: Set Story (Lutung Kasarung / The Black Sea)
    socket.on('teacher:setStory', ({ storyId }) => {
        if (CASINO_QUIZ_DATA[storyId]) {
            gameState.activeStory = storyId;
            gameState.currentQuestion = 1;
            gameState.currentQuestionData = getQuestionData(storyId, 1);
            gameState.correctAnswer = gameState.currentQuestionData.correctAnswer[0] || "A";
            gameState.gameStatus = 'WAITING';

            // Reset round choices
            Object.values(gameState.groups).forEach(g => {
                g.bet = null;
                g.answer = null;
                g.status = 'WAITING';
                g.lastDelta = 0;
                g.lastResult = null;
            });

            io.emit('gameStateUpdate', gameState);
        }
    });

    // Teacher: Jump to Question Index
    socket.on('teacher:setQuestionIndex', ({ qNum }) => {
        const num = parseInt(qNum, 10) || 1;
        gameState.currentQuestion = num;
        gameState.currentQuestionData = getQuestionData(gameState.activeStory, num);
        gameState.correctAnswer = gameState.currentQuestionData.correctAnswer[0] || "A";
        gameState.gameStatus = 'BETTING_OPEN';

        Object.values(gameState.groups).forEach(g => {
            g.bet = null;
            g.answer = null;
            g.status = 'BETTING';
            g.lastDelta = 0;
            g.lastResult = null;
        });

        io.emit('gameStateUpdate', gameState);
    });

    // Teacher: Update Game Status (OPEN BETTING, OPEN ANSWERS, LOCK ALL)
    socket.on('teacher:setStatus', ({ status }) => {
        gameState.gameStatus = status;

        if (status === 'BETTING_OPEN') {
            Object.values(gameState.groups).forEach(g => {
                if (g.status !== 'SUBMITTED') {
                    g.status = 'BETTING';
                }
            });
        } else if (status === 'ANSWERING_OPEN') {
            Object.values(gameState.groups).forEach(g => {
                if (g.status !== 'SUBMITTED') {
                    g.status = 'ANSWERING';
                }
            });
        } else if (status === 'LOCKED') {
            Object.values(gameState.groups).forEach(g => {
                if (!g.status || g.status !== 'SUBMITTED') {
                    g.status = 'LOCKED';
                }
            });
        }

        io.emit('gameStateUpdate', gameState);
    });

    // Teacher: Set Correct Answer
    socket.on('teacher:setCorrectAnswer', ({ correctAnswer }) => {
        gameState.correctAnswer = correctAnswer ? correctAnswer.toUpperCase() : null;
        gameState.gameStatus = 'REVEALED';
        io.emit('gameStateUpdate', gameState);
    });

    // Teacher: Calculate Score
    socket.on('teacher:calculateScore', () => {
        if (!gameState.correctAnswer) return;

        const normalize = (ans) => {
            if (!ans) return '';
            if (Array.isArray(ans)) return ans.map(s => String(s).trim().toUpperCase()).sort().join(',');
            return String(ans).split(/[\s,]+/).filter(Boolean).map(s => s.trim().toUpperCase()).sort().join(',');
        };

        const targetCorrect = normalize(gameState.correctAnswer);
        const presetCorrect = gameState.currentQuestionData ? normalize(gameState.currentQuestionData.correctAnswer) : '';

        const roundLog = {
            question: gameState.currentQuestion,
            correctAnswer: gameState.correctAnswer,
            finalQuestion: gameState.finalQuestion,
            results: {}
        };

        Object.keys(gameState.groups).forEach(gKey => {
            const group = gameState.groups[gKey];
            const betAmount = parseInt(group.bet, 10) || 0;
            const groupAns = group.answer ? normalize(group.answer) : null;
            const isCorrect = groupAns && (groupAns === targetCorrect || (presetCorrect && groupAns === presetCorrect));

            if (betAmount > 0 || group.answer) {
                if (isCorrect) {
                    group.lastDelta = betAmount;
                    group.lastResult = 'CORRECT';
                    group.capital = group.capital + betAmount;
                    group.status = 'CORRECT';
                } else {
                    group.lastDelta = -betAmount;
                    group.lastResult = 'WRONG';
                    group.capital = Math.max(0, group.capital - betAmount);
                    group.status = 'WRONG';
                }
            } else {
                group.lastDelta = 0;
                group.lastResult = 'NO_BET';
                group.status = 'NO_BET';
            }

            roundLog.results[gKey] = {
                name: group.name,
                bet: betAmount,
                answer: group.answer,
                delta: group.lastDelta,
                newCapital: group.capital,
                result: group.lastResult
            };
        });

        gameState.roundHistory.push(roundLog);
        gameState.gameStatus = 'CALCULATED';
        io.emit('gameStateUpdate', gameState);
    });

    // Teacher: Next Question
    socket.on('teacher:nextQuestion', () => {
        const nextQ = gameState.currentQuestion + 1;
        gameState.currentQuestion = nextQ;
        gameState.currentQuestionData = getQuestionData(gameState.activeStory, nextQ);
        gameState.correctAnswer = gameState.currentQuestionData.correctAnswer[0] || "A";
        gameState.gameStatus = 'BETTING_OPEN';

        Object.values(gameState.groups).forEach(g => {
            g.bet = null;
            g.answer = null;
            g.status = 'BETTING';
            g.lastDelta = 0;
            g.lastResult = null;
        });

        io.emit('gameStateUpdate', gameState);
    });

    // Teacher: Reset Current Round
    socket.on('teacher:resetRound', () => {
        gameState.gameStatus = 'BETTING_OPEN';
        Object.values(gameState.groups).forEach(g => {
            g.bet = null;
            g.answer = null;
            g.status = 'BETTING';
            g.lastDelta = 0;
            g.lastResult = null;
        });

        io.emit('gameStateUpdate', gameState);
    });

    // Teacher: Toggle Final Question (ALL-IN)
    socket.on('teacher:toggleFinalQuestion', ({ finalQuestion }) => {
        gameState.finalQuestion = !!finalQuestion;
        io.emit('gameStateUpdate', gameState);
    });

    // Teacher: Rename Group
    socket.on('teacher:renameGroup', ({ groupId, newName }) => {
        if (gameState.groups[groupId] && newName) {
            gameState.groups[groupId].name = newName.trim();
            io.emit('gameStateUpdate', gameState);
        }
    });

    // Teacher: Manual Capital Adjustment
    socket.on('teacher:adjustCapital', ({ groupId, delta }) => {
        if (gameState.groups[groupId]) {
            gameState.groups[groupId].capital = Math.max(0, gameState.groups[groupId].capital + parseInt(delta, 10));
            io.emit('gameStateUpdate', gameState);
        }
    });

    // Teacher: Reset Entire Game
    socket.on('teacher:resetGame', () => {
        gameState = createInitialGameState();
        io.emit('gameStateUpdate', gameState);
    });

    // Teacher: End Game
    socket.on('teacher:endGame', () => {
        gameState.gameStatus = 'ENDED';
        io.emit('gameStateUpdate', gameState);
    });
});

server.listen(PORT, () => {
    console.log(`🎰 Casino Game Room server running at http://localhost:${PORT}`);
    console.log(`👉 Teacher URL: http://localhost:${PORT}/teacher`);
    console.log(`👉 Student URL: http://localhost:${PORT}/student`);
});
