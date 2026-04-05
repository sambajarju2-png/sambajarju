import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Projects } from '@/components/sections/projects';
import { ToolStack } from '@/components/sections/tool-stack';
import { Experience } from '@/components/sections/experience';
import { Testimonials } from '@/components/sections/testimonials';
import { Playground } from '@/components/sections/playground';
import { FAQ } from '@/components/sections/faq';
import { Contact } from '@/components/sections/contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <ToolStack />
      <Experience />
      <Testimonials />
      <Playground />
      <FAQ />
      <Contact />
    </>
  );
}
