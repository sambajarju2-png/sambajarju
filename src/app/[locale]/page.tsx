import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Projects } from '@/components/sections/projects';
import { ToolStackFloat } from '@/components/sections/tool-stack-float';
import { Experience } from '@/components/sections/experience';
import { Testimonials } from '@/components/sections/testimonials';
import { Playground } from '@/components/sections/playground';
import { FAQ } from '@/components/sections/faq';
import { Contact } from '@/components/sections/contact';
import { getHeroSettings, getAbout, getExperiences, getTestimonials, getFAQs } from '@/lib/sanity-queries';

export default async function Home() {
  const [heroData, aboutData, experienceData, testimonialData, faqData] = await Promise.all([
    getHeroSettings(),
    getAbout(),
    getExperiences(),
    getTestimonials(),
    getFAQs(),
  ]);

  return (
    <>
      <Hero heroData={heroData} />
      <About aboutData={aboutData} />
      <Projects />
      <ToolStackFloat />
      <Experience experienceData={experienceData} />
      <Testimonials testimonialData={testimonialData} />
      <Playground />
      <FAQ faqData={faqData} />
      <Contact />
    </>
  );
}
