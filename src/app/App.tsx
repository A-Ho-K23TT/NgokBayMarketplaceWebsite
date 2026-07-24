import { useState, useEffect, useRef, useCallback } from "react"
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams, Outlet } from "react-router"
import {
  Menu, X, ChevronLeft, ChevronRight, ShoppingCart, Heart, Star, MapPin,
  Calendar, Phone, Mail, Facebook, Youtube, Instagram, Search, Filter,
  ArrowRight, Leaf, Home, Package, Grid, Award, BookOpen, Clock, Users,
  BarChart2, Settings, LogOut, Edit, Trash2, Plus, Eye, Download, Bell,
  ChevronDown, Check, Minus, CreditCard, Truck, Tag, FileText,
  Music, Volume2, Globe, TrendingUp, ShoppingBag, Map, User, Lock,
  Moon, Sun, ExternalLink, Layers, AlertCircle, CheckCircle, Printer, ImageIcon,
  ShieldAlert, LayoutDashboard, ListOrdered, FileDown, ClipboardList,
  UserCheck, UserX, ToggleLeft, ToggleRight, Store, BadgeCheck
} from "lucide-react"
import { toast, Toaster } from "sonner"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts"

// ============================================================
// AUTH
// ============================================================
type AuthUser = { email: string; name: string; role: "admin" | "customer"; avatar: string }

const MOCK_ACCOUNTS: (AuthUser & { password: string })[] = [
  { email: "admin@gmail.com", password: "12345", name: "Admin Ngok Bay", role: "admin",    avatar: "photo-1472099645785-5658abf4ff4e" },
  { email: "user@gmail.com",  password: "12345", name: "Nguyễn Văn An",  role: "customer", avatar: "photo-1507003211169-0a1dd7228f2d" },
]

// ============================================================
// HERO CONTEXT
// ============================================================
type HeroSlide = {
  id: number
  title: string
  subtitle: string
  desc: string
  image: string      // Unsplash photo ID or full https:// URL
  btn1: string
  btn1Link: string
  btn2: string
  btn2Link: string
}

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  { id: 1, title: "Chợ Phiên Ngok Bay", subtitle: "Nơi hội tụ tinh hoa văn hóa Bana", desc: "Khám phá thổ cẩm dệt tay, nông sản sạch và nhạc cụ truyền thống từ vùng cao Kon Tum", image: "photo-1506905925346-21bda4d32df4", btn1: "Khám phá ngay", btn1Link: "/san-pham", btn2: "Xem chợ phiên", btn2Link: "/lich-cho-phien" },
  { id: 2, title: "Thổ cẩm Bana", subtitle: "Di sản dệt tay truyền đời", desc: "Mỗi tấm vải là một câu chuyện, được dệt nên từ đôi tay khéo léo của những nghệ nhân Bana qua nhiều thế hệ", image: "photo-1558618666-fcd25c85cd64", btn1: "Xem thổ cẩm", btn1Link: "/tho-cam", btn2: "Gặp nghệ nhân", btn2Link: "/van-hoa" },
  { id: 3, title: "Sản phẩm OCOP 4-5★", subtitle: "Chứng nhận chất lượng quốc gia", desc: "Tuyển chọn những sản phẩm đạt tiêu chuẩn OCOP cao nhất, đảm bảo chất lượng và an toàn cho người tiêu dùng", image: "photo-1447933601403-0c6688de566e", btn1: "Xem OCOP", btn1Link: "/ocop", btn2: "Tìm hiểu thêm", btn2Link: "/van-hoa" },
]

import { createContext, useContext } from "react"
type HeroContextType = { slides: HeroSlide[]; setSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>> }
const HeroContext = createContext<HeroContextType>({ slides: DEFAULT_HERO_SLIDES, setSlides: () => {} })
const useHero = () => useContext(HeroContext)

// ============================================================
// MARKET CONTEXT
// ============================================================
type Market = {
  id: number; name: string
  location: { province: string; district: string; commune: string; village: string; full: string }
  mapUrl: string; startDate: string; endDate: string; time: string
  description: string; categories: string[]; images: string[]
  contact: { phone: string; email: string; fanpage: string }
  registrationOpen: boolean; visible: boolean
  vendors: number; expectedVisitors: number; highlights: string[]
}

type BoothRegistration = {
  id: string; marketId: number; marketName: string
  boothName: string; ownerName: string; phone: string; email: string
  address: string; products: string; category: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string; note: string
}

type MarketContextType = {
  markets: Market[]
  setMarkets: React.Dispatch<React.SetStateAction<Market[]>>
  registrations: BoothRegistration[]
  setRegistrations: React.Dispatch<React.SetStateAction<BoothRegistration[]>>
}

const MarketContext = createContext<MarketContextType>({
  markets: [], setMarkets: () => {},
  registrations: [], setRegistrations: () => {}
})
const useMarket = () => useContext(MarketContext)

// ============================================================
// MOCK DATA
// ============================================================

const CATEGORIES = [
  { id: 1, name: "Tre đan", icon: "🎋", count: 42, desc: "Gùi, rổ, chiếu lát", image: "photo-1558618666-fcd25c85cd64" },
  { id: 2, name: "Thổ cẩm", icon: "🧵", count: 38, desc: "Vải dệt, khố, túi", image: "photo-1606503153255-59d8b8b82176" },
  { id: 3, name: "Nông sản", icon: "🌿", count: 65, desc: "Cà phê, mật ong, sâm", image: "photo-1506905925346-21bda4d32df4" },
  { id: 4, name: "Nhạc cụ", icon: "🎵", count: 15, desc: "Cồng chiêng, T'rưng", image: "photo-1511379938547-c1f69419868d" },
]

const PRODUCTS = [
  { id: 1, name: "Gùi đan tre nghệ nhân", price: 450000, originalPrice: 600000, category: "Tre đan", ocop: 4, image: "photo-1558618666-fcd25c85cd64", artisan: "Đinh Văn Blưm", village: "Làng Kon Lơng Khơng", material: "Tre núi rừng Kon Tum", size: "40x30x25cm", description: "Gùi đan tay truyền thống của người Bana, được làm từ tre núi chọn lọc. Mỗi chiếc gùi là tác phẩm nghệ thuật độc đáo mang đậm bản sắc văn hóa Tây Nguyên.", rating: 4.8, reviews: 24, inStock: true, tags: ["Truyền thống", "Thủ công"] },
  { id: 2, name: "Vải thổ cẩm hoa văn Bana", price: 320000, originalPrice: null, category: "Thổ cẩm", ocop: 5, image: "photo-1606503153255-59d8b8b82176", artisan: "H'Linh", village: "Làng Plei Ơi", material: "Sợi bông tự nhiên + tơ tằm", size: "60x120cm", description: "Vải thổ cẩm dệt tay với hoa văn truyền thống Bana. Mỗi tấm vải là câu chuyện được kể qua từng sợi tơ, lưu giữ linh hồn văn hóa của người Bana.", rating: 4.9, reviews: 38, inStock: true, tags: ["Dệt tay", "Hoa văn Bana"] },
  { id: 3, name: "Cà phê Arabica Kon Tum", price: 185000, originalPrice: 220000, category: "Nông sản", ocop: 3, image: "photo-1447933601403-0c6688de566e", artisan: "HTX Cà phê Ngok Bay", village: "Xã Đăk Tô", material: "Cà phê Arabica 100%", size: "500g", description: "Cà phê Arabica trồng trên độ cao 1200m, thu hoạch thủ công và chế biến theo phương pháp honey. Hương thơm phức hợp, vị đậm đà đặc trưng vùng cao.", rating: 4.7, reviews: 56, inStock: true, tags: ["Organic", "OCOP"] },
  { id: 4, name: "Đàn T'rưng mini", price: 780000, originalPrice: null, category: "Nhạc cụ", ocop: null, image: "photo-1511379938547-c1f69419868d", artisan: "A Nươih", village: "Làng Kon Bơi", material: "Tre núi già tự nhiên", size: "60cm", description: "Đàn T'rưng mini được làm thủ công từ tre núi già, âm thanh chuẩn xác và trong trẻo. Phù hợp làm đồ lưu niệm hoặc nhạc cụ trang trí.", rating: 4.6, reviews: 12, inStock: true, tags: ["Nhạc cụ", "Lưu niệm"] },
  { id: 5, name: "Mật ong rừng nguyên chất", price: 290000, originalPrice: 350000, category: "Nông sản", ocop: 4, image: "photo-1558642452-9d2a7deb7f62", artisan: "Hộ gia đình Đinh Văn Hạnh", village: "Huyện Tu Mơ Rông", material: "Mật ong rừng nguyên chất", size: "500ml", description: "Mật ong rừng thu hoạch tự nhiên từ rừng nguyên sinh Kon Tum. Không pha tạp, giàu enzyme và khoáng chất tự nhiên.", rating: 4.9, reviews: 89, inStock: true, tags: ["Organic", "Thiên nhiên"] },
  { id: 6, name: "Túi thổ cẩm thời trang", price: 420000, originalPrice: null, category: "Thổ cẩm", ocop: 4, image: "photo-1544966503-7cc5ac882d5d", artisan: "H'Blăm", village: "Làng Kon Sơ Lăl", material: "Thổ cẩm + da thuộc", size: "25x18x8cm", description: "Túi thổ cẩm kết hợp giữa hoa văn truyền thống Bana và thiết kế hiện đại. Vừa giữ gìn bản sắc văn hóa, vừa phù hợp thẩm mỹ đương đại.", rating: 4.7, reviews: 31, inStock: true, tags: ["Thời trang", "Hiện đại"] },
  { id: 7, name: "Rượu cần Tây Nguyên", price: 350000, originalPrice: 420000, category: "Nông sản", ocop: 3, image: "photo-1569900008-81f53e24f5c5", artisan: "Làng nghề truyền thống", village: "Làng Kon Klor", material: "Men lá tự nhiên + gạo nếp nương", size: "2 lít", description: "Rượu cần truyền thống được ủ theo phương pháp cổ truyền của người Bana. Uống cùng ống cần trong dịp lễ hội, giao lưu văn hóa.", rating: 4.5, reviews: 43, inStock: false, tags: ["Truyền thống", "Lễ hội"] },
  { id: 8, name: "Vòng tay cườm hạt Bana", price: 95000, originalPrice: null, category: "Thổ cẩm", ocop: null, image: "photo-1515562141207-7a88fb7ce338", artisan: "H'Nguôi", village: "Làng Plei Đôn", material: "Cườm hạt tự nhiên + dây lụa", size: "Điều chỉnh được", description: "Vòng tay được kết từ cườm hạt nhiều màu sắc, mang biểu tượng của đất trời Tây Nguyên. Là món quà lưu niệm ý nghĩa.", rating: 4.4, reviews: 67, inStock: true, tags: ["Phụ kiện", "Lưu niệm"] },
  { id: 9, name: "Sâm dây Ngọc Linh", price: 650000, originalPrice: 780000, category: "Nông sản", ocop: 5, image: "photo-1512621776951-a57141f2eefd", artisan: "HTX Sâm Ngọc Linh Kon Tum", village: "Huyện Tu Mơ Rông", material: "Sâm dây tươi", size: "1kg", description: "Sâm dây tươi từ vùng núi Ngọc Linh, độ cao trên 1500m. Giàu dưỡng chất, có tác dụng bồi bổ sức khỏe theo y học cổ truyền.", rating: 5.0, reviews: 28, inStock: true, tags: ["Dược liệu", "Quý hiếm"] },
  { id: 10, name: "Chiếu lát bàn tay", price: 180000, originalPrice: null, category: "Tre đan", ocop: 3, image: "photo-1503676260728-1c00da094a0b", artisan: "Đinh Thị Loan", village: "Làng Kon Braih", material: "Lát + sơn mài tự nhiên", size: "120x80cm", description: "Chiếu lát đan thủ công từ cây lát tự nhiên, không dùng hóa chất. Bền đẹp và thân thiện môi trường.", rating: 4.3, reviews: 19, inStock: true, tags: ["Thủ công", "Eco"] },
  { id: 11, name: "Khố thổ cẩm Bana", price: 560000, originalPrice: null, category: "Thổ cẩm", ocop: 4, image: "photo-1558618666-fcd25c85cd64", artisan: "Đinh Văn Klang", village: "Làng Đăk Wâk", material: "Sợi bông nhuộm chàm tự nhiên", size: "Free size", description: "Khố thổ cẩm truyền thống của đàn ông Bana, được dệt tay với hoa văn đặc trưng của từng dòng tộc.", rating: 4.8, reviews: 9, inStock: true, tags: ["Truyền thống", "Trang phục"] },
  { id: 12, name: "Cồng chiêng mini lưu niệm", price: 280000, originalPrice: 320000, category: "Nhạc cụ", ocop: null, image: "photo-1511379938547-c1f69419868d", artisan: "A Phúc", village: "Làng Kon Tum Kpâng", material: "Đồng đúc thủ công", size: "15cm", description: "Cồng chiêng mini đúc thủ công từ đồng nguyên chất, âm thanh vang xa. Lưu giữ tinh thần không gian văn hóa cồng chiêng Tây Nguyên.", rating: 4.6, reviews: 34, inStock: true, tags: ["Nhạc cụ", "Đồng"] },
]

const PRODUCT_CATEGORIES_LIST = [
  "Nông sản", "Thực phẩm chế biến", "Thủ công mỹ nghệ",
  "Trang phục truyền thống", "Gia súc gia cầm", "Đồ dùng sinh hoạt",
  "Dịch vụ/Du lịch", "Khác"
]

const INITIAL_MARKETS = [
  {
    id: 1,
    name: "Chợ Phiên Ngok Bay #47",
    location: { province: "Kon Tum", district: "TP Kon Tum", commune: "Đắk Blà", village: "Làng văn hóa Kon Klor", full: "Làng văn hóa Kon Klor, Đắk Blà, TP Kon Tum, Kon Tum" },
    mapUrl: "https://maps.google.com/maps?q=14.3544,108.0005&z=15&output=embed",
    startDate: "2025-08-15", endDate: "2025-08-15", time: "06:00 - 12:00",
    description: "Phiên chợ truyền thống tháng 8 với các sản phẩm thủ công mỹ nghệ, thổ cẩm Bana và đặc sản Tây Nguyên. Có trình diễn cồng chiêng và dệt thổ cẩm trực tiếp.",
    categories: ["Thổ cẩm & Trang phục", "Nông sản", "Thủ công mỹ nghệ"],
    images: ["photo-1506905925346-21bda4d32df4", "photo-1555041469-a586c61ea9bc"],
    contact: { phone: "0260 3862 222", email: "chophien@ngokbay.vn", fanpage: "facebook.com/ngokbaymarket" },
    registrationOpen: true, visible: true,
    vendors: 45, expectedVisitors: 500, highlights: ["Thổ cẩm mới", "Sâm Ngọc Linh", "Cồng chiêng biểu diễn"]
  },
  {
    id: 2,
    name: "Chợ Phiên Ngok Bay #48",
    location: { province: "Kon Tum", district: "TP Kon Tum", commune: "Thắng Lợi", village: "Quảng trường 16/3", full: "Quảng trường 16/3, Thắng Lợi, TP Kon Tum, Kon Tum" },
    mapUrl: "https://maps.google.com/maps?q=14.3600,108.0100&z=15&output=embed",
    startDate: "2025-09-20", endDate: "2025-09-20", time: "06:00 - 12:00",
    description: "Phiên chợ mùa màng đặc biệt tháng 9, tôn vinh văn hóa lúa rẫy và nông nghiệp truyền thống của người Bana. Trưng bày ẩm thực đặc sản Tây Nguyên.",
    categories: ["Nông sản", "Thực phẩm chế biến", "Dịch vụ/Du lịch"],
    images: ["photo-1558618666-fcd25c85cd64", "photo-1506905925346-21bda4d32df4"],
    contact: { phone: "0260 3862 222", email: "chophien@ngokbay.vn", fanpage: "facebook.com/ngokbaymarket" },
    registrationOpen: true, visible: true,
    vendors: 60, expectedVisitors: 800, highlights: ["Lễ hội mùa màng", "Ẩm thực đặc sản", "Giao lưu văn hóa"]
  },
  {
    id: 3,
    name: "Chợ Phiên Ngok Bay #49",
    location: { province: "Kon Tum", district: "TP Kon Tum", commune: "Kon Tum", village: "Làng du lịch Kon Tum", full: "Khuôn viên Làng du lịch Kon Tum, TP Kon Tum" },
    mapUrl: "https://maps.google.com/maps?q=14.3490,107.9900&z=15&output=embed",
    startDate: "2025-10-18", endDate: "2025-10-19", time: "06:00 - 14:00",
    description: "Phiên chợ ngày hội thổ cẩm lớn nhất năm, quy tụ nghệ nhân từ khắp các làng Bana. Có triển lãm, trình diễn đan tre và ẩm thực truyền thống phong phú.",
    categories: ["Trang phục truyền thống", "Thủ công mỹ nghệ", "Nông sản", "Thực phẩm chế biến"],
    images: ["photo-1606503153255-59d8b8b82176", "photo-1511379938547-c1f69419868d"],
    contact: { phone: "0260 3862 333", email: "sukien@ngokbay.vn", fanpage: "facebook.com/ngokbaymarket" },
    registrationOpen: false, visible: true,
    vendors: 70, expectedVisitors: 1000, highlights: ["Ngày hội thổ cẩm", "Trình diễn đan tre", "Ẩm thực truyền thống"]
  },
]

