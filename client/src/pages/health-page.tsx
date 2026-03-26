import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Phone, MapPin, Clock, ChevronRight, AlertTriangle, Stethoscope, ShoppingBag } from "lucide-react";
import InternalLinksSection, { detectType } from "@/components/internal-links";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NotFound from "@/pages/not-found";

const PHONE = "+905422114944";
const WHATSAPP_URL = `https://wa.me/905422114944`;
const MAPS_URL = "https://www.google.com/maps?cid=1443692801456575727";
const ADDRESS = "Atatürk Bulvarı, Atakum / Samsun";

const ANIMAL_IMAGES: Record<string, string> = {
  kedi:     "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
  kopek:    "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
  papagan:  "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
  muhabbet: "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
};

interface HealthData {
  keyword: string;
  slug: string;
  category: string;
  categoryName: string;
  animalTr: string;
  urlPrefix: string;
  related: Array<{ keyword: string; slug: string }>;
}

function generateHealthContent(kw: string, animalTr: string, category: string) {
  const k = kw.toLowerCase();
  const animal = animalTr.toLowerCase();

  const isDigestive = ["kusma", "ishal", "iştah", "sindirim", "mide", "bağırsak", "kabız", "gaz", "kursak"].some(x => k.includes(x));
  const isEye      = ["göz"].some(x => k.includes(x));
  const isRespir   = ["nefes", "öksürük", "hapşır", "solunum", "burun", "bronş"].some(x => k.includes(x));
  const isSkin     = ["tüy", "kaşıntı", "deri", "mantar", "uyuz", "pire", "bit", "alerji"].some(x => k.includes(x));
  const isUrinary  = ["idrar", "böbrek", "mesane", "çiş"].some(x => k.includes(x));
  const isDental   = ["diş", "ağız", "salya", "gaga"].some(x => k.includes(x));
  const isBehav    = ["halsi", "uyuyor", "stres", "depres", "agresif", "saklanıyor", "bağırıyor", "ısırıyor"].some(x => k.includes(x));
  const isSerious  = ["kanser", "epilepsi", "felç", "kuduz", "parvo", "kalp", "karaciğer", "böbrek yetmez", "tümör"].some(x => k.includes(x));
  const isYoung    = ["yavru"].some(x => k.includes(x));
  const isFeeding  = ["beslenme", "vitamin", "kalsiyum", "mama", "yem", "yasaklı"].some(x => k.includes(x));

  let intro = "";
  let details = "";
  let treatment = "";
  let prevention = "";
  let faqs: Array<{q: string; a: string}> = [];
  let productRec = "";

  if (isYoung) {
    intro = `Yavru ${animalTr.toLowerCase()}ler bağışıklık sistemleri tam olarak gelişmediği için hastalıklara karşı çok daha savunmasızdır. Bu dönemde "${kw}" gibi sağlık sorunları hızlı ilerleyebilir ve gecikme ciddi sonuçlar doğurabilir.`;
    details = `Yavru ${animal}lerde ${kw.replace("yavru " + animal + " ", "")} sorunu genellikle yetersiz beslenme, düşük ısı, stres veya enfeksiyondan kaynaklanır. Annelerinden ayrılan yavrular özellikle ilk haftalarda çok dikkatli takip edilmelidir. Uygun sıcaklık (28-32°C), doğru beslenme sıklığı ve hijyen koşulları hayatta kalma oranını doğrudan etkiler.`;
    treatment = `Yavru ${animal}de bu belirtiyi gördüğünüzde vakit kaybetmeden bir veterinere başvurmanız şarttır. Yavruların vücut ısısı ve enerji rezervleri çok hızlı düşer; birkaç saat içinde durumları kritik hale gelebilir. Veteriner onayı olmadan ilaç uygulamayın.`;
    prevention = `Yavruyu düzenli olarak tartın ve günlük kilo artışını takip edin. Temiz, ılık ve hava akımından uzak bir ortam sağlayın. Besin takviyelerini veterinerinizin önerisiyle verin.`;
    productRec = "yavru mamalar, süt tozu, probiyotik takviye, şırınga/pipet besleyici";
    faqs = [
      { q: `Yavru ${animal}de ${kw.replace("yavru " + animal + " ", "")} ne kadar tehlikeli?`, a: `Yetişkinlere kıyasla çok daha tehlikelidir. Belirtiler başladıktan sonra saatler içinde kötüleşebilir. Hemen veterinere gidin.` },
      { q: `Yavru ${animal} evde tedavi edilebilir mi?`, a: `Hafif durumlarda sıcaklık ve beslenme düzenlemesi yapılabilir, ancak kesin tanı ve tedavi için mutlaka veterinere başvurulmalıdır.` },
      { q: `Yavru ${animal} için ne tür mama kullanmalıyım?`, a: `Yaşa uygun özel yavru mamaları kullanılmalıdır. Annesinden ayrılmışsa veteriner önerisiyle süttozu verilebilir.` },
      { q: `EnuygunPet'te yavru ${animal} için ürün var mı?`, a: `Evet, Samsun Atakum'daki mağazamızda yavru ${animal} mamaları, takviyeler ve bakım ürünleri mevcuttur.` },
    ];
  } else if (isDigestive) {
    intro = `${animalTr}lerde ${kw} oldukça sık görülen bir sağlık sorunudur. Çoğunlukla mama değişikliği, parazit, enfeksiyon veya yanlış besinlerden kaynaklanır. Belirtiler hafiften ağıra geniş bir yelpazede değişebilir.`;
    details = `${kw} sorununun nedeni çoğunlukla tespit edilebilir ve giderilebilir. Yavaş mama geçişleri (7-10 günde), temiz su tüketimi ve parazit önleyici tedbirler pek çok sindirim sorununu engeller. Belirtiler 24 saatin üzerinde sürüyorsa ya da kanda görülüyorsa acil veteriner müdahalesi gereklidir.`;
    treatment = `Hafif durumlarda 12-24 saat aç bırakmak, sonrasında kolay sindirilebilir hafif yiyeceklerle beslemek yardımcı olabilir. Probiyotik takviye sindirim sistemini düzenler. Ancak kanlı, sulu ya da tekrarlayan ${kw} için mutlaka veterinere başvurun.`;
    prevention = `Mama geçişlerini kademeli yapın. Temiz, taze su bulundurun. Düzenli parazit tedavisi uygulayın. Yabancı cisim yutulmasını önleyin.`;
    productRec = "sindirim destekli mama, probiyotik, elektrolit takviyesi, parazit önleyici";
    faqs = [
      { q: `${animalTr}de ${kw} ne zaman tehlikeli olur?`, a: `24 saatten uzun sürerse, kanlıysa, halsizlik veya iştahsızlıkla birlikteyse acil veteriner gerektirir.` },
      { q: `${kw} için evde ne yapılabilir?`, a: `Kısa süreliğine aç bırakıp bol su sunulabilir. Probiyotik takviye de destekleyici olur. Ancak belirtiler devam ederse veteriner şarttır.` },
      { q: `${animalTr} mama değişikliğinden ${kw} yaşayabilir mi?`, a: `Evet, ani mama değişikliği en yaygın nedenlerden biridir. 7-10 günde kademeli geçiş yapılmalıdır.` },
      { q: `Samsun'da ${animal} için sindirim ürünleri nerede satılır?`, a: `EnuygunPet Gross Market, Samsun Atakum'da probiyotik ve sindirim destekli mamalar dahil geniş ürün yelpazesi sunar.` },
    ];
  } else if (isEye) {
    intro = `${animalTr}lerde ${kw} birden fazla nedene bağlı olabilir: bakteri veya virüs enfeksiyonu, alerji, yabancı cisim ya da anatomik nedenler. Erken fark edilip tedavi edilmesi kalıcı hasarı önler.`;
    details = `Göz sorunlarında dikkat edilmesi gereken belirtiler şunlardır: kızarıklık, akıntı rengi (şeffaf/sarı/yeşil), şişlik, gözde kaşıma eğilimi ve tek göz kapama. Sarı-yeşil akıntı enfeksiyona işaret ederken şeffaf akıntı alerji veya tahriş kaynaklı olabilir.`;
    treatment = `Göz bölgesini kuru, temiz bir bezle nazikçe silin. Veteriner önerisi olmadan herhangi bir damla veya krem uygulamayın. Antibiyotik gerektiren durumlar yalnızca veteriner reçetesiyle tedavi edilmelidir.`;
    prevention = `Göz çevresini düzenli temizleyin. Yabancı cisim temasından koruyun. Uzun tüylü ırklarda göz çevresindeki tüyleri kısa tutun.`;
    productRec = "göz temizleyici solüsyon, steril pamuk, vitamin takviyesi";
    faqs = [
      { q: `${animalTr}de ${kw} ne anlama gelir?`, a: `Enfeksiyon, alerji ya da yabancı cisim tahrişi olabilir. Akıntı rengi ve süresine göre veteriner değerlendirmesi gerekebilir.` },
      { q: `Göz akıntısı ne zaman acildir?`, a: `Sarı-yeşil akıntı, şişlik, gözde açamama ya da ağrı varsa acilen veterinere başvurun.` },
      { q: `${animalTr} gözünü ilaçsız nasıl temizlerim?`, a: `Steril serum fizyolojik veya özel göz temizleyici ile hafifçe silebilirsiniz. Kurutmadan önce kurulayın.` },
      { q: `Samsun'da ${animal} göz bakım ürünleri nerede bulunur?`, a: `EnuygunPet Gross Market Samsun Atakum'da göz temizleyici ve bakım ürünleri mevcuttur.` },
    ];
  } else if (isRespir) {
    intro = `${animalTr}lerde ${kw} solunum yolu enfeksiyonlarının en yaygın belirtilerinden biridir. Grip, bronşit veya daha ciddi pulmoner sorunların işareti olabilir. Süre uzarsa veya diğer belirtilerle eşleşirse veteriner muayenesi şarttır.`;
    details = `Solunum yolu sorunlarında dikkat edilmesi gereken faktörler: soğuk-nemli ortam, başka hasta hayvanlarla temas, stres ve yetersiz beslenme. Özellikle kuşlarda solunum problemi çok hızlı kötüleşebilir; kuyruk sallama ile nefes almak acil bir işarettir.`;
    treatment = `Ortamı ılık (22-25°C) ve hava akımından uzak tutun. Bol temiz su sunun. Nebülizasyon bazı durumlarda rahatlatıcı olabilir ancak veteriner yönlendirmesiyle yapılmalıdır. Antibiyotikler yalnızca bakteriyel enfeksiyonlarda faydalıdır, veteriner reçetesi gereklidir.`;
    prevention = `Soğuk ve hava cereyanından koruyun. Yeni gelen hayvanlara karantina uygulayın. Ortam nem dengesini koruyun.`;
    productRec = "vitamin C ve bağışıklık takviyesi, özel solunum desteği ürünleri, ısıtıcı";
    faqs = [
      { q: `${animalTr}de ${kw} ne kadar ciddidir?`, a: `Hafif vakalarda birkaç gün içinde geçebilir, ancak yüksek ateş, nefes darlığı veya iştahsızlıkla birlikteyse acil veteriner gerektirir.` },
      { q: `${kw} bulaşıcı mı?`, a: `Viral veya bakteriyel kaynaksa diğer hayvanlara bulaşabilir. Şüphe durumunda yeni hayvandan izole edin.` },
      { q: `Evde ${kw} için ne yapabilirim?`, a: `Sıcak ortam sağlayın, temiz su verin. Belirtiler 48 saat içinde düzelmezse veterinere gidin.` },
      { q: `${animalTr} için vitamin takviyesi Samsun'da nerede satılır?`, a: `EnuygunPet Gross Market Samsun Atakum'da vitamin ve bağışıklık takviyelerini bulabilirsiniz.` },
    ];
  } else if (isSkin) {
    intro = `${animalTr}lerde ${kw} deri ve tüy sağlığını doğrudan etkileyen önemli bir sorundur. Parazitler, mantar, alerji veya hormonal dengesizlik en sık nedenler arasında yer alır.`;
    details = `Deri sorunlarında yoğun kaşıntı, tüy dökülmesi, kabuklanma veya kızarıklık gözlemlenebilir. Parazit kaynaklı sorunlar diğer evcil hayvanlara ve hatta insanlara bulaşabilir. Mantar enfeksiyonları ise sıklıkla yuvarlak, pullu lezyonlarla kendini belli eder.`;
    treatment = `Veteriner tanısı çok önemlidir; parazit için antiparaziter, mantar için antifungal, alerji için antihistaminik tedavi gerekir. Tanı olmadan uygulanan kremler durumu kötüleştirebilir. Ortamın temizliği (yatak, kafes) de tedavinin parçasıdır.`;
    prevention = `Düzenli antiparaziter uygulama yapın. Ortamı temiz tutun. Alerjik tepkilere yol açabilecek yeni besinleri yavaşça tanıtın.`;
    productRec = "antiparaziter damla/sprey, antifungal şampuan, deri bakım krem, parazit tasması";
    faqs = [
      { q: `${animalTr}de ${kw} neden olur?`, a: `Parazit, mantar, alerji veya hormonal sorunlardan kaynaklanabilir. Kesin tanı için veteriner muayenesi gerekir.` },
      { q: `${kw} insana bulaşır mı?`, a: `Parazit ve mantar kaynaklıysa bulaşabilir. Ellerinizi yıkayın ve veterinere danışın.` },
      { q: `Deri sorunları tedavisiz geçer mi?`, a: `Çoğu deri sorunu tedavisiz geçmez, aksine yayılır. Veteriner teşhisi ve uygun tedavi şarttır.` },
      { q: `Samsun'da ${animal} deri bakım ürünleri nerede satılır?`, a: `EnuygunPet Gross Market'te şampuan, antiparaziter ve deri bakım ürünleri mevcuttur.` },
    ];
  } else if (isUrinary) {
    intro = `${animalTr}lerde ${kw} özellikle erkeklerde hayati tehlike oluşturabilecek bir sorundur. İdrar yapamamak, kanlı idrar veya çok sık idrara çıkma belirtileri acil veteriner müdahalesi gerektirebilir.`;
    details = `İdrar yolu sorunları; enfeksiyon, taş, kristal birikimi veya tıkanma şeklinde görülür. Düşük su tüketimi ve kuru mama ağırlıklı beslenme risk faktörleri arasındadır. Obezite de böbrek ve mesane sağlığını olumsuz etkiler.`;
    treatment = `İdrar yapamamak 24 saat içinde hayati tehlike oluşturabilir; bu durumda acil kliniklere başvurun. Hafif enfeksiyonlarda veteriner antibiyotiği ve diyet değişikliği yeterli olabilir. Bol temiz su erişimi kritik öneme sahiptir.`;
    prevention = `Bol su içmesini sağlayın (ıslak mama veya çeşme suyu yardımcı olur). Özel idrar yolu koruyucu mamalar kullanabilirsiniz. Düzenli veteriner kontrolü yapın.`;
    productRec = "üriner bakım özel maması, taşıyıcı kase, su çeşmesi, vitamin takviyesi";
    faqs = [
      { q: `${animalTr}de ${kw} acil mi?`, a: `İdrar yapamamak durumunda evet, acildir. 12-24 saat içinde müdahale edilmezse hayati tehlike oluşur.` },
      { q: `${kw} önlemek için ne yapmalıyım?`, a: `Bol su içirmek ve üriner sağlık destekli mama vermek en etkili önlemlerdir.` },
      { q: `Üriner bakım maması fark yaratır mı?`, a: `Evet, veteriner onaylı üriner bakım mamaları kristal ve taş oluşumunu önemli ölçüde azaltır.` },
      { q: `Samsun'da üriner bakım maması nerede satılır?`, a: `EnuygunPet Gross Market Samsun Atakum'da geniş üriner bakım mama seçenekleri sunmaktadır.` },
    ];
  } else if (isSerious) {
    intro = `${animalTr}lerde ${kw} ciddi bir sağlık durumuna işaret edebilir. Bu tür hastalıklar erken teşhis edildiğinde tedavi edilebilir ya da yaşam kalitesi korunabilir. Her ertelenmiş gün, tedavi seçeneklerini daraltır.`;
    details = `${kw}, genetik yatkınlık, yaş, kronik hastalık ya da çevresel faktörlerin etkisiyle ortaya çıkabilir. Belirti başlangıcı sinsi olabilir: hafif halsizlik, yavaş kilo kaybı veya iştah azalması gibi. Erken evrede yapılan veteriner muayeneleri ve kan testleri tanıyı kolaylaştırır.`;
    treatment = `Tedavi seçenekleri hastalığın türüne ve evresine göre değişir. Bazı durumlarda cerrahi müdahale, kemoterapi, ilaç tedavisi veya özel diyet uygulanır. Veterinerinizin yönlendirmesi dışında adım atmayın.`;
    prevention = `Düzenli yıllık veteriner kontrolü, sağlıklı beslenme, aktif yaşam ve stres yönetimi birçok ciddi hastalığın riskini azaltır.`;
    productRec = "destek mamaları, vitamin takviyesi, yaşam kalitesi destekleyici ürünler";
    faqs = [
      { q: `${kw} tedavi edilebilir mi?`, a: `Erken teşhis edilirse pek çok ciddi hastalık kontrol altına alınabilir veya tedavi edilebilir. Gecikme süreci zorlaştırır.` },
      { q: `${animalTr}de ${kw} belirtileri neler?`, a: `Halsizlik, kilo kaybı, iştahsızlık, davranış değişikliği, nefes güçlüğü ilk belirtiler arasında yer alabilir.` },
      { q: `${kw} için veterinere ne zaman gitmeliyim?`, a: `Belirtileri fark eder etmez. Birkaç hafta beklemeniz durumu önemli ölçüde kötüleştirebilir.` },
      { q: `${animalTr} için destek mamaları Samsun'da var mı?`, a: `EnuygunPet Gross Market'te özel diyet ve destek mamaları mevcuttur.` },
    ];
  } else if (isBehav) {
    intro = `${animalTr}lerde ${kw} yalnızca psikolojik değil, fiziksel hastalığın da belirtisi olabilir. Ani davranış değişiklikleri her zaman dikkate alınmalıdır.`;
    details = `Hayvanlarda davranış değişikliklerinin arkasında; ağrı, iç hastalık, nörolojik sorun veya çevresel stres yatabilir. Taşınma, yeni bir aile üyesi, mağaza ortamı değişikliği gibi durumlar da tetikleyici olabilir. Belirtiler 1-2 haftadan uzun sürüyorsa mutlaka veterinere danışın.`;
    treatment = `Önce fiziksel hastalık olasılığı dışlanmalıdır. Ardından çevre düzenlemesi, oyun arttırma, sosyalleşme veya davranış terapisi uygulanabilir. Aşırı durumlarda veteriner ilaç desteği önerebilir.`;
    prevention = `Rutin ve tahmin edilebilir bir yaşam düzeni, yeterli egzersiz, oyun ve sosyal etkileşim davranışsal sorunları önlemede temel unsurlardır.`;
    productRec = "feromone difüzör, sakinleştirici takviye, interaktif oyuncaklar, zihinsel stimülasyon araçları";
    faqs = [
      { q: `${animalTr}de ${kw} neye işaret eder?`, a: `Ağrı, hastalık veya psikolojik stres kaynağı olabilir. Veteriner ile değerlendirmek gerekir.` },
      { q: `Davranış sorunu ilaçsız çözülür mü?`, a: `Çevresel düzenlemeler ve oyun/egzersiz çoğu vakada işe yarar. Ağır durumlarda veteriner desteği gerekebilir.` },
      { q: `Yeni bir ortam ${kw} yaratabilir mi?`, a: `Evet, ortam değişikliği hayvanlarda stres davranışlarını tetikleyebilir. Uyum süresi tanıyın.` },
      { q: `${animalTr} için sakinleştirici ürün Samsun'da var mı?`, a: `EnuygunPet Gross Market'te feromone ve doğal sakinleştirici ürünler mevcuttur.` },
    ];
  } else if (isFeeding) {
    intro = `${animalTr}lerde ${kw} hayvanlarda sıkça gözden kaçan ama ciddi sağlık sorunlarına zemin hazırlayan bir faktördür. Doğru beslenme birçok hastalığı önleyebilir ya da iyileşme sürecini hızlandırabilir.`;
    details = `${kw} sorunu tek tip beslenme, işlenmiş yiyecek fazlalığı veya yaşa/türe uygun olmayan mamadan kaynaklanabilir. Vitamin ve mineral eksiklikleri bağışıklık sistemini zayıflatır, tüy/deri kalitesini bozar ve sindirim sorunlarına yol açar. Yaşa özel mamaların önemi bu noktada kritik hale gelir.`;
    treatment = `Öncelikle günlük beslenme programını gözden geçirin. Veteriner önerisiyle vitamin-mineral takviyesi ekleyin. Yaşa ve türe uygun premium mama seçimi uzun vadede hastalık riskini azaltır.`;
    prevention = `Çeşitli ve dengeli bir diyet oluşturun. Taze su erişimini her zaman sağlayın. Ödülü mamadan ayırın; ödül toplam kalorinin %10'unu geçmemeli.`;
    productRec = "premium yaşa uygun mama, vitamin-mineral takviyesi, probiyotik, mineral bloğu";
    faqs = [
      { q: `${animalTr}de ${kw} nasıl anlaşılır?`, a: `Tüy matlaşması, kilo kaybı veya alımı, halsizlik ve sindirim sorunları eksikliğe işaret edebilir. Kan testi kesin sonuç verir.` },
      { q: `${kw} için hangi takviye verilmeli?`, a: `Veteriner önerisi doğrultusunda A, B kompleks, C vitamini ve kalsiyum destekleri kullanılabilir. Dozaj önemlidir.` },
      { q: `Premium mama ekonomik mamayla aynı mı?`, a: `Hayır. Premium mamalar daha sindirilebilir protein ve dengeli mineral içeriğiyle uzun vadede sağlık maliyetlerini düşürür.` },
      { q: `Samsun'da kaliteli ${animal} maması nerede bulunur?`, a: `EnuygunPet Gross Market Samsun Atakum'da Royal Canin, Hills, Pro Plan, Brit dahil onlarca premium marka sunmaktadır.` },
    ];
  } else {
    intro = `${animalTr}lerde ${kw} evcil hayvan sahiplerinin dikkat etmesi gereken önemli bir sağlık konusudur. Erken fark edilmesi ve doğru adımların atılması hem süreci kısaltır hem de komplikasyonları önler.`;
    details = `${kw}, birden fazla nedene bağlı olabilir ve belirtiler farklı şiddette görülebilir. Genel sağlık durumu, beslenme kalitesi, yaşam koşulları ve genetik yatkınlık hastalık sürecinde belirleyici rol oynar. Bu nedenle genel gözlem kadar düzenli veteriner kontrolü de son derece önemlidir.`;
    treatment = `Hafif belirtilerde ortam ve beslenme düzenlemeleri yeterli olabilir. Belirtiler 48 saati aşarsa ya da ağırlaşırsa mutlaka veteriner muayenesi yaptırın. Veteriner onayı olmadan ilaç uygulamayın.`;
    prevention = `Dengeli ve yaşa uygun beslenme, temiz su, düzenli veteriner kontrolü ve stres azaltıcı ortam koşulları birçok hastalığı önler ya da hafifletir.`;
    productRec = "sağlık destekleyici mama, vitamin takviyesi, temizlik ve bakım ürünleri";
    faqs = [
      { q: `${animalTr}de ${kw} tehlikeli mi?`, a: `Şiddetine ve süresine göre değişir. 48 saati aşan ya da şiddetlenen belirtilerde veterinere başvurun.` },
      { q: `${kw} için ne zaman veterinere gidilmeli?`, a: `Belirtiler 24-48 saatten uzun sürüyor, kanlı semptom var ya da hayvan çok halsiz ise hemen veterinere gidin.` },
      { q: `${kw} evde tedavi edilebilir mi?`, a: `Hafif vakalarda destekleyici önlemler alınabilir. Ancak kesin tanı ve tedavi için veteriner şarttır.` },
      { q: `Samsun Atakum'da ${animal} için ürün nerede bulunur?`, a: `EnuygunPet Gross Market'te ${animal} sağlığı için ihtiyacınız olan tüm ürünleri bulabilirsiniz.` },
    ];
  }

  return {
    article: `${intro}\n\n${details}\n\n${treatment}\n\n${prevention}`,
    productRec,
    faqs,
  };
}

