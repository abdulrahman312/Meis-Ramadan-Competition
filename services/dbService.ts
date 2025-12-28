import { User, UserRole, Question, GoogleSheetResponse } from '../types';

const API_URL = "https://script.google.com/macros/s/AKfycbzZ6Vd_kflH1Y1Ib9LOb67N_b32y7cMqo57kqvHvol1xCW7l4ZDVqehFhkWVs6fnKIhsQ/exec";

// Helper to construct request options
const getOptions = (method: 'GET' | 'POST', body?: any): RequestInit => {
  const options: RequestInit = {
    method,
    mode: 'cors', // Required to read the response body
    credentials: 'omit', // CRITICAL: Do not send cookies (prevents auth conflicts with Google)
    redirect: 'follow', // Follow the Google Script 302 redirect
    referrerPolicy: 'no-referrer', // IMPORTANT: Prevents sending Referer header which can trigger GAS security blocks
  };

  if (method === 'POST' && body) {
    // For POST, we use text/plain to avoid preflight (OPTIONS) requests which GAS hates
    options.headers = {
      'Content-Type': 'text/plain;charset=utf-8',
    };
    options.body = JSON.stringify(body);
  }

  return options;
};

export const dbService = {
  
  async getStatus(): Promise<string> {
    try {
      // Add timestamp to prevent caching
      const params = new URLSearchParams({
        action: 'getStatus',
        _t: Date.now().toString()
      });
      const url = `${API_URL}?${params.toString()}`;
      const response = await fetch(url, getOptions('GET'));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: GoogleSheetResponse = await response.json();
      return data.status || 'NA';
    } catch (error) {
      console.error("Fetch Error (getStatus):", error);
      return 'NA';
    }
  },

  async verifyUser(idInput: string, role: UserRole): Promise<User | null> {
    try {
      const params = new URLSearchParams({
        action: 'verifyUser',
        id: idInput.trim(),
        role: role,
        _t: Date.now().toString() // Cache buster
      });
      
      const url = `${API_URL}?${params.toString()}`;
      const response = await fetch(url, getOptions('GET'));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: GoogleSheetResponse = await response.json();
      return data.user || null;
    } catch (error) {
      console.error("Fetch Error (verifyUser):", error);
      return null;
    }
  },

  async getQuestion(day: string): Promise<Question | null> {
    try {
      const params = new URLSearchParams({
        action: 'getQuestion',
        day: day.trim(), // Added trim here
        _t: Date.now().toString()
      });
      
      const url = `${API_URL}?${params.toString()}`;
      const response = await fetch(url, getOptions('GET'));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GoogleSheetResponse = await response.json();
      return data.question || null;
    } catch (error) {
      console.error("Fetch Error (getQuestion):", error);
      return null;
    }
  },

  async checkSubmission(userId: string, day: string): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        action: 'checkSubmission',
        userId: userId.trim(),
        day: day.trim(),
        _t: Date.now().toString()
      });
      
      const url = `${API_URL}?${params.toString()}`;
      const response = await fetch(url, getOptions('GET'));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GoogleSheetResponse = await response.json();
      return !!data.isAlreadySubmitted;
    } catch (error) {
      console.error("Fetch Error (checkSubmission):", error);
      return false;
    }
  },

  async submitAnswer(userId: string, day: string, isCorrect: boolean): Promise<boolean> {
    try {
      const response = await fetch(API_URL, getOptions('POST', {
        action: 'submitAnswer',
        userId: userId.trim(),
        day: day.trim(),
        isCorrect
      }));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.status === 'success';
    } catch (error) {
      console.error("Fetch Error (submitAnswer):", error);
      return false;
    }
  }
};