const INITIAL_REGISTRATIONS = [
  { id: "DK001", marketId: 1, marketName: "Chợ Phiên Ngok Bay #47", boothName: "Gian hàng Thổ cẩm H'Linh", ownerName: "H'Linh Đinh Thị", phone: "0923456789", email: "hlinh@gmail.com", address: "Làng Plei Ơi, Đắk Blà, TP Kon Tum", products: "Vải thổ cẩm, túi xách, khăn quàng cổ", category: "Trang phục truyền thống", status: "approved" as const, submittedAt: "10/07/2025", note: "" },
  { id: "DK002", marketId: 1, marketName: "Chợ Phiên Ngok Bay #47", boothName: "Cà phê Ngok Bay", ownerName: "Đinh Văn Hùng", phone: "0912345678", email: "dvhung@gmail.com", address: "Thôn 4, Đắk Blà, TP Kon Tum", products: "Cà phê Arabica rang xay, cà phê sữa đá", category: "Thực phẩm chế biến", status: "approved" as const, submittedAt: "11/07/2025", note: "" },
  { id: "DK003", marketId: 1, marketName: "Chợ Phiên Ngok Bay #47", boothName: "Mật ong Tây Nguyên", ownerName: "A Phúc Đinh", phone: "0901234567", email: "aphuc@gmail.com", address: "Làng Kon Klor, Đắk Blà, TP Kon Tum", products: "Mật ong rừng nguyên chất, sáp ong", category: "Nông sản", status: "pending" as const, submittedAt: "13/07/2025", note: "" },
  { id: "DK004", marketId: 1, marketName: "Chợ Phiên Ngok Bay #47", boothName: "Gùi đan tre Kon Lơng Khơng", ownerName: "Đinh Văn Blưm", phone: "0934500001", email: "blum@gmail.com", address: "Làng Kon Lơng Khơng, Đắk Blà", products: "Gùi tre, rổ, giỏ đan lát", category: "Thủ công mỹ nghệ", status: "pending" as const, submittedAt: "14/07/2025", note: "" },
  { id: "DK005", marketId: 1, marketName: "Chợ Phiên Ngok Bay #47", boothName: "Sâm dây Tu Mơ Rông", ownerName: "Y Hoa Đinh", phone: "0945678902", email: "yhoa@gmail.com", address: "Xã Đắk Na, Tu Mơ Rông, Kon Tum", products: "Sâm dây tươi và khô, trà thảo mộc", category: "Nông sản", status: "rejected" as const, submittedAt: "12/07/2025", note: "Chưa có giấy phép kinh doanh dược liệu" },
  { id: "DK006", marketId: 2, marketName: "Chợ Phiên Ngok Bay #48", boothName: "Làng nghề Plei Ơi", ownerName: "H'Nhung Nguyễn", phone: "0968901234", email: "hnhung@gmail.com", address: "Làng Plei Ơi, Đắk Blà, TP Kon Tum", products: "Thổ cẩm cao cấp, trang phục Bana", category: "Trang phục truyền thống", status: "pending" as const, submittedAt: "15/07/2025", note: "" },
  { id: "DK007", marketId: 2, marketName: "Chợ Phiên Ngok Bay #48", boothName: "Đặc sản rừng Kon Tum", ownerName: "A Sơn Đinh", phone: "0979012345", email: "ason@gmail.com", address: "Xã Ngọc Tụ, Đắk Glei, Kon Tum", products: "Rau rừng, nấm khô, lá thuốc", category: "Nông sản", status: "approved" as const, submittedAt: "16/07/2025", note: "" },
]

const ARTISANS = [
  { id: 1, name: "H'Linh", age: 58, village: "Làng Plei Ơi", specialty: "Dệt thổ cẩm truyền thống", experience: 40, awards: ["Nghệ nhân Ưu tú 2019", "Giải vàng Hội chợ OCOP 2022"], image: "photo-1594744803329-e58b31de8bf5", products: 24, story: "Bà H'Linh bắt đầu học dệt từ năm 18 tuổi dưới sự dạy dỗ của mẹ và bà nội. Qua 40 năm gắn bó với khung cửi, bà đã sáng tạo nên hơn 50 hoa văn mới mang đậm bản sắc Bana." },
  { id: 2, name: "Đinh Văn Blưm", age: 62, village: "Làng Kon Lơng Khơng", specialty: "Đan gùi và đồ vật tre nứa", experience: 45, awards: ["Bàn tay vàng 2021"], image: "photo-1507003211169-0a1dd7228f2d", products: 31, story: "Ông Blưm là người giữ lửa nghề đan tre của làng Kon Lơng Khơng. Ông đã truyền dạy nghề cho hơn 30 học trò trong làng, giúp nghề đan tre không bị thất truyền." },
  { id: 3, name: "A Nươih", age: 45, village: "Làng Kon Bơi", specialty: "Chế tác nhạc cụ Bana", experience: 25, awards: ["Nghệ nhân trẻ Tây Nguyên 2020"], image: "photo-1472099645785-5658abf4ff4e", products: 18, story: "A Nươih là nghệ nhân trẻ nhất được vinh danh trong lĩnh vực chế tác nhạc cụ Bana. Anh đã kết hợp giữa phương pháp truyền thống và kỹ thuật hiện đại để tạo ra nhạc cụ chất lượng cao." },
]

const CULTURAL_ARTICLES = [
  { id: 1, title: "Không gian văn hóa Cồng chiêng Tây Nguyên", category: "Di sản UNESCO", date: "01/12/2024", image: "photo-1511379938547-c1f69419868d", excerpt: "Cồng chiêng Tây Nguyên được UNESCO công nhận là Di sản văn hóa phi vật thể của nhân loại năm 2005. Đây là tài sản vô giá của các dân tộc thiểu số vùng Tây Nguyên.", views: 2840 },
  { id: 2, title: "Lễ bỏ mả - Nghi thức thiêng liêng của người Bana", category: "Lễ hội", date: "15/11/2024", image: "photo-1558618666-fcd25c85cd64", excerpt: "Lễ bỏ mả là nghi lễ quan trọng nhất trong vòng đời của người Bana, đánh dấu việc cắt đứt mọi ràng buộc với người đã khuất để họ bước vào cõi vĩnh hằng.", views: 1923 },
  { id: 3, title: "Nghề dệt thổ cẩm - Linh hồn của người phụ nữ Bana", category: "Nghề truyền thống", date: "20/10/2024", image: "photo-1606503153255-59d8b8b82176", excerpt: "Từ bao đời nay, người phụ nữ Bana đã gắn bó với khung cửi như một phần không thể thiếu trong cuộc sống. Mỗi tấm vải thổ cẩm là một trang sách về lịch sử và văn hóa.", views: 3215 },
  { id: 4, title: "Nhà rông - Trái tim của buôn làng Bana", category: "Kiến trúc", date: "10/09/2024", image: "photo-1503376780353-7e6692767b70", excerpt: "Nhà rông là công trình kiến trúc độc đáo, là nơi sinh hoạt cộng đồng, nơi lưu giữ linh hồn của buôn làng người Bana. Mỗi ngôi nhà rông là một tác phẩm nghệ thuật kiến trúc.", views: 1654 },
]

const INSTRUMENTS = [
  { id: 1, name: "Cồng chiêng", description: "Bộ nhạc khí đồng đặc trưng của Tây Nguyên, được dùng trong lễ hội và sinh hoạt cộng đồng", image: "photo-1511379938547-c1f69419868d" },
  { id: 2, name: "Đàn T'rưng", description: "Nhạc cụ gõ làm từ ống tre nứa có kích thước khác nhau, âm thanh trong trẻo và vang xa", image: "photo-1511379938547-c1f69419868d" },
  { id: 3, name: "Đàn Klông pút", description: "Sáo tre nứa đặc trưng, người chơi thổi bằng mũi, tạo âm thanh huyền bí của núi rừng", image: "photo-1511379938547-c1f69419868d" },
  { id: 4, name: "Đing năm", description: "Cây đàn thổi truyền thống của người Bahnar, thường được dùng trong các nghi lễ tâm linh", image: "photo-1511379938547-c1f69419868d" },
]

const BANA_DICTIONARY = [
  { bana: "Kon", vietnamese: "Làng", pronunciation: "kon" },
  { bana: "Bơ nâm", vietnamese: "Nước", pronunciation: "bơ-nâm" },
  { bana: "Phang", vietnamese: "Cây", pronunciation: "phang" },
  { bana: "Hơi", vietnamese: "Rừng", pronunciation: "hơi" },
  { bana: "Plei", vietnamese: "Buôn", pronunciation: "plei" },
  { bana: "Tơ nâng", vietnamese: "Cảm ơn", pronunciation: "tơ-nâng" },
  { bana: "Đe đa", vietnamese: "Xin chào", pronunciation: "đê-đa" },
  { bana: "Hơ'am", vietnamese: "Tốt lành", pronunciation: "hơ-am" },
  { bana: "Pơlơng", vietnamese: "Núi", pronunciation: "pơ-lơng" },
  { bana: "Klei", vietnamese: "Lời nói", pronunciation: "klei" },
]

const ADMIN_ORDERS_DATA = [
  { id: "DH001", customer: "Nguyễn Văn An", product: "Gùi đan tre nghệ nhân", amount: 450000, status: "completed", date: "10/07/2025", phone: "0901234567", address: "123 Nguyễn Huệ, TP Kon Tum" },
  { id: "DH002", customer: "Trần Thị Bình", product: "Vải thổ cẩm hoa văn Bana", amount: 320000, status: "processing", date: "11/07/2025", phone: "0912345678", address: "45 Trần Phú, TP Kon Tum" },
  { id: "DH003", customer: "Lê Văn Cường", product: "Cà phê Arabica Kon Tum", amount: 185000, status: "shipping", date: "12/07/2025", phone: "0923456789", address: "78 Lê Lợi, Đăk Hà" },
  { id: "DH004", customer: "Phạm Thị Dung", product: "Mật ong rừng nguyên chất", amount: 580000, status: "pending", date: "13/07/2025", phone: "0934567890", address: "12 Hùng Vương, TP Kon Tum" },
  { id: "DH005", customer: "Hoàng Văn Em", product: "Sâm dây Ngọc Linh", amount: 650000, status: "completed", date: "13/07/2025", phone: "0945678901", address: "89 Võ Thị Sáu, Tu Mơ Rông" },
  { id: "DH006", customer: "Võ Thị Hoa", product: "Vòng tay cườm hạt Bana", amount: 190000, status: "cancelled", date: "14/07/2025", phone: "0956789012", address: "34 Phan Bội Châu, TP Kon Tum" },
  { id: "DH007", customer: "Đinh Văn An", product: "Đàn T'rưng mini", amount: 780000, status: "shipping", date: "14/07/2025", phone: "0967890123", address: "56 Ngô Quyền, Sa Thầy" },
]

const ADMIN_USERS_DATA = [
  { id: 1, name: "Nguyễn Văn An", email: "nva@gmail.com", role: "customer", status: "active", orders: 12, joined: "15/01/2024", avatar: "photo-1507003211169-0a1dd7228f2d" },
  { id: 2, name: "H'Linh", email: "hlinh@ngokbay.vn", role: "artisan", status: "active", orders: 0, joined: "20/02/2024", avatar: "photo-1594744803329-e58b31de8bf5" },
  { id: 3, name: "Admin Ngok Bay", email: "admin@ngokbay.vn", role: "admin", status: "active", orders: 0, joined: "01/12/2023", avatar: "photo-1472099645785-5658abf4ff4e" },
  { id: 4, name: "Lê Văn Cường", email: "lvc@gmail.com", role: "customer", status: "blocked", orders: 3, joined: "10/05/2024", avatar: "photo-1507003211169-0a1dd7228f2d" },
  { id: 5, name: "Đinh Thị Loan", email: "dtl@ngokbay.vn", role: "artisan", status: "active", orders: 0, joined: "05/03/2024", avatar: "photo-1594744803329-e58b31de8bf5" },
]

const REVENUE_DATA = [
  { month: "T1", revenue: 8500, orders: 28 }, { month: "T2", revenue: 9200, orders: 31 },
  { month: "T3", revenue: 11000, orders: 38 }, { month: "T4", revenue: 10200, orders: 34 },
  { month: "T5", revenue: 13500, orders: 45 }, { month: "T6", revenue: 15800, orders: 52 },
  { month: "T7", revenue: 14200, orders: 47 },
]

const PIE_DATA = [
  { name: "Thổ cẩm", value: 35, color: "#C4622D" },
  { name: "Nông sản", value: 28, color: "#1F6B45" },
  { name: "Tre đan", value: 22, color: "#7A4F2D" },
  { name: "Nhạc cụ", value: 15, color: "#95D5B2" },
]

const VENDORS = [
  { id: 1, name: "Làng nghề Kon Klor", products: ["Thổ cẩm", "Gùi tre"], booth: "A01-A05", contact: "A Phúc - 0901234567" },
  { id: 2, name: "HTX Cà phê Ngok Bay", products: ["Cà phê", "Hạt điều"], booth: "B01-B03", contact: "Đinh Văn Hùng - 0912345678" },
  { id: 3, name: "Làng nghề Plei Ơi", products: ["Thổ cẩm cao cấp"], booth: "C01-C08", contact: "H'Linh - 0923456789" },
  { id: 4, name: "Hợp tác xã Sâm Ngọc Linh", products: ["Sâm dây", "Dược liệu"], booth: "D01-D04", contact: "Đinh Thị Mai - 0934567890" },
]

const MARKET_HISTORY = [
  { year: "2018", event: "Chợ Phiên Ngok Bay #1 khai mạc", desc: "Phiên chợ đầu tiên với 20 gian hàng và 200 khách tham quan" },
  { year: "2019", event: "Mở rộng quy mô", desc: "Tăng lên 35 gian hàng, ra mắt khu vực ẩm thực truyền thống" },
  { year: "2020", event: "Vượt qua COVID-19", desc: "Tổ chức phiên chợ online đầu tiên, tiếp cận khách hàng toàn quốc" },
  { year: "2022", event: "Đạt cột mốc 1000 khách/phiên", desc: "Lần đầu tiên đón hơn 1000 khách tham quan trong một phiên chợ" },
  { year: "2024", event: "Ra mắt nền tảng thương mại điện tử", desc: "Chợ Phiên Ngok Bay chính thức có mặt trên Internet" },
]

const ADMIN_BLOGS_DATA = [
  { id: 1, title: "Không gian văn hóa Cồng chiêng Tây Nguyên", status: "published", date: "01/12/2024", author: "Admin", views: 2840, category: "Di sản" },
  { id: 2, title: "Lễ bỏ mả - Nghi thức thiêng liêng của người Bana", status: "published", date: "15/11/2024", author: "H'Linh", views: 1923, category: "Lễ hội" },
  { id: 3, title: "Nghề dệt thổ cẩm - Linh hồn của người phụ nữ Bana", status: "draft", date: "20/10/2024", author: "Admin", views: 0, category: "Nghề truyền thống" },
  { id: 4, title: "Hướng dẫn phân biệt thổ cẩm thật và giả", status: "published", date: "05/07/2025", author: "Admin", views: 3215, category: "Hướng dẫn" },
]

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const formatPrice = (p: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p)
const img = (id: string, w = 800, h = 600) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`

// ============================================================
// SHARED SMALL COMPONENTS
// ============================================================

function OcopBadge({ stars }: { stars: number }) {
  return (
    <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
      <Award size={10} /> OCOP {stars}★
    </span>
  )
}

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"} />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}{count !== undefined && ` (${count})`}</span>
    </div>
  )
}

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground font-body text-sm">Đang tải...</p>
    </div>
  )
}

function EmptyState({ icon: Icon = Package, title = "Không có dữ liệu", desc = "Chưa có nội dung để hiển thị" }: { icon?: any; title?: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <Icon size={28} className="text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground font-display">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm font-body">{desc}</p>
    </div>
  )
}

function SectionHeader({ badge, title, subtitle, center = false }: { badge?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      {badge && <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent font-body mb-3">{badge}</span>}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground font-body max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  )
}

function ProductCard({ product, onAddCart }: { product: any; onAddCart?: (p: any) => void }) {
  const [wished, setWished] = useState(false)
  const navigate = useNavigate()
  return (
    <div
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
      onClick={() => navigate(`/san-pham/${product.id}`)}
    >
      <div className="relative overflow-hidden aspect-square bg-muted">
        <img src={img(product.image, 400, 400)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10"
          onClick={e => { e.stopPropagation(); setWished(v => !v) }}
        >
          <Heart size={14} className={wished ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
        </button>
        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-foreground text-xs font-semibold px-3 py-1 rounded-full">Hết hàng</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        {product.ocop && <OcopBadge stars={product.ocop} />}
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 font-body group-hover:text-primary transition-colors">{product.name}</h3>
        <StarRating rating={product.rating} count={product.reviews} />
        <p className="text-xs text-muted-foreground font-body line-clamp-1">{product.village}</p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <div>
            <span className="font-bold text-accent font-body">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="text-xs text-muted-foreground line-through ml-1 font-body">{formatPrice(product.originalPrice)}</span>}
          </div>
          <button
            className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
            onClick={e => { e.stopPropagation(); onAddCart?.(product) }}
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// NAVBAR
// ============================================================
function UserAvatar({ user, size = "sm" }: { user: AuthUser; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
  const initials = user.name.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase()
  return (
    <div className={`${dim} rounded-full overflow-hidden ring-2 ring-primary/30 flex-shrink-0 bg-primary flex items-center justify-center`}>
      <img
        src={`https://images.unsplash.com/${user.avatar}?w=80&h=80&fit=crop&auto=format`}
        alt={user.name}
        className="w-full h-full object-cover"
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
      />
      <span className="font-bold text-primary-foreground absolute font-body">{initials}</span>
    </div>
  )
}

