/* Скан: перевод ответа модели на русский и казахский.
   Модель отвечает только кодами (см. prompt-en.txt), а текст собирается здесь по словарю.
   Перевод бесплатный, мгновенный и всегда одинаковый.
   ВАЖНО: казахские термины составлены без носителя — перед запуском отдайте словарь KK на проверку. */
(function (root) {
  'use strict';

  const RU = {
    part: {
      front_bumper: 'Передний бампер', rear_bumper: 'Задний бампер', hood: 'Капот', trunk_lid: 'Крышка багажника', roof: 'Крыша',
      front_left_fender: 'Переднее левое крыло', front_right_fender: 'Переднее правое крыло',
      rear_left_quarter_panel: 'Заднее левое крыло', rear_right_quarter_panel: 'Заднее правое крыло',
      front_left_door: 'Передняя левая дверь', front_right_door: 'Передняя правая дверь',
      rear_left_door: 'Задняя левая дверь', rear_right_door: 'Задняя правая дверь',
      left_side_skirt: 'Левый порог', right_side_skirt: 'Правый порог',
      left_mirror: 'Левое зеркало', right_mirror: 'Правое зеркало',
      left_headlight: 'Левая фара', right_headlight: 'Правая фара',
      left_taillight: 'Левый задний фонарь', right_taillight: 'Правый задний фонарь', fog_light: 'Противотуманная фара',
      grille: 'Решётка радиатора', windshield: 'Лобовое стекло', rear_window: 'Заднее стекло', side_window: 'Боковое стекло',
      wheel_rim: 'Колёсный диск', tyre: 'Шина', wheel: 'Колесо', other: 'Другая деталь'
    },
    damage: {
      scratch: 'Царапина', scuff: 'Потёртость', paint_chip: 'Скол краски', dent: 'Вмятина', crease: 'Залом',
      crack: 'Трещина', broken: 'Разрушение', misalignment: 'Смещение', glass_damage: 'Повреждение стекла'
    },
    // В русском глубина согласуется по роду со словом повреждения
    gender: { scratch: 'f', scuff: 'f', paint_chip: 'm', dent: 'f', crease: 'm', crack: 'f', broken: 'n', misalignment: 'n', glass_damage: 'n' },
    severity: {
      light: { f: 'лёгкая', m: 'лёгкий', n: 'лёгкое' }, medium: { f: 'средняя', m: 'средний', n: 'среднее' },
      deep: { f: 'глубокая', m: 'глубокий', n: 'глубокое' }, severe: { f: 'сильная', m: 'сильный', n: 'сильное' },
      minor: { f: 'небольшая', m: 'небольшой', n: 'небольшое' }, moderate: { f: 'средняя', m: 'средний', n: 'среднее' }
    },
    action: {
      polish: 'полировка', paintless_dent_repair: 'удаление вмятины без покраски', repair_and_paint: 'ремонт и покраска',
      paint_only: 'покраска', replace: 'замена', inspect: 'нужен осмотр мастером'
    },
    location: {
      upper: 'верхняя часть', lower: 'нижняя часть', middle: 'середина', front_edge: 'передний край', rear_edge: 'задний край',
      near_handle: 'у ручки', near_wheel_arch: 'у колёсной арки', body_line: 'по линии кузова', corner: 'угол', whole_part: 'вся деталь'
    },
    issue: {
      too_dark: 'Фото слишком тёмное', blurry: 'Фото размыто', too_far: 'Снято слишком далеко',
      damage_cut_off: 'Повреждение не попало в кадр целиком', glare: 'На фото блики', dirty_car: 'Машина грязная, мелкие повреждения не видны',
      wrong_vehicle: 'На фото другая машина'
    },
    risk: {
      mounting_brackets: 'крепления', radiator: 'радиатор', headlight_mounts: 'крепления фары', parking_sensors: 'датчики парковки',
      airbag_sensors: 'датчики подушек безопасности', suspension: 'подвеска', door_mechanism: 'механизм двери',
      bumper_reinforcement: 'усилитель бампера', wiring: 'проводка'
    },
    shot: { close_up: 'снимите крупным планом', wider_view: 'снимите издалека', other_angle: 'снимите с другого ракурса', better_light: 'снимите при хорошем свете' },
    ui: {
      size: '≈ {n} см', area: '{n}% детали', check: 'нужна проверка мастером',
      found: 'Найдено повреждений: {n}', toReplace: 'на замену: {n}', none: 'Видимых повреждений не найдено',
      risks: 'Под повреждениями стоит проверить: {list}', unknown: 'другое'
    }
  };

  const KK = {
    part: {
      front_bumper: 'Алдыңғы бампер', rear_bumper: 'Артқы бампер', hood: 'Капот', trunk_lid: 'Жүксалғыш қақпағы', roof: 'Төбе',
      front_left_fender: 'Сол жақ алдыңғы қанат', front_right_fender: 'Оң жақ алдыңғы қанат',
      rear_left_quarter_panel: 'Сол жақ артқы қанат', rear_right_quarter_panel: 'Оң жақ артқы қанат',
      front_left_door: 'Сол жақ алдыңғы есік', front_right_door: 'Оң жақ алдыңғы есік',
      rear_left_door: 'Сол жақ артқы есік', rear_right_door: 'Оң жақ артқы есік',
      left_side_skirt: 'Сол жақ табалдырық', right_side_skirt: 'Оң жақ табалдырық',
      left_mirror: 'Сол жақ айна', right_mirror: 'Оң жақ айна',
      left_headlight: 'Сол жақ фара', right_headlight: 'Оң жақ фара',
      left_taillight: 'Сол жақ артқы шам', right_taillight: 'Оң жақ артқы шам', fog_light: 'Тұманға қарсы фара',
      grille: 'Радиатор торы', windshield: 'Алдыңғы әйнек', rear_window: 'Артқы әйнек', side_window: 'Бүйір әйнек',
      wheel_rim: 'Дөңгелек дискісі', tyre: 'Шина', wheel: 'Дөңгелек', other: 'Басқа бөлшек'
    },
    damage: {
      scratch: 'Сызат', scuff: 'Үйкеліс ізі', paint_chip: 'Бояу сынығы', dent: 'Майысу', crease: 'Бүктелу',
      crack: 'Жарықшақ', broken: 'Сыну', misalignment: 'Ығысу', glass_damage: 'Әйнек зақымы'
    },
    severity: { light: 'жеңіл', medium: 'орташа', deep: 'терең', severe: 'ауыр', minor: 'шамалы', moderate: 'орташа' },
    action: {
      polish: 'жылтырату', paintless_dent_repair: 'майысуды бояусыз түзету', repair_and_paint: 'жөндеу және бояу',
      paint_only: 'бояу', replace: 'ауыстыру', inspect: 'шебердің тексеруі қажет'
    },
    location: {
      upper: 'жоғарғы бөлігі', lower: 'төменгі бөлігі', middle: 'ортасы', front_edge: 'алдыңғы шеті', rear_edge: 'артқы шеті',
      near_handle: 'тұтқаның жанында', near_wheel_arch: 'дөңгелек доғасының жанында', body_line: 'шанақ сызығы бойында', corner: 'бұрышы', whole_part: 'бүкіл бөлшек'
    },
    issue: {
      too_dark: 'Фото тым қараңғы', blurry: 'Фото бұлыңғыр', too_far: 'Тым алыстан түсірілген',
      damage_cut_off: 'Зақым кадрға толық сыймаған', glare: 'Фотода жарқыл бар', dirty_car: 'Көлік лас, ұсақ зақымдар көрінбейді',
      wrong_vehicle: 'Фотода басқа көлік'
    },
    risk: {
      mounting_brackets: 'бекіткіштер', radiator: 'радиатор', headlight_mounts: 'фара бекіткіштері', parking_sensors: 'тұрақ датчиктері',
      airbag_sensors: 'қауіпсіздік жастығының датчиктері', suspension: 'аспа', door_mechanism: 'есік механизмі',
      bumper_reinforcement: 'бампер күшейткіші', wiring: 'электр сымдары'
    },
    shot: { close_up: 'жақыннан түсіріңіз', wider_view: 'алыстан түсіріңіз', other_angle: 'басқа бұрыштан түсіріңіз', better_light: 'жарық жерде түсіріңіз' },
    ui: {
      size: '≈ {n} см', area: 'бөлшектің {n}%', check: 'шебердің тексеруі қажет',
      found: 'Табылған зақымдар: {n}', toReplace: 'ауыстыруға: {n}', none: 'Көрінетін зақым табылмады',
      risks: 'Зақымның астын тексерген жөн: {list}', unknown: 'басқа'
    }
  };

  const DICT = { ru: RU, kk: KK };

  // Названия классов детектора в Roboflow → наши коды.
  // left_light / right_light считаем задними фонарями — уточнить у того, кто размечал.
  const ALIASES = {
    bonnet: 'hood', the_windshield: 'windshield',
    front_left_wing: 'front_left_fender', front_right_wing: 'front_right_fender',
    rear_left_wing: 'rear_left_quarter_panel', rear_right_wing: 'rear_right_quarter_panel',
    left_front_door: 'front_left_door',            // дубль класса front_left_door
    left_light: 'left_taillight', right_light: 'right_taillight'
  };
  const partCode = (c) => (typeof c === 'string' && has(ALIASES, c) ? ALIASES[c] : c);
  const LOW_CONFIDENCE = 0.5;   // ниже этого порога пункт помечается «нужна проверка мастером»

  // Ответ модели — недоверенные данные: берём только известные коды, неизвестные не выводим как есть
  const has = (o, k) => typeof k === 'string' && Object.prototype.hasOwnProperty.call(o, k);
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

  function word(lang, group, code, form) {
    const d = DICT[lang] || RU;
    if (has(d[group], code)) {
      const v = d[group][code];
      return typeof v === 'string' ? v : v[has(v, form) ? form : 'f'];
    }
    if (typeof console !== 'undefined') console.warn('[damage-i18n] неизвестный код', group, code);
    return d.ui.unknown;
  }

  // Одно повреждение → готовые строки для карточки или строки сметы
  function damage(d, lang) {
    const L = DICT[lang] || RU;
    const size = Number(d.approx_size_cm);
    const area = Number(d.affected_area_percent);
    const conf = Number(d.confidence);
    const locs = Array.isArray(d.location_on_part) ? d.location_on_part.slice(0, 2) : [];
    const L0 = DICT[lang] || RU;
    const form = L0.gender && has(L0.gender, d.damage_type) ? L0.gender[d.damage_type] : 'f';
    const details = [word(lang, 'severity', d.severity, form)];
    if (Number.isFinite(size) && size > 0) details.push(fill(L.ui.size, { n: Math.round(size) }));
    if (Number.isFinite(area) && area > 0) details.push(fill(L.ui.area, { n: Math.round(Math.min(area, 100)) }));
    return {
      part: word(lang, 'part', partCode(d.part)),
      damage: word(lang, 'damage', d.damage_type),
      details: details.join(', '),
      location: locs.map((c) => word(lang, 'location', c)).join(', '),
      action: word(lang, 'action', d.suggested_action),
      actionCode: has(L.action, d.suggested_action) ? d.suggested_action : 'inspect',
      needsCheck: !(Number.isFinite(conf) && conf >= LOW_CONFIDENCE),
      checkLabel: L.ui.check
    };
  }

  // Весь отчёт модели → данные для экрана сметы
  function report(r, lang) {
    const L = DICT[lang] || RU;
    const list = Array.isArray(r && r.damages) ? r.damages : [];
    const items = list.map((d) => damage(d, lang));
    const replace = items.filter((i) => i.actionCode === 'replace').length;
    const risks = (r && Array.isArray(r.hidden_damage_risks) ? r.hidden_damage_risks : []).map((c) => word(lang, 'risk', c));
    const q = (r && r.photo_quality) || {};
    return {
      summary: items.length ? fill(L.ui.found, { n: items.length }) + (replace ? ', ' + fill(L.ui.toReplace, { n: replace }) : '') : L.ui.none,
      items,
      photoUsable: q.usable !== false,
      photoIssues: (Array.isArray(q.issues) ? q.issues : []).map((c) => word(lang, 'issue', c)),
      hiddenRisks: risks.length ? fill(L.ui.risks, { list: risks.join(', ') }) : '',
      photosNeeded: (r && Array.isArray(r.photos_needed) ? r.photos_needed : []).map((p) => word(lang, 'part', partCode(p && p.part)) + ': ' + word(lang, 'shot', p && p.shot))
    };
  }

  const api = { report, damage, partCode, DICT, ALIASES, LOW_CONFIDENCE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SkanDamage = api;
})(typeof window !== 'undefined' ? window : this);
