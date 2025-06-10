/**
 * Yardımcı fonksiyonlar
 */

/**
 * Verilen metni belirli bir uzunlukta kırpar ve sonuna üç nokta ekler
 * @param {string} text - Kırpılacak metin
 * @param {number} maxLength - Maksimum uzunluk
 * @returns {string} Kırpılmış metin
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Sayıyı okunabilir formata dönüştürür (örn. 1000 -> 1K)
 * @param {number} num - Sayı
 * @returns {string} Formatlanmış sayı
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
};

/**
 * Tarihi okunabilir formata dönüştürür
 * @param {string|Date} date - Tarih
 * @param {string} format - Format ('short', 'medium', 'long')
 * @returns {string} Formatlanmış tarih
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const options = {
    short: { day: 'numeric', month: 'numeric', year: '2-digit' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
  };
  
  return dateObj.toLocaleDateString('tr-TR', options[format]);
};

/**
 * İki tarih arasındaki farkı hesaplar
 * @param {string|Date} date1 - İlk tarih
 * @param {string|Date} date2 - İkinci tarih
 * @returns {object} Tarih farkı { days, hours, minutes, seconds }
 */
export const getDateDifference = (date1, date2) => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2 || new Date();
  
  const diffMs = Math.abs(d2 - d1);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return {
    days: diffDays,
    hours: diffHours,
    minutes: diffMinutes,
    seconds: diffSeconds,
  };
};

/**
 * Rastgele bir ID oluşturur
 * @param {number} length - ID uzunluğu
 * @returns {string} Rastgele ID
 */
export const generateRandomId = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Verilen dizinin elemanlarını karıştırır
 * @param {Array} array - Karıştırılacak dizi
 * @returns {Array} Karıştırılmış dizi
 */
export const shuffleArray = (array) => {
  if (!array || !Array.isArray(array)) return [];
  
  const newArray = [...array];
  
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  return newArray;
};

/**
 * İki konum arasındaki mesafeyi hesaplar (km cinsinden)
 * @param {object} coord1 - İlk konum { lat, lng }
 * @param {object} coord2 - İkinci konum { lat, lng }
 * @returns {number} Mesafe (km)
 */
export const calculateDistance = (coord1, coord2) => {
  if (!coord1 || !coord2) return 0;
  
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Dereceyi radyana dönüştürür
 * @param {number} deg - Derece
 * @returns {number} Radyan
 */
const toRad = (deg) => {
  return deg * (Math.PI / 180);
}; 