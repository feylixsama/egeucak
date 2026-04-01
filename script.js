const appScreen = document.getElementById("app-screen");

/* -----------------------------
   COĞRAFYA MÜZİK SİSTEMİ
------------------------------ */
let geographyAudio = null;
let geographyPlaylist = [
  "audio/geo1.mp3",
  "audio/geo2.mp3",
  "audio/geo3.mp3",
  "audio/geo4.mp3",
  "audio/geo5.mp3"
];
let geographyTrackIndex = 0;
let geographyMusicEnabled = true;

function stopGeographyMusic() {
  if (geographyAudio) {
    geographyAudio.pause();
    geographyAudio.currentTime = 0;
    geographyAudio.src = "";
    geographyAudio = null;
  }
}

function playGeographyMusic() {
  if (!geographyMusicEnabled || geographyPlaylist.length === 0) return;

  if (!geographyAudio) {
    geographyAudio = new Audio();
    geographyAudio.volume = 0.35;
    geographyAudio.src = geographyPlaylist[geographyTrackIndex];

    geographyAudio.addEventListener("ended", () => {
      geographyTrackIndex = (geographyTrackIndex + 1) % geographyPlaylist.length;
      geographyAudio.src = geographyPlaylist[geographyTrackIndex];
      geographyAudio.play().catch(() => {});
      updateMusicInfo();
    });
  }

  geographyAudio.play().catch(() => {});
  updateMusicInfo();
}

function toggleGeographyMusic() {
  geographyMusicEnabled = !geographyMusicEnabled;

  if (!geographyMusicEnabled) {
    if (geographyAudio) geographyAudio.pause();
  } else {
    playGeographyMusic();
  }

  updateMusicButton();
}

function nextGeographyTrack() {
  if (geographyPlaylist.length === 0) return;

  geographyTrackIndex = (geographyTrackIndex + 1) % geographyPlaylist.length;

  if (!geographyAudio) {
    geographyAudio = new Audio();
    geographyAudio.volume = 0.35;
  }

  geographyAudio.src = geographyPlaylist[geographyTrackIndex];
  geographyAudio.play().catch(() => {});
  updateMusicInfo();
  updateMusicButton();
}

function updateMusicButton() {
  const btn = document.getElementById("geo-music-toggle");
  if (!btn) return;

  btn.textContent = geographyMusicEnabled ? "♫ Müziği Kapat" : "♫ Müziği Aç";
}

function updateMusicInfo() {
  const info = document.getElementById("geo-music-info");
  if (!info) return;

  const currentTrack = geographyPlaylist[geographyTrackIndex] || "";
  const fileName = currentTrack.split("/").pop() || "Müzik";
  info.textContent = `Çalan: ${fileName}`;
}

/* -----------------------------
   TOPBAR
------------------------------ */
function setTopbar(title, subtitle, mode = "left") {
  const titleEl = document.getElementById("topbar-title");
  const subtitleEl = document.getElementById("topbar-subtitle");
  const topbar = document.getElementById("main-topbar");

  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;

  if (topbar) {
    topbar.classList.remove("topbar-left", "topbar-center");
    topbar.classList.add(mode === "center" ? "topbar-center" : "topbar-left");
  }
}

