import { ExerciseFormat } from './types';

export interface TranslationTask {
  id: string;
  ru: string;
  esCanonical: string;
  acceptedEs: string[];
  words: string[];
  options: {
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  explanation: {
    correctEs: string;
    correctRu: string;
    why: string;
    ruleTip?: string;
  };
}

export const TRANSLATION_TASKS: TranslationTask[] = [
  {
    id: 'tr-1',
    ru: 'У меня есть кошка.',
    esCanonical: 'Tengo una gata.',
    acceptedEs: ['tengo una gata', 'tengo un gato', 'yo tengo una gata', 'yo tengo un gato', 'tengo una gata.'],
    words: ['gata', 'una', 'tengo', 'yo'],
    options: [
      { text: 'Tengo una gata.', isCorrect: true },
      { text: 'Hay una gata.', isCorrect: false, explanation: 'Hay — значит «где-то есть», а не «у меня есть».' },
      { text: 'Soy una gata.', isCorrect: false, explanation: 'Soy una gata = «Я — кошка» 😸!' },
    ],
    explanation: {
      correctEs: 'Tengo una gata.',
      correctRu: 'У меня есть кошка.',
      why: 'Tengo = у меня есть, una gata = кошка.',
      ruleTip: 'У меня есть = Tengo.',
    },
  },
  {
    id: 'tr-2',
    ru: 'Мне нужно идти.',
    esCanonical: 'Tengo que ir.',
    acceptedEs: ['tengo que ir', 'yo tengo que ir', 'tengo que irme', 'tengo que ir.'],
    words: ['que', 'ir', 'tengo'],
    options: [
      { text: 'Tengo que ir.', isCorrect: true },
      { text: 'Tengo ir.', isCorrect: false, explanation: 'Забыл que! Перед действием обязательно: tengo que ir.' },
      { text: 'Soy que ir.', isCorrect: false, explanation: 'Обязанность передается через tener que.' },
    ],
    explanation: {
      correctEs: 'Tengo que ir.',
      correctRu: 'Мне нужно идти.',
      why: 'Tener que + инфинитив ir выражает необходимость.',
    },
  },
  {
    id: 'tr-3',
    ru: 'В комнате есть стол.',
    esCanonical: 'En la habitación hay una mesa.',
    acceptedEs: [
      'en la habitación hay una mesa',
      'en la habitacion hay una mesa',
      'hay una mesa en la habitación',
      'hay una mesa en la habitacion',
    ],
    words: ['mesa', 'una', 'habitación', 'la', 'en', 'hay'],
    options: [
      { text: 'En la habitación hay una mesa.', isCorrect: true },
      { text: 'En la habitación tengo una mesa.', isCorrect: false, explanation: 'Tengo — у меня, а здесь речь о нахождении стола в комнате.' },
      { text: 'La habitación tiene que mesa.', isCorrect: false, explanation: 'Бессмысленно.' },
    ],
    explanation: {
      correctEs: 'En la habitación hay una mesa.',
      correctRu: 'В комнате есть стол.',
      why: 'Наличие предмета в месте выражается формой hay.',
    },
  },
  {
    id: 'tr-4',
    ru: 'Я очень счастлив.',
    esCanonical: 'Estoy muy feliz.',
    acceptedEs: ['estoy muy feliz', 'yo estoy muy feliz', 'soy muy feliz', 'estoy muy feliz.'],
    words: ['muy', 'feliz', 'estoy'],
    options: [
      { text: 'Estoy muy feliz.', isCorrect: true },
      { text: 'Estoy mucho feliz.', isCorrect: false, explanation: 'Feliz — прилагательное, перед ним используется MUY, а не mucho!' },
      { text: 'Tengo muy feliz.', isCorrect: false, explanation: 'Счастье как состояние выражается через estar.' },
    ],
    explanation: {
      correctEs: 'Estoy muy feliz.',
      correctRu: 'Я очень счастлив.',
      why: 'Перед прилагательным feliz ставится наречие muy (очень).',
    },
  },
  {
    id: 'tr-5',
    ru: 'Я много работаю.',
    esCanonical: 'Trabajo mucho.',
    acceptedEs: ['trabajo mucho', 'yo trabajo mucho', 'trabajo mucho.'],
    words: ['mucho', 'trabajo', 'yo'],
    options: [
      { text: 'Trabajo mucho.', isCorrect: true },
      { text: 'Trabajo muy.', isCorrect: false, explanation: 'После глагола palabra «muy» не ставится — только mucho!' },
      { text: 'Tengo mucho trabajo.', isCorrect: false, explanation: 'Это значит «у меня много работы» (существительное), а фраза: «я работаю много».' },
    ],
    explanation: {
      correctEs: 'Trabajo mucho.',
      correctRu: 'Я много работаю.',
      why: 'После глагола в значении «много» ставится наречие mucho.',
    },
  },
  {
    id: 'tr-6',
    ru: 'Я хорошо говорю.',
    esCanonical: 'Hablo bien.',
    acceptedEs: ['hablo bien', 'yo hablo bien', 'hablo muy bien', 'hablo bien.'],
    words: ['bien', 'hablo'],
    options: [
      { text: 'Hablo bien.', isCorrect: true },
      { text: 'Hablo bueno.', isCorrect: false, explanation: 'Bueno — какой (хороший), а как говорю? Хорошо (bien)!' },
      { text: 'Hablo buen.', isCorrect: false, explanation: 'Buen ставится только перед существительными мужского рода.' },
    ],
    explanation: {
      correctEs: 'Hablo bien.',
      correctRu: 'Я хорошо говорю.',
      why: 'Отвечает на вопрос «как?» — bien (хорошо).',
    },
  },
  {
    id: 'tr-7',
    ru: 'Это хороший друг.',
    esCanonical: 'Es un buen amigo.',
    acceptedEs: ['es un buen amigo', 'él es un buen amigo', 'el es un buen amigo', 'es un buen amigo.'],
    words: ['amigo', 'buen', 'un', 'es'],
    options: [
      { text: 'Es un buen amigo.', isCorrect: true },
      { text: 'Es un bien amigo.', isCorrect: false, explanation: 'Bien — наречие «хорошо», а друг какой? Хороший (buen)!' },
      { text: 'Es un bueno amigo.', isCorrect: false, explanation: 'Перед существительным мужского рода bueno сокращается до buen.' },
    ],
    explanation: {
      correctEs: 'Es un buen amigo.',
      correctRu: 'Это хороший друг.',
      why: 'Перед существительным amigo форма bueno сокращается до buen.',
    },
  },
  {
    id: 'tr-8',
    ru: 'У меня мало времени.',
    esCanonical: 'Tengo poco tiempo.',
    acceptedEs: ['tengo poco tiempo', 'yo tengo poco tiempo', 'tengo poco tiempo.'],
    words: ['tiempo', 'poco', 'tengo'],
    options: [
      { text: 'Tengo poco tiempo.', isCorrect: true },
      { text: 'Tengo poco de tiempo.', isCorrect: false, explanation: 'После poco предлог de не нужен! Предлог de ставится только после un poco.' },
      { text: 'Hay poco tiempo.', isCorrect: false, explanation: 'Это значит «времени мало (вообще)», а нужно «у меня мало времени».' },
    ],
    explanation: {
      correctEs: 'Tengo poco tiempo.',
      correctRu: 'У меня мало времени.',
      why: 'Poco tiempo = мало времени (без предлога de).',
    },
  },
  {
    id: 'tr-9',
    ru: 'Я хочу немного воды.',
    esCanonical: 'Quiero un poco de agua.',
    acceptedEs: ['quiero un poco de agua', 'yo quiero un poco de agua', 'quiero un poco de agua.'],
    words: ['agua', 'de', 'poco', 'un', 'quiero'],
    options: [
      { text: 'Quiero un poco de agua.', isCorrect: true },
      { text: 'Quiero un poco agua.', isCorrect: false, explanation: 'Перед существительным agua обязательно нужен предлог de!' },
      { text: 'Quiero poco agua.', isCorrect: false, explanation: 'Это значит «хочу мало воды», а вежливая просьба — un poco de agua.' },
    ],
    explanation: {
      correctEs: 'Quiero un poco de agua.',
      correctRu: 'Я хочу немного воды.',
      why: 'Un poco DE + существительное (вода).',
    },
  },
  {
    id: 'tr-10',
    ru: 'Я сейчас играю.',
    esCanonical: 'Estoy jugando.',
    acceptedEs: ['estoy jugando', 'yo estoy jugando', 'ahora estoy jugando', 'estoy jugando.'],
    words: ['jugando', 'estoy'],
    options: [
      { text: 'Estoy jugando.', isCorrect: true },
      { text: 'Juego.', isCorrect: false, explanation: 'Juego значит «я играю вообще», а для «сейчас» нужен герундий estoy jugando.' },
      { text: 'Soy jugando.', isCorrect: false, explanation: 'Герундий образуется только с глаголом estar!' },
    ],
    explanation: {
      correctEs: 'Estoy jugando.',
      correctRu: 'Я сейчас играю.',
      why: 'Estar + герундий (estoy jugando) обозначает действие прямо в эту секунду.',
    },
  },
  {
    id: 'tr-11',
    ru: 'Я продолжаю читать.',
    esCanonical: 'Sigo leyendo.',
    acceptedEs: ['sigo leyendo', 'yo sigo leyendo', 'sigo leyendo.'],
    words: ['leyendo', 'sigo'],
    options: [
      { text: 'Sigo leyendo.', isCorrect: true },
      { text: 'Sigo a leer.', isCorrect: false, explanation: 'После seguir сразу ставится герундий leyendo без предлогов!' },
      { text: 'Estoy leyendo.', isCorrect: false, explanation: 'Это значит «я сейчас читаю», а «продолжаю читать» — sigo leyendo.' },
    ],
    explanation: {
      correctEs: 'Sigo leyendo.',
      correctRu: 'Я продолжаю читать.',
      why: 'Seguir + герундий (sigo leyendo) = продолжаю читать.',
    },
  },
  {
    id: 'tr-12',
    ru: 'Нам нужно учиться.',
    esCanonical: 'Tenemos que estudiar.',
    acceptedEs: ['tenemos que estudiar', 'nosotros tenemos que estudiar', 'tenemos que estudiar.'],
    words: ['estudiar', 'que', 'tenemos'],
    options: [
      { text: 'Tenemos que estudiar.', isCorrect: true },
      { text: 'Tenemos estudiar.', isCorrect: false, explanation: 'Пропущена частица que!' },
      { text: 'Hay estudiar.', isCorrect: false, explanation: 'Tenemos que указывает на «нам нужно».' },
    ],
    explanation: {
      correctEs: 'Tenemos que estudiar.',
      correctRu: 'Нам нужно учиться.',
      why: 'Tenemos que + инфинитив estudiar.',
    },
  },
  {
    id: 'tr-13',
    ru: 'У неё много книг.',
    esCanonical: 'Ella tiene muchos libros.',
    acceptedEs: ['ella tiene muchos libros', 'tiene muchos libros', 'ella tiene muchos libros.'],
    words: ['libros', 'muchos', 'tiene', 'ella'],
    options: [
      { text: 'Ella tiene muchos libros.', isCorrect: true },
      { text: 'Ella tiene muy libros.', isCorrect: false, explanation: 'Перед существительными muy не ставится!' },
      { text: 'Ella tiene mucho libros.', isCorrect: false, explanation: 'Нужно согласовать во множественном числе: muchos libros.' },
    ],
    explanation: {
      correctEs: 'Ella tiene muchos libros.',
      correctRu: 'У неё много книг.',
      why: 'Libros — мужской род во мн. числе, поэтому muchos libros.',
    },
  },
  {
    id: 'tr-14',
    ru: 'Я немного устал.',
    esCanonical: 'Estoy un poco cansado.',
    acceptedEs: ['estoy un poco cansado', 'yo estoy un poco cansado', 'estoy un poco cansado.'],
    words: ['cansado', 'poco', 'un', 'estoy'],
    options: [
      { text: 'Estoy un poco cansado.', isCorrect: true },
      { text: 'Estoy un poco de cansado.', isCorrect: false, explanation: 'Перед прилагательным cansado предлог de не ставится!' },
      { text: 'Tengo un poco cansado.', isCorrect: false, explanation: 'Усталость передается через estar: estoy cansado.' },
    ],
    explanation: {
      correctEs: 'Estoy un poco cansado.',
      correctRu: 'Я немного устал.',
      why: 'Un poco + прилагательное cansado (без предлога de).',
    },
  },
  {
    id: 'tr-15',
    ru: 'Сейчас мы едим.',
    esCanonical: 'Ahora estamos comiendo.',
    acceptedEs: [
      'ahora estamos comiendo',
      'estamos comiendo ahora',
      'estamos comiendo',
      'ahora estamos comiendo.',
    ],
    words: ['comiendo', 'estamos', 'ahora'],
    options: [
      { text: 'Ahora estamos comiendo.', isCorrect: true },
      { text: 'Ahora comemos.', isCorrect: false, explanation: 'Для действия прямо в эту минуту естественнее estar + герундий.' },
      { text: 'Ahora somos comiendo.', isCorrect: false, explanation: 'Герундий образуется только с глаголом estar!' },
    ],
    explanation: {
      correctEs: 'Ahora estamos comiendo.',
      correctRu: 'Сейчас мы едим.',
      why: 'Estamos comiendo — процесс прямо сейчас.',
    },
  },
];
