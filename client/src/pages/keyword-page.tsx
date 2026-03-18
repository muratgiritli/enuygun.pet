import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Phone, MapPin, Clock, Navigation, ChevronRight, Home, ArrowLeft } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NotFound from "@/pages/not-found";

const PHONE = "+905422114944";
const WHATSAPP_URL = `https://wa.me/905422114944`;
const MAPS_URL = "https://www.google.com/maps?cid=1443692801456575727";
const ADDRESS = "Atatürk Bulvarı, Atakum / Samsun";

const STORE_IMAGES = {
  general: "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg",
  reyonlar: "https://static.wixstatic.com/media/63853e_f5ae600f104c4dfcae521fe694ba017b~mv2.jpeg",
  kedi: "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
  kopek: "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
  kus: "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
};

function pickImage(keyword: string) {
  const k = keyword.toLowerCase();
  if (k.includes("kuş") || k.includes("kus") || k.includes("papağan") || k.includes("kanarya") || k.includes("muhabbet")) return STORE_IMAGES.kus;
  if (k.includes("köpek") || k.includes("kopek")) return STORE_IMAGES.kopek;
  if (k.includes("kedi")) return STORE_IMAGES.kedi;
  return STORE_IMAGES.general;
}

interface KeywordData {
  keyword: string;
  slug: string;
  related: Array<{ keyword: string; slug: string }>;
}

