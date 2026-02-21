import { HeroSection } from '../components/sections/HeroSection';
import { ProblemSection } from '../components/sections/ProblemSection';
import { ProtocolsSlider } from '../components/sections/ProtocolsSlider';
import { SolutionSection } from '../components/sections/SolutionSection';
import { SolutionScreensSlider } from '../components/sections/SolutionScreensSlider';
import { AnaloguesSection } from '../components/sections/AnaloguesSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { AudienceSection } from '../components/sections/AudienceSection';
import { AdvantagesSection } from '../components/sections/AdvantagesSection';
import { UseCaseSection } from '../components/sections/UseCaseSection';
import { FaqSection } from '../components/sections/FaqSection';
import { CtaBannerSection } from '../components/sections/CtaBannerSection';

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <ProtocolsSlider />
      <SolutionSection />
      <SolutionScreensSlider />
      <AnaloguesSection />
      <HowItWorksSection />
      <AudienceSection />
      <AdvantagesSection />
      <UseCaseSection />
      <FaqSection />
      <CtaBannerSection />
    </>
  );
}
