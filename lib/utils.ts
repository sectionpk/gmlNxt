import { NextRequest } from 'next/server';

export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return req.ip || 'unknown';
}

export function getUserAgent(req: NextRequest): string {
  return req.headers.get('user-agent') || 'unknown';
}

export function encodeBase64(text: string): string {
  return Buffer.from(text).toString('base64');
}

export function decodeBase64(encoded: string): string {
  return Buffer.from(encoded, 'base64').toString('utf-8');
}

export function generateRandomParam(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 25; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}