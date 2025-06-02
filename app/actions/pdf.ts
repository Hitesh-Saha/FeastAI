'use server'

import { RecipeSchema } from "@/schema/recipe";
import puppeteer from "puppeteer";

export async function generateRecipePDF(recipe: RecipeSchema): Promise<{ success: boolean; url?: string; message: string }> {
  try {
    // Launch a new browser instance
    const options = { 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${recipe.title} - Recipe</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #000;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 { font-size: 24px; margin-bottom: 16px; }
            h2 { font-size: 18px; margin: 16px 0; }
            p { margin-bottom: 8px; }
            ul, ol { margin-bottom: 24px; padding-left: 20px; }
            li { margin-bottom: 8px; }
            .recipe-image {
              width: 100%;
              max-height: 300px;
              object-fit: cover;
              margin-bottom: 20px;
            }
            .meta { color: #666; font-size: 14px; }
            .section { margin-bottom: 24px; }
          </style>
        </head>
        <body>
          ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-image">` : ''}
          
          <h1>${recipe.title}</h1>
          
          <div class="section">
            <p>Cooking Time: ${recipe.cookingTime} mins</p>
            <p>Servings: ${recipe.servings}</p>
            ${recipe.averageRating ? `<p>Rating: ${recipe.averageRating.toFixed(1)} / 5</p>` : ''}
          </div>
          
          <div class="section">
            <h2>Ingredients</h2>
            <ul>
              ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
          </div>
          
          <div class="section">
            <h2>Instructions</h2>
            <ol>
              ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ol>
          </div>
          
          ${recipe.nutrition ? `
            <div class="section">
              <h2>Nutritional Information (per serving)</h2>
              <ul>
                ${Object.entries(recipe.nutrition)
                  .map(([key, value]) => `<li>${key}: ${value} ${key === "sodium" ? "mg" : key === "calories" ? "kcal" : "g"}</li>`)
                  .join('')}
              </ul>
            </div>
          ` : ''}
          
          ${recipe.dietaryTags?.length ? `
            <div class="section">
              <h2>Dietary Tags</h2>
              <p>${recipe.dietaryTags.join(', ')}</p>
            </div>
          ` : ''}
          
          <p class="meta">Generated on ${new Date(recipe.timestamp as string).toLocaleDateString()}</p>
        </body>
      </html>
    `;

    // Set content and generate PDF
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: true
    });

    // Close browser
    await browser.close();

    // Convert buffer to base64
    const base64String = Buffer.from(pdfBuffer).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64String}`;

    return {
      success: true,
      url: dataUrl,
      message: "PDF generated successfully"
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      message: "Failed to generate PDF"
    };
  }
} 