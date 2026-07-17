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
  ShieldAlert, LayoutDashboard, ListOrdered
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

const MARKET_SCHEDULE = [
  { id: 1, name: "Chợ Phiên Ngok Bay #47", date: "15/08/2025", time: "06:00 - 12:00", location: "Làng văn hóa Kon Klor, Kon Tum", vendors: 45, expectedVisitors: 500, highlights: ["Thổ cẩm mới", "Sâm Ngọc Linh", "Cồng chiêng biểu diễn"] },
  { id: 2, name: "Chợ Phiên Ngok Bay #48", date: "20/09/2025", time: "06:00 - 12:00", location: "Quảng trường 16/3, TP Kon Tum", vendors: 60, expectedVisitors: 800, highlights: ["Lễ hội mùa màng", "Ẩm thực đặc sản", "Giao lưu văn hóa"] },
  { id: 3, name: "Chợ Phiên Ngok Bay #49", date: "18/10/2025", time: "06:00 - 14:00", location: "Khuôn viên Làng du lịch Kon Tum", vendors: 70, expectedVisitors: 1000, highlights: ["Ngày hội thổ cẩm", "Trình diễn đan tre", "Ẩm thực truyền thống"] },
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
const HERO_SLIDES = [
  { title: "Chợ Phiên Ngok Bay", subtitle: "Nơi hội tụ tinh hoa văn hóa Bana", desc: "Khám phá thổ cẩm dệt tay, nông sản sạch và nhạc cụ truyền thống từ vùng cao Kon Tum", image: "photo-1506905925346-21bda4d32df4", btn1: "Khám phá ngay", btn2: "Xem chợ phiên" },
  { title: "Thổ cẩm Bana", subtitle: "Di sản dệt tay truyền đời", desc: "Mỗi tấm vải là một câu chuyện, được dệt nên từ đôi tay khéo léo của những nghệ nhân Bana qua nhiều thế hệ", image: "photo-1558618666-fcd25c85cd64", btn1: "Xem thổ cẩm", btn2: "Gặp nghệ nhân" },
  { title: "Sản phẩm OCOP 4-5★", subtitle: "Chứng nhận chất lượng quốc gia", desc: "Tuyển chọn những sản phẩm đạt tiêu chuẩn OCOP cao nhất, đảm bảo chất lượng và an toàn cho người tiêu dùng", image: "photo-1447933601403-0c6688de566e", btn1: "Xem OCOP", btn2: "Tìm hiểu thêm" },
]

function HomePage({ onAddCart }: { onAddCart: (p: any) => void }) {
  const [slide, setSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  if (isLoading) return <div className="pt-16"><Loading /></div>

  const s = HERO_SLIDES[slide]

  return (
    <main>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-foreground/50 z-10" />
        <img src={img(s.image, 1600, 900)} alt="Hero" className="absolute inset-0 w-full h-full object-cover transition-all duration-700" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-accent font-semibold font-body mb-4 bg-accent/20 px-3 py-1 rounded-full border border-accent/30">{s.subtitle}</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-5">{s.title}</h1>
            <p className="font-body text-white/80 text-lg leading-relaxed mb-8 max-w-lg">{s.desc}</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/san-pham")} className="bg-accent text-accent-foreground px-7 py-3.5 rounded-2xl font-semibold hover:bg-accent/80 transition-all hover:scale-105 font-body flex items-center gap-2">
                {s.btn1} <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate("/lich-cho-phien")} className="bg-white/20 backdrop-blur-sm text-white px-7 py-3.5 rounded-2xl font-semibold hover:bg-white/30 transition-all border border-white/30 font-body">
                {s.btn2}
              </button>
            </div>
          </div>
        </div>
        {/* Slide controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`transition-all ${i === slide ? "w-8 h-2 bg-accent" : "w-2 h-2 bg-white/50"} rounded-full`} />
          ))}
        </div>
        <button onClick={() => setSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => setSlide(s => (s + 1) % HERO_SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
          <ChevronRight size={18} />
        </button>
      </section>

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
            {MARKET_SCHEDULE.map(m => (
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
                    <Calendar size={13} className="text-accent" /> {m.date} • {m.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <MapPin size={13} className="text-accent" /> {m.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <Users size={13} className="text-accent" /> {m.vendors} gian hàng • ~{m.expectedVisitors} khách
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.highlights.map(h => <span key={h} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-body">{h}</span>)}
                </div>
                <button onClick={() => navigate("/lich-cho-phien")} className="w-full flex items-center justify-center gap-2 py-2.5 border border-primary text-primary rounded-xl text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors font-body">
                  <Map size={14} /> Xem bản đồ
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
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setRegForm({ name: "", email: "", phone: "" })
  }

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
            {MARKET_SCHEDULE.map((m, i) => (
              <div key={m.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-20 h-20 bg-accent/10 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                    <span className="font-display text-2xl font-bold text-accent">{m.date.split("/")[0]}</span>
                    <span className="text-xs text-muted-foreground font-body">Tháng {m.date.split("/")[1]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-display font-bold text-xl text-foreground">{m.name}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body font-semibold">Sắp diễn ra</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                        <Clock size={13} className="text-accent" /> {m.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                        <MapPin size={13} className="text-accent" /> {m.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                        <Users size={13} className="text-accent" /> {m.vendors} gian hàng
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {m.highlights.map(h => <span key={h} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-body">{h}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold font-body hover:bg-primary/80 transition-colors flex items-center gap-2">
                      <Map size={14} /> Xem bản đồ
                    </button>
                    <button className="px-5 py-2.5 border border-border text-foreground rounded-xl text-sm font-semibold font-body hover:bg-muted transition-colors flex items-center gap-2">
                      <ExternalLink size={14} /> Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendors */}
        <div className="mb-16">
          <SectionHeader badge="Gian hàng" title="Danh sách gian hàng" subtitle="Các thương nhân và nghệ nhân tham gia chợ phiên" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VENDORS.map(v => (
              <div key={v.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                  <Layers size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground font-body mb-1">{v.name}</h3>
                <p className="text-xs text-accent font-semibold font-body mb-2">Sạp {v.booth}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {v.products.map(p => <span key={p} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-body">{p}</span>)}
                </div>
                <p className="text-xs text-muted-foreground font-body">{v.contact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mb-16">
          <SectionHeader badge="Vị trí" title="Bản đồ chợ phiên" />
          <div className="bg-muted rounded-3xl overflow-hidden h-80 relative flex items-center justify-center border border-border">
            <div className="text-center">
              <Map size={48} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-body mb-4">Bản đồ Google Maps</p>
              <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold font-body hover:bg-primary/80 transition-colors">
                Mở Google Maps
              </button>
            </div>
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

        {/* Registration */}
        <div className="bg-primary rounded-3xl p-8 md:p-12">
          <div className="max-w-lg mx-auto text-center">
            <Bell size={32} className="text-primary-foreground mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-primary-foreground mb-3">Nhận thông báo chợ phiên</h2>
            <p className="text-primary-foreground/70 font-body mb-8">Đăng ký để nhận thông báo sớm nhất về lịch tổ chức, gian hàng mới và ưu đãi đặc biệt</p>
            {submitted ? (
              <div className="flex items-center justify-center gap-2 bg-primary-foreground/20 text-primary-foreground py-4 rounded-2xl font-semibold font-body">
                <CheckCircle size={18} /> Đăng ký thành công!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input required value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} placeholder="Họ và tên" className="w-full px-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 font-body outline-none focus:border-primary-foreground" />
                <input required type="email" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 font-body outline-none focus:border-primary-foreground" />
                <input value={regForm.phone} onChange={e => setRegForm({ ...regForm, phone: e.target.value })} placeholder="Số điện thoại (tuỳ chọn)" className="w-full px-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 font-body outline-none focus:border-primary-foreground" />
                <button type="submit" className="w-full py-3.5 bg-accent text-accent-foreground rounded-xl font-semibold font-body hover:bg-accent/80 transition-colors">
                  Đăng ký nhận thông báo
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
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
  const navigate = useNavigate()

  const navItems = [
    { to: "/admin", icon: BarChart2, label: "Tổng quan" },
    { to: "/admin/san-pham", icon: Package, label: "Sản phẩm" },
    { to: "/admin/cho-phien", icon: Calendar, label: "Chợ phiên" },
    { to: "/admin/blog", icon: FileText, label: "Bài viết" },
    { to: "/admin/don-hang", icon: ShoppingBag, label: "Đơn hàng" },
    { to: "/admin/nguoi-dung", icon: Users, label: "Người dùng" },
  ]

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-sidebar flex-shrink-0 flex flex-col transition-all duration-300 min-h-screen`}>
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border h-16">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Leaf size={16} className="text-primary-foreground" />
          </div>
          {sidebarOpen && <div className="min-w-0"><div className="font-display font-bold text-sidebar-foreground text-sm truncate">Ngok Bay</div><div className="text-xs text-sidebar-foreground/50 font-body">Admin Panel</div></div>}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === "/admin"}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
              <item.icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium font-body">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-body">Thoát Admin</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
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
// ADMIN MARKET PAGE
// ============================================================
function AdminMarketPage() {
  const [markets, setMarkets] = useState(MARKET_SCHEDULE)
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Quản lý chợ phiên</h1>
          <p className="text-muted-foreground font-body text-sm">{markets.length} phiên chợ</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold font-body hover:bg-primary/80 transition-colors text-sm">
          <Plus size={16} /> Thêm phiên chợ
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {markets.map(m => (
          <div key={m.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl text-foreground mb-2">{m.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground font-body">
                  <div className="flex items-center gap-2"><Calendar size={13} className="text-accent" /> {m.date}</div>
                  <div className="flex items-center gap-2"><Clock size={13} className="text-accent" /> {m.time}</div>
                  <div className="flex items-center gap-2"><MapPin size={13} className="text-accent" /> {m.location}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border border-border"><Edit size={16} /></button>
                <button onClick={() => setMarkets(ms => ms.filter(x => x.id !== m.id))} className="p-2 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors border border-border"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map Preview */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-semibold text-foreground font-body mb-4 flex items-center gap-2"><Map size={16} /> Bản đồ phiên chợ</h3>
        <div className="bg-muted rounded-xl h-60 flex items-center justify-center border border-border">
          <div className="text-center">
            <Map size={36} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground font-body text-sm">Google Maps Preview</p>
            <p className="text-xs text-muted-foreground font-body mt-1">Tích hợp Google Maps API</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-3xl border border-border p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground">Thêm phiên chợ</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {[{ label: "Tên phiên chợ", placeholder: "Chợ Phiên Ngok Bay #50" }, { label: "Ngày tổ chức", placeholder: "15/11/2025" }, { label: "Giờ tổ chức", placeholder: "06:00 - 12:00" }, { label: "Địa điểm", placeholder: "Làng văn hóa Kon Klor" }].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-foreground font-body mb-1.5">{f.label}</label>
                  <input placeholder={f.placeholder} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary" />
                </div>
              ))}
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors">
                <ImageIcon size={20} className="text-muted-foreground mx-auto mb-1" />
                <p className="text-xs text-muted-foreground font-body">Upload banner phiên chợ</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-border rounded-2xl text-sm font-semibold font-body hover:bg-muted">Hủy</button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold font-body hover:bg-primary/80">Lưu</button>
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
  const [cart, setCart] = useState<any[]>([])
  const [user, setUser] = useState<AuthUser | null>(null)

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
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: "var(--font-body, 'Be Vietnam Pro', system-ui, sans-serif)", borderRadius: "1rem" },
        }}
        richColors
      />
      <div className="min-h-screen bg-background" style={{ fontFamily: "var(--font-body, 'Be Vietnam Pro', system-ui, sans-serif)" }}>
        <Routes>
          {/* Protected Admin routes */}
          <Route path="/admin" element={<ProtectedAdminRoute user={user} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="san-pham" element={<AdminProductPage />} />
              <Route path="cho-phien" element={<AdminMarketPage />} />
              <Route path="blog" element={<AdminBlogPage />} />
              <Route path="don-hang" element={<AdminOrderPage />} />
              <Route path="nguoi-dung" element={<AdminUserPage />} />
            </Route>
          </Route>

          {/* Public routes */}
          <Route path="*" element={
            <>
              <Navbar cartCount={cartCount} darkMode={darkMode} onToggleDark={() => setDarkMode(v => !v)} user={user} onLogout={() => setUser(null)} />
              <Routes>
                <Route path="/" element={<HomePage onAddCart={addToCart} />} />
                <Route path="/san-pham" element={<ProductListPage onAddCart={addToCart} />} />
                <Route path="/san-pham/:id" element={<ProductDetailPage onAddCart={addToCart} />} />
                <Route path="/tho-cam" element={<ThoCamPage />} />
                <Route path="/ocop" element={<OCOPPage onAddCart={addToCart} />} />
                <Route path="/van-hoa" element={<VanHoaPage />} />
                <Route path="/lich-cho-phien" element={<LichChoPhienPage />} />
                <Route path="/gio-hang" element={<CartPage cart={cart} setCart={setCart} />} />
                <Route path="/thanh-toan" element={<CheckoutPage cart={cart} />} />
                <Route path="/dang-nhap" element={<LoginPage onLogin={setUser} />} />
                <Route path="/lien-he" element={<LienHePage />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
