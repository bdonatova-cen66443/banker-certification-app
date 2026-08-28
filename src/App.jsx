import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'certifikace_bankere_v1';

const criteria = [
  {
    id: 'area1',
    title: 'ÚVOD A ZÁVĚR INTERAKCE S KLIENTEM',
    description:
      'Přivítání klienta, nastavení rámce schůzky, vedení úvodu, shrnutí rozhovoru a jasná domluva dalšího kroku.',
  },
  {
    id: 'area2',
    title: 'ZJIŠTĚNÍ A VYŘEŠENÍ POŽADAVKU KLIENTA',
    description:
      'Bankéř správně zjistí důvod návštěvy, ověří očekávání klienta a vhodně pracuje s jeho požadavkem.',
  },
  {
    id: 'area3',
    title: 'GEORGE A BEZPEČNOST',
    description:
      'Bankéř pracuje bezpečně, správně ověřuje klienta a vhodně využívá George a digitální nástroje.',
  },
  {
    id: 'area4',
    title: 'PŘEDSTAVENÍ / PŘIPOMENUTÍ PORADENSTVÍ',
    description:
      'Bankéř srozumitelně představí nebo připomene poradenství a přirozeně získá klienta pro další rozhovor.',
  },
  {
    id: 'area5',
    title: 'ROZPOČET',
    description:
      'Bankéř pracuje s příjmy, výdaji, rezervami a závazky klienta a zjišťuje jeho finanční prostor.',
  },
  {
    id: 'area6',
    title: 'PRODUKTY KONKURENCE',
    description:
      'Bankéř zjišťuje produkty a finanční vztahy klienta mimo Českou spořitelnu a zapojuje je do celkového pohledu na klienta.',
  },
  {
    id: 'area7',
    title: 'VYVOLÁNÍ POTŘEBY A NABÍDKA ŘEŠENÍ',
    description:
      'Bankéř dokáže přirozeně odkrýt potřebu klienta a propojit ji s konkrétním přínosem a vhodným řešením.',
  },
  {
    id: 'area8',
    title: 'ŘEŠENÍ – PRODEJ / SERVIS',
    description:
      'Bankéř navrhne vhodné, srozumitelné a klientsky obhajitelné řešení.',
  },
  {
    id: 'area9',
    title: 'NÁSLEDNÁ AKTIVITA',
    description:
      'Bankéř domluví konkrétní pokračování, termín nebo další krok.',
  },
  {
    id: 'area10',
    title: 'PROKLIENTSKÉ JEDNÁNÍ',
    description:
      'Bankéř naslouchá, reaguje na klienta a vede rozhovor s respektem, přirozeností a srozumitelností.',
  },
  {
    id: 'area11',
    title: 'ODBORNOST A SEBEVĚDOMÍ',
    description:
      'Bankéř působí jistě, orientuje se v tématu a komunikuje odborné informace klientsky a srozumitelně.',
  },
  {
    id: 'area12',
    title: 'POSTUP V SOULADU S PRACOVNÍMI PŘEDPISY A ETICKÝM KODEXEM',
    description:
      'Bankéř postupuje v souladu s pravidly, pracovními předpisy, etikou a zájmem klienta.',
  },
];

const scale = [
  {
    value: 0,
    label: 'NESPLNĚNO',
    description: 'Klíčový krok chyběl nebo byl proveden nesprávně.',
  },
  {
    value: 1,
    label: 'ČÁSTEČNĚ',
    description: 'Oblast zazněla, ale potřebuje podporu nebo doplnění.',
  },
  {
    value: 2,
    label: 'SPLNĚNO',
    description: 'Bankéř oblast zvládl samostatně v očekávaném standardu.',
  },
  {
    value: 3,
    label: 'NAD OČEKÁVÁNÍ',
    description: 'Velmi kvalitní, přirozené a klientsky silné zvládnutí.',
  },
];

