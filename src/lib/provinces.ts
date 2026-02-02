/**
 * Thailand Provinces Data
 * 
 * Complete list of 77 provinces (76 provinces + Bangkok special administrative area)
 * Organized by region for easy reference.
 */

export interface Province {
    name_th: string;
    name_en: string;
    region: 'central' | 'eastern' | 'northern' | 'northeastern' | 'southern' | 'western';
}

export const THAILAND_PROVINCES: Province[] = [
    // Central Region (รวม กทม.)
    { name_th: 'กรุงเทพมหานคร', name_en: 'Bangkok', region: 'central' },
    { name_th: 'นนทบุรี', name_en: 'Nonthaburi', region: 'central' },
    { name_th: 'ปทุมธานี', name_en: 'Pathum Thani', region: 'central' },
    { name_th: 'พระนครศรีอยุธยา', name_en: 'Phra Nakhon Si Ayutthaya', region: 'central' },
    { name_th: 'อ่างทอง', name_en: 'Ang Thong', region: 'central' },
    { name_th: 'ลพบุรี', name_en: 'Lopburi', region: 'central' },
    { name_th: 'สิงห์บุรี', name_en: 'Sing Buri', region: 'central' },
    { name_th: 'ชัยนาท', name_en: 'Chai Nat', region: 'central' },
    { name_th: 'สระบุรี', name_en: 'Saraburi', region: 'central' },
    { name_th: 'นครนายก', name_en: 'Nakhon Nayok', region: 'central' },
    { name_th: 'นครปฐม', name_en: 'Nakhon Pathom', region: 'central' },
    { name_th: 'สมุทรปราการ', name_en: 'Samut Prakan', region: 'central' },
    { name_th: 'สมุทรสาคร', name_en: 'Samut Sakhon', region: 'central' },
    { name_th: 'สมุทรสงคราม', name_en: 'Samut Songkhram', region: 'central' },
    { name_th: 'สุพรรณบุรี', name_en: 'Suphan Buri', region: 'central' },

    // Eastern Region
    { name_th: 'ชลบุรี', name_en: 'Chonburi', region: 'eastern' },
    { name_th: 'ระยอง', name_en: 'Rayong', region: 'eastern' },
    { name_th: 'จันทบุรี', name_en: 'Chanthaburi', region: 'eastern' },
    { name_th: 'ตราด', name_en: 'Trat', region: 'eastern' },
    { name_th: 'ฉะเชิงเทรา', name_en: 'Chachoengsao', region: 'eastern' },
    { name_th: 'ปราจีนบุรี', name_en: 'Prachinburi', region: 'eastern' },
    { name_th: 'สระแก้ว', name_en: 'Sa Kaeo', region: 'eastern' },

    // Northern Region
    { name_th: 'เชียงใหม่', name_en: 'Chiang Mai', region: 'northern' },
    { name_th: 'เชียงราย', name_en: 'Chiang Rai', region: 'northern' },
    { name_th: 'ลำปาง', name_en: 'Lampang', region: 'northern' },
    { name_th: 'ลำพูน', name_en: 'Lamphun', region: 'northern' },
    { name_th: 'แม่ฮ่องสอน', name_en: 'Mae Hong Son', region: 'northern' },
    { name_th: 'น่าน', name_en: 'Nan', region: 'northern' },
    { name_th: 'พะเยา', name_en: 'Phayao', region: 'northern' },
    { name_th: 'แพร่', name_en: 'Phrae', region: 'northern' },
    { name_th: 'อุตรดิตถ์', name_en: 'Uttaradit', region: 'northern' },
    { name_th: 'ตาก', name_en: 'Tak', region: 'northern' },
    { name_th: 'สุโขทัย', name_en: 'Sukhothai', region: 'northern' },
    { name_th: 'พิษณุโลก', name_en: 'Phitsanulok', region: 'northern' },
    { name_th: 'พิจิตร', name_en: 'Phichit', region: 'northern' },
    { name_th: 'กำแพงเพชร', name_en: 'Kamphaeng Phet', region: 'northern' },
    { name_th: 'เพชรบูรณ์', name_en: 'Phetchabun', region: 'northern' },
    { name_th: 'นครสวรรค์', name_en: 'Nakhon Sawan', region: 'northern' },
    { name_th: 'อุทัยธานี', name_en: 'Uthai Thani', region: 'northern' },

    // Northeastern Region (Isan)
    { name_th: 'นครราชสีมา', name_en: 'Nakhon Ratchasima', region: 'northeastern' },
    { name_th: 'บุรีรัมย์', name_en: 'Buriram', region: 'northeastern' },
    { name_th: 'สุรินทร์', name_en: 'Surin', region: 'northeastern' },
    { name_th: 'ศรีสะเกษ', name_en: 'Sisaket', region: 'northeastern' },
    { name_th: 'อุบลราชธานี', name_en: 'Ubon Ratchathani', region: 'northeastern' },
    { name_th: 'ยโสธร', name_en: 'Yasothon', region: 'northeastern' },
    { name_th: 'ชัยภูมิ', name_en: 'Chaiyaphum', region: 'northeastern' },
    { name_th: 'อำนาจเจริญ', name_en: 'Amnat Charoen', region: 'northeastern' },
    { name_th: 'หนองบัวลำภู', name_en: 'Nong Bua Lamphu', region: 'northeastern' },
    { name_th: 'ขอนแก่น', name_en: 'Khon Kaen', region: 'northeastern' },
    { name_th: 'อุดรธานี', name_en: 'Udon Thani', region: 'northeastern' },
    { name_th: 'เลย', name_en: 'Loei', region: 'northeastern' },
    { name_th: 'หนองคาย', name_en: 'Nong Khai', region: 'northeastern' },
    { name_th: 'มหาสารคาม', name_en: 'Maha Sarakham', region: 'northeastern' },
    { name_th: 'ร้อยเอ็ด', name_en: 'Roi Et', region: 'northeastern' },
    { name_th: 'กาฬสินธุ์', name_en: 'Kalasin', region: 'northeastern' },
    { name_th: 'สกลนคร', name_en: 'Sakon Nakhon', region: 'northeastern' },
    { name_th: 'นครพนม', name_en: 'Nakhon Phanom', region: 'northeastern' },
    { name_th: 'มุกดาหาร', name_en: 'Mukdahan', region: 'northeastern' },
    { name_th: 'บึงกาฬ', name_en: 'Bueng Kan', region: 'northeastern' },

    // Southern Region
    { name_th: 'นครศรีธรรมราช', name_en: 'Nakhon Si Thammarat', region: 'southern' },
    { name_th: 'กระบี่', name_en: 'Krabi', region: 'southern' },
    { name_th: 'พังงา', name_en: 'Phang Nga', region: 'southern' },
    { name_th: 'ภูเก็ต', name_en: 'Phuket', region: 'southern' },
    { name_th: 'สุราษฎร์ธานี', name_en: 'Surat Thani', region: 'southern' },
    { name_th: 'ระนอง', name_en: 'Ranong', region: 'southern' },
    { name_th: 'ชุมพร', name_en: 'Chumphon', region: 'southern' },
    { name_th: 'สงขลา', name_en: 'Songkhla', region: 'southern' },
    { name_th: 'สตูล', name_en: 'Satun', region: 'southern' },
    { name_th: 'ตรัง', name_en: 'Trang', region: 'southern' },
    { name_th: 'พัทลุง', name_en: 'Phatthalung', region: 'southern' },
    { name_th: 'ปัตตานี', name_en: 'Pattani', region: 'southern' },
    { name_th: 'ยะลา', name_en: 'Yala', region: 'southern' },
    { name_th: 'นราธิวาส', name_en: 'Narathiwat', region: 'southern' },

    // Western Region
    { name_th: 'กาญจนบุรี', name_en: 'Kanchanaburi', region: 'western' },
    { name_th: 'ราชบุรี', name_en: 'Ratchaburi', region: 'western' },
    { name_th: 'เพชรบุรี', name_en: 'Phetchaburi', region: 'western' },
    { name_th: 'ประจวบคีรีขันธ์', name_en: 'Prachuap Khiri Khan', region: 'western' },
];

// Export province names as simple arrays for dropdowns
export const PROVINCE_NAMES_TH = THAILAND_PROVINCES.map(p => p.name_th);
export const PROVINCE_NAMES_EN = THAILAND_PROVINCES.map(p => p.name_en);

// Export all province count for validation
export const TOTAL_PROVINCES = THAILAND_PROVINCES.length; // 77
