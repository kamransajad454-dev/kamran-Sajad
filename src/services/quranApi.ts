import { Surah, SurahDetail, Reciter } from "../types";

const BASE_URL = "https://api.alquran.cloud/v1";

export async function getSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE_URL}/surah`);
  const data = await res.json();
  return data.data;
}

export async function getSurahDetail(number: number, edition: string = "quran-uthmani"): Promise<SurahDetail> {
  const res = await fetch(`${BASE_URL}/surah/${number}/${edition}`);
  const data = await res.json();
  return data.data;
}

export async function getSurahWithTranslation(number: number, translationEdition: string = "en.sahih"): Promise<SurahDetail> {
  const res = await fetch(`${BASE_URL}/surah/${number}/${translationEdition}`);
  const data = await res.json();
  return data.data;
}

export async function getReciters(): Promise<Reciter[]> {
  const res = await fetch(`${BASE_URL}/edition?format=audio&language=ar&type=versebyverse`);
  const data = await res.json();
  // Filter for popular ones or just return a subset for better UX
  const popular = ["ar.alafasy", "ar.abdulsamad", "ar.husary", "ar.minshawi", "ar.shaatree"];
  return data.data.filter((r: Reciter) => popular.includes(r.identifier));
}

export async function getAudioForSurah(surahNumber: number, reciterIdentifier: string = "ar.alafasy"): Promise<any> {
  const res = await fetch(`${BASE_URL}/surah/${surahNumber}/${reciterIdentifier}`);
  const data = await res.json();
  return data.data;
}
