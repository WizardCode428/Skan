(() => {
  'use strict';

  /* Настройки (название, адрес сайта, Supabase) лежат в config.js. */
  const CFG = window.SKAN_CONFIG || {};
  const BRAND = String(CFG.brand || 'Скан');
  const MAX_PHOTOS = 6;
  const LANG_KEY = 'skan.lang';

  const doc = document;
  const root = doc.documentElement;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Переводы. Русские тексты берутся прямо из разметки (ключ data-i18n),
     здесь — только то, что нужно скрипту, и вся казахская версия.
     ------------------------------------------------------------------ */
  const RU = {
    'meta.title': '{brand} — оценка ремонта после ДТП по фото',
    'meta.desc': 'Сфотографируйте повреждения после ДТП: AI за пару минут покажет, что менять и красить, сколько это стоит и где купить запчасти у проверенных продавцов в Казахстане.',
    'a11y.home': '{brand} — на главную',
    'up.title.pick': 'Оценка ущерба по фото',
    'up.title.scan': 'Анализируем…',
    'up.title.done': 'Смета готова',
    'up.count': 'Добавлено фото: {n} из {max}',
    'up.limit': 'Можно добавить не больше {max} фото.',
    'up.notimage': 'Подходят только изображения.',
    'up.alt': 'Фото повреждения {n}',
    'up.remove': 'Удалить фото {n}',
    'share.footer': '{brand}: оценка ремонта по фото',
    'share.saved': 'Смета сохранена в личном кабинете.',
    'share.fail': 'Не удалось сохранить. Попробуйте ещё раз.',
    'share.login': 'Войдите, чтобы сохранить смету.',
    'share.off': 'Личный кабинет ещё не подключён.',
    'share.frame': 'В предпросмотре печать заблокирована. На опубликованном сайте откроется окно сохранения в PDF.',
    'acc.in.submit': 'Войти',
    'acc.up.submit': 'Создать аккаунт',
    'acc.del': 'Удалить смету {n}',
    'acc.del2': 'Нажмите ещё раз, чтобы удалить смету {n}',
    'acc.msg.off': 'Вход заработает после подключения Supabase в файле config.js.',
    'acc.msg.key': 'В config.js указан секретный ключ. Замените его на публичный (publishable / anon).',
    'acc.msg.email': 'Проверьте адрес почты.',
    'acc.msg.short': 'Пароль должен быть не короче 8 символов.',
    'acc.msg.bad': 'Неверная почта или пароль.',
    'acc.msg.confirm': 'Подтвердите почту: ссылка в письме, которое мы отправили.',
    'acc.msg.sent': 'Мы отправили письмо. Перейдите по ссылке в нём, чтобы завершить регистрацию.',
    'acc.msg.reset': 'Если такой аккаунт есть, мы отправили письмо со ссылкой для смены пароля.',
    'acc.msg.saved': 'Пароль обновлён.',
    'acc.msg.wait': 'Слишком много попыток. Подождите минуту и попробуйте снова.',
    'acc.msg.net': 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.',
    'acc.msg.err': 'Не получилось. Попробуйте ещё раз.',
    'up.privacy.live': 'Фото отправляются только на анализ и нигде не сохраняются. Сохраняется лишь смета, если вы сами её сохраните.',
    'up.login': 'Войдите в аккаунт, чтобы получить анализ ваших фото. Без входа можно посмотреть пример.',
    'up.err.quota': 'На сегодня лимит анализов исчерпан ({limit} в сутки). Попробуйте завтра.',
    'up.err.photo': 'Не удалось прочитать фото. Попробуйте другое, в формате JPG или PNG.',
    'up.err.service': 'Сервис анализа сейчас недоступен. Попробуйте позже или посмотрите пример.',
    'up.err.auth': 'Сессия истекла. Войдите в аккаунт заново.',
    'done.live': 'Предварительная оценка по фото. Цены ориентировочные: точную сумму назовёт мастер после осмотра.',
    'res.none': 'На фото повреждений не найдено. Попробуйте снять повреждение ближе и при хорошем свете.',
    'res.photo': 'Фото {n} с отмеченными повреждениями',
    'res.unknown': 'не указан',
    'est.prelim': 'предварительно',
    'est.note.live': 'Цены ориентировочные и даны для демонстрации.'
  };

  const KK = {
    'meta.title': '{brand} — жол апатынан кейінгі жөндеуді фото бойынша бағалау',
    'meta.desc': 'Жол апатынан кейінгі зақымдарды суретке түсіріңіз: AI бірнеше минутта нені ауыстыру, нені бояу керегін, қанша тұратынын және бөлшектерді Қазақстандағы тексерілген сатушылардан қайдан алуға болатынын көрсетеді.',
    'a11y.home': '{brand} — басты бетке',
    'a11y.skip': 'Мазмұнға өту',
    'a11y.nav': 'Негізгі навигация',
    'a11y.lang': 'Сайт тілі',
    'a11y.menu': 'Мәзір',
    'a11y.close': 'Жабу',

    'nav.how': 'Қалай жұмыс істейді',
    'nav.partners': 'СТО мен сатушыларға',
    'nav.faq': 'Сұрақ-жауап',
    'nav.account': 'Аккаунт',
    'cta.estimate': 'Залалды бағалау',
    'cta.upload': 'Фото жүктеу',
    'cta.how': 'Бұл қалай жұмыс істейді',

    'hero.eyebrow': 'Залалды AI-бағалау · Қазақстан',
    'hero.title': '<span class="h1-q">Жол апатына ұшырадыңыз ба?</span> Суретке түсіріңіз — жөндеуді есептеп береміз',
    'hero.lead': 'AI бірнеше минутта нені ауыстыру, нені бояу керегін, жөндеудің қанша тұратынын және қосалқы бөлшектерді қайдан арзан алуға болатынын көрсетеді',
    'hero.f1': 'Жүргізушіге тегін',
    'hero.f2': 'Нәтиже 2 минутта',
    'hero.f3': 'Тексерілген сатушылар',
    'car.t': 'Зақымдары белгіленген автокөлік сызбасы',
    'car.d': 'Седан, сол жағынан көрініс, техникалық сызба стилінде. Белгіленген зақымдар: алдыңғы бампер — ауыстыру, 85 000 ₸; капот — бояу, 40 000 ₸; сол жақ фара — ауыстыру, 62 000 ₸.',
    'car.view': 'Сол жағынан көрініс · М 1:25',
    'sheet.total': 'Фото бойынша жиыны',

    'part.bumper': 'Алдыңғы бампер',
    'part.hood': 'Капот',
    'part.lamp': 'Сол жақ фара',
    'part.fender': 'Алдыңғы сол қанат',
    'part.grille': 'Радиатор торы',
    'act.replace': 'ауыстыру',
    'act.paint': 'бояу',
    'act.repair': 'жөндеу',

    'problem.eyebrow': 'Мәселе',
    'problem.title': 'Апаттан кейін жауаптан гөрі сұрақ көп',
    'problem.c1.t': 'Жөндеудің қанша тұратыны белгісіз',
    'problem.c1.d': 'Бірнеше сервисті аралап шықпайынша нақты соманы білу мүмкін емес. Ал көлік осы уақыт бойы тұрып қалады.',
    'problem.c2.t': 'СТО бағаны асырып айтуы мүмкін',
    'problem.c2.d': 'Тәуелсіз бағалау болмаса, сметаның әділ екенін және оған артық жұмыс қосылмағанын түсіну қиын.',
    'problem.c3.t': 'Қосалқы бөлшектерді ондаған хабарландырудан іздеуге тура келеді',
    'problem.c3.d': 'Бағасы әртүрлі, сапасы белгісіз, кепілдік жоқ. Салыстыруға бірнеше күн кетеді.',

    'how.eyebrow': 'Үш қадам',
    'how.title': 'Бұл қалай жұмыс істейді',
    'how.lead': 'Фотодан бағасы көрсетілген бөлшектер тізіміне дейін, сервистерді аралаусыз.',
    'how.s1.t': 'Зақымдарды суретке түсіріңіз',
    'how.s1.d': 'Әр қырынан түсірілген 3–5 сурет жеткілікті. Кәдімгі телефон камерасы жарайды.',
    'how.s2.t': 'AI суреттерді талдайды',
    'how.s2.d': 'Модель зақымдалған бөлшектерді танып, әрқайсысы бойынша шешім шығарады: ауыстыру, жөндеу немесе бояу.',
    'how.s3.t': 'Смета мен бағасы көрсетілген бөлшектер тізімін алыңыз',
    'how.s3.d': 'Тексерілген сатушылардың ұсыныстарын салыстырып, қажеттісіне бірден тапсырыс беріңіз.',

    'result.eyebrow': 'Нәтиже үлгісі',
    'result.title': 'Болжамның орнына түсінікті смета',
    'result.lead': 'Әр бөлшек бойынша не істеу керегі және қанша тұратыны көрініп тұр. Сметаны шеберге көрсетуге немесе бөлшектерге бірден тапсырыс беруге болады.',
    'result.p1': 'Әр позицияда жұмыс түрі көрсетілген: ауыстыру, жөндеу немесе бояу',
    'result.p2': 'Бағалар тексерілген сатушылардың ұсыныстарынан алынады',
    'result.p3': 'Жиынтық соманы СТО айтқан бағамен салыстыру оңай',
    'est.kicker': 'Жөндеу сметасы',
    'est.sample': 'үлгі',
    'est.car': 'Автокөлік',
    'est.city': 'Қала',
    'est.almaty': 'Алматы',
    'est.date': 'Күні',
    'est.caption': 'Бөлшектер, әрекеттер және бағалар',
    'est.th1': 'Бөлшек',
    'est.th2': 'Әрекет',
    'est.th3': 'Бағасы',
    'est.parts': 'Қосалқы бөлшектер',
    'est.works': 'Жұмыстар',
    'est.total': 'Жиыны',
    'est.buy': 'Бөлшектерді сатып алу',
    'est.note': 'Бұл үлгі. Ондағы бағалар шартты.',

    'partners.eyebrow': 'Серіктестерге',
    'partners.title': 'СТО мен қосалқы бөлшек сатушыларына',
    'partners.lead': 'Дайын клиенттерді алыңыз, тек сатылым үшін төлеңіз.',
    'partners.cta': 'Серіктес болу',
    'partners.f1.t': 'Дайын сметасы бар клиент',
    'partners.f1.d': 'Жүргізуші өзіне не керегін біледі: бөлшектер мен жұмыстар тізімі алдын ала жасалған.',
    'partners.f2.t': 'Тек нәтиже үшін төлем',
    'partners.f2.d': 'Абоненттік төлем жоқ. Комиссия тек платформа арқылы рәсімделген сатылымнан алынады.',
    'partners.f3.t': 'Өз қалаңыздан өтінімдер',
    'partners.f3.d': 'Өзіңіз жұмыс істейтін маркалар мен бөлшек санаттары бойынша сұраныстар аласыз.',

    'stats.eyebrow': 'Артықшылықтар',
    'stats.title': 'Неге <span data-brand></span>',
    'stats.s1.u': 'мин',
    'stats.s1.t': 'бағалауға',
    'stats.s1.d': 'Фото жүктеуден дайын сметаға дейін.',
    'stats.s2.t': 'жүргізуші үшін',
    'stats.s2.d': 'Бағалау да, бөлшек іріктеу де тегін.',
    'stats.s3.t': 'тексерілген сатушылар',
    'stats.s3.d': 'Құжаттарды, пікірлерді және кепілдік шарттарын тексереміз.',

    'faq.title': 'Сұрақтар мен жауаптар',
    'faq.lead': 'Жауап таппадыңыз ба? Бізге Telegram немесе WhatsApp арқылы жазыңыз.',
    'faq.q1': 'Бағалау қаншалықты дәл?',
    'faq.a1': 'AI фотодағы көрінетін зақымдарды бағалап, бағаларды сатушылардың өзекті ұсыныстарымен салыстырады. Бұл алдын ала смета: жасырын ақауларды тек шебер қарап тексергенде таба алады. Әр қырынан түсірілген анық суреттер неғұрлым көп болса, нәтиже соғұрлым дәл болады.',
    'faq.q2': 'Бұл тегін бе?',
    'faq.a2': 'Иә. Жүргізуші үшін бағалау да, бөлшек іріктеу де тегін. Біз платформа арқылы рәсімделген тапсырыстардан сатушылар мен СТО төлейтін комиссиядан табыс табамыз.',
    'faq.q3': 'Қандай көлік маркаларына қолдау көрсетіледі?',
    'faq.a3': 'Қазақстандағы ең танымал маркалар: Toyota, Hyundai, Kia, Chevrolet, Lada, Volkswagen, Nissan, Lexus және басқалары. Тізім үнемі толығып отырады. Сіздің модель әзірге жоқ болса, бізге жазыңыз, қосылған кезде хабарлаймыз.',
    'faq.q4': 'Сатушылар қалай таңдалады?',
    'faq.a4': 'Әр сатушы мен СТО тексеруден өтеді: құжаттары, клиенттердің пікірлері, кепілдік пен қайтару шарттары. Шағым түскен серіктестерді платформадан ажыратамыз.',
    'faq.q5': 'Сақтандыру компаниясына пайдалануға бола ма?',
    'faq.a5': 'Смета ақпараттық сипатта және ресми сараптаманы алмастырмайды. Дегенмен ол сақтандыру компаниясымен сөйлесуге дайындалуға және ұсынылған төлемнің қаншалықты әділ екенін түсінуге көмектеседі.',

    'cta.title': 'Залалды дәл қазір бағалаңыз',
    'cta.lead': 'Зақымдарды суретке түсіріңіз, бірнеше минуттан кейін бағасы көрсетілген смета дайын болады.',

    'footer.about': 'Жол апатынан кейінгі жөндеуді AI-бағалау және тексерілген сатушылардан бөлшек іріктеу.',
    'footer.nav': 'Бөлімдер',
    'footer.contacts': 'Байланыс',
    'footer.social': 'Мессенджерлер',
    'footer.rights': 'Барлық құқықтар қорғалған.',
    'footer.country': 'Қазақстан',

    'up.title.pick': 'Залалды фото бойынша бағалау',
    'up.title.scan': 'Талдап жатырмыз…',
    'up.title.done': 'Смета дайын',
    'up.drop': 'Суретке түсіріңіз немесе фото таңдаңыз',
    'up.formats': '6 суретке дейін · JPG, PNG, HEIC',
    'up.tip1': 'Жалпы план: зақымдалған бөлшек тұтас көрінсін',
    'up.tip2': 'Жақын план: зақымның өзі жақыннан',
    'up.tip3': 'Күндізгі жарық, жылтыр мен көлеңкесіз',
    'up.privacy': 'Демо-нұсқа: фотолар құрылғыңызда қалады, ешқайда жіберілмейді.',
    'up.go': 'Жөндеуді есептеу',
    'up.sample': 'Фото жоқ па? Үлгіде көрсету',
    'up.count': 'Қосылған фото: {n} / {max}',
    'up.limit': '{max} фотодан артық қосуға болмайды.',
    'up.notimage': 'Тек суреттер жарайды.',
    'up.alt': 'Зақым фотосы {n}',
    'up.remove': '{n}-фотоны жою',
    'scan.s1': 'Шанақ бөлшектерін анықтаймыз',
    'scan.s2': 'Жөндеу түрін анықтаймыз',
    'scan.s3': 'Бөлшектер мен бағаларды іріктейміз',
    'scan.progress': 'Талдау барысы',
    'done.demo': 'Бұл демо: төменде фотоларыңыздың талдауы емес, смета үлгісі көрсетілген.',
    'done.buy': 'Демо-нұсқада тапсырыс беру мүмкін емес. Ол сервис іске қосылғаннан кейін пайда болады.',
    'done.again': 'Басқа фото жүктеу',

    'est.get': 'Сметаны алу',
    'est.save': 'Жеке кабинетке сақтау',
    'share.footer': '{brand}: жөндеуді фото бойынша бағалау',
    'share.saved': 'Смета жеке кабинетке сақталды.',
    'share.fail': 'Сақтау мүмкін болмады. Қайталап көріңіз.',
    'share.login': 'Сметаны сақтау үшін кіріңіз.',
    'share.off': 'Жеке кабинет әлі қосылмаған.',
    'share.frame': 'Алдын ала қарауда басып шығару бұғатталған. Жарияланған сайтта PDF-ке сақтау терезесі ашылады.',

    'acc.in': 'Кіру',
    'acc.up': 'Тіркелу',
    'acc.email': 'Эл. пошта',
    'acc.pass': 'Құпиясөз',
    'acc.pass.hint': 'Кемінде 8 таңба',
    'acc.in.submit': 'Кіру',
    'acc.up.submit': 'Аккаунт құру',
    'acc.forgot': 'Құпиясөзді ұмыттыңыз ба?',
    'acc.consent': 'Аккаунт құру арқылы сіз жеке деректерді өңдеуге келісесіз.',
    'acc.new.t': 'Жаңа құпиясөз',
    'acc.new.submit': 'Құпиясөзді сақтау',
    'acc.empty': 'Сақталған сметалар әзірге жоқ.',
    'acc.out': 'Шығу',
    'acc.del': '{n} сметасын жою',
    'acc.del2': '{n} сметасын жою үшін тағы бір рет басыңыз',
    'acc.msg.off': 'Кіру config.js файлында Supabase қосылғаннан кейін жұмыс істейді.',
    'acc.msg.key': 'config.js файлында құпия кілт көрсетілген. Оны ашық кілтке (publishable / anon) ауыстырыңыз.',
    'acc.msg.email': 'Пошта мекенжайын тексеріңіз.',
    'acc.msg.short': 'Құпиясөз кемінде 8 таңбадан тұруы керек.',
    'acc.msg.bad': 'Пошта немесе құпиясөз қате.',
    'acc.msg.confirm': 'Поштаны растаңыз: сілтеме біз жіберген хатта.',
    'acc.msg.sent': 'Хат жібердік. Тіркелуді аяқтау үшін ондағы сілтемеге өтіңіз.',
    'acc.msg.reset': 'Мұндай аккаунт бар болса, құпиясөзді өзгерту сілтемесі бар хат жібердік.',
    'acc.msg.saved': 'Құпиясөз жаңартылды.',
    'acc.msg.wait': 'Әрекет тым көп. Бір минут күтіп, қайталап көріңіз.',
    'acc.msg.net': 'Сервермен байланыс жоқ. Интернетті тексеріп, қайталап көріңіз.',
    'acc.msg.err': 'Орындалмады. Қайталап көріңіз.',
    'up.privacy.live': 'Фотолар тек талдауға жіберіледі және ешқайда сақталмайды. Смета өзіңіз сақтасаңыз ғана сақталады.',
    'up.login': 'Фотоларыңызды талдау үшін аккаунтқа кіріңіз. Кірмей-ақ үлгіні көруге болады.',
    'up.err.quota': 'Бүгінгі талдау лимиті таусылды (тәулігіне {limit}). Ертең қайталап көріңіз.',
    'up.err.photo': 'Фотоны оқу мүмкін болмады. JPG немесе PNG форматындағы басқа фотоны таңдаңыз.',
    'up.err.service': 'Талдау қызметі қазір қолжетімсіз. Кейінірек қайталаңыз немесе үлгіні қараңыз.',
    'up.err.auth': 'Сессия аяқталды. Аккаунтқа қайта кіріңіз.',
    'done.live': 'Фото бойынша алдын ала бағалау. Бағалар шамамен: нақты соманы шебер көлікті қарағаннан кейін айтады.',
    'res.none': 'Фотода зақым табылмады. Зақымды жақыннан және жарық жерде түсіріп көріңіз.',
    'res.photo': 'Зақымдары белгіленген {n}-фото',
    'res.unknown': 'көрсетілмеген',
    'est.prelim': 'алдын ала',
    'est.note.live': 'Бағалар шамамен және демонстрация үшін берілген.',
    'acc.title': 'Жеке кабинет',
    'acc.guest': 'Қонақ',
    'acc.hint': 'Сметаларды сақтау үшін кіріңіз',
    'acc.demo': 'демо',
    'acc.phone': 'Телефон нөмірі',
    'acc.code': 'Код алу',
    'acc.note': 'Кіру әзірге жұмыс істемейді: жеке кабинет іске қосылғаннан кейін пайда болады.',
    'acc.i1': 'Менің сметаларым',
    'acc.i2': 'Менің гаражым',
    'acc.i3': 'Тапсырыстар',
    'acc.soon': 'жақында',

    'pt.title': 'Серіктестікке өтінім',
    'pt.name': 'Атыңыз',
    'pt.type': 'Бизнес түрі',
    'pt.type1': 'СТО / автосервис',
    'pt.type2': 'Қосалқы бөлшек сатушысы',
    'pt.city': 'Қала',
    'pt.phone': 'Телефон',
    'pt.send': 'Өтінім жіберу',
    'pt.done.t': 'Қызығушылығыңызға рақмет',
    'pt.done.d': 'Бұл демо-форма: өтінім ешқайда жіберілген жоқ. Өтінім қабылдау іске қосылғаннан кейін ашылады.'
  };

  const dict = { ru: Object.assign({}, RU), kk: KK };
  let lang = 'ru';

  // Русские тексты собираем из разметки один раз, до первой смены языка
  $$('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!(key in dict.ru)) dict.ru[key] = el.innerHTML.trim();
  });
  const attrPairs = (el) => el.dataset.i18nAttr.split(';').map((p) => {
    const i = p.indexOf(':');
    return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
  });
  $$('[data-i18n-attr]').forEach((el) => attrPairs(el).forEach(([attr, key]) => {
    if (!(key in dict.ru)) dict.ru[key] = el.getAttribute(attr) || '';
  }));

  function t(key, vars) {
    const table = dict[lang] || dict.ru;
    let s = key in table ? table[key] : dict.ru[key];
    if (s == null) return key;
    return s.replace(/\{(\w+)\}/g, (m, k) => (k === 'brand' ? BRAND : vars && k in vars ? vars[k] : m));
  }

  function fillBrand() {
    $$('[data-brand]').forEach((el) => { el.textContent = BRAND; });
  }

  function applyLang(next, persist) {
    lang = dict[next] ? next : 'ru';
    root.lang = lang;
    $$('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    $$('[data-i18n-attr]').forEach((el) => attrPairs(el).forEach(([attr, key]) => el.setAttribute(attr, t(key))));
    fillBrand();
    doc.title = t('meta.title');
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', t('meta.desc'));
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    renderThumbs();
    renderLive();
    updateShare();
    renderAccount();
    if (persist) { try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* хранилище недоступно */ } }
  }

  /* ---------- Шапка и мобильное меню ---------- */
  const header = $('.header');
  const burger = $('.burger');
  const mnav = $('#mnav');

  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    mnav.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-open', open);
    $('use', burger).setAttribute('href', open ? '#i-x' : '#i-menu');
  }
  burger.addEventListener('click', () => setMenu(mnav.hidden));
  doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mnav.hidden) { setMenu(false); burger.focus(); } });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Плавный переход по якорям ---------- */
  doc.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = id ? doc.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    if (id === 'top') window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    if (link.classList.contains('skip')) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  });

  /* ---------- Переключатель языка ---------- */
  $$('.lang button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang, true)));

  /* ---------- Появление блоков при скролле ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Чертёж: выноски появляются по очереди ---------- */
  const sheet = $('#sheet');
  const startSheet = () => requestAnimationFrame(() => sheet.classList.add('is-on'));
  if (doc.readyState === 'complete') startSheet();
  else { window.addEventListener('load', startSheet, { once: true }); setTimeout(startSheet, 1500); }

  /* ---------- FAQ-аккордеон ---------- */
  $$('.faq__q').forEach((btn) => btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  }));

  /* ---------- Нижняя кнопка на телефоне ---------- */
  const dock = $('#dock');
  const dockState = { hero: true, cta: false };
  const updateDock = () => {
    const on = !dockState.hero && !dockState.cta;
    dock.classList.toggle('is-on', on);
    dock.inert = !on;
  };
  if ('IntersectionObserver' in window) {
    const watch = (el, key) => new IntersectionObserver(([en]) => { dockState[key] = en.isIntersecting; updateDock(); }).observe(el);
    watch($('#hero-cta'), 'hero');
    watch($('#start'), 'cta');
  }

  /* ---------- Диалоги ---------- */
  function openDialog(name) {
    const dlg = $('#dlg-' + name);
    if (!dlg || dlg.open) return;
    setMenu(false);
    if (name === 'upload') resetUpload();
    if (name === 'partner') { $('#pt-form').hidden = false; $('#pt-done').hidden = true; }
    if (name === 'account') { setMsg($('#acc-msg'), null); renderAccount(); if (user) loadEstimates(); }
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function closeDialog(dlg) {
    if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
  }
  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); openDialog(opener.dataset.open); return; }
    const closer = e.target.closest('[data-close]');
    if (closer) { closeDialog(closer.closest('dialog')); return; }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      // В образце на странице кнопка ведёт к загрузке фото, в демо-результате — показывает пояснение
      if (buy.closest('dialog')) { const n = $('#buy-note'); n.hidden = false; n.scrollIntoView({ block: 'nearest' }); }
      else openDialog('upload');
      return;
    }
    const pdf = e.target.closest('[data-pdf]');
    if (pdf) { printEstimate(pdf.closest('.estimate')); return; }
    const save = e.target.closest('[data-save]');
    if (save) saveEstimate(save.closest('.estimate'));
  });
  $$('dialog').forEach((dlg) => {
    // клик по затемнению закрывает окно
    dlg.addEventListener('click', (e) => { if (e.target === dlg) closeDialog(dlg); });
  });

  /* ---------- Демо-загрузка фото ---------- */
  const up = { files: [], timers: [] };
  const upDlg = $('#dlg-upload');
  const upInput = $('#up-file');
  const upDrop = $('#up-drop');
  const upThumbs = $('#up-thumbs');
  const upStatus = $('#up-status');
  const upGo = $('#up-go');
  const upTitle = $('#up-title');

  function setStep(step) {
    $$('[data-step]', upDlg).forEach((el) => { el.hidden = el.dataset.step !== step; });
    $$('[data-foot]', upDlg).forEach((el) => { el.hidden = el.dataset.foot !== step; });
    upTitle.dataset.i18n = 'up.title.' + step;
    upTitle.textContent = t('up.title.' + step);
    $('.dlg__body', upDlg).scrollTop = 0;
  }

  function renderThumbs() {
    if (!upThumbs) return;
    upThumbs.textContent = '';
    up.files.forEach((item, i) => {
      const li = doc.createElement('li');
      const img = doc.createElement('img');
      img.src = item.url;
      img.alt = t('up.alt', { n: i + 1 });
      img.addEventListener('error', () => {
        // браузер не умеет показывать этот формат (например, HEIC) — ставим заглушку
        const ph = doc.createElement('span');
        ph.className = 'thumbs__ph';
        ph.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-image"/></svg>';
        img.replaceWith(ph);
        item.broken = true;
      });
      const rm = doc.createElement('button');
      rm.type = 'button';
      rm.setAttribute('aria-label', t('up.remove', { n: i + 1 }));
      rm.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-x"/></svg>';
      rm.addEventListener('click', () => {
        URL.revokeObjectURL(item.url);
        up.files.splice(i, 1);
        renderThumbs();
        (upThumbs.querySelector('button') || upInput).focus();
      });
      li.append(img, rm);
      upThumbs.append(li);
    });
    upGo.disabled = up.files.length === 0;
    upStatus.textContent = up.files.length ? t('up.count', { n: up.files.length, max: MAX_PHOTOS }) : '';
  }

  function addFiles(list) {
    const images = Array.from(list).filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name));
    const room = MAX_PHOTOS - up.files.length;
    images.slice(0, room).forEach((file) => up.files.push({ url: URL.createObjectURL(file), file }));
    renderThumbs();
    if (images.length < list.length) upStatus.textContent = t('up.notimage');
    else if (images.length > room) upStatus.textContent = t('up.limit', { max: MAX_PHOTOS });
  }

  upInput.addEventListener('change', () => { addFiles(upInput.files); upInput.value = ''; });
  ['dragenter', 'dragover'].forEach((ev) => upDrop.addEventListener(ev, (e) => { e.preventDefault(); upDrop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((ev) => upDrop.addEventListener(ev, (e) => { e.preventDefault(); upDrop.classList.remove('is-over'); }));
  upDrop.addEventListener('drop', (e) => { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });

  function clearTimers() { up.timers.forEach(clearTimeout); up.timers = []; }

  function resetUpload() {
    clearTimers();
    up.files.forEach((f) => URL.revokeObjectURL(f.url));
    up.files = [];
    renderThumbs();
    $('#buy-note').hidden = true;
    live.result = null;
    setStep('pick');
  }

  function startScan(analysis) {
    const first = up.files.find((f) => !f.broken);
    const img = $('#scan-img');
    const ph = $('#scan-ph');
    if (first) { img.src = first.url; img.hidden = false; ph.hidden = true; }
    else { img.removeAttribute('src'); img.hidden = true; ph.hidden = false; }

    const steps = $$('#scan-steps li');
    const bar = $('#scan-progress');
    const fill = $('span', bar);
    const setProgress = (v) => { fill.style.width = v + '%'; bar.setAttribute('aria-valuenow', String(v)); };
    steps.forEach((li) => li.classList.remove('is-active', 'is-done'));
    setProgress(0);
    setStep('scan');
    upTitle.focus();

    const stepMs = reduceMotion ? 500 : 1200;
    steps.forEach((li, i) => {
      up.timers.push(setTimeout(() => {
        if (i > 0) { steps[i - 1].classList.remove('is-active'); steps[i - 1].classList.add('is-done'); }
        li.classList.add('is-active');
        setProgress(Math.round(((i + 0.6) / steps.length) * 100));
      }, i * stepMs + 50));
    });
    up.timers.push(setTimeout(() => {
      const last = steps[steps.length - 1];
      last.classList.remove('is-active');
      last.classList.add('is-done');
      setProgress(100);
    }, steps.length * stepMs));
    if (!analysis) { up.timers.push(setTimeout(showResult, steps.length * stepMs + 500)); return; }
    // Настоящий анализ: экран «Анализируем…» держится, пока не придёт ответ
    const minTime = new Promise((r) => up.timers.push(setTimeout(r, steps.length * stepMs + 500)));
    const run = ++live.run;
    Promise.all([analysis, minTime]).then(([res]) => {
      if (run !== live.run || !upDlg.open) return;          // окно закрыли или начали заново
      if (res.error) { setStep('pick'); renderThumbs(); upStatus.textContent = t('up.err.' + res.error, { limit: res.limit || '' }); return; }
      live.result = res;
      showResult();
    });
  }

  // Копия сметы-образца со страницы: из неё собирается и пример, и настоящий результат
  function cloneEstimate() {
    const copy = $('#estimate').cloneNode(true);
    copy.removeAttribute('id');
    copy.removeAttribute('data-reveal');
    copy.removeAttribute('aria-labelledby');
    copy.classList.remove('is-in');
    $$('[id]', copy).forEach((n) => n.removeAttribute('id'));
    return copy;
  }

  function showResult() {
    const slot = $('#up-estimate');
    $('#res-photos').textContent = '';
    if (live.result) renderLive();
    else { slot.textContent = ''; slot.append(cloneEstimate()); setMsg($('#done-note'), 'done.demo'); }
    updateShare();
    setStep('done');
    upTitle.focus();
  }

  /* ==================================================================
     Настоящий анализ фото: сжатие → серверная функция analyze → смета
     ================================================================== */
  const live = { result: null, run: 0 };
  const MAX_SIDE = 1280;

  // Ориентировочные цены, ₸, только для демонстрации. Замените на реальные (или задайте prices в config.js).
  const PRICES = Object.assign({
    front_bumper: { repair: 45000, replace: 85000 }, rear_bumper: { repair: 45000, replace: 80000 },
    hood: { repair: 40000, replace: 120000 }, trunk_lid: { repair: 40000, replace: 110000 }, roof: { repair: 60000 },
    front_left_fender: { repair: 35000, replace: 70000 }, front_right_fender: { repair: 35000, replace: 70000 },
    rear_left_quarter_panel: { repair: 50000 }, rear_right_quarter_panel: { repair: 50000 },
    front_left_door: { repair: 45000, replace: 150000 }, front_right_door: { repair: 45000, replace: 150000 },
    rear_left_door: { repair: 45000, replace: 140000 }, rear_right_door: { repair: 45000, replace: 140000 },
    left_headlight: { replace: 62000 }, right_headlight: { replace: 62000 },
    left_taillight: { replace: 35000 }, right_taillight: { replace: 35000 },
    windshield: { replace: 90000 }, rear_window: { replace: 60000 }
  }, CFG.prices || {});
  // Детектор говорит только «деталь повреждена». Пока нет второй ступени, действие берём типовое для детали.
  const REPLACE_BY_DEFAULT = /headlight|taillight|windshield|window/;

  const SD = window.SkanDamage;

  function compress(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * k));
        const h = Math.max(1, Math.round(img.naturalHeight * k));
        const c = doc.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        const dataUrl = c.toDataURL('image/jpeg', 0.85);
        resolve({ dataUrl, b64: dataUrl.split(',')[1], width: w, height: h });
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }

  async function callAnalyze(b64) {
    const { data, error } = await sb.functions.invoke('analyze', { body: { image: b64 } });
    if (!error) return { data };
    const res = error.context;
    const status = res && typeof res.status === 'number' ? res.status : 0;
    let info = {};
    try { info = await res.json(); } catch (e) { /* не JSON */ }
    if (status === 401) return { error: 'auth' };
    if (status === 429) return { error: 'quota', limit: info.limit };
    if (status === 400) return { error: 'photo' };
    return { error: 'service' };
  }

  async function analyzeFiles(items) {
    const photos = [];
    let lastError = 'photo';
    for (const item of items) {
      const img = await compress(item.file);
      if (!img) continue;
      const r = await callAnalyze(img.b64);
      if (r.error) {
        if (r.error === 'auth' || r.error === 'quota' || r.error === 'service') return r;
        lastError = r.error;
        continue;
      }
      const d = r.data || {};
      const preds = Array.isArray(d.predictions) ? d.predictions : [];
      const size = d.image && d.image.width ? d.image : { width: img.width, height: img.height };
      photos.push({ src: img.dataUrl, size, preds });
    }
    if (!photos.length) return { error: lastError };
    const now = new Date();
    const number = 'SK-' + now.toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 9000) + 1000);
    return { photos, number, date: now.toLocaleDateString('ru-RU') };
  }

  // Одна строка сметы на каждую повреждённую деталь (берём самую уверенную находку)
  function liveRows(result) {
    const best = {};
    result.photos.forEach((p) => p.preds.forEach((d) => {
      const code = SD.partCode(d.class);
      if (!best[code] || d.confidence > best[code].confidence) best[code] = { code, confidence: d.confidence };
    }));
    return Object.values(best).sort((a, b) => b.confidence - a.confidence).map((r) => {
      const price = PRICES[r.code] || {};
      let action = REPLACE_BY_DEFAULT.test(r.code) ? 'replace' : 'repair_and_paint';
      if (r.code === 'wheel' || r.confidence < SD.LOW_CONFIDENCE) action = 'inspect';
      const sum = action === 'replace' ? price.replace : action === 'repair_and_paint' ? price.repair : 0;
      return { code: r.code, action, price: sum || 0 };
    });
  }

  function renderLive() {
    const result = live.result;
    if (!result || !SD) return;
    // фото с рамками
    const gal = $('#res-photos');
    gal.textContent = '';
    result.photos.forEach((p, i) => {
      const fig = doc.createElement('figure');
      fig.className = 'res-photo';
      const img = doc.createElement('img');
      img.src = p.src;
      img.alt = t('res.photo', { n: i + 1 });
      fig.append(img);
      p.preds.forEach((d) => {
        const box = doc.createElement('span');
        box.className = 'res-box' + (d.confidence < SD.LOW_CONFIDENCE ? ' res-box--low' : '');
        const pct = (v, total) => Math.max(0, Math.min(100, (v / total) * 100)) + '%';
        box.style.left = pct(d.x - d.width / 2, p.size.width);
        box.style.top = pct(d.y - d.height / 2, p.size.height);
        box.style.width = pct(d.width, p.size.width);
        box.style.height = pct(d.height, p.size.height);
        const label = doc.createElement('span');
        label.textContent = SD.damage({ part: d.class }, lang).part + ' · ' + Math.round(d.confidence * 100) + '%';
        box.append(label);
        fig.append(box);
      });
      gal.append(fig);
    });
    // смета
    const rows = liveRows(result);
    const est = cloneEstimate();
    $('.estimate__no', est).textContent = '№ ' + result.number;
    const tag = $('.estimate__head .tag', est);
    tag.dataset.i18n = 'est.prelim';
    tag.textContent = t('est.prelim');
    const meta = $$('.estimate__meta dd', est);
    meta[0].textContent = t('res.unknown');
    meta[1].removeAttribute('data-i18n');
    meta[1].textContent = t('res.unknown');
    meta[2].textContent = result.date;
    const tbody = $('tbody', est);
    tbody.textContent = '';
    rows.forEach((r) => {
      const tr = doc.createElement('tr');
      const th = doc.createElement('th');
      th.scope = 'row';
      th.textContent = SD.damage({ part: r.code }, lang).part;
      const tdAct = doc.createElement('td');
      const act = doc.createElement('span');
      act.className = 'act ' + (r.action === 'replace' ? 'act--replace' : r.action === 'repair_and_paint' ? 'act--repair' : 'act--paint');
      act.textContent = SD.damage({ suggested_action: r.action }, lang).action;
      tdAct.append(act);
      const tdPrice = doc.createElement('td');
      tdPrice.className = 'num';
      tdPrice.textContent = r.price ? money(r.price) : '—';
      tr.append(th, tdAct, tdPrice);
      tbody.append(tr);
    });
    const parts = rows.filter((r) => r.action === 'replace').reduce((a, r) => a + r.price, 0);
    const works = rows.filter((r) => r.action !== 'replace').reduce((a, r) => a + r.price, 0);
    const sums = $$('.estimate__sum dd', est);
    sums[0].textContent = money(parts);
    sums[1].textContent = money(works);
    sums[2].textContent = money(parts + works);
    const note = $('.estimate__note', est);
    note.dataset.i18n = 'est.note.live';
    note.textContent = t('est.note.live');
    const slot = $('#up-estimate');
    slot.textContent = '';
    if (rows.length) slot.append(est);
    setMsg($('#done-note'), rows.length ? 'done.live' : 'res.none');
    updateShare();
  }

  upGo.addEventListener('click', () => {
    if (!sbReady) { startScan(); return; }                       // Supabase не подключён — показываем пример
    if (!sb || !user) { upStatus.textContent = t('up.login'); openDialog('account'); return; }
    const items = up.files.filter((f) => f.file);
    live.result = null;
    startScan(analyzeFiles(items).catch(() => ({ error: 'service' })));
  });
  $('#up-sample').addEventListener('click', () => {
    up.files.forEach((f) => URL.revokeObjectURL(f.url));
    up.files = [];
    live.result = null;
    startScan();
  });
  $('#up-again').addEventListener('click', () => { resetUpload(); upTitle.focus(); });
  upDlg.addEventListener('close', () => { clearTimers(); live.run++; up.files.forEach((f) => URL.revokeObjectURL(f.url)); up.files = []; });

  /* ---------- Демо-формы: аккаунт и партнёры ---------- */
  $('#pt-form').addEventListener('submit', (e) => {
    e.preventDefault();               // бэкенда нет: данные никуда не уходят
    e.currentTarget.reset();
    e.currentTarget.hidden = true;
    const done = $('#pt-done');
    done.hidden = false;
    $('button', done).focus();
  });

  /* ---------- Дата в смете-образце ---------- */
  const today = new Date().toLocaleDateString('ru-RU');
  $$('[data-today]').forEach((el) => { el.textContent = today; });

  /* ==================================================================
     Получение сметы: WhatsApp, Telegram, PDF
     ================================================================== */
  // Адрес сайта берём из адресной строки: так он всегда совпадает с тем, где сайт реально открыт.
  // siteUrl из config.js нужен только когда страница открыта как файл с диска.
  const siteUrl = (() => {
    if (location.protocol === 'https:') return location.origin + location.pathname;
    if (/^https:\/\//.test(CFG.siteUrl || '')) return CFG.siteUrl;
    return location.protocol === 'http:' ? location.origin + location.pathname : '';
  })();
  const inFrame = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  const digits = (str) => parseInt(String(str).replace(/\D/g, ''), 10) || 0;
  const money = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
  const clean = (node) => (node ? node.textContent.replace(/\s+/g, ' ').trim() : '');

  // Данные сметы читаются из её разметки: одна и та же функция работает для образца и для результата
  function readEstimate(el) {
    const meta = $$('.estimate__meta dd', el).map(clean);
    const sums = $$('.estimate__sum dd', el).map((n) => digits(n.textContent));
    return {
      number: clean($('.estimate__no', el)).replace(/^№\s*/, ''),
      sample: !!$('.estimate__head .tag[data-i18n="est.sample"]', el),
      car: meta[0] || '', city: meta[1] || '', date: meta[2] || '',
      items: $$('tbody tr', el).map((tr) => ({ name: clean(tr.children[0]), action: clean(tr.children[1]), price: digits(tr.children[2].textContent) })),
      parts: sums[0] || 0, works: sums[1] || 0, total: sums[2] || 0
    };
  }

  function shareText(d) {
    const head = t('est.kicker') + ' № ' + d.number + (d.sample ? ' (' + t('est.sample') + ')' : '');
    const unknown = t('res.unknown');
    const lines = [head, [d.car, d.city, d.date].filter((v) => v && v !== unknown).join(' · '), ''];
    d.items.forEach((it, i) => lines.push((i + 1) + '. ' + it.name + ' — ' + it.action + (it.price ? ' — ' + money(it.price) : '')));
    lines.push('', t('est.parts') + ': ' + money(d.parts), t('est.works') + ': ' + money(d.works), t('est.total') + ': ' + money(d.total), '', t('share.footer'));
    return { head, body: lines.join('\n') };
  }

  function updateShare() {
    $$('.estimate').forEach((el) => {
      const wa = $('[data-share="wa"]', el);
      const tg = $('[data-share="tg"]', el);
      if (!wa || !tg) return;
      const txt = shareText(readEstimate(el));
      wa.href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(txt.body + (siteUrl ? '\n' + siteUrl : ''));
      tg.href = 'https://t.me/share/url?url=' + encodeURIComponent(siteUrl || txt.head) + '&text=' + encodeURIComponent(txt.body);
    });
  }

  function setMsg(node, key) {
    if (!node) return;
    const span = $('span', node) || node;
    if (!key) { node.hidden = true; delete span.dataset.i18n; span.textContent = ''; return; }
    span.dataset.i18n = key;        // при смене языка сообщение переведётся вместе со страницей
    span.textContent = t(key);
    node.hidden = false;
  }

  function printEstimate(el) {
    const sheet = $('#print-sheet');
    const copy = el.cloneNode(true);
    ['id', 'data-reveal', 'aria-labelledby'].forEach((a) => copy.removeAttribute(a));
    $$('[id]', copy).forEach((n) => n.removeAttribute('id'));
    $$('.btn, .estimate__get', copy).forEach((n) => n.remove());
    const head = doc.createElement('div');
    head.className = 'print-head';
    const name = doc.createElement('strong');
    name.textContent = BRAND;
    const site = doc.createElement('span');
    site.textContent = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    head.append(name, site);
    sheet.textContent = '';
    sheet.append(head, copy);
    setMsg($('.share__status', el), inFrame ? 'share.frame' : null);
    try { window.print(); } catch (e) { /* печать недоступна в этом окружении */ }
  }

  /* ==================================================================
     Личный кабинет на Supabase
     Безопасность:
     — в браузере только публичный ключ; секретный ключ отвергается;
     — доступ к данным ограничивает RLS в базе (supabase/schema.sql), а не этот код;
     — всё, что пришло из базы, вставляется через textContent, не через innerHTML;
     — ответы на вход и восстановление не раскрывают, есть ли такой аккаунт.
     ================================================================== */
  const SB_URL = String(CFG.supabaseUrl || '').trim().replace(/\/+$/, '');
  const SB_KEY = String(CFG.supabaseKey || '').trim();
  const keyIsSecret = (() => {
    if (/^sb_secret_/.test(SB_KEY)) return true;
    try {
      const payload = JSON.parse(atob(SB_KEY.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.role === 'service_role';
    } catch (e) { return false; }
  })();
  const sbReady = /^https:\/\/[a-z0-9.-]+$/i.test(SB_URL) && SB_KEY.length > 20 && !keyIsSecret;
  if (sbReady) { const pn = $('[data-i18n="up.privacy"]'); if (pn) { pn.dataset.i18n = 'up.privacy.live'; pn.textContent = t('up.privacy.live'); } }
  if (keyIsSecret) console.error('config.js: указан секретный ключ Supabase. Его нельзя публиковать: замените на publishable/anon и перевыпустите секретный.');

  let sb = null;
  let user = null;
  const acc = { mode: 'in', busy: false };
  const accMsg = (key) => setMsg($('#acc-msg'), key);
  const accBtn = $('.header .acc');

  function renderAccount() {
    const guest = $('#acc-guest');
    if (!guest) return;
    const recovery = acc.mode === 'recovery';
    guest.hidden = !!user || recovery;
    $('#acc-recovery').hidden = !recovery;
    $('#acc-user').hidden = !user || recovery;
    if (accBtn) accBtn.classList.toggle('is-auth', !!user);
    const signUp = acc.mode === 'up';
    $$('[data-acc-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.accMode === (signUp ? 'up' : 'in'))));
    const submit = $('#acc-submit');
    submit.dataset.i18n = signUp ? 'acc.up.submit' : 'acc.in.submit';
    submit.textContent = t(submit.dataset.i18n);
    $('#acc-pass').setAttribute('autocomplete', signUp ? 'new-password' : 'current-password');
    $('#acc-pass-hint').hidden = !signUp;
    $('#acc-consent').hidden = !signUp;
    $('#acc-forgot').hidden = signUp;
    $('#acc-user-email').textContent = user ? user.email || '' : '';
  }

  function setBusy(on) {
    acc.busy = on;
    $$('#dlg-account button[type="submit"], #acc-forgot, #acc-out').forEach((b) => { b.disabled = on; });
  }

  // Ошибки показываем общими словами: без подсказок, существует ли аккаунт
  function authErrorKey(error, fallback) {
    if (!error) return null;
    if (error.status === 429 || /rate limit/i.test(error.message || '')) return 'acc.msg.wait';
    if (!error.status) return 'acc.msg.net';
    if (error.code === 'weak_password') return 'acc.msg.short';
    if (error.code === 'email_not_confirmed') return 'acc.msg.confirm';
    return fallback;
  }

  const validEmail = (v) => v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  async function withAuth(fn) {
    if (acc.busy) return;
    if (!sb) { accMsg(keyIsSecret ? 'acc.msg.key' : 'acc.msg.off'); return; }
    setBusy(true);
    accMsg(null);
    try { await fn(); } catch (e) { accMsg('acc.msg.net'); } finally { setBusy(false); }
  }

  $$('[data-acc-mode]').forEach((b) => b.addEventListener('click', () => { acc.mode = b.dataset.accMode; accMsg(null); renderAccount(); }));

  $('#acc-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#acc-email').value.trim();
    const pass = $('#acc-pass').value;
    const signUp = acc.mode === 'up';
    if (!validEmail(email)) { accMsg('acc.msg.email'); return; }
    if (signUp ? pass.length < 8 : !pass) { accMsg(signUp ? 'acc.msg.short' : 'acc.msg.bad'); return; }
    withAuth(async () => {
      if (signUp) {
        const { data, error } = await sb.auth.signUp({ email, password: pass, options: { emailRedirectTo: siteUrl || undefined } });
        if (error) accMsg(authErrorKey(error, 'acc.msg.err'));
        else if (!data.session) accMsg('acc.msg.sent');   // то же сообщение и для уже занятой почты
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password: pass });
        if (error) accMsg(authErrorKey(error, 'acc.msg.bad'));
      }
      $('#acc-pass').value = '';
    });
  });

  $('#acc-forgot').addEventListener('click', () => {
    const email = $('#acc-email').value.trim();
    if (!validEmail(email)) { accMsg('acc.msg.email'); $('#acc-email').focus(); return; }
    withAuth(async () => {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: siteUrl || undefined });
      accMsg(authErrorKey(error, 'acc.msg.reset') || 'acc.msg.reset');
    });
  });

  $('#acc-recovery').addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = $('#acc-newpass').value;
    if (pass.length < 8) { accMsg('acc.msg.short'); return; }
    withAuth(async () => {
      const { error } = await sb.auth.updateUser({ password: pass });
      $('#acc-newpass').value = '';
      if (error) { accMsg(authErrorKey(error, 'acc.msg.err')); return; }
      acc.mode = 'in';
      renderAccount();
      accMsg('acc.msg.saved');
    });
  });

  $('#acc-out').addEventListener('click', () => withAuth(async () => { await sb.auth.signOut(); }));

  /* ---------- Сохранённые сметы ---------- */
  async function loadEstimates() {
    if (!sb || !user) return;
    const { data, error } = await sb.from('estimates').select('id,number,car,city,total,created_at').order('created_at', { ascending: false }).limit(20);
    if (error) return;
    const list = $('#acc-estimates');
    list.textContent = '';
    (data || []).forEach((row) => {
      const li = doc.createElement('li');
      const title = doc.createElement('span');
      title.className = 'acc-est__t';
      title.textContent = '№ ' + row.number;
      const sub = doc.createElement('span');
      sub.className = 'acc-est__d';
      sub.textContent = [row.car, row.city, new Date(row.created_at).toLocaleDateString('ru-RU')].filter(Boolean).join(' · ');
      const sum = doc.createElement('span');
      sum.className = 'acc-est__sum';
      sum.textContent = money(Number(row.total) || 0);
      const del = doc.createElement('button');
      del.type = 'button';
      del.className = 'iconbtn acc-est__del';
      del.setAttribute('aria-label', t('acc.del', { n: row.number }));
      del.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-trash"/></svg>';
      del.addEventListener('click', async () => {
        if (!del.hasAttribute('data-armed')) {          // первое нажатие — подтверждение
          del.setAttribute('data-armed', '');
          del.setAttribute('aria-label', t('acc.del2', { n: row.number }));
          setTimeout(() => { del.removeAttribute('data-armed'); del.setAttribute('aria-label', t('acc.del', { n: row.number })); }, 4000);
          return;
        }
        del.disabled = true;
        const res = await sb.from('estimates').delete().eq('id', row.id);
        if (res.error) { del.disabled = false; accMsg('acc.msg.err'); } else loadEstimates();
      });
      li.append(title, sub, sum, del);
      list.append(li);
    });
    $('#acc-empty').hidden = (data || []).length > 0;
  }

  async function saveEstimate(el) {
    const status = $('.share__status', el);
    if (!sbReady || !sb) { setMsg(status, 'share.off'); return; }
    if (!user) { setMsg(status, 'share.login'); openDialog('account'); return; }
    const d = readEstimate(el);
    const btn = $('[data-save]', el);
    btn.disabled = true;
    try {
      // user_id база подставляет сама (auth.uid()), а RLS не даст записать смету от чужого имени
      const { error } = await sb.from('estimates').insert({ number: d.number, car: d.car, city: d.city, items: d.items, parts_total: d.parts, works_total: d.works, total: d.total });
      setMsg(status, error ? 'share.fail' : 'share.saved');
    } catch (e) { setMsg(status, 'share.fail'); } finally { btn.disabled = false; }
  }

  /* ---------- Подключение Supabase (библиотека лежит рядом с сайтом, без сторонних CDN) ---------- */
  if (sbReady) {
    const lib = doc.createElement('script');
    lib.src = 'vendor/supabase-2.118.0.js';
    lib.async = true;
    lib.onload = () => {
      if (!window.supabase || typeof window.supabase.createClient !== 'function') return;
      sb = window.supabase.createClient(SB_URL, SB_KEY);
      sb.auth.onAuthStateChange((event, session) => {
        user = session ? session.user : null;
        if (event === 'PASSWORD_RECOVERY') { acc.mode = 'recovery'; openDialog('account'); }
        if (event === 'SIGNED_OUT' && acc.mode === 'recovery') acc.mode = 'in';
        renderAccount();
        // запросы к базе из этого колбэка делать нельзя, поэтому откладываем
        if (user) setTimeout(loadEstimates, 0);
      });
    };
    doc.head.append(lib);
  }

  /* ---------- Старт ---------- */
  let saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* хранилище недоступно */ }
  const preferred = saved || ((navigator.language || '').toLowerCase().startsWith('kk') ? 'kk' : 'ru');
  applyLang(preferred, false);

  window.__skanReady = true;
})();
