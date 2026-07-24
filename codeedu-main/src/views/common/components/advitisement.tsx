import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import React, { memo, useState } from 'react';
import { Advertisement } from '@/@types/learner/advtisements';
import { Card, CardContent } from '@/components/ui/card';
import { useAdvertisement } from '@/hooks/data/connect/usePosts';

const Advertisements: React.FC = () => {
  const { data: advertisements = [], isLoading: loading, isError: error } = useAdvertisement();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onNextButtonClick = () => {
    if (advertisements && advertisements.length > 0) {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
    }
  };

  const onPrevButtonClick = () => {
    if (advertisements && advertisements.length > 0) {
      setSelectedIndex((prevIndex) => (prevIndex - 1 + advertisements.length) % advertisements.length);
    }
  };

  const onDotButtonClick = (index: number) => {
    if (advertisements && advertisements.length > 0) {
      setSelectedIndex(index);
    }
  };

  const handleAdClick = (advertisement: Advertisement) => {
    if (advertisement.url_ref) {
      window.open(advertisement.url_ref, '_blank', 'noopener,noreferrer');
    }
  };

  // Calculate how many ads to show based on total count
  const getAdsToDisplay = () => {
    if (advertisements.length <= 2) {
      // Show all ads if 2 or less
      return advertisements;
    } else {
      // Show 2 ads starting from selected index, with wrap-around
      const ads = [];
      for (let i = 0; i < 2; i++) {
        const index = (selectedIndex + i) % advertisements.length;
        ads.push(advertisements[index]);
      }
      return ads;
    }
  };

  const adsToDisplay = getAdsToDisplay();
  const showNavigation = advertisements.length >= 3;

  if (loading) return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-center items-center min-h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A8e9]"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="text-center text-red-600">
        Error loading advertisements
      </div>
    </div>
  );

  return (
    <Card className="rounded-2xl shadow-lg border pt-0">
      <CardContent className='pt-3'>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold dark:text-gray-300 text-gray-700 w-full text-right">
            Ads
          </h2>
          {showNavigation && (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border text-gray-600 cursor-pointer border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={onPrevButtonClick}
              >
                <ArrowLeft size={16} strokeWidth={2} />
              </div>
              <div
                className="w-8 h-8 rounded-full border text-gray-600 cursor-pointer border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={onNextButtonClick}
              >
                <ArrowRight size={16} strokeWidth={2} />
              </div>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="overflow-hidden">
          {advertisements?.length > 0 ? (
            <div className="space-y-2">
              {/* Ads in column layout */}
              {adsToDisplay.map((ad: Advertisement, index: number) => (
                <div
                  key={`ad-${ad.id}-${index}`}
                  className="rounded-lg hover:shadow-md transition-shadow cursor-pointer group border"
                  onClick={() => handleAdClick(ad)}
                >
                  {ad.file ? (
                    <div className="w-full rounded-lg overflow-hidden flex items-center justify-center overflow-hidden">
                      <img
                        src={ad.file}
                        alt={ad.display_name || 'Advertisement image'}
                        className="w-full h-[120px] object-inherit rounded-lg p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-[120px] flex items-center justify-center rounded-lg';
                            fallback.innerHTML = '<div class="text-gray-400 text-sm">No image</div>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[120px] rounded-lg flex items-center justify-center">
                      <div className="text-gray-400 text-sm">No advertisement image</div>
                    </div>
                  )}
                </div>
              ))}

              {/* Navigation Dots - Show only when 3 or more ads */}
              {showNavigation && (
                <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-gray-200">
                  {advertisements.map((_, dotIndex) => (
                    <div
                      key={dotIndex}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${dotIndex === selectedIndex ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      onClick={() => onDotButtonClick(dotIndex)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ExternalLink size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Ads Available</h3>
              <p className="text-gray-500 text-sm">Check back later for new content.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(Advertisements);