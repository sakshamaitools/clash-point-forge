
import { supabase } from '@/integrations/supabase/client';

// Input validation utilities
export const validateContentLength = async (fieldName: string, content: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('validate_content_length', { field_name: fieldName, content });
    
    if (error) {
      console.error('Validation error:', error);
      return false;
    }
    
    return data;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
};

// Client-side validation for immediate feedback
export const clientValidateUsername = (username: string): string | null => {
  if (!username || username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 50) return 'Username must be less than 50 characters';
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) return 'Username can only contain letters, numbers, underscores, and hyphens';
  return null;
};

export const clientValidateDisplayName = (displayName: string): string | null => {
  if (!displayName || displayName.length < 1) return 'Display name is required';
  if (displayName.length > 100) return 'Display name must be less than 100 characters';
  return null;
};

export const clientValidateMessage = (message: string): string | null => {
  if (!message || message.length < 1) return 'Message cannot be empty';
  if (message.length > 1000) return 'Message must be less than 1000 characters';
  return null;
};

export const clientValidateTournamentTitle = (title: string): string | null => {
  if (!title || title.length < 5) return 'Tournament title must be at least 5 characters';
  if (title.length > 200) return 'Tournament title must be less than 200 characters';
  return null;
};

export const clientValidateTournamentDescription = (description: string): string | null => {
  if (!description || description.length < 10) return 'Tournament description must be at least 10 characters';
  if (description.length > 2000) return 'Tournament description must be less than 2000 characters';
  return null;
};

// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (content: string): string => {
  const div = document.createElement('div');
  div.textContent = content;
  return div.innerHTML;
};

// Basic profanity filter (can be enhanced with a comprehensive word list)
const basicProfanityList = ['spam', 'scam', 'hack', 'cheat'];

export const containsProfanity = (content: string): boolean => {
  const lowerContent = content.toLowerCase();
  return basicProfanityList.some(word => lowerContent.includes(word));
};

export const validateAndSanitizeInput = (content: string, fieldName: string): { isValid: boolean; sanitized: string; error?: string } => {
  // Sanitize first
  const sanitized = sanitizeHtml(content);
  
  // Check for profanity
  if (containsProfanity(sanitized)) {
    return { isValid: false, sanitized, error: 'Content contains inappropriate language' };
  }
  
  // Field-specific validation
  let error: string | null = null;
  switch (fieldName) {
    case 'username':
      error = clientValidateUsername(sanitized);
      break;
    case 'display_name':
      error = clientValidateDisplayName(sanitized);
      break;
    case 'message_content':
      error = clientValidateMessage(sanitized);
      break;
    case 'tournament_title':
      error = clientValidateTournamentTitle(sanitized);
      break;
    case 'tournament_description':
      error = clientValidateTournamentDescription(sanitized);
      break;
  }
  
  return {
    isValid: !error,
    sanitized,
    error: error || undefined
  };
};