/* -----------------------------
   HAVACILIK SORULARI
------------------------------ */
const aviationQuestionBank = [
  { q: "Uçaklarda elektrik enerjisinin frekansını sabit tutan ünite hangisidir?", a: "IDG", b: "CSD", c: "Inverter", d: "GCU", correct: "b" },
  { q: "EFIS sisteminde 'ADI' göstergesi neyi ifade eder?", a: "Hız Göstergesi", b: "Yükseklik Göstergesi", c: "Yapay Ufuk", d: "Motor Devri", correct: "c" },
  { q: "Radyo altimetresi uçağın hangi yüksekliğini ölçer?", a: "Deniz seviyesi", b: "Yer seviyesi (AGL)", c: "Standart basınç hattı", d: "Kabin irtifası", correct: "b" },
  { q: "Fly-By-Wire sisteminde pilotun kumandalarını işleyen ana bilgisayar hangisidir?", a: "FMC", b: "ELAC", c: "TCAS", d: "GPWS", correct: "b" },
  { q: "Siyah kutu (FDR) hangi bilgileri kaydeder?", a: "Kokpit seslerini", b: "Uçuş verilerini", c: "Yolcu listesini", d: "Hava durumunu", correct: "b" },
  { q: "TCAS sistemi ne amaçla kullanılır?", a: "Yakıt tasarrufu", b: "Otomatik iniş", c: "Havada çarpışmayı önleme", d: "Buzlanma tespiti", correct: "c" },
  { q: "Static discharger (statik atıcılar) uçağın neresinde bulunur?", a: "Motor içinde", b: "Firar kenarlarında", c: "Kokpit camında", d: "İniş takımında", correct: "b" },
  { q: "DME cihazı hangi bilgiyi kokpite iletir?", a: "Yön bilgisi", b: "Mesafe bilgisi", c: "Hız bilgisi", d: "Yakıt miktarı", correct: "b" },
  { q: "ILS sisteminde süzülüş hattını (dikey hat) veren bileşen hangisidir?", a: "Localizer", b: "Glide Slope", c: "Marker Beacon", d: "Compass", correct: "b" },
  { q: "Bite (Built-in Test Equipment) ne işe yarar?", a: "Yakıt ölçümü", b: "Sistem arıza teşhisi", c: "Hava hızı hesabı", d: "Kabin basıncı", correct: "b" },

  { q: "Uçak kanadında 'burulma' (torsion) yüküne en dirençli yapı hangisidir?", a: "Spar", b: "Rib", c: "Torsion Box", d: "Stringer", correct: "c" },
  { q: "İniş takımlarını acil durumda yerçekimiyle açan sisteme ne denir?", a: "Free Fall", b: "Hydraulic Override", c: "Pneumatic Push", d: "Manual Crank", correct: "a" },
  { q: "Uçak lastiklerindeki 'Chine' yapısının amacı nedir?", a: "Lastiği soğutmak", b: "Suyu motor girişinden uzaklaştırmak", c: "Frenlemeyi artırmak", d: "Daha fazla yük taşımak", correct: "b" },
  { q: "Uçağın ana iskelet yapısına verilen genel ad nedir?", a: "Fuselage", b: "Empennage", c: "Nacelle", d: "Cowling", correct: "a" },
  { q: "Elevator uçağın hangi eksendeki hareketini sağlar?", a: "Dikey (Yaw)", b: "Yanal (Roll)", c: "Boyuna (Pitch)", d: "Merkezi", correct: "c" },
  { q: "Uçağın kanat uçlarındaki girdapları azaltan yapı hangisidir?", a: "Slats", b: "Flaps", c: "Winglet", d: "Spoiler", correct: "c" },
  { q: "Kabin basınçlandırması genellikle nereden sağlanan hava ile yapılır?", a: "Dış hava girişinden", b: "Motor bleed havasından", c: "Oksijen tüplerinden", d: "APU egzozundan", correct: "b" },
  { q: "Hidrolik sistemlerde kullanılan sıvının rengi Skydrol ise nasıldır?", a: "Kırmızı", b: "Mavi", c: "Mor", d: "Sarı", correct: "c" },
  { q: "Uçaklarda yangın söndürme tüplerinde genellikle hangi gaz bulunur?", a: "Oksijen", b: "Azot", c: "Halon", d: "Karbondioksit", correct: "c" },

  { q: "Turbofan motorda 'Bypass Ratio' nedir?", a: "Yakıt/Hava oranı", b: "Soğuk hava / Sıcak hava oranı", c: "Hız / İrtifa oranı", d: "Basınç / Sıcaklık oranı", correct: "b" },
  { q: "APU (Auxiliary Power Unit) uçağın neresinde bulunur?", a: "Kanat altı", b: "Burun kısmı", c: "Kuyruk konisi", d: "Kargo bölümü", correct: "c" },
  { q: "Motorun 'EGT' değeri neyi ölçer?", a: "Yağ sıcaklığı", b: "Egzoz gazı sıcaklığı", c: "Hava giriş hızı", d: "Yakıt basıncı", correct: "b" },
  { q: "Jet motorunda yanmanın gerçekleştiği bölüm hangisidir?", a: "Compressor", b: "Turbine", c: "Combustor", d: "Fan", correct: "c" },
  { q: "Ters itki (Reverse Thrust) ne zaman kullanılır?", a: "Kalkışta", b: "Seyirde", c: "İnişten sonra yavaşlamada", d: "Acil tırmanışta", correct: "c" },
  { q: "FADEC sisteminin görevi nedir?", a: "Kabin içi eğlence", b: "Tam otonom motor kontrolü", c: "İniş takımı kontrolü", d: "Otopilot rotası", correct: "b" },
  { q: "Magneto sistemi hangi tip motorlarda ateşleme sağlar?", a: "Turbojet", b: "Pistonlu", c: "Turbofan", d: "Turboprop", correct: "b" },
  { q: "Motor yağlama sistemindeki 'Chip Detector' neyi tespit eder?", a: "Su karışımını", b: "Metal parçacıklarını", c: "Düşük basıncı", d: "Yüksek sıcaklığı", correct: "b" },
  { q: "Sıcak havalarda uçak performansındaki düşüşün ana sebebi nedir?", a: "Hava yoğunluğunun azalması", b: "Motorun aşırı ısınması", c: "Lastiklerin genleşmesi", d: "Rüzgarın yönü", correct: "a" },
  { q: "Ram Air Turbine (RAT) ne zaman devreye girer?", a: "Kalkış sırasında", b: "Toplam elektrik/hidrolik kaybında", c: "Sadece park halindeyken", d: "Buzlanma durumunda", correct: "b" },

  { q: "ATA 24 hangi sistemi temsil eder?", a: "Hidrolik", b: "Elektrik", c: "Navigasyon", d: "Yangın koruma", correct: "b" },
  { q: "Uçak gövdesindeki en küçük yapı birimine ne denir?", a: "Bulkhead", b: "Stringer", c: "Skin", d: "Frame", correct: "b" },
  { q: "Mach sayısı neyi ifade eder?", a: "İrtifayı", b: "Ses hızına olan oranı", c: "Yakıt tüketimini", d: "Motor gücünü", correct: "b" },
  { q: "V1 hızı neyi temsil eder?", a: "İniş hızı", b: "Karar verme hızı (Kalkış)", c: "Maksimum hız", d: "Stall hızı", correct: "b" },
  { q: "Yorulma çatlaklarını tespit etmek için kullanılan yöntem hangisidir?", a: "NDT", b: "FMC", c: "ECAM", d: "EICAS", correct: "a" },
  { q: "Hava frenleri (Speed Brakes) neyi artırır?", a: "Taşıma (Lift)", b: "Sürükleme (Drag)", c: "İtki (Thrust)", d: "Ağırlık", correct: "b" },
  { q: "Stall durumu nedir?", a: "Motorun durması", b: "Taşıma kuvvetinin kaybı", c: "Lastiğin patlaması", d: "Radyo kaybı", correct: "b" },
  { q: "Varyometre neyi ölçer?", a: "Hızı", b: "Tırmanış/Alçalış oranını", c: "Dış sıcaklığı", d: "Yakıt akışını", correct: "b" },
  { q: "Trim tab sisteminin amacı nedir?", a: "Uçağı hızlandırmak", b: "Pilotun üzerindeki yükü hafifletmek", c: "Yakıtı boşaltmak", d: "Kanatları katlamak", correct: "b" },
  { q: "Uçaklarda 'Outflow Valve' hangi sistemin parçasıdır?", a: "Yakıt", b: "Basınçlandırma", c: "Yangın", d: "Hidrolik", correct: "b" },

  { q: "ATA 32 hangi bölümü kapsar?", a: "Piller", b: "Oksijen", c: "Işıklandırma", d: "İniş Takımları", correct: "d" },
  { q: "FMS açılımı nedir?", a: "Final Mode Selector", b: "Fuel Monitoring System", c: "Fast Moving Satellite", d: "Flight Management System", correct: "d" },
  { q: "ADIRU ünitesi neyi birleştirir?", a: "Motor ve yakıt verisini", b: "Kabin ve kokpit sesini", c: "Hava verisi ve atalet referansını", d: "İniş takımı ve frenleri", correct: "c" },
  { q: "Uçak tekerleklerinde neden azot kullanılır?", a: "Hafiftir", b: "Daha ucuzdur", c: "Rengi güzeldir", d: "Yanmayı önlemek ve stabil basınç için", correct: "d" },
  { q: "Galley uçakta neresidir?", a: "Kokpit", b: "Tuvalet", c: "Kargo", d: "Mutfak", correct: "d" },
  { q: "Transponder 'Squawk' kodu ne için kullanılır?", a: "Hız ölçümü", b: "Yakıt ikmali", c: "İniş izni", d: "Radar kimlik tespiti", correct: "d" },
  { q: "VHF telsizleri genellikle hangi menzilde çalışır?", a: "Kıtalararası", b: "Sualtı", c: "Sadece 10 km", d: "Ufuk hattı (Line of Sight)", correct: "d" },
  { q: "Kabin içi acil durum oksijen maskeleri kaç dakika dayanır?", a: "2 saat", b: "5 dakika", c: "Tüm uçuş boyunca", d: "12-15 dakika", correct: "d" },
  { q: "Aileronlar hangi eksende kontrol sağlar?", a: "Lateral", b: "Longitudinal", c: "Vertical", d: "Normal", correct: "b" },
  { q: "Spoilerlar inişte açıldığında temel amacı nedir?", a: "Hızı artırmak", b: "Motoru soğutmak", c: "Yolcuları uyarmak", d: "Taşıma kuvvetini öldürmek", correct: "d" },
  { q: "Anemometre neyi ölçer?", a: "Nem oranı", b: "Basınç", c: "Hava hızı", d: "Işık şiddeti", correct: "c" },
  { q: "Havacılıkta 'MAYDAY' çağrısı neyi belirtir?", a: "İniş izni talebi", b: "Rutin rapor", c: "Hava durumu bilgisi", d: "Acil durum/Tehlike", correct: "d" },
  { q: "Jiroskop hangi fiziksel prensiple çalışır?", a: "Bernoulli prensibi", b: "Pascal kanunu", c: "Arşimet prensibi", d: "Açısal momentum", correct: "d" },
  { q: "Altimetre hangi basıncı referans alır?", a: "Dinamik basınç", b: "Toplam basınç", c: "Diferansiyel basınç", d: "Statik basınç", correct: "d" },
  { q: "Uçak gövdesinde korozyonu önlemek için kullanılan metal kaplama nedir?", a: "Çelik", b: "Bakır", c: "Alclad", d: "Kurşun", correct: "c" },
  { q: "ATA 30 sistemi hangisidir?", a: "Pnömatik", b: "Kapılar", c: "Pencereler", d: "Buz ve Yağmur Koruma", correct: "d" },
  { q: "Uçak motorunda 'N1' neyin devridir?", a: "Yüksek basınç kompresörü", b: "Yağ pompası", c: "Düşük basınç fanı", d: "Yakıt pompası", correct: "c" },
  { q: "Turboprop motorlarda itkiyi ne sağlar?", a: "Sadece egzoz gazı", b: "Fan kanatları", c: "Pervane", d: "Roket motoru", correct: "c" },
  { q: "Laminar akış nedir?", a: "Türbülanslı akış", b: "Süpersonik akış", c: "Düzgün ve katmanlı hava akışı", d: "Durmuş hava akışı", correct: "c" },
  { q: "Vne hızı neyi ifade eder?", a: "En ekonomik hız", b: "En iyi tırmanma hızı", c: "Asla aşılmaması gereken hız", d: "Yaklaşma hızı", correct: "c" },
  { q: "Uçakta 'Hot Battery Bus' nedir?", a: "Sadece motor çalışırken dolan bar", b: "Sadece kokpit ışıkları", c: "Her zaman enerji olan ana bar", d: "Isıtıcı barı", correct: "c" },
  { q: "VOR seyrüsefer sistemi neye dayanır?", a: "Uydu sinyaline", b: "Lazer ışınına", c: "Yer istasyonu radyo dalgasına", d: "Yıldız haritasına", correct: "c" },
  { q: "Uçaklarda kullanılan 'Skydrol' hidrolik sıvısı bazlıdır?", a: "Mineral", b: "Su", c: "Fosfat Ester", d: "Alkol", correct: "c" },
  { q: "Honeycomb (Petek) yapı neden kullanılır?", a: "Daha ucuz olduğu için", b: "Hafiflik ve yüksek dayanım", c: "Radyo dalgalarını geçirmek için", d: "Isı iletimi için", correct: "b" },
  { q: "Wet Wing (Islak Kanat) ne demektir?", a: "Su inişi yapabilen kanat", b: "Yakıt deposu olarak kullanılan kanat", c: "Buz tutmuş kanat", d: "Yıkanmış kanat", correct: "b" },
  { q: "GPWS sistemi ne uyarısı verir?", a: "Motor arızası", b: "Düşük yakıt", c: "Yere yakınlık uyarısı", d: "Kabin dumanı", correct: "c" },
  { q: "QNH basınç ayarı neyi gösterir?", a: "Havalimanı yüksekliği", b: "Standart irtifa", c: "Kabin basıncı", d: "Deniz seviyesine göre irtifa", correct: "d" },
  { q: "Slatlar kanadın neresinde bulunur?", a: "Firar kenarı", b: "Kanat ucu", c: "Hücum kenarı", d: "Kanat kökü", correct: "c" },
  { q: "Uçak elektrik sisteminde 'Bus Tie Breaker' görevi nedir?", a: "Lambaları yakmak", b: "Voltajı düşürmek", c: "Barları birbirine bağlamak", d: "Frekansı ölçmek", correct: "c" },
  { q: "Anti-icing ve De-icing arasındaki fark nedir?", a: "Aynı şeydir", b: "Biri oluşumu önler, diğeri temizler", c: "Biri sadece motor içindir", d: "Biri elektrikli diğeri sıvılıdır", correct: "b" },
  { q: "Yaw Damper sistemi neyi önler?", a: "Stall", b: "Dutch Roll (Yalpalama)", c: "Aşırı hız", d: "Sert iniş", correct: "b" },
  { q: "Uçaklarda 'Black Box' aslında ne renktir?", a: "Siyah", b: "Beyaz", c: "Sarı", d: "Turuncu", correct: "d" },
  { q: "Glass Cockpit nedir?", a: "Camdan yapılmış kokpit", b: "Dijital ekranlı kokpit", c: "Penceresi çok olan kokpit", d: "Sadece analog saatli kokpit", correct: "b" },
  { q: "Fly-By-Wire sisteminde kablo yerine ne kullanılır?", a: "Mekanik çelik halat", b: "Sıvı boruları", c: "Hava basıncı", d: "Elektrik sinyalleri", correct: "d" },
  { q: "Pylon nedir?", a: "İniş takımı kapağı", b: "Motoru kanada bağlayan yapı", c: "Koltuk ayağı", d: "Kargo kapısı", correct: "b" },
  { q: "Aspect Ratio kanadın neresiyle ilgilidir?", a: "Kalınlığı", b: "Ağırlığı", c: "Boy/En oranı", d: "Rengi", correct: "c" },
  { q: "Uçaklarda 'ELT' cihazı ne zaman çalışır?", a: "Kalkışta", b: "Kaza/Darbe anında", c: "İnişte", d: "Haberleşme kesilince", correct: "b" },
  { q: "Magneto ne üretir?", a: "Yüksek voltajlı kıvılcım", b: "Hidrolik basınç", c: "Hava hızı", d: "Yağ basıncı", correct: "a" },
  { q: "Torque (Tork) hangi uçak tipinde daha kritiktir?", a: "Pervaneli uçaklar", b: "Planörler", c: "Jetler", d: "Balonlar", correct: "a" },
  { q: "Autothrottle sistemi neyi kontrol eder?", a: "Uçağın yönünü", b: "Motor itkisini (gaz kolu)", c: "İniş takımlarını", d: "Kabin ışıklarını", correct: "b" },
  { q: "ATA 21 hangi sistemi temsil eder?", a: "Klimatizasyon/Basınçlandırma", b: "Yakıt", c: "İç donanım", d: "Seyir", correct: "a" },
  { q: "Bernoulli Prensibi havacılıkta neyi açıklar?", a: "Taşıma kuvvetinin oluşumunu", b: "Motorun yanmasını", c: "İniş takımı açılmasını", d: "Radyo dalgalarını", correct: "a" },
  { q: "Hücum açısı (Angle of Attack) nedir?", a: "Kanat profili ile bağıl rüzgar arasındaki açı", b: "Uçağın yere olan açısı", c: "Güneşin açısı", d: "Tekerlek açısı", correct: "a" },
  { q: "Vso hızı neyi ifade eder?", a: "İniş konfigürasyonundaki stall hızı", b: "Maksimum seyir hızı", c: "En iyi süzülüş hızı", d: "Teker kesme hızı", correct: "a" },
  { q: "Uçaklarda kullanılan 400Hz elektriğin avantajı nedir?", a: "Ekipmanların daha hafif olmasını sağlar", b: "Daha uzağa iletilir", c: "Tehlikesizdir", d: "Daha ucuzdur", correct: "a" },
  { q: "Primary Flight Controls (Ana Kumanda Yüzeyleri) nelerdir?", a: "Aileron, Elevator, Rudder", b: "Flap, Slat, Spoiler", c: "Trim, Stabilizer", d: "Motor, Fren", correct: "a" },
  { q: "Maksimum Kalkış Ağırlığı (MTOW) aşılırsa ne olur?", a: "Uçak daha hızlı gider", b: "Yapısal hasar ve performans kaybı olur", c: "Yakıt tasarrufu sağlar", d: "Daha yüksek irtifaya çıkar", correct: "b" },
  { q: "Uçuş sırasında kabin basıncı düştüğünde ne olur?", a: "Uçak hızlanır", b: "Oksijen maskeleri düşer", c: "Motor durur", d: "Kargo kapısı açılır", correct: "b" },
  { q: "CofG (Ağırlık Merkezi) limit dışıysa ne olur?", a: "Uçak dengesizleşir ve kontrol kaybı yaşanabilir", b: "Sadece yakıt artar", c: "Radyo çekmez", d: "Işıklar söner", correct: "a" },
  { q: "Check-list kullanmanın temel amacı nedir?", a: "Ezberi güçlendirmek", b: "Hata payını sıfıra indirip emniyeti sağlamak", c: "Uçuşu uzatmak", d: "Kuleyi bilgilendirmek", correct: "b" },
  { q: "Havacılıkta 'Logbook' ne işe yarar?", a: "Yemek listesidir", b: "Bakım ve uçuş kayıtlarının tutulduğu defterdir", c: "Yolcu pasaport kaydıdır", d: "Hava durumu tahminidir", correct: "b" },
  { q: "Uçakta 'Squawk 7700' ne anlama gelir?", a: "Radyo arızası", b: "Uçak kaçırma", c: "Genel acil durum", d: "Normal uçuş", correct: "c" },
  { q: "Uçakta 'Squawk 7600' ne anlama gelir?", a: "Telsiz/Haberleşme kaybı", b: "Yangın", c: "Yakıt bitmesi", d: "Acil iniş", correct: "a" },
  { q: "Uçakta 'Squawk 7500' ne anlama gelir?", a: "Hava korsanlığı/Müdahale", b: "Motor kaybı", c: "Hasta yolcu", d: "Hava durumu", correct: "a" },
  { q: "Turbofan motorlarda 'Fan' kısmını ne döndürür?", a: "Elektrik motoru", b: "Düşük basınç türbini", c: "Dış hava akımı", d: "Marş motoru", correct: "b" },
  { q: "Süpersonik uçuş ne demektir?", a: "Ses hızından hızlı uçuş", b: "Ses hızında uçuş", c: "Çok yavaş uçuş", d: "Gece uçuşu", correct: "a" },
  { q: "Uçakların pencereleri neden ovaldir?", a: "Daha iyi görünmesi için", b: "Stres birikmesini önleyip çatlamayı engellemek için", c: "Ucuz olduğu için", d: "Geleneksel olduğu için", correct: "b" },
  { q: "Havacılıkta 'ZULU' saati nedir?", a: "Yerel saat", b: "UTC / GMT (Evrensel saat)", c: "Varış saati", d: "Öğle vakti", correct: "b" },
  { q: "Wing Dihedral (Kanat yukarı açısı) neyi artırır?", a: "Hızı", b: "Yanal stabiliteyi (denge)", c: "Ağırlığı", d: "Görünürlüğü", correct: "b" },
  { q: "Bir teknisyen için 'Maintenance Manual' (AMM) nedir?", a: "Hikaye kitabı", b: "İşin nasıl yapılacağını anlatan ana kılavuz", c: "Personel listesi", d: "Alet çantası", correct: "b" }
];

