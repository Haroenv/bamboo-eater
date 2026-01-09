// Type definitions for browser API (Safari/WebExtensions)
// This makes 'browser' available as an alias for 'chrome' API

declare const browser: typeof chrome;

interface Message {
  action?: string;
}

interface MessageResponse {
  status: string;
  message?: string;
}

interface Window {
  CSRF_TOKEN?: string;
}
