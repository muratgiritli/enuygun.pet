const fs = require('fs');
function slug(s){return s.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();}

const blogs = [
  {
    title:'Kisir Kedi Mamasi Hangisi',
    cat:'kedi',
    desc:'Kisirlaştirilmiş kedilerin özel beslenme ihtiyaçlari ve en iyi mama seçenekleri.',
    products:['royal-canin-kedi-mamasi','reflex-kedi-mamasi','hills-kedi-mamasi'],
    sections:[
      {h:'Kisirlaştirma Sonrasi Beslenme Neden Farklilasir',p:'Kisirlaştirma operasyonu sonrasi kedilerin metabolizmasi yavaşlar ve kalori ihtiyaci azalir. Bu dönemde normal mama kullanmaya devam etmek obeziteye yol açabilir. Kisir kedi mamalari bu ihtiyaç göz önüne alinarak formüle edilmiştir; düşük kalori, yüksek protein dengesiyle hem kilo kontrolü hem de kas kütlesi korunmasini sağlar.'},
      {h:'Hangi Markalar Kisir Kedi Mamasi Üretir',p:'Royal Canin Sterilised, Hills Science Plan Sterilised, Pro Plan Sterilised ve Reflex Sterilised piyasanin en güvenilir kisir kedi mamalari arasindadir. Bu ürünler üriner sistem sagligini destekleyen L-carnitine ve düşük magnezyum içerigi ile de öne çikar.'},
      {h:'Samsun Atakumda Kisir Kedi Mamasi Nerede Bulunur',p:'EnuygunPet Gross Market olarak Samsun Atakumda tüm önde gelen markalarin kisir kedi mamalarini geniş gramaj seçenekleriyle sunuyoruz. Atatürk Bulvari adresimizde haftanin her günü 09:00-21:00 hizmetinizdeyiz.'}
    ]
  },
  {
    title:'Kedi Neden Kusar Nedenleri ve Ne Yapmalisiniz',
    cat:'kedi',
    desc:'Kedilerde kusmanin yaygin nedenleri, tehlike işaretleri ve evde yapabilecekleriniz.',
    products:['royal-canin-kedi-mamasi','sindirim-destekli-mama'],
    sections:[
      {h:'Kedilerde Kusmanin En Yaygin Nedenleri',p:'Kediler dogalari geregi zaman zaman kusabilir. Bunun en sik nedenleri arasinda yiyecegi çok hizli yemek, tüy yutmak, mama degişikligi, parazit enfeksiyonu veya mide tahrişi sayilabilir. Haftada bir ya da ikiden az olan episodik kusma çogunlukla endişe gerektirmez.'},
      {h:'Ne Zaman Veterinere Gitmelisiniz',p:'Kusma 24 saatte 3 defadan fazla oluyor, kanli veya sarimtırak-köpüklü görünüyor, halsizlik ve iştahsizlikla birleşiyorsa vakit kaybetmeden veterinere başvurun. Yabanci cisim yutma şüphesi varsa bu bir acil durumudur.'},
      {h:'Beslenme Düzenlemesiyle Kusma Nasil Önlenir',p:'Yavaş mama kabi kullanmak, günde 2-3 öğüne bölmek ve kaliteli, sindirim dostu mama tercih etmek kusma sikligini önemli ölçüde azaltir. EnuygunPette sindirim destekli mama çeşitlerini bulabilirsiniz.'}
    ]
  },
  {
    title:'En Iyi Kedi Mamasi Hangisi 2025 Rehberi',
    cat:'kedi',
    desc:'Kedi mamasi seçiminde dikkat edilmesi gereken kriterler ve en iyi marka önerileri.',
    products:['royal-canin-kedi-mamasi','hills-kedi-mamasi','pro-plan-kedi-mamasi','reflex-kedi-mamasi'],
    sections:[
      {h:'Kedi Mamasi Seçerken Nelere Dikkat Edilmeli',p:'Içerik listesinde ilk sirana gerçek et olmasina dikkat edin. Misir şurubu, yapay renklendirici ve koruyucu içeren mamalardan kaçinin. Protein oraninin yüzde 26nin, nem içerigi belirtilmişse yüzde 8in üzerinde olmasi kalite göstergesidir.'},
      {h:'En Iyi Kedi Mamasi Markalari',p:'Royal Canin, Hills Science Plan, Pro Plan, Acana, Orijen ve Reflex Premium dünya genelinde veterinerler tarafindan en çok önerilen markalar arasinda yer alir. Bütçeye göre Brit Care ve Enjoy de iyi orta segmenti temsil eder.'},
      {h:'Kuru mu Yas mi Dogru Seçim',p:'Ideal beslenme her ikisinin kombinasyonudur. Yas mama daha fazla su içerdiginden üriner sistem sagligini destekler. Kuru mama ise diş sagligina katki saglar ve daha ekonomiktir. EnuygunPette her iki formati da bulabilirsiniz.'}
    ]
  },
  {
    title:'Yavru Kedi Nasil Beslenir Kapsamli Rehber',
    cat:'kedi',
    desc:'0-12 ay arasi yavru kedilerin beslenme ihtiyaçlari, mama seçimi ve besleme sikligi.',
    products:['royal-canin-kitten','pro-plan-kitten','reflex-kitten'],
    sections:[
      {h:'Yavru Kedi Kaç Kez Beslenmeli',p:'0-3 aylik yavrular günde 4-5 ögun, 3-6 ay arasi 3-4 ögun, 6-12 ay arasi ise günde 2-3 ögun beslenmelidir. Düzenli küçük ögunler hem sindirim sistemini korur hem de büyüme için gereken sürekli enerji saglar.'},
      {h:'Yavru Kedi Mamasi Yetişkin Mamadan Neden Farkli',p:'Yavru mamalari DHA, kalsiyum ve fosfor oranlari yetişkin mamalarindan çok daha yüksek formüle edilmiştir. Yetişkin mama vermek uzun vadede gelişim sorunlarina yol açabilir. Mutlaka kitten veya yavru etiketli ürünleri tercih edin.'},
      {h:'Yavru Kediye Süt Verilir mi',p:'Inek sütü kediler için zararlidir, laktoz intoleransi yaratir. Annesinden ayrılmış yavrular için özel kedi sütü tozu kullanilmalidir. 8 haftasini doldurmuş yavrular yavaş yavaş islak mama ile taniştirilabilir.'}
    ]
  },
  {
    title:'Kedi Mamasi Nasil Degiştirilir Dogru Geçiş',
    cat:'kedi',
    desc:'Kedi mamasi degiştirilirken uyulmasi gereken kademeli geçiş yöntemi.',
    products:['royal-canin-kedi-mamasi','reflex-kedi-mamasi'],
    sections:[
      {h:'Ani Mama Degişikligi Neden Tehlikeli',p:'Kediler hassas sindirim sistemleri nedeniyle ani mama degişikliklerine karşi çok hassastir. Yeni mama aniden verildiginde ishal, kusma ve iştahsizlik kaçinilmaz olabilir.'},
      {h:'7-10 Günlük Kademeli Geçiş Yöntemi',p:'1-2 gün yüzde 75 eski artı yüzde 25 yeni. 3-4 gün yüzde 50-50. 5-6 gün yüzde 25 eski artı yüzde 75 yeni. 7. günden itibaren yüzde 100 yeni mama.'},
      {h:'Kedi Yeni Mamayı Yemiyorsa Ne Yapmalı',p:'Üzerine az miktarda islak mama veya tavuk suyu ekleyebilirsiniz. 72 saatten uzun iştahsizlikta veterinere başvurun.'}
    ]
  },
  {
    title:'Kedi Tuy Dökülmesi Nedenleri ve Çözümleri',
    cat:'kedi',
    desc:'Kedilerde aşiri tüy dökülmesinin nedenleri ve beslenme çözümleri.',
    products:['omega-3-kedi','vitamin-kedi'],
    sections:[
      {h:'Tuy Dökülmesinin En Yaygin Nedenleri',p:'Mevsim geçişleri, stres, yetersiz beslenme, parazit ve alerjiler tüy dökülmesinin başlica nedenleridir. Özellikle ilkbahar ve sonbaharda döküm çok artabilir.'},
      {h:'Beslenme ile Tuy Sagligi Ilişkisi',p:'Omega-3 yag asitleri, biotin, çinko ve E vitamini tüy sagligini dogrudan etkiler. Premium mamalar ve balik yagi takviyeleri tüyü parlak ve güçlü tutar.'},
      {h:'Ne Zaman Veterinere Gidilmeli',p:'Tüy dökülmesiyle birlikte deri kizarikligi, kabuklanma veya bölgesel dökülme varsa alerji veya mantar şüphesiyle veterinere başvurun.'}
    ]
  },
  {
    title:'Kedi Idrar Yolu Enfeksiyonu Belirtiler ve Önlemler',
    cat:'kedi',
    desc:'Kedilerde idrar yolu enfeksiyonunun belirtileri ve beslenme önerileri.',
    products:['royal-canin-urinary','hills-urinary'],
    sections:[
      {h:'Kedi Idrar Yolu Enfeksiyonu Belirtileri',p:'Idrar ederken aglayanma, sik sik kuma gidip az idrar yapma, kanli idrar, aşiri yalama ve tuvalete gidememe üriner sorunlarin klasik belirtileridir.'},
      {h:'Beslenme ve Uriner Saglık',p:'Düşük magnezyum içeren, üriner pH dengesini koruyan özel mamalar kristal ve taş oluşumunu azaltir. Bol su içmek kritik önemdedir.'},
      {h:'Samsun Atakumda Uriner Bakim Mamasi',p:'EnuygunPette Royal Canin Urinary ve Hills C/D dahil pek çok veteriner onaylis üriner bakim mamasi mevcuttur.'}
    ]
  },
  {
    title:'Köpek Neden Mama Yemez 7 Neden ve Çözümler',
    cat:'kopek',
    desc:'Köpeklerde iştahsizligin yaygin nedenleri ve evde uygulayabileceginiz çözümler.',
    products:['royal-canin-kopek-mamasi','pedigree-kopek'],
    sections:[
      {h:'Iştahsizligin En Sik Nedenleri',p:'Mama degişikligi, yorgunluk, stres, agri, aşi sonrasi yan etki, sicak hava ve gastrointestinal problemler köpeklerde iştahsizligin en sik nedenleridir.'},
      {h:'Iştahsizligi Gidermek Için Ne Yapabilirsiniz',p:'Üzerine az miktarda tavuk suyu veya islak mama ekleyin. Mama kabini degiştirim, farkli konumda sunun. 48 saatten uzun iştahsizlikta veteriner şarttır.'},
      {h:'Ne Zaman Acildir',p:'Iştahsizlikla birlikte kusma, ishal, halsizlik ya da karin şişligi varsa acil durumudur. Büyük irklarda gastrik dilatasyon hayatı tehdit eder.'}
    ]
  },
  {
    title:'Köpek Mamasi Seçimi Tam Rehber 2025',
    cat:'kopek',
    desc:'Köpek irkina, yaşina ve kilosuna göre dogru mama seçimi nasil yapilir.',
    products:['royal-canin-kopek-mamasi','pro-plan-kopek','brit-kopek'],
    sections:[
      {h:'Irka Göre Mama Seçimi',p:'Royal Canin gibi markalar irka özel mama üretir; Labrador, Golden, Chihuahua gibi popüler irklar için özel formüller mevcuttur.'},
      {h:'Yaşa Göre Mama Seçimi',p:'Yavru, yetişkin ve yaşli köpek mamalari farkli protein, yag ve mineral oranlarina sahiptir. Dogru yaş kategorisi seçilmezse uzun vadede saglik sorunlari ortaya çikabilir.'},
      {h:'Ekonomik vs Premium Mama',p:'Premium mama uzun vadede veteriner masraflarini düşürür. Hayvan kaynakli et ilk sirada olan, koruyucu içermeyen mamalar tercih edilmelidir.'}
    ]
  },
  {
    title:'Yavru Köpek Bakimi Ilk Haftalarda Ne Yapmalisiniz',
    cat:'kopek',
    desc:'Yeni sahiplendiginiz yavru köpegi evde karşilamak için bilmeniz gereken her şey.',
    products:['royal-canin-puppy','pro-plan-puppy'],
    sections:[
      {h:'Yavru Köpek Eve Geldiginde Ilk 24 Saat',p:'Sakin bir köşe hazirlayin, köpegi fazla uyrmayin. Su ve mama koyun ancak zorlamayin. Ilk gece aglamak normaldir.'},
      {h:'Aşi ve Veteriner Takvimi',p:'6-8 haftada ilk karma aşi, 10-12 haftada ikinci doz, 16 haftada üçüncü doz ve kuduz aşisi. Aşi öncesi muayene ve parazit tedavisi şarttir.'},
      {h:'Sosyalleşme Dönemi',p:'8-16 hafta arasi kritik sosyalleşme penceresidir. Bu dönemde farkli insan, ses ve ortamlarla taniştirilmalidir.'}
    ]
  },
  {
    title:'Muhabbet Kuşu Nasil Beslenir Dogru Diyet',
    cat:'kus',
    desc:'Muhabbet kuşlarinin beslenme ihtiyaçlari, yasak yiyecekler ve saglıklı diyet önerileri.',
    products:['muhabbet-kusu-yemi','mineral-tasi','vitamin-kus'],
    sections:[
      {h:'Muhabbet Kuşu Temel Besinleri',p:'Yüksek kaliteli tohumluk yem, pellet mama, taze sebze ve meyveler muhabbet kuşunun temel diyet kaynaklarini oluşturur. Sadece tohumla besleme vitamin ve mineral eksikligine yol açabilir.'},
      {h:'Yasak Yiyecekler',p:'Avokado, çikolata, soğan, sarımsak, tuz, alkol ve kafein muhabbet kuşlari için ölümcül olabilir. Elma çekirdeği siyanit içerdiginden verilmemelidir.'},
      {h:'Mineral Taşi ve Kuş Kumu',p:'Mineral tası gaga sagligini destekler, vitamin ve mineral deposu görevi görür. EnuygunPette çeşitli kuş besin takviyeleri mevcuttur.'}
    ]
  },
  {
    title:'Papagan Konuşturmak Için Ne Yapmalı',
    cat:'kus',
    desc:'Papagan konuşturmak için dogru yaş, yöntem ve sabir gerektiren egitim ipuçlari.',
    products:['papagan-yemi','kafes-aksesuar'],
    sections:[
      {h:'Konuşmayi Öğrenmeye En Uygun Yaş',p:'Papağanlar 3-6 aylik dönemde konuşmayı öğrenmeye en yatkindır. Afrika Gri papağanlar ve Amazonlar en yetenekli konuşmacilar arasindadir.'},
      {h:'Egitim Yöntemi',p:'Günde 15-20 dakika tekrar oturumlari yapın. Kisa, net kelimeler seçin. Papağan kelimeyi söylediginde ödüllendirin.'},
      {h:'Konuşmayi Zorlaştiran Faktörler',p:'Gürültülü ortam, stres, kötü beslenme ve yetersiz sosyal etkileşim öğrenmeyi yavaşlatir. Papağaninizla günde en az 1-2 saat vakit geçirin.'}
    ]
  },
  {
    title:'Samsuunda Petshop Seçimi Nasil Yapilir',
    cat:'genel',
    desc:'Samsunda güvenilir petshop seçerken dikkat edilmesi gereken kriterler.',
    products:['royal-canin-kedi-mamasi','pedigree-kopek'],
    sections:[
      {h:'Güvenilir Petshop Kriterleri',p:'Ürün çeşitliligi, personel bilgisi, hijyen koşullari ve fiyat şeffafligi güvenilir bir petshopun temel göstergeleridir.'},
      {h:'Gross Market Formatinin Avantajlari',p:'EnuygunPet gibi gross market formatindaki magzalar hem çeşitlilik hem de perakende fiyatlarin çok altinda fiyat sunar.'},
      {h:'Samsun Atakumda EnuygunPet',p:'Atatürk Bulvari üzerindeki magazamizda kedi, köpek, kuş, balik ve daha pek çok evcil hayvan için binlerce ürün bulunmaktadir. Her gün 09:00-21:00 açigiz.'}
    ]
  },
  {
    title:'Royal Canin mi Pro Plan mi Karşilaştirma',
    cat:'kedi',
    desc:'Iki premium marka arasindaki temel farklilıklar, fiyat-performans ve içerik analizi.',
    products:['royal-canin-kedi-mamasi','pro-plan-kedi-mamasi'],
    sections:[
      {h:'Royal Caninin Özellikleri',p:'Irka ve yaşa özel formülleriyle öne çikan Royal Canin, veteriner klinikleri tarafindan en çok önerilen markalar arasindadir.'},
      {h:'Pro Planin Özellikleri',p:'Purinanin premium serisi olan Pro Plan, yüksek gerçek et orani ve bilimsel araştırmaya dayalı formülleriyle öne çikar.'},
      {h:'Hangisi Daha Iyi',p:'Her iki marka da kalitelidir ancak hayvaninizin ihtiyacına göre degişir. EnuygunPette her ikisini de geniş gramajlarda bulabilirsiniz.'}
    ]
  },
  {
    title:'Kedi Kumu Seçimi Hangi Çeşit Daha Iyi',
    cat:'kedi',
    desc:'Bentonit, tofu, çam, silika ve karbonlu kedi kumu çeşitlerinin karşilaştirmasi.',
    products:['kedi-kumu'],
    sections:[
      {h:'Bentonit Kedi Kumu',p:'En yaygin ve uygun fiyatli seçenektir. Mükemmel topaklanma özelligiyle temizligi kolaylaştirir.'},
      {h:'Tofu Kedi Kumu',p:'Soya bazli, biyobozunur ve çok az toz içerir. Kokuyu etkili şekilde kontrol eder ve çevreye zarar vermez.'},
      {h:'Çam Peleti ve Silika',p:'Çam peleti dogal antibakteriyel özelligiyle kokuyu bastırir. Silika jel en az degişim gerektiren seçenektir.'}
    ]
  },
  {
    title:'Köpek Tasmasi ve Koşum Seçimi Rehberi',
    cat:'kopek',
    desc:'Köpegin boyutuna, irkina ve yürüyüş alişkanligina göre dogru tasma ve koşum seçimi.',
    products:['kopek-tasma','kopek-kosumu'],
    sections:[
      {h:'Tasma mi Koşum mu',p:'Brakisefal irklar için koşum şiddetle önerilir; boyun tasmasi nefes almayi zorlaştirir.'},
      {h:'Dogru Ölçü Nasil Alinir',p:'Boyun için 2 parmak girecek şekilde ayarlanmalidir. EnuygunPette ölçü konusunda yardım alabilirsiniz.'},
      {h:'Malzeme Seçimi',p:'Naylon tasma dayanikli ve yikanabilirdir. Reflektörlü modeller gece yürüyüşleri için idealdir.'}
    ]
  },
  {
    title:'Kedi Oyuncagi Seçimi Zihinsel Uyarim Için',
    cat:'kedi',
    desc:'Kedilerin zihinsel ve fiziksel gelişimini destekleyen oyuncak türleri ve öneriler.',
    products:['oyuncak-kedi'],
    sections:[
      {h:'Neden Oyuncak Önemli',p:'Özellikle tek başına ev ortaminda yaşayan kediler için zihinsel ve fiziksel uyarim hayati öneme sahiptir.'},
      {h:'Oyuncak Türleri',p:'Tüy çubuklari, lazer pointerlar, fare oyuncaklari ve interaktif beslenme kaplari en popüler kategorilerdir.'},
      {h:'Güvenli Oyuncak Kriterleri',p:'Küçük parçalar yutuabilir; bu yüzden gözetimsiz birakmayın. Dogal malzeme, toksik olmayan boya tercih edin.'}
    ]
  },
  {
    title:'Kedi Alerji Belirtileri ve Tedavi Yöntemleri',
    cat:'kedi',
    desc:'Kedilerde gorülen alerji türleri, belirtileri ve beslenme ile tedavi yaklaşimlari.',
    products:['royal-canin-sensitivity','hills-sensitivity'],
    sections:[
      {h:'Kedilerde Görülen Alerji Türleri',p:'Besin alerjisi, çevresel alerji ve temas alerjisi olmak üzere üç temel alerji türü görülür. En yaygin besin alerjenleri tavuk, balık ve tahıldir.'},
      {h:'Alerji Belirtileri Nelerdir',p:'Aşiri kaşıntı, deri kizarikligi ve kabuklanma, tüy dökülmesi, gözde ve kulakta irinli akintilar besin alerjisinin en belirgin göstergeleridir.'},
      {h:'Eliminasyon Diyeti',p:'Allerjen tespiti için 8-12 haftalık eliminasyon diyeti uygulanir. Bu süreçte hidrolize protein veya tek protein kaynakli özel mamalar kullanilmalidir.'}
    ]
  },
  {
    title:'Köpek Yavrusu Aşi Takvimi Tam Rehber',
    cat:'kopek',
    desc:'Yavru köpeklerin aşi takvimi, hangi aşilerin zorunlu oldugu ve aşi sonrasi dikkat edilecekler.',
    products:['vitamin-kopek'],
    sections:[
      {h:'Temel Zorunlu Aşilar',p:'DHPPi karma aşisi ve Kuduz aşisi tüm köpekler için zorunludur. Bu hastalıklar tedavi edilmesi güç, ölüm orani yüksek enfeksiyonlardir.'},
      {h:'Aşi Takvimi',p:'6-8 haftada ilk karma, 10-12 haftada ikinci doz ve leptospira, 16 haftada üçüncü doz ve kuduz aşisi. Yillik rapeller unutulmamalidir.'},
      {h:'Aşi Sonrasi Dikkat Edilecekler',p:'Aşi günü köpegi yormayın. 2-3 gün içinde oluşabilecek hafif ateş normaldir; ancak şiddetli reaksiyon varsa veterinere başvurun.'}
    ]
  },
  {
    title:'Kedi Beslenme Düzeni Nasil Olmali',
    cat:'kedi',
    desc:'Kediler için ideal beslenme düzeni, ögun sayisi ve porsiyon miktari.',
    products:['royal-canin-kedi-mamasi','felix-yas-mama'],
    sections:[
      {h:'Kaç Ögun Beslenilmeli',p:'Yetişkin kediler için günde 2 ögun idealdir. Bazı kediler serbest beslenmeden (her zaman dolu kap) yararlanir ancak bu obezite riskini artirabilir.'},
      {h:'Porsiyon Miktari Nasil Belirlenir',p:'Ambalajdaki kiloya göre porsiyon tablosunu referans alin. Vücut kondisyon skoru düzenli kontrol edilmeli; kaburgalar parmakla hissedilmeli ama görülmemelidir.'},
      {h:'Yaş Mamayı Öğun Programina Nasil Dahil Edilir',p:'Sabah yas mama, aksam kuru mama gibi rotasyon uygulanabilir. Her öğünden sonra kabi yikayın, yas mamayi 30 dakikadan uzun birakmayın.'}
    ]
  },
  {
    title:'Köpek Pire ve Kene Önleme Rehberi',
    cat:'kopek',
    desc:'Köpeklerde pire ve kene koruması için en etkili yöntemler ve ürünler.',
    products:['pire-kopek','kene-tasma','antiparaziter'],
    sections:[
      {h:'Pire ve Kenenin Zararlari',p:'Pire ve keneler kaşıntı, deri iltihabı ve anemiye yol açtiği gibi Lyme hastaligi, ehrlichiosis gibi ciddi hastaliklari da bulastirabilir.'},
      {h:'Koruma Yöntemleri',p:'Aylik spot-on antiparaziter damla, kene tasması veya antiparaziter tabletin kombinasyonu en etkili koruma saglar. Mevsimsel kullanim yeterli olmayabilir.'},
      {h:'Ortam Tedavisi',p:'Köpegin yanı sira yatagi, örtüleri ve ev ortamini da tedavi etmek şarttir. Pire larvalar halida uzun süre yasayabilir.'}
    ]
  },
  {
    title:'Kedi Kilo Problemi Obezite Belirtileri ve Diyet',
    cat:'kedi',
    desc:'Kedilerde aşiri kilonun belirtileri, saglik riskleri ve diyet mamasi seçimi.',
    products:['royal-canin-weight','hills-metabolic'],
    sections:[
      {h:'Kedi Obezitesi Nasil Anlaşilir',p:'Kaburgalar parmakla hissedilmiyorsa, karinda belirgin sarkim varsa veya kedi kendini yaliyamazsa kilolu demektir. Ideal vücut agirliginin yüzde 20 üzerindeki herkese obez denir.'},
      {h:'Obezitenin Saglik Riskleri',p:'Diyabet, eklem sorunlari, karaciger yaglanmasi, üriner problemler ve kalp hastaligi obeziteyle dogrudan ilişkilidir. Ömür beklentisini 2-3 yil kisaltabilir.'},
      {h:'Diyet Mamasi Seçimi',p:'L-carnitine içeren, düşük kalorili ve yüksek lifli diyet mamalari metabolizmayi destekler. EnuygunPette Royal Canin Weight Control ve Hills Metabolic mevcuttur.'}
    ]
  },
  {
    title:'Balık Beslemek Ev Akvaryumu Başlangıç Rehberi',
    cat:'genel',
    desc:'Ilk akvaryumunuzu kurmadan önce bilmeniz gereken temel bilgiler.',
    products:['balik-yemi','akvaryum-malzeme'],
    sections:[
      {h:'Dogru Akvaryum Boyutu',p:'Başlangıç için 40-80 litrelik tanklar daha kolay yönetilir. Küçük tanklar su parametrelerini daha hizli bozar.'},
      {h:'Nitrogen Döngüsü',p:'Balik koymadan önce akvaryumun biyolojik filtrasyonunu kurmaniz gerekir. Bu cyclelama süreci 4-6 hafta sürer.'},
      {h:'Başlangıç Için Uygun Balik Türleri',p:'Guppy, Platy, Molly ve Zebra Danio dayanikli ve bakimi kolay türlerdir. EnuygunPette akvaryum malzemeleri mevcuttur.'}
    ]
  },
  {
    title:'Hamster Bakim Rehberi Yeni Başlayanlar Için',
    cat:'genel',
    desc:'Hamster sahibi olmadan önce bilmeniz gerekenler; kafes, beslenme ve saglık.',
    products:['hamster-yemi','hamster-kafes'],
    sections:[
      {h:'Hamster Kafes Seçimi',p:'En az 60x40 cm taban alani önerilir. Kafes teli siki olmali ve alt yüksekligi tirmalamayi önlemelidir. Ahşap veya polietilen materyaller tercih edilmelidir.'},
      {h:'Hamster Nasil Beslenir',p:'Tohum karisimi, taze sebze ve hayvansal protein kaynagi dengeli beslenmeyi saglar. Avokado, soğan, sarımsak ve tuzlu besinler yasaklidir.'},
      {h:'Sosyalleşme ve Aktivite',p:'Hamsterlar gece aktiftir. Kofali çark ve tünel sistemi aktivite ihtiyacini karşılar. Sahibiyle günlük el alişkanligi güven ortami yaratir.'}
    ]
  },
  {
    title:'Kedi Tirnagi Kesimi Nasil Yapilir',
    cat:'kedi',
    desc:'Kedi tirnaklarini kesmek için doğru teknik, uygun alet seçimi ve evde uygulama ipuçlari.',
    products:['tirnak-makasi-kedi'],
    sections:[
      {h:'Ne Zaman Kesim Yapilmali',p:'Tırnaklar mobilyalara takılır hale geldikten veya 3-4 haftada bir kesim yapilmalidir. Dış mekana çikan kediler için bu süre daha uzayabilir.'},
      {h:'Dogru Alet Seçimi',p:'Kedi tirnak makasi veya özel tirnak kesici kullanin. Insan makasi tırnağı ezer ve çatlatir.'},
      {h:'Kesim Teknigi',p:'Pembe damarli kanimsizi kesmemeye dikkat edin. Tirnagin yalnizca beyaz/şeffaf ucunu kesin. Keserken yavaş ve sakin olun, ödülle destekleyin.'}
    ]
  },
  {
    title:'Kanarya Bakim Rehberi Sesli Kuşlar Için',
    cat:'kus',
    desc:'Kanarya bakim ihtiyaçlari, beslenme, kafes koşullari ve sesini koruma yöntemleri.',
    products:['kanarya-yemi','vitamin-kus'],
    sections:[
      {h:'Kanarya Kafes Koşullari',p:'En az 60 cm genişliginde, üst kapali kafes idealdir. Tünek yüksekligi kanaryayi mutlu eder, degişik çapta tünek sagligi korur.'},
      {h:'Kanarya Beslenme Düzeni',p:'Tohum karisimi temel besindir. Taze meyve, sebze ve yumurta sari önemli ek besinlerdir. Temiz su her gün degiştirilmelidir.'},
      {h:'Sesi Koruma Yöntemleri',p:'Stres, soguk hava, yanlış beslenme ve hastalık sesin azalmasina yol açar. Vitamin takviyesi ve sakin, isik ortam sesi güçlendirir.'}
    ]
  },
  {
    title:'Köpek Banyo Dikkat Edilecek Noktalar',
    cat:'kopek',
    desc:'Köpek banyosu için doğru siklık, şampuan seçimi ve kurutma yöntemleri.',
    products:['kopek-sampuan','kopek-fircasi'],
    sections:[
      {h:'Ne Sıklıkla Banyo Yapilmali',p:'Çoğu köpek için ayda 1-2 banyo yeterlidir. Çok sik banyo deri yaglarini bozabilir ve kuruluga yol açabilir.'},
      {h:'Dogru Şampuan Seçimi',p:'Köpege özel pH dengeli şampuanlar kullanin; insan şampuani köpek derisi için uygun degildir.'},
      {h:'Kurutma Yöntemi',p:'Havlu ile kurulayin, ardından orta isi düşük sesli kurutma makinesini kullanabilirsiniz. Kulak içine su kaçmamasina dikkat edin.'}
    ]
  },
  {
    title:'Kedi Sahiplenmek Ilk Zamanlar Neler Yapilmali',
    cat:'kedi',
    desc:'Yeni kedi sahiplendiğinizde ilk haftalarda bilmeniz gereken her şey.',
    products:['royal-canin-kitten','kedi-kumu','tirmalama-tahtasi'],
    sections:[
      {h:'Evi Kedi Için Hazirlamak',p:'Tehlikeli nesneleri kaldirin, zehirli bitkileri uzaklaştirin. Tırmalama tahtası, oyuncak ve kum kutusu hazir olsun.'},
      {h:'Ilk Veteriner Ziyareti',p:'Eve geldikten 48-72 saat içinde veterinere gotürün. Genel saglik kontrolü, iç-diş parazit tedavisi ve aşi takvimini belirleyin.'},
      {h:'Uyum Süreci',p:'Kediyi önce tek odayla sınırlayin. Zorlamayin, kendi hizinda keşfetmesine izin verin. Ilk haftalar gürültüden uzak tutun.'}
    ]
  },
  {
    title:'Köpek Eğitimi Temel Komutlar Nasil Öğretilir',
    cat:'kopek',
    desc:'Otur, bek, gel komutlarini köpeginize evde öğretmek için pekiştirme teknikleri.',
    products:['kopek-ödül','kopek-tasma'],
    sections:[
      {h:'Pekiştirme Temelli Egitim',p:'Olumlu pekiştirme en etkili yöntemdir. Doğru davranişta hemen ödül verin; azarlama ve ceza etkisizdir ve güveni zedeler.'},
      {h:'Temel Komutlar',p:'Önce otur ögretin: ödülü burnuna gotürün, yukarı çekin, otururken kelimeyi söyleyin ve ödüllendirin. Her seferinde tek komutu önceliklendirin.'},
      {h:'Egitim Süresi ve Sabir',p:'Günde 2-3 kez 5-10 dakikali oturumlar idealdir. Köpekler yorulunca odak kaybeder. Sonuçlar hemen görülmeyebilir; sabır şarttir.'}
    ]
  },
  {
    title:'Kedi Diş Sagligi ve Agiz Temizligi',
    cat:'kedi',
    desc:'Kedilerde diş sagligi, tartar önleme ve evde agiz bakim teknikleri.',
    products:['kedi-dis-macunu','kedi-dis-ciknak'],
    sections:[
      {h:'Kedi Diş Sagliginin Önemi',p:'Untreated diş taşi ve iltihabı bakteri yoluyla kalp, böbrek ve karaciğer hasarına yol açabilir. Kötü agiz kokusu saglik sorununun işaretidir.'},
      {h:'Evde Diş Temizligi',p:'Kedi parmak firçasi veya özel diş firçasi ile haftada 2-3 kez firçalama idealdir. Insan diş macunu kullanilmaz; kediye özel enzimatik macunlar tercih edilmeli.'},
      {h:'Alternif Diş Bakimi',p:'Tartar önleyici ödüller, diş sagligi destekli mama ve içme suyuna eklenen solüsyonlar firçalamanin alternatifi olarak kullanilabilir.'}
    ]
  },
  {
    title:'Tavşan Bakim Rehberi Evcil Tavşan Için',
    cat:'genel',
    desc:'Evcil tavşan sahiplenmeden önce bilmeniz gereken kafes, beslenme ve saglik bilgileri.',
    products:['tavsan-yemi','tavsan-kafes'],
    sections:[
      {h:'Tavşan Için Dogru Kafes',p:'En az 120x60 cm kafes yetişkin tavşan için minimum ölçüdür. Açik taban tercih edilmeli, tel zeminli kafesler pençe ve ayak sorunlarına yol açar.'},
      {h:'Tavşan Nasil Beslenir',p:'Yüzde 80 kuru ot (hay), yüzde 15 taze sebze ve yüzde 5 pelet mama ideal beslenmeyi oluşturur. Meyve ve ödül çok seyrek verilmelidir.'},
      {h:'Kisirlastirmanin Önemi',p:'Kisirlastirma, rahim kanseri ve agresiflik riskini azaltir. Dişi tavşanlarda rahim kanseri insidansi çok yüksektir; kisirlastirma hayat kurtarir.'}
    ]
  },
  {
    title:'Köpek Kulak Temizligi Nasil Yapilir',
    cat:'kopek',
    desc:'Köpek kulak sagligini korumak için düzenli temizlik yöntemi ve ürün önerileri.',
    products:['kulak-temizleyici-kopek'],
    sections:[
      {h:'Kulak Enfeksiyonu Belirtileri',p:'Başi sallama, kulagi kaşima, kötü koku ve koyu kahverengi akinti kulak sorununa işaret eder. Zamaninda müdahale gerektirir.'},
      {h:'Temizlik Yöntemi',p:'Kulak temizleyici solüsyonu kulak kanalina sikin, 30 saniye kök masaj yapin, köpegin sallayıp atmasi için firsat verin. Pamuklu çubuk kullanmayin; kanalin derinligine sokmayin.'},
      {h:'Ne Siklikla Yapilmali',p:'Sarkik kulakli köpekler (Beagle, Spaniel) haftada bir, dik kulaklilar ayda bir temizlenebilir. Yüzmeden sonra mutlaka temizlenmelidir.'}
    ]
  },
  {
    title:'Kedi Stres Belirtileri ve Azaltma Yöntemleri',
    cat:'kedi',
    desc:'Kedilerde stres kaynaklari, belirtileri ve feromone ile çevre düzenlemesi yoluyla azaltma.',
    products:['feliway-feromonlar','oyuncak-kedi'],
    sections:[
      {h:'Kedi Stresi Belirtileri',p:'Aşiri yalama, saçilma, iştahsizlik, agresiflik, tuvalet dışinda büyük abdest ve aşiri vokalizasyon stresin belirtileridir.'},
      {h:'Stres Kaynaklari',p:'Taşınma, yeni bebek veya hayvan, ev düzeni degişikligi, veteriner ziyareti ve sahibinin uzun süre evde olmamasi stresin en sik nedenlerindendir.'},
      {h:'Stres Azaltma Yöntemleri',p:'Feromone difüzörler, kedi için güvenli köşe yaratmak, oyun sürelerini artırmak ve düzenli rutin stres yönetiminde etkilidir.'}
    ]
  },
  {
    title:'Köpek Diyet Yaptirilirken Dikkat Edilecekler',
    cat:'kopek',
    desc:'Kilolu köpekleri saglıklı şekilde zayiflatra için beslenme düzenleme ve egzersiz önerileri.',
    products:['royal-canin-weight-kopek','hills-metabolic-kopek'],
    sections:[
      {h:'Köpek Diyeti Neden Önemli',p:'Obez köpeklerde eklem hastaligi, diyabet ve kalp sorunlari çok daha sik görülür. Her yüzde 10 fazla kilo yüzde 50 daha fazla ekleme yük bindirir.'},
      {h:'Diyet Programi Nasil Oluşturulur',p:'Hedef kilo için veteriner yardımıyla günlük kalori hesabi yapilmalidir. Mevcut günlük ögunlerin yüzde 20 azaltilmasiyla başlanabilir.'},
      {h:'Egzersizin Rolü',p:'Yaşa ve irka uygun düzenli egzersiz kilo vermeyi hizlandirir. Ani yoğun egzersizden kaçinin; özellikle yaşli köpeklerde eklem sorunlari artabilir.'}
    ]
  },
  {
    title:'Köpek Gündüz Yalniz Birakilinca Ne Olur',
    cat:'kopek',
    desc:'Evde yalniz kalan köpeklerde görülen ayrilık kaygisi ve bu sorunu gidermek için yöntemler.',
    products:['kopek-oyuncak','feromone-kopek'],
    sections:[
      {h:'Ayrilık Kaygisi Belirtileri',p:'Sahibi gider gitmez başlayan havlama, yirma, tuvalete yanlis yerlerde gitme ve aşiri yalama ayrılık kaygisinin belirtileridir.'},
      {h:'Önleyici Yöntemler',p:'Kongi oyuncagi veya dondurulmuş ödül içine gömülü oyuncaklar saatlerce meşgul eder. Calışmaya giderken dramatik vedalar yapmayın.'},
      {h:'Egitim ile Çözüm',p:'Kisa ayrılıktan başlayarak kademeli alıştirilma, ev içi kamera ile izleme ve gerektirginde profesyonel davranış uzmanına başvurma önerilir.'}
    ]
  },
  {
    title:'Atakumda Evcil Hayvan Sahiplenmek Için Nereden Başlamalı',
    cat:'genel',
    desc:'Samsun Atakumda evcil hayvan sahiplenmek isteyenler için eksiksiz başlangıç rehberi.',
    products:['royal-canin-kitten','kopek-tasma','hamster-kafes'],
    sections:[
      {h:'Hangi Evcil Hayvan Size Uygun',p:'Hayat tarzinizi, evinizin büyüklügünü ve ne kadar vakit ayirabildiginizi düşünün. Kedi bagimsiz, köpek sosyal, kuş bakimi daha az zaman gerektiren seçeneklerdir.'},
      {h:'Ilk Hazirlik Aşamalari',p:'Hayvan gelmeden önce mama, su kabi, yatak, kafes veya tuvalet kutusu ve başlangıç ürünlerini temin edin. EnuygunPette hepsi mevcuttur.'},
      {h:'EnuygunPette Başlangıç Danismanligi',p:'Samsun Atakum Atatürk Bulvari adresimizde uzman ekibimiz size hayvan seçiminden ilk bakım ürünlerine kadar ücretsiz danismanlık sunar.'}
    ]
  },
];

fs.writeFileSync('./server/blog-posts.json', JSON.stringify(blogData, null, 2));
console.log('Toplam blog yazisi:', blogData.length);
