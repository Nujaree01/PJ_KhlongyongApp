export type PlaceCategory =
    | "start"
    | "end"
    | "nature"
    | "market"
    | "learning"
    | "temple"
    | "farm"
    | "university"
    | "rest";

export interface Place {
    id: string;
    order: number;
    name: string;
    nameEn?: string;
    category: PlaceCategory;
    latitude: number;
    longitude: number;
    description: string;
    highlight: string;
    image?: any;
    distanceFromPrevKm?: number;
    tips?: string[];
    openHours?: string;
    phone?: string;
}

export const ROUTE_TITLE = "เส้นทางท่องเที่ยวชุมชนคลองโยง";
export const ROUTE_TOTAL_DISTANCE_KM = 29;

export const PLACES: Place[] = [
    {
        id: "phutthamonthon",
        order: 1,
        name: "สวนพุทธมณฑล",
        nameEn: "Phutthamonthon Park",
        category: "start",
        latitude: 13.7768069,
        longitude: 100.3210139,
        image: require("../../assets/places/001.jpg"),
        description:
            "จุดเริ่มต้นเส้นทางท่องเที่ยว ตั้งอยู่บนถนนอุทยาน (Utthayan Road) บริเวณรอยต่อกรุงเทพฯ-นครปฐม เป็นสวนสาธารณะขนาดใหญ่ ศูนย์รวมงานพุทธศิลป์และพระพุทธรูปยืนปางลีลาองค์ใหญ่",
        highlight: "จุดเริ่มต้นเส้นทาง",
        tips: ["จุดจอดรถกว้างขวาง เหมาะเป็นจุดนัดพบก่อนออกเดินทาง"],
    },
    {
        id: "donwai",
        order: 2,
        name: "ตลาดน้ำดอนหวาย",
        nameEn: "Don Wai Floating Market",
        category: "market",
        latitude: 13.7673,
        longitude: 100.2848,
        image: require("../../assets/places/002.png"),
        description:
            "ตลาดริมคลองเก่าแก่ที่ยังคงวิถีชีวิตชุมชนริมน้ำ ขึ้นชื่อเรื่องอาหารพื้นบ้าน ขนมไทย และผลไม้ตามฤดูกาล เหมาะสำหรับแวะพักผ่อนและชิมอาหารก่อนเดินทางต่อ",
        highlight: "ตลาดริมคลองวิถีไทย",
        tips: ["แนะนำมาช่วงเช้าถึงบ่าย ร้านค้าจะคึกคักที่สุด"],
    },
    {
        id: "kokNongNa",
        order: 3,
        name: "ศูนย์เรียนรู้โคก หนอง นา โมเดล",
        nameEn: "Khok Nong Na Learning Center",
        category: "learning",
        latitude: 13.85715,
        longitude: 100.27780,
        image: require("../../assets/places/003.png"),
        description:
            "ศูนย์เรียนรู้เกษตรทฤษฎีใหม่ตามแนวพระราชดำริ สาธิตการบริหารจัดการพื้นที่แบบ โคก หนอง นา เปิดให้เยี่ยมชมและศึกษาดูงานด้านเกษตรพอเพียง",
        highlight: "ศูนย์เรียนรู้เกษตรพอเพียง",
        tips: ["เหมาะสำหรับกลุ่มศึกษาดูงาน ควรติดต่อล่วงหน้า"],
    },
    {
        id: "ssru",
        order: 4,
        name: "มหาวิทยาลัยราชภัฏสวนสุนันทา วิทยาเขตนครปฐม",
        nameEn: "SSRU Nakhon Pathom Campus",
        category: "university",
        latitude: 13.8688935,
        longitude: 100.2730046,
        image: require("../../assets/places/004.png"),
        description:
            "วิทยาเขตของมหาวิทยาลัยราชภัฏสวนสุนันทา ตั้งอยู่ในพื้นที่ตำบลคลองโยง เป็นแหล่งเรียนรู้และจัดกิจกรรมร่วมกับชุมชนโดยรอบ",
        highlight: "สถาบันการศึกษาประจำพื้นที่",
    },
    
    {
        id: "watmakluea",
        order: 5,
        name: "วัดมะเกลือ",
        nameEn: "Wat Makluea",
        category: "temple",
        latitude: 13.8831534,
        longitude: 100.2880267,
        image: require("../../assets/places/005.jpg"),
        description:
            "วัดเก่าแก่ประจำชุมชนคลองโยง เป็นศูนย์รวมจิตใจของคนในพื้นที่ สถาปัตยกรรมไทยดั้งเดิม เหมาะแก่การแวะสักการะพระและพักผ่อนใจ",
        highlight: "วัดศูนย์รวมใจชุมชน",
    },
    {
        id: "lemonmefarm",
        order: 6,
        name: "เลมอนมีฟาร์ม",
        nameEn: "Lemon Mee Farm",
        category: "farm",
        latitude: 13.8852826,
        longitude: 100.2861124,
        image: require("../../assets/places/006.jpg"),
        description:
            "ฟาร์มเกษตรท่องเที่ยวเชิงสร้างสรรค์ เปิดให้นักท่องเที่ยวเข้าชมแปลงปลูกผลไม้และผลิตภัณฑ์แปรรูปจากผลผลิตในชุมชน ถ่ายรูปสวย ๆ ได้รอบฟาร์ม",
        highlight: "ฟาร์มเกษตรท่องเที่ยว",
    },
    {
        id: "airorchid",
        order: 7,
        name: "ซูเปอร์มาร์เก็ตกล้วยไม้แอร์ออร์คิดส์",
        nameEn: "Air Orchids & Lab",
        category: "nature",
        latitude: 13.9198375,
        longitude: 100.2618041,
        image: require("../../assets/places/007.jpg"),
        description:
            "แหล่งเพาะปลูกและจำหน่ายกล้วยไม้คุณภาพส่งออก นักท่องเที่ยวสามารถเดินชมโรงเรือนกล้วยไม้หลากสายพันธุ์ และเลือกซื้อกล้วยไม้กลับบ้านได้",
        highlight: "สวนกล้วยไม้เพื่อการส่งออก",
        tips: ["ควรสวมรองเท้าที่เดินสบาย พื้นโรงเรือนอาจชื้น"],
    },
    {
        id: "watlamphaya",
        order: 8,
        name: "ตลาดน้ำวัดลำพญา",
        nameEn: "Wat Lam Phaya Floating Market",
        category: "end",
        latitude: 13.958667,
        longitude: 100.203467,
        image: require("../../assets/places/008.jpg"),
        description:
            "จุดหมายปลายทางของเส้นทาง ตลาดน้ำชื่อดังริมคลองลำพญา สัมผัสวิถีชีวิตริมน้ำ อาหารและของกินท้องถิ่นหลากหลาย เป็นจุดปิดทริปที่สมบูรณ์แบบ",
        highlight: "จุดหมายปลายทาง",
        tips: ["แนะนำมาช่วงเช้าวันหยุด ตลาดจะคึกคักและมีร้านค้าครบที่สุด"],
    },
];


export const CATEGORY_COLORS: Record<PlaceCategory, string> = {
    start: "#8B1E3F",
    end: "#2B6CB0",
    nature: "#2F855A",
    market: "#C9A227",
    learning: "#2F855A",
    temple: "#8B1E3F",
    farm: "#2F855A",
    university: "#2B6CB0",
    rest: "#2B6CB0",
};

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
    start: "จุดเริ่มต้น",
    end: "จุดหมายปลายทาง",
    nature: "แหล่งท่องเที่ยวธรรมชาติ",
    market: "ตลาด",
    learning: "แหล่งเรียนรู้",
    temple: "วัด/ศาสนสถาน",
    farm: "ฟาร์มเกษตร",
    university: "สถาบันการศึกษา",
    rest: "จุดพักผ่อน",
};

// เส้นทาง (waypoints) สำหรับวาด Polyline บนแผนที่ เรียงตามลำดับ order
export const ROUTE_COORDINATES = PLACES.map((p) => ({
    latitude: p.latitude,
    longitude: p.longitude,
}));