// Bu dosya native (Capacitor/Android) reklam köprüsünün KAYNAK dosyasıdır.
// Doğrudan index.html'e eklenmez — esbuild ile www/native-ads-bundle.js olarak
// paketlenir (npm run build:ads). Sebep: @capacitor-community/admob bir npm
// paketi olduğu için tarayıcıda <script> ile doğrudan çalışmaz, bundle gerekir.
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';

// --- TEST ID'leri (Google'ın resmi herkese açık test reklam birimleri) ---
// AdMob hesabı açılıp gerçek bir uygulama/reklam birimi oluşturulduğunda:
//   1) ADS_TEST_MODE'u false yap
//   2) PROD_INTERSTITIAL_AD_ID / PROD_REWARDED_AD_ID değerlerini kendi AdMob
//      panelinden aldığın gerçek ad unit ID'leriyle değiştir
//   3) AndroidManifest.xml'deki com.google.android.gms.ads.APPLICATION_ID
//      değerini gerçek AdMob App ID'siyle değiştir (bkz. MOBILE_APP.md)
const ADS_TEST_MODE = true;
const TEST_INTERSTITIAL_AD_ID = 'ca-app-pub-3940256099942544/1033173712';
const TEST_REWARDED_AD_ID = 'ca-app-pub-3940256099942544/5224354917';
const PROD_INTERSTITIAL_AD_ID = 'BURAYA_GERCEK_INTERSTITIAL_AD_ID';
const PROD_REWARDED_AD_ID = 'BURAYA_GERCEK_REWARDED_AD_ID';

const INTERSTITIAL_AD_ID = ADS_TEST_MODE ? TEST_INTERSTITIAL_AD_ID : PROD_INTERSTITIAL_AD_ID;
const REWARDED_AD_ID = ADS_TEST_MODE ? TEST_REWARDED_AD_ID : PROD_REWARDED_AD_ID;

const isNative = () => Capacitor.isNativePlatform();

let initPromise = null;
let interstitialReady = false;
let rewardedReady = false;
let lastInterstitialAt = 0;
const MIN_INTERSTITIAL_GAP_MS = 20000; // AdMob politikası: art arda reklam göstermeyi önle

function preloadInterstitial() {
  interstitialReady = false;
  AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID, isTesting: ADS_TEST_MODE })
    .then(() => { interstitialReady = true; })
    .catch(() => { interstitialReady = false; });
}

function preloadRewarded() {
  rewardedReady = false;
  AdMob.prepareRewardVideoAd({ adId: REWARDED_AD_ID, isTesting: ADS_TEST_MODE })
    .then(() => { rewardedReady = true; })
    .catch(() => { rewardedReady = false; });
}

async function requestAndShowConsentIfNeeded() {
  try {
    const info = await AdMob.requestConsentInfo({ debugGeography: undefined });
    if (info.status === 'REQUIRED' && info.isConsentFormAvailable) {
      await AdMob.showConsentForm();
    }
  } catch (e) {
    // UMP formu yüklenemezse (örn. bölge desteklenmiyor) sessizce geç —
    // reklamlar niş kişiselleştirilmemiş modda çalışmaya devam eder.
  }
}

// Google'ın "EU User Consent Policy" kuralı gereği kullanıcı, onayını
// istediği an değiştirebilmeli (Ayarlar → "Reklam Onayını Yönet").
async function showPrivacyOptions() {
  if (!isNative()) return;
  try {
    await AdMob.resetConsentInfo();
    const info = await AdMob.requestConsentInfo();
    if (info.isConsentFormAvailable) await AdMob.showConsentForm();
  } catch (e) {}
}

function init() {
  if (!isNative()) return Promise.resolve();
  if (initPromise) return initPromise;
  initPromise = requestAndShowConsentIfNeeded()
    .then(() => AdMob.initialize({ initializeForTesting: ADS_TEST_MODE }))
    .then(() => { preloadInterstitial(); preloadRewarded(); })
    .catch(() => {});
  return initPromise;
}

async function showInterstitial(onClose) {
  if (!isNative()) { onClose && onClose(); return; }
  const now = Date.now();
  if (now - lastInterstitialAt < MIN_INTERSTITIAL_GAP_MS) { onClose && onClose(); return; }
  try {
    if (!interstitialReady) await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID, isTesting: ADS_TEST_MODE });
    lastInterstitialAt = Date.now();
    await AdMob.showInterstitial();
  } catch (e) {
    // Reklam yüklenemediyse oyunu bloklamadan devam et
  } finally {
    onClose && onClose();
    preloadInterstitial();
  }
}

async function showRewarded(onReward, onCancel) {
  if (!isNative()) { onCancel && onCancel(); return; }
  try {
    if (!rewardedReady) await AdMob.prepareRewardVideoAd({ adId: REWARDED_AD_ID, isTesting: ADS_TEST_MODE });
    let gotReward = false;
    const rewardListener = await AdMob.addListener('onRewardedVideoAdReward', () => { gotReward = true; });
    const dismissListener = await AdMob.addListener('onRewardedVideoAdDismissed', () => {
      rewardListener.remove();
      dismissListener.remove();
      preloadRewarded();
      if (gotReward) onReward && onReward(); else onCancel && onCancel();
    });
    await AdMob.showRewardVideoAd();
  } catch (e) {
    preloadRewarded();
    onCancel && onCancel();
  }
}

window.NativeAds = { isNative, init, showInterstitial, showRewarded, showPrivacyOptions };