function generateContent(keyword: string) {
  const kw = keyword.toLowerCase();
  const isKediMama = kw.includes("kedi") && kw.includes("mama");
  const isKopekMama = kw.includes("köpek") && kw.includes("mama") || kw.includes("kopek") && kw.includes("mama");
  const isKediKumu = kw.includes("kedi") && kw.includes("kum");
  const isTasma = kw.includes("tasma") || kw.includes("taşma") || kw.includes("kolye") || kw.includes("boyunluk");
  const isKusYemi = kw.includes("kuş") || kw.includes("kus") || kw.includes("muhabbet") || kw.includes("papağan") || kw.includes("kanarya");
  const isMarka = ["royal canin", "hills", "pro plan", "proplan", "brit", "reflex", "enjoy", "acana", "orijen", "purina", "felix", "whiskas", "pedigree"].some(m => kw.includes(m));
  const isPetshop = kw.includes("petshop") || kw.includes("pet shop") || kw.includes("pet market");
  const isOyuncak = kw.includes("oyuncak");
  const isTuvalet = kw.includes("tuvalet");
  const isYatak = kw.includes("yatak");

  let article = "";
  let faqs: Array<{ q: string; a: string }> = [];

  if (isKediMama) {
    article = `Samsun Atakum'da ${keyword} arıyorsanız doğru adrestesiniz. EnuygunPet Gross Market olarak Türkiye'nin önde gelen markalarının kedi mamalarını en uygun fiyatlarla sunuyoruz. Mağazamızda yüzlerce farklı kedi maması seçeneği bulunmakta olup Atakum bölgesinin en geniş petshop ürün yelpazesinizi sunmaktayız.

${keyword} için mağazamızı tercih eden müşterilerimize ücretsiz danışmanlık hizmeti de sunuyoruz. Kedinizin yaşına, ırkına ve sağlık durumuna göre en uygun mamayı bulmanıza yardımcı olan uzman ekibimiz her gün 09:00-21:00 saatleri arasında hizmetinizdedir.

Samsun'da kedi maması satın almak için en güvenilir adres EnuygunPet'tir. ${keyword} dahil tüm premium ve ekonomik kedi maması markalarını stokta bulunduruyoruz. Toplu alımlarda özel fiyat avantajlarımızdan yararlanabilirsiniz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nereden alınır?`, a: `Samsun Atakum'daki EnuygunPet Gross Market mağazamızda ${keyword} ürününü stokta bulabilirsiniz. Haftanın her günü 09:00-21:00 saatleri arasında hizmetinizdeyiz. WhatsApp üzerinden ürün sorgulaması da yapabilirsiniz.` },
      { q: `${keyword} fiyatı ne kadar?`, a: `${keyword} fiyatları markaya ve gramaja göre değişmektedir. En güncel fiyat bilgisi için mağazamızı arayabilir veya WhatsApp'tan bilgi alabilirsiniz. Gross market avantajımızla rakipsiz fiyatlar sunuyoruz.` },
      { q: `${keyword} için hangi marka daha iyi?`, a: `Kedinizin ihtiyacına göre Royal Canin, Hills Science Plan, Pro Plan, Brit Care ve Reflex başta olmak üzere pek çok kaliteli marka arasından seçim yapabilirsiniz. Uzman ekibimiz ücretsiz öneri sunar.` },
      { q: `Atakum'da kedi maması kapıda teslim var mı?`, a: `EnuygunPet olarak şu an online satış yapmamaktayız. Ancak mağazamızı ziyaret ederek veya WhatsApp üzerinden sipariş oluşturarak ürünlerinizi hazır bulabilirsiniz.` },
    ];
  } else if (isKopekMama) {
    article = `Samsun Atakum'da ${keyword} arayanlar için EnuygunPet Gross Market geniş stoku ve uygun fiyatlarıyla hizmet vermektedir. Köpeğinizin sağlıklı beslenmesi için en kaliteli markaların ürünlerini bir arada bulabileceğiniz tek adresiz.

${keyword} için Samsun'un en büyük petshop gross marketi olan mağazamızı tercih eden müşterilerimize ücretsiz beslenme danışmanlığı sunuyoruz. Köpeğinizin ırkına, yaşına ve ağırlığına göre en doğru mamayı seçmenize yardımcı oluyoruz.

Atakum'da haftanın her günü 09:00-21:00 saatleri arasında kapımız açık. ${keyword} ve daha pek çok köpek ürününü mağazamızda bulabilirsiniz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede satılır?`, a: `Samsun Atakum'daki EnuygunPet mağazamızda ${keyword} ürününü bulabilirsiniz. Geniş stokumuzu görmek için bizi arayabilir ya da mağazaya gelebilirsiniz.` },
      { q: `${keyword} hangi yaşa uygun?`, a: `Ürünün ambalajındaki öneriye göre değişmektedir. Yavru, yetişkin veya yaşlı köpek mamaları farklı beslenme ihtiyaçlarına göre formüle edilmiştir. Uzman ekibimiz size öneride bulunabilir.` },
      { q: `${keyword} yerine ne kullanılır?`, a: `Benzer kalite ve fiyat aralığında alternatifler mevcuttur. Mağazamızda Pro Plan, Royal Canin, Brit, Reflex, Enjoy gibi pek çok marka ürünü karşılaştırarak en uygununu seçebilirsiniz.` },
      { q: `Toplu köpek maması alımında indirim var mı?`, a: `EnuygunPet Gross Market olarak toplu alımlarda özel indirim sunuyoruz. Detaylar için WhatsApp veya telefon ile iletişime geçebilirsiniz.` },
    ];
  } else if (isKediKumu) {
    article = `Samsun Atakum'da ${keyword} arayanlar için EnuygunPet Gross Market en geniş kedi kumu seçeneklerini sunar. Bentonit, tofu, çam peleti, karbonlu ve silika jel gibi her türlü kedi kumu çeşidini mağazamızda bulabilirsiniz.

${keyword} tercihinde hijyen, koku kontrolü ve fiyat/performans oranı en önemli kriterlerdir. Uzman ekibimiz kedinizin alışkanlıklarına göre en uygun kumu bulmanıza yardımcı olur.

Samsun Atakum'da kedi kumu alışverişi için haftanın her günü 09:00-21:00 saatleri arasında açığız. Toplu alımlarda avantajlı fiyatlardan yararlanabilirsiniz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede satılır?`, a: `EnuygunPet Gross Market'te ${keyword} dahil tüm kedi kumu çeşitlerini bulabilirsiniz. Samsun Atakum'da haftanın her günü hizmetinizdeyiz.` },
      { q: `${keyword} ne kadar süre kullanılır?`, a: `Kedi sayısına ve kullanım sıklığına bağlı olarak genellikle 2-4 hafta arasında kullanılabilir. Düzenli temizlik koku kontrolünü kolaylaştırır.` },
      { q: `Karbonlu mu bentonit kedi kumu mu daha iyi?`, a: `Her ikisinin de avantajları vardır. Bentonit topaklanma özelliğiyle temizliği kolaylaştırır. Karbonlu kumlar koku emiciliğiyle öne çıkar. Mağazamızda her ikisini de deneyebilirsiniz.` },
      { q: `${keyword} fiyatı nedir?`, a: `Fiyat bilgisi için mağazamızı arayabilir veya WhatsApp'tan sorabilirsiniz. Gross market avantajıyla en uygun fiyatları sunuyoruz.` },
    ];
  } else if (isTasma) {
    article = `Samsun Atakum'da ${keyword} arayanlar için EnuygunPet Gross Market en geniş aksesuar koleksiyonunu sunmaktadır. Kedi ve köpek tasmaları, kolyeler, göğüs tasmaları ve daha pek çok aksesuar ürününü mağazamızda bulabilirsiniz.

${keyword} seçiminde hayvanınızın boyu, kilosu ve karakteri belirleyici rol oynar. Uzman ekibimiz doğru ürünü seçmenize yardımcı olmaktan memnuniyet duyar.

Atakum'da haftanın her günü 09:00-21:00 saatleri arasında hizmet veriyoruz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede satılır?`, a: `EnuygunPet Gross Market'te ${keyword} ve benzeri tüm aksesuar ürünlerini bulabilirsiniz. Samsun Atakum'da her gün açığız.` },
      { q: `${keyword} nasıl seçilir?`, a: `Hayvanınızın boyut ve ağırlığına uygun tasma seçimi önemlidir. Çok sıkı veya çok gevşek tasma rahatsızlık yaratabilir. Uzman ekibimiz ölçüm konusunda yardımcı olabilir.` },
      { q: `${keyword} hangi malzemeden olmalı?`, a: `Naylon, deri ve metal seçenekler mevcuttur. Deri daha estetik görünürken naylon tasma daha dayanıklıdır. Tercihinize göre mağazamızda geniş seçenek sunuyoruz.` },
      { q: `${keyword} fiyatı ne kadar?`, a: `Güncel fiyat için mağazamızı ziyaret edebilir veya WhatsApp'tan bilgi alabilirsiniz.` },
    ];
  } else if (isKusYemi) {
    article = `Samsun Atakum'da ${keyword} arayanlar EnuygunPet Gross Market'te geniş bir seçenek yelpazesi bulacak. Muhabbet kuşu, kanarya, papağan ve diğer tüm kuş türleri için yem, aksesuar ve kafes çeşitlerimiz mevcuttur.

${keyword} seçiminde kuşunuzun türü belirleyici faktördür. Her kuş türünün besin ihtiyacı farklıdır ve doğru beslenme sağlıklı bir yaşam için kritik önem taşır.

Samsun Atakum'da haftanın her günü 09:00-21:00 saatleri arasında açığız.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede bulunur?`, a: `EnuygunPet Gross Market'te ${keyword} dahil geniş kuş ürünleri yelpazesi bulunmaktadır. Her gün hizmetinizdeyiz.` },
      { q: `${keyword} ne kadar süre dayanır?`, a: `Saklama koşullarına göre değişmektedir. Kuru ve serin ortamda muhafaza edildiğinde ürünlerin raf ömrü uzar. Ambalajdaki tarihe dikkat ediniz.` },
      { q: `Kuşlar için hangi ek besinler gereklidir?`, a: `Temel yeme ek olarak mineral taşı, kuş kumu ve vitamin takviyeleri önerilir. Mağazamızda tüm bu ürünleri bulabilirsiniz.` },
      { q: `${keyword} fiyatı nedir?`, a: `Güncel fiyat için mağazamıza gelebilir veya WhatsApp'tan sorabilirsiniz.` },
    ];
  } else if (isPetshop) {
    article = `Samsun Atakum'da aradığınız petshop EnuygunPet Gross Market'tir. Türkiye'nin önde gelen petshop markalarından bağımsız olarak kendi bünyemizde en geniş ürün yelpazesini en uygun fiyatlarla sunuyoruz.

${keyword} aramasıyla bizi bulan siz değerli müşterilerimize kedi, köpek, kuş, balık ve diğer tüm evcil hayvan ürünlerini tek çatı altında sunma gururunu yaşıyoruz. Samsun Atakum'daki gross market formatımız sayesinde perakende fiyatların çok altında alışveriş yapabilirsiniz.

Haftanın her günü 09:00-21:00 saatleri arasında Atatürk Bulvarı Atakum adresimizde sizi bekliyoruz.`;
    faqs = [
      { q: `Samsun Atakum'da en iyi petshop hangisi?`, a: `EnuygunPet Gross Market, Samsun Atakum'un en geniş ürün yelpazesine sahip petshopudur. Binlerce evcil hayvan ürünü tek adreste.` },
      { q: `Atakum petshop çalışma saatleri nedir?`, a: `EnuygunPet Gross Market haftanın her günü 09:00-21:00 saatleri arasında açıktır.` },
      { q: `Atakum'da ucuz petshop var mı?`, a: `EnuygunPet Gross Market olarak gross market avantajımızla tüm Samsun'un en uygun fiyatlarını sunuyoruz. Perakende fiyatların çok altında alışveriş yapabilirsiniz.` },
      { q: `Samsun petshop adresi nedir?`, a: `Atatürk Bulvarı, Atakum / Samsun adresindeyiz. Google Harita'dan kolayca yol tarifi alabilirsiniz.` },
    ];
  } else if (isMarka) {
    article = `Samsun Atakum'da ${keyword} ürününü EnuygunPet Gross Market'te bulabilirsiniz. Türkiye'nin önde gelen petshop markalarının orijinal ve garantili ürünlerini mağazamızda stokta tutuyoruz.

${keyword} gibi premium marka ürünler, evcil hayvanınızın sağlıklı beslenmesi ve uzun ömürlü bir yaşam sürmesi için en doğru seçimdir. Mağazamızda geniş beden ve gramaj seçenekleriyle bu ürünleri bulabilirsiniz.

Samsun Atakum'da haftanın her günü 09:00-21:00 açığız. WhatsApp üzerinden stok sorgusu yapabilirsiniz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede satılır?`, a: `EnuygunPet Gross Market'te ${keyword} ürününü orijinal ve garantili olarak bulabilirsiniz. Samsun Atakum'da her gün hizmetinizdeyiz.` },
      { q: `${keyword} sahte mi orijinal mi anlaşılır?`, a: `EnuygunPet olarak sadece yetkili distribütörlerden temin edilen orijinal ürünler satıyoruz. Her üründe barkod ve orijinallik kodu mevcuttur.` },
      { q: `${keyword} fiyatları ne kadar?`, a: `Gross market avantajımızla en uygun fiyatları sunuyoruz. Güncel fiyat için mağazamızı arayabilir veya WhatsApp'tan sorabilirsiniz.` },
      { q: `${keyword} tüm seçenekleri var mı?`, a: `Mağazamızda geniş gramaj ve çeşit seçeneği bulunmaktadır. Stok bilgisi için WhatsApp veya telefon ile bize ulaşabilirsiniz.` },
    ];
  } else if (isOyuncak) {
    article = `Samsun Atakum'da ${keyword} arayanlar için EnuygunPet Gross Market geniş oyuncak koleksiyonu sunmaktadır. Kedi ve köpekler için interaktif, tüy oyuncaklar, top ve tünel gibi pek çok seçenek mevcuttur.

${keyword} evcil hayvanınızın zihinsel ve fiziksel gelişimine katkı sağlar. Özellikle iç mekânda yaşayan hayvanlar için oyun aktiviteleri stres giderici ve sağlık koruyucudur.

Haftanın her günü 09:00-21:00 saatleri arasında Atakum'da hizmetinizdeyiz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede satılır?`, a: `EnuygunPet Gross Market'te geniş evcil hayvan oyuncak yelpazesi bulunmaktadır. Samsun Atakum'da her gün açığız.` },
      { q: `${keyword} ne sıklıkla değiştirilmeli?`, a: `Oyuncaklar yıprandığında veya hasar gördüğünde değiştirilmelidir. Hasarlı oyuncaklar hayvan güvenliğini tehdit edebilir.` },
      { q: `Hangi oyuncak türü daha uzun ömürlüdür?`, a: `Kauçuk ve dayanıklı plastik malzemeden üretilen oyuncaklar daha uzun ömürlüdür. Mağazamızda farklı dayanıklılık seviyelerinde seçenekler sunuyoruz.` },
      { q: `${keyword} fiyatı nedir?`, a: `Ürün fiyatları için mağazamızı arayabilir veya WhatsApp'tan bilgi alabilirsiniz.` },
    ];
  } else {
    article = `Samsun Atakum'da ${keyword} arıyorsanız EnuygunPet Gross Market doğru adresinizdir. Samsun'un en büyük petshop gross marketi olarak binlerce evcil hayvan ürününü tek çatı altında sunuyoruz.

${keyword} başta olmak üzere kedi, köpek, kuş, balık ve tüm evcil hayvan ihtiyaçlarınız için mağazamızı ziyaret edebilirsiniz. Gross market formatımız sayesinde perakende fiyatların çok altında kaliteli ürünlere ulaşabilirsiniz.

Haftanın her günü 09:00-21:00 saatleri arasında Samsun Atakum adresimizde sizlere hizmet vermekten mutluluk duyuyoruz. Uzman ekibimiz evcil hayvanınızın ihtiyaçları konusunda ücretsiz danışmanlık sunar.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede bulunur?`, a: `EnuygunPet Gross Market'te ${keyword} ve benzeri ürünleri Samsun Atakum'da bulabilirsiniz. Haftanın her günü 09:00-21:00 açığız.` },
      { q: `${keyword} için hangi petshop güvenilir?`, a: `EnuygunPet Gross Market olarak müşteri memnuniyetini ön planda tutuyoruz. Orijinal ürün garantisi ve uygun fiyat avantajıyla Atakum'un en güvenilir petshopuyuz.` },
      { q: `${keyword} fiyatı ne kadar?`, a: `En güncel fiyat bilgisi için mağazamızı arayabilir veya WhatsApp'tan bilgi talep edebilirsiniz. Gross market fiyatlarıyla her zaman avantajlı alışveriş yapabilirsiniz.` },
      { q: `Atakum petshop çalışma saatleri nedir?`, a: `EnuygunPet Gross Market haftanın her günü 09:00-21:00 saatleri arasında açıktır. Resmi tatillerde de hizmet veriyoruz.` },
    ];
  }

  return { article, faqs };
}

