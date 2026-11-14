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
};

type LandmarkSeed = {
  id: string;
  slot: LandmarkSlotName;
  seed: number;
  credit: string;
  copy: Record<Locale, LandmarkCopy>;
};

const LANDMARKS: readonly LandmarkSeed[] = [
  {
    id: "naqsh",
    slot: "wingFarEast",
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
    credit: "Diego Delso, CC BY-SA 4.0",
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
    id: "badab",
    slot: "wingWest",
    seed: 121,
    credit: "Amir Ali Razzaghi, CC BY 4.0",
    copy: {
      en: {
        title: "Badab-e Surt",
        place: "Mazandaran",
        description:
          "Badab-e Surt is a pair of stepped travertine springs in the mountains of Mazandaran. Mineral water has laid down orange and white terraces over thousands of years, one spring salty and one sour. The site is a natural formation, not a building, and it is protected for that geology.",
      },
      de: {
        title: "Badab-e Surt",
        place: "Mazandaran",
        description:
          "Badab-e Surt ist ein Paar gestufter Travertinquellen in den Bergen von Mazandaran. Mineralwasser hat über Jahrtausende orange und weiße Terrassen abgelagert, eine Quelle salzig, die andere sauer. Der Ort ist eine natürliche Bildung, kein Bau, und steht wegen dieser Geologie unter Schutz.",
      },
      fa: {
        title: "باداب سورت",
        place: "مازندران",
        description:
          "باداب سورت یک جفت چشمهٔ پلکانی تراورتن در کوه‌های مازندران است. آب معدنی در هزاران سال تراس‌های نارنجی و سفید را نشانده است؛ یک چشمه شور و دیگری ترش. این جا سازه‌ای ساختهٔ انسان نیست و برای همین زمین‌شناسی حفاظت می‌شود.",
      },
    },
  },
  {
    id: "lut",
    slot: "galleryWest",
    seed: 133,
    credit: "Ninara, CC BY 2.0",
    copy: {
      en: {
        title: "Lut Desert",
        place: "Kerman, Sistan and Baluchestan, South Khorasan",
        description:
          "The Lut Desert, Dasht-e Lut, covers a vast basin in southeastern Iran. Wind has carved the yardangs, long ridges of clay and sand, and the surface has recorded some of the highest ground temperatures measured on Earth. UNESCO inscribed the desert in 2016 for that extreme landscape.",
      },
      de: {
        title: "Lut-Wüste",
        place: "Kerman, Sistan und Belutschistan, Süd-Chorasan",
        description:
          "Die Lut-Wüste, Dascht-e Lut, bedeckt ein weites Becken im Südosten Irans. Wind hat die Yardangs geschnitten, lange Rücken aus Ton und Sand, und die Oberfläche hat einige der höchsten am Boden gemessenen Temperaturen der Erde verzeichnet. Die UNESCO nahm die Wüste 2016 wegen dieser extremen Landschaft auf.",
      },
      fa: {
        title: "دشت لوت",
        place: "کرمان، سیستان و بلوچستان، خراسان جنوبی",
        description:
          "دشت لوت حوضهٔ گسترده‌ای در جنوب شرقی ایران است. باد کلوت‌ها را تراشیده، پشته‌های بلند از رس و ماسه، و سطح آن برخی از بالاترین دمای اندازه‌گیری‌شده روی زمین را ثبت کرده است. یونسکو این بیابان را در سال ۲۰۱۶ برای همین چشم‌اندازِ حدی ثبت کرد.",
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
}));

/** Placements for the picture lights. One lamp per landmark. */
export const landmarkPlacements: readonly ArtworkPlacement[] = landmarks.map((item) => item.placement);