const emptyState = {
  candidate: '',
  evaluator: '',
  scenario: 'A',
  ratings: criteria.reduce((acc, item) => ({ ...acc, [item.id]: null }), {}),
  comments: criteria.reduce((acc, item) => ({ ...acc, [item.id]: '' }), {}),
  start: '',
  stop: '',
  continue: '',
  strengths: '',
  development: '',
  recommendation: 'Připraven/a k samostatné práci',
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function App() {
  const [state, setState] = useState(emptyState);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Nelze načíst data z localStorage', error);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const ratings = Object.values(state.ratings).filter((value) => value !== null);
  const completed = ratings.length;
  const standardPoints = ratings.reduce((sum, value) => sum + Math.min(value, 2), 0);
  const bonusPoints = ratings.filter((value) => value === 3).length;
  const maxPoints = criteria.length * 2;
  const percent = completed > 0 ? Math.min(100, Math.round(((standardPoints + bonusPoints) / maxPoints) * 100)) : 0;

  const topAreas = useMemo(() => {
    return ratings.length
      ? [...criteria]
          .filter((item) => state.ratings[item.id] !== null)
          .sort((a, b) => state.ratings[b.id] - state.ratings[a.id])
          .slice(0, 3)
      : [];
  }, [state.ratings]);

  const bottomAreas = useMemo(() => {
    return ratings.length
      ? [...criteria]
          .filter((item) => state.ratings[item.id] !== null)
          .sort((a, b) => state.ratings[a.id] - state.ratings[b.id])
          .slice(0, 3)
      : [];
  }, [state.ratings]);

  function updateField(field, value) {
    setState((current) => ({ ...current, [field]: value }));
  }

  function updateRating(id, value) {
    setState((current) => ({
      ...current,
      ratings: { ...current.ratings, [id]: value },
    }));
  }

  function updateComment(id, text) {
    setState((current) => ({
      ...current,
      comments: { ...current.comments, [id]: text },
    }));
  }

  function resetForm() {
    if (!window.confirm('Opravdu chcete smazat celé aktuální hodnocení? Tuto akci nelze vrátit zpět.')) {
      return;
    }
    setState(emptyState);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="app-shell">
      <header className="top-panel">
        <div className="title-area">
          <p className="eyebrow">Závěrečná certifikace bankéře</p>
          <h1>Hodnocení poradenského rozhovoru</h1>
        </div>
        <div className="form-grid">
          <label>
            NOVÁČEK
            <input
              value={state.candidate}
              onChange={(event) => updateField('candidate', event.target.value)}
              placeholder="Jméno a příjmení"
            />
          </label>
          <label>
            HODNOTITEL
            <input
              value={state.evaluator}
              onChange={(event) => updateField('evaluator', event.target.value)}
              placeholder="Jméno a příjmení"
            />
          </label>
          <label>
            SCÉNÁŘ FIT
            <select value={state.scenario} onChange={(event) => updateField('scenario', event.target.value)}>
              <option value="A">Scénář A</option>
              <option value="B">Scénář B</option>
            </select>
          </label>
        </div>
      </header>

      <section className="dashboard-panel">
        <div className="dashboard-grid">
          <div className="stat-card">
            <span className="stat-label">PRŮBĚŽNÉ PLNĚNÍ</span>
            <strong>{percent} %</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">VYHODNOCENO</span>
            <strong>{completed} / 12</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">SPLNĚNÍ STANDARDU</span>
            <strong>{standardPoints} / {maxPoints} bodů</strong>
            <span className="bonus-points">Bonus za „NAD OČEKÁVÁNÍ“: +{bonusPoints} bodů</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">STAV HODNOCENÍ</span>
            <strong>{completed === 12 ? 'Kompletní' : 'Probíhá'}</strong>
          </div>
        </div>
        <div className="progress-bar-shell" aria-label="Průběh vyhodnocení">
          <div className="progress-labels">
            <span>{completed} / 12</span>
            <span>{percent}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${(completed / 12) * 100}%` }} />
          </div>
        </div>
      </section>

      <main className="content-grid">
        <section className="form-section">
          {criteria.map((item) => {
            const selected = state.ratings[item.id];
            return (
              <article key={item.id} className="criterion-card">
                <div className="criterion-header">
                  <div>
                    <h2>{item.title}</h2>
                    <span className="stat-label">VÝSLEDNÉ HODNOCENÍ</span>
                  </div>
                </div>
                <div className="scale-row">
                  {scale.map((entry) => {
                    const isActive = selected === entry.value;
                    return (
                      <button
                        key={entry.value}
                        type="button"
                        className={`scale-button ${isActive ? 'active' : ''}`}
                        onClick={() => updateRating(item.id, entry.value)}
                        aria-pressed={isActive}
                      >
                        <span className="value">{entry.value}</span>
                        <span className="label">{entry.label}</span>
                      </button>
                    );
                  })}
                </div>
                <label className="comment-box">
                  Komentář hodnotitele
                  <textarea
                    value={state.comments[item.id]}
                    onChange={(event) => updateComment(item.id, event.target.value)}
                    placeholder="Co se povedlo, co chybělo, konkrétní příklad…"
                  />
                </label>
              </article>
            );
          })}
        </section>

        <section className="summary-panel">
          <section className="auto-summary">
            <h2>AUTOMATICKÝ PŘEHLED</h2>
            {completed === 0 ? (
              <p className="empty-state">Zatím není co vyhodnotit.</p>
            ) : (
              <>
                <div className="summary-group">
                  <h3>NEJSILNĚJŠÍ OBLASTI</h3>
                  <div className="summary-list">
                    {topAreas.map((item) => (
                      <div key={item.id} className="summary-item">
                        <span>{item.title}</span>
                        <strong>{state.ratings[item.id]} / 3</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="summary-group">
                  <h3>OBLASTI K ROZVOJI</h3>
                  <div className="summary-list">
                    {bottomAreas.map((item) => (
                      <div key={item.id} className="summary-item">
                        <span>{item.title}</span>
                        <strong>{state.ratings[item.id]} / 3</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>

          <section className="start-stop-continue">
            <h2>START – STOP – CONTINUE</h2>
            <div className="ssc-grid">
              <label>
                <span>START</span>
                <textarea
                  value={state.start}
                  onChange={(event) => updateField('start', event.target.value)}
                  placeholder="Co má bankéř začít dělat?"
                />
              </label>
              <label>
                <span>STOP</span>
                <textarea
                  value={state.stop}
                  onChange={(event) => updateField('stop', event.target.value)}
                  placeholder="Co má bankéř přestat dělat?"
                />
              </label>
              <label>
                <span>CONTINUE</span>
                <textarea
                  value={state.continue}
                  onChange={(event) => updateField('continue', event.target.value)}
                  placeholder="V čem má bankéř pokračovat?"
                />
              </label>
            </div>
          </section>

          <section className="final-summary">
            <h2>ZÁVĚREČNÉ SHRNUTÍ</h2>
            <label>
              <span>SILNÉ STRÁNKY – SHRNUTÍ</span>
              <textarea
                value={state.strengths}
                onChange={(event) => updateField('strengths', event.target.value)}
                placeholder="Silné stránky…"
              />
            </label>
            <label>
              <span>ROZVOJOVÉ OBLASTI – SHRNUTÍ</span>
              <textarea
                value={state.development}
                onChange={(event) => updateField('development', event.target.value)}
                placeholder="Rozvojové oblasti…"
              />
            </label>
            <label>
              <span>CELKOVÉ DOPORUČENÍ</span>
              <select
                value={state.recommendation}
                onChange={(event) => updateField('recommendation', event.target.value)}
              >
                <option value="Připraven/a k samostatné práci">Připraven/a k samostatné práci</option>
                <option value="Připraven/a s rozvojovým doporučením">Připraven/a s rozvojovým doporučením</option>
                <option value="Potřebuje další rozvoj před samostatnou prací">Potřebuje další rozvoj před samostatnou prací</option>
              </select>
            </label>
          </section>

          <div className="actions-row">
            <button className="secondary-button" type="button" onClick={resetForm}>
              NOVÉ HODNOCENÍ
            </button>
            <button className="primary-button" type="button" onClick={() => window.print()}>
              VYTISKNOUT / ULOŽIT JAKO PDF
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
