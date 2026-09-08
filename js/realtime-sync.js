/**
 * Universal Real-Time Online & Offline Synchronization Engine
 * - Cloud/Online MQTT WebSocket broker (Zero-setup online multi-device sync for GitHub Pages)
 * - Node.js Socket.IO fallback (when hosted locally)
 * - BroadcastChannel & LocalStorage fallback (for cross-tab sync & persistent offline storage)
 */
class CasinoRealtimeSync {
    constructor() {
        this.socket = null;
        this.mqttClient = null;
        this.role = 'guest';
        this.groupId = null;
        this.roomCode = 'LGD-5274';
        this.onUpdateCallback = null;
        this.broadcastChannel = null;
        this.currentState = null;
        this.isSocketConnected = false;
        this.isMqttConnected = false;
        this.storageKey = 'casino_master_game_state_v2';
    }

    init(role, groupId = null, onStateUpdate = null, customRoomCode = null) {
        this.role = role;
        this.groupId = groupId;
        this.onUpdateCallback = onStateUpdate;
        if (customRoomCode) this.roomCode = customRoomCode;

        // 1. Load initial state from persistent local storage
        const saved = this.getLocalBackup();
        if (saved) {
            this.currentState = saved;
            if (this.onUpdateCallback) {
                this.onUpdateCallback(saved);
            }
        }

        // 2. Setup BroadcastChannel for ultra-fast local tab sync
        if (typeof BroadcastChannel !== 'undefined') {
            try {
                this.broadcastChannel = new BroadcastChannel(`casino_sync_${this.roomCode}`);
                this.broadcastChannel.onmessage = (event) => {
                    if (event.data && event.data.type === 'STATE_SYNC') {
                        this.currentState = event.data.state;
                        this.saveToStorageOnly(event.data.state);
                        if (this.onUpdateCallback) {
                            this.onUpdateCallback(event.data.state);
                        }
                    } else if (event.data && event.data.type === 'STUDENT_ACTION' && this.role === 'teacher') {
                        this.handleStudentAction(event.data.action, event.data.payload);
                    }
                };
            } catch (e) {
                console.warn('BroadcastChannel error:', e);
            }
        }

        // 3. Storage event listener for cross-window fallback
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey && e.newValue) {
                try {
                    const state = JSON.parse(e.newValue);
                    this.currentState = state;
                    if (this.onUpdateCallback) {
                        this.onUpdateCallback(state);
                    }
                } catch (err) {}
            }
        });

        // 4. Connect Online Cloud MQTT Broker for Multi-Device / GitHub Pages sync
        this.initOnlineMqttSync();

        // 5. Connect Socket.IO if available (Node.js server)
        this.initSocketIoSync();
    }

    initOnlineMqttSync() {
        if (typeof mqtt === 'undefined') {
            console.log('MQTT library not loaded yet, using Local & Broadcast sync.');
            return;
        }

        try {
            const clientId = `casino_${this.role}_${Math.random().toString(16).substr(2, 8)}`;
            const topicPrefix = `smaplus_casino/${this.roomCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

            // Connect via secure WebSocket WSS
            this.mqttClient = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
                clientId: clientId,
                clean: true,
                connectTimeout: 5000,
                reconnectPeriod: 2500,
                keepalive: 30
            });

            this.mqttClient.on('connect', () => {
                this.isMqttConnected = true;
                this.updateOnlineStatusBadge(true);

                // Subscribe to room topics
                this.mqttClient.subscribe(`${topicPrefix}/#`, { qos: 0 });

                // If student, request latest master state from teacher
                if (this.role === 'student') {
                    this.mqttClient.publish(`${topicPrefix}/request_state`, JSON.stringify({
                        requester: this.groupId,
                        ts: Date.now()
                    }));
                } else if (this.role === 'teacher' && this.currentState) {
                    // Teacher broadcasts latest state to room
                    this.publishStateToMqtt(this.currentState);
                }
            });

            this.mqttClient.on('message', (topic, message) => {
                try {
                    const payload = JSON.parse(message.toString());

                    if (topic === `${topicPrefix}/state`) {
                        this.currentState = payload;
                        this.saveToStorageOnly(payload);
                        if (this.onUpdateCallback) {
                            this.onUpdateCallback(payload);
                        }
                    } else if (topic === `${topicPrefix}/request_state` && this.role === 'teacher') {
                        if (this.currentState) {
                            this.publishStateToMqtt(this.currentState);
                        }
                    } else if (topic === `${topicPrefix}/action` && this.role === 'teacher') {
                        this.handleStudentAction(payload.action, payload.data);
                    }
                } catch (e) {
                    console.error('MQTT message parse error:', e);
                }
            });

            this.mqttClient.on('error', (err) => {
                console.warn('MQTT connection warning:', err);
                this.updateOnlineStatusBadge(false);
            });

            this.mqttClient.on('offline', () => {
                this.isMqttConnected = false;
                this.updateOnlineStatusBadge(false);
            });
        } catch (e) {
            console.warn('Could not initialize MQTT:', e);
        }
    }

    initSocketIoSync() {
        if (typeof io !== 'undefined') {
            try {
                this.socket = io({ reconnection: true, timeout: 5000 });
                
                this.socket.on('connect', () => {
                    this.isSocketConnected = true;
                    this.socket.emit('joinRole', { role: this.role, groupId: this.groupId });
                });

                this.socket.on('gameStateUpdate', (state) => {
                    this.currentState = state;
                    this.saveToStorageOnly(state);
                    if (this.onUpdateCallback) {
                        this.onUpdateCallback(state);
                    }
                });

                this.socket.on('disconnect', () => {
                    this.isSocketConnected = false;
                });
            } catch (e) {}
        }
    }

    updateOnlineStatusBadge(isOnline) {
        const badge = document.getElementById('online-sync-indicator');
        if (badge) {
            if (isOnline) {
                badge.className = 'badge-pill emerald';
                badge.innerHTML = '⚡ Online Cloud Sync';
                badge.title = 'Connected to online cloud sync';
            } else {
                badge.className = 'badge-pill cyan';
                badge.innerHTML = '● Local Active Sync';
                badge.title = 'Syncing via Local Network & Broadcast';
            }
        }
    }

    publishStateToMqtt(state) {
        if (this.mqttClient && this.isMqttConnected) {
            const topicPrefix = `smaplus_casino/${this.roomCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
            this.mqttClient.publish(`${topicPrefix}/state`, JSON.stringify(state));
        }
    }

    publishActionToMqtt(action, data) {
        if (this.mqttClient && this.isMqttConnected) {
            const topicPrefix = `smaplus_casino/${this.roomCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
            this.mqttClient.publish(`${topicPrefix}/action`, JSON.stringify({ action, data }));
        }
    }

    saveToStorageOnly(state) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(state));
        } catch (e) {}
    }

    saveAndBroadcastState(state) {
        this.currentState = state;
        this.saveToStorageOnly(state);

        // Broadcast to local tabs
        if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({ type: 'STATE_SYNC', state });
        }

        // Publish to online Cloud MQTT
        this.publishStateToMqtt(state);

        if (this.onUpdateCallback) {
            this.onUpdateCallback(state);
        }
    }

    getFallbackQuestion(storyKey, qNum) {
        if (typeof CASINO_QUIZ_DATA !== 'undefined') {
            const story = CASINO_QUIZ_DATA[storyKey] || CASINO_QUIZ_DATA.story1;
            const qIndex = Math.max(0, Math.min(story.questions.length - 1, qNum - 1));
            return {
                storyTitle: story.title,
                storySubtitle: story.subtitle,
                storyIcon: story.icon,
                ...story.questions[qIndex]
            };
        }
        return null;
    }

    getLocalBackup() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) return JSON.parse(raw);
        } catch (e) {}

        const defaultStory = 'story1';
        const defaultQNum = 1;
        const initialQ = this.getFallbackQuestion(defaultStory, defaultQNum);

        return {
            gameCode: this.roomCode,
            activeStory: defaultStory,
            currentQuestion: defaultQNum,
            totalQuestions: 10,
            currentQuestionData: initialQ,
            gameStatus: "WAITING",
            correctAnswer: initialQ ? (Array.isArray(initialQ.correctAnswer) ? initialQ.correctAnswer.join(',') : initialQ.correctAnswer) : "C",
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

    // Student Submits Bet & Answer
    submitChoice(groupId, bet, answer) {
        if (this.isSocketConnected && this.socket) {
            this.socket.emit('student:submitChoice', { groupId, bet, answer });
        }

        // Send via Cloud MQTT
        this.publishActionToMqtt('submitChoice', { groupId, bet, answer });

        // Send via BroadcastChannel
        if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({
                type: 'STUDENT_ACTION',
                action: 'submitChoice',
                payload: { groupId, bet, answer }
            });
        }

        // Apply to local state as well
        const state = this.getLocalBackup();
        if (state && state.groups[groupId]) {
            state.groups[groupId].bet = parseInt(bet, 10);
            state.groups[groupId].answer = answer ? (Array.isArray(answer) ? answer.join(',') : String(answer).toUpperCase()) : null;
            state.groups[groupId].status = "SUBMITTED";
            this.saveAndBroadcastState(state);
        }
    }

    // Student or Teacher Renames Group
    renameGroup(groupId, newName) {
        if (!groupId || !newName) return;

        if (this.isSocketConnected && this.socket) {
            this.socket.emit('teacher:renameGroup', { groupId, newName });
        }

        this.publishActionToMqtt('renameGroup', { groupId, newName });

        if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({
                type: 'STUDENT_ACTION',
                action: 'renameGroup',
                payload: { groupId, newName }
            });
        }

        const state = this.getLocalBackup();
        if (state && state.groups[groupId]) {
            state.groups[groupId].name = newName;
            this.saveAndBroadcastState(state);
        }
    }

    // Handle student actions received on Teacher side
    handleStudentAction(action, payload) {
        if (!payload) return;
        const state = this.getLocalBackup();

        if (action === 'submitChoice') {
            const { groupId, bet, answer } = payload;
            if (state.groups[groupId]) {
                state.groups[groupId].bet = parseInt(bet, 10);
                state.groups[groupId].answer = answer ? (Array.isArray(answer) ? answer.join(',') : String(answer).toUpperCase()) : null;
                state.groups[groupId].status = "SUBMITTED";
                this.saveAndBroadcastState(state);
            }
        } else if (action === 'renameGroup') {
            const { groupId, newName } = payload;
            if (state.groups[groupId]) {
                state.groups[groupId].name = newName;
                this.saveAndBroadcastState(state);
            }
        }
    }

    // Teacher Control Actions
    teacherAction(actionName, payload = {}) {
        if (this.isSocketConnected && this.socket) {
            this.socket.emit(`teacher:${actionName}`, payload);
        }

        let state = this.getLocalBackup();
        
        if (actionName === 'setStory') {
            state.activeStory = payload.story;
            state.currentQuestion = 1;
            state.currentQuestionData = this.getFallbackQuestion(payload.story, 1);
            state.correctAnswer = state.currentQuestionData ? (Array.isArray(state.currentQuestionData.correctAnswer) ? state.currentQuestionData.correctAnswer.join(',') : state.currentQuestionData.correctAnswer) : "A";
            state.gameStatus = 'WAITING';
            Object.values(state.groups).forEach(g => {
                g.bet = null; g.answer = null; g.status = 'WAITING'; g.lastDelta = 0; g.lastResult = null;
            });
        } else if (actionName === 'setQuestionIndex') {
            const num = parseInt(payload.questionIndex, 10) || 1;
            state.currentQuestion = num;
            state.currentQuestionData = this.getFallbackQuestion(state.activeStory, num);
            state.correctAnswer = state.currentQuestionData ? (Array.isArray(state.currentQuestionData.correctAnswer) ? state.currentQuestionData.correctAnswer.join(',') : state.currentQuestionData.correctAnswer) : "A";
            state.gameStatus = 'BETTING_OPEN';
            Object.values(state.groups).forEach(g => {
                g.bet = null; g.answer = null; g.status = 'BETTING'; g.lastDelta = 0; g.lastResult = null;
            });
        } else if (actionName === 'setStatus') {
            state.gameStatus = payload.status;
            if (payload.status === 'BETTING_OPEN') {
                Object.values(state.groups).forEach(g => {
                    if (g.status !== 'SUBMITTED') g.status = 'BETTING';
                });
            } else if (payload.status === 'ANSWERING_OPEN') {
                Object.values(state.groups).forEach(g => {
                    if (g.status !== 'SUBMITTED') g.status = 'ANSWERING';
                });
            } else if (payload.status === 'LOCKED') {
                Object.values(state.groups).forEach(g => {
                    if (!g.status || g.status !== 'SUBMITTED') g.status = 'LOCKED';
                });
            }
        } else if (actionName === 'setCorrectAnswer') {
            state.correctAnswer = payload.correctAnswer ? (Array.isArray(payload.correctAnswer) ? payload.correctAnswer.map(s => String(s).toUpperCase()).sort().join(',') : String(payload.correctAnswer).toUpperCase()) : null;
            state.gameStatus = 'REVEALED';
        } else if (actionName === 'calculateScore') {
            if (state.correctAnswer) {
                const normalize = (ans) => {
                    if (!ans) return '';
                    if (Array.isArray(ans)) return ans.map(s => String(s).trim().toUpperCase()).sort().join(',');
                    return String(ans).split(/[\s,]+/).filter(Boolean).map(s => s.trim().toUpperCase()).sort().join(',');
                };

                const targetCorrect = normalize(state.correctAnswer);
                const presetCorrect = state.currentQuestionData ? normalize(state.currentQuestionData.correctAnswer) : '';

                Object.keys(state.groups).forEach(gKey => {
                    const g = state.groups[gKey];
                    const bet = parseInt(g.bet, 10) || 0;
                    const groupAns = g.answer ? normalize(g.answer) : null;
                    const isCorrect = groupAns && (groupAns === targetCorrect || (presetCorrect && groupAns === presetCorrect));

                    if (bet > 0 || g.answer) {
                        if (isCorrect) {
                            g.lastDelta = bet;
                            g.lastResult = 'CORRECT';
                            g.capital += bet;
                            g.status = 'CORRECT';
                        } else {
                            g.lastDelta = -bet;
                            g.lastResult = 'WRONG';
                            g.capital = Math.max(0, g.capital - bet);
                            g.status = 'WRONG';
                        }
                    }
                });
                state.gameStatus = 'CALCULATED';
            }
        } else if (actionName === 'nextQuestion') {
            const nextQ = state.currentQuestion + 1;
            if (nextQ <= (state.totalQuestions || 10)) {
                state.currentQuestion = nextQ;
                state.currentQuestionData = this.getFallbackQuestion(state.activeStory, nextQ);
                state.correctAnswer = state.currentQuestionData ? (Array.isArray(state.currentQuestionData.correctAnswer) ? state.currentQuestionData.correctAnswer.join(',') : state.currentQuestionData.correctAnswer) : "A";
                state.gameStatus = 'BETTING_OPEN';
                Object.values(state.groups).forEach(g => {
                    g.bet = null; g.answer = null; g.status = 'BETTING'; g.lastDelta = 0; g.lastResult = null;
                });
            }
        } else if (actionName === 'resetRound') {
            state.gameStatus = 'BETTING_OPEN';
            Object.values(state.groups).forEach(g => {
                g.bet = null; g.answer = null; g.status = 'BETTING'; g.lastDelta = 0; g.lastResult = null;
            });
        } else if (actionName === 'toggleFinalQuestion') {
            state.finalQuestion = !state.finalQuestion;
        } else if (actionName === 'renameGroup') {
            if (state.groups[payload.groupId]) {
                state.groups[payload.groupId].name = payload.newName;
            }
        } else if (actionName === 'adjustCapital') {
            if (state.groups[payload.groupId]) {
                state.groups[payload.groupId].capital = Math.max(0, state.groups[payload.groupId].capital + parseInt(payload.delta, 10));
            }
        } else if (actionName === 'resetGame') {
            const initialQ = this.getFallbackQuestion('story1', 1);
            state = {
                gameCode: this.roomCode,
                activeStory: 'story1',
                currentQuestion: 1,
                totalQuestions: 10,
                currentQuestionData: initialQ,
                gameStatus: "WAITING",
                correctAnswer: initialQ ? (Array.isArray(initialQ.correctAnswer) ? initialQ.correctAnswer.join(',') : initialQ.correctAnswer) : "C",
                finalQuestion: false,
                showLeaderboardToStudents: false,
                groups: {
                    group1: { id: "group1", name: state.groups.group1 ? state.groups.group1.name : "Group 1", capital: 100, bet: null, answer: null, status: "WAITING", lastDelta: 0, lastResult: null },
                    group2: { id: "group2", name: state.groups.group2 ? state.groups.group2.name : "Group 2", capital: 100, bet: null, answer: null, status: "WAITING", lastDelta: 0, lastResult: null },
                    group3: { id: "group3", name: state.groups.group3 ? state.groups.group3.name : "Group 3", capital: 100, bet: null, answer: null, status: "WAITING", lastDelta: 0, lastResult: null },
                    group4: { id: "group4", name: state.groups.group4 ? state.groups.group4.name : "Group 4", capital: 100, bet: null, answer: null, status: "WAITING", lastDelta: 0, lastResult: null },
                    group5: { id: "group5", name: state.groups.group5 ? state.groups.group5.name : "Group 5", capital: 100, bet: null, answer: null, status: "WAITING", lastDelta: 0, lastResult: null }
                },
                roundHistory: []
            };
        } else if (actionName === 'endGame') {
            state.gameStatus = 'ENDED';
        }

        this.saveAndBroadcastState(state);
    }
}

window.casinoSync = new CasinoRealtimeSync();
