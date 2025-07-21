import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate, useMotionTemplate } from 'framer-motion';
import Planner from './pages/Planner';

const App = () => {
  const [loading, setLoading] = useState(true);
  const radius = useMotionValue(0);

  const maskImage = useMotionTemplate`
    radial-gradient(circle ${radius}px at center, transparent 0%, transparent 99%, black 100%)
  `;

  useEffect(() => {
    const controls = animate(radius, 2000, {
      duration: 5.5,
      ease: [0.4, 0, 0.2, 1],
      onComplete: () => setLoading(false),
    });

    return () => controls.stop();
  }, []);

  return (
    <>
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 bg-[var(--color-accent)] pointer-events-none"
          style={{
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        />
      )}

      <div className="min-h-screen bg-[var(--color-main)] text-[var(--color-text)] flex items-center justify-center">
        <div className="w-full">
          <Planner />
        </div>
      </div>
    </>
  );
};

export default App;
