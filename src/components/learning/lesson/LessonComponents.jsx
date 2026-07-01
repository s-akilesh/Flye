import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 1. XPBadge
export const XPBadge = ({ amount = 20 }) => (
  <span 
    style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '4px', 
      fontSize: '11px', 
      fontWeight: '800', 
      color: '#fbbf24', 
      background: 'rgba(251, 191, 36, 0.08)', 
      border: '1px solid rgba(251, 191, 36, 0.2)', 
      padding: '4px 10px', 
      borderRadius: '20px', 
      boxShadow: '0 0 10px rgba(251, 191, 36, 0.05)',
      height: 'fit-content'
    }}
  >
    ⭐ {amount} XP
  </span>
);

// 2. LessonHeader
export const LessonHeader = ({ title, difficulty, time, objective, xp = 20 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-violet)', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
            {difficulty}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            ⏱️ {time}
          </span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: '8px 0 0 0', letterSpacing: '-0.8px' }}>
          {title}
        </h1>
      </div>
      <XPBadge amount={xp} />
    </div>
    
    <div style={{ padding: '12px 16px', background: 'rgba(255, 255, 255, 0.01)', borderLeft: '3px solid var(--accent-violet)', borderRadius: '0 8px 8px 0' }}>
      <span style={{ fontSize: '9px', fontWeight: '850', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>
        Learning Objective
      </span>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
        {objective}
      </p>
    </div>
  </div>
);

// 3. FormulaCard
export const FormulaCard = ({ equation, variables }) => (
  <div 
    className="card-glass" 
    style={{ 
      padding: '20px', 
      border: '1px solid rgba(139, 92, 246, 0.15)', 
      background: 'rgba(139, 92, 246, 0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      borderRadius: '12px'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '18px' }}>🧮</span>
      <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-violet)', letterSpacing: '0.5px' }}>
        Equation & Key Formula
      </span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
      <code style={{ fontSize: '24px', fontWeight: '800', color: '#fff', fontFamily: 'Courier New, monospace', letterSpacing: '1px' }}>
        {equation}
      </code>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '10px', fontWeight: '850', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        Variable Key
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {variables.map((v, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-violet)', background: 'rgba(139, 92, 246, 0.1)', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
              {v.name}
            </span>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              {v.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 4. ApplicationCard
export const ApplicationCard = ({ title, value, description }) => (
  <div 
    className="card-glass" 
    style={{ 
      padding: '16px 20px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '6px',
      background: 'rgba(255,255,255,0.005)',
      borderRadius: '12px',
      transition: 'transform 0.2s, border-color 0.2s'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.5px' }}>
        {value}
      </span>
      <span style={{ fontSize: '12px' }}>⚡</span>
    </div>
    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: '2px 0 0 0' }}>
      {title}
    </h3>
    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
      {description}
    </p>
  </div>
);

// 5. SectionDivider
export const SectionDivider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0 16px 0' }}>
    <span style={{ fontSize: '10px', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1.5px', whiteSpace: 'nowrap' }}>
      {label}
    </span>
    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', width: '100%' }} />
  </div>
);

// 6. CommonMistakes
export const CommonMistakes = ({ mistakes }) => (
  <div 
    className="card-glass" 
    style={{ 
      padding: '20px', 
      border: '1px solid rgba(239, 68, 68, 0.15)', 
      background: 'rgba(239, 68, 68, 0.01)',
      borderRadius: '12px'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <span style={{ fontSize: '18px' }}>⚠️</span>
      <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-crimson, #ef4444)', letterSpacing: '0.5px' }}>
        Common Beginner Mistakes
      </span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {mistakes.map((m, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--accent-crimson, #ef4444)', fontSize: '14px', marginTop: '2px' }}>✖</span>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#fff', margin: 0 }}>
              {m.title}
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
              {m.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 7. ComponentCard
export const ComponentCard = ({ name, description }) => (
  <div 
    className="card-glass" 
    style={{ 
      padding: '16px', 
      display: 'flex', 
      gap: '12px', 
      alignItems: 'center',
      background: 'rgba(255,255,255,0.01)',
      borderRadius: '8px',
      flex: '1 1 200px'
    }}
  >
    <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      📟
    </div>
    <div>
      <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#fff', margin: 0 }}>{name}</h4>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0 0', lineHeight: '1.3' }}>{description}</p>
    </div>
  </div>
);

// 8. LessonCard
export const LessonCard = ({ lesson, isActive, isCompleted }) => (
  <Link 
    to={`/learning/fundamentals/${lesson.slug}`}
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '4px', 
      padding: '12px 16px', 
      borderRadius: '8px', 
      border: `1px solid ${isActive ? 'var(--accent-violet)' : 'rgba(255,255,255,0.04)'}`, 
      background: isActive ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.005)',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    className="lesson-card-hover"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '12.5px', fontWeight: '800', color: isActive ? '#fff' : 'var(--text-primary)' }}>
        {lesson.title}
      </span>
      {isCompleted && (
        <span style={{ color: 'var(--accent-emerald)', fontSize: '11px' }}>✓</span>
      )}
    </div>
    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
      ⏱️ {lesson.time} • {lesson.difficulty}
    </span>
  </Link>
);

// 9. AchievementCard
export const AchievementCard = ({ title, description, badge }) => (
  <div 
    className="card-glass" 
    style={{ 
      padding: '16px', 
      borderRadius: '12px', 
      background: 'rgba(251, 191, 36, 0.02)', 
      border: '1px solid rgba(251, 191, 36, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}
  >
    <div style={{ fontSize: '32px', filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.3))' }}>
      {badge}
    </div>
    <div>
      <span style={{ fontSize: '9px', fontWeight: '850', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Achievement Unlocked
      </span>
      <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: '2px 0' }}>{title}</h4>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{description}</p>
    </div>
  </div>
);

// 10. ProgressCard
export const ProgressCard = ({ stats }) => (
  <div 
    className="card-glass" 
    style={{ 
      padding: '20px', 
      borderRadius: '12px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px'
    }}
  >
    <div>
      <span style={{ fontSize: '9px', fontWeight: '850', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Electrical Basics Progress
      </span>
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '4px 0 0 0' }}>
        Level {stats.level} Mastery
      </h3>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>XP EARNED</span>
        <p style={{ fontSize: '16px', color: '#fff', margin: '2px 0 0 0', fontWeight: 'bold' }}>{stats.xp} XP</p>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>COMPLETED</span>
        <p style={{ fontSize: '16px', color: '#fff', margin: '2px 0 0 0', fontWeight: 'bold' }}>{stats.completed}/{stats.total}</p>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>STREAK</span>
        <p style={{ fontSize: '16px', color: '#fbbf24', margin: '2px 0 0 0', fontWeight: 'bold' }}>🔥 {stats.streak} Days</p>
      </div>
    </div>
    
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
        <span style={{ color: 'var(--text-muted)' }}>Overall Mastery</span>
        <span style={{ color: 'var(--accent-violet)', fontWeight: 'bold' }}>{stats.percentage}%</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${stats.percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-violet))' }} />
      </div>
    </div>
  </div>
);

// 11. QuizCard
export const QuizCard = ({ quiz, onQuizSubmit }) => {
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  const isCorrect = selectedOpt === quiz.answer;

  const handleCheck = () => {
    if (selectedOpt === null) return;
    setSubmitted(true);
    if (onQuizSubmit) {
      onQuizSubmit(selectedOpt === quiz.answer);
    }
  };

  return (
    <div 
      className="card-glass" 
      style={{ 
        padding: '24px', 
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: submitted 
          ? `1px solid ${isCorrect ? 'var(--accent-emerald)' : 'rgba(239, 68, 68, 0.3)'}` 
          : '1px solid var(--border-subtle)'
      }}
    >
      <div>
        <span style={{ fontSize: '10px', fontWeight: '850', textTransform: 'uppercase', color: 'var(--accent-violet)', letterSpacing: '0.5px' }}>
          Interactive Challenge
        </span>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: '6px 0 0 0', lineHeight: '1.4' }}>
          {quiz.question}
        </h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {quiz.options.map((opt, idx) => {
          const isSelected = selectedOpt === idx;
          const isCorrectAns = idx === quiz.answer;
          let borderCol = 'rgba(255,255,255,0.05)';
          let bg = 'rgba(255,255,255,0.005)';
          let textCol = 'var(--text-secondary)';

          if (isSelected) {
            borderCol = 'var(--accent-violet)';
            bg = 'rgba(139, 92, 246, 0.06)';
            textCol = '#fff';
          }
          if (submitted) {
            if (isCorrectAns) {
              borderCol = 'var(--accent-emerald)';
              bg = 'rgba(16, 185, 129, 0.08)';
              textCol = '#fff';
            } else if (isSelected) {
              borderCol = 'var(--accent-crimson, #ef4444)';
              bg = 'rgba(239, 68, 68, 0.08)';
              textCol = 'var(--accent-crimson, #ef4444)';
            }
          }

          return (
            <button
              key={idx}
              disabled={submitted}
              onClick={() => setSelectedOpt(idx)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${borderCol}`,
                background: bg,
                color: textCol,
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: isSelected || (submitted && isCorrectAns) ? '700' : '500',
                cursor: submitted ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                border: '1px solid', 
                borderColor: isSelected || (submitted && isCorrectAns) ? 'transparent' : 'rgba(255,255,255,0.15)',
                background: submitted && isCorrectAns 
                  ? 'var(--accent-emerald)' 
                  : submitted && isSelected 
                    ? 'var(--accent-crimson, #ef4444)' 
                    : isSelected 
                      ? 'var(--accent-violet)' 
                      : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {submitted && isCorrectAns ? '✓' : submitted && isSelected ? '✖' : String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      
      {!submitted ? (
        <button
          onClick={handleCheck}
          disabled={selectedOpt === null}
          style={{
            alignSelf: 'flex-start',
            padding: '8px 20px',
            fontSize: '12px',
            borderRadius: '6px',
            border: 'none',
            background: selectedOpt === null ? 'rgba(255,255,255,0.06)' : 'var(--accent-violet)',
            color: selectedOpt === null ? 'var(--text-muted)' : '#fff',
            cursor: selectedOpt === null ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            transition: 'background 0.2s'
          }}
        >
          Check Answer
        </button>
      ) : (
        <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', borderLeft: `3px solid ${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-crimson, #ef4444)'}`, borderRadius: '0 8px 8px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          <strong style={{ color: isCorrect ? 'var(--accent-emerald)' : 'var(--accent-crimson, #ef4444)', display: 'block', marginBottom: '4px' }}>
            {isCorrect ? '✨ Correct!' : '✖ Incorrect'}
          </strong>
          {quiz.explanation}
        </div>
      )}
    </div>
  );
};

// 12. NavigationFooter
export const NavigationFooter = ({ currentProgress = 50, onPrev, onNext, prevLabel = 'Back', nextLabel = 'Next' }) => (
  <div 
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px', 
      marginTop: '40px', 
      borderTop: '1px solid rgba(255,255,255,0.06)', 
      paddingTop: '24px' 
    }}
  >
    {/* Lesson Navigation Buttons */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {onPrev ? (
        <button 
          onClick={onPrev}
          style={{
            background: 'none',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'var(--text-primary)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          className="btn-prev-hover"
        >
          ← {prevLabel}
        </button>
      ) : <div />}
      
      {onNext ? (
        <button 
          onClick={onNext}
          style={{
            background: 'var(--accent-violet)',
            border: 'none',
            color: '#fff',
            padding: '8px 20px',
            borderRadius: '6px',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'background 0.2s',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.15)'
          }}
          className="btn-next-hover"
        >
          {nextLabel} →
        </button>
      ) : <div />}
    </div>
  </div>
);
