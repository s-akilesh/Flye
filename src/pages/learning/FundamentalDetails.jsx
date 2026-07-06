import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';
import { useToast } from '../../context/ToastContext';
import {
  LessonHeader,
  FormulaCard,
  ApplicationCard,
  SectionDivider,
  CommonMistakes,
  ComponentCard,
  QuizCard,
  NavigationFooter,
  SectionTitle,
  LearningCard,
  TipCard,
  WarningCard,
  ExperimentCard
} from '../../components/learning/lesson/LessonComponents';
import { ExperimentWidget } from '../../components/learning/lesson/ExperimentWidgets';

export const FundamentalDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Load current lesson
  const lesson = useMemo(() => {
    return LearningRepository.getFundamentalBySlug(slug);
  }, [slug]);

  // Load all lessons list for navigation/progress
  const allLessons = useMemo(() => {
    return LearningRepository.getFundamentals();
  }, []);

  // Local state for progress tracking
  const [completedList, setCompletedList] = useState([]);
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(3);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    // Load progress from localStorage
    const savedCompleted = localStorage.getItem('flyen_completed_lessons');
    if (savedCompleted) {
      try {
        setCompletedList(JSON.parse(savedCompleted));
      } catch (e) {}
    }

    const savedXp = localStorage.getItem('flyen_student_xp');
    if (savedXp) {
      setXp(Number(savedXp));
    }

    const savedStreak = localStorage.getItem('flyen_learning_streak');
    if (savedStreak) {
      setStreak(Number(savedStreak));
    }
  }, []);

  // Save progress details and set recent history
  useEffect(() => {
    if (lesson) {
      // Save last visited lesson
      localStorage.setItem('flyen_last_lesson', JSON.stringify({
        name: lesson.title,
        slug: lesson.slug,
        progress: Math.round(((completedList.length) / allLessons.length) * 100),
        isFallback: false
      }));

      // Add to recently visited list
      const savedRecents = localStorage.getItem('flyen_recent_history');
      let recentsList = [];
      if (savedRecents) {
        try {
          recentsList = JSON.parse(savedRecents);
        } catch (e) {}
      }
      recentsList = recentsList.filter(item => item.path !== `/learning/fundamentals/${lesson.slug}`);
      recentsList.unshift({
        title: lesson.title,
        path: `/learning/fundamentals/${lesson.slug}`
      });
      localStorage.setItem('flyen_recent_history', JSON.stringify(recentsList.slice(0, 5)));
    }
  }, [slug, lesson, completedList, allLessons]);

  if (!lesson) {
    return (
      <div style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#fff' }}>Lesson not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>The requested module slug could not be resolved.</p>
        <button 
          className="cta-button" 
          onClick={() => navigate(ROUTES.LEARNING_WORKSPACE)}
          style={{ padding: '10px 20px', fontSize: '13px' }}
        >
          Return to Workspace
        </button>
      </div>
    );
  }

  // Handle quiz completion and unlock rewards
  const handleQuizSubmit = (isCorrect) => {
    if (isCorrect) {
      setQuizScore(s => s + 1);
      showToast('✨ Correct Answer! +20 XP earned!', 'success');
      
      // Update completed lessons list
      if (!completedList.includes(lesson.slug)) {
        const newList = [...completedList, lesson.slug];
        setCompletedList(newList);
        localStorage.setItem('flyen_completed_lessons', JSON.stringify(newList));
        
        // Update XP
        const newXp = xp + 20;
        setXp(newXp);
        localStorage.setItem('flyen_student_xp', newXp.toString());
      }
    } else {
      showToast('❌ Incorrect answer. Review the concept checklist below and try again!', 'error');
    }
  };

  // Compute navigation labels and actions
  const prevLesson = allLessons.find(l => l.slug === lesson.prevSlug);
  const nextLesson = allLessons.find(l => l.slug === lesson.nextSlug);

  const handlePrev = prevLesson ? () => {
    navigate(`/learning/fundamentals/${prevLesson.slug}`);
    window.scrollTo(0, 0);
  } : null;

  const handleNext = nextLesson ? () => {
    navigate(`/learning/fundamentals/${nextLesson.slug}`);
    window.scrollTo(0, 0);
  } : () => {
    showToast('🎓 Congratulations! You have completed Level 1: Electrical Basics!', 'success');
    navigate(ROUTES.LEARNING_WORKSPACE);
  };

  // Compute progress statistics
  const progressStats = {
    level: 1,
    xp: xp,
    completed: completedList.length,
    total: allLessons.length,
    percentage: Math.round((completedList.length / allLessons.length) * 100),
    streak: streak
  };

  return (
    <div style={{ paddingBottom: 'var(--space-8)', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 2-Column Dashboard Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Main content block */}
        <div style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Reusable LessonHeader */}
          <LessonHeader
            title={lesson.title}
            difficulty={lesson.difficulty}
            time={lesson.time}
            objective={lesson.learningObjective}
            xp={20}
          />

          {/* Overview text segment */}
          <div className="card-glass" style={{ padding: '24px', background: 'rgba(255,255,255,0.005)', borderRadius: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: '850', textTransform: 'uppercase', color: 'var(--accent-violet)', letterSpacing: '0.5px' }}>
              Lesson Overview
            </span>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lesson.overview.map((para, idx) => (
                <p key={idx} style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Key Concepts (Learning Cards) */}
          {lesson.keyConcepts && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <SectionTitle label="Key Concepts" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <LearningCard 
                  type="learn" 
                  title="What you will learn" 
                  description={
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px' }}>
                      {lesson.keyConcepts.map((item, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                      ))}
                    </ul>
                  } 
                />
                <LearningCard 
                  type="goal" 
                  title="Learning Goal" 
                  description={lesson.learningObjective} 
                />
                {lesson.whyItMatters && (
                  <LearningCard 
                    type="why" 
                    title="Why it matters" 
                    description={lesson.whyItMatters} 
                  />
                )}
              </div>
            </div>
          )}

          {/* Visual Explanation & Simulator */}
          <div>
            <SectionTitle label="Visual Explanation & Lab" />
            <ExperimentWidget slug={lesson.slug} />
          </div>

          {/* Working Principle section */}
          <div>
            <SectionTitle label="Working Principle" />
            <div className="card-glass" style={{ padding: '24px', background: 'rgba(255,255,255,0.005)', borderRadius: '12px', borderLeft: '3px solid var(--accent-emerald)' }}>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                {lesson.workingPrinciple}
              </p>
            </div>
          </div>

          {/* Real World Applications or Technical Specifications */}
          {lesson.applications && lesson.applications.length > 0 ? (
            <div>
              <SectionTitle label="Real World Applications" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {lesson.applications.map((app, idx) => (
                  <ApplicationCard
                    key={idx}
                    title={app.title}
                    value={app.value}
                    description={app.description}
                  />
                ))}
              </div>
            </div>
          ) : lesson.specs && lesson.specs.length > 0 ? (
            <div>
              <SectionTitle label="Technical Specifications" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {lesson.specs.map((spec, idx) => (
                  <div 
                    key={idx}
                    className="card-glass" 
                    style={{ 
                      padding: '16px 20px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '4px',
                      background: 'rgba(255,255,255,0.005)',
                      borderRadius: '12px'
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.5px' }}>
                      {spec.label}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', margin: '4px 0 0 0' }}>
                      {spec.value}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Formula Card or Note Card if available */}
          {lesson.formula && (
            <div>
              <SectionTitle label="Key Formula & Calculations" />
              <FormulaCard 
                equation={lesson.formula.equation} 
                variables={lesson.formula.variables} 
              />
            </div>
          )}

          {/* Hands-on Mini Experiment */}
          {lesson.miniExperiment && (
            <div>
              <SectionTitle label="Hands-on Mini Experiment" />
              <ExperimentCard 
                title={lesson.miniExperiment.title} 
                description={lesson.miniExperiment.description} 
                steps={lesson.miniExperiment.steps} 
              />
            </div>
          )}

          {/* Common Mistakes */}
          {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
            <div>
              <SectionTitle label="Avoid Common Mistakes" />
              <CommonMistakes mistakes={lesson.commonMistakes} />
            </div>
          )}

          {/* Interactive Quiz card */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <div>
              <SectionTitle label="Concept Challenge Quiz" />
              <QuizCard 
                quiz={lesson.quiz[0]} 
                onQuizSubmit={handleQuizSubmit} 
              />
            </div>
          )}

          {/* Related Hardware Components & Projects */}
          <div>
            <SectionTitle label="Related Hardware & Projects" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '850', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  Related Components
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {lesson.relatedComponents.map((comp, idx) => (
                    <ComponentCard key={idx} name={comp.name} description={comp.description} />
                  ))}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '850', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  Related Projects
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {lesson.relatedProjects.map((proj, idx) => (
                    <ComponentCard key={idx} name={proj.name} description={proj.description} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reusable bottom navigation controls */}
          <NavigationFooter
            onPrev={handlePrev}
            onNext={handleNext}
            prevLabel={prevLesson ? prevLesson.title : 'Back'}
            nextLabel={nextLesson ? `Continue: ${nextLesson.title}` : 'Complete Level 1'}
          />

        </div>

      </div>

    </div>
  );
};