const aviationQuestions = aviationQuestionBank.map(item => {
  const answerMap = { a: 0, b: 1, c: 2, d: 3 };
  return {
    question: item.q,
    answers: [item.a, item.b, item.c, item.d],
    correct: answerMap[item.correct]
  };
});

/* -----------------------------
   COĞRAFYA SORULARI
------------------------------ */
const geographyQuestionBank = [
  { q: "Kanunlarımıza göre nüfusu kaçın altında olan yerleşim birimleri köy kabul edilir?", a: "1.000", b: "2.000", c: "5.000", d: "10.000", correct: "b" },
  { q: "Maki daha çok hangi bölgemizde görülen bir bitki örtüsüdür?", a: "Karadeniz", b: "Doğu Anadolu", c: "Akdeniz", d: "İç Anadolu", correct: "c" },
  { q: "Yüzölçümü bakımından en küçük ilimiz hangisidir?", a: "Yalova", b: "Kilis", c: "Bartın", d: "Bilecik", correct: "a" },
  { q: "Türkiye'nin en kalabalık 4. şehri hangisidir?", a: "Bursa", b: "Antalya", c: "Adana", d: "Konya", correct: "a" },
  { q: "Aşağıdaki illerden hangisinin sadece 1 komşusu vardır?", a: "Yalova", b: "Kilis", c: "Iğdır", d: "Batman", correct: "b" },
  { q: "Alüvyon terimi en çok hangisiyle ilgilidir?", a: "Volkanizma", b: "Akarsular", c: "Buzullar", d: "Rüzgar aşındırması", correct: "b" },
  { q: "Allahüekber Dağları Türkiye'nin hangi bölgesindedir?", a: "Doğu Anadolu", b: "Karadeniz", c: "İç Anadolu", d: "Güneydoğu Anadolu", correct: "a" },
  { q: "KKTC'nin başkenti neresidir?", a: "Gazimağusa", b: "Girne", c: "Lefkoşa", d: "Güzelyurt", correct: "c" },
  { q: "Türkiye'nin başkenti neresidir?", a: "İstanbul", b: "Ankara", c: "İzmir", d: "Bursa", correct: "b" },
  { q: "Türkiye üç tarafı hangi denizlerle çevrilidir?", a: "Karadeniz-Ege-Akdeniz", b: "Akdeniz-Marmara-Hazar", c: "Karadeniz-Hazar-Akdeniz", d: "Ege-Marmara-Hazar", correct: "a" },

  { q: "Türkiye'nin en büyük gölü hangisidir?", a: "Tuz Gölü", b: "Van Gölü", c: "Beyşehir Gölü", d: "Sapanca Gölü", correct: "b" },
  { q: "Türkiye'nin en uzun nehri hangisidir?", a: "Kızılırmak", b: "Fırat", c: "Sakarya", d: "Yeşilırmak", correct: "a" },
  { q: "Türkiye'nin en yüksek dağı hangisidir?", a: "Erciyes", b: "Kaçkar", c: "Ağrı", d: "Süphan", correct: "c" },
  { q: "Pamukkale travertenleri hangi ilimizdedir?", a: "Aydın", b: "Muğla", c: "Denizli", d: "Manisa", correct: "c" },
  { q: "Kapadokya en çok hangi il çevresinde bilinir?", a: "Nevşehir", b: "Sivas", c: "Kayseri", d: "Aksaray", correct: "a" },
  { q: "Türkiye'de çayın en çok yetiştiği il hangisidir?", a: "Trabzon", b: "Rize", c: "Artvin", d: "Giresun", correct: "b" },
  { q: "Fındık üretimiyle öne çıkan ilimiz hangisidir?", a: "Ordu", b: "Kars", c: "Eskişehir", d: "Mersin", correct: "a" },
  { q: "Zeytin en çok hangi bölgemizde yetişir?", a: "Doğu Anadolu", b: "Akdeniz", c: "Ege", d: "Karadeniz", correct: "c" },
  { q: "Karasal iklimin en belirgin görüldüğü bölgemiz hangisidir?", a: "Ege", b: "İç Anadolu", c: "Marmara", d: "Akdeniz", correct: "b" },
  { q: "Türkiye'de nüfusun en seyrek olduğu bölge hangisidir?", a: "Marmara", b: "Ege", c: "Doğu Anadolu", d: "Akdeniz", correct: "c" },

  { q: "Erzurum-Kars çevresinde görülen çayır bitki örtüsü hangi iklim tipiyle ilişkilidir?", a: "Akdeniz", b: "Karasal", c: "Muson", d: "Ekvatoral", correct: "b" },
  { q: "Delta ovaları en çok hangi dış kuvvetin etkisiyle oluşur?", a: "Rüzgarlar", b: "Akarsular", c: "Yer altı suları", d: "Buzullar", correct: "b" },
  { q: "Türkiye'de yaz turizminin en gelişmiş olduğu bölge hangisidir?", a: "Akdeniz", b: "Doğu Anadolu", c: "İç Anadolu", d: "Karadeniz", correct: "a" },
  { q: "Tuz Gölü hangi bölgemizde yer alır?", a: "Ege", b: "Karadeniz", c: "İç Anadolu", d: "Güneydoğu Anadolu", correct: "c" },
  { q: "Nem oranının en fazla olduğu bölgemiz hangisidir?", a: "İç Anadolu", b: "Karadeniz", c: "Doğu Anadolu", d: "Güneydoğu Anadolu", correct: "b" },
  { q: "Türkiye'de en fazla yağış alan il hangisidir?", a: "Rize", b: "Trabzon", c: "Artvin", d: "Antalya", correct: "a" },
  { q: "Türkiye'de en az yağış alan bölgemiz hangisidir?", a: "Akdeniz", b: "İç Anadolu", c: "Güneydoğu Anadolu", d: "Karadeniz", correct: "c" },
  { q: "Boğazlar hangi iki denizi birbirine bağlar?", a: "Karadeniz ile Ege", b: "Karadeniz ile Marmara", c: "Marmara ile Akdeniz", d: "Ege ile Akdeniz", correct: "b" },
  { q: "İstanbul ve Çanakkale Boğazları'nı birbirine bağlayan deniz hangisidir?", a: "Akdeniz", b: "Karadeniz", c: "Marmara", d: "Ege", correct: "c" },
  { q: "Ege Bölgesi'nin kıyı tipi hangisidir?", a: "Boyuna kıyı", b: "Enine kıyı", c: "Ria tipi kıyı", d: "Dalmaçya tipi kıyı", correct: "b" },

  { q: "Karadeniz Bölgesi'nde dağların kıyıya paralel uzanması hangi sonucu doğurur?", a: "Kıyı ile iç kesim ulaşımı kolaylaşır", b: "Kıyı-arka ülke etkileşimi azalır", c: "Tarım alanları artar", d: "Yağış azalır", correct: "b" },
  { q: "Nadas uygulaması en çok hangi bölgemizde görülür?", a: "Karadeniz", b: "İç Anadolu", c: "Marmara", d: "Akdeniz", correct: "b" },
  { q: "Marmara Bölgesi'nin en önemli özelliği nedir?", a: "En büyük yüzölçüme sahip olması", b: "En az nüfuslu olması", c: "Sanayinin en gelişmiş bölge olması", d: "Yükseltisinin en fazla olması", correct: "c" },
  { q: "Adana hangi tarım ürününün üretiminde öne çıkar?", a: "Çay", b: "Pamuk", c: "Fındık", d: "Ayçiçeği", correct: "b" },
  { q: "Ayçiçeği üretiminde öne çıkan bölgemiz hangisidir?", a: "Karadeniz", b: "Güneydoğu Anadolu", c: "Marmara", d: "Doğu Anadolu", correct: "c" },
  { q: "Türkiye'de muz üretimi en çok hangi bölgede yapılır?", a: "Karadeniz", b: "Akdeniz", c: "İç Anadolu", d: "Doğu Anadolu", correct: "b" },
  { q: "Türkiye'de büyükbaş hayvancılık en çok hangi bölgede gelişmiştir?", a: "Doğu Anadolu", b: "Ege", c: "Marmara", d: "Güneydoğu Anadolu", correct: "a" },
  { q: "Küçükbaş hayvancılık en çok hangi bölgede yaygındır?", a: "Karadeniz", b: "İç Anadolu", c: "Marmara", d: "Ege", correct: "b" },
  { q: "Türkiye'de seracılığın en gelişmiş olduğu bölge hangisidir?", a: "Akdeniz", b: "Doğu Anadolu", c: "İç Anadolu", d: "Karadeniz", correct: "a" },
  { q: "Erozyonun en yaygın olduğu bölgelerden biri hangisidir?", a: "Doğu Anadolu", b: "İç Anadolu", c: "Marmara", d: "Ege", correct: "b" },

  { q: "Peribacaları hangi doğal süreçlerle oluşur?", a: "Deprem ve tsunami", b: "Volkanik malzemenin aşınması", c: "Buzulların birikimi", d: "Gelgit hareketleri", correct: "b" },
  { q: "Türkiye'de linyit rezervlerinin fazla olmasının temel sonucu nedir?", a: "Nükleer enerji üretimi", b: "Termik santral sayısının fazla olması", c: "Jeotermal enerji artışı", d: "Hidroelektrik üretiminin azalması", correct: "b" },
  { q: "Petrol üretimiyle öne çıkan ilimiz hangisidir?", a: "Batman", b: "Konya", c: "Erzurum", d: "Çanakkale", correct: "a" },
  { q: "Bor minerali bakımından zengin olan ülke hangisidir?", a: "Türkiye", b: "Japonya", c: "Kanada", d: "Norveç", correct: "a" },
  { q: "Türkiye'nin en batısında bulunan ili hangisidir?", a: "İzmir", b: "Çanakkale", c: "Edirne", d: "Tekirdağ", correct: "c" },
  { q: "Türkiye'nin en doğusunda bulunan il hangisidir?", a: "Van", b: "Iğdır", c: "Hakkâri", d: "Ağrı", correct: "b" },
  { q: "Türkiye'nin güneyinde yer alan deniz hangisidir?", a: "Karadeniz", b: "Marmara Denizi", c: "Akdeniz", d: "Ege Denizi", correct: "c" },
  { q: "Akarsuların denize ulaştığı yerde oluşturduğu birikim şekli hangisidir?", a: "Falez", b: "Delta", c: "Obruk", d: "Moren", correct: "b" },
  { q: "Kıyı aşınım şekillerinden biri hangisidir?", a: "Delta", b: "Menderes", c: "Falez", d: "Birikinti konisi", correct: "c" },
  { q: "Obruk oluşumu en çok hangi kayaç türüyle ilişkilidir?", a: "Granit", b: "Kalker", c: "Bazalt", d: "Mermer", correct: "b" },

  { q: "Dünyanın en büyük okyanusu hangisidir?", a: "Atlas", b: "Hint", c: "Arktik", d: "Pasifik", correct: "d" },
  { q: "Dünyanın en büyük kıtası hangisidir?", a: "Afrika", b: "Avrupa", c: "Asya", d: "Kuzey Amerika", correct: "c" },
  { q: "Dünyanın en küçük kıtası hangisidir?", a: "Avrupa", b: "Avustralya", c: "Antarktika", d: "Güney Amerika", correct: "b" },
  { q: "Nil Nehri hangi kıtadadır?", a: "Avrupa", b: "Asya", c: "Afrika", d: "Güney Amerika", correct: "c" },
  { q: "Amazon Ormanları en çok hangi kıtada yer alır?", a: "Afrika", b: "Güney Amerika", c: "Asya", d: "Avustralya", correct: "b" },
  { q: "Dünyanın en yüksek dağı hangisidir?", a: "K2", b: "Everest", c: "Elbruz", d: "Ağrı", correct: "b" },
  { q: "Ekvator çizgisi dünyanın neresinden geçer?", a: "Kutuplardan", b: "Ortasından", c: "Sadece Avrupa'dan", d: "Sadece okyanuslardan", correct: "b" },
  { q: "Dünya'nın kendi ekseni etrafında dönmesi hangi sonucu doğurur?", a: "Mevsimlerin oluşması", b: "Gece ve gündüzün oluşması", c: "Kıtaların kayması", d: "Volkanların patlaması", correct: "b" },
  { q: "Mevsimlerin oluşmasının temel sebebi nedir?", a: "Dünya'nın günlük hareketi", b: "Ay'ın hareketi", c: "Dünya'nın eksen eğikliği ve yıllık hareketi", d: "Rüzgarlar", correct: "c" },
  { q: "Başkent Paris hangi ülkeye aittir?", a: "İtalya", b: "Fransa", c: "İspanya", d: "Belçika", correct: "b" },

  { q: "Berlin hangi ülkenin başkentidir?", a: "Avusturya", b: "Almanya", c: "İsviçre", d: "Hollanda", correct: "b" },
  { q: "Roma hangi ülkenin başkentidir?", a: "İtalya", b: "Yunanistan", c: "Portekiz", d: "İspanya", correct: "a" },
  { q: "Atina hangi ülkenin başkentidir?", a: "Bulgaristan", b: "Yunanistan", c: "Arnavutluk", d: "Sırbistan", correct: "b" },
  { q: "Moskova hangi ülkenin başkentidir?", a: "Ukrayna", b: "Belarus", c: "Rusya", d: "Kazakistan", correct: "c" },
  { q: "Tokyo hangi ülkenin başkentidir?", a: "Güney Kore", b: "Çin", c: "Tayland", d: "Japonya", correct: "d" },
  { q: "Pekin hangi ülkenin başkentidir?", a: "Japonya", b: "Vietnam", c: "Çin", d: "Moğolistan", correct: "c" },
  { q: "Kahire hangi ülkenin başkentidir?", a: "Mısır", b: "Libya", c: "Tunus", d: "Cezayir", correct: "a" },
  { q: "Ottawa hangi ülkenin başkentidir?", a: "ABD", b: "Kanada", c: "Avustralya", d: "Meksika", correct: "b" },
  { q: "Brezilya'nın başkenti hangisidir?", a: "Rio de Janeiro", b: "Sao Paulo", c: "Brasilia", d: "Buenos Aires", correct: "c" },
  { q: "Arjantin'in başkenti hangisidir?", a: "Lima", b: "Santiago", c: "Montevideo", d: "Buenos Aires", correct: "d" },

  { q: "Afrika'nın en kalabalık ülkelerinden biri hangisidir?", a: "Nijerya", b: "Botsvana", c: "Namibya", d: "Gabon", correct: "a" },
  { q: "Sahra Çölü hangi kıtadadır?", a: "Asya", b: "Afrika", c: "Avustralya", d: "Güney Amerika", correct: "b" },
  { q: "Dünyanın en büyük sıcak çölü hangisidir?", a: "Gobi", b: "Kalahari", c: "Sahra", d: "Atacama", correct: "c" },
  { q: "Gobi Çölü hangi kıtadadır?", a: "Afrika", b: "Asya", c: "Avustralya", d: "Avrupa", correct: "b" },
  { q: "Himalayalar hangi kıtadadır?", a: "Avrupa", b: "Afrika", c: "Asya", d: "Kuzey Amerika", correct: "c" },
  { q: "Alpler hangi kıtadadır?", a: "Avrupa", b: "Asya", c: "Afrika", d: "Avustralya", correct: "a" },
  { q: "Dünya'nın en büyük adası hangisidir?", a: "Madagaskar", b: "Grönland", c: "Borneo", d: "Yeni Gine", correct: "b" },
  { q: "Akdeniz hangi iki kıta arasında yer alır?", a: "Avrupa-Afrika-Asya", b: "Asya-Avustralya", c: "Afrika-Güney Amerika", d: "Avrupa-Kuzey Amerika", correct: "a" },
  { q: "Basra Körfezi hangi kıtadadır?", a: "Afrika", b: "Asya", c: "Avrupa", d: "Avustralya", correct: "b" },
  { q: "Karadeniz'e kıyısı olmayan ülke hangisidir?", a: "Türkiye", b: "Bulgaristan", c: "Romanya", d: "Macaristan", correct: "d" },

  { q: "Türkiye'nin komşusu olmayan ülke hangisidir?", a: "İran", b: "Ermenistan", c: "Azerbaycan", d: "Tacikistan", correct: "d" },
  { q: "Meriç Nehri hangi ülke sınırında önemlidir?", a: "Suriye", b: "Yunanistan", c: "İran", d: "Irak", correct: "b" },
  { q: "Fırat Nehri Türkiye'den sonra hangi ülkelere geçer?", a: "Irak ve İran", b: "Suriye ve Irak", c: "Gürcistan ve Ermenistan", d: "Yunanistan ve Bulgaristan", correct: "b" },
  { q: "Dicle Nehri hangi denize ulaşır?", a: "Karadeniz", b: "Akdeniz", c: "Basra Körfezi", d: "Hazar Denizi", correct: "c" },
  { q: "Konya Ovası hangi bölgede yer alır?", a: "İç Anadolu", b: "Ege", c: "Akdeniz", d: "Marmara", correct: "a" },
  { q: "Bafra ve Çarşamba ovaları hangi bölgemizdedir?", a: "Ege", b: "Karadeniz", c: "Akdeniz", d: "Doğu Anadolu", correct: "b" },
  { q: "Çukurova hangi bölgemizde yer alır?", a: "Ege", b: "Akdeniz", c: "Marmara", d: "Doğu Anadolu", correct: "b" },
  { q: "Ergene Havzası daha çok hangi bölgemizdedir?", a: "Marmara", b: "Ege", c: "Karadeniz", d: "İç Anadolu", correct: "a" },
  { q: "Doğu Anadolu Bölgesi'nin en önemli ekonomik faaliyetlerinden biri hangisidir?", a: "Balıkçılık", b: "Büyükbaş hayvancılık", c: "Zeytincilik", d: "Seracılık", correct: "b" },
  { q: "Karadeniz Bölgesi'nde hangi ekonomik faaliyet yaygındır?", a: "Pamuk tarımı", b: "Çay ve fındık tarımı", c: "Seracılık", d: "Zeytincilik", correct: "b" },

  { q: "Ege Bölgesi'nde en yaygın tarım ürünlerinden biri hangisidir?", a: "Çay", b: "Zeytin", c: "Kayısı", d: "Muz", correct: "b" },
  { q: "Malatya hangi tarım ürünüyle meşhurdur?", a: "İncir", b: "Kayısı", c: "Fındık", d: "Üzüm", correct: "b" },
  { q: "Aydın en çok hangi ürünüyle bilinir?", a: "İncir", b: "Çay", c: "Pamuk", d: "Muz", correct: "a" },
  { q: "Gaziantep hangi ürünüyle öne çıkar?", a: "Çay", b: "Fıstık", c: "Ayçiçeği", d: "Keten", correct: "b" },
  { q: "Kars hangi hayvansal ürünüyle bilinir?", a: "Zeytin", b: "Kaşar peyniri", c: "Balık", d: "İpek", correct: "b" },
  { q: "Antalya'nın ekonomik faaliyetlerinden biri hangisidir?", a: "Çay tarımı", b: "Turizm", c: "Taş kömürü", d: "Büyükbaş hayvancılık", correct: "b" },
  { q: "Zonguldak hangi yer altı kaynağıyla bilinir?", a: "Petrol", b: "Taş kömürü", c: "Bor", d: "Bakır", correct: "b" },
  { q: "Afyonkarahisar hangi yer altı kaynağıyla öne çıkar?", a: "Mermer", b: "Petrol", c: "Linyit", d: "Demir", correct: "a" },
  { q: "Jeotermal enerji bakımından öne çıkan illerden biri hangisidir?", a: "Aydın", b: "Kars", c: "Sinop", d: "Rize", correct: "a" },
  { q: "Türkiye'de deprem riski en az olan bölgelerden biri hangisidir?", a: "Marmara", b: "Ege", c: "İç Anadolu", d: "Doğu Anadolu", correct: "c" },

  { q: "Kuzey Anadolu Fay Hattı hangi bölgelerde etkilidir?", a: "Marmara ve Karadeniz çevresi", b: "Sadece Akdeniz kıyıları", c: "Sadece Güneydoğu", d: "Sadece İç Anadolu", correct: "a" },
  { q: "Volkanik dağlardan biri hangisidir?", a: "Uludağ", b: "Erciyes", c: "Yıldız Dağları", d: "Kaz Dağı", correct: "b" },
  { q: "Türkiye'de kapalı havza örneklerinden biri hangisidir?", a: "Konya Havzası", b: "Meriç Havzası", c: "Fırat Havzası", d: "Çoruh Havzası", correct: "a" },
  { q: "Menderesli akarsu özelliği hangi eğimin göstergesidir?", a: "Fazla eğim", b: "Az eğim", c: "Dik yamaç", d: "Volkanik yapı", correct: "b" },
  { q: "Haliç oluşumu en çok neyle ilgilidir?", a: "Buzul aşındırması", b: "Akarsu ağzının deniz suları altında kalması", c: "Rüzgar biriktirmesi", d: "Volkan patlaması", correct: "b" },
  { q: "Fiyort tipi kıyılar Türkiye'de neden görülmez?", a: "Gelgit az olduğu için", b: "Buzul etkisi yeterli olmadığı için", c: "Akarsu fazla olduğu için", d: "Volkanizma az olduğu için", correct: "b" },
  { q: "Türkiye'de kış turizmiyle öne çıkan merkezlerden biri hangisidir?", a: "Bodrum", b: "Uludağ", c: "Alanya", d: "Datça", correct: "b" },
  { q: "Pamuk üretimi için en uygun iklim hangisidir?", a: "Serin ve yağışlı", b: "Sıcak ve uzun yazlı", c: "Çok soğuk", d: "Yıl boyu karlı", correct: "b" },
  { q: "Orman bakımından en zengin bölgemiz hangisidir?", a: "Karadeniz", b: "Güneydoğu Anadolu", c: "İç Anadolu", d: "Doğu Anadolu", correct: "a" },
  { q: "Türkiye'nin nüfus bakımından en büyük şehri hangisidir?", a: "Ankara", b: "İzmir", c: "İstanbul", d: "Bursa", correct: "c" }
];

