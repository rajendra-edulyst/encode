import React from 'react';
import NoProfileFound from '@/assets/images/NoProfileFound.json';
import LottieAnimation from '@/components/ui/LottieAnimation';

export const RenderWhenNoEditKeyFound: React.FC = () => {
  return (
    <div className="flex  flex-col items-center justify-center mt-5">
      <LottieAnimation className="w-96" opacity={0.8} animationData={NoProfileFound} />
      <p className="text-primary text-center text-lg">Please try again after some time.</p>
    </div>
  );
};