export default function HealthPage() {
  const routePatterns: Array<[string, string]> = [
    ["kedi", "/:prefix/:slug"],
    ["kopek", "/:prefix/:slug"],
    ["papagan", "/:prefix/:slug"],
    ["muhabbet", "/:prefix/:slug"],
  ];

  const [matchedKedi, paramsKedi]     = useRoute("/kedi-hastaliklari/:slug");
  const [matchedKopek, paramsKopek]   = useRoute("/kopek-hastaliklari/:slug");
  const [matchedPapagan, paramsP]     = useRoute("/papagan-hastaliklari/:slug");
  const [matchedMuhabbet, paramsMuh]  = useRoute("/muhabbet-kusu-hastaliklari/:slug");

  let animal = "";
  let slug = "";

  if (matchedKedi)     { animal = "kedi";     slug = paramsKedi?.slug || ""; }
  else if (matchedKopek)    { animal = "kopek";    slug = paramsKopek?.slug || ""; }
  else if (matchedPapagan)  { animal = "papagan";  slug = paramsP?.slug || ""; }
  else if (matchedMuhabbet) { animal = "muhabbet"; slug = paramsMuh?.slug || ""; }

  const { data, isLoading, isError } = useQuery<HealthData>({
    queryKey: ["/api/health", animal, slug],
    queryFn: () => fetch(`/api/health/${animal}/${slug}`).then(r => {
      if (!r.ok) throw new Error("not found");
      return r.json();
    }),
    enabled: !!animal && !!slug,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      const title = `${data.keyword} - ${data.animalTr} Sağlığı | EnuygunPet Samsun Atakum`;
      const desc = `${data.keyword} hakkında bilgi: belirtiler, nedenler ve ne yapmalısınız? Samsun Atakum EnuygunPet'te ${data.animalTr.toLowerCase()} sağlığı ürünleri.`;
      document.title = title;
      const imgUrl = ANIMAL_IMAGES[animal] || ANIMAL_IMAGES.kedi;

      const setMeta = (sel: string, attr: string, val: string) => {
        let el = document.querySelector(sel);
        if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
        el.setAttribute(attr, val);
      };
      const setLink = (rel: string, href: string) => {
        let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
        if (!el) { el = document.createElement("link") as HTMLLinkElement; el.setAttribute("rel", rel); document.head.appendChild(el); }
        el.setAttribute("href", href);
      };
      const canonicalUrl = `https://www.enuygun.pet/${data.urlPrefix}/${data.slug}`;
      setLink("canonical", canonicalUrl);
      setMeta('meta[name="description"]', "content", desc);
      setMeta('meta[property="og:title"]', "content", title);
      setMeta('meta[property="og:description"]', "content", desc);
      setMeta('meta[property="og:image"]', "content", imgUrl);
      setMeta('meta[property="og:image:alt"]', "content", `${data.keyword} - ${data.animalTr} Sağlığı EnuygunPet`);
      setMeta('meta[property="og:url"]', "content", canonicalUrl);
      setMeta('meta[property="og:type"]', "content", "article");
      setMeta('meta[property="og:site_name"]', "content", "EnuygunPet");
      setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
      setMeta('meta[name="twitter:title"]', "content", title);
      setMeta('meta[name="twitter:description"]', "content", desc);
      setMeta('meta[name="twitter:image"]', "content", imgUrl);
    }
  }, [data, animal]);

  if (!animal || !slug) return <NotFound />;
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground text-sm">Yükleniyor...</div>
    </div>
  );
  if (isError || !data) return <NotFound />;

  const { article, productRec, faqs } = generateHealthContent(data.keyword, data.animalTr, data.category);
  const imgUrl = ANIMAL_IMAGES[animal] || ANIMAL_IMAGES.kedi;
  const paragraphs = article.split("\n\n").filter(Boolean);

  const LOGO_IMG = "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg";
  const articleImgObj = {
    "@type": "ImageObject",
    "url": imgUrl,
    "contentUrl": imgUrl,
    "name": `${data.keyword} - ${data.animalTr} Sağlığı | EnuygunPet Samsun Atakum`,
    "description": `${data.keyword} hakkında bilgi: belirtiler, nedenler, öneriler ve EnuygunPet'te ${data.animalTr.toLowerCase()} sağlık ürünleri.`,
    "caption": `${data.keyword} | EnuygunPet Samsun Atakum ${data.animalTr} Sağlığı`,
    "representativeOfPage": true,
    "license": "https://www.enuygun.pet",
    "acquireLicensePage": "https://www.enuygun.pet",
    "creditText": "EnuygunPet Gross Market",
    "creator": { "@type": "Organization", "name": "EnuygunPet Gross Market" },
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://www.enuygun.pet/${data.urlPrefix}/${data.slug}#article`,
        "headline": `${data.keyword} - ${data.animalTr} Sağlığı`,
        "description": `${data.keyword} hakkında belirtiler, nedenler ve öneriler.`,
        "image": articleImgObj,
        "thumbnailUrl": imgUrl,
        "author": { "@type": "Organization", "name": "EnuygunPet Gross Market" },
        "publisher": {
          "@type": "Organization",
          "name": "EnuygunPet Gross Market",
          "logo": {
            "@type": "ImageObject",
            "url": LOGO_IMG,
            "width": 600,
            "height": 315,
            "caption": "EnuygunPet Gross Market - Samsun Atakum Petshop"
          }
        },
        "datePublished": "2025-01-01",
        "dateModified": new Date().toISOString().split("T")[0],
        "mainEntityOfPage": `https://www.enuygun.pet/${data.urlPrefix}/${data.slug}`,
      },
      articleImgObj,
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" },
          { "@type": "ListItem", "position": 2, "name": `${data.animalTr} Sağlığı`, "item": `https://www.enuygun.pet/${data.urlPrefix}` },
          { "@type": "ListItem", "position": 3, "name": data.keyword, "item": `https://www.enuygun.pet/${data.urlPrefix}/${data.slug}` },
        ],
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
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Atatürk Bulvarı",
          "addressLocality": "Atakum",
          "addressRegion": "Samsun",
          "postalCode": "55200",
          "addressCountry": "TR"
        },
        "openingHours": "Mo-Su 09:00-21:00",
        "url": "https://www.enuygun.pet",
        "image": imgUrl,
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
            <span>🐾</span>
            <span>EnuygunPet</span>
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            data-testid="btn-whatsapp-header"
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors">
            <SiWhatsapp className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-foreground font-medium">{data.animalTr} Sağlığı</span>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-foreground font-medium truncate max-w-[180px]">{data.keyword}</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight" data-testid="health-page-title">
          {data.keyword}
        </h1>
        <p className="text-sm text-muted-foreground mb-5">
          {data.categoryName} — {data.animalTr} Sağlık Bilgisi
        </p>

        {/* Hero image */}
        <div className="rounded-xl overflow-hidden mb-6 aspect-[16/9] bg-muted">
          <img
            src={imgUrl}
            alt={`${data.keyword} - ${data.animalTr} sağlığı EnuygunPet Samsun Atakum`}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={800}
            height={450}
            data-testid="health-page-image"
          />
        </div>

        {/* Disclaimer */}
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-900">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
          <p>
            Bu sayfa genel bilgi amaçlıdır ve veteriner tanısının yerini tutmaz.
            Evcil hayvanınızın sağlığı için lütfen bir veterinere başvurun.
          </p>
        </div>

        {/* Article content */}
        <article className="prose prose-sm max-w-none mb-6" data-testid="health-article">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-foreground/90 leading-relaxed mb-4">
              {p}
            </p>
          ))}
        </article>

        {/* Store information */}
        <section className="mb-6 space-y-3">
          <h2 className="text-base font-bold text-foreground">EnuygunPet'te Ürün ve Destek</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            EnuygunPet Gross Market olarak evcil hayvan sağlığını destekleyen ürünleri gross market fiyatıyla sunuyoruz. Veteriner önerileriyle uyumlu mama, takviye ve bakım ürünlerini Samsun Atakum mağazamızda bulabilirsiniz. Mağazamızda kedi maması, köpek maması, kuş yemi, vitamin takviyeleri, probiyotikler ve özel diyet mamaları stoğumuzda mevcuttur.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Royal Canin, Hills Prescription Diet, Pro Plan Veterinary Diets ve Brit Care gibi veteriner onaylı markaların ürünleri mağazamızda bulunmaktadır. Ürün seçiminde kararsız kaldığınızda WhatsApp hattımız (+90 542 211 49 44) üzerinden uzman personelimizden yardım alabilirsiniz. Haftanın her günü saat 09:00 ile 21:00 arasında Atatürk Bulvarı Atakum adresimizde hizmetinizdeyiz.
          </p>
          <h3 className="text-sm font-bold text-foreground">Neden EnuygunPet?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Samsun'un en büyük petshop gross marketi olarak binlerce ürün çeşidi, uzman danışmanlık ve gross market fiyat avantajı sunuyoruz. Perakende fiyatlarının %30-50 altında alışveriş yapabilirsiniz. Evcil hayvanınızın sağlık durumuna uygun ürünü bulmak için mağazamızı ziyaret edin veya bize ulaşın.
          </p>
        </section>

        {/* Product recommendation */}
        <Card className="p-5 mb-8 border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <ShoppingBag className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Bu Sorun İçin Önerilen Ürünler</h3>
              <p className="text-sm text-muted-foreground mb-3">{productRec}</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                data-testid="btn-product-whatsapp"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                <SiWhatsapp className="w-4 h-4" />
                Ürünü WhatsApp'tan Sor
              </a>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        <section className="mb-8" data-testid="health-faq">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground text-sm mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        {data.related.length > 0 && (
          <section className="mb-8">
            <h3 className="text-base font-semibold text-foreground mb-3">İlgili Konular</h3>
            <div className="flex flex-wrap gap-2">
              {data.related.map(r => (
                <Link
                  key={r.slug}
                  href={`/${data.urlPrefix}/${r.slug}`}
                  data-testid={`link-related-${r.slug}`}
                  className="text-xs bg-muted hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-colors border border-border">
                  {r.keyword}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <Card className="p-5 bg-primary text-primary-foreground">
          <h3 className="font-bold text-lg mb-1">EnuygunPet Gross Market</h3>
          <p className="text-primary-foreground/80 text-sm mb-4">{ADDRESS} • Her gün 09:00–21:00</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <a href={`tel:${PHONE}`} data-testid="btn-phone-cta"
              className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
              <Phone className="w-4 h-4" />
              Ara
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="btn-whatsapp-cta"
              className="flex items-center justify-center gap-2 bg-green-400 hover:bg-green-300 text-green-900 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
              <SiWhatsapp className="w-4 h-4" />
              WhatsApp
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-testid="btn-maps-cta"
              className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
              <MapPin className="w-4 h-4" />
              Yol Tarifi
            </a>
          </div>
        </Card>

        <InternalLinksSection type={detectType(data.keyword)} currentSlug={data.slug} showHealth={false} />

        <footer className="mt-8 pb-6 text-center space-y-1">
          <p className="text-[10px] text-muted-foreground/70">© {new Date().getFullYear()} EnuygunPet — Tüm hakları saklıdır.</p>
          <p className="text-[10px] text-muted-foreground/60">
            Bu web sitesi,{" "}
            <a href="https://www.sizpa.net/" target="_blank" rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors">
              Sizpa Yazılım
            </a>{" "}
            tarafından tasarlanmış ve geliştirilmiştir.
          </p>
        </footer>
      </main>
    </div>
  );
}
