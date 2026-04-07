import { client, urlFor } from './sanity';

export async function getHeroSettings() {
  const data = await client.fetch(
    `*[_type == "heroSettings" && _id == "heroSettings"][0]{
      photo,
      greeting_nl, greeting_en,
      title_nl, title_en,
      subtitle_nl, subtitle_en,
      cta_primary_nl, cta_primary_en,
      cta_secondary_nl, cta_secondary_en,
      companies
    }`,
    {},
    { next: { revalidate: 30 } }
  );
  if (!data) return null;
  return {
    ...data,
    photoUrl: data.photo ? urlFor(data.photo).width(800).height(1000).url() : null,
  };
}

export async function getAbout() {
  const data = await client.fetch(
    `*[_type == "about" && _id == "about"][0]{
      photo1, photo2, photo3, photo4,
      bio_nl, bio_en,
      highlights
    }`,
    {},
    { next: { revalidate: 30 } }
  );
  if (!data) return null;
  return {
    ...data,
    photo1Url: data.photo1 ? urlFor(data.photo1).width(400).height(400).url() : null,
    photo2Url: data.photo2 ? urlFor(data.photo2).width(400).height(400).url() : null,
    photo3Url: data.photo3 ? urlFor(data.photo3).width(400).height(400).url() : null,
    photo4Url: data.photo4 ? urlFor(data.photo4).width(400).height(400).url() : null,
  };
}

export async function getExperiences() {
  return client.fetch(
    `*[_type == "experience"] | order(order asc){
      company, role_nl, role_en, period,
      description_nl, description_en, active, icon, order
    }`,
    {},
    { next: { revalidate: 30 } }
  );
}

export async function getProjects() {
  return client.fetch(
    `*[_type == "project"] | order(order asc){
      title, slug, description_nl, description_en,
      image, featured, techStack, url,
      problem_nl, problem_en, solution_nl, solution_en, order
    }`,
    {},
    { next: { revalidate: 30 } }
  );
}

export async function getTestimonials() {
  return client.fetch(
    `*[_type == "testimonial"] | order(order asc){
      name, role, company, quote_nl, quote_en, order
    }`,
    {},
    { next: { revalidate: 30 } }
  );
}

export async function getFAQs() {
  return client.fetch(
    `*[_type == "faq"] | order(order asc){
      question_nl, question_en, answer_nl, answer_en, order
    }`,
    {},
    { next: { revalidate: 30 } }
  );
}
