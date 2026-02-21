export interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

export const DOCTOR_NAV: NavItem[] = [
  { path: '/doctor/chats', label: 'Чаты / Кейсы' },
  { path: '/doctor/history', label: 'История проверок' },
  { path: '/doctor/guidelines', label: 'Библиотека гайдов' },
  { path: '/doctor/notifications', label: 'Уведомления' },
  { path: '/doctor/profile', label: 'Профиль и настройки' },
  { path: '/doctor/help', label: 'Помощь / FAQ' },
];
