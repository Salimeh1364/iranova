import type { Locale } from "@/i18n/types";
import type { ArtworkPlacement } from "@/lib/types";
import { landmarkPlacement, type LandmarkSlotName } from "@/scene/landmarkLayout";

/** One language of a landmark label and a short description. */
export type LandmarkCopy = {
  title: string;
  place: string;
  description: string;
};

/**
 * A landscape photograph in the west wing.
 * `image` is a file in `public/images/landmarks/`.
 * `credit` names the photographer and the Commons license.
 */
export type IranLandmark = {
  id: string;
  image: string;
  credit: string;
  placement: ArtworkPlacement;
  copy: Record<Locale, LandmarkCopy>;
  /**
   * Vertical crop for a tall photograph in the wide frame.
   * 0 keeps the top, 1 the bottom. Omitted means a centered crop.
   */
  coverBias?: number;
};

type LandmarkSeed = {
  id: string;
  slot: LandmarkSlotName;
  seed: number;
  credit: string;
  copy: Record<Locale, LandmarkCopy>;
  coverBias?: number;
};

const LANDMARKS: readonly LandmarkSeed[] = [
  {
    id: "naqsh",
    slot: "wingWestNorth",
    seed: 71,
    credit: "Amir Pashaei, CC BY-SA 4.0",
    copy: {
      en: {
        title: "Naqsh-e Jahan Square",
        place: "Isfahan",
        description:
          "Naqsh-e Jahan, the Image of the World, is the great royal square of Isfahan. Shah Abbas I laid it out from 1598 as the center of his capital: a vast rectangle framed by the Imam Mosque, the Sheikh Lotfollah Mosque, the Ali Qapu palace, and the Qeysariyeh bazaar. It remains one of the largest city squares ever built.",
      },
      de: {
        title: "Naqsh-e-Jahan-Platz",
        place: "Isfahan",
        description:
          "Naqsh-e Jahan, das Abbild der Welt, ist der große königliche Platz von Isfahan. Schah Abbas I. ließ ihn ab 1598 als Mittelpunkt seiner Hauptstadt anlegen: ein weites Rechteck, gefasst von der Imam-Moschee, der Scheich-Lotfollah-Moschee, dem Palast Ali Qapu und dem Basar Qeysariyeh. Er gehört zu den größten Stadtplätzen, die je gebaut wurden.",
      },
      fa: {
        title: "میدان نقش جهان",
        place: "اصفهان",
        description:
          "نقش جهان، میدان شاهی اصفهان است. شاه عباس یکم آن را از سال ۱۵۹۸ به عنوان مرکز پایتخت خود طرح کرد: مستطیلی گسترده با مسجد امام، مسجد شیخ لطف‌الله، کاخ عالی‌قاپو و بازار قیصریه. این میدان هنوز از بزرگ‌ترین میدان‌های شهری ساخته‌شده در جهان است.",
      },
    },
  },
  {
    id: "persepolis",
    slot: "wingFarWest",
    seed: 83,
    // The standing columns of the Apadana, seen across the terrace.
    credit: "Carole Raddato, CC BY-SA 2.0",
    copy: {
      en: {
        title: "Persepolis",
        place: "Marvdasht, Fars",
        description:
          "Persepolis, called Takht-e Jamshid in Persian, was a ceremonial capital of the Achaemenid empire. Darius I began the terrace around 518 BCE, and his successors raised the palaces, stairways, and the reliefs of delegations bringing tribute. Alexander’s army burned the complex in 330 BCE. The stone processions are still among the clearest pictures of that court.",
      },
      de: {
        title: "Persepolis",
        place: "Marvdasht, Fars",
        description:
          "Persepolis, auf Persisch Tacht-e Dschamschid, war eine zeremonielle Hauptstadt des Achämenidenreichs. Dareios I. begann die Terrasse um 518 v. Chr., seine Nachfolger errichteten Paläste, Treppen und die Reliefs der Gesandtschaften mit ihren Gaben. Das Heer Alexanders brannte die Anlage 330 v. Chr. nieder. Die steinernen Züge gehören noch immer zu den deutlichsten Bildern dieses Hofes.",
      },
      fa: {
        title: "تخت جمشید",
        place: "مرودشت، فارس",
        description:
          "تخت جمشید یکی از پایتخت‌های آیینی هخامنشیان بود. داریوش یکم تراس را حدود سال ۵۱۸ پیش از میلاد آغاز کرد و جانشینانش کاخ‌ها، پلکان‌ها و نقش‌برجسته‌های هیئت‌های خراج‌گزار را برپا کردند. سپاه اسکندر در سال ۳۳۰ پیش از میلاد مجموعه را سوزاند. ردیف‌های سنگی هنوز از روشن‌ترین تصویرهای آن دربارند.",
      },
    },
  },
  {
    id: "nasir",
    slot: "wingNearWest",
    seed: 97,
    credit: "MohammadReza Domiri Ganji, CC BY-SA 4.0",
    copy: {
      en: {
        title: "Nasir al-Mulk Mosque",
        place: "Shiraz",
        description:
          "The Nasir al-Mulk Mosque in Shiraz was built between 1876 and 1888, in the Qajar period. Its winter prayer hall is famous for stained glass that throws rose, blue, and gold light across the carpet at morning. The tiles and the painted muqarnas belong to the same late-Qajar taste for dense color.",
      },
      de: {
        title: "Nasir-al-Mulk-Moschee",
        place: "Schiras",
        description:
          "Die Nasir-al-Mulk-Moschee in Schiras entstand zwischen 1876 und 1888, in der Kadscharenzeit. Ihr Wintergebetssaal ist berühmt für Farbglas, das am Morgen rosa, blaues und goldenes Licht über den Teppich wirft. Die Fliesen und die bemalten Muqarnas gehören zu demselben späten kadscharischen Sinn für dichte Farbe.",
      },
      fa: {
        title: "مسجد نصیرالملک",
        place: "شیراز",
        description:
          "مسجد نصیرالملک شیراز میان سال‌های ۱۸۷۶ و ۱۸۸۸، در دورهٔ قاجار، ساخته شد. شبستان زمستانی‌اش برای شیشه‌های رنگی شناخته می‌شود که صبح‌ها نور صورتی، آبی و طلایی را روی فرش می‌اندازند. کاشی‌ها و مقرنس‌های رنگین از همان ذوق قاجاری برای رنگ انبوه می‌آیند.",
      },
    },
  },
  {
    id: "azadi",
    slot: "wingNearEast",
    seed: 109,
    credit: "Bahador Hayzadeh, CC BY-SA 4.0",
    copy: {
      en: {
        title: "Azadi Tower",
        place: "Tehran",
        description:
          "The Azadi Tower stands at the western gate of Tehran. Hossein Amanat designed it for the 1971 celebrations of 2,500 years of the Persian empire. The arch joins a Sasanian vault with an Islamic pointed arch, and the marble skin is cut from stone brought from Isfahan. It has since become the city’s most familiar monument.",
      },
      de: {
        title: "Azadi-Turm",
        place: "Teheran",
        description:
          "Der Azadi-Turm steht am westlichen Tor Teherans. Hossein Amanat entwarf ihn für die Feiern von 1971 zu 2500 Jahren des Perserreichs. Der Bogen verbindet ein sasanidisches Gewölbe mit einem islamischen Spitzbogen, und die Marmorhaut ist aus Stein aus Isfahan geschnitten. Seither ist er das vertrauteste Denkmal der Stadt.",
      },
      fa: {
        title: "برج آزادی",
        place: "تهران",
        description:
          "برج آزادی در دروازهٔ غربی تهران ایستاده است. حسین امانت آن را برای جشن‌های ۱۳۵۰، به مناسبت دو هزار و پانصدمین سال شاهنشاهی ایران، طراحی کرد. طاق، طاقی ساسانی را با قوس تیزه‌دار اسلامی به هم می‌رساند و پوست مرمر از سنگ اصفهان تراشیده شده است. از آن زمان آشناترین بنای شهر شده است.",
      },
    },
  },
  {
    id: "monarjonban",
    slot: "wingWestCenter",
    seed: 147,
    credit: "Ahmad Masoominezhad, CC BY-SA 4.0",
    copy: {
      en: {
        title: "Monar Jonban",
        place: "Isfahan",
        description:
          "Monar Jonban, the Shaking Minarets, stands west of Isfahan over the tomb of the Sufi Amu Abdullah, who died in 1316. The porch is Ilkhanid brick. Two minarets were added in the Safavid period, and they are bonded into that one light structure: when a guide sets one minaret swaying, the other moves with it.",
      },
      de: {
        title: "Monar Jonban",
        place: "Isfahan",
        description:
          "Monar Jonban, die wackelnden Minarette, steht westlich von Isfahan über dem Grab des Sufis Amu Abdullah, der 1316 starb. Die Vorhalle ist ilkhanidisches Ziegelwerk. Zwei Minarette kamen in der Safawidenzeit hinzu und sind in dieses eine leichte Gefüge eingebunden: setzt ein Führer ein Minarett in Schwingung, bewegt sich das andere mit.",
      },
      fa: {
        title: "منارجنبان",
        place: "اصفهان",
        description:
          "منارجنبان در غرب اصفهان بر آرامگاه عمو عبدالله، عارف ایلخانی که در سال ۱۳۱۶ میلادی درگذشت، ایستاده است. ایوان از آجر دورهٔ ایلخانی است. دو مناره در دورهٔ صفوی به آن افزوده شد و در همین سازهٔ سبک به هم پیوسته‌اند: وقتی راهنما یکی را می‌لرزاند، دیگری هم با آن تکان می‌خورد.",
      },
    },
  },
  {
    // South end of the west wall, the same hang the bridge used.
    id: "sheikhbahai",
    slot: "wingWest",
    seed: 151,
    credit: "Mrezazadehkhadem, CC BY-SA 4.0",
    // The entrance photograph is tall. A higher bias keeps the tiled panel in the wide opening.
    coverBias: 0.68,
    copy: {
      en: {
        title: "Sheikh Bahai Bathhouse",
        place: "Isfahan",
        description:
          "Sheikh Bahai Bathhouse stands in Isfahan and is tied to Sheikh Bahai, the Safavid polymath at the court of Shah Abbas. Its fame is an architectural legend: a single candle, set beneath the water reservoir, was said to heat the whole bath. In a later repair the chamber was opened, the flame went out, and the secret of that candle was lost.",
      },
      de: {
        title: "Scheich-Bahai-Badehaus",
        place: "Isfahan",
        description:
          "Das Scheich-Bahai-Badehaus steht in Isfahan und wird mit Scheich Bahai verbunden, dem Universalgelehrten der Safawiden am Hof Schah Abbas’. Berühmt ist eine Baulegende: eine einzige Kerze unter dem Wasserbecken soll das ganze Bad gewärmt haben. Bei einer späteren Reparatur wurde die Kammer geöffnet, die Flamme erlosch, und das Geheimnis dieser Kerze ging verloren.",
      },
      fa: {
        title: "حمام شیخ بهایی",
        place: "اصفهان",
        description:
          "حمام شیخ بهایی در اصفهان به شیخ بهایی، علامهٔ عصر صفوی و از نزدیکان شاه عباس، نسبت دارد. شهرت بنا در این افسانه است که یک شمع، زیر مخزن آب، گرمای همهٔ حمام را تأمین می‌کرد. در تعمیری بعدی آن اتاقک را گشودند، شعله خاموش شد و راز شمع از میان رفت.",
      },
    },
  },
  {
    id: "pasargadae",
    slot: "wingFarEast",
    seed: 133,
    credit: "Diego Delso, CC BY-SA 4.0",
    copy: {
      en: {
        title: "Tomb of Cyrus",
        place: "Pasargadae, Fars",
        description:
          "The Tomb of Cyrus stands at Pasargadae, the first capital of the Achaemenid empire, on the plain of Fars. Cyrus the Great was buried here in the sixth century BCE. A chamber of pale stone sits on a stepped plinth, and the ground around it holds the remains of palaces and gardens, now a UNESCO World Heritage site.",
      },
      de: {
        title: "Grabmal von Kyros",
        place: "Pasargadae, Fars",
        description:
          "Das Grabmal von Kyros steht in Pasargadae, der ersten Hauptstadt des Achämenidenreichs, in der Ebene von Fars. Kyros der Große wurde hier im sechsten Jahrhundert vor unserer Zeit bestattet. Eine Kammer aus hellem Stein ruht auf einem gestuften Sockel, und ringsum liegen die Reste von Palästen und Gärten, heute ein UNESCO-Welterbe.",
      },
      fa: {
        title: "آرامگاه کوروش",
        place: "پاسارگاد، فارس",
        description:
          "آرامگاه کوروش در پاسارگاد است، نخستین پایتخت هخامنشیان، در دشت فارس. کوروش بزرگ در سدهٔ ششم پیش از میلاد اینجا به خاک سپرده شد. اتاقکی از سنگ روشن بر سکویی پلکانی نشسته و پیرامونش بازماندهٔ کاخ‌ها و باغ‌هاست که امروز در فهرست میراث جهانی یونسکو است.",
      },
    },
  },
];

export const landmarks: readonly IranLandmark[] = LANDMARKS.map((item) => ({
  id: item.id,
  image: `/images/landmarks/${item.id}.jpg`,
  credit: item.credit,
  placement: landmarkPlacement(item.id, item.slot, item.seed),
  copy: item.copy,
  coverBias: item.coverBias,
}));

/** Placements for the picture lights. One lamp per landmark. */
export const landmarkPlacements: readonly ArtworkPlacement[] = landmarks.map((item) => item.placement);
