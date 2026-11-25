/* Настройки сайта. Этот файл видит любой посетитель, поэтому здесь НЕ должно быть секретов. */
window.SKAN_CONFIG = {
  // Название сервиса: логотип, заголовок вкладки и тексты обновятся сами
  brand: 'Скан',

  // Supabase → Project Settings → API Keys.
  // Сюда — только адрес проекта и ПУБЛИЧНЫЙ ключ (publishable, раньше назывался anon).
  // Ключи secret / service_role сюда вставлять нельзя: они дают полный доступ к базе в обход защиты.
  supabaseUrl: 'https://ikdsqjucfqewtjuppdef.supabase.co',
  supabaseKey: 'sb_publishable_A40rs4o-XFa0r7ZaK-G33w_758Yd1KT'

  // Адрес сайта указывать не нужно: сайт берёт его из адресной строки.
};
