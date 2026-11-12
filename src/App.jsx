import { useState } from "react";
import './App.css'

function App() {

  const [activeCategory, setActiveCategory] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState(" ")
  const [marks, setMarks] = useState({})
  const [progressFilter, setProgressFilter] = useState("all")

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
          <h2>Overview</h2>
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
              <p>{category.name} : {category.phrases.length}</p>
            )
          })}
        </section>
      )}

      {filteredCategories.length === 0 && (
        <p>No phrases match your search.</p>
      )}
      {filteredCategories.map((category) => {
        return (
          <section key={category.name}>
            <h2>{category.name}</h2>
            {category.phrases.map((phrase, index) => {
              return (
               <article key={phrase.id}>
                  <h3>{phrase.hindi}</h3>
                  <p>{phrase.english}</p>
                  <ul>
                    {phrase.examples.map((example, exampleIndex) => {
                      return (
                        <li key={exampleIndex}>{example}</li>
                      )
                    })}
                  </ul>
                  <div className="mark-buttons">
                    <button className={marks[phrase.id] === "weak" ? "weak active" : "weak"}
                      onClick={() => markPhrase(phrase.id, "weak")}>Weak</button>
                    <button className={marks[phrase.id] === "semi-weak" ? "semi-weak active" : "semi-weak"}
                      onClick={() => markPhrase(phrase.id, "semi-weak")}>Semi-Weak</button>
                    <button className={marks[phrase.id] === "mastered" ? "mastered active" : "mastered"}
                      onClick={() => markPhrase(phrase.id, "mastered")} >Mastered</button>
                  </div>
                </article>
              )
            })}
          </section>
        )
      })}
    </main>
  )
}

export default App;