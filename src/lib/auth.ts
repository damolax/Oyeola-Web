import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'oyeola_admin_session';
const MAX_AGE = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || 'dev-only-change-me';
}

function sign(payload: string) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex');
}

export function createSessionValue() {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function isSessionValid(value?: string) {
  if (!value) return false;
  const parts = value.split('.');
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts[2]))) return false;
  return Number(parts[1]) > Date.now();
}

export function getAdminSession() {
  const value = cookies().get(COOKIE_NAME)?.value;
  return isSessionValid(value);
}

export function requireAdmin() {
  if (!getAdminSession()) redirect('/admin/login');
}

export function setAdminSession() {
  cookies().set(COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE
  });
}

export function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export function expectedAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'change-this-password';
}
