import { TopicId } from './types';

export interface ConfusionPair {
  id: string;
  topicId: TopicId;
  title: string;
  terms: string[];
  description: string;
  cardA: {
    title: string;
    badge: string;
    formula: string;
    exampleEs: string;
    exampleRu: string;
    explanation: string;
  };
  cardB: {
    title: string;
    badge: string;
    formula: string;
    exampleEs: string;
    exampleRu: string;
    explanation: string;
  };
  cardC?: {
    title: string;
    badge: string;
    formula: string;
    exampleEs: string;
    exampleRu: string;
    explanation: string;
  };
  questions: {
    id: string;
    promptRu: string;
    sentenceWithBlank: string;
    options: {
      text: string;
      isCorrect: boolean;
      explanation: string;
    }[];
    fullSentenceEs: string;
    fullSentenceRu: string;
    why: string;
  }[];
}

export const CONFUSION_PAIRS: ConfusionPair[] = [
  {
    id: 'conf-t-tq',
    topicId: 'tener_que',
    title: 'Tengo vs Tengo que',
    terms: ['Tengo', 'Tengo que'],
    description: 'Tengo — у меня просто есть предмет. Tengo que — мне нужно совершить действие.',
    cardA: {
      title: 'TENGO (Обладание)',
      badge: 'ПРЕДМЕТ 🎁',
      formula: 'Tengo + существительное',
      exampleEs: 'Tengo un libro.',
      exampleRu: 'У меня есть книга.',
      explanation: 'Используй, когда говоришь о вещи, друге или питомце.',
    },
    cardB: {
      title: 'TENGO QUE (Обязанность)',
      badge: 'ДЕЙСТВИЕ ⏰',
      formula: 'Tengo que + инфинитив',
      exampleEs: 'Tengo que leer.',
      exampleRu: 'Мне нужно читать.',
      explanation: 'Используй, когда нужно выполнить действие (глагол на -ar, -er, -ir).',
    },
    questions: [
      {
        id: 'cp-1-1',
        promptRu: 'Какая фраза нужна: «Мне нужно сделать домашнее задание»?',
        sentenceWithBlank: 'Yo ___ hacer los deberes.',
        options: [
          { text: 'tengo que', isCorrect: true, explanation: 'Hacer — глагол-действие, поэтому обязательно tengo que!' },
          { text: 'tengo', isCorrect: false, explanation: 'Просто tengo нельзя ставить перед действием без que.' },
        ],
        fullSentenceEs: 'Tengo que hacer los deberes.',
        fullSentenceRu: 'Мне нужно делать уроки.',
        why: 'Перед действием (глаголом) используется конструкция tengo que.',
      },
      {
        id: 'cp-1-2',
        promptRu: '«У меня есть собака по кличке Боби»',
        sentenceWithBlank: 'Yo ___ un perro.',
        options: [
          { text: 'tengo', isCorrect: true, explanation: 'Perro — предмет/животное, поэтому просто tengo!' },
          { text: 'tengo que', isCorrect: false, explanation: 'Tengo que требует после себя действие (глагол).' },
        ],
        fullSentenceEs: 'Tengo un perro.',
        fullSentenceRu: 'У меня есть собака.',
        why: 'Собака — существительное, частица que не нужна.',
      },
      {
        id: 'cp-1-3',
        promptRu: '«Нам нужно идти прямо сейчас»',
        sentenceWithBlank: 'Nosotros ___ salir ahora.',
        options: [
          { text: 'tenemos que', isCorrect: true, explanation: 'Salir — действие (выходить), нужно tenemos que!' },
          { text: 'tenemos', isCorrect: false, explanation: 'Tenemos без que не передаёт необходимость действия.' },
        ],
        fullSentenceEs: 'Tenemos que salir ahora.',
        fullSentenceRu: 'Нам нужно выйти сейчас.',
        why: 'Tenemos que + salir (инфинитив).',
      },
    ],
  },
  {
    id: 'conf-h-t',
    topicId: 'hay_tener',
    title: 'Hay vs Tengo / Tiene',
    terms: ['Hay', 'Tengo'],
    description: 'Hay указывает, где предмет находится в комнате или на улице. Tengo — кому он принадлежит.',
    cardA: {
      title: 'HAY (Находится где-то)',
      badge: 'МЕСТО 📍',
      formula: 'En la mesa / Aquí + HAY',
      exampleEs: 'Hay un gato en la cama.',
      exampleRu: 'На кровати есть кот.',
      explanation: 'Ничей кот просто сидит на кровати.',
    },
    cardB: {
      title: 'TENGO (Принадлежит мне)',
      badge: 'ВЛАДЕЛЕЦ 👤',
      formula: 'Yo + TENGO + вещь',
      exampleEs: 'Tengo un gato blanco.',
      exampleRu: 'У меня есть белый кот.',
      explanation: 'Это мой личный домашний питомец.',
    },
    questions: [
      {
        id: 'cp-2-1',
        promptRu: '«На столе есть три ручки»',
        sentenceWithBlank: 'En la mesa ___ tres bolígrafos.',
        options: [
          { text: 'hay', isCorrect: true, explanation: 'Указано место «en la mesa» — значит hay!' },
          { text: 'tengo', isCorrect: false, explanation: 'Tengo значит «у меня есть», а здесь говорится про стол.' },
        ],
        fullSentenceEs: 'En la mesa hay tres bolígrafos.',
        fullSentenceRu: 'На столе есть три ручки.',
        why: 'Наличие предмета в локации передается глаголом hay.',
      },
      {
        id: 'cp-2-2',
        promptRu: '«У меня есть две сестры»',
        sentenceWithBlank: 'Yo ___ dos hermanas.',
        options: [
          { text: 'tengo', isCorrect: true, explanation: 'Личное родство и владение — yo tengo.' },
          { text: 'hay', isCorrect: false, explanation: 'С местоимением Yo слово hay использовать категорически нельзя.' },
        ],
        fullSentenceEs: 'Tengo dos hermanas.',
        fullSentenceRu: 'У меня есть две сестры.',
        why: 'Личная связь: Yo tengo.',
      },
    ],
  },
  {
    id: 'conf-m-m',
    topicId: 'muy_mucho',
    title: 'Muy vs Mucho',
    terms: ['Muy', 'Mucho'],
    description: 'Muy = очень (перед прилагательным). Mucho = много (после глагола или перед предметами).',
    cardA: {
      title: 'MUY (Очень)',
      badge: 'КАКОЙ? КАК? ✨',
      formula: 'MUY + прилагательное / наречие',
      exampleEs: 'Muy bonito / Muy bien',
      exampleRu: 'Очень красивый / Очень хорошо',
      explanation: 'Неизменяемое слово! Усиливает качество.',
    },
    cardB: {
      title: 'MUCHO (Много)',
      badge: 'СКОЛЬКО? 📦',
      formula: 'Глагол + MUCHO / MUCHO(S) + сущ.',
      exampleEs: 'Trabajo mucho / Muchos amigos',
      exampleRu: 'Много работаю / Много друзей',
      explanation: 'Ставится после глаголов или согласуется с существительными.',
    },
    questions: [
      {
        id: 'cp-3-1',
        promptRu: '«Этот торт очень вкусный»',
        sentenceWithBlank: 'Este pastel es ___ rico.',
        options: [
          { text: 'muy', isCorrect: true, explanation: 'Rico — прилагательное (вкусный), поэтому muy rico!' },
          { text: 'mucho', isCorrect: false, explanation: 'Mucho rico ❌ говорить нельзя!' },
        ],
        fullSentenceEs: 'Este pastel es muy rico.',
        fullSentenceRu: 'Этот торт очень вкусный.',
        why: 'Перед прилагательными всегда ставится muy.',
      },
      {
        id: 'cp-3-2',
        promptRu: '«Мой брат много читает»',
        sentenceWithBlank: 'Mi hermano lee ___.',
        options: [
          { text: 'mucho', isCorrect: true, explanation: 'После глагола lee ставится mucho.' },
          { text: 'muy', isCorrect: false, explanation: 'Lee muy ❌ — так говорить нельзя!' },
        ],
        fullSentenceEs: 'Mi hermano lee mucho.',
        fullSentenceRu: 'Мой брат много читает.',
        why: 'После глагола в конце предложения ставится mucho.',
      },
    ],
  },
  {
    id: 'conf-b-b',
    topicId: 'bien_bueno',
    title: 'Bien vs Bueno / Buen',
    terms: ['Bien', 'Bueno / Buen'],
    description: 'Bien — наречие «хорошо» (как?). Bueno — прилагательное «хороший» (какой?).',
    cardA: {
      title: 'BIEN (Хорошо)',
      badge: 'КАК? 🏃',
      formula: 'Estoy bien / Habla bien',
      exampleEs: 'Estoy muy bien.',
      exampleRu: 'У меня всё очень хорошо.',
      explanation: 'Описывает, как совершается действие или как себя чувствуешь.',
    },
    cardB: {
      title: 'BUENO / BUEN (Хороший)',
      badge: 'КАКОЙ? 🌟',
      formula: 'Un buen amigo / El libro es bueno',
      exampleEs: 'Es un buen amigo.',
      exampleRu: 'Он хороший друг.',
      explanation: 'Описывает качество предмета или человека.',
    },
    questions: [
      {
        id: 'cp-4-1',
        promptRu: '«Как дела?» — «Всё хорошо!»',
        sentenceWithBlank: 'Todo está ___.',
        options: [
          { text: 'bien', isCorrect: true, explanation: 'Состояние: всё находится в хорошем порядке (está bien).' },
          { text: 'bueno', isCorrect: false, explanation: 'Está bueno обычно значит «это вкусно» о блюде!' },
        ],
        fullSentenceEs: 'Todo está bien.',
        fullSentenceRu: 'Всё хорошо.',
        why: 'Está bien — устойчивое выражение порядка и самочувствия.',
      },
      {
        id: 'cp-4-2',
        promptRu: '«Он очень хороший мальчик»',
        sentenceWithBlank: 'Él es un chico muy ___.',
        options: [
          { text: 'bueno', isCorrect: true, explanation: 'Мальчик какой? Хороший (bueno)!' },
          { text: 'bien', isCorrect: false, explanation: 'Un chico bien — не передает «хороший мальчик».' },
        ],
        fullSentenceEs: 'Él es un chico muy bueno.',
        fullSentenceRu: 'Он очень хороший мальчик.',
        why: 'Качество человека описывается прилагательным bueno.',
      },
    ],
  },
  {
    id: 'conf-p-up',
    topicId: 'poco',
    title: 'Poco vs Un poco vs Un poco de',
    terms: ['Poco', 'Un poco', 'Un poco de'],
    description: 'Poco — мало (нехватка). Un poco — немного (чуть-чуть). Un poco de — немного чего-то.',
    cardA: {
      title: 'POCO (Мало)',
      badge: 'ДЕФИЦИТ ❌',
      formula: 'Poco + сущ. (БЕЗ DE)',
      exampleEs: 'Tengo poco dinero.',
      exampleRu: 'У меня мало денег.',
      explanation: 'Акцент на том, что недостаточно.',
    },
    cardB: {
      title: 'UN POCO (Немного)',
      badge: 'КАЧЕСТВО 🤏',
      formula: 'Un poco + прилагательное',
      exampleEs: 'Estoy un poco cansado.',
      exampleRu: 'Я немного устал.',
      explanation: 'Используется перед прилагательными.',
    },
    cardC: {
      title: 'UN POCO DE (Немного чего-то)',
      badge: 'ПРЕДМЕТ 💧',
      formula: 'Un poco DE + существительное',
      exampleEs: 'Quiero un poco de agua.',
      exampleRu: 'Я хочу немного воды.',
      explanation: 'Обязателен предлог DE перед существительными!',
    },
    questions: [
      {
        id: 'cp-5-1',
        promptRu: '«Дай мне немного хлеба, пожалуйста»',
        sentenceWithBlank: 'Dame ___ pan, por favor.',
        options: [
          { text: 'un poco de', isCorrect: true, explanation: 'Перед существительным pan обязательно un poco de!' },
          { text: 'poco', isCorrect: false, explanation: 'Poco pan = мало хлеба (грустно).' },
          { text: 'un poco', isCorrect: false, explanation: 'Забыл предлог de перед словом pan!' },
        ],
        fullSentenceEs: 'Dame un poco de pan, por favor.',
        fullSentenceRu: 'Дай мне немного хлеба, пожалуйста.',
        why: 'Перед существительным требуется связка un poco DE.',
      },
      {
        id: 'cp-5-2',
        promptRu: '«Я сегодня немного сонный»',
        sentenceWithBlank: 'Estoy ___ cansado hoy.',
        options: [
          { text: 'un poco', isCorrect: true, explanation: 'Перед прилагательным cansado предлог de не ставится!' },
          { text: 'un poco de', isCorrect: false, explanation: 'Cansado — не существительное, предлог de здесь ошибка!' },
        ],
        fullSentenceEs: 'Estoy un poco cansado hoy.',
        fullSentenceRu: 'Я немного устал сегодня.',
        why: 'С прилагательными используется un poco без de.',
      },
    ],
  },
  {
    id: 'conf-e-ee-se',
    topicId: 'seguir_gerundio',
    title: 'Estudio vs Estoy estudiando vs Sigo estudiando',
    terms: ['Estudio', 'Estoy estudiando', 'Sigo estudiando'],
    description: 'Три степени настоящего: вообще учусь -> учу прямо сейчас -> всё ещё продолжаю учить.',
    cardA: {
      title: 'ESTUDIO (Вообще)',
      badge: 'ОБЫЧНО 📅',
      formula: 'Presente simple',
      exampleEs: 'Estudio español en el colegio.',
      exampleRu: 'Я учу испанский в школе.',
      explanation: 'Обычный факт жизни, расписание.',
    },
    cardB: {
      title: 'ESTOY ESTUDIANDO (В эту минуту)',
      badge: 'ПРЯМО СЕЙЧАС ⏱️',
      formula: 'Estar + gerundio',
      exampleEs: 'Ahora estoy estudiando.',
      exampleRu: 'Сейчас я учусь.',
      explanation: 'Действие происходит прямо в момент разговора.',
    },
    cardC: {
      title: 'SIGO ESTUDIANDO (Не закончил)',
      badge: 'ПРОДОЛЖАЮ 🔄',
      formula: 'Seguir + gerundio',
      exampleEs: 'Son las diez y sigo estudiando.',
      exampleRu: 'Уже 10 часов, а я продолжаю учиться.',
      explanation: 'Действие длится и всё ещё продолжается.',
    },
    questions: [
      {
        id: 'cp-6-1',
        promptRu: 'Мама звонит: «Что ты делаешь прямо в эту секунду?»',
        sentenceWithBlank: 'Ahora ___ los ejercicios.',
        options: [
          { text: 'estoy haciendo', isCorrect: true, explanation: 'Прямо сейчас — estar + герундий (estoy haciendo)!' },
          { text: 'hago', isCorrect: false, explanation: 'Hago указывает на факт вообще, а не на текущую секунду.' },
        ],
        fullSentenceEs: 'Ahora estoy haciendo los ejercicios.',
        fullSentenceRu: 'Сейчас я делаю упражнения.',
        why: 'Для ответа «что делаешь прямо сейчас» служит estar + герундий.',
      },
      {
        id: 'cp-6-2',
        promptRu: '«Все уже ушли, а он всё ещё работает»',
        sentenceWithBlank: 'Él ___ en la oficina.',
        options: [
          { text: 'sigue trabajando', isCorrect: true, explanation: 'Всё ещё продолжается — seguir + герундий!' },
          { text: 'está trabajando', isCorrect: false, explanation: 'Está trabajando говорит лишь о моменте, а здесь акцент «всё ещё».' },
        ],
        fullSentenceEs: 'Él sigue trabajando en la oficina.',
        fullSentenceRu: 'Он продолжает работать в офисе.',
        why: 'Seguir передает продолжение незаконченного действия.',
      },
    ],
  },
];