const geographyQuestions = geographyQuestionBank.map(item => {
  const answerMap = { a: 0, b: 1, c: 2, d: 3 };
  return {
    question: item.q,
    answers: [item.a, item.b, item.c, item.d],
    correct: answerMap[item.correct]
  };
});

/* -----------------------------
   PLAKA VERİSİ
------------------------------ */
const plateData = [
  { city: "Adana", plate: "01" },
  { city: "Adıyaman", plate: "02" },
  { city: "Afyonkarahisar", plate: "03" },
  { city: "Ağrı", plate: "04" },
  { city: "Amasya", plate: "05" },
  { city: "Ankara", plate: "06" },
  { city: "Antalya", plate: "07" },
  { city: "Artvin", plate: "08" },
  { city: "Aydın", plate: "09" },
  { city: "Balıkesir", plate: "10" },
  { city: "Bilecik", plate: "11" },
  { city: "Bingöl", plate: "12" },
  { city: "Bitlis", plate: "13" },
  { city: "Bolu", plate: "14" },
  { city: "Burdur", plate: "15" },
  { city: "Bursa", plate: "16" },
  { city: "Çanakkale", plate: "17" },
  { city: "Çankırı", plate: "18" },
  { city: "Çorum", plate: "19" },
  { city: "Denizli", plate: "20" },
  { city: "Diyarbakır", plate: "21" },
  { city: "Edirne", plate: "22" },
  { city: "Elazığ", plate: "23" },
  { city: "Erzincan", plate: "24" },
  { city: "Erzurum", plate: "25" },
  { city: "Eskişehir", plate: "26" },
  { city: "Gaziantep", plate: "27" },
  { city: "Giresun", plate: "28" },
  { city: "Gümüşhane", plate: "29" },
  { city: "Hakkâri", plate: "30" },
  { city: "Hatay", plate: "31" },
  { city: "Isparta", plate: "32" },
  { city: "Mersin", plate: "33" },
  { city: "İstanbul", plate: "34" },
  { city: "İzmir", plate: "35" },
  { city: "Kars", plate: "36" },
  { city: "Kastamonu", plate: "37" },
  { city: "Kayseri", plate: "38" },
  { city: "Kırklareli", plate: "39" },
  { city: "Kırşehir", plate: "40" },
  { city: "Kocaeli", plate: "41" },
  { city: "Konya", plate: "42" },
  { city: "Kütahya", plate: "43" },
  { city: "Malatya", plate: "44" },
  { city: "Manisa", plate: "45" },
  { city: "Kahramanmaraş", plate: "46" },
  { city: "Mardin", plate: "47" },
  { city: "Muğla", plate: "48" },
  { city: "Muş", plate: "49" },
  { city: "Nevşehir", plate: "50" },
  { city: "Niğde", plate: "51" },
  { city: "Ordu", plate: "52" },
  { city: "Rize", plate: "53" },
  { city: "Sakarya", plate: "54" },
  { city: "Samsun", plate: "55" },
  { city: "Siirt", plate: "56" },
  { city: "Sinop", plate: "57" },
  { city: "Sivas", plate: "58" },
  { city: "Tekirdağ", plate: "59" },
  { city: "Tokat", plate: "60" },
  { city: "Trabzon", plate: "61" },
  { city: "Tunceli", plate: "62" },
  { city: "Şanlıurfa", plate: "63" },
  { city: "Uşak", plate: "64" },
  { city: "Van", plate: "65" },
  { city: "Yozgat", plate: "66" },
  { city: "Zonguldak", plate: "67" },
  { city: "Aksaray", plate: "68" },
  { city: "Bayburt", plate: "69" },
  { city: "Karaman", plate: "70" },
  { city: "Kırıkkale", plate: "71" },
  { city: "Batman", plate: "72" },
  { city: "Şırnak", plate: "73" },
  { city: "Bartın", plate: "74" },
  { city: "Ardahan", plate: "75" },
  { city: "Iğdır", plate: "76" },
  { city: "Yalova", plate: "77" },
  { city: "Karabük", plate: "78" },
  { city: "Kilis", plate: "79" },
  { city: "Osmaniye", plate: "80" },
  { city: "Düzce", plate: "81" }
];

