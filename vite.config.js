import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { CONFIG, money } from './src/payments.js';
import { SITE } from './src/data/site.js';

/**
 * index.html is static, so it sits outside React and outside the
 * SITE.isRegistered flag that gates every 80G claim on the page. That is how
 * the social preview ended up advertising a tax exemption the site itself
 * says it does not have.
 *
 * These tags are now generated from the same constants the page renders from,
 * so the preview cannot drift away from the page again.
 */
function metaTags() {
  const plate = money(CONFIG.costPerMeal);
  const tax = SITE.isRegistered
    ? '80G tax exemption.'
    : 'A public fundraiser — donations are not tax-deductible.';

  return {
    META_DESCRIPTION:
      `We serve people in India who are suffering a properly balanced meal — chicken, mutton, ` +
      `egg or dal for protein, vegetables for fibre, grain alongside. ${plate} a plate. ${tax}`,
    OG_DESCRIPTION:
      `Filling a stomach isn't the same as feeding a person. Every ${plate} puts a balanced ` +
      `plate in front of someone. ${tax}`,
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-meta',
      transformIndexHtml(html) {
        const tags = metaTags();
        return Object.entries(tags).reduce(
          (out, [key, value]) => out.replaceAll(`%${key}%`, value),
          html
        );
      },
    },
  ],
  server: { port: 5173, open: true },
  build: { outDir: 'dist' },
});
