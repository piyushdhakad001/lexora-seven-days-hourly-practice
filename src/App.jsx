

function App() {
  
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

  return (
    <main>
      <h1>Hindi Phrase Practice</h1>

      <nav>

      </nav>

      {categories.map((category) => (
        <section key={category.name}>
          <h2>{category.name}</h2>

          {category.phrases.map((phrase) => (
            <article className="item" key={phrase.id}>
              <h3>{phrase.hindi}</h3>
              <p>{phrase.english}</p>

              <ul>
                {phrase.examples.map((example, index) => (
                  <li key={`${phrase.id}-example-${index}`}>{example}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      ))}
    </main>
  );
}

export default App;