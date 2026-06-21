import { describe, it, expect, vi } from 'vitest';
import { generateTip, generateNews } from './ai';

// Mock the Google Generative AI library
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: async (prompt: string) => {
            if (prompt.includes('news')) {
              return {
                response: {
                  text: () => JSON.stringify([
                    { category: "Awareness", title: "Test News", description: "This is test news." }
                  ])
                }
              };
            }
            return {
              response: {
                text: () => "Swap your car for a bike!"
              }
            };
          }
        };
      }
    }
  };
});

describe('AI Generation Services', () => {
  const dummyApiKey = 'test-api-key';

  describe('generateTip', () => {
    it('returns a fallback message if API key is missing', async () => {
      const tip = await generateTip({ profile: {}, stats: {} }, undefined);
      expect(tip).toContain('Add your Gemini API key');
    });

    it('generates a personalized tip successfully', async () => {
      const tip = await generateTip({
        profile: { full_name: 'Jane Doe', commute_mode: 'Car' },
        stats: { travelKg: 50, totalKg: 100 }
      }, dummyApiKey);
      expect(tip).toBe('Swap your car for a bike!');
    });
  });

  describe('generateNews', () => {
    it('returns null if API key is missing', async () => {
      const news = await generateNews(undefined);
      expect(news).toBeNull();
    });

    it('generates parsed news JSON successfully', async () => {
      const news = await generateNews(dummyApiKey);
      expect(Array.isArray(news)).toBe(true);
      expect(news[0].title).toBe('Test News');
    });
  });
});
