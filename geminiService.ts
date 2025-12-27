
import { GoogleGenAI } from "@google/genai";
import { Product, StockUnit, Transaction } from './types';

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getInventoryInsights = async (
  products: Product[],
  stock: StockUnit[],
  transactions: Transaction[]
) => {
  const dataSummary = {
    totalProducts: products.length,
    stockCount: stock.length,
    recentSales: transactions.filter(t => t.type === 'SALE').slice(-5)
  };

  const prompt = `
    Act as a senior supply chain analyst for a clinic. 
    Review this inventory summary and provide 3 brief, actionable insights:
    ${JSON.stringify(dataSummary)}
    
    Focus on potential shortages, waste reduction, and sales optimization.
    Format your response as a simple list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Extracting text from response using .text property
    return response.text || "No insights available at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to fetch AI insights.";
  }
};

export const getReplenishmentForecast = async (
  products: Product[],
  stock: StockUnit[],
  transactions: Transaction[]
) => {
  const data = {
    inventory: stock.map(s => ({
      name: products.find(p => p.id === s.productId)?.name,
      qty: s.quantity,
      threshold: products.find(p => p.id === s.productId)?.lowStockThreshold
    })),
    salesHistory: transactions.filter(t => t.type === 'SALE').map(t => ({
      name: products.find(p => p.id === t.productId)?.name,
      qty: t.quantity,
      date: t.date
    }))
  };

  const prompt = `
    Based on the current stock levels and sales history, suggest which 3 items need replenishment urgently.
    Provide a recommended reorder quantity for each.
    Data: ${JSON.stringify(data)}
    Format: Product Name - Recommended Quantity - Reason
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Extracting text from response using .text property
    return response.text || "Forecasting data unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Forecasting system offline.";
  }
};

export const getPharmacySuggestions = async (
  pharmacyId: string,
  products: Product[],
  stock: StockUnit[],
  transactions: Transaction[]
) => {
  const pStock = stock.filter(s => s.locationId === pharmacyId);
  const pSales = transactions.filter(t => t.fromId === pharmacyId && t.type === 'SALE');

  const prompt = `
    Pharmacy ${pharmacyId} analysis:
    Current Stock: ${JSON.stringify(pStock.map(s => ({ name: products.find(p => p.id === s.productId)?.name, qty: s.quantity })))}
    Recent Sales: ${JSON.stringify(pSales.slice(-10))}
    Suggest 3 products this specific pharmacy should request from the central warehouse and why.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Extracting text from response using .text property
    return response.text || "No suggestions for this pharmacy.";
  } catch (error) {
    return "Replenishment engine busy.";
  }
};