export default function KeywordPage() {
  const [, params] = useRoute("/:slug");
  const slug = params?.slug || "";

  const { data, isLoading, isError } = useQuery<KeywordData>({
    queryKey: ["/api/keyword", slug],
    queryFn: () => fetch(`/api/keyword/${slug}`).then(r => {
      if (!r.ok) throw new Error("not found");
      return r.json();
    }),
    retry: false,
  });

  useEffect(() => {
    if (data) {
      const title = `${data.keyword} Samsun Atakum | EnuygunPet Gross Market`;
      document.title = title;
      const desc = `Samsun Atakum'da ${data.keyword} için EnuygunPet Gross Market. En uygun fiyat, geniş stok. Haftanın her günü 09:00-21:00 açık. WhatsApp ile hemen bilgi alın.`;
      const imgUrl = pickImage(data.keyword);

      const setMeta = (sel: string, attr: string, val: string) => {
        let el = document.querySelector(sel);
        if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
        el.setAttribute(attr, val);
      };

      setMeta('meta[name="description"]', "content", desc);
      setMeta('meta[property="og:title"]', "content", title);
      setMeta('meta[property="og:description"]', "content", desc);
      setMeta('meta[property="og:image"]', "content", imgUrl);
      setMeta('meta[property="og:image:alt"]', "content", `${data.keyword} - Samsun Atakum EnuygunPet Petshop Gross Market`);
      setMeta('meta[property="og:url"]', "content", `https://www.enuygun.pet/${data.slug}`);
      setMeta('meta[property="og:type"]', "content", "website");
      setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
      setMeta('meta[name="twitter:image"]', "content", imgUrl);
      setMeta('meta[name="twitter:title"]', "content", title);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Yükleniyor...</div>
      </div>
    );
  }

  if (isError || !data) {
    return <NotFound />;
  }

  const { article, faqs } = generateContent(data.keyword);
  const imgUrl = pickImage(data.keyword);
  const imgAlt = `${data.keyword} - Samsun Atakum EnuygunPet Petshop Gross Market`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.enuygun.pet/${data.slug}`,
        "url": `https://www.enuygun.pet/${data.slug}`,
        "name": `${data.keyword} Samsun Atakum | EnuygunPet`,
        "description": `Samsun Atakum'da ${data.keyword} için EnuygunPet Gross Market. En uygun fiyat, geniş stok.`,
        "isPartOf": { "@id": "https://www.enuygun.pet/#website" },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": imgUrl,
          "name": imgAlt,
          "description": imgAlt,
          "caption": imgAlt,
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" },
            { "@type": "ListItem", "position": 2, "name": data.keyword, "item": `https://www.enuygun.pet/${data.slug}` },
          ],
        },
      },
      {
        "@type": "ImageObject",
        "url": imgUrl,
        "name": imgAlt,
        "description": imgAlt,
        "caption": imgAlt,
        "contentUrl": imgUrl,
        "license": "https://www.enuygun.pet",
        "acquireLicensePage": "https://www.enuygun.pet",
        "creditText": "EnuygunPet Gross Market Samsun Atakum",
        "creator": { "@type": "Organization", "name": "EnuygunPet Gross Market" },
        "copyrightNotice": "EnuygunPet",
        "representativeOfPage": true,
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.enuygun.pet/#localbusiness",
        "name": "EnuygunPet Gross Market",
        "telephone": PHONE,
        "image": [
          "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg",
          "https://static.wixstatic.com/media/63853e_f5ae600f104c4dfcae521fe694ba017b~mv2.jpeg",
          "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
          "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
          "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Atatürk Bulvarı",
          "addressLocality": "Atakum",
          "addressRegion": "Samsun",
          "postalCode": "55200",
          "addressCountry": "TR",
        },
        "openingHours": "Mo-Su 09:00-21:00",
        "url": "https://www.enuygun.pet",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border" data-testid="keyword-header">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/">
            <a className="flex items-center gap-2" data-testid="link-logo">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">e</span>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-primary">EnuygunPet</p>
                <p className="text-[10px] text-muted-foreground leading-none">Samsun Atakum</p>
              </div>
            </a>
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="link-header-whatsapp">
            <Button size="sm" className="h-8 text-xs bg-[#25D366] text-white border-[#20BD5A] gap-1.5">
              <SiWhatsapp className="w-3.5 h-3.5" />
              WhatsApp
            </Button>
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link href="/"><a className="hover:text-primary flex items-center gap-1"><Home className="w-3 h-3" />Ana Sayfa</a></Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium truncate">{data.keyword}</span>
        </nav>

        <h1 className="text-xl font-bold text-foreground mb-4 leading-tight" data-testid="text-keyword-title">
          {data.keyword} — Samsun Atakum
        </h1>

        <div className="mb-5 rounded-xl overflow-hidden border border-border">
          <img
            src={imgUrl}
            alt={imgAlt}
            title={imgAlt}
            className="w-full h-44 object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <p className="text-[10px] text-muted-foreground text-center py-1.5 bg-muted/30">
            EnuygunPet Gross Market — Atatürk Bulvarı, Atakum / Samsun
          </p>
        </div>

        <Card className="p-4 mb-5 border border-card-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">EnuygunPet Gross Market</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line" data-testid="text-article">
            {article}
          </p>
        </Card>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <a href={`tel:${PHONE}`} data-testid="link-kw-call">
            <Card className="p-3 border border-card-border text-center">
              <Phone className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-foreground">Ara</p>
              <p className="text-[10px] text-muted-foreground">Hemen bilgi al</p>
            </Card>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="link-kw-whatsapp">
            <Card className="p-3 border border-card-border text-center">
              <SiWhatsapp className="w-5 h-5 text-[#25D366] mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-foreground">WhatsApp</p>
              <p className="text-[10px] text-muted-foreground">Stok sor</p>
            </Card>
          </a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-testid="link-kw-map">
            <Card className="p-3 border border-card-border text-center">
              <Navigation className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-foreground">Yol Tarifi</p>
              <p className="text-[10px] text-muted-foreground">Atakum</p>
            </Card>
          </a>
        </div>

        <section className="mb-5" aria-label="Sıkça sorulan sorular">
          <h2 className="text-base font-bold text-foreground mb-3" data-testid="text-faq-title">
            Sıkça Sorulan Sorular
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-4 border border-card-border">
                <h3 className="text-sm font-semibold text-foreground mb-1.5" data-testid={`text-faq-q-${i}`}>{faq.q}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed" data-testid={`text-faq-a-${i}`}>{faq.a}</p>
              </Card>
            ))}
          </div>
        </section>

        <Card className="p-4 mb-5 border border-card-border">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Mağaza Bilgileri
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{ADDRESS}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Her gün 09:00 - 21:00</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
              <a href={`tel:${PHONE}`} className="hover:text-primary">{PHONE}</a>
            </div>
          </div>
        </Card>

        {data.related.length > 0 && (
          <section className="mb-5" aria-label="Benzer ürünler">
            <h2 className="text-base font-bold text-foreground mb-3">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 gap-2">
              {data.related.slice(0, 8).map(r => (
                <Link key={r.slug} href={`/${r.slug}`}>
                  <a
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-muted/30 hover:border-primary hover:bg-primary/5 transition-colors group"
                    data-testid={`link-related-${r.slug}`}
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs text-foreground group-hover:text-primary leading-snug line-clamp-2">{r.keyword}</span>
                  </a>
                </Link>
              ))}
            </div>
            {data.related.length > 8 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.related.slice(8).map(r => (
                  <Link key={r.slug} href={`/${r.slug}`}>
                    <a
                      className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/40 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      data-testid={`link-related-extra-${r.slug}`}
                    >
                      {r.keyword}
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="mb-5" aria-label="Ana kategoriler">
          <h2 className="text-base font-bold text-foreground mb-3">Ana Kategoriler</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Kedi Maması", slug: "kedi-mamasi" },
              { label: "Köpek Maması", slug: "kopek-mamasi" },
              { label: "Kedi Kumu", slug: "kedi-kumu-samsun" },
              { label: "Kuş Yemleri", slug: "gold-wings-muhabbet-yemi" },
              { label: "Kedi Aksesuarları", slug: "kedi-tirmalama" },
              { label: "Köpek Aksesuarları", slug: "kopek-tasmasi" },
            ].map(cat => (
              <Link key={cat.slug} href={`/${cat.slug}`}>
                <a
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-primary/5 hover:border-primary hover:bg-primary/10 transition-colors group"
                  data-testid={`link-category-${cat.slug}`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-xs font-medium text-foreground group-hover:text-primary">{cat.label}</span>
                </a>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-5 mt-2" data-testid="keyword-footer">
        <div className="max-w-lg mx-auto text-center space-y-1.5">
          <Link href="/">
            <a className="text-xs font-semibold text-primary flex items-center justify-center gap-1.5 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              Ana Sayfaya Dön
            </a>
          </Link>
          <p className="text-xs text-muted-foreground">Sizpa Internet Ticaret Ltd.Şti.</p>
          <p className="text-[10px] text-muted-foreground/70">© {new Date().getFullYear()} EnuygunPet — Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
