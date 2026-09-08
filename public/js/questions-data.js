/**
 * Synchronized Question Bank for Casino Game Room
 * Extracted and aligned with CASSINO GAMES XI R 1
 */
const CASINO_QUIZ_DATA = {
    story1: {
        id: "story1",
        title: "The Legend of Lutung Kasarung",
        subtitle: "Indonesian Legend • West Java",
        icon: "🐒",
        questions: [
            {
                id: 1,
                type: "multiple",
                question: "What is the main purpose of the text?",
                options: {
                    A: "To describe the history of an ancient kingdom in West Java.",
                    B: "To explain the relationship between two royal sisters.",
                    C: "To tell a legendary story about kindness, jealousy, and forgiveness.",
                    D: "To explain how magical characters protected people in the forest.",
                    E: "To describe the traditional lifestyle of people in a royal kingdom."
                },
                correctAnswer: ["C"],
                explanation: "The text is a narrative legend sharing timeless lessons about kindness, humility, and forgiveness overcoming jealousy."
            },
            {
                id: 2,
                type: "multiple",
                question: "Why did Purbararang try to remove Purbasari from the kingdom?",
                options: {
                    A: "She believed Purbasari was unable to communicate with the villagers.",
                    B: "She wanted to become the queen because she felt more deserving.",
                    C: "She thought Purbasari had secretly taken control of the kingdom.",
                    D: "She wanted Purbasari to live safely away from the royal palace.",
                    E: "She believed Purbasari had caused problems among the royal family."
                },
                correctAnswer: ["B"],
                explanation: "Purbararang was proud and believed she was more suitable to lead the kingdom, desiring the throne for herself."
            },
            {
                id: 3,
                type: "multiple",
                question: "What can readers infer about Purbasari from her response to the difficulties she faced?",
                options: {
                    A: "She depended on others because she was unable to make decisions.",
                    B: "She became ambitious because she wanted to defeat her sister.",
                    C: "She remained patient and kind despite experiencing unfair treatment.",
                    D: "She became angry because she believed she deserved greater power.",
                    E: "She avoided responsibility because she preferred living in the forest."
                },
                correctAnswer: ["C"],
                explanation: "Although Purbasari was sad, she remained patient and kind in the forest without harboring hatred or revenge."
            },
            {
                id: 4,
                type: "multiple",
                question: "Which statement best explains the contrast between Purbasari and Purbararang?",
                options: {
                    A: "Purbasari valued kindness, while Purbararang was driven by jealousy.",
                    B: "Purbasari valued wealth, while Purbararang preferred a simple life.",
                    C: "Purbasari wanted power, while Purbararang avoided royal responsibilities.",
                    D: "Purbasari disliked people, while Purbararang cared deeply about others.",
                    E: "Purbasari feared challenges, while Purbararang remained calm under pressure."
                },
                correctAnswer: ["A"],
                explanation: "Purbasari embodies humility and kindness, whereas Purbararang represents pride and jealousy."
            },
            {
                id: 5,
                type: "multiple",
                question: "Why was Lutung Kasarung important to Purbasari's journey?",
                options: {
                    A: "He helped Purbasari return to the palace before the curse disappeared.",
                    B: "He encouraged Purbasari to compete with her sister for the throne.",
                    C: "He protected Purbasari and helped her overcome the difficulties she faced.",
                    D: "He convinced Purbararang to give up her position as the older daughter.",
                    E: "He taught Purbasari how to become powerful enough to defeat her sister."
                },
                correctAnswer: ["C"],
                explanation: "Lutung Kasarung protected Purbasari in the forest, guided her to the magical spring, and supported her through hardships."
            },
            {
                id: 6,
                type: "complex",
                question: "Choose ALL statements that are supported by the text.",
                options: {
                    A: "Prabu Tapa Agung considered Purbasari suitable to lead the kingdom.",
                    B: "Purbararang accepted Purbasari's appointment without feeling jealous.",
                    C: "Purbasari remained patient even after she was sent into the forest.",
                    D: "Lutung Kasarung was actually a magical prince named Guru Minda.",
                    E: "Purbararang immediately apologized before Purbasari returned to the kingdom."
                },
                correctAnswer: ["A", "C", "D"],
                primaryKey: "A",
                explanation: "Statements A, C, and D are directly confirmed in the text (Paragraphs 3, 5, and 6)."
            },
            {
                id: 7,
                type: "complex",
                question: "Choose ALL reasons why Purbasari eventually overcame her difficulties.",
                options: {
                    A: "She continued to remain patient and kind during difficult situations.",
                    B: "She received protection and guidance from Lutung Kasarung in the forest.",
                    C: "She discovered a magical spring that removed the curse from her skin.",
                    D: "She defeated Purbararang by using her own magical powers against her.",
                    E: "She gained control of the kingdom before facing her sister's challenge."
                },
                correctAnswer: ["A", "B", "C"],
                primaryKey: "A",
                explanation: "Her patience (A), Lutung Kasarung's guidance (B), and the magical spring (C) enabled her to overcome exile."
            },
            {
                id: 8,
                type: "complex",
                question: "The ending of the story shows that forgiveness can be more powerful than revenge. Choose ALL statements that best support this interpretation.",
                options: {
                    A: "Purbasari chose to forgive Purbararang after she apologized.",
                    B: "Purbasari avoided taking revenge despite being treated unfairly.",
                    C: "Purbararang realized that her jealousy had caused unfair treatment.",
                    D: "Purbasari punished Purbararang after becoming the new queen.",
                    E: "Purbararang became jealous again after discovering Guru Minda's identity."
                },
                correctAnswer: ["A", "B", "C"],
                primaryKey: "A",
                explanation: "Statements A, B, and C highlight reconciliation, moral integrity, and the strength of forgiveness over revenge."
            },
            {
                id: 9,
                type: "multiple",
                question: "Read the sentence: 'Purbararang became jealous and angry because she wanted the throne for herself.' Why did the writer use 'became' and 'wanted'?",
                options: {
                    A: "They describe feelings that are generally true about Purbararang.",
                    B: "They describe actions and feelings that occurred during past events.",
                    C: "They describe activities that Purbararang is currently experiencing.",
                    D: "They describe plans that Purbararang will carry out in the future.",
                    E: "They describe actions that were happening continuously at that moment."
                },
                correctAnswer: ["B"],
                explanation: "Simple Past Tense verbs ('became' and 'wanted') describe completed narrative events and states in the past."
            },
            {
                id: 10,
                type: "multiple",
                question: "Consider these events: 'Purbasari lived in the forest. Lutung Kasarung protected her. Purbasari discovered a magical spring.' Why is Simple Past Tense appropriate?",
                options: {
                    A: "The sentences describe completed events that formed the sequence of the story.",
                    B: "The sentences describe habitual activities that Purbasari usually performs.",
                    C: "The sentences describe general truths about magical creatures and forests.",
                    D: "The sentences describe activities that are still happening in the present.",
                    E: "The sentences describe future events that will happen after the story ends."
                },
                correctAnswer: ["A"],
                explanation: "Narrative stories use Simple Past Tense to construct chronological sequences of completed past events."
            }
        ]
    },
    story2: {
        id: "story2",
        title: "The Legend of the Black Sea",
        subtitle: "World Legend • Historical Folklore",
        icon: "🌊",
        questions: [
            {
                id: 1,
                type: "multiple",
                question: "What is the text mainly about?",
                options: {
                    A: "The daily life of fishermen in the Black Sea.",
                    B: "The story of how a great flood changed a large area of land.",
                    C: "The history of modern villages around the Black Sea.",
                    D: "The process of building houses near the sea.",
                    E: "The life of a wise old man who became a king."
                },
                correctAnswer: ["B"],
                explanation: "The passage narrates the legendary flood that transformed fertile valleys and villages into the Black Sea."
            },
            {
                id: 2,
                type: "multiple",
                question: "What advice did the wise old man often give to the villagers?",
                options: {
                    A: "They should become rich and powerful.",
                    B: "They should build stronger houses.",
                    C: "They should respect the power of nature.",
                    D: "They should leave their village immediately.",
                    E: "They should become fishermen."
                },
                correctAnswer: ["C"],
                explanation: "The old man advised: 'Respect nature. The land, the water, and the sky are powerful. We must never become too proud.'"
            },
            {
                id: 3,
                type: "multiple",
                question: "Why did some villagers refuse to leave their homes?",
                options: {
                    A: "They did not hear the old man's warning.",
                    B: "They wanted to protect their possessions.",
                    C: "They were waiting for their families.",
                    D: "They believed the old man was their enemy.",
                    E: "They wanted to explore the hills."
                },
                correctAnswer: ["B"],
                explanation: "Stubborn villagers did not want to abandon their houses, farms, animals, and valuable belongings."
            },
            {
                id: 4,
                type: "multiple",
                question: "What can be inferred about the villagers who moved to higher ground?",
                options: {
                    A: "They trusted the wise old man's advice.",
                    B: "They wanted to find a new farming area.",
                    C: "They planned to build a new village.",
                    D: "They wanted to become fishermen.",
                    E: "They were forced by Purbararang."
                },
                correctAnswer: ["A"],
                explanation: "They respected wisdom and promptly acted upon the survival warning."
            },
            {
                id: 5,
                type: "multiple",
                question: "What happened after the flood ended?",
                options: {
                    A: "The villagers returned to their old homes.",
                    B: "The water disappeared from the land.",
                    C: "A large sea covered the former land area.",
                    D: "The wise old man rebuilt the villages.",
                    E: "The farmers started working in their fields again."
                },
                correctAnswer: ["C"],
                explanation: "The sunken valley was permanently inundated, creating the vast Black Sea."
            },
            {
                id: 6,
                type: "complex",
                question: "Choose ALL statements that describe the setting before the flood.",
                options: {
                    A: "The area had green fields.",
                    B: "Many villages existed on the land.",
                    C: "The people only worked as fishermen.",
                    D: "Some people worked as farmers.",
                    E: "The entire area was already covered by the sea."
                },
                correctAnswer: ["A", "B", "D"],
                primaryKey: "A",
                explanation: "The text describes fertile green fields (A), many villages (B), and agrarian livelihoods (D)."
            },
            {
                id: 7,
                type: "complex",
                question: "Which events were signs that something unusual was going to happen?",
                options: {
                    A: "Dark clouds covered the sky.",
                    B: "Strong winds blew across the land.",
                    C: "The fishermen saw unusual waves.",
                    D: "The villagers celebrated a festival.",
                    E: "The ground became wet."
                },
                correctAnswer: ["A", "B", "C", "E"],
                primaryKey: "A",
                explanation: "Sudden dark clouds, violent winds, unusual ocean waves, and ground saturation warned of disaster."
            },
            {
                id: 8,
                type: "complex",
                question: "What can be concluded about the people who refused to leave?",
                options: {
                    A: "They valued their possessions highly.",
                    B: "They completely trusted the old man's warning.",
                    C: "They believed their homes would remain safe.",
                    D: "Some of them made a dangerous decision by staying.",
                    E: "They immediately moved to higher ground."
                },
                correctAnswer: ["A", "C", "D"],
                primaryKey: "A",
                explanation: "Their excessive attachment to material goods (A) and false sense of security (C) led to fatal delays (D)."
            },
            {
                id: 9,
                type: "complex",
                question: "Which statements show the cause-and-effect relationship in the story?",
                options: {
                    A: "The old man gave a warning, so many villagers moved to higher ground.",
                    B: "Some villagers wanted to protect their possessions, so they refused to leave.",
                    C: "The flood covered the land, so the area changed into a large sea.",
                    D: "The villagers ignored nature, so the sky immediately became sunny.",
                    E: "The people moved to the hills, so the flood completely stopped."
                },
                correctAnswer: ["A", "B", "C"],
                primaryKey: "A",
                explanation: "A, B, and C describe valid cause-and-effect relationships presented in the text."
            },
            {
                id: 10,
                type: "complex",
                question: "What values can readers learn from The Legend of the Black Sea?",
                options: {
                    A: "People should respect the power of nature.",
                    B: "Wise advice should be considered carefully.",
                    C: "Material possessions are always more important than life.",
                    D: "Pride can sometimes lead people to make poor decisions.",
                    E: "Human life and family are more valuable than possessions."
                },
                correctAnswer: ["A", "B", "D", "E"],
                primaryKey: "A",
                explanation: "The story emphasizes respecting nature (A), listening to wisdom (B), avoiding arrogance (D), and valuing life above possessions (E)."
            }
        ]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CASINO_QUIZ_DATA;
}
