(function(root){
 'use strict';
 // Work periods are shown only where confirmed by the owner.
 // Disputed performance figures remain omitted pending verification.
 const projects=[
  {
    "id": "barn-estate",
    "name": "BARN ESTATE",
    "featured": true,
    "role": "Руководитель digital",
    "period": "2026",
    "location": "Москва · Россия",
    "sector": "Премиальная недвижимость",
    "tags": "СТРАТЕГИЯ / РЕКЛАМА / ТЕХНОЛОГИИ",
    "image": "../assets/companies/barnes-home.jpg",
    "url": "https://barn-estate.ru/",
    "headline": "Новый бренд. Цельный подход.",
    "summary": "BARN Estate, ранее BARNES Russia. Продвижение объектов, сайты и работа с обращениями в одной системе.",
    "intro": "В BARN Estate, бывшей BARNES Russia, отвечаю за digital-направление московской команды. Соединяю рекламу объектов, сайты и обработку обращений в общий процесс.",
    "challenge": "Запускать рекламу и переносить сайты так, чтобы клиенту было по-прежнему легко найти объект и обратиться в агентство.",
    "approach": "Веду работу от объекта до обращения: планирую рекламу, координирую лендинги и связываю их с аналитикой и CRM. Вместе с продажами разбираю, какие клиенты приходят и что происходит дальше.",
    "contribution": [
      "Стратегия digital-маркетинга и рекламные кампании",
      "Лендинги объектов, UX-аудиты и общие компоненты интерфейса",
      "Отслеживание заявок и подключение CRM",
      "Перенос сайтов и организация работы с инфраструктурой",
      "Проверка трафика и защита от спам-заявок"
    ],
    "delivered": [
      "Страницы объектов и материалы для рекламных кампаний",
      "Путь от рекламы объекта до заявки",
      "Отчёты и порядок проверки эффективности"
    ],
    "collaboration": "Работал с руководством, отделом продаж и специалистами по рекламе и сайтам.",
    "logo": "../assets/companies/barn-estate-logo.svg",
    "homepageScreen": "../assets/companies/barn-estate-spread.png",
    "companyBrief": "Бывшая BARNES Russia. Премиальная недвижимость Москвы.",
    "disciplines": [
      "strategy",
      "ppc",
      "websites",
      "analytics",
      "crm"
    ],
    "workNote": "Стратегия, лендинги объектов, реклама, аналитика и интеграции с CRM."
  },
  {
    "id": "barnes",
    "name": "BARNES INTERNATIONAL",
    "featured": true,
    "role": "Руководитель digital · Москва",
    "period": "2025–2026",
    "location": "Москва · Россия",
    "sector": "Премиальная недвижимость",
    "tags": "СТРАТЕГИЯ / РЕКЛАМА / ТЕХНОЛОГИИ",
    "image": "../assets/companies/barnes-international-home.jpg",
    "url": "https://www.barnes-international.com/",
    "headline": "Мировое имя. Свой подход к рынку.",
    "summary": "Как связать характер международного бренда с выбором покупателя на московском рынке.",
    "intro": "Руководил digital-маркетингом московской команды BARNES International Realty. Работал над тем, как человек знакомится с объектом, выбирает и обращается в агентство.",
    "challenge": "Сохранить характер международного бренда и говорить с покупателем о том, что важно ему на московском рынке.",
    "approach": "Выстраивал рекламу вокруг предложений объектов. Согласовывал лендинги с кампаниями, проверял данные и учитывал обратную связь продаж о качестве обращений.",
    "contribution": [
      "Digital-стратегия для московской команды",
      "Координация рекламы и лендингов объектов",
      "Рекламные кампании и проверка качества заявок",
      "Аналитика и взаимодействие с отделом продаж"
    ],
    "delivered": [
      "Путь клиента от рекламы объекта до обращения",
      "Общий порядок работы с кампаниями и лендингами",
      "Понятная отчётность по заявкам и эффективности каналов"
    ],
    "collaboration": "Работал с московским подразделением и его специалистами. Международный сайт показан, чтобы представить бренд.",
    "logo": "../assets/companies/barnes-international-logo.svg",
    "homepageScreen": "../assets/companies/barnes-international-spread.png",
    "companyBrief": "Международная сеть премиальной недвижимости. Московская команда.",
    "awards": [
      {
        "title": "Luxury Lifestyle Awards",
        "year": "2020",
        "detail": "Лучшее агентство элитной недвижимости Португалии.",
        "source": "https://barnes-portugal.com/en/2020/09/17/barnes-international-realty-portugal-luxury-real/",
        "status": "Победитель",
        "recipient": "BARNES International Realty Portugal",
        "basis": "Office publication"
      },
      {
        "title": "Best Multi Family Office",
        "year": "2024",
        "detail": "Категория Multi family office для команд из 5–15 человек.",
        "source": "https://www.barnes-international.com/fr/a-propos-de-barnes/actualites/2024/trophee-du-meilleur-family-office-2024-2996.html",
        "status": "Победитель",
        "recipient": "Côme Le Family Office, partner in BARNES Family Office by Côme",
        "basis": "BARNES International publication"
      },
      {
        "title": "Luxury Lifestyle Awards — TOP 100 Real Estate Brokers",
        "year": "2025",
        "detail": "Включение в мировой TOP 100 брокеров недвижимости.",
        "source": "https://luxurylifestyleawards.com/news/top-100-real-estate-brokers-2025",
        "status": "Личная награда",
        "recipient": "Charles Howard Morgen, BARNES – Private Office, Switzerland",
        "basis": "Источник организатора"
      },
      {
        "title": "Luxury Lifestyle Awards — TOP 100 Real Estate Brokers",
        "year": "2025",
        "detail": "Включение в мировой TOP 100 брокеров недвижимости.",
        "source": "https://luxurylifestyleawards.com/news/top-100-real-estate-brokers-2025",
        "status": "Личная награда",
        "recipient": "Rachel Bennett, BARNES Miami, USA",
        "basis": "Источник организатора"
      }
    ],
    "awardsIntro": "Награды международной сети BARNES. Для каждой указан конкретный офис, партнёр или получатель.",
    "tabletRecognition": [
      {
        "index": 0,
        "label": "Luxury Lifestyle Awards",
        "scope": "BARNES Portugal"
      },
      {
        "index": 2,
        "label": "TOP 100 Real Estate Brokers",
        "scope": "Charles H. Morgen · Switzerland"
      }
    ],
    "disciplines": [
      "strategy",
      "ppc",
      "websites",
      "analytics"
    ],
    "workNote": "Реклама и лендинги объектов, аналитика и качество заявок московской команды."
  },
  {
    "id": "cycle",
    "name": "CYCLE",
    "featured": false,
    "role": "Руководитель агентства",
    "period": "2026",
    "location": "Европа · Весь мир",
    "sector": "Стратегия, креатив и digital",
    "tags": "СТРАТЕГИЯ / КРЕАТИВ / РЕАЛИЗАЦИЯ",
    "image": "../assets/case-cycle.svg",
    "imageAlt": "CYCLE — руководство агентством и работа команды",
    "url": "",
    "headline": "Сильные стороны складываются.",
    "summary": "Моё агентство CYCLE. Собираю команду, в которой сильные стороны специалистов работают на общий замысел.",
    "intro": "CYCLE — моё агентство. Собираю команду под задачу и веду проект лично. Связываю стратегию с дизайном, разработкой и маркетингом, оставаясь ответственным за ключевые решения.",
    "challenge": "Довести общий замысел до запуска, когда над проектом работают специалисты разных направлений.",
    "approach": "Сначала разбираюсь в задаче, затем подбираю людей. У команды есть общий бриф, приоритеты и критерии качества, у клиента — один человек, который отвечает за ход проекта.",
    "contribution": [
      "Руководство проектами и креативной работой",
      "Подбор команды и координация специалистов",
      "Связь стратегии, дизайна, технологий и маркетинга",
      "Проверка качества и контроль хода работы"
    ],
    "delivered": [
      "Общий план работы команды",
      "Согласованный состав работ разных специалистов",
      "Один ответственный за связь с клиентом"
    ],
    "collaboration": "Руковожу агентской командой и привлекаю подрядчиков под задачи проекта.",
    "logo": "../assets/companies/cycle-logo.svg",
    "homepageScreen": "../assets/case-cycle.svg",
    "homepageAlt": "CYCLE — стратегия, креативное руководство и работа команды",
    "companyBrief": "Моё агентство. Собираю команду под замысел и веду её к запуску.",
    "disciplines": [
      "strategy",
      "websites",
      "creative",
      "leadership"
    ],
    "workNote": "Руководство проектами, подбор команды и организация работы от идеи до запуска."
  },
  {
    "id": "mk-elit",
    "name": "MK ELIT",
    "featured": true,
    "role": "Руководитель digital-маркетинга",
    "period": "2022–2023",
    "location": "Санкт-Петербург · Россия",
    "sector": "Элитная недвижимость",
    "tags": "ВОРОНКИ / CRM / ПАРТНЁРСТВА",
    "image": "../assets/companies/mk-elit-home.jpg",
    "url": "https://www.mkelite.ru/",
    "headline": "Первое обращение. Продолжение истории.",
    "summary": "Запуск объектов и работа с теми, кто уже знаком с агентством. Реклама, CRM и продажи в одной воронке.",
    "intro": "В MK ELIT работал с двумя задачами: привлекать покупателей на новые объекты и продолжать общение с существующей базой. Соединял рекламные кампании, контент и CRM-коммуникации.",
    "challenge": "Поддерживать интерес к покупке на всём длинном пути: от знакомства с объектом до разговора с агентом и повторного обращения.",
    "approach": "Готовил лендинги и рекламные воронки под запуск объектов. Делил базу на сегменты и выстраивал общение в письмах и мессенджерах с учётом интереса клиента.",
    "contribution": [
      "Маркетинговая стратегия и планирование кампаний",
      "Яндекс Директ и Telegram Ads",
      "Лендинги запуска новых объектов",
      "Сценарии общения с клиентами в email, WhatsApp и Telegram",
      "Координация маркетинга с продажами и аналитика",
      "ИИ-анализ звонков и отчёты об обработке заявок",
      "Партнёрские материалы и проекты клиентского клуба"
    ],
    "delivered": [
      "Воронки запуска объектов: от рекламы до дальнейшего общения",
      "Сценарии возвращения клиентов из существующей базы",
      "Упорядоченная работа с контентом и отчётами",
      "Более быстрый разбор звонков руководителем отдела продаж"
    ],
    "results": [
      {
        "value": "−37%",
        "label": "Стоимость лида",
        "detail": "Количество лидов выросло в 1,5 раза при том же рекламном бюджете."
      },
      {
        "value": "+25%",
        "label": "Доля повторных обращений",
        "detail": "После запуска CRM-цепочек в email и мессенджерах."
      },
      {
        "value": "15%",
        "label": "Возврат потерянных лидов",
        "detail": "Лиды вернулись в работу через повторную коммуникацию в CRM."
      }
    ],
    "collaboration": "Работал с SMM, дизайном, видеопроизводством и отделом продаж. Участвовал в совместных проектах с девелоперами и дизайн-студиями.",
    "logo": "../assets/companies/mk-elit-logo.svg",
    "homepageScreen": "../assets/companies/mk-elit-spread.png",
    "companyBrief": "Агентство элитной недвижимости Санкт-Петербурга.",
    "awards": [
      {
        "title": "European Property Awards",
        "year": "2021–2022",
        "detail": "Компания — лауреат европейского этапа International Property Awards.",
        "source": "https://www.mkelite.ru/articles/104",
        "status": "Лауреат",
        "recipient": "MK ELIT",
        "basis": "Публикация компании"
      },
      {
        "title": "Urban Awards",
        "year": "2018",
        "detail": "Победа указана в истории компании; категория не уточнена.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Победитель",
        "recipient": "MK ELIT",
        "basis": "История компании"
      },
      {
        "title": "CREDO",
        "year": "2024",
        "detail": "Лучшее агентство элитной недвижимости Санкт-Петербурга и Ленинградской области.",
        "source": "https://realcongress.ru/images/credo/Credo-2024.pdf",
        "status": "Лауреат",
        "recipient": "MK ELIT",
        "basis": "Источник организатора"
      },
      {
        "title": "KAISSA",
        "year": "2023",
        "detail": "Признание клиентского сервиса в сфере недвижимости.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Награда",
        "recipient": "MK ELIT",
        "basis": "История компании"
      },
      {
        "title": "KAISSA",
        "year": "2023",
        "detail": "Признание динамичного развития бизнеса.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Награда",
        "recipient": "MK ELIT",
        "basis": "История компании"
      },
      {
        "title": "Consumer Trust",
        "year": "2023",
        "detail": "Доверие потребителей к агентству недвижимости Санкт-Петербурга.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Победитель",
        "recipient": "MK ELIT",
        "basis": "История компании"
      },
      {
        "title": "WebRealtor",
        "year": "2024",
        "detail": "Telegram-канал агентства.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Победитель",
        "recipient": "MK ELIT",
        "basis": "История компании"
      },
      {
        "title": "KAISSA",
        "year": "2014",
        "detail": "Награда в элитной недвижимости; точная категория в истории не указана.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Награда",
        "recipient": "MK ELIT",
        "basis": "История компании"
      },
      {
        "title": "RBI — Successful Broker",
        "year": "2012",
        "detail": "Награда девелопера, указанная в истории компании.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Награда",
        "recipient": "MK ELIT",
        "basis": "История компании"
      },
      {
        "title": "Consumer Trust",
        "year": "2025",
        "detail": "Лучшее агентство полного цикла Санкт-Петербурга и Ленинградской области.",
        "source": "https://doveriekonkurs.ru/news/finalisty-doverie-potrebitelja-25-mir-kvartir-jelit/",
        "status": "Финалист",
        "recipient": "MK ELIT",
        "basis": "Источник организатора"
      },
      {
        "title": "European Property Awards — Five Stars",
        "year": "2021",
        "detail": "Личная награда в индивидуальной категории.",
        "source": "https://www.mkelite.ru/articles/104",
        "status": "Личная награда",
        "recipient": "Anton Fedorov, MK ELIT",
        "basis": "Публикация компании"
      }
    ],
    "tabletRecognition": [
      {
        "index": 0,
        "label": "European Property Awards"
      },
      {
        "index": 1,
        "label": "Urban Awards"
      }
    ],
    "disciplines": [
      "strategy",
      "ppc",
      "websites",
      "analytics",
      "crm",
      "creative"
    ],
    "workNote": "Яндекс Директ, лендинги объектов, работа с клиентской базой и CRM-цепочками, аналитика маркетинга и продаж."
  },
  {
    "id": "eva",
    "name": "EVA REAL ESTATE",
    "featured": true,
    "role": "Руководитель PPC · проектная работа",
    "period": "2025",
    "location": "Дубай · Международная аудитория",
    "sector": "Недвижимость",
    "tags": "GOOGLE ADS / YOUTUBE / АНАЛИТИКА",
    "image": "../assets/companies/eva-home.jpg",
    "url": "https://www.eva.realestate/",
    "headline": "Один рынок. Разные покупатели.",
    "summary": "Недвижимость Дубая в Google Ads и YouTube: разные страны, мотивы покупки и рекламные сообщения.",
    "intro": "Вёл контекстную рекламу агентства недвижимости Дубая. Работал с покупателями из ОАЭ, Европы, Северной Америки и Азии, учитывая различия в запросах и поведении.",
    "challenge": "Представлять одни и те же объекты разным аудиториям, сохраняя контроль над бюджетом и качеством обращений.",
    "approach": "Разделял кампании по странам и аудиториям. Проверял, совпадает ли обещание объявления с содержанием лендинга, и использовал аналитику для выбора следующих тестов.",
    "contribution": [
      "Планирование и ведение Google Ads",
      "Поиск, медийная реклама, видео и Performance Max",
      "Разделение кампаний по аудиториям и странам",
      "Тестирование креатива и лендингов",
      "Настройка GTM, GA4 и ремаркетинга",
      "Планирование бюджета и отчётность по эффективности"
    ],
    "delivered": [
      "Структура кампаний для разных рынков",
      "План тестирования аудиторий и объявлений",
      "Аналитика рекламы и посадочных страниц"
    ],
    "collaboration": "Отвечал за контекстную рекламу: согласовывал с агентством объекты, приоритеты кампаний и обратную связь по заявкам.",
    "logo": "../assets/companies/eva-logo.svg",
    "homepageScreen": "../assets/companies/eva-spread.png",
    "companyBrief": "Агентство недвижимости Дубая для международных покупателей.",
    "awards": [
      {
        "title": "EMAAR Sales Awards",
        "year": "Quarterly",
        "detail": "Квартальная награда за продажи; точные годы и уровни не указаны.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Публикация компании"
      },
      {
        "title": "DAMAC Broker Award",
        "year": "",
        "detail": "Награда брокера; год и уровень не указаны.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Публикация компании"
      },
      {
        "title": "Sobha Stars",
        "year": "2022",
        "detail": "Награда девелопера, указанная EVA.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Публикация компании"
      },
      {
        "title": "Regalia Performance",
        "year": "",
        "detail": "Награда за результативность; год не указан.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Публикация компании"
      },
      {
        "title": "Dubai Holding Agents",
        "year": "",
        "detail": "Награда агента; год не указан.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Публикация компании"
      },
      {
        "title": "MAG Top Broker of the Month",
        "year": "2022",
        "detail": "Ежемесячная награда брокера; месяц не указан.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Публикация компании"
      },
      {
        "title": "Prime Global Achievement Award",
        "year": "2023",
        "detail": "Продажи недвижимости — личная награда основателя.",
        "source": "https://www.primeglobalawards.com/post/interview-ms-elvira-sharshenalieva-winner-prime-global-achievement-award-real-estate-sales",
        "status": "Личная награда",
        "recipient": "Elvira Sharshenalieva, founder of EVA Real Estate",
        "basis": "Источник организатора"
      }
    ],
    "tabletRecognition": [
      {
        "index": 2,
        "label": "Sobha Stars"
      },
      {
        "index": 5,
        "label": "MAG Top Broker"
      }
    ],
    "disciplines": [
      "ppc",
      "analytics",
      "websites"
    ],
    "workNote": "Google Ads и YouTube, международные аудитории, тесты лендингов, GTM и GA4."
  },
  {
    "id": "setevie",
    "name": "СЕТЕВЫЕ",
    "featured": true,
    "role": "Руководитель проектов",
    "period": "2023–2025",
    "location": "Санкт-Петербург · Агентские проекты",
    "sector": "Маркетинговое агентство",
    "tags": "КОМАНДА / СТРАТЕГИЯ / ПРОЦЕССЫ",
    "image": "../assets/companies/setevie-hero-v74.jpg",
    "imageAlt": "Сетевые — первый экран сайта компании с архитектурной фотографией",
    "url": "https://setevie.com/",
    "headline": "Разные проекты. Общая ответственность.",
    "summary": "Руководство клиентскими проектами: команда, медиапланы, приоритеты и контроль результата.",
    "intro": "В Setevie / Interestate руководил клиентскими проектами и командой специалистов. Отвечал за приоритеты, координацию работ и понятную отчётность перед заказчиками.",
    "challenge": "Удерживать общий план, когда у каждого проекта свои сроки, бюджеты и ожидания клиента.",
    "approach": "Переводил цели клиента в медиаплан и задачи специалистов. Распределял ответственность, разбирал BI-отчёты и на регулярных встречах решал, что менять дальше.",
    "contribution": [
      "Руководство специалистами по рекламе, SEO и аналитике",
      "Стратегии проектов и медиапланирование",
      "Брифы по каналам и приоритеты работ",
      "Контроль KPI и отчётность для клиентов",
      "Улучшение CRM и воронок",
      "Координация нескольких клиентских проектов"
    ],
    "delivered": [
      "Единый порядок проверки медиапланов",
      "Понятные зоны ответственности по каналам",
      "Общая отчётность для команды и клиентов"
    ],
    "results": [
      {
        "value": ">50%",
        "label": "Снижение стоимости лида",
        "detail": "Стоимость лида снизилась более чем вдвое после оптимизации кампаний."
      },
      {
        "value": "До 500%",
        "label": "Рентабельность маркетинговых вложений",
        "detail": "ROMI после оптимизации рекламных кампаний."
      }
    ],
    "collaboration": "Руководил командой специалистов разных направлений и координировал работу с клиентами.",
    "logo": "../assets/companies/setevie-logo.svg",
    "homepageScreen": "../assets/companies/setevie-architecture-v74.jpg",
    "homepageAlt": "Сетевые — архитектурный фрагмент сайта компании",
    "companyBrief": "Маркетинговое агентство в сфере недвижимости и девелопмента.",
    "awards": [
      {
        "title": "Perspectum Awards",
        "year": "2024",
        "detail": "Бронза, лучшее B2B-мероприятие — открытие апарт-отеля Well в Санкт-Петербурге.",
        "source": "https://perspectum.ru/winners/",
        "status": "Бронза",
        "recipient": "SETEVIE Agency",
        "basis": "Источник организатора"
      },
      {
        "title": "Silver Mercury",
        "year": "2025",
        "detail": "K09, лучшее частное мероприятие — открытие Well.",
        "source": "https://silvermercury.ru/winners/torzhestvennoe-otkrytie-pervogo-v-rossii-apart-otelya-v-kontseptsii-well-being-well-v-sankt-peterburge-2025-6292",
        "status": "Шорт-лист",
        "recipient": "SETEVIE Agency",
        "basis": "Источник организатора"
      },
      {
        "title": "Runet Rating — Digital / Real Estate",
        "year": "2026",
        "detail": "1-е место в категории недвижимости.",
        "source": "https://ratingruneta.ru/digital-agencies/real-estate/",
        "status": "Рейтинг · № 1",
        "recipient": "SETEVIE Agency",
        "basis": "Источник организатора"
      },
      {
        "title": "Runet Rating — Digital / Russia",
        "year": "2026",
        "detail": "17-е место среди digital-агентств России.",
        "source": "https://ratingruneta.ru/digital-agencies/russia/",
        "status": "Рейтинг · № 17",
        "recipient": "SETEVIE Agency",
        "basis": "Источник организатора"
      },
      {
        "title": "Runet Rating — PR / Real Estate",
        "year": "2026",
        "detail": "3-е место в категории PR недвижимости.",
        "source": "https://ratingruneta.ru/pr/real-estate/",
        "status": "Рейтинг · № 3",
        "recipient": "SETEVIE Agency",
        "basis": "Источник организатора"
      },
      {
        "title": "Runet Rating — Digital / Saint Petersburg",
        "year": "2026",
        "detail": "3-е место в категории Санкт-Петербурга.",
        "source": "https://ratingruneta.ru/digital-agencies/st-petersburg/",
        "status": "Рейтинг · № 3",
        "recipient": "SETEVIE Agency",
        "basis": "Источник организатора"
      },
      {
        "title": "MRA — Best Marketing Agency",
        "year": "2025",
        "detail": "Финалист по данным сайта агентства.",
        "source": "https://setevie.com/",
        "status": "Финалист",
        "recipient": "SETEVIE Agency",
        "basis": "Публикация компании"
      }
    ],
    "tabletRecognition": [
      {
        "index": 0,
        "label": "Perspectum Awards",
        "status": "Бронза · Лучшее B2B-мероприятие"
      },
      {
        "index": 1,
        "label": "Silver Mercury",
        "status": "Шорт-лист · Лучшее частное мероприятие"
      }
    ],
    "disciplines": [
      "strategy",
      "ppc",
      "seo",
      "analytics",
      "crm",
      "leadership"
    ],
    "workNote": "Руководил командами рекламы, SEO и аналитики; планировал размещения, контролировал KPI и улучшал воронки."
  },
  {
    "id": "alexander",
    "name": "АЛЕКСАНДР НЕДВИЖИМОСТЬ",
    "featured": false,
    "role": "Маркетолог → руководитель команды",
    "location": "Санкт-Петербург · Россия",
    "sector": "Недвижимость",
    "tags": "SEO / ПРИВЛЕЧЕНИЕ / КОМАНДА",
    "image": "",
    "url": "https://anspb.ru/",
    "headline": "От отдельных задач к своей команде.",
    "summary": "От SEO крупного сайта недвижимости до развития внутренней маркетинговой команды.",
    "intro": "Начинал с SEO, рекламы и отчётности. Со временем взял на себя развитие внутренней команды и координацию маркетинга.",
    "challenge": "Улучшить сайт и работу каналов привлечения при ограниченных ресурсах разработки.",
    "approach": "Выбирал доработки сайта, которые стоило делать при ограниченных ресурсах. Параллельно собирал работу каналов, отчётность и задачи команды в общий план.",
    "contribution": [
      "SEO-аудиты, кластеризация семантики и метатеги",
      "Внутренняя перелинковка и задания на доработку сайта",
      "Яндекс Директ и разработка креатива",
      "Коллтрекинг и отчётность",
      "Координация SMM и развитие команды"
    ],
    "delivered": [
      "План SEO-работ",
      "Общее управление привлечением клиентов",
      "Внутренние процессы маркетинга и отчётность"
    ],
    "collaboration": "Работал с разработчиками, отделом продаж и специалистами по маркетингу.",
    "disciplines": [
      "seo",
      "ppc",
      "websites",
      "analytics",
      "leadership"
    ],
    "workNote": "Техническое SEO, задания на улучшение сайта, Яндекс Директ, коллтрекинг и координация команды."
  },
  {
    "id": "unitec-legal",
    "name": "UNITEC LEGAL",
    "featured": false,
    "role": "SEO-специалист",
    "location": "Санкт-Петербург · Россия",
    "sector": "Юридические услуги",
    "tags": "SEO / КОНТЕНТ / ЛОКАЛЬНЫЙ ПОИСК",
    "image": "",
    "url": "",
    "headline": "Нужная услуга в нужный момент.",
    "summary": "Техническое SEO, страницы юридических услуг и присутствие в локальном поиске.",
    "intro": "Занимался SEO сайта юридической компании на MODX: от сбора запросов и структуры страниц до заданий разработчикам.",
    "challenge": "Сделать страницы юридических услуг заметнее в локальном поиске.",
    "approach": "Выстраивал страницы под запросы клиентов, исправлял технические ошибки, улучшал тексты и коммерческую информацию.",
    "contribution": [
      "Технический и контентный аудит",
      "Сбор запросов и структура страниц услуг",
      "Метатеги, структурированные данные и внутренние ссылки",
      "Присутствие в локальном поиске",
      "Аналитика и координация разработки"
    ],
    "delivered": [
      "Структура сайта под запросы о юридических услугах",
      "Задания разработчику и редактору",
      "Контроль позиций, поисковой видимости и отчётность"
    ],
    "collaboration": "Работал с юридической компанией и разработчиками сайта.",
    "disciplines": [
      "seo",
      "websites",
      "analytics"
    ],
    "workNote": "Техническое SEO, структура страниц услуг, локальный поиск и координация аналитики."
  },
  {
    "id": "tivat-gardens",
    "name": "TIVAT GARDENS",
    "featured": false,
    "role": "Маркетинг · проектная работа",
    "location": "Черногория",
    "sector": "Девелопмент недвижимости",
    "tags": "КАТАЛОГИ / НАРУЖНАЯ РЕКЛАМА / DIGITAL",
    "image": "",
    "url": "",
    "headline": "Показать, каким будет место.",
    "summary": "Презентационные материалы объектов и поддержка рекламы.",
    "intro": "Проектная маркетинговая работа для девелопмента в Черногории.",
    "challenge": "Рассказать о будущем объекте так, чтобы покупатель понял его особенности и мог представить свой выбор.",
    "approach": "Готовил информацию и визуальные материалы для печатной и цифровой рекламы проекта.",
    "contribution": [
      "Каталоги недвижимости",
      "Материалы наружной рекламы",
      "Поддержка цифровой рекламы"
    ],
    "delivered": [
      "Презентационные материалы объектов",
      "Материалы маркетинга и продаж"
    ],
    "collaboration": "Проектное сотрудничество с девелоперской компанией.",
    "disciplines": [
      "creative",
      "ppc"
    ],
    "workNote": "Каталоги недвижимости, наружная реклама и поддержка цифровых кампаний."
  },
  {
    "id": "unitec-marine",
    "name": "UNITEC MARINE",
    "featured": false,
    "role": "Контент-редактор сайта",
    "location": "Россия · Морские услуги",
    "sector": "Морские услуги",
    "tags": "WORDPRESS / КОНТЕНТ / UX",
    "image": "",
    "url": "",
    "headline": "Сайт, в котором легко разобраться.",
    "summary": "Обновление контента, аудит сайта и удобство на телефоне.",
    "intro": "Работа с контентом и удобством сайта морского агентства на WordPress.",
    "challenge": "Помочь посетителю найти нужную услугу и пользоваться сайтом с любого устройства.",
    "approach": "Проверял содержание и мобильную версию, находил технические ошибки и координировал исправления.",
    "contribution": [
      "Редактирование контента сайта",
      "Технические аудиты сайта",
      "Проверка мобильной версии",
      "Обновления WordPress"
    ],
    "delivered": [
      "Обновлённый контент сайта",
      "Список улучшений по приоритетам"
    ],
    "collaboration": "Работал с компанией над содержанием и поддержкой сайта.",
    "disciplines": [
      "websites"
    ],
    "workNote": "Обновление контента в WordPress, технический аудит и проверка мобильной версии."
  },
  {
    "id": "euro-ag",
    "name": "EURO-AG",
    "featured": false,
    "role": "Помощник директора · частичная занятость",
    "location": "Россия · Логистика",
    "sector": "Логистика",
    "tags": "ПРОЦЕССЫ / ДАННЫЕ / МАРКЕТИНГ",
    "image": "",
    "url": "",
    "headline": "Увидеть бизнес изнутри.",
    "summary": "Поддержка директора и команды, работа с данными и первые задачи в маркетинге.",
    "intro": "Работал помощником директора в логистике: помогал с данными и ежедневными задачами, участвовал в маркетинге.",
    "challenge": "Поддерживать ежедневную работу команды и обрабатывать большие объёмы данных.",
    "approach": "Организовывал данные и задачи команды, участвовал в рекламе и коммуникациях.",
    "contribution": [
      "Excel и работа с данными",
      "Координация задач команды",
      "Контекстная и таргетированная реклама",
      "Email-маркетинг"
    ],
    "delivered": [
      "Поддержка бизнеса и отчётности",
      "Практический опыт в бизнес-процессах и маркетинге"
    ],
    "collaboration": "Помогал директору и команде с ежедневными задачами на условиях частичной занятости.",
    "disciplines": [
      "ppc"
    ],
    "workNote": "Данные и задачи команды, контекстная реклама и email-рассылки."
  },
  {
    "id": "independent",
    "name": "НЕЗАВИСИМЫЕ ПРОЕКТЫ",
    "featured": false,
    "role": "Консультант по digital-маркетингу",
    "location": "Проектное сотрудничество",
    "sector": "Бьюти · HR · Другие услуги",
    "tags": "АУДИТЫ / SEO / ПРИВЛЕЧЕНИЕ",
    "image": "",
    "url": "",
    "headline": "Сначала задача. Затем инструменты.",
    "summary": "SEO, сайты и привлечение клиентов для сервисного бизнеса за пределами недвижимости.",
    "intro": "Независимые проекты и консультации для сервисного бизнеса, включая бьюти и подбор персонала.",
    "challenge": "Выбрать изменения, которые подходят бизнесу по смыслу, бюджету и возможностям команды.",
    "approach": "Разбираюсь, как человек выбирает услугу и что мешает ему обратиться. Предлагаю изменения с учётом ресурсов собственника и команды.",
    "contribution": [
      "Аудит SEO и сайтов",
      "Рекомендации по привлечению и контенту",
      "Маркетинговые консультации"
    ],
    "delivered": [
      "Планы улучшений по приоритетам",
      "Дальнейшая экспертная поддержка"
    ],
    "collaboration": "Работаю напрямую с собственниками и профильными подрядчиками.",
    "disciplines": [
      "seo",
      "websites",
      "strategy"
    ],
    "workNote": "Аудиты сайтов и SEO, рекомендации по привлечению клиентов и консультации."
  }
];
 const data={projects,featured:projects.filter(p=>p.featured)};
 if(typeof module==='object'&&module.exports)module.exports=data;else root.DTExperience=data;
})(typeof window==='undefined'?globalThis:window);
