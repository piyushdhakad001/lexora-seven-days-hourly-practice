import { useEffect, useState } from "react";
import './App.css'

function App() {

  const [activeCategory, setActiveCategory] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState(" ")
  const [marks, setMarks] = useState(() => {
    try {
      const savedMarks = localStorage.getItem("hindi-phrase-marks")
      return savedMarks ? JSON.parse(savedMarks) : {}
    } catch {
      return {};
    }
  })
  const [progressFilter, setProgressFilter] = useState("all")
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mode, setMode] = useState("practice")

  const categories = [
    {
      name: "Collocations",
      phrases: [
        {
          id: "make-effort",
          hindi: "प्रयास करना",
          english: "Make an effort",
          examples: [
            "Make an effort to speak clearly.",
            "She made an effort to help.",
            "They are making an effort to improve.",
          ],
        },
        {
          id: "pay-attention",
          hindi: "ध्यान देना",
          english: "Pay attention",
          examples: [
            "Please pay attention to the instructions.",
            "She paid attention during class.",
            "Pay attention to the road.",
          ],
        },
        {
          id: "make-decision",
          hindi: "निर्णय लेना",
          english: "Make a decision",
          examples: [
            "I need to make a decision today.",
            "She made a decision to study.",
            "We made the right decision.",
          ],
        },
      ],
    },
    {
      name: "Connectors",
      phrases: [
        {
          id: "although",
          hindi: "हालाँकि",
          english: "Although",
          examples: [
            "Although it was late, we continued.",
            "Although he was tired, he finished.",
            "Although it rained, we went out.",
          ],
        },
        {
          id: "therefore",
          hindi: "इसलिए",
          english: "Therefore",
          examples: [
            "It was raining; therefore, we stayed inside.",
            "He practiced daily; therefore, he improved.",
            "The shop was closed; therefore, we returned.",
          ],
        },
        {
          id: "in-addition",
          hindi: "इसके अलावा",
          english: "In addition",
          examples: [
            "In addition, we need more time.",
            "She speaks Hindi; in addition, she knows English.",
            "In addition to tea, they served snacks.",
          ],
        },
      ],
    },
  ];

  const allPhrases = categories.flatMap((category) => {
    return category.phrases
  })

  const progressCounts = {
    weak: allPhrases.filter((phrase) => marks[phrase.id] === "weak").length,
    semiWeak: allPhrases.filter((phrase) => marks[phrase.id] === "semi-weak").length,
    mastered: allPhrases.filter((phrase) => marks[phrase.id] === "mastered").length,

  }

  // -----------------------------------
  const visibleCategories = activeCategory === "Overview" ? categories : categories.filter((category) => {
    return (
      category.name === activeCategory
    )
  })

  // ---------------------------------------
  const filteredCategories = visibleCategories.map((category) => {
    const matchingPhrases = category.phrases.filter((phrase) => {
      const searchableText = [
        phrase.hindi,
        phrase.english,
        ...phrase.examples,
      ]
        .join(" ")
        .toLowerCase()


      const matchesSearch = searchableText.includes(searchQuery.trim().toLowerCase());
      const matchesProgress = progressFilter === 'all' || marks[phrase.id] === progressFilter;


      return matchesSearch && matchesProgress;
    })
    return (
      {
        ...category,
        phrases: matchingPhrases,
      }
    )
  }).filter((category) => {
    return (
      category.phrases.length > 0
    )
  })
  // ---------------------------------------
  // practice mode 
  const practicePhrases = filteredCategories.flatMap((category) => {
    return category.phrases
  })

  const safeIndex = Math.min(currentIndex, Math.max(practicePhrases.length - 1, 0))

  const currentPhrase = practicePhrases[safeIndex];
  useEffect(() => {
    setShowAnswer(false)
  }, [currentPhrase?.id])

  useEffect(() => {
    localStorage.setItem("hindi-phrase-marks", JSON.stringify(marks))
  }, [marks])

  // -------------------------------------------
  // mark helper function
  function markPhrase(selectedPhraseId, mark) {
    setMarks((previousMarks) => {
      return {
        ...previousMarks,
        [selectedPhraseId]: mark,
      }
    })
  }

  // -------------------------------------------

  return (
    <main>
      <h1>Hindi Phrase Practice</h1>

      <nav>
        <button onClick={() => setActiveCategory("Overview")}>Overview</button>
        {categories.map((category) => {
          return (
            <button key={category.name} onClick={() => setActiveCategory(category.name)}>{category.name}</button>
          )
        })}
      </nav>

      <input type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)} />

      <button onClick={() => setMode(mode === "practice" ? "list" : "practice")}>
        {mode === "practice" ? "Show list" : "Practice Mode"}
      </button>

      <div className="progress-filters">
        <button
          className={progressFilter === "all" ? "selected" : ""}
          onClick={() => setProgressFilter("all")}>All</button>
        <button
          className={progressFilter === "weak" ? "selected" : ""}
          onClick={() => setProgressFilter("weak")}>Weak only</button>
        <button
          className={progressFilter === "semi-weak" ? "selected" : ""}
          onClick={() => setProgressFilter("semi-weak")}>Semi-weak only</button>
        <button
          className={progressFilter === "mastered" ? "selected" : ""}
          onClick={() => setProgressFilter("mastered")}>Mastered only</button>
      </div>



      {activeCategory === "Overview" && (
        <section>
          <div className="progress-summary">
            <p>Weak : {progressCounts.weak}</p>
            <p>Semi-Weak : {progressCounts.semiWeak}</p>
            <p>Mastered : {progressCounts.mastered}</p>
          </div>
          

            {categories.map((category) => {
              const weak = category.phrases.filter((phrase) => marks[phrase.id] === "weak").length;
              const semiWeak = category.phrases.filter((phrase) => marks[phrase.id] === "semi-weak").length;
              const mastered = category.phrases.filter((phrase) => marks[phrase.id] === "mastered").length;

              return (
                <p>{category.name} : {weak} Weak · {semiWeak} Semi-Weak · {mastered} Mastered</p>
              )
            })}

            <button onClick={() => setMarks({})}>Reset Progress</button>
            <p>
            All phrases : {" "}
            {categories.reduce((total, category) => {
              return (
                total + category.phrases.length
              )
            }, 0)}
          </p>
          {categories.map((category) => {
            return (
              <p key={category.name}>{category.name} : {category.phrases.length}</p>
            )
          })}
        </section>
      )}