/* -----------------------------
   STATE
------------------------------ */
let currentGame = null;

/* -----------------------------
   MENÜ
------------------------------ */
function renderHome() {
  stopGeographyMusic();
  currentGame = null;
  setTopbar("✈ Game Hub", "Havacılık ve Bilgi Oyunları Platformu", "center");

  appScreen.innerHTML = `
    <div class="menu-hero">
      <div class="menu-hero-badge">AvioQuiz</div>
      <div class="menu-title">
        <h2>Oyun Merkezi</h2>
        <p>Bilgi, hız ve görsel deneyimi tek ekranda birleştiren oyun alanı.</p>
      </div>
    </div>

    <div class="game-grid">
      <div class="game-card card-aviation">
        <div class="card-icon">✈</div>
        <h3>Havacılık Testi</h3>
        <p>Temel havacılık, kokpit, uçuş prensipleri ve teknik sorularla bilginizi ölçün.</p>
        <div class="card-footer">
          <span class="card-tag">${aviationQuestions.length} Soru</span>
          <button id="start-aviation">Başlat</button>
        </div>
      </div>

      <div class="game-card card-plate">
        <div class="card-icon">🗺️</div>
        <h3>Plaka Bilme Oyunu</h3>
        <p>Şehir plakalarını tahmin et. Harita üzerinden ili gör, doğru cevabı hızla yakala.</p>
        <div class="card-footer">
          <span class="card-tag">81 Soru</span>
          <button id="start-plate">Başlat</button>
        </div>
      </div>

      <div class="game-card card-coming">
        <div class="card-icon">🌍</div>
        <h3>Coğrafya Soruları</h3>
        <p>Kıtalar, ülkeler, dağlar, denizler ve temel coğrafya bilgilerini test et.</p>
        <div class="card-footer">
          <span class="card-tag">${geographyQuestions.length} Soru</span>
          <button id="start-geography">Başlat</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("start-aviation").addEventListener("click", startAviationGame);
  document.getElementById("start-plate").addEventListener("click", startPlateGame);
  document.getElementById("start-geography").addEventListener("click", startGeographyGame);
}

/* -----------------------------
   HAVACILIK OYUNU
------------------------------ */
function startAviationGame() {
  stopGeographyMusic();
  setTopbar("✈ Havacılık Testi", "Teknik bilgi ve temel uçuş soruları", "left");

  currentGame = {
    type: "aviation",
    questions: shuffleArray([...aviationQuestions]),
    currentQuestion: 0,
    score: 0,
    selectedAnswers: new Array(aviationQuestions.length).fill(null)
  };

  renderAviationGame();
}

function renderAviationGame() {
  const game = currentGame;
  const q = game.questions[game.currentQuestion];

  appScreen.innerHTML = `
    <div class="game-toolbar">
      <button class="secondary-btn menu-btn" id="back-home">← Menü</button>
      <div class="toolbar-badge">✈ Havacılık Testi</div>
    </div>

    <div class="compact-stats">
      <div class="mini-stat"><span>Soru</span><strong>${game.currentQuestion + 1} / ${game.questions.length}</strong></div>
      <div class="mini-stat"><span>Puan</span><strong>${game.score}</strong></div>
    </div>

    <div class="progress-area">
      <div class="progress-bar">
        <div class="progress-fill" style="width:${((game.currentQuestion + 1) / game.questions.length) * 100}%"></div>
      </div>
    </div>

    <section class="question-card">
      <h2>${q.question}</h2>
      <div class="answers" id="answers-container"></div>
    </section>

    <div class="nav-row">
      <button class="nav-btn" id="prev-btn" ${game.currentQuestion === 0 ? "disabled" : ""}>← Önceki</button>
      <button class="nav-btn" id="next-btn">${game.currentQuestion === game.questions.length - 1 ? "Testi Bitir" : "Sonraki →"}</button>
    </div>
  `;

  const answersContainer = document.getElementById("answers-container");
  const selected = game.selectedAnswers[game.currentQuestion];

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;

    if (selected !== null) {
      if (index === q.correct) button.classList.add("correct");
      if (index === selected && index !== q.correct) button.classList.add("wrong");
      button.disabled = true;
    }

    button.addEventListener("click", () => {
      if (game.selectedAnswers[game.currentQuestion] !== null) return;

      game.selectedAnswers[game.currentQuestion] = index;

      if (index === q.correct) {
        game.score += 10;
      } else {
        game.score = Math.max(0, game.score - 5);
      }

      renderAviationGame();
    });

    answersContainer.appendChild(button);
  });

  document.getElementById("back-home").addEventListener("click", renderHome);
  document.getElementById("prev-btn").addEventListener("click", () => {
    if (game.currentQuestion > 0) {
      game.currentQuestion--;
      renderAviationGame();
    }
  });
  document.getElementById("next-btn").addEventListener("click", () => {
    if (game.currentQuestion === game.questions.length - 1) {
      renderAviationResult();
    } else {
      game.currentQuestion++;
      renderAviationGame();
    }
  });
}

function renderAviationResult() {
  const game = currentGame;
  const total = game.questions.length * 10;

  let message = "Daha fazla pratik yapmalısın.";
  if (game.score === total) message = "Mükemmel performans.";
  else if (game.score >= total * 0.6) message = "İyi performans.";

  appScreen.innerHTML = `
    <div class="result-box">
      <h2>Havacılık Testi Tamamlandı</h2>
      <p class="result-score">Toplam Puanın: <strong>${game.score} / ${total}</strong></p>
      <p class="result-message">${message}</p>
      <div class="result-actions">
        <button id="restart-aviation">Yeniden Başlat</button>
        <button class="secondary-btn menu-btn" id="back-home">← Menü</button>
      </div>
    </div>
  `;

  document.getElementById("restart-aviation").addEventListener("click", startAviationGame);
  document.getElementById("back-home").addEventListener("click", renderHome);
}

/* -----------------------------
   COĞRAFYA OYUNU
------------------------------ */
function startGeographyGame() {
  setTopbar("🌍 Coğrafya Soruları", "Kıtalar, ülkeler ve genel coğrafya bilgisi", "left");

  currentGame = {
    type: "geography",
    questions: shuffleArray([...geographyQuestions]),
    currentQuestion: 0,
    score: 0,
    selectedAnswers: new Array(geographyQuestions.length).fill(null)
  };

  if (!geographyAudio) {
    geographyTrackIndex = 0;
  }

  playGeographyMusic();
  renderGeographyGame();
}

function renderGeographyGame() {
  const game = currentGame;
  const q = game.questions[game.currentQuestion];

  appScreen.innerHTML = `
    <div class="game-toolbar">
      <button class="secondary-btn menu-btn" id="back-home">← Menü</button>
      <div class="toolbar-badge">🌍 Coğrafya Soruları</div>
    </div>

    <div class="geo-music-bar">
      <div class="geo-music-left">
        <span class="geo-music-chip">🎵 Arka Plan Müziği</span>
        <span class="geo-music-info" id="geo-music-info">Çalan: -</span>
      </div>
      <div class="geo-music-actions">
        <button class="secondary-btn" id="geo-music-toggle">♫ Müziği Kapat</button>
        <button class="secondary-btn" id="geo-music-next">⏭ Sonraki</button>
      </div>
    </div>

<div class="geo-signature">❤️ EVRİM ÖZER ❤️</div>

    <div class="compact-stats">
      <div class="mini-stat"><span>Soru</span><strong>${game.currentQuestion + 1} / ${game.questions.length}</strong></div>
      <div class="mini-stat"><span>Puan</span><strong>${game.score}</strong></div>
    </div>

    <div class="progress-area">
      <div class="progress-bar">
        <div class="progress-fill" style="width:${((game.currentQuestion + 1) / game.questions.length) * 100}%"></div>
      </div>
    </div>

    <section class="question-card">
      <div class="question-chip">Coğrafya Testi</div>
      <h2>${q.question}</h2>
      <div class="answers" id="answers-container"></div>
    </section>

    <div class="nav-row">
      <button class="nav-btn" id="prev-btn" ${game.currentQuestion === 0 ? "disabled" : ""}>← Önceki</button>
      <button class="nav-btn" id="next-btn">${game.currentQuestion === game.questions.length - 1 ? "Testi Bitir" : "Sonraki →"}</button>
    </div>
  `;

  const answersContainer = document.getElementById("answers-container");
  const selected = game.selectedAnswers[game.currentQuestion];

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;

    if (selected !== null) {
      if (index === q.correct) button.classList.add("correct");
      if (index === selected && index !== q.correct) button.classList.add("wrong");
      button.disabled = true;
    }

    button.addEventListener("click", () => {
      if (game.selectedAnswers[game.currentQuestion] !== null) return;

      game.selectedAnswers[game.currentQuestion] = index;

      if (index === q.correct) {
        game.score += 10;
      } else {
        game.score = Math.max(0, game.score - 5);
      }

      renderGeographyGame();
    });

    answersContainer.appendChild(button);
  });

  document.getElementById("back-home").addEventListener("click", renderHome);

  document.getElementById("prev-btn").addEventListener("click", () => {
    if (game.currentQuestion > 0) {
      game.currentQuestion--;
      renderGeographyGame();
    }
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    if (game.currentQuestion === game.questions.length - 1) {
      renderGeographyResult();
    } else {
      game.currentQuestion++;
      renderGeographyGame();
    }
  });

  document.getElementById("geo-music-toggle").addEventListener("click", toggleGeographyMusic);
  document.getElementById("geo-music-next").addEventListener("click", nextGeographyTrack);

  updateMusicButton();
  updateMusicInfo();
}

function renderGeographyResult() {
  stopGeographyMusic();

  const game = currentGame;
  const total = game.questions.length * 10;

  let message = "Coğrafya tekrarına ihtiyacın var.";
  if (game.score === total) message = "Mükemmel sonuç. Coğrafya bilgin çok güçlü.";
  else if (game.score >= total * 0.6) message = "İyi performans. Birkaç tekrar ile daha da iyi olur.";

  appScreen.innerHTML = `
    <div class="result-box">
      <h2>Coğrafya Testi Tamamlandı</h2>
      <p class="result-score">Toplam Puanın: <strong>${game.score} / ${total}</strong></p>
      <p class="result-message">${message}</p>
      <div class="result-actions">
        <button id="restart-geography">Yeniden Başlat</button>
        <button class="secondary-btn menu-btn" id="back-home">← Menü</button>
      </div>
    </div>
  `;

  document.getElementById("restart-geography").addEventListener("click", startGeographyGame);
  document.getElementById("back-home").addEventListener("click", renderHome);
}

/* -----------------------------
   PLAKA OYUNU
------------------------------ */
function startPlateGame() {
  stopGeographyMusic();
  setTopbar("🗺️ Plaka Bilme Oyunu", "Harita destekli şehir plaka testi", "left");

  const selectedCities = shuffleArray([...plateData]);

  currentGame = {
    type: "plate",
    questions: selectedCities,
    currentQuestion: 0,
    score: 0,
    selectedAnswers: new Array(selectedCities.length).fill(null),
    optionsCache: {}
  };

  renderPlateGame();
}

function renderPlateMap() {
  return `
    <div class="map-card">
      <div class="map-card-title">Türkiye Haritası</div>
      <div class="svg-map-wrapper compact-map-wrapper" id="svg-map-wrapper">
        <div class="map-loading">Harita yükleniyor...</div>
      </div>
    </div>
  `;
}

async function loadTurkeyMap(activePlate) {
  const mapWrapper = document.getElementById("svg-map-wrapper");
  if (!mapWrapper) return;

  try {
    const response = await fetch("images/tr.svg");
    const svgText = await response.text();

    mapWrapper.innerHTML = svgText;

    const svgElement = mapWrapper.querySelector("svg");
    if (!svgElement) return;

    svgElement.classList.add("turkey-map-svg");

    const allCities = svgElement.querySelectorAll("path[id^='TR'], g[id^='TR']");
    allCities.forEach(city => {
      city.classList.remove("active-city");
      city.classList.remove("active-city-pulse");
    });

    const targetId = `TR${activePlate}`;
    const activeCity = svgElement.querySelector(`#${targetId}`);

    if (activeCity) {
      activeCity.classList.add("active-city");
      setTimeout(() => activeCity.classList.add("active-city-pulse"), 80);
    }
  } catch (error) {
    mapWrapper.innerHTML = `<div class="map-loading">Harita yüklenemedi.</div>`;
    console.error("SVG harita yükleme hatası:", error);
  }
}

