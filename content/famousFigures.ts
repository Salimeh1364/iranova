import type { Locale } from "@/i18n/types";
import type { ArtworkPlacement } from "@/lib/types";
import { portraitPlacement } from "@/scene/portraitLayout";

/** One language of a label and a short biography. */
export type FigureCopy = {
  name: string;
  field: string;
  years: string;
  biography: string;
};

/**
 * A portrait in the exhibition.
 * `image` is the file to drop into `public/images/figures/`.
 * Until that file exists, the frame paints an artistic placeholder.
 */
export type FamousFigure = {
  id: string;
  image: string;
  placement: ArtworkPlacement;
  copy: Record<Locale, FigureCopy>;
};

/**
 * Eight figures across science, art, cinema, and music.
 * Hang points live in portraitLayout: one eye height, clear of the columns.
 */
export const figures: readonly FamousFigure[] = [
  {
    id: "mirzakhani",
    image: "/images/figures/mirzakhani.jpg",
    placement: portraitPlacement("mirzakhani", "foyerWest", 3),
    copy: {
      en: {
        name: "Maryam Mirzakhani",
        field: "Mathematics",
        years: "1977–2017",
        biography:
          "Maryam Mirzakhani was a mathematician whose work changed how geometry is understood. Born in Tehran, she won gold medals at the International Mathematical Olympiad, completed her doctorate at Harvard, and became a professor at Stanford. In 2014 she received the Fields Medal, the first woman to do so, for her research on the dynamics and geometry of Riemann surfaces and their moduli spaces.",
      },
      de: {
        name: "Maryam Mirzakhani",
        field: "Mathematik",
        years: "1977–2017",
        biography:
          "Maryam Mirzakhani war eine Mathematikerin, deren Arbeit das Verständnis von Geometrie verändert hat. In Teheran geboren, gewann sie Goldmedaillen bei der Internationalen Mathematik-Olympiade, promovierte in Harvard und wurde Professorin in Stanford. 2014 erhielt sie als erste Frau die Fields-Medaille, für ihre Forschung zur Dynamik und Geometrie Riemannscher Flächen und ihrer Modulräume.",
      },
      fa: {
        name: "مریم میرزاخانی",
        field: "ریاضیات",
        years: "۱۹۷۷–۲۰۱۷",
        biography:
          "مریم میرزاخانی ریاضیدانی بود که نگاه ما به هندسه را دگرگون کرد. او در تهران زاده شد، در المپیاد جهانی ریاضی مدال طلا گرفت، در هاروارد دکتری گرفت و استاد دانشگاه استنفورد شد. در سال ۲۰۱۴ نخستین زنی بود که مدال فیلدز را، برای پژوهش‌هایش دربارهٔ دینامیک و هندسهٔ رویه‌های ریمانی و فضاهای مدول آن‌ها، دریافت کرد.",
      },
    },
  },
  {
    id: "kiarostami",
    image: "/images/figures/kiarostami.jpg",
    placement: portraitPlacement("kiarostami", "foyerEast", 11),
    copy: {
      en: {
        name: "Abbas Kiarostami",
        field: "Cinema",
        years: "1940–2016",
        biography:
          "Abbas Kiarostami was a filmmaker, photographer, and poet, and a central figure of modern Iranian cinema. At the Kanoon institute he made Where Is the Friend's House?, Close-Up, and Taste of Cherry, which won the Palme d'Or in 1997. His films sit between fiction and documentary and trust the viewer to complete what the camera leaves open.",
      },
      de: {
        name: "Abbas Kiarostami",
        field: "Film",
        years: "1940–2016",
        biography:
          "Abbas Kiarostami war Filmemacher, Fotograf und Dichter und eine zentrale Figur des modernen iranischen Kinos. Am Institut Kanoon entstanden Wo ist das Haus meines Freundes?, Close-Up und Der Geschmack der Kirsche, der 1997 die Goldene Palme gewann. Seine Filme stehen zwischen Fiktion und Dokument und überlassen dem Publikum, was die Kamera offenlässt.",
      },
      fa: {
        name: "عباس کیارستمی",
        field: "سینما",
        years: "۱۹۴۰–۲۰۱۶",
        biography:
          "عباس کیارستمی فیلم‌ساز، عکاس و شاعر و از چهره‌های اصلی سینمای مدرن ایران بود. در کانون پرورش فکری فیلم‌هایی چون «خانهٔ دوست کجاست؟»، «کلوزآپ» و «طعم گیلاس» را ساخت که در سال ۱۹۹۷ نخل طلای کن را برد. آثار او میان داستان و مستند می‌ایستند و کامل کردن آنچه دوربین باز می‌گذارد را به تماشاگر می‌سپارند.",
      },
    },
  },
  {
    id: "shajarian",
    image: "/images/figures/shajarian.jpg",
    placement: portraitPlacement("shajarian", "galleryFarLeft", 19),
    copy: {
      en: {
        name: "Mohammad-Reza Shajarian",
        field: "Classical music",
        years: "1940–2020",
        biography:
          "Mohammad-Reza Shajarian was a master of Persian classical song. His voice carried the radif, the canonical repertoire of Iranian music, with a clarity and emotional range that made him a reference for singers everywhere. Over decades of concerts and recordings, including with Parviz Meshkatian, he kept the avaz tradition both rigorous and alive.",
      },
      de: {
        name: "Mohammad-Reza Shajarian",
        field: "Klassische Musik",
        years: "1940–2020",
        biography:
          "Mohammad-Reza Shajarian war ein Meister des persischen klassischen Gesangs. Seine Stimme trug den Radif, den überlieferten Kanon der iranischen Musik, mit einer Klarheit und Gefühlstiefe, die ihn zur Referenz für Sängerinnen und Sänger machte. In jahrzehntelangen Konzerten und Aufnahmen, unter anderem mit Parviz Meshkatian, hielt er die Tradition des Avaz zugleich streng und lebendig.",
      },
      fa: {
        name: "محمدرضا شجریان",
        field: "موسیقی کلاسیک",
        years: "۱۹۴۰–۲۰۲۰",
        biography:
          "محمدرضا شجریان استاد آواز کلاسیک ایرانی بود. صدای او ردیف، گنجینهٔ دستگاهی موسیقی ایران، را با روشنی و گستره‌ای عاطفی خواند که برای خوانندگان مرجع شد. در دهه‌ها کنسرت و ضبط، از جمله با پرویز مشکاتیان، سنت آواز را هم دقیق و هم زنده نگه داشت.",
      },
    },
  },
  {
    id: "ansari",
    image: "/images/figures/ansari.jpg",
    placement: portraitPlacement("ansari", "galleryFarRight", 27),
    copy: {
      en: {
        name: "Anousheh Ansari",
        field: "Spaceflight",
        years: "Born 1966",
        biography:
          "Anousheh Ansari is an engineer and entrepreneur. She co-founded the telecommunications company that became Prodea Systems and was the title sponsor of the Ansari X Prize for private spaceflight. In 2006 she flew aboard Soyuz TMA-9 to the International Space Station, the first Iranian woman in space and the first woman to make that journey with her own means.",
      },
      de: {
        name: "Anousheh Ansari",
        field: "Raumfahrt",
        years: "Geboren 1966",
        biography:
          "Anousheh Ansari ist Ingenieurin und Unternehmerin. Sie war Mitgründerin des Telekommunikationsunternehmens, aus dem Prodea Systems wurde, und Namensgeberin des Ansari X Prize für private Raumfahrt. 2006 flog sie mit Sojus TMA-9 zur Internationalen Raumstation, als erste Iranerin im All und als erste Frau, die diese Reise aus eigenen Mitteln antrat.",
      },
      fa: {
        name: "انوشه انصاری",
        field: "فضانوردی",
        years: "زادهٔ ۱۹۶۶",
        biography:
          "انوشه انصاری مهندس و کارآفرین است. او از بنیان‌گذاران شرکت مخابراتی‌ای بود که بعدها پرودیا سیستمز نام گرفت و حامی جایزهٔ ایکس انصاری برای پرواز خصوصی به فضا شد. در سال ۲۰۰۶ با سایوز تی‌ام‌ای-۹ به ایستگاه فضایی بین‌المللی رفت و نخستین زن ایرانی در فضا و نخستین زنی شد که این سفر را با هزینهٔ شخصی انجام داد.",
      },
    },
  },
  {
    id: "samii",
    image: "/images/figures/samii.jpg",
    placement: portraitPlacement("samii", "galleryEastBetween", 35),
    copy: {
      en: {
        name: "Majid Samii",
        field: "Neurosurgery",
        years: "Born 1937",
        biography:
          "Majid Samii is a neurosurgeon and a founder of modern skull-base surgery. Born in Tehran and trained in Germany, he established the International Neuroscience Institute in Hanover and served as president of the World Federation of Neurosurgical Societies. Generations of surgeons have learned his approaches to the most delicate operations at the base of the skull.",
      },
      de: {
        name: "Majid Samii",
        field: "Neurochirurgie",
        years: "Geboren 1937",
        biography:
          "Majid Samii ist Neurochirurg und ein Begründer der modernen Schädelbasischirurgie. In Teheran geboren und in Deutschland ausgebildet, gründete er das Internationale Neurowissenschaftliche Institut in Hannover und war Präsident der World Federation of Neurosurgical Societies. Generationen von Chirurgen haben bei ihm Zugänge zu den heikelsten Operationen an der Schädelbasis gelernt.",
      },
      fa: {
        name: "مجید سمیعی",
        field: "جراحی مغز و اعصاب",
        years: "زادهٔ ۱۹۳۷",
        biography:
          "مجید سمیعی جراح مغز و اعصاب و از بنیان‌گذاران جراحی مدرن قاعدهٔ جمجمه است. او در تهران زاده شد، در آلمان آموزش دید، مؤسسهٔ بین‌المللی علوم اعصاب را در هانوفر بنا کرد و رئیس فدراسیون جهانی انجمن‌های جراحی مغز و اعصاب بود. نسل‌هایی از جراحان شیوه‌های او را برای ظریف‌ترین عمل‌ها در قاعدهٔ جمجمه آموخته‌اند.",
      },
    },
  },
  {
    id: "sadr",
    image: "/images/figures/sadr.jpg",
    placement: portraitPlacement("sadr", "foyerWestDoor", 43),
    copy: {
      en: {
        name: "Behjat Sadr",
        field: "Painting",
        years: "1924–2009",
        biography:
          "Behjat Sadr was a painter of modern Iran. She studied in Rome, taught at the University of Tehran, and became known for large abstract canvases built with a palette knife: dark, sweeping forms that suggest both landscape and machinery. From the 1980s she lived and worked between Tehran and Paris, and her paintings belong to the important holdings of modern Iranian art.",
      },
      de: {
        name: "Behjat Sadr",
        field: "Malerei",
        years: "1924–2009",
        biography:
          "Behjat Sadr war eine Malerin der iranischen Moderne. Sie studierte in Rom, lehrte an der Universität Teheran und wurde bekannt für große abstrakte Bilder, die sie mit dem Spachtel aufbaute: dunkle, schwingende Formen zwischen Landschaft und Maschine. Ab den 1980er-Jahren lebte und arbeitete sie zwischen Teheran und Paris. Ihre Bilder gehören zu den wichtigen Beständen der modernen iranischen Malerei.",
      },
      fa: {
        name: "بهجت صدر",
        field: "نقاشی",
        years: "۱۹۲۴–۲۰۰۹",
        biography:
          "بهجت صدر از نقاشان مدرنیسم ایران بود. در رم درس خواند، در دانشگاه تهران تدریس کرد و با بوم‌های بزرگ انتزاعی شناخته شد که آن‌ها را با کاردک می‌ساخت: شکل‌های تیره و پرتابی که هم به منظره می‌مانند و هم به ماشین. از دههٔ ۱۳۶۰ میان تهران و پاریس زیست و کار کرد و آثارش در مجموعه‌های مهم نقاشی مدرن ایران نگهداری می‌شود.",
      },
    },
  },
  {
    id: "farhadi",
    image: "/images/figures/farhadi.jpg",
    placement: portraitPlacement("farhadi", "foyerEastDoor", 51),
    copy: {
      en: {
        name: "Asghar Farhadi",
        field: "Cinema",
        years: "Born 1972",
        biography:
          "Asghar Farhadi is a filmmaker and screenwriter whose dramas turn on moral choices in everyday Iranian life. A Separation (2011) and The Salesman (2016) each won the Academy Award for Best International Feature Film. About Elly and A Hero continue that close attention to truth, class, and responsibility, and to what people leave unsaid.",
      },
      de: {
        name: "Asghar Farhadi",
        field: "Film",
        years: "Geboren 1972",
        biography:
          "Asghar Farhadi ist Filmemacher und Drehbuchautor. Seine Dramen kreisen um moralische Entscheidungen im alltäglichen Leben im Iran. Eine Trennung (2011) und The Salesman (2016) gewannen jeweils den Oscar für den besten internationalen Film. About Elly und A Hero führen diesen genauen Blick auf Wahrheit, Klasse und Verantwortung weiter.",
      },
      fa: {
        name: "اصغر فرهادی",
        field: "سینما",
        years: "زادهٔ ۱۹۷۲",
        biography:
          "اصغر فرهادی فیلم‌ساز و فیلمنامه‌نویس است و درام‌هایش بر انتخاب‌های اخلاقی در زندگی روزمرهٔ ایران می‌چرخند. «جدایی نادر از سیمین» (۲۰۱۱) و «فروشنده» (۲۰۱۶) هر کدام اسکار بهترین فیلم بین‌المللی را بردند. «دربارهٔ الی» و «قهرمان» همان دقت را در حقیقت، طبقه و مسئولیت ادامه دادند.",
      },
    },
  },
  {
    id: "farmanfarmaian",
    image: "/images/figures/farmanfarmaian.jpg",
    placement: portraitPlacement("farmanfarmaian", "galleryEastFar", 59),
    copy: {
      en: {
        name: "Monir Shahroudy Farmanfarmaian",
        field: "Visual art",
        years: "1922–2019",
        biography:
          "Monir Shahroudy Farmanfarmaian spent a lifetime joining Iranian mirror mosaic, aineh-kari, to the language of modern abstraction. After years in New York she returned to the geometries of shrine interiors and remade them as mirrored sculptures and reliefs. Museums, including the Guggenheim, have given retrospectives to a body of work that treats reflection itself as a material.",
      },
      de: {
        name: "Monir Shahroudy Farmanfarmaian",
        field: "Bildende Kunst",
        years: "1922–2019",
        biography:
          "Monir Shahroudy Farmanfarmaian verband ein Leben lang das iranische Spiegelmosaik, Aineh-Kari, mit der Sprache der modernen Abstraktion. Nach Jahren in New York kehrte sie zu den Geometrien der Schreininnenräume zurück und formte sie zu verspiegelten Skulpturen und Reliefs. Museen, darunter das Guggenheim, widmeten einem Werk Retrospektiven, das den Spiegel selbst zum Material macht.",
      },
      fa: {
        name: "منیر شاهرودی فرمانفرماییان",
        field: "هنرهای تجسمی",
        years: "۱۹۲۲–۲۰۱۹",
        biography:
          "منیر شاهرودی فرمانفرماییان عمری آیینه‌کاری ایرانی را با زبان انتزاع مدرن به هم دوخت. پس از سال‌ها در نیویورک به هندسهٔ درون بقعه‌ها بازگشت و آن را به مجسمه‌ها و نقش‌برجسته‌های آیینه‌ای بدل کرد. موزه‌ها، از جمله گوگنهایم، به مجموعه‌ای مرور کردند که خود بازتاب را مادهٔ کار می‌داند.",
      },
    },
  },
];

/** Placements for the picture lights. One lamp per portrait. */
export const figurePlacements: readonly ArtworkPlacement[] = figures.map(
  (figure) => figure.placement,
);