function Navbar({ cartCount, darkMode, onToggleDark, user, onLogout }: {
  cartCount: number; darkMode: boolean; onToggleDark: () => void
  user: AuthUser | null; onLogout: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const links = [
    { to: "/", label: "Trang chủ" },
    { to: "/san-pham", label: "Sản phẩm" },
    { to: "/tho-cam", label: "Thổ cẩm" },
    { to: "/ocop", label: "OCOP" },
    { to: "/van-hoa", label: "Văn hóa" },
    { to: "/lich-cho-phien", label: "Lịch chợ phiên" },
    { to: "/lien-he", label: "Liên hệ" },
  ]

  const handleLogout = () => {
    onLogout()
    setDropOpen(false)
    setMenuOpen(false)
    navigate("/")
    toast.success("Đã đăng xuất thành công")
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/95 backdrop-blur-md shadow-md border-b border-border" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Leaf size={18} className="text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base text-foreground">Chợ Phiên</div>
              <div className="font-body text-xs text-accent font-semibold tracking-wide -mt-0.5">NGOK BAY</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"}
                className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium font-body transition-colors ${isActive ? "text-primary bg-primary/10" : "text-foreground/70 hover:text-foreground hover:bg-muted"}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={onToggleDark} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
              {darkMode ? <Sun size={18} className="text-foreground" /> : <Moon size={18} className="text-foreground" />}
            </button>
            <Link to="/gio-hang" className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
              <ShoppingCart size={18} className="text-foreground" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>

            {user ? (
              /* ── Logged-in user button + dropdown ── */
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(v => !v)}
                  className="hidden sm:flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl hover:bg-muted transition-colors border border-border"
                >
                  <UserAvatar user={user} size="sm" />
                  <span className="text-sm font-medium font-body text-foreground max-w-[100px] truncate">{user.name.split(" ").slice(-1)[0]}</span>
                  <ChevronDown size={14} className={`text-muted-foreground transition-transform ${dropOpen ? "rotate-180" : ""}`} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 py-1">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                      <UserAvatar user={user} size="md" />
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground font-body text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground font-body truncate">{user.email}</p>
                        {user.role === "admin" && (
                          <span className="inline-block mt-0.5 text-[10px] font-bold bg-accent/15 text-accent px-1.5 py-0.5 rounded-full font-body">ADMIN</span>
                        )}
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button onClick={() => { setDropOpen(false); navigate("/tai-khoan") }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-foreground hover:bg-muted transition-colors text-left">
                        <User size={15} className="text-muted-foreground" /> Tài khoản
                      </button>

                      {user.role === "customer" && (
                        <button onClick={() => { setDropOpen(false); navigate("/don-hang-cua-toi") }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-foreground hover:bg-muted transition-colors text-left">
                          <ListOrdered size={15} className="text-muted-foreground" /> Đơn hàng
                        </button>
                      )}

                      {user.role === "admin" && (
                        <button onClick={() => { setDropOpen(false); navigate("/admin") }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-accent hover:bg-accent/10 transition-colors text-left font-semibold">
                          <LayoutDashboard size={15} className="text-accent" /> Quản trị
                        </button>
                      )}

                      <div className="my-1 border-t border-border" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left">
                        <LogOut size={15} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/dang-nhap" className="hidden sm:flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/80 transition-colors font-body">
                <User size={14} /> Đăng nhập
              </Link>
            )}

            <button className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted" onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-card/98 backdrop-blur-md border-t border-border">
          <div className="px-4 py-4 space-y-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-4 py-2.5 rounded-xl text-sm font-medium font-body ${isActive ? "text-primary bg-primary/10" : "text-foreground/70"}`}>
                {l.label}
              </NavLink>
            ))}

            <div className="border-t border-border pt-3 mt-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 mb-1">
                    <UserAvatar user={user} size="sm" />
                    <div>
                      <p className="font-semibold text-foreground font-body text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground font-body">{user.email}</p>
                    </div>
                  </div>
                  {user.role === "admin" && (
                    <button onClick={() => { setMenuOpen(false); navigate("/admin") }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body text-accent hover:bg-accent/10 transition-colors">
                      <LayoutDashboard size={14} /> Quản trị
                    </button>
                  )}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={14} /> Đăng xuất
                  </button>
                </>
              ) : (
                <Link to="/dang-nhap" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold font-body" onClick={() => setMenuOpen(false)}>
                  <User size={14} /> Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  const [email, setEmail] = useState("")
  return (
    <footer className="bg-foreground text-background/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Leaf size={18} className="text-primary-foreground" />
              </div>
              <div>
                <div className="font-display font-bold text-base text-background">Chợ Phiên</div>
                <div className="font-body text-xs text-accent font-semibold -mt-0.5">NGOK BAY</div>
              </div>
            </div>
            <p className="text-sm font-body leading-relaxed text-background/60 mb-5">Nơi lưu giữ và lan tỏa giá trị văn hóa, thổ cẩm và đặc sản của người Bana tại Tây Nguyên.</p>
            <div className="flex gap-3">
              {[Facebook, Youtube, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon size={16} className="text-background" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background font-body mb-4">Khám phá</h4>
            <ul className="space-y-2.5">
              {["Trang chủ", "Sản phẩm", "Thổ cẩm Bana", "Sản phẩm OCOP", "Văn hóa Bana", "Lịch chợ phiên"].map(l => (
                <li key={l}><a href="#" className="text-sm text-background/60 hover:text-background font-body transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background font-body mb-4">Hỗ trợ</h4>
            <ul className="space-y-2.5">
              {["Hướng dẫn mua hàng", "Chính sách đổi trả", "Vận chuyển & Giao hàng", "Chứng nhận OCOP", "Đăng ký gian hàng", "Liên hệ"].map(l => (
                <li key={l}><a href="#" className="text-sm text-background/60 hover:text-background font-body transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background font-body mb-4">Liên hệ</h4>
            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-2.5 text-sm text-background/60 font-body">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-accent" />
                <span>12 Trần Phú, TP Kon Tum, Tỉnh Kon Tum</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-background/60 font-body">
                <Phone size={14} className="text-accent" />
                <span>0900 888 999</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-background/60 font-body">
                <Mail size={14} className="text-accent" />
                <span>hello@ngokbay.vn</span>
              </div>
            </div>
            <h4 className="font-semibold text-background font-body mb-3 text-sm">Nhận thông báo chợ phiên</h4>
            <div className="flex gap-2">
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email của bạn" className="flex-1 bg-background/10 border border-background/20 rounded-xl px-3 py-2 text-sm text-background placeholder:text-background/40 outline-none focus:border-primary font-body" />
              <button className="px-3 py-2 bg-accent text-accent-foreground rounded-xl text-sm hover:bg-accent/80 transition-colors">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40 font-body">© 2025 Chợ Phiên Ngok Bay. Bảo tồn và phát huy văn hóa Bana.</p>
          <div className="flex gap-4">
            {["Điều khoản", "Bảo mật", "Cookie"].map(l => (
              <a key={l} href="#" className="text-xs text-background/40 hover:text-background/70 font-body transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// HOME PAGE
// ============================================================
// hero slides are now managed via HeroContext — see DEFAULT_HERO_SLIDES above

function HeroSection() {
  const { slides } = useHero()
  const [slideIdx, setSlideIdx] = useState(0)
  const navigate = useNavigate()

  // Reset slide index if slides shrink
  useEffect(() => {
    if (slideIdx >= slides.length) setSlideIdx(0)
  }, [slides.length, slideIdx])

  useEffect(() => {
    if (slides.length === 0) return
    const t = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  if (slides.length === 0) return null
  const s = slides[slideIdx]
  const heroImgSrc = s.image.startsWith("http") ? s.image : img(s.image, 1600, 900)

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-foreground/50 z-10" />
      <img key={heroImgSrc} src={heroImgSrc} alt="Hero" className="absolute inset-0 w-full h-full object-cover transition-all duration-700" />
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-accent font-semibold font-body mb-4 bg-accent/20 px-3 py-1 rounded-full border border-accent/30">{s.subtitle}</span>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-5">{s.title}</h1>
          <p className="font-body text-white/80 text-lg leading-relaxed mb-8 max-w-lg">{s.desc}</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate(s.btn1Link || "/san-pham")} className="bg-accent text-accent-foreground px-7 py-3.5 rounded-2xl font-semibold hover:bg-accent/80 transition-all hover:scale-105 font-body flex items-center gap-2">
              {s.btn1} <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate(s.btn2Link || "/lich-cho-phien")} className="bg-white/20 backdrop-blur-sm text-white px-7 py-3.5 rounded-2xl font-semibold hover:bg-white/30 transition-all border border-white/30 font-body">
              {s.btn2}
            </button>
          </div>
        </div>
      </div>
      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setSlideIdx(i)} className={`transition-all ${i === slideIdx ? "w-8 h-2 bg-accent" : "w-2 h-2 bg-white/50"} rounded-full`} />
        ))}
      </div>
      <button onClick={() => setSlideIdx(i => (i - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
        <ChevronLeft size={18} />
      </button>
      <button onClick={() => setSlideIdx(i => (i + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
        <ChevronRight size={18} />
      </button>
    </section>
  )
}

function HomePage({ onAddCart }: { onAddCart: (p: any) => void }) {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { markets } = useMarket()

  useEffect(() => { setTimeout(() => setIsLoading(false), 600) }, [])
  if (isLoading) return <div className="pt-16"><Loading /></div>

  return (
    <main>
      {/* Hero — driven by HeroContext */}
      <HeroSection />

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Danh mục" title="Sản phẩm nổi bật" subtitle="Khám phá các dòng sản phẩm thủ công mỹ nghệ và đặc sản vùng cao Tây Nguyên" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map(cat => (
              <div key={cat.id} onClick={() => navigate(`/san-pham?cat=${cat.name}`)} className="group cursor-pointer relative overflow-hidden rounded-2xl aspect-[3/4] bg-muted">
                <img src={img(cat.image, 400, 530)} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-3xl mb-1">{cat.icon}</div>
                  <h3 className="font-display font-bold text-white text-xl">{cat.name}</h3>
                  <p className="text-white/70 text-sm font-body">{cat.count} sản phẩm</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Schedule */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <SectionHeader badge="Sự kiện" title="Lịch chợ phiên sắp tới" subtitle="Đừng bỏ lỡ những phiên chợ đặc sắc" />
            <Link to="/lich-cho-phien" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/70 font-body whitespace-nowrap pb-1">
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {markets.filter(m => m.visible).slice(0, 3).map(m => (
              <div key={m.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Calendar size={20} className="text-accent" />
                  </div>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full font-body">Sắp diễn ra</span>
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{m.name}</h3>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <Calendar size={13} className="text-accent" /> {m.startDate} • {m.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <MapPin size={13} className="text-accent" /> {m.location.full}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <Users size={13} className="text-accent" /> {m.vendors} gian hàng • ~{m.expectedVisitors} khách
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.highlights.map(h => <span key={h} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-body">{h}</span>)}
                </div>
                <button onClick={() => navigate(`/lich-cho-phien/${m.id}`)} className="w-full flex items-center justify-center gap-2 py-2.5 border border-primary text-primary rounded-xl text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors font-body">
                  <ExternalLink size={14} /> Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <SectionHeader badge="Bán chạy" title="Sản phẩm nổi bật" subtitle="Tuyển chọn những sản phẩm được yêu thích nhất" />
            <Link to="/san-pham" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/70 font-body whitespace-nowrap pb-1">
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {PRODUCTS.slice(0, 8).map(p => <ProductCard key={p.id} product={p} onAddCart={onAddCart} />)}
          </div>
        </div>
      </section>

      {/* Culture Banner */}
      <section className="py-20 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={img("photo-1506905925346-21bda4d32df4", 1600, 600)} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs uppercase tracking-widest text-accent font-semibold font-body mb-4">Văn hóa Bana</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-background leading-tight mb-6">
                Khám phá tinh hoa<br />văn hóa Tây Nguyên
              </h2>
              <p className="font-body text-background/70 text-lg leading-relaxed mb-8">
                Người Bana tại Kon Tum sở hữu nền văn hóa phong phú với cồng chiêng, thổ cẩm, và kiến trúc nhà rông độc đáo. Hãy cùng chúng tôi khám phá và bảo tồn những giá trị vô giá này.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[{ num: "50+", label: "Nghệ nhân" }, { num: "200+", label: "Hoa văn" }, { num: "40+", label: "Phiên chợ" }].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="font-display text-3xl font-bold text-accent">{s.num}</div>
                    <div className="text-sm text-background/60 font-body">{s.label}</div>
                  </div>
                ))}
              </div>
              <Link to="/van-hoa" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 rounded-2xl font-semibold hover:bg-accent/80 transition-all hover:scale-105 font-body">
                Khám phá văn hóa <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["photo-1558618666-fcd25c85cd64", "photo-1606503153255-59d8b8b82176", "photo-1511379938547-c1f69419868d", "photo-1447933601403-0c6688de566e"].map((id, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 ? "aspect-square" : i === 1 ? "aspect-video" : i === 2 ? "aspect-video" : "aspect-square"}`}>
                  <img src={img(id, 400, 400)} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artisans */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Nghệ nhân" title="Những bàn tay vàng" subtitle="Gặp gỡ những nghệ nhân tài hoa đang giữ gìn và phát huy văn hóa Bana" center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {ARTISANS.map(a => (
              <div key={a.id} className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow text-center p-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-primary/20">
                  <img src={img(a.image, 200, 200)} alt={a.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-1">{a.name}</h3>
                <p className="text-sm text-accent font-semibold font-body mb-1">{a.specialty}</p>
                <p className="text-xs text-muted-foreground font-body mb-3">{a.village} • {a.experience} năm kinh nghiệm</p>
                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                  {a.awards.map(aw => <span key={aw} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body">{aw}</span>)}
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3">{a.story}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

// ============================================================
// PRODUCT LIST PAGE
// ============================================================
function ProductListPage({ onAddCart }: { onAddCart: (p: any) => void }) {
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("Tất cả")
  const [ocopFilter, setOcopFilter] = useState(false)
  const [priceMax, setPriceMax] = useState(1000000)
  const [sort, setSort] = useState("Mới nhất")
  const [page, setPage] = useState(1)
  const PER_PAGE = 8

  const cats = ["Tất cả", ...Array.from(new Set(PRODUCTS.map(p => p.category)))]
  const filtered = PRODUCTS.filter(p =>
    (catFilter === "Tất cả" || p.category === catFilter) &&
    (!ocopFilter || p.ocop !== null) &&
    p.price <= priceMax &&
    p.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (sort === "Giá tăng") return a.price - b.price
    if (sort === "Giá giảm") return b.price - a.price
    if (sort === "Đánh giá") return b.rating - a.rating
    return b.id - a.id
  })
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Tất cả sản phẩm</h1>
          <p className="text-muted-foreground font-body">Khám phá {PRODUCTS.length} sản phẩm thủ công và đặc sản Tây Nguyên</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="font-semibold text-foreground font-body mb-5 flex items-center gap-2"><Filter size={16} /> Bộ lọc</h3>

              <div className="mb-6">
                <label className="text-xs uppercase tracking-wide text-muted-foreground font-body font-semibold mb-3 block">Danh mục</label>
                <div className="space-y-1">
                  {cats.map(c => (
                    <button key={c} onClick={() => { setCatFilter(c); setPage(1) }}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg font-body transition-colors ${catFilter === c ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs uppercase tracking-wide text-muted-foreground font-body font-semibold mb-3 block">Giá tối đa</label>
                <input type="range" min={50000} max={1000000} step={50000} value={priceMax} onChange={e => { setPriceMax(+e.target.value); setPage(1) }} className="w-full accent-primary" />
                <div className="text-sm text-primary font-semibold font-body mt-1">{formatPrice(priceMax)}</div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={ocopFilter} onChange={e => { setOcopFilter(e.target.checked); setPage(1) }} className="accent-primary w-4 h-4" />
                  <span className="text-sm font-body text-foreground">Chỉ sản phẩm OCOP</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Tìm kiếm sản phẩm..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm font-body outline-none focus:border-primary" />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-body outline-none focus:border-primary">
                {["Mới nhất", "Giá tăng", "Giá giảm", "Đánh giá"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <p className="text-sm text-muted-foreground font-body mb-4">Tìm thấy <strong className="text-foreground">{filtered.length}</strong> sản phẩm</p>

            {paged.length === 0
              ? <EmptyState icon={Search} title="Không tìm thấy sản phẩm" desc="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm" />
              : <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {paged.map(p => <ProductCard key={p.id} product={p} onAddCart={onAddCart} />)}
                </div>
            }

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-semibold font-body transition-colors ${p === page ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>{p}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

// ============================================================
// PRODUCT DETAIL PAGE
// ============================================================
function ProductDetailPage({ onAddCart }: { onAddCart: (p: any) => void }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS.find(p => p.id === Number(id))
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const imgs = [product?.image || "", "photo-1558618666-fcd25c85cd64", "photo-1606503153255-59d8b8b82176"]

  if (!product) return <div className="pt-24"><EmptyState title="Không tìm thấy sản phẩm" desc="Sản phẩm không tồn tại hoặc đã bị xóa" /></div>

  const handleAddCart = () => {
    onAddCart({ ...product, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body mb-8 transition-colors">
          <ChevronLeft size={16} /> Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div>
            <div className="rounded-2xl overflow-hidden aspect-square bg-muted mb-4 relative group">
              <img src={img(imgs[activeImg], 700, 700)} alt={product.name} className="w-full h-full object-cover" />
              {product.ocop && <div className="absolute top-4 left-4"><OcopBadge stars={product.ocop} /></div>}
            </div>
            <div className="flex gap-3">
              {imgs.map((im, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-primary" : "border-border"}`}>
                  <img src={img(im, 200, 200)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-accent font-semibold font-body mb-2">{product.category}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
            <StarRating rating={product.rating} count={product.reviews} />
            <div className="flex items-center gap-3 my-5">
              <span className="font-display text-4xl font-bold text-accent">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-xl text-muted-foreground line-through font-body">{formatPrice(product.originalPrice)}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-muted rounded-2xl">
              {[{ label: "Nghệ nhân", val: product.artisan }, { label: "Làng nghề", val: product.village }, { label: "Chất liệu", val: product.material }, { label: "Kích thước", val: product.size }].map(row => (
                <div key={row.label}>
                  <div className="text-xs text-muted-foreground font-body">{row.label}</div>
                  <div className="text-sm font-semibold text-foreground font-body">{row.val}</div>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground font-body leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-muted transition-colors"><Minus size={14} /></button>
                <span className="px-4 py-3 font-semibold font-body min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 hover:bg-muted transition-colors"><Plus size={14} /></button>
              </div>
              <span className="text-sm text-muted-foreground font-body">{product.inStock ? "Còn hàng" : "Hết hàng"}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={handleAddCart} disabled={!product.inStock} className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold font-body transition-all ${added ? "bg-primary/20 text-primary" : "bg-primary text-primary-foreground hover:bg-primary/80"} disabled:opacity-50`}>
                {added ? <><Check size={16} /> Đã thêm!</> : <><ShoppingCart size={16} /> Thêm vào giỏ</>}
              </button>
              <button disabled={!product.inStock} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold font-body bg-accent text-accent-foreground hover:bg-accent/80 transition-colors disabled:opacity-50">
                <ShoppingBag size={16} /> Mua ngay
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[{ icon: Truck, label: "Giao hàng toàn quốc" }, { icon: Shield, label: "Đảm bảo chất lượng" }, { icon: Award, label: "Hàng OCOP chứng nhận" }].map(({ icon: Icon, label }) => (
                <div key={label} className="p-3 bg-muted rounded-xl">
                  <Icon size={18} className="text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground font-body">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        <div>
          <SectionHeader badge="Gợi ý" title="Sản phẩm liên quan" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} onAddCart={onAddCart} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// ============================================================
// THO CAM PAGE
// ============================================================
function ThoCamPage() {
  const STEPS = [
    { step: "01", title: "Trồng và thu hoạch bông", desc: "Người phụ nữ Bana tự trồng cây bông hoặc thu thập sợi tự nhiên từ rừng núi Kon Tum" },
    { step: "02", title: "Tách và kéo sợi", desc: "Sợi bông được tách, làm sạch và kéo thành từng cuộn sợi mỏng bằng tay" },
    { step: "03", title: "Nhuộm màu tự nhiên", desc: "Sử dụng thực vật như cây chàm, củ nghệ, lá cây để nhuộm màu tự nhiên, bền màu" },
    { step: "04", title: "Dệt trên khung cửi", desc: "Nghệ nhân dệt tay trên khung cửi truyền thống, tạo ra hoa văn phức tạp và tinh tế" },
    { step: "05", title: "Hoàn thiện và kiểm tra", desc: "Kiểm tra chất lượng, cắt chỉ thừa và hoàn thiện sản phẩm trước khi đưa ra thị trường" },
  ]

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={img("photo-1606503153255-59d8b8b82176", 1600, 600)} alt="Thổ cẩm Bana" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30 flex items-end pb-12 px-8">
          <div className="max-w-7xl mx-auto w-full">
            <span className="text-xs text-accent font-semibold uppercase tracking-widest font-body">Di sản văn hóa</span>
            <h1 className="font-display text-5xl font-bold text-white mt-2">Thổ cẩm Bana</h1>
            <p className="text-white/70 font-body mt-2">Tinh hoa dệt tay truyền qua nhiều thế hệ</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <SectionHeader badge="Giới thiệu" title="Nghệ thuật dệt thổ cẩm Bana" subtitle="Thổ cẩm của người Bana không chỉ là trang phục, mà còn là ngôn ngữ, là lịch sử, là tâm hồn của cả một dân tộc được mã hóa qua từng sợi tơ." />
            <p className="font-body text-muted-foreground leading-relaxed mb-6">Mỗi hoa văn trên tấm thổ cẩm Bana đều mang ý nghĩa sâu sắc - từ hình ảnh thiên nhiên như núi rừng, sông suối đến biểu tượng văn hóa như con rùa mang may mắn, cây nêu linh thiêng trong lễ hội.</p>
            <div className="flex gap-6">
              {[{ num: "200+", label: "Hoa văn độc đáo" }, { num: "500+", label: "Năm lịch sử" }, { num: "50+", label: "Nghệ nhân" }].map(s => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-bold text-accent">{s.num}</div>
                  <div className="text-xs text-muted-foreground font-body">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["photo-1606503153255-59d8b8b82176", "photo-1558618666-fcd25c85cd64", "photo-1544966503-7cc5ac882d5d", "photo-1515562141207-7a88fb7ce338"].map((id, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-square bg-muted">
                <img src={img(id, 400, 400)} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <SectionHeader badge="Quy trình" title="Từ sợi bông đến tấm thổ cẩm" center />
          <div className="relative mt-10">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            <div className="space-y-8">
              {STEPS.map((s, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="relative flex-shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-display font-bold text-xl shadow-lg z-10">
                    {s.step}
                  </div>
                  <div className="bg-card rounded-2xl border border-border p-6 flex-1 hover:shadow-md transition-shadow">
                    <h3 className="font-display font-bold text-foreground text-xl mb-2">{s.title}</h3>
                    <p className="text-muted-foreground font-body">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Artisans */}
        <div className="mb-20">
          <SectionHeader badge="Con người" title="Những nghệ nhân tài hoa" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTISANS.map(a => (
              <div key={a.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img src={img(a.image, 400, 300)} alt={a.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-xl text-foreground mb-1">{a.name}</h3>
                  <p className="text-accent font-semibold text-sm font-body mb-1">{a.specialty}</p>
                  <p className="text-xs text-muted-foreground font-body mb-3">{a.village} • {a.experience} năm</p>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3">{a.story}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <SectionHeader badge="Mua sắm" title="Sản phẩm thổ cẩm" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PRODUCTS.filter(p => p.category === "Thổ cẩm").map(p => <ProductCard key={p.id} product={p} onAddCart={() => {}} />)}
          </div>
        </div>
      </div>
    </main>
  )
}

// ============================================================
// OCOP PAGE
// ============================================================
function OCOPPage({ onAddCart }: { onAddCart: (p: any) => void }) {
  const [starFilter, setStarFilter] = useState(0)
  const [catFilter, setCatFilter] = useState("Tất cả")

  const filtered = PRODUCTS.filter(p => p.ocop !== null).filter(p => (starFilter === 0 || p.ocop === starFilter) && (catFilter === "Tất cả" || p.category === catFilter))

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="relative h-72 overflow-hidden">
        <img src={img("photo-1512621776951-a57141f2eefd", 1600, 500)} alt="OCOP" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60 flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <span className="text-xs text-accent font-semibold uppercase tracking-widest font-body">Chứng nhận quốc gia</span>
            <h1 className="font-display text-5xl font-bold text-white mt-2 mb-3">Sản phẩm OCOP</h1>
            <p className="text-white/70 font-body max-w-xl">Chương trình Mỗi xã một sản phẩm - Tôn vinh đặc sản địa phương đạt chuẩn chất lượng quốc gia</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[{ num: "3★", label: "Đạt chuẩn", desc: "Sản phẩm đạt tiêu chuẩn địa phương" }, { num: "4★", label: "Tốt", desc: "Sản phẩm đạt tiêu chuẩn vùng" }, { num: "5★", label: "Xuất sắc", desc: "Sản phẩm tiêu chuẩn quốc gia" }, { num: "5★+", label: "Tiềm năng XK", desc: "Hướng tới tiêu chuẩn quốc tế" }].map(s => (
            <div key={s.label} className="bg-card rounded-2xl border border-border p-5 text-center">
              <div className="font-display text-3xl font-bold text-accent mb-1">{s.num}</div>
              <div className="font-semibold text-foreground font-body text-sm mb-1">{s.label}</div>
              <div className="text-xs text-muted-foreground font-body">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground font-body self-center">Lọc theo sao:</span>
            {[0, 3, 4, 5].map(s => (
              <button key={s} onClick={() => setStarFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-semibold font-body transition-colors ${starFilter === s ? "bg-accent text-accent-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>
                {s === 0 ? "Tất cả" : `${s}★`}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Tất cả", ...Array.from(new Set(PRODUCTS.map(p => p.category)))].map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className={`px-4 py-2 rounded-xl text-sm font-semibold font-body transition-colors ${catFilter === c ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0
          ? <EmptyState icon={Award} title="Không tìm thấy sản phẩm OCOP" desc="Thử thay đổi bộ lọc" />
          : <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map(p => (
                <div key={p.id} className="relative">
                  <ProductCard product={p} onAddCart={onAddCart} />
                  <button className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs text-primary border border-primary rounded-xl py-2 hover:bg-primary hover:text-primary-foreground transition-colors font-body">
                    <Download size={12} /> Tải chứng nhận PDF
                  </button>
                </div>
              ))}
            </div>
        }
      </div>
    </main>
  )
}

// ============================================================
// VAN HOA PAGE
// ============================================================
function VanHoaPage() {
  const [dictSearch, setDictSearch] = useState("")
  const filtered = BANA_DICTIONARY.filter(w => w.vietnamese.includes(dictSearch) || w.bana.includes(dictSearch))

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="relative h-72 overflow-hidden">
        <img src={img("photo-1511379938547-c1f69419868d", 1600, 500)} alt="Văn hóa" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60 flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <span className="text-xs text-accent font-semibold uppercase tracking-widest font-body">Bảo tồn & Phát huy</span>
            <h1 className="font-display text-5xl font-bold text-white mt-2">Văn hóa Bana</h1>
            <p className="text-white/70 font-body mt-2">Khám phá kho tàng văn hóa phong phú của người Bana tại Tây Nguyên</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Articles */}
        <div className="mb-16">
          <SectionHeader badge="Bài viết" title="Khám phá văn hóa Bana" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CULTURAL_ARTICLES.map((a, i) => (
              <div key={a.id} className={`group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${i === 0 ? "md:col-span-2" : ""}`}>
                <div className={`${i === 0 ? "flex flex-col md:flex-row" : ""}`}>
                  <div className={`overflow-hidden bg-muted ${i === 0 ? "md:w-1/2 h-64 md:h-auto" : "h-48"}`}>
                    <img src={img(a.image, 800, 400)} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-body font-semibold">{a.category}</span>
                      <span className="text-xs text-muted-foreground font-body">{a.date}</span>
                      <span className="text-xs text-muted-foreground font-body flex items-center gap-1"><Eye size={10} /> {a.views.toLocaleString()}</span>
                    </div>
                    <h3 className={`font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors ${i === 0 ? "text-2xl" : "text-lg"}`}>{a.title}</h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed line-clamp-3">{a.excerpt}</p>
                    <button className="mt-4 self-start flex items-center gap-1 text-sm text-primary font-semibold font-body hover:gap-2 transition-all">
                      Đọc thêm <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instruments */}
        <div className="mb-16">
          <SectionHeader badge="Âm nhạc" title="Nhạc cụ truyền thống Bana" subtitle="Mỗi nhạc cụ là tiếng nói của đất trời Tây Nguyên" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {INSTRUMENTS.map(inst => (
              <div key={inst.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Music size={28} className="text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{inst.name}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{inst.description}</p>
                <button className="mt-4 flex items-center justify-center gap-1.5 text-sm text-primary font-semibold font-body mx-auto hover:text-primary/70 transition-colors">
                  <Volume2 size={12} /> Nghe âm thanh
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bana Dictionary */}
        <div className="bg-card rounded-3xl border border-border p-8">
          <SectionHeader badge="Ngôn ngữ" title="Từ điển Bana cơ bản" subtitle="Học một vài từ để giao tiếp với người Bana khi tham quan chợ phiên" />
          <div className="relative mb-6">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={dictSearch} onChange={e => setDictSearch(e.target.value)} placeholder="Tìm từ Việt hoặc Bana..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted text-foreground text-sm font-body outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(w => (
              <div key={w.bana} className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                <div className="flex-1">
                  <div className="font-display font-bold text-lg text-primary">{w.bana}</div>
                  <div className="text-xs text-muted-foreground font-body italic">/{w.pronunciation}/</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground font-body">{w.vietnamese}</div>
                  <div className="text-xs text-muted-foreground font-body">tiếng Việt</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// ============================================================
// LICH CHO PHIEN PAGE
// ============================================================
function LichChoPhienPage() {
  const { markets, registrations } = useMarket()
  const navigate = useNavigate()
  const visibleMarkets = markets.filter(m => m.visible)

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="relative h-72 overflow-hidden">
        <img src={img("photo-1506905925346-21bda4d32df4", 1600, 500)} alt="Lịch chợ phiên" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/65 flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <span className="text-xs text-accent font-semibold uppercase tracking-widest font-body">Sự kiện</span>
            <h1 className="font-display text-5xl font-bold text-white mt-2">Lịch Chợ Phiên</h1>
            <p className="text-white/70 font-body mt-2">Cập nhật lịch tổ chức chợ phiên Ngok Bay trong năm 2025</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Schedule */}
        <div className="mb-16">
          <SectionHeader badge="Lịch trình" title="Các phiên chợ sắp diễn ra" />
          <div className="space-y-6">
            {visibleMarkets.map((m) => {
              const approvedBooths = registrations.filter(r => r.marketId === m.id && r.status === "approved").length
              const day = m.startDate ? new Date(m.startDate).getDate() : ""
              const month = m.startDate ? new Date(m.startDate).getMonth() + 1 : ""
              return (
                <div key={m.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-20 h-20 bg-accent/10 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                      <span className="font-display text-2xl font-bold text-accent">{day}</span>
                      <span className="text-xs text-muted-foreground font-body">Tháng {month}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-display font-bold text-xl text-foreground">{m.name}</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body font-semibold">Sắp diễn ra</span>
                        {m.registrationOpen && <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-body font-semibold">Đang nhận ĐK</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                          <Clock size={13} className="text-accent" /> {m.time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                          <MapPin size={13} className="text-accent" /> <span className="truncate">{m.location.full}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                          <Store size={13} className="text-accent" /> {approvedBooths} gian hàng
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.highlights.map(h => <span key={h} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-body">{h}</span>)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => navigate(`/lich-cho-phien/${m.id}`)} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold font-body hover:bg-primary/80 transition-colors flex items-center gap-2">
                        <ExternalLink size={14} /> Xem chi tiết
                      </button>
                      {m.registrationOpen && (
                        <button onClick={() => navigate(`/lich-cho-phien/${m.id}`)} className="px-5 py-2.5 border border-primary text-primary rounded-xl text-sm font-semibold font-body hover:bg-primary/10 transition-colors flex items-center gap-2">
                          <ClipboardList size={14} /> Đăng ký gian hàng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* History */}
        <div className="mb-16">
          <SectionHeader badge="Lịch sử" title="Hành trình 7 năm" subtitle="Từ phiên chợ nhỏ đến nền tảng thương mại điện tử" />
          <div className="relative">
            <div className="absolute left-[2.4rem] top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            <div className="space-y-6">
              {MARKET_HISTORY.map((h, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-20 flex-shrink-0 font-display font-bold text-2xl text-accent text-right hidden md:block pt-4">{h.year}</div>
                  <div className="w-5 h-5 rounded-full bg-primary flex-shrink-0 mt-5 ring-4 ring-background hidden md:flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  </div>
                  <div className="bg-card rounded-2xl border border-border p-5 flex-1">
                    <div className="md:hidden font-display font-bold text-accent mb-1">{h.year}</div>
                    <h3 className="font-semibold text-foreground font-body mb-1">{h.event}</h3>
                    <p className="text-sm text-muted-foreground font-body">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-3xl p-8 md:p-12 text-center">
          <Bell size={32} className="text-primary-foreground mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-3">Muốn tham gia chợ phiên?</h2>
          <p className="text-primary-foreground/70 font-body mb-6">Chọn phiên chợ và đăng ký gian hàng trực tuyến ngay hôm nay</p>
          <div className="flex flex-wrap justify-center gap-4">
            {visibleMarkets.filter(m => m.registrationOpen).slice(0, 2).map(m => (
              <button key={m.id} onClick={() => navigate(`/lich-cho-phien/${m.id}`)}
                className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold font-body hover:bg-accent/80 transition-colors flex items-center gap-2">
                <ClipboardList size={15} /> Đăng ký — {m.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// ============================================================
// MARKET DETAIL PAGE
// ============================================================
function MarketDetailPage() {
  const { id } = useParams()
  const { markets, registrations, setRegistrations } = useMarket()
  const navigate = useNavigate()
  const [showRegModal, setShowRegModal] = useState(false)
  const [regForm, setRegForm] = useState({ boothName: "", ownerName: "", phone: "", email: "", address: "", products: "", category: PRODUCT_CATEGORIES_LIST[0] })
  const [regSubmitting, setRegSubmitting] = useState(false)

  const market = markets.find(m => m.id === Number(id))
  if (!market) return (
    <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
      <EmptyState title="Không tìm thấy phiên chợ" subtitle="Phiên chợ này không tồn tại hoặc đã bị xóa" />
    </main>
  )

  const approvedBooths = registrations.filter(r => r.marketId === market.id && r.status === "approved")

  const submitRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    setRegSubmitting(true)
    setTimeout(() => {
      const newReg: BoothRegistration = {
        id: `DK${Date.now()}`,
        marketId: market.id,
        marketName: market.name,
        ...regForm,
        status: "pending",
        submittedAt: new Date().toLocaleDateString("vi-VN"),
        note: ""
      }
      setRegistrations(rs => [...rs, newReg])
      toast.success("Đăng ký gian hàng thành công! Chúng tôi sẽ xem xét và phản hồi sớm nhất.")
      setRegSubmitting(false)
      setShowRegModal(false)
      setRegForm({ boothName: "", ownerName: "", phone: "", email: "", address: "", products: "", category: PRODUCT_CATEGORIES_LIST[0] })
    }, 1000)
  }

  const day = market.startDate ? new Date(market.startDate).getDate() : ""
  const monthYear = market.startDate ? new Date(market.startDate).toLocaleDateString("vi-VN", { month: "long", year: "numeric" }) : ""

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img src={img(market.images[0], 1600, 500)} alt={market.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/65 flex items-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8 w-full">
            <button onClick={() => navigate("/lich-cho-phien")} className="text-white/60 hover:text-white text-sm font-body flex items-center gap-1 mb-3 transition-colors">
              <ChevronLeft size={14} /> Lịch chợ phiên
            </button>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-body font-semibold">Sắp diễn ra</span>
              {market.registrationOpen && <span className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-body font-semibold">Đang nhận đăng ký</span>}
            </div>
            <h1 className="font-display text-4xl font-bold text-white">{market.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info card */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Thông tin phiên chợ</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0"><Calendar size={16} className="text-accent" /></div>
                  <div><p className="text-xs text-muted-foreground font-body">Ngày tổ chức</p><p className="text-sm font-semibold text-foreground font-body">{day} {monthYear}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0"><Clock size={16} className="text-accent" /></div>
                  <div><p className="text-xs text-muted-foreground font-body">Giờ họp chợ</p><p className="text-sm font-semibold text-foreground font-body">{market.time}</p></div>
                </div>
                <div className="flex items-start gap-3 col-span-2">
                  <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin size={16} className="text-accent" /></div>
                  <div><p className="text-xs text-muted-foreground font-body">Địa điểm</p><p className="text-sm font-semibold text-foreground font-body">{market.location.full}</p></div>
                </div>
              </div>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{market.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {market.categories.map(c => <span key={c} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-body font-semibold">{c}</span>)}
              </div>
            </div>

            {/* Approved booths */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Store size={18} className="text-primary" /> Gian hàng tham gia ({approvedBooths.length})
              </h2>
              {approvedBooths.length === 0 ? (
                <EmptyState title="Chưa có gian hàng được duyệt" subtitle="Gian hàng sẽ xuất hiện sau khi admin duyệt đăng ký" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {approvedBooths.map(b => (
                    <div key={b.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BadgeCheck size={16} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground font-body truncate">{b.boothName}</p>
                        <p className="text-xs text-muted-foreground font-body">{b.category}</p>
                        <p className="text-xs text-muted-foreground font-body truncate">{b.products}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Map size={18} className="text-primary" /> Bản đồ
              </h2>
              <div className="bg-muted rounded-xl h-64 flex items-center justify-center border border-border relative overflow-hidden">
                <div className="text-center z-10">
                  <Map size={40} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-body mb-3">{market.location.full}</p>
                  <a href={`https://maps.google.com/maps?q=${encodeURIComponent(market.location.full)}`} target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold font-body hover:bg-primary/80 transition-colors inline-flex items-center gap-2">
                    <ExternalLink size={13} /> Mở Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration CTA */}
            <div className="bg-primary rounded-2xl p-6 text-center">
              <ClipboardList size={28} className="text-primary-foreground mx-auto mb-3" />
              <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">Đăng ký gian hàng</h3>
              {market.registrationOpen ? (
                <>
                  <p className="text-primary-foreground/70 font-body text-sm mb-4">Đang nhận đăng ký! Nhanh tay đặt gian hàng tại phiên chợ này.</p>
                  <button onClick={() => setShowRegModal(true)} className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-semibold font-body hover:bg-accent/80 transition-colors">
                    Đăng ký ngay
                  </button>
                </>
              ) : (
                <p className="text-primary-foreground/70 font-body text-sm mt-2">Đăng ký gian hàng đã đóng.</p>
              )}
            </div>

            {/* Contact */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground font-body mb-3">Liên hệ</h3>
              <div className="space-y-3">
                {market.contact.phone && <div className="flex items-center gap-3"><Phone size={15} className="text-accent flex-shrink-0" /><span className="text-sm text-foreground font-body">{market.contact.phone}</span></div>}
                {market.contact.email && <div className="flex items-center gap-3"><Mail size={15} className="text-accent flex-shrink-0" /><span className="text-sm text-foreground font-body">{market.contact.email}</span></div>}
                {market.contact.fanpage && <div className="flex items-center gap-3"><Facebook size={15} className="text-accent flex-shrink-0" /><span className="text-sm text-foreground font-body">{market.contact.fanpage}</span></div>}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground font-body mb-3">Thống kê</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground font-body">Gian hàng đã duyệt</span><span className="font-bold text-foreground font-body">{approvedBooths.length}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground font-body">Khách dự kiến</span><span className="font-bold text-foreground font-body">{market.expectedVisitors.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground font-body">Danh mục</span><span className="font-bold text-foreground font-body">{market.categories.length}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booth Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowRegModal(false)}>
          <div className="bg-card rounded-3xl border border-border w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border px-8 py-5 flex items-center justify-between rounded-t-3xl">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Đăng ký gian hàng</h3>
                <p className="text-xs text-muted-foreground font-body">{market.name}</p>
              </div>
              <button onClick={() => setShowRegModal(false)} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
            </div>
            <form onSubmit={submitRegistration} className="p-8 space-y-4">
              {[
                { key: "boothName", label: "Tên gian hàng *", placeholder: "VD: Gùi đan tre Kon Klor", required: true },
                { key: "ownerName", label: "Họ và tên chủ gian hàng *", placeholder: "Nguyễn Văn A", required: true },
                { key: "phone", label: "Số điện thoại *", placeholder: "0901 234 567", required: true },
                { key: "email", label: "Email", placeholder: "email@example.com", required: false },
                { key: "address", label: "Địa chỉ *", placeholder: "Làng / Xã / Huyện / Tỉnh", required: true },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-foreground font-body mb-1.5">{f.label}</label>
                  <input required={f.required} value={(regForm as any)[f.key]} onChange={e => setRegForm(rf => ({ ...rf, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-foreground font-body mb-1.5">Sản phẩm dự kiến bán *</label>
                <textarea required rows={2} value={regForm.products} onChange={e => setRegForm(rf => ({ ...rf, products: e.target.value }))} placeholder="Liệt kê các sản phẩm bạn sẽ mang đến..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground font-body mb-1.5">Danh mục *</label>
                <select value={regForm.category} onChange={e => setRegForm(rf => ({ ...rf, category: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary">
                  {PRODUCT_CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowRegModal(false)} className="flex-1 py-3 border border-border rounded-2xl text-sm font-semibold font-body hover:bg-muted transition-colors">Hủy</button>
                <button type="submit" disabled={regSubmitting} className="flex-1 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold font-body hover:bg-primary/80 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {regSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang gửi...</> : "Gửi đăng ký"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

// ============================================================
// CART PAGE
// ============================================================
function CartPage({ cart, setCart }: { cart: any[]; setCart: (c: any[]) => void }) {
  const navigate = useNavigate()
  const [voucher, setVoucher] = useState("")
  const [voucherApplied, setVoucherApplied] = useState(false)

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
  }
  const remove = (id: number) => setCart(cart.filter(i => i.id !== id))

  const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0)
  const shipping = subtotal > 500000 ? 0 : 35000
  const discount = voucherApplied ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Giỏ hàng ({cart.length})</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <EmptyState icon={ShoppingCart} title="Giỏ hàng trống" desc="Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm" />
            <button onClick={() => navigate("/san-pham")} className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold font-body hover:bg-primary/80 transition-colors">
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-card rounded-2xl border border-border p-4 flex gap-4 items-center">
                  <img src={img(item.image, 200, 200)} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground font-body text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground font-body">{item.village}</p>
                    {item.ocop && <div className="mt-1"><OcopBadge stars={item.ocop} /></div>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(item.id, -1)} className="px-2.5 py-1.5 hover:bg-muted"><Minus size={12} /></button>
                        <span className="px-3 text-sm font-semibold font-body">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="px-2.5 py-1.5 hover:bg-muted"><Plus size={12} /></button>
                      </div>
                      <span className="font-bold text-accent font-body">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => remove(item.id)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h3 className="font-semibold text-foreground font-body mb-5">Tóm tắt đơn hàng</h3>

                <div className="flex gap-2 mb-5">
                  <input value={voucher} onChange={e => setVoucher(e.target.value)} placeholder="Mã voucher" className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
                  <button onClick={() => setVoucherApplied(!!voucher)} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold font-body hover:bg-primary/80 transition-colors">
                    Áp dụng
                  </button>
                </div>
                {voucherApplied && <p className="text-sm text-primary font-body mb-4 flex items-center gap-1"><Check size={14} /> Giảm 10% áp dụng thành công!</p>}

                <div className="space-y-3 mb-5 text-sm font-body">
                  <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phí vận chuyển</span><span className={shipping === 0 ? "text-primary font-semibold" : "font-semibold"}>{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span></div>
                  {voucherApplied && <div className="flex justify-between text-primary"><span>Voucher giảm</span><span>-{formatPrice(discount)}</span></div>}
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                    <span>Tổng cộng</span><span className="text-accent">{formatPrice(total)}</span>
                  </div>
                </div>

                {shipping > 0 && <p className="text-xs text-muted-foreground font-body mb-4">🚚 Miễn phí ship cho đơn trên {formatPrice(500000)}</p>}

                <button onClick={() => navigate("/thanh-toan")} className="w-full py-3.5 bg-accent text-accent-foreground rounded-2xl font-semibold font-body hover:bg-accent/80 transition-colors">
                  Thanh toán ngay
                </button>
                <button onClick={() => navigate("/san-pham")} className="w-full mt-2 py-3 border border-border text-foreground rounded-2xl text-sm font-semibold font-body hover:bg-muted transition-colors">
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// ============================================================
// CHECKOUT PAGE
// ============================================================
function CheckoutPage({ cart }: { cart: any[] }) {
  const navigate = useNavigate()
  const [payment, setPayment] = useState("bank")
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", note: "" })
  const [submitted, setSubmitted] = useState(false)
  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) return (
    <main className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-primary" />
        </div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-3">Đặt hàng thành công!</h2>
        <p className="text-muted-foreground font-body mb-6 max-w-sm mx-auto">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 24 giờ.</p>
        <button onClick={() => navigate("/")} className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold font-body hover:bg-primary/80 transition-colors">
          Về trang chủ
        </button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Thanh toán</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-foreground font-body mb-5 flex items-center gap-2"><User size={16} /> Thông tin người nhận</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ key: "name", label: "Họ và tên", type: "text", required: true }, { key: "phone", label: "Số điện thoại", type: "tel", required: true }, { key: "email", label: "Email", type: "email", required: false }, { key: "city", label: "Tỉnh/Thành phố", type: "text", required: true }].map(f => (
                    <div key={f.key} className={f.key === "address" ? "sm:col-span-2" : ""}>
                      <label className="block text-sm font-medium text-foreground font-body mb-1.5">{f.label} {f.required && <span className="text-accent">*</span>}</label>
                      <input required={f.required} type={f.type} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary transition-colors" />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground font-body mb-1.5">Địa chỉ nhận hàng <span className="text-accent">*</span></label>
                    <input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground font-body mb-1.5">Ghi chú</label>
                    <textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary transition-colors resize-none" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-foreground font-body mb-5 flex items-center gap-2"><CreditCard size={16} /> Phương thức thanh toán</h3>
                <div className="space-y-3">
                  {[{ id: "bank", label: "Chuyển khoản ngân hàng", icon: "🏦" }, { id: "momo", label: "MoMo", icon: "💜" }, { id: "vnpay", label: "VNPay", icon: "🔵" }].map(m => (
                    <label key={m.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment === m.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`}>
                      <input type="radio" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="accent-primary" />
                      <span className="text-xl">{m.icon}</span>
                      <span className="font-body font-medium text-foreground">{m.label}</span>
                      {payment === m.id && <Check size={16} className="text-primary ml-auto" />}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h3 className="font-semibold text-foreground font-body mb-5">Đơn hàng của bạn</h3>
                <div className="space-y-3 mb-5">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img src={img(item.image, 80, 80)} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground font-body line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-body">x{item.qty}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground font-body">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm font-body">
                  <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatPrice(total)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phí ship</span><span className="text-primary">Miễn phí</span></div>
                  <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                    <span>Tổng cộng</span><span className="text-accent">{formatPrice(total)}</span>
                  </div>
                </div>
                <button type="submit" className="w-full mt-6 py-3.5 bg-accent text-accent-foreground rounded-2xl font-semibold font-body hover:bg-accent/80 transition-colors">
                  Đặt hàng ngay
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState<"login" | "register">("login")
  const [form, setForm] = useState({ email: "", password: "", name: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // simulate network
    const account = MOCK_ACCOUNTS.find(a => a.email === form.email && a.password === form.password)
    setLoading(false)
    if (!account) {
      setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.")
      return
    }
    const { password: _, ...user } = account
    onLogin(user)
    toast.success(`Chào mừng trở lại, ${user.name}!`)
    navigate("/")
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Register as a new customer (mock)
    if (!form.name || !form.email || !form.password) { setError("Vui lòng điền đầy đủ thông tin."); return }
    const newUser: AuthUser = { email: form.email, name: form.name, role: "customer", avatar: "photo-1507003211169-0a1dd7228f2d" }
    onLogin(newUser)
    toast.success(`Tạo tài khoản thành công! Chào mừng ${newUser.name}`)
    navigate("/")
  }

  return (
    <main className="min-h-screen bg-secondary flex items-center justify-center px-4 pt-16 pb-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Leaf size={24} className="text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Chợ Phiên Ngok Bay</h1>
          <p className="text-muted-foreground font-body mt-1">Đất lành chim đậu, hàng tốt người mua</p>
        </div>

        <div className="bg-card rounded-3xl border border-border p-8 shadow-xl">
          <div className="flex rounded-2xl bg-muted p-1 mb-6">
            {(["login", "register"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError("") }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold font-body transition-all ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {t === "login" ? "Đăng nhập" : "Đăng ký"}
              </button>
            ))}
          </div>

          {/* Demo hint */}
          {tab === "login" && (
            <div className="mb-4 p-3 bg-primary/8 border border-primary/20 rounded-xl text-xs font-body text-primary/80 space-y-0.5">
              <p className="font-semibold text-primary mb-1">Tài khoản demo:</p>
              <p>👑 Admin: <span className="font-mono">admin@gmail.com</span> / <span className="font-mono">12345</span></p>
              <p>👤 Khách: <span className="font-mono">user@gmail.com</span> / <span className="font-mono">12345</span></p>
            </div>
          )}

          <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="block text-sm font-medium text-foreground font-body mb-1.5">Họ và tên</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground font-body mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground font-body">Mật khẩu</label>
                {tab === "login" && <a href="#" className="text-sm text-primary hover:text-primary/70 font-body">Quên mật khẩu?</a>}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-2.5 rounded-xl font-body">
                <AlertCircle size={14} className="flex-shrink-0" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-semibold font-body hover:bg-primary/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
              {loading && <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />}
              {tab === "login" ? "Đăng nhập" : "Tạo tài khoản"}
            </button>

            <div className="relative flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground font-body">hoặc</span><div className="flex-1 h-px bg-border" />
            </div>

            <button type="button" className="w-full py-3 border border-border rounded-2xl font-semibold font-body text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-3">
              <Globe size={16} className="text-blue-500" /> Đăng nhập với Google
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

// ============================================================
// LIEN HE PAGE
// ============================================================
function LienHePage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader badge="Liên hệ" title="Chúng tôi luôn sẵn sàng lắng nghe" subtitle="Có câu hỏi về sản phẩm, nghệ nhân hay muốn tham gia chợ phiên? Hãy liên hệ với chúng tôi." />
            <div className="space-y-5 mb-8">
              {[{ icon: MapPin, label: "Địa chỉ", val: "12 Trần Phú, TP Kon Tum, Tỉnh Kon Tum" }, { icon: Phone, label: "Điện thoại", val: "0900 888 999" }, { icon: Mail, label: "Email", val: "hello@ngokbay.vn" }, { icon: Clock, label: "Giờ làm việc", val: "7:00 - 17:00, Thứ 2 - Thứ 7" }].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-body">{label}</div>
                    <div className="font-semibold text-foreground font-body">{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-3xl border border-border p-8 shadow-lg">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Gửi tin nhắn</h3>
            <div className="space-y-4">
              {[{ label: "Họ tên", placeholder: "Nguyễn Văn A" }, { label: "Email", placeholder: "email@example.com" }, { label: "Tiêu đề", placeholder: "Chủ đề tin nhắn" }].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-foreground font-body mb-1.5">{f.label}</label>
                  <input placeholder={f.placeholder} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-foreground font-body mb-1.5">Nội dung</label>
                <textarea rows={4} placeholder="Nhập nội dung tin nhắn..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary resize-none" />
              </div>
              <button className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-semibold font-body hover:bg-primary/80 transition-colors">
                Gửi tin nhắn
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// ============================================================
// ADMIN LAYOUT
// ============================================================
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [webMgmtOpen, setWebMgmtOpen] = useState(false)
  const [eventMgmtOpen, setEventMgmtOpen] = useState(false)
  const [topbarDropOpen, setTopbarDropOpen] = useState(false)
  const topbarDropRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close topbar dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (topbarDropRef.current && !topbarDropRef.current.contains(e.target as Node)) setTopbarDropOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const navItems = [
    { to: "/admin",            icon: BarChart2,  label: "Tổng quan",     end: true },
    { to: "/admin/san-pham",   icon: Package,    label: "Sản phẩm",      end: false },
    { to: "/admin/blog",       icon: FileText,   label: "Bài viết",      end: false },
    { to: "/admin/don-hang",   icon: ShoppingBag,label: "Đơn hàng",      end: false },
    { to: "/admin/nguoi-dung", icon: Users,      label: "Người dùng",    end: false },
  ]

  const eventSubItems = [
    { to: "/admin/cho-phien", icon: Calendar,       label: "Quản lý chợ phiên" },
    { to: "/admin/dang-ky",   icon: ClipboardList,  label: "Quản lý đăng ký" },
  ]

  const webSubItems = [
    { to: "/admin/hero", icon: ImageIcon, label: "Chỉnh sửa Hero" },
  ]

  return (
    <div className="min-h-screen bg-muted flex">
      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-sidebar flex-shrink-0 flex flex-col transition-all duration-300 min-h-screen`}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border h-16">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Leaf size={16} className="text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <div className="font-display font-bold text-sidebar-foreground text-sm truncate">Ngok Bay</div>
              <div className="text-xs text-sidebar-foreground/50 font-body">Admin Panel</div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {/* Regular nav items */}
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
              <item.icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium font-body">{item.label}</span>}
            </NavLink>
          ))}

          {/* Quản lý sự kiện — collapsible group */}
          <div>
            <button
              onClick={() => setEventMgmtOpen(v => !v)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground ${eventMgmtOpen ? "bg-sidebar-accent text-sidebar-foreground" : ""}`}
              title={!sidebarOpen ? "Quản lý sự kiện" : undefined}
            >
              <Store size={18} className="flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="text-sm font-medium font-body flex-1 text-left">Quản lý sự kiện</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${eventMgmtOpen ? "rotate-180" : ""}`} />
                </>
              )}
            </button>
            {eventMgmtOpen && sidebarOpen && (
              <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-sidebar-border pl-3">
                {eventSubItems.map(sub => (
                  <NavLink key={sub.to} to={sub.to}
                    className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"}`}>
                    <sub.icon size={14} className="flex-shrink-0" />
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}
            {eventMgmtOpen && !sidebarOpen && (
              <div className="mt-1 space-y-0.5">
                {eventSubItems.map(sub => (
                  <NavLink key={sub.to} to={sub.to} title={sub.label}
                    className={({ isActive }) => `flex items-center justify-center p-2.5 rounded-xl transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/60 hover:bg-sidebar-accent"}`}>
                    <sub.icon size={15} />
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-sidebar-border" />

          {/* Quản lý web — collapsible group */}
          <div>
            <button
              onClick={() => setWebMgmtOpen(v => !v)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground ${webMgmtOpen ? "bg-sidebar-accent text-sidebar-foreground" : ""}`}
              title={!sidebarOpen ? "Quản lý web" : undefined}
            >
              <Globe size={18} className="flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="text-sm font-medium font-body flex-1 text-left">Quản lý web</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${webMgmtOpen ? "rotate-180" : ""}`} />
                </>
              )}
            </button>

            {/* Sub-items (only visible when sidebar is open) */}
            {webMgmtOpen && sidebarOpen && (
              <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-sidebar-border pl-3">
                {webSubItems.map(sub => (
                  <NavLink key={sub.to} to={sub.to}
                    className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"}`}>
                    <sub.icon size={14} className="flex-shrink-0" />
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}

            {/* Collapsed icon-only sub-items */}
            {webMgmtOpen && !sidebarOpen && (
              <div className="mt-1 space-y-0.5">
                {webSubItems.map(sub => (
                  <NavLink key={sub.to} to={sub.to} title={sub.label}
                    className={({ isActive }) => `flex items-center justify-center p-2.5 rounded-xl transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/60 hover:bg-sidebar-accent"}`}>
                    <sub.icon size={15} />
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-sidebar-border">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-body">Thoát Admin</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(v => !v)} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Menu size={18} />
            </button>
            <h2 className="font-semibold text-foreground font-body text-sm hidden sm:block">Chào mừng, Admin!</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Quản lý web topbar dropdown */}
            <div className="relative" ref={topbarDropRef}>
              <button
                onClick={() => setTopbarDropOpen(v => !v)}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all border ${topbarDropOpen ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:bg-muted"}`}
              >
                <Globe size={15} />
                Quản lý web
                <ChevronDown size={13} className={`transition-transform ${topbarDropOpen ? "rotate-180" : ""}`} />
              </button>

              {topbarDropOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 py-1">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground font-body">Giao diện website</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { navigate("/admin/hero"); setTopbarDropOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-foreground hover:bg-muted transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ImageIcon size={14} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold leading-tight">Chỉnh sửa Hero</p>
                        <p className="text-xs text-muted-foreground">Slider, tiêu đề, nút CTA</p>
                      </div>
                    </button>
                    {/* Placeholder items for future expansion */}
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-muted-foreground hover:bg-muted/50 transition-colors text-left opacity-50 cursor-not-allowed">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Layers size={14} />
                      </div>
                      <div>
                        <p className="font-semibold leading-tight">Banner danh mục</p>
                        <p className="text-xs">Sắp ra mắt</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-muted-foreground hover:bg-muted/50 transition-colors text-left opacity-50 cursor-not-allowed">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Settings size={14} />
                      </div>
                      <div>
                        <p className="font-semibold leading-tight">Cài đặt chung</p>
                        <p className="text-xs">Sắp ra mắt</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell size={18} className="text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User size={14} className="text-primary-foreground" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function AdminDashboard() {
  const STATS = [
    { label: "Doanh thu tháng", value: "125.8M", growth: "+18.5%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
    { label: "Đơn hàng", value: "342", growth: "+12.3%", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Sản phẩm", value: "156", growth: "+8.1%", icon: Package, color: "text-accent", bg: "bg-orange-50 dark:bg-orange-950/30" },
    { label: "Lượt truy cập", value: "8,920", growth: "+24.7%", icon: Globe, color: "text-primary", bg: "bg-green-50 dark:bg-green-950/30" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Tổng quan</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">Chào mừng trở lại! Đây là tình hình hôm nay.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-5">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div className="font-display text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground font-body">{s.label}</div>
            <div className={`text-xs font-semibold font-body mt-1 ${s.growth.startsWith("+") ? "text-green-500" : "text-red-500"}`}>{s.growth} so với tháng trước</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold text-foreground font-body mb-5">Doanh thu 7 tháng</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1F6B45" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1F6B45" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: "Be Vietnam Pro" }} />
              <YAxis tick={{ fontSize: 12, fontFamily: "Be Vietnam Pro" }} tickFormatter={v => `${v}K`} />
              <Tooltip formatter={(v: any) => [`${v}K đ`, "Doanh thu"]} />
              <Area type="monotone" dataKey="revenue" stroke="#1F6B45" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold text-foreground font-body mb-5">Doanh thu theo danh mục</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={3}>
                {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {PIE_DATA.map(d => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: d.color }} /><span className="text-foreground font-body">{d.name}</span></div>
                <span className="font-semibold font-body">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-foreground font-body">Đơn hàng gần đây</h3>
          <Link to="/admin/don-hang" className="text-sm text-primary font-semibold font-body hover:text-primary/70">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                {["Mã đơn", "Khách hàng", "Sản phẩm", "Số tiền", "Trạng thái"].map(h => (
                  <th key={h} className="text-left py-2.5 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ADMIN_ORDERS_DATA.slice(0, 5).map(o => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-2 font-mono text-xs text-foreground font-bold">{o.id}</td>
                  <td className="py-3 px-2 text-foreground">{o.customer}</td>
                  <td className="py-3 px-2 text-muted-foreground line-clamp-1 max-w-[120px]">{o.product}</td>
                  <td className="py-3 px-2 font-semibold text-foreground">{formatPrice(o.amount)}</td>
                  <td className="py-3 px-2">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    completed: { label: "Hoàn thành", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    processing: { label: "Đang xử lý", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    shipping: { label: "Đang giao", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    pending: { label: "Chờ xác nhận", cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    cancelled: { label: "Đã hủy", cls: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
    published: { label: "Đã đăng", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    draft: { label: "Nháp", cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    active: { label: "Hoạt động", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    blocked: { label: "Đã khóa", cls: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  }
  const s = map[status] || { label: status, cls: "bg-muted text-muted-foreground" }
  return <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full font-body ${s.cls}`}>{s.label}</span>
}

// ============================================================
// ADMIN PRODUCT PAGE
// ============================================================
function AdminProductPage() {
  const [products, setProducts] = useState(PRODUCTS)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [page, setPage] = useState(1)
  const PER = 6

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  const paged = filtered.slice((page - 1) * PER, page * PER)
  const totalPages = Math.ceil(filtered.length / PER)

  const handleDelete = (id: number) => { if (confirm("Xóa sản phẩm này?")) setProducts(p => p.filter(x => x.id !== id)) }
  const openAdd = () => { setEditItem(null); setShowModal(true) }
  const openEdit = (item: any) => { setEditItem(item); setShowModal(true) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground font-body text-sm">{products.length} sản phẩm</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold font-body hover:bg-primary/80 transition-colors text-sm">
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Tìm sản phẩm..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                {["Sản phẩm", "Danh mục", "Giá", "OCOP", "Tồn kho", "Đánh giá", ""].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img src={img(p.image, 80, 80)} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground line-clamp-1">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.village}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{p.category}</td>
                  <td className="py-3 px-3 font-semibold text-accent whitespace-nowrap">{formatPrice(p.price)}</td>
                  <td className="py-3 px-3">{p.ocop ? <OcopBadge stars={p.ocop} /> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="py-3 px-3"><StatusBadge status={p.inStock ? "active" : "blocked"} /></td>
                  <td className="py-3 px-3"><StarRating rating={p.rating} /></td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-semibold font-body ${p === page ? "bg-primary text-primary-foreground" : "bg-muted border border-border text-foreground hover:bg-secondary"}`}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-3xl border border-border p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground">{editItem ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {["name", "category", "price", "material", "size"].map(f => (
                <div key={f}>
                  <label className="block text-sm font-medium text-foreground font-body mb-1 capitalize">{f}</label>
                  <input defaultValue={editItem?.[f]} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
                </div>
              ))}
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors">
                <ImageIcon size={24} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-body">Kéo thả ảnh hoặc click để chọn</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-border rounded-2xl text-sm font-semibold font-body hover:bg-muted transition-colors">Hủy</button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold font-body hover:bg-primary/80 transition-colors">Lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// ADMIN ORDER PAGE
// ============================================================
function AdminOrderPage() {
  const [orders, setOrders] = useState(ADMIN_ORDERS_DATA)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const filtered = orders.filter(o =>
    (statusFilter === "all" || o.status === statusFilter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search))
  )

  const updateStatus = (id: string, status: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Quản lý đơn hàng</h1>
          <p className="text-muted-foreground font-body text-sm">{orders.length} đơn hàng</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, mã đơn..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none">
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang giao</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                {["Mã đơn", "Khách hàng", "Sản phẩm", "Ngày", "Số tiền", "Trạng thái", ""].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-xs font-bold text-foreground">{o.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-foreground">{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.phone}</div>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground max-w-[120px] line-clamp-1">{o.product}</td>
                  <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">{o.date}</td>
                  <td className="py-3 px-3 font-semibold text-accent whitespace-nowrap">{formatPrice(o.amount)}</td>
                  <td className="py-3 px-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1">
                      <button onClick={() => setSelectedOrder(o)} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Printer size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-card rounded-3xl border border-border p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground">Chi tiết đơn hàng</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm font-body mb-6">
              <div className="flex justify-between"><span className="text-muted-foreground">Mã đơn</span><span className="font-mono font-bold">{selectedOrder.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Khách hàng</span><span>{selectedOrder.customer}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Điện thoại</span><span>{selectedOrder.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Địa chỉ</span><span className="text-right max-w-[60%]">{selectedOrder.address}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Sản phẩm</span><span>{selectedOrder.product}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Số tiền</span><span className="font-bold text-accent">{formatPrice(selectedOrder.amount)}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Trạng thái</span><StatusBadge status={selectedOrder.status} /></div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body mb-2 block">Cập nhật trạng thái</label>
              <select value={selectedOrder.status} onChange={e => { updateStatus(selectedOrder.id, e.target.value); setSelectedOrder({ ...selectedOrder, status: e.target.value }) }}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none">
                <option value="pending">Chờ xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipping">Đang giao</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// ADMIN BLOG PAGE
// ============================================================
function AdminBlogPage() {
  const [blogs, setBlogs] = useState(ADMIN_BLOGS_DATA)
  const [showEditor, setShowEditor] = useState(false)
  const [editBlog, setEditBlog] = useState<any>(null)
  const [content, setContent] = useState("")

  const handleDelete = (id: number) => { if (confirm("Xóa bài viết?")) setBlogs(b => b.filter(x => x.id !== id)) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Quản lý bài viết</h1>
          <p className="text-muted-foreground font-body text-sm">{blogs.length} bài viết</p>
        </div>
        <button onClick={() => { setEditBlog(null); setContent(""); setShowEditor(true) }} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold font-body hover:bg-primary/80 transition-colors text-sm">
          <Plus size={16} /> Viết bài mới
        </button>
      </div>

      {showEditor ? (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl font-bold text-foreground">{editBlog ? "Chỉnh sửa bài" : "Bài viết mới"}</h3>
            <button onClick={() => setShowEditor(false)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body">
              <ChevronLeft size={16} /> Quay lại
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground font-body mb-1.5">Tiêu đề bài viết</label>
              <input defaultValue={editBlog?.title} placeholder="Nhập tiêu đề..." className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary text-base font-semibold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground font-body mb-1.5">Danh mục</label>
                <select defaultValue={editBlog?.category} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none">
                  {["Di sản", "Lễ hội", "Nghề truyền thống", "Kiến trúc", "Hướng dẫn"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground font-body mb-1.5">Trạng thái</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none">
                  <option value="published">Đã đăng</option>
                  <option value="draft">Nháp</option>
                </select>
              </div>
            </div>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
              <ImageIcon size={28} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground font-body">Upload ảnh đại diện</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground font-body mb-1.5">Nội dung</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={12} placeholder="Nhập nội dung bài viết..." className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEditor(false)} className="flex-1 py-3 border border-border rounded-2xl text-sm font-semibold font-body hover:bg-muted">Lưu nháp</button>
              <button onClick={() => setShowEditor(false)} className="flex-1 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold font-body hover:bg-primary/80">Đăng bài</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {blogs.map((b, i) => (
            <div key={b.id} className={`flex gap-4 items-center p-5 hover:bg-muted/50 transition-colors ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={b.status} />
                  <span className="text-xs text-muted-foreground font-body">{b.category}</span>
                </div>
                <h4 className="font-semibold text-foreground font-body line-clamp-1">{b.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-body">
                  <span>{b.date}</span>
                  <span>By {b.author}</span>
                  {b.views > 0 && <span className="flex items-center gap-1"><Eye size={10} /> {b.views.toLocaleString()}</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setEditBlog(b); setShowEditor(true) }} className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(b.id)} className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// ADMIN MARKET PAGE (full-featured manager)
// ============================================================
function AdminMarketPage() {
  const { markets, setMarkets } = useMarket()
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Market | null>(null)
  const [form, setForm] = useState<Partial<Market & { province: string; district: string; commune: string; village: string }>>({})
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const openNew = () => {
    setEditItem(null)
    setForm({})
    setSelectedCategories([])
    setShowModal(true)
  }

  const openEdit = (m: Market) => {
    setEditItem(m)
    setForm({ ...m, province: m.location.province, district: m.location.district, commune: m.location.commune, village: m.location.village })
    setSelectedCategories(m.categories)
    setShowModal(true)
  }

  const handleSave = () => {
    const locationFull = [form.village, form.commune, form.district, form.province].filter(Boolean).join(", ")
    if (editItem) {
      setMarkets(ms => ms.map(m => m.id === editItem.id ? {
        ...m, name: form.name || m.name,
        location: { province: form.province || "", district: form.district || "", commune: form.commune || "", village: form.village || "", full: locationFull },
        mapUrl: form.mapUrl || m.mapUrl,
        startDate: form.startDate || m.startDate,
        endDate: form.endDate || m.endDate,
        time: form.time || m.time,
        description: form.description || m.description,
        categories: selectedCategories,
        contact: { phone: (form as any).contactPhone || m.contact.phone, email: (form as any).contactEmail || m.contact.email, fanpage: (form as any).contactFanpage || m.contact.fanpage },
        registrationOpen: form.registrationOpen !== undefined ? form.registrationOpen : m.registrationOpen,
        visible: form.visible !== undefined ? form.visible : m.visible,
      } : m))
      toast.success("Đã cập nhật phiên chợ")
    } else {
      const newMarket: Market = {
        id: Date.now(), name: form.name || "Chợ phiên mới",
        location: { province: form.province || "", district: form.district || "", commune: form.commune || "", village: form.village || "", full: locationFull },
        mapUrl: form.mapUrl || "", startDate: form.startDate || "", endDate: form.endDate || "",
        time: form.time || "06:00 - 12:00", description: form.description || "",
        categories: selectedCategories, images: ["photo-1506905925346-21bda4d32df4"],
        contact: { phone: (form as any).contactPhone || "", email: (form as any).contactEmail || "", fanpage: (form as any).contactFanpage || "" },
        registrationOpen: form.registrationOpen ?? true, visible: form.visible ?? true,
        vendors: 0, expectedVisitors: 0, highlights: []
      }
      setMarkets(ms => [...ms, newMarket])
      toast.success("Đã thêm phiên chợ mới")
    }
    setShowModal(false)
  }

  const toggleRegistration = (id: number) => {
    setMarkets(ms => ms.map(m => m.id === id ? { ...m, registrationOpen: !m.registrationOpen } : m))
  }
  const toggleVisible = (id: number) => {
    setMarkets(ms => ms.map(m => m.id === id ? { ...m, visible: !m.visible } : m))
  }
  const handleDelete = (id: number) => {
    if (!window.confirm("Xóa phiên chợ này?")) return
    setMarkets(ms => ms.filter(m => m.id !== id))
    toast.success("Đã xóa phiên chợ")
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  const fi = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Quản lý chợ phiên</h1>
          <p className="text-muted-foreground font-body text-sm">{markets.length} phiên chợ</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold font-body hover:bg-primary/80 transition-colors text-sm">
          <Plus size={16} /> Thêm phiên chợ
        </button>
      </div>

      <div className="space-y-4">
        {markets.map(m => (
          <div key={m.id} className={`bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow ${!m.visible ? "opacity-60" : ""}`}>
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                <img src={img(m.images[0], 200, 160)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-display font-bold text-xl text-foreground">{m.name}</h3>
                  {!m.visible && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-body">Ẩn</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-body font-semibold ${m.registrationOpen ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {m.registrationOpen ? "Đang nhận đăng ký" : "Đóng đăng ký"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground font-body mb-3">
                  <div className="flex items-center gap-1.5"><Calendar size={12} className="text-accent" /> {m.startDate}</div>
                  <div className="flex items-center gap-1.5"><Clock size={12} className="text-accent" /> {m.time}</div>
                  <div className="flex items-center gap-1.5 col-span-2"><MapPin size={12} className="text-accent" /> <span className="truncate">{m.location.full}</span></div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {m.categories.map(c => <span key={c} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body">{c}</span>)}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:w-auto">
                <button onClick={() => toggleRegistration(m.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body border transition-colors ${m.registrationOpen ? "border-green-400 text-green-600 hover:bg-green-50" : "border-border text-muted-foreground hover:bg-muted"}`}>
                  {m.registrationOpen ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                  {m.registrationOpen ? "Đóng ĐK" : "Mở ĐK"}
                </button>
                <button onClick={() => toggleVisible(m.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body border transition-colors ${m.visible ? "border-border text-muted-foreground hover:bg-muted" : "border-primary text-primary hover:bg-primary/10"}`}>
                  <Eye size={13} /> {m.visible ? "Ẩn" : "Hiện"}
                </button>
                <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-border"><Edit size={14} /></button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors border border-border"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-3xl border border-border w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border px-8 py-5 flex items-center justify-between rounded-t-3xl z-10">
              <h3 className="font-display text-2xl font-bold text-foreground">{editItem ? "Chỉnh sửa phiên chợ" : "Thêm phiên chợ mới"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground font-body mb-1.5">Tên phiên chợ *</label>
                <input value={form.name || ""} onChange={e => fi("name", e.target.value)} placeholder="VD: Chợ Phiên Ngok Bay #50" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground font-body mb-1.5">Ngày bắt đầu</label>
                  <input type="date" value={form.startDate || ""} onChange={e => fi("startDate", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground font-body mb-1.5">Ngày kết thúc</label>
                  <input type="date" value={form.endDate || ""} onChange={e => fi("endDate", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground font-body mb-1.5">Giờ họp chợ</label>
                <input value={form.time || ""} onChange={e => fi("time", e.target.value)} placeholder="VD: 06:00 - 12:00" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground font-body mb-2">Địa điểm</label>
                <div className="grid grid-cols-2 gap-3">
                  {[["province", "Tỉnh/Thành phố", "Kon Tum"], ["district", "Quận/Huyện", "TP Kon Tum"], ["commune", "Xã/Phường", "Đắk Blà"], ["village", "Thôn/Làng", "Làng Kon Klor"]].map(([key, label, ph]) => (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground font-body mb-1 block">{label}</label>
                      <input value={(form as any)[key] || ""} onChange={e => fi(key, e.target.value)} placeholder={ph} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground font-body mb-1.5">Link bản đồ Google Maps (embed)</label>
                <input value={form.mapUrl || ""} onChange={e => fi("mapUrl", e.target.value)} placeholder="https://maps.google.com/maps?q=..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground font-body mb-1.5">Mô tả chi tiết</label>
                <textarea rows={3} value={form.description || ""} onChange={e => fi("description", e.target.value)} placeholder="Mô tả về phiên chợ..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground font-body mb-2">Danh mục sản phẩm</label>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_CATEGORIES_LIST.map(cat => (
                    <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-body border transition-colors ${selectedCategories.includes(cat) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                      {selectedCategories.includes(cat) && <Check size={10} className="inline mr-1" />}{cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground font-body mb-2">Thông tin liên hệ</label>
                <div className="grid grid-cols-1 gap-3">
                  {[["contactPhone", "Điện thoại", "0260 3862 222"], ["contactEmail", "Email", "chophien@ngokbay.vn"], ["contactFanpage", "Fanpage Facebook", "facebook.com/ngokbaymarket"]].map(([key, label, ph]) => (
                    <div key={key} className="flex items-center gap-3">
                      <label className="text-xs text-muted-foreground font-body w-20 flex-shrink-0">{label}</label>
                      <input value={(form as any)[key] || ""} onChange={e => fi(key, e.target.value)} placeholder={ph} className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => fi("registrationOpen", !(form.registrationOpen ?? true))} className={`w-11 h-6 rounded-full transition-colors relative ${(form.registrationOpen ?? true) ? "bg-primary" : "bg-muted"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${(form.registrationOpen ?? true) ? "translate-x-6" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm font-body text-foreground">Mở nhận đăng ký</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => fi("visible", !(form.visible ?? true))} className={`w-11 h-6 rounded-full transition-colors relative ${(form.visible ?? true) ? "bg-primary" : "bg-muted"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${(form.visible ?? true) ? "translate-x-6" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm font-body text-foreground">Hiển thị công khai</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-border rounded-2xl text-sm font-semibold font-body hover:bg-muted transition-colors">Hủy</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold font-body hover:bg-primary/80 transition-colors">
                  {editItem ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// ADMIN REGISTRATION PAGE
// ============================================================
function AdminRegistrationPage() {
  const { markets, registrations, setRegistrations } = useMarket()
  const [filterMarket, setFilterMarket] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [search, setSearch] = useState("")
  const [detailReg, setDetailReg] = useState<BoothRegistration | null>(null)
  const [editReg, setEditReg] = useState<BoothRegistration | null>(null)
  const [editForm, setEditForm] = useState<Partial<BoothRegistration>>({})

  const filtered = registrations.filter(r =>
    (filterMarket === "all" || r.marketId === Number(filterMarket)) &&
    (filterStatus === "all" || r.status === filterStatus) &&
    (r.ownerName.toLowerCase().includes(search.toLowerCase()) || r.boothName.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search))
  )

  const approve = (id: string) => {
    setRegistrations(rs => rs.map(r => r.id === id ? { ...r, status: "approved" } : r))
    toast.success("Đã duyệt gian hàng! Gian hàng sẽ xuất hiện trên website.")
    setDetailReg(prev => prev && prev.id === id ? { ...prev, status: "approved" } : prev)
  }

  const reject = (id: string) => {
    setRegistrations(rs => rs.map(r => r.id === id ? { ...r, status: "rejected" } : r))
    toast.error("Đã từ chối đăng ký. Thông báo đã được gửi tới người đăng ký.")
    setDetailReg(prev => prev && prev.id === id ? { ...prev, status: "rejected" } : prev)
  }

  const openEdit = (r: BoothRegistration) => {
    setEditReg(r)
    setEditForm({ ...r })
    setDetailReg(null)
  }

  const saveEdit = () => {
    setRegistrations(rs => rs.map(r => r.id === editReg!.id ? { ...r, ...editForm } as BoothRegistration : r))
    toast.success("Đã cập nhật thông tin đăng ký")
    setEditReg(null)
  }

  const exportCSV = () => {
    const header = ["Mã ĐK", "Chợ phiên", "Tên gian hàng", "Chủ gian hàng", "SĐT", "Email", "Địa chỉ", "Sản phẩm", "Danh mục", "Trạng thái", "Ngày đăng ký"]
    const rows = filtered.map(r => [r.id, r.marketName, r.boothName, r.ownerName, r.phone, r.email, r.address, r.products, r.category, r.status === "approved" ? "Đã duyệt" : r.status === "rejected" ? "Từ chối" : "Chờ duyệt", r.submittedAt])
    const csv = "﻿" + [header, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "dang-ky-gian-hang.csv"; a.click()
    URL.revokeObjectURL(url)
    toast.success("Đã xuất file Excel thành công!")
  }

  const statusColor: Record<string, string> = {
    pending:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  }
  const statusLabel: Record<string, string> = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối" }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Quản lý đăng ký</h1>
          <p className="text-muted-foreground font-body text-sm">{registrations.length} đăng ký gian hàng</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold font-body hover:bg-primary/80 transition-colors text-sm">
          <FileDown size={15} /> Xuất Excel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Chờ duyệt", count: registrations.filter(r => r.status === "pending").length, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
          { label: "Đã duyệt", count: registrations.filter(r => r.status === "approved").length, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Từ chối", count: registrations.filter(r => r.status === "rejected").length, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <div className={`font-display text-3xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-sm text-muted-foreground font-body">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, mã đăng ký..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
          </div>
          <select value={filterMarket} onChange={e => setFilterMarket(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none">
            <option value="all">Tất cả chợ phiên</option>
            {markets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none">
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                {["Mã ĐK", "Tên gian hàng", "Chủ gian hàng", "Chợ phiên", "Danh mục", "Trạng thái", "Ngày ĐK", ""].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-xs font-bold text-foreground">{r.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-foreground">{r.boothName}</div>
                    <div className="text-xs text-muted-foreground">{r.products.slice(0, 30)}...</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-foreground">{r.ownerName}</div>
                    <div className="text-xs text-muted-foreground">{r.phone}</div>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground text-xs max-w-[120px] truncate">{r.marketName}</td>
                  <td className="py-3 px-3"><span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{r.category}</span></td>
                  <td className="py-3 px-3"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColor[r.status]}`}>{statusLabel[r.status]}</span></td>
                  <td className="py-3 px-3 text-muted-foreground text-xs whitespace-nowrap">{r.submittedAt}</td>
                  <td className="py-3 px-3">
                    <button onClick={() => setDetailReg(r)} className="px-3 py-1.5 text-xs font-semibold font-body bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState title="Không tìm thấy đăng ký" subtitle="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm" />}
        </div>
      </div>

      {/* Detail Modal */}
      {detailReg && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDetailReg(null)}>
          <div className="bg-card rounded-3xl border border-border w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 py-5 border-b border-border">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Chi tiết đăng ký</h3>
                <p className="text-xs text-muted-foreground font-body">{detailReg.id}</p>
              </div>
              <button onClick={() => setDetailReg(null)} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold font-body ${statusColor[detailReg.status]}`}>{statusLabel[detailReg.status]}</span>
                <span className="text-xs text-muted-foreground font-body">{detailReg.marketName}</span>
              </div>
              {[
                { label: "Tên gian hàng", value: detailReg.boothName },
                { label: "Họ và tên chủ", value: detailReg.ownerName },
                { label: "Số điện thoại", value: detailReg.phone },
                { label: "Email", value: detailReg.email },
                { label: "Địa chỉ", value: detailReg.address },
                { label: "Sản phẩm", value: detailReg.products },
                { label: "Danh mục", value: detailReg.category },
              ].map(row => (
                <div key={row.label} className="flex gap-4">
                  <span className="text-sm font-semibold text-muted-foreground font-body w-32 flex-shrink-0">{row.label}:</span>
                  <span className="text-sm text-foreground font-body flex-1">{row.value}</span>
                </div>
              ))}
              {detailReg.note && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                  <p className="text-xs font-semibold text-red-600 font-body">Ghi chú: {detailReg.note}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                {detailReg.status === "pending" && (
                  <>
                    <button onClick={() => approve(detailReg.id)} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold font-body hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <UserCheck size={14} /> Duyệt
                    </button>
                    <button onClick={() => reject(detailReg.id)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold font-body hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                      <UserX size={14} /> Từ chối
                    </button>
                  </>
                )}
                <button onClick={() => openEdit(detailReg)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold font-body hover:bg-muted transition-colors flex items-center justify-center gap-2">
                  <Edit size={14} /> Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Registration Modal */}
      {editReg && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditReg(null)}>
          <div className="bg-card rounded-3xl border border-border w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card flex items-center justify-between px-8 py-5 border-b border-border rounded-t-3xl">
              <h3 className="font-display text-xl font-bold text-foreground">Chỉnh sửa đăng ký</h3>
              <button onClick={() => setEditReg(null)} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
            </div>
            <div className="p-8 space-y-4">
              {[
                { key: "boothName", label: "Tên gian hàng" },
                { key: "ownerName", label: "Họ và tên" },
                { key: "phone", label: "Số điện thoại" },
                { key: "email", label: "Email" },
                { key: "address", label: "Địa chỉ" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-foreground font-body mb-1.5">{f.label}</label>
                  <input value={(editForm as any)[f.key] || ""} onChange={e => setEditForm(ef => ({ ...ef, [f.key]: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-foreground font-body mb-1.5">Sản phẩm</label>
                <textarea rows={2} value={editForm.products || ""} onChange={e => setEditForm(ef => ({ ...ef, products: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground font-body mb-1.5">Danh mục</label>
                <select value={editForm.category || ""} onChange={e => setEditForm(ef => ({ ...ef, category: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none">
                  {PRODUCT_CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditReg(null)} className="flex-1 py-3 border border-border rounded-2xl text-sm font-semibold font-body hover:bg-muted transition-colors">Hủy</button>
                <button onClick={saveEdit} className="flex-1 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold font-body hover:bg-primary/80 transition-colors">Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// ADMIN USER PAGE
// ============================================================
function AdminUserPage() {
  const [users, setUsers] = useState(ADMIN_USERS_DATA)
  const [search, setSearch] = useState("")

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search))
  const toggleBlock = (id: number) => setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u))

  const ROLE_LABELS: Record<string, { label: string; cls: string }> = {
    admin: { label: "Admin", cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    artisan: { label: "Nghệ nhân", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    customer: { label: "Khách hàng", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Quản lý người dùng</h1>
          <p className="text-muted-foreground font-body text-sm">{users.length} tài khoản</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold font-body hover:bg-primary/80 transition-colors text-sm">
          <Plus size={16} /> Thêm người dùng
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="relative mb-5 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm người dùng..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                {["Người dùng", "Role", "Ngày tham gia", "Đơn hàng", "Trạng thái", ""].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const role = ROLE_LABELS[u.role] || { label: u.role, cls: "bg-muted text-muted-foreground" }
                return (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          <img src={img(u.avatar, 100, 100)} alt={u.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${role.cls}`}>{role.label}</span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{u.joined}</td>
                    <td className="py-3 px-3 text-foreground">{u.orders}</td>
                    <td className="py-3 px-3"><StatusBadge status={u.status} /></td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"><Edit size={14} /></button>
                        <button onClick={() => toggleBlock(u.id)} className={`p-1.5 rounded-lg transition-colors ${u.status === "active" ? "hover:bg-red-50 hover:text-red-500" : "hover:bg-green-50 hover:text-green-600"}`}>
                          {u.status === "active" ? <Lock size={14} /> : <CheckCircle size={14} />}
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// SHIELD ICON (missing from import)
// ============================================================
function Shield({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

// ============================================================
// MAIN APP
// ============================================================
// ============================================================
// ADMIN HERO FORM
// ============================================================
const UNSPLASH_PRESETS = [
  { label: "Rừng núi", id: "photo-1506905925346-21bda4d32df4" },
  { label: "Thổ cẩm", id: "photo-1558618666-fcd25c85cd64" },
  { label: "Nông sản", id: "photo-1447933601403-0c6688de566e" },
  { label: "Tre đan", id: "photo-1503676260728-1c00da094a0b" },
  { label: "Cà phê", id: "photo-1512621776951-a57141f2eefd" },
  { label: "Văn hóa", id: "photo-1511379938547-c1f69419868d" },
]

function AdminHeroForm() {
  const { slides, setSlides } = useHero()

  // Working copy — only commit to context on Save
  const [draft, setDraft] = useState<HeroSlide[]>(() => JSON.parse(JSON.stringify(slides)))
  const [activeId, setActiveId] = useState(draft[0]?.id ?? 1)
  const [saved, setSaved] = useState(false)
  const [imageMode, setImageMode] = useState<"preset" | "url">("preset")

  const active = draft.find(s => s.id === activeId) ?? draft[0]

  const updateField = (field: keyof HeroSlide, value: string) => {
    setDraft(d => d.map(s => s.id === activeId ? { ...s, [field]: value } : s))
    setSaved(false)
  }

  const addSlide = () => {
    const newId = Math.max(0, ...draft.map(s => s.id)) + 1
    const newSlide: HeroSlide = {
      id: newId,
      title: "Tiêu đề mới",
      subtitle: "Mô tả phụ",
      desc: "Nội dung mô tả cho slide mới",
      image: "photo-1506905925346-21bda4d32df4",
      btn1: "Khám phá",
      btn1Link: "/san-pham",
      btn2: "Tìm hiểu",
      btn2Link: "/van-hoa",
    }
    setDraft(d => [...d, newSlide])
    setActiveId(newId)
    setSaved(false)
  }

  const deleteSlide = (id: number) => {
    if (draft.length <= 1) { toast.error("Phải có ít nhất 1 slide"); return }
    const next = draft.find(s => s.id !== id)
    setDraft(d => d.filter(s => s.id !== id))
    if (activeId === id && next) setActiveId(next.id)
    setSaved(false)
  }

  const handleSave = () => {
    setSlides(JSON.parse(JSON.stringify(draft)))
    setSaved(true)
    toast.success("Đã lưu Hero section!", { description: "Thay đổi đã được áp dụng lên trang chủ ngay lập tức." })
  }

  const handleReset = () => {
    setDraft(JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES)))
    setActiveId(DEFAULT_HERO_SLIDES[0].id)
    setSlides(JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES)))
    setSaved(true)
    toast.success("Đã khôi phục dữ liệu mặc định")
  }

  const previewImgSrc = active
    ? (active.image.startsWith("http") ? active.image : img(active.image, 1200, 500))
    : ""

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Chỉnh sửa Hero Section</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">Thay đổi sẽ áp dụng ngay lên trang chủ khi bấm Lưu</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold font-body text-foreground hover:bg-muted transition-colors">
            <ChevronLeft size={14} /> Khôi phục mặc định
          </button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-body transition-all ${saved ? "bg-primary/20 text-primary" : "bg-primary text-primary-foreground hover:bg-primary/80"}`}>
            {saved ? <><Check size={14} /> Đã lưu</> : <><CheckCircle size={14} /> Lưu thay đổi</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT: slide list + form */}
        <div className="xl:col-span-2 space-y-5">

          {/* Slide tabs */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground font-body flex items-center gap-2">
                <Layers size={16} className="text-accent" /> Danh sách slides ({draft.length})
              </h3>
              <button onClick={addSlide} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold font-body hover:bg-primary/20 transition-colors">
                <Plus size={13} /> Thêm slide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {draft.map((s, i) => (
                <div key={s.id} className="relative group">
                  <button onClick={() => setActiveId(s.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all border ${activeId === s.id ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-border hover:border-primary/50"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${activeId === s.id ? "bg-primary-foreground/20" : "bg-border"}`}>{i + 1}</span>
                    <span className="max-w-[100px] truncate">{s.title}</span>
                  </button>
                  {draft.length > 1 && (
                    <button onClick={() => deleteSlide(s.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10">
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {active && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
              <h3 className="font-semibold text-foreground font-body flex items-center gap-2 pb-1 border-b border-border">
                <Edit size={15} className="text-accent" /> Slide {draft.findIndex(s => s.id === activeId) + 1}: Nội dung
              </h3>

              {/* Title */}
              <FormField label="Tiêu đề chính (Hero title)" required>
                <input value={active.title} onChange={e => updateField("title", e.target.value)}
                  placeholder="Chợ Phiên Ngok Bay"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
              </FormField>

              {/* Subtitle */}
              <FormField label="Mô tả phụ (subtitle)">
                <input value={active.subtitle} onChange={e => updateField("subtitle", e.target.value)}
                  placeholder="Nơi hội tụ tinh hoa văn hóa Bana"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
              </FormField>

              {/* Description */}
              <FormField label="Mô tả nội dung">
                <textarea value={active.desc} onChange={e => updateField("desc", e.target.value)} rows={3}
                  placeholder="Khám phá thổ cẩm dệt tay, nông sản sạch..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
              </FormField>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-accent font-body">Nút chính</h4>
                  <FormField label="Nội dung nút" required>
                    <input value={active.btn1} onChange={e => updateField("btn1", e.target.value)}
                      placeholder="Khám phá ngay"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  </FormField>
                  <FormField label="Đường dẫn (link)" required>
                    <input value={active.btn1Link} onChange={e => updateField("btn1Link", e.target.value)}
                      placeholder="/san-pham"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  </FormField>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground font-body">Nút phụ</h4>
                  <FormField label="Nội dung nút">
                    <input value={active.btn2} onChange={e => updateField("btn2", e.target.value)}
                      placeholder="Xem chợ phiên"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  </FormField>
                  <FormField label="Đường dẫn (link)">
                    <input value={active.btn2Link} onChange={e => updateField("btn2Link", e.target.value)}
                      placeholder="/lich-cho-phien"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  </FormField>
                </div>
              </div>

              {/* Image */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground font-body">Ảnh nền Hero <span className="text-accent">*</span></label>
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    {(["preset", "url"] as const).map(m => (
                      <button key={m} onClick={() => setImageMode(m)}
                        className={`px-3 py-1.5 text-xs font-semibold font-body transition-colors ${imageMode === m ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}>
                        {m === "preset" ? "Chọn mẫu" : "Nhập URL"}
                      </button>
                    ))}
                  </div>
                </div>

                {imageMode === "preset" ? (
                  <div className="grid grid-cols-3 gap-2">
                    {UNSPLASH_PRESETS.map(p => (
                      <button key={p.id} onClick={() => updateField("image", p.id)}
                        className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${active.image === p.id ? "border-primary shadow-lg scale-95" : "border-border hover:border-primary/50"}`}>
                        <img src={img(p.id, 300, 170)} alt={p.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-end p-1.5">
                          <span className="text-white text-xs font-bold font-body">{p.label}</span>
                        </div>
                        {active.image === p.id && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check size={10} className="text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input value={active.image} onChange={e => updateField("image", e.target.value)}
                      placeholder="https://images.unsplash.com/photo-... hoặc Unsplash ID"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                    <p className="text-xs text-muted-foreground font-body">Nhập URL đầy đủ hoặc Unsplash photo ID (vd: photo-1506905925346-21bda4d32df4)</p>

                    {/* Mock upload */}
                    <div className="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary transition-colors group"
                      onClick={() => updateField("image", UNSPLASH_PRESETS[Math.floor(Math.random() * UNSPLASH_PRESETS.length)].id)}>
                      <ImageIcon size={22} className="text-muted-foreground mx-auto mb-1.5 group-hover:text-primary transition-colors" />
                      <p className="text-sm text-muted-foreground font-body group-hover:text-primary transition-colors">Upload ảnh (mock — click để chọn ngẫu nhiên)</p>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">JPG, PNG, WebP · Tối đa 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: live preview */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-border p-5 sticky top-24">
            <h3 className="font-semibold text-foreground font-body mb-4 flex items-center gap-2">
              <Eye size={15} className="text-accent" /> Xem trước
            </h3>

            {active && (
              <div className="rounded-xl overflow-hidden relative aspect-video bg-muted">
                <img src={previewImgSrc} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-foreground/50" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <span className="inline-block text-[9px] uppercase tracking-widest text-accent font-semibold font-body mb-1.5 bg-accent/20 px-2 py-0.5 rounded-full w-fit border border-accent/30">
                    {active.subtitle || "Mô tả phụ"}
                  </span>
                  <h2 className="font-display font-bold text-white text-sm leading-tight mb-1.5 line-clamp-2">
                    {active.title || "Tiêu đề"}
                  </h2>
                  <p className="text-white/70 text-[10px] font-body line-clamp-2 mb-2">{active.desc}</p>
                  <div className="flex gap-2">
                    <span className="bg-accent text-white text-[9px] font-bold px-2.5 py-1 rounded-lg font-body">{active.btn1 || "Nút 1"}</span>
                    <span className="bg-white/20 text-white text-[9px] font-semibold px-2.5 py-1 rounded-lg border border-white/30 font-body">{active.btn2 || "Nút 2"}</span>
                  </div>
                </div>

                {/* Slide indicator dots preview */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {draft.map((s, i) => (
                    <div key={s.id} className={`transition-all rounded-full ${s.id === activeId ? "w-4 h-1.5 bg-accent" : "w-1.5 h-1.5 bg-white/50"}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Slide nav summary */}
            <div className="mt-4 space-y-2">
              {draft.map((s, i) => (
                <button key={s.id} onClick={() => setActiveId(s.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${s.id === activeId ? "bg-primary/10 border border-primary/30" : "hover:bg-muted border border-transparent"}`}>
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img src={s.image.startsWith("http") ? s.image : img(s.image, 80, 80)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground font-body truncate">{s.title}</p>
                    <p className="text-[10px] text-muted-foreground font-body">Slide {i + 1}</p>
                  </div>
                  {s.id === activeId && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                </button>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border text-xs text-muted-foreground font-body space-y-1">
              <p className="flex items-center gap-1.5"><CheckCircle size={11} className="text-primary" /> Dữ liệu lưu trong bộ nhớ (mock)</p>
              <p className="flex items-center gap-1.5"><CheckCircle size={11} className="text-primary" /> Cập nhật trang chủ ngay lập tức</p>
              <p className="flex items-center gap-1.5"><AlertCircle size={11} className="text-muted-foreground" /> Reload trang sẽ khôi phục mặc định</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper form field wrapper
function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground font-body mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
    </div>
  )
}

// ============================================================
// PROTECTED ADMIN ROUTE
// ============================================================
function ProtectedAdminRoute({ user }: { user: AuthUser | null }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Bạn không có quyền truy cập khu vực quản trị", {
        description: "Chỉ tài khoản Admin mới có thể truy cập trang này.",
        icon: <ShieldAlert size={16} />,
        duration: 4000,
      })
      navigate("/", { replace: true })
    }
  }, [user, navigate])

  if (!user || user.role !== "admin") return null
  return <Outlet />
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [cart, setCart]         = useState<any[]>([])
  const [user, setUser]         = useState<AuthUser | null>(null)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES)
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS)
  const [registrations, setRegistrations] = useState<BoothRegistration[]>(INITIAL_REGISTRATIONS)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const addToCart = useCallback((product: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + (product.qty || 1) } : i)
      return [...prev, { ...product, qty: product.qty || 1 }]
    })
  }, [])

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0)

  return (
    <MarketContext.Provider value={{ markets, setMarkets, registrations, setRegistrations }}>
    <HeroContext.Provider value={{ slides: heroSlides, setSlides: setHeroSlides }}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{ style: { fontFamily: "var(--font-body, 'Be Vietnam Pro', system-ui, sans-serif)", borderRadius: "1rem" } }}
          richColors
        />
        <div className="min-h-screen bg-background" style={{ fontFamily: "var(--font-body, 'Be Vietnam Pro', system-ui, sans-serif)" }}>
          <Routes>
            {/* ── Protected Admin routes ── */}
            <Route path="/admin" element={<ProtectedAdminRoute user={user} />}>
              <Route element={<AdminLayout />}>
                <Route index          element={<AdminDashboard />} />
                <Route path="san-pham"   element={<AdminProductPage />} />
                <Route path="cho-phien"  element={<AdminMarketPage />} />
                <Route path="dang-ky"    element={<AdminRegistrationPage />} />
                <Route path="blog"       element={<AdminBlogPage />} />
                <Route path="don-hang"   element={<AdminOrderPage />} />
                <Route path="nguoi-dung" element={<AdminUserPage />} />
                {/* Quản lý web */}
                <Route path="hero"       element={<AdminHeroForm />} />
              </Route>
            </Route>

            {/* ── Public routes ── */}
            <Route path="*" element={
              <>
                <Navbar cartCount={cartCount} darkMode={darkMode} onToggleDark={() => setDarkMode(v => !v)} user={user} onLogout={() => setUser(null)} />
                <Routes>
                  <Route path="/"               element={<HomePage onAddCart={addToCart} />} />
                  <Route path="/san-pham"        element={<ProductListPage onAddCart={addToCart} />} />
                  <Route path="/san-pham/:id"    element={<ProductDetailPage onAddCart={addToCart} />} />
                  <Route path="/tho-cam"         element={<ThoCamPage />} />
                  <Route path="/ocop"            element={<OCOPPage onAddCart={addToCart} />} />
                  <Route path="/van-hoa"         element={<VanHoaPage />} />
                  <Route path="/lich-cho-phien"      element={<LichChoPhienPage />} />
                  <Route path="/lich-cho-phien/:id"  element={<MarketDetailPage />} />
                  <Route path="/gio-hang"        element={<CartPage cart={cart} setCart={setCart} />} />
                  <Route path="/thanh-toan"      element={<CheckoutPage cart={cart} />} />
                  <Route path="/dang-nhap"       element={<LoginPage onLogin={setUser} />} />
                  <Route path="/lien-he"         element={<LienHePage />} />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </HeroContext.Provider>
    </MarketContext.Provider>
  )
}