{mode === "practice" && (
   !currentPhrase ? (
        <p>No phrases match your filters.</p>
      ) : (
        <section className="practice-card">
          <p>Current phrase</p>
          <h2>{currentPhrase.hindi}</h2>

          {!showAnswer ? (
            <div className="reveal-area">
              <button onClick={() => setShowAnswer(true)}>
                Show English &amp; Examples
              </button>
              <p>Try to recall the phrase first.</p>
            </div>
          ) : (
            <div className="answer-area">
              <p className="english-answer">{currentPhrase.english}</p>
              <div className="examples">
                <p>Examples</p>
                <ul>
                  {currentPhrase.examples.map((example, exampleIndex) => {
                    return (
                      <li key={exampleIndex}>{example}</li>
                    )
                  })}
                </ul>
              </div>
              <button onClick={() => setShowAnswer(false)}>
                Hide answer
              </button>
            </div>
          )}

          <div className="mark-buttons">
            <button
              className={marks[currentPhrase.id] === "weak" ? "weak active" : "weak"}
              onClick={() => markPhrase(currentPhrase.id, "weak")}
            >
              Weak
            </button>

            <button
              className={marks[currentPhrase.id] === "semi-weak" ? "semi-weak active" : "semi-weak"}
              onClick={() => markPhrase(currentPhrase.id, "semi-weak")}
            >
              Semi-Weak
            </button>

            <button
              className={marks[currentPhrase.id] === "mastered" ? "mastered active" : "mastered"}
              onClick={() => markPhrase(currentPhrase.id, "mastered")}
            >
              Mastered
            </button>
          </div>

          <div className="practice-card">
            <button
              onClick={() => setCurrentIndex(safeIndex - 1)}
              disabled={safeIndex === 0}
            >
              Previous
            </button>

            <span>
              {safeIndex + 1} / {practicePhrases.length}
            </span>

            <button
              onClick={() => setCurrentIndex(safeIndex + 1)}
              disabled={safeIndex === practicePhrases.length - 1}>
              Next
            </button>
          </div>

          <aside>
            <h3>Practice phrases</h3>
            {practicePhrases.map((phrase, index) => (
              <button
                key={phrase.id}
                className={index === safeIndex ? "current-phrase" : ""}
                onClick={() => setCurrentIndex(index)}>
                {phrase.hindi}
              </button>
            ))}
          </aside>
        </section>
      )
)}
   

      {mode === "list" && (
        <div className="list-view">
          <h2>All matching phrases</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Hindi</th>
                <th>English</th>
                <th>Examples</th>
                <th>Progress</th>
              </tr>
            </thead>

            <tbody>
              {practicePhrases.map((phrase, index) => {
                return (
                  <tr key={phrase.id}>
                    <td>{index + 1}</td>
                    <td>{phrase.hindi}</td>
                    <td>{phrase.english}</td>
                    <td>
                      <ul>
                        {phrase.examples.slice(0, 2).map((example, exampleIndex) => {
                          return (
                            <li key={exampleIndex}>{example}</li>
                          )
                        })}
                        {phrase.examples.length > 2 && (
                          <li key={`${phrase.id}-more`}>+ {phrase.examples.length - 2} more</li>
                        )}
                      </ul>
                    </td>
                    <td>{marks[phrase.id] || "Not marked"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default App;