function buildPlateOptions(correctPlate) {
  const wrongOptions = shuffleArray(
    plateData.filter(item => item.plate !== correctPlate).map(item => item.plate)
  ).slice(0, 3);

  return shuffleArray([correctPlate, ...wrongOptions]);
}

function renderPlateGame() {
  const game = currentGame;
  const currentItem = game.questions[game.currentQuestion];
  const selected = game.selectedAnswers[game.currentQuestion];

  if (!game.optionsCache[game.currentQuestion]) {
    game.optionsCache[game.currentQuestion] = buildPlateOptions(currentItem.plate);
  }

  const options = game.optionsCache[game.currentQuestion];

  appScreen.innerHTML = `
    <div class="game-toolbar">
      <button class="secondary-btn menu-btn small-menu-btn" id="back-home">← Menü</button>
      <div class="toolbar-badge">🗺️ Plaka Bilme Oyunu</div>
    </div>

    ${renderPlateMap()}

    <div class="compact-stats">
      <div class="mini-stat"><span>Soru</span><strong>${game.currentQuestion + 1} / ${game.questions.length}</strong></div>
      <div class="mini-stat"><span>Puan</span><strong>${game.score}</strong></div>
      <div class="mini-stat"><span>İl</span><strong>${currentItem.city}</strong></div>
    </div>

    <div class="progress-area compact-progress">
      <div class="progress-bar">
        <div class="progress-fill" style="width:${((game.currentQuestion + 1) / game.questions.length) * 100}%"></div>
      </div>
    </div>

    <section class="question-card">
      <div class="question-chip">Harita Sorusu</div>
      <h2>${currentItem.city} ilinin plaka kodu nedir?</h2>
      <div class="answers plate-answers" id="answers-container"></div>
    </section>

    <div class="nav-row">
      <button class="nav-btn" id="prev-btn" ${game.currentQuestion === 0 ? "disabled" : ""}>← Önceki</button>
      <button class="nav-btn" id="next-btn">${game.currentQuestion === game.questions.length - 1 ? "Oyunu Bitir" : "Sonraki →"}</button>
    </div>
  `;

  const answersContainer = document.getElementById("answers-container");

  options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;

    if (selected !== null) {
      if (option === currentItem.plate) button.classList.add("correct");
      if (option === selected && option !== currentItem.plate) button.classList.add("wrong");
      button.disabled = true;
    }

    button.addEventListener("click", () => {
      if (game.selectedAnswers[game.currentQuestion] !== null) return;

      game.selectedAnswers[game.currentQuestion] = option;

      if (option === currentItem.plate) {
        game.score += 10;
      } else {
        game.score = Math.max(0, game.score - 5);
      }

      renderPlateGame();
    });

    answersContainer.appendChild(button);
  });

  document.getElementById("back-home").addEventListener("click", renderHome);
  document.getElementById("prev-btn").addEventListener("click", () => {
    if (game.currentQuestion > 0) {
      game.currentQuestion--;
      renderPlateGame();
    }
  });
  document.getElementById("next-btn").addEventListener("click", () => {
    if (game.currentQuestion === game.questions.length - 1) {
      renderPlateResult();
    } else {
      game.currentQuestion++;
      renderPlateGame();
    }
  });

  loadTurkeyMap(currentItem.plate);
}

function renderPlateResult() {
  const game = currentGame;
  const total = game.questions.length * 10;

  let message = "Plaka tekrarına ihtiyacın var.";
  if (game.score === total) message = "Mükemmel sonuç. Harita ve plaka eşleştirmen çok güçlü.";
  else if (game.score >= total * 0.6) message = "İyi performans. Biraz daha tekrar ile çok daha iyi olur.";

  appScreen.innerHTML = `
    <div class="result-box">
      <h2>Plaka Oyunu Tamamlandı</h2>
      <p class="result-score">Toplam Puanın: <strong>${game.score} / ${total}</strong></p>
      <p class="result-message">${message}</p>
      <div class="result-actions">
        <button id="restart-plate">Yeniden Başlat</button>
        <button class="secondary-btn menu-btn" id="back-home">← Menü</button>
      </div>
    </div>
  `;

  document.getElementById("restart-plate").addEventListener("click", startPlateGame);
  document.getElementById("back-home").addEventListener("click", renderHome);
}

/* -----------------------------
   YARDIMCI
------------------------------ */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

renderHome();