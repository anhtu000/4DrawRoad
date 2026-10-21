# CLAUDE.md – Project "Game Making"

Cập nhật: 11/10/2026. Đã chốt thể loại và các yếu tố bắt buộc của game #1 và #2. Từ 12/10/2026 dự án chuyển sang giai đoạn phát triển. Nội dung tổng hợp từ chat nghiên cứu ngày 10–11/10/2026. Chiều 11/10 chat phát triển game #1 đổi thiết kế game #1 sang clicker RNG + merge và rút lịch 1 ngày (mục 3, 4b, 11). Chiều 11/10 chat nghiên cứu thêm hướng đi tiềm năng: kênh video riêng, các kênh kéo người chơi chi phí thấp và các cấu phần code chuẩn bị sẵn (mục 3, 5c, 11). Tối 11/10 chat phát triển game #1 chốt số kinh tế qua mô phỏng và thêm: hướng dẫn theo bước, tự động hoá phút 4–5, cân bằng nhấp tay và auto, phím Space, sao băng (mục 3, 4.2, 4.3, 4b). Trưa 12/10 chat phát triển game #1 thêm thiên thể ẩn, tinh thể, cửa hàng trang trí, menu, quà ngày, bảng "Board full" (mục 4b mục 8–11). Tối 11/10 chốt đường phát hành theo từng game (game #1 đi CrazyGames, game #2 thử Poki trước) và thêm hướng dẫn đăng game `claude/WebGame-Publishing_Brief_v1.md` (mục 1, 2, 3, 4, 5, 6, 7, 10, 11). Tối 12/10 chat phát triển game #1 đổi theo yêu cầu người dùng: nâng cấp mở sớm hơn, giới hạn cấp trước Thiên hà, hướng dẫn ghép đầu tiên và trang trí đầu tiên, giá trang trí (mục 4b). Rạng sáng 14/10 chat phát triển game #1 làm ảnh bìa 3 cỡ, 2 video xem trước, mô tả và hướng dẫn điều khiển cho CrazyGames (mục 11). Chiều 14/10 chat phát triển game #2 bắt đầu sớm 1 ngày: adapter Poki, thiết kế v1, kinh tế và mô phỏng, mẫu hình ảnh (mục 5a). Tối 14/10 chat nghiên cứu ngách mới chọn game #3: câu cá + ấp trứng ra thú, tài liệu thiết kế v0 (mục 3, 5d, 10). Tối 14/10 chốt thêm portal ngoài Poki, CrazyGames, Y8, quy trình chọn đường phát hành trước khi viết code mỗi game, và đường A (Poki) cho game #3 (mục 1, 2, 3, 5d, 11). Rạng sáng 15/10 chat phát triển game #2 sửa game #2 theo `claude/Poki-Huong-dan.md` (mục 5a). Sáng 15/10 chat phát triển game #2 đo nhịp chơi (bot chơi hết một lượt, mô phỏng theo phút), sửa lỗi sao 2–4 không có hiệu ứng, thêm chuỗi nhiệm vụ ngắn và chỉnh giá (mục 5a). Khi một quyết định thay đổi, sửa file này trước khi làm tiếp.

## 1. Mục tiêu

Kiếm thu nhập từ game web HTML5 đăng trên các web portal, ngân sách tiền mặt thấp, một người làm, 6–8 giờ mỗi ngày.

Mỗi game chọn một trong hai đường phát hành **trước khi đăng ở bất kỳ đâu** (quyết định 11/10):

- **Đường A – Poki:** chỉ Poki trên web, độc quyền 5 năm (Discord và YouTube Playables cũng tính là web; Steam và kho ứng dụng di động vẫn được). Dùng cho game hợp khán giả Poki. Nộp Poki for Developers, chờ tối đa 7 ngày; không có tiến triển thì chuyển sang đường B.
- **Đường B – phân phối rộng**, theo thứ tự:
  1. CrazyGames (Basic Launch dùng làm bài test thị trường miễn phí)
  2. Yandex Games (sau khi có số liệu từ CrazyGames và đã kiểm tra việc nhận tiền)
  3. GameDistribution, Y8 (mạng phân phối HTML5, không đòi độc quyền)
     - Chỉ chọn một mạng phân phối: GameDistribution hoặc GameMonetize, không đăng cả hai (dễ trùng bản trên cùng một site).
  4. YouTube Playables: đang early access, phải gửi form xin và chờ được chọn; gửi sớm cho game đường B (quyết định 14/10).

Sau đó, cho cả hai đường:

- Android: port game tốt nhất; iOS chỉ khi Android có lãi.
- Telegram: kênh phụ, không làm bản riêng.
- Không làm (đánh giá 14/10): itch.io và Newgrounds (thu nhập quảng cáo thấp; itch.io chỉ dùng làm trang giới thiệu cho kênh video nếu cần), GameMonetize nếu đã chọn GameDistribution, Armor Games (phải chào bằng email, chỉ trả phí một lần), Kongregate (đóng nhận game tự do từ 2020), Discord Activities (chỉ hợp game chơi nhóm).
- Discord và YouTube Playables tính là web, nên không dùng cho game đường A.

Không chi tiền mua người chơi (UA). Portal mang người chơi đến. Kênh video riêng và cộng đồng chỉ là kênh phụ, trả bằng thời gian chứ không bằng tiền (mục 5c).

## 2. Người dùng và cách làm việc

- Giao tiếp bằng tiếng Việt. Ngắn gọn, thực tế, có cấu trúc. Khi có nhiều cách thì so sánh ưu nhược. Chỉ ra giả định sai thay vì đồng ý. Chỉ hỏi lại khi thật cần.
- Viết tự nhiên, không emoji, không văn quảng cáo.
- Nghiên cứu: tách rõ sự thật, giả định và ý kiến; trích nguồn; nói rõ khi không chắc.
- Người dùng biết code ở mức cơ bản, đang ở Úc (Sydney, UTC+11).
- **Khi đăng game lên portal:** người dùng cần được hướng dẫn chi tiết từng bước (tạo tài khoản, thông tin nhận tiền, từng ô trong form, file cần tải, ảnh bìa, video) và các điều cần lưu ý. Dựa trên `claude/WebGame-Publishing_Brief_v1.md`, mở lại trang chính thức của portal để kiểm tra trước khi hướng dẫn, và cập nhật file đó khi thấy quy định đổi.
- **Giai đoạn hiện tại: phát triển** (từ 12/10/2026). Lịch tuần đầu ở mục 11.
- **Trước khi viết code mỗi game (quyết định 14/10):** chat nghiên cứu đề xuất đường phát hành (A Poki hay B phân phối rộng), kèm lý do và số liệu: game hợp khán giả portal nào, đối thủ trên từng portal, độc quyền, thời gian chờ duyệt, doanh thu dự kiến. Người dùng quyết định. Sau đó mới dựng adapter SDK theo đường đã chọn (đường A: Poki; đường B: CrazyGames trước, rồi Yandex, mạng phân phối, YouTube Playables) và ghi vào bảng mục 3.
- **Tách chat theo việc:**
  - Chat phát triển được viết code, mỗi chat một việc lớn (bộ khung, game #1, game #2).
  - Chat nghiên cứu chỉ nghiên cứu, không code.
  - Câu hỏi thị trường mới thì mở chat nghiên cứu riêng.

## 3. Quyết định

| Hạng mục | Trạng thái | Nội dung |
| --- | --- | --- |
| Kênh phát hành | Đã chốt | Web portal trước. Đường phát hành chọn theo từng game (dòng dưới, mục 1) |
| Đường phát hành từng game | Đã chốt (11/10) | Chọn đường A (Poki độc quyền) hay B (CrazyGames → Yandex → mạng HTML5) trước khi đăng ở bất kỳ đâu. Game #1: đường B. Game #2: thử đường A trước, chờ phản hồi của Poki tối đa 7 ngày, không có tiến triển thì đi đường B. Game #3: đường A (người dùng chọn 14/10), mốc kiểm tra khoảng 26/10 khi Poki trả lời game #2 (mục 5d) |
| Game #1 | Đã chốt (đổi 11/10) | Clicker RNG + merge, sưu tầm có đích đến (mục 4b). Trước đó: clicker RNG sưu tầm không có merge |
| Chủ đề game #1 | Mặc định, đổi được | Vũ trụ. Phương án 2: phép thuật / độc dược |
| Menu game #1 | Đã chốt (11/10) | Người mới vào thẳng màn chơi để có phần thưởng trong 5 giây. Người đã có save thấy menu (Continue, quà ngày, kỷ lục, chế độ chơi lại). Bộ khung thêm tuỳ chọn `menu: 'returning'` |
| Nút thưởng trong Basic Launch | Đã chốt (11/10, số chốt theo mô phỏng) | Vẫn trao thưởng khi portal tắt quảng cáo (`whenAdsDisabled: 'grant'`). Mỗi nút thưởng hồi 5 phút, áp dụng cả khi có quảng cáo thật (thay cho 2–3 phút: ít quảng cáo hơn nhưng mỗi lần đáng giá hơn). Khi portal tắt quảng cáo thì thời gian hồi ×1,5 (`app.ads.rewardsAreFree`) để nhịp Basic Launch gần với người xem quảng cáo thật |
| Hướng dẫn đầu game | Đã chốt (11/10) | Hướng dẫn theo bước, phải làm đúng thao tác mới sang bước sau (mục 4.2). Thay cho quy tắc cũ "không có hướng dẫn bắt buộc, chỉ gợi ý nhẹ" |
| Nhấp tay và auto (game #1) | Đã chốt (11/10) | Nhấp đều làm thu nhập gấp khoảng 2 lần lúc chỉ để auto chạy. Nâng cấp nhấp tay rẻ, mạnh, chỉ tăng nhấp tay. Người nhấp đều về đích sớm hơn người thi thoảng nhấp khoảng 30–40% (chọn mức này thay cho 20%, vì 20% thì nhấp chỉ tăng thu nhập khoảng 35–40%, khó thấy). Máy tính nhấp được bằng phím Space |
| Hình ảnh game #1 | Đã chốt (11/10) | Vẽ gần như toàn bộ bằng code (thiên thể, nền sao và tinh vân, UI). Asset CC0 chỉ dùng cho icon nhỏ nếu thiếu, ghi vào `ASSETS.md` |
| Game #2 | Đã chốt | Tycoon 2D: quán cozy do thú cute vận hành, có sưu tầm thú, cho 13+ (mục 5). Chủ đề thay thế: văn phòng / cửa hàng thường. Dự phòng nếu tycoon quá sức: câu cá nâng cấp 2D |
| Game #3 | Đã chọn (14/10), thiết kế v0 chưa chốt số | Câu cá + ấp trứng ra thú, cozy, tên tạm Pond Pals: Hatch & Fish (mục 5d). Đường A, Poki (chọn 14/10, mục 5d); bắt đầu sau khi nộp game #2 |
| Portal ngoài Poki, CrazyGames, Y8 | Đã chốt (14/10) | Đường B thêm YouTube Playables (gửi form early access) và một mạng phân phối (GameDistribution hoặc GameMonetize). Không làm itch.io, Newgrounds, Armor Games, Kongregate, Discord Activities (mục 1) |
| Chọn đường trước khi code | Đã chốt (14/10) | Mỗi game: nghiên cứu, đề xuất đường A hay B, người dùng quyết định, rồi mới dựng SDK theo đường đó (mục 2) |
| Engine | Đã chốt | Phaser 4 + TypeScript, dựng bằng Vite |
| Lớp SDK | Đã chốt | Adapter mỏng tự viết. Gọi thẳng SDK CrazyGames v3 trước, thêm Poki (cho game #2, `core/platform/poki.ts` và mode build `poki` xong 14/10), Yandex sau |
| Lịch | Đã chốt (rút 1 ngày ngày 11/10) | Game #1 xong 14/10, nộp CrazyGames 15/10, game #2 bắt đầu 15/10 và nộp Poki từ 19/10 (mục 11) |
| Nơi để code | Đã chốt (11/10) | Mỗi game một repo GitHub và một thư mục trên máy, mỗi repo có một bản bộ khung `core/` (mục 11) |
| Kênh video riêng và kênh kéo người chơi | Tiềm năng, chưa chốt (11/10) | Kênh TikTok/YouTube Shorts lấy gameplay thật làm nguyên liệu, chủ đề trùng ngách game ngay từ đầu, không làm kênh AI chung chung rồi mới gắn game. Chuẩn bị sẵn code theo mục 5c. Chốt hay bỏ sau khi có số liệu Basic Launch game #1 |

Lý do:

- **Phaser:**
  - Build web nhỏ (cần dưới 8 MB để giữ cửa Poki).
  - SDK của các portal viết bằng JavaScript.
  - Claude viết và chạy thử trực tiếp được.
  - Đánh đổi: không có trình chỉnh sửa trực quan, chủ yếu cho 2D, port sang mobile cần Capacitor.
- **TypeScript:** Claude viết phần lớn code, TypeScript bắt lỗi trước khi chạy, người dùng vẫn đọc được.
- **Adapter tự viết thay cho Playgama Bridge:** ít tầng trung gian, dễ gỡ lỗi khi mới chỉ có một portal. Xem lại khi một game chạy từ 4–5 portal trở lên (ghi chú 14/10; nhận định Bridge tiết kiệm công tích hợp đến từ blog của chính Playgama).
- **Thời gian hồi cho nút thưởng:** trong Basic Launch nút thưởng không cần xem quảng cáo. Không giới hạn thì người chơi bấm liên tục, nhịp chơi và số liệu đo được đẹp hơn Full Launch. Có thời gian hồi thì số liệu Basic Launch gần với nhịp xem quảng cáo thật.
- **Chọn đường phát hành trước khi đăng:** Poki đòi độc quyền trên web; game đã có trên portal khác gần như mất cửa chia doanh thu với Poki (chỉ còn license một lần).
- **Game #1 đi đường B:** top 60 của Poki không có clicker thuần (nghiên cứu 10–11/10), và lịch nộp 15/10 không đủ chỗ chờ Poki trả lời.
- **Game #2 thử đường A:** thể loại quán do thú vận hành đã có trong top tag của Poki (Cat Pizza, Platypus Coffee). Poki trả 100% doanh thu với người chơi tự mang đến, hợp với kênh video riêng (mục 5c). Cái giá: game #2 lên CrazyGames muộn khoảng một tuần nếu Poki không nhận.

## 4. Yếu tố hút người chơi bắt buộc (cả hai game)

Nguồn:

- 4 game clicker đã chơi và ghi số liệu: The MachinEGG, Mine Clicker RNG, Leek Factory Tycoon, Aura Clicker.
- Tài liệu CrazyGames.
- Khảo sát Newzoo và Google (2/2026).

Mốc phải đạt ở Basic Launch của CrazyGames (tài liệu chính thức):

- Thời gian chơi trung bình mỗi phiên từ 10 phút
- Tỉ lệ quay lại ngày hôm sau 10–15%
- Từ 80% người chơi chơi quá 1 phút; tải dưới 10 giây; build dưới 20 MB

### 4.1 Được bấm vào

- **Tên game chứa từ khoá thể loại và chủ đề**, ví dụ "... Clicker", "... RNG", "... Tycoon", "... Cafe".
  - 45% người chơi tìm game qua công cụ tìm kiếm, khoảng 70% trong số đó tìm theo loại game.
  - Thể loại (48%) và chủ đề (43%) là hai lý do chọn game hàng đầu.
  - Không dùng "free", "best", "top" trong tên (Yandex từ chối).
- **Ảnh bìa đủ 3 cỡ** (bắt buộc trên CrazyGames): 1920×1080 (16:9), 800×1200 (2:3), 800×800 (1:1), cùng một phong cách.
  - Không chỉ chụp màn hình. Bố cục đơn giản, đọc được trên màn hình nhỏ.
  - Chỉ ghi tên game.
  - Không viền, không chữ "New / Play", không logo cửa hàng, không ảnh có bản quyền, không mờ hay vỡ.
- **Video xem trước** (bắt buộc khi nộp CrazyGames): bản ngang 16:9 và bản dọc 2:3 ở 1080p, 15–20 giây (dài hơn bị cắt), tối đa 50 MB, không có tiếng, khung đầu là ảnh bìa.
  - Không màn đen, không viền đen, không con trỏ chuột mặc định, không tua nhanh, không chữ "Play Now", không icon mạng xã hội.

### 4.2 Phút đầu (từ 80% người chơi qua phút thứ nhất)

- Tải dưới 3 giây, tải ban đầu dưới 8 MB.
- Phần thưởng đầu tiên trong 5 giây.
- Hướng dẫn theo bước (quyết định 11/10, thay cho "chỉ gợi ý nhẹ"):
  - Mỗi bước một dòng chữ ngắn, bàn tay chỉ vào đúng chỗ, phải làm đúng thao tác mới sang bước sau.
  - Mỗi bước là thao tác thật và có thưởng ngay. Phần đầu game khoảng 40 giây.
  - Yếu tố mới (sao băng, tự động hoá, bộ sưu tập, nút thưởng...) được hướng dẫn đúng lúc nó xuất hiện, cũng theo bước. Không dồn hết vào đầu game, vì cần từ 80% người chơi qua phút đầu.
- Điều khiển một chạm, nút đủ lớn trên điện thoại. 28% người 13–20 tuổi bỏ game vì điều khiển kém. Trên máy tính, game clicker nhận thêm phím Space để nhấp (nhấn giữ không tính là nhấp liên tục); có nhắc trong hướng dẫn, không hiện trên điện thoại.
- Ưu tiên màn hình dọc trên điện thoại. Shop không được che vùng chơi (lỗi của MachinEGG). Vẫn chạy tốt trong khung 16:9 trên máy tính.

### 4.3 Mười phút đầu (thời gian chơi từ 10 phút)

- Thao tác tay phải có ý nghĩa trong 4–7 phút đầu (game #1 mở tự động hoá ở phút 4–5, quyết định 11/10). Không mở tự động hoá quá sớm:
  - Aura mở ở phút 1 và người chơi chán ở phút 4.
  - MachinEGG mở ở phút 7 và giữ người chơi 40 phút.
- Luôn có việc tiếp theo, không có khoảng phải ngồi chờ. Giá vật phẩm vừa phải, bước tiếp theo dễ hiểu.
- Trong 10 phút đầu, mỗi phần thưởng (mua, quét, ghép, bắt sao...) cách nhau tối đa 10–20 giây (quyết định 11/10).
- Sau khi có tự động hoá, nhấp tay vẫn phải đáng làm: thu nhập khi nhấp đều nhìn thấy rõ cao hơn lúc chỉ để auto chạy.
- Trong 10 phút đầu, khoảng 1–2 phút lại mở một thứ mới (ý kiến, chỉnh theo số liệu thật).
- Đủ thử thách: 25% người 13–20 tuổi bỏ game vì quá dễ.
- Hiệu ứng và âm thanh mạnh hơn đối thủ (cả 4 game chỉ đạt 3/5 về độ "đã tay"): số bay lên, rung nhẹ, âm thanh mỗi lần nhấp và mỗi lần mua.
- Số lớn hiển thị dạng K/M/B/T.

### 4.4 Lý do quay lại hôm sau (tỉ lệ quay lại 10–15%)

Đây là điểm yếu chung của cả 4 game đã chơi.

- Thu nhập khi vắng mặt, xem quảng cáo để nhân x2–x3 khi quay lại.
- Quà hằng ngày.
- Bộ sưu tập còn thiếu, tỉ lệ rơi công khai (theo Mine Clicker RNG).
- Có đích đến cuối, chạm được trong khoảng dưới 1 giờ, cả khi xem và khi không xem quảng cáo có thưởng (quyết định 13/10; trước đó chỉ khi dùng quảng cáo). Không làm game vô tận làm mục tiêu chính.
- Chế độ chơi lại để phá kỷ lục (speedrun, thử thách), có lưu kỷ lục cá nhân.
- Bảng xếp hạng online: SDK CrazyGames có, nhưng chỉ cho game được mời, mỗi game một bảng, reset mỗi thứ Hai. Ở v1 thiết kế sẵn một chỉ số (ví dụ thời gian về đích) để nộp khi được mời.
- Có tuỳ biến: 20% người 13–20 tuổi chọn cơ chế này.
- Lưu tự động. Sau Full Launch dùng module `data` của SDK để lưu qua nhiều thiết bị.

### 4.5 Quảng cáo không đuổi người chơi

- Basic Launch chưa có quảng cáo. SDK quảng cáo cần có trước Full Launch.
- Trong lúc chơi chỉ dùng quảng cáo có thưởng (49% người chơi thích loại này).
  - Gắn nút xem quảng cáo ngay trên nút nâng cấp (theo MachinEGG) và ở màn quà khi quay lại.
- Quảng cáo giữa chừng chỉ đặt ở điểm nghỉ tự nhiên. 41% không thích quảng cáo chèn khi đang chơi, 11% sẽ bỏ game vì nó.
- Không làm game chậm tới mức người không xem quảng cáo thấy nản (lỗi của Leek).
- **Quy định CrazyGames đọc ngày 11/10 cần đối chiếu với thiết kế trên** (chi tiết ở mục 8 của `claude/WebGame-Publishing_Brief_v1.md`):
  - Không hiện nút xin quảng cáo có thưởng trong lúc đang chơi. Chưa rõ QA coi bảng nâng cấp của clicker là "đang chơi" hay không; an toàn nhất là đặt nút trong bảng nâng cấp hoặc các màn nghỉ, không ở vùng thao tác chính.
  - Không gắn quảng cáo giữa chừng vào nút điều hướng (ví dụ nút về menu).
  - Nút thưởng: có biểu tượng video, hiện đồng hồ khi đang hồi, có cách lấy thưởng bằng tiền trong game, nút bỏ qua cùng cỡ nút đồng ý.

### 4.6 Nội dung và chủ đề

- Tránh chủ đề đào mỏ, nông trại, meme/brainrot (đều đã đông).
- Không dùng tên, nhân vật của trend hay IP của người khác.
- Phong cách cho 13+, không trẻ con. Game cho trẻ em trên CrazyGames bị đưa sang site riêng không có doanh thu.
- Nội dung ở dạng dữ liệu (JSON): vật phẩm, nâng cấp, thú, đồ trang trí, sự kiện. Mục tiêu là thêm một đợt theo mùa trong một ngày.
- Bản cập nhật Giáng sinh cho cả hai game trước đầu tháng 12.

## 4b. Game #1: Clicker RNG + merge, sưu tầm có đích đến

Đổi ngày 11/10 trong chat phát triển game #1: thêm merge vào clicker RNG, theo đề xuất của người dùng.

Vì sao chọn dạng này:

- Hai clicker đang Hot ngày 11/10 (Mine Clicker RNG, Aura Clicker) đều xoay quanh việc quay vật phẩm theo độ hiếm. Vì vậy RNG vẫn là lõi.
- MachinEGG giữ người chơi 40 phút nhờ có đích đến rõ và không có khoảng chờ.
- Clicker hợp nhóm 41–55 tuổi, nhóm đông trên Yandex (thích bấm/chạm, chơi một mình).
- Merge thêm thao tác tay có ý nghĩa sau khi việc nhấp đã được tự động hoá, và cho đích cuối nhìn thấy được trên bảng (ý kiến, kiểm chứng khi chơi thử).
- Ghép bằng kéo thả một ngón hợp với điện thoại màn dọc.

Đối thủ gần (kiểm tra 11/10):

- Top tag Merge của CrazyGames chủ yếu là merge-2 kiểu cốt truyện, trang trí (Mergest Kingdom, Farm Merge Valley...), khán giả khác. Merge + clicker có Mine Idle Clicker. Chủ đề vũ trụ chỉ có Galaxy Merge: Starships Wars.
- Planet Merge (Poki, ra 7/2026, 4,3/5 từ 6.999 vote): ghép hành tinh thành hành tinh lớn hơn, nhưng là xếp hình vật lý kiểu Suika, không phải clicker.
- Planet Evolution Idle Clicker (CrazyGames, Leek & Ribs Games, 9,2): clicker vũ trụ, Unity, chỉ chạy trên desktop, trang game không nhắc đến merge.
- Chưa kiểm tra game merge có lọt Hot hay không.

Vòng lặp chính:

1. Nhấp vào lõi sao để có năng lượng.
2. Dùng năng lượng để quét. Mỗi lần quét đặt một thiên thể cấp thấp lên bảng (khoảng 4×4 ô), có tỉ lệ nhỏ ra thẳng cấp cao hơn, hiện tỉ lệ.
3. Kéo thả 2 thiên thể cùng cấp để ghép thành cấp sau. Khoảng 10 cấp: bụi, đá, tiểu hành tinh, mặt trăng, hành tinh, khí khổng lồ, ngôi sao...
4. Mỗi lần quét và mỗi lần ghép quay ra độ hiếm (5 bậc: Common, Rare, Epic, Legendary, Mythic), hiện tỉ lệ và bộ đếm bảo hiểm. Thiên thể hiếm cho nhiều năng lượng hơn. Ghép hai thiên thể thì kết quả không thấp hơn trung bình cộng độ hiếm của cặp, làm tròn xuống (đổi 11/10, trước đó là độ hiếm thấp hơn của cặp), rồi vẫn quay để có thể lên bậc cao hơn. **Đổi chiều 13/10 (người dùng):** 50% ra đúng trung bình cộng làm tròn xuống, 50% quay theo tỉ lệ gốc như khi quét (có Stellar Luck), nên có thể thấp hơn hoặc cao hơn; ghép lên Hố đen (cấp 9) và Thiên hà (cấp 10) luôn quay theo tỉ lệ gốc, không còn giữ độ hiếm (`economy.mergeRarity`: keepAverage 0,5, rollFromTier 9). Bảo hiểm Epic/Legendary vẫn tính mọi lần ghép, đến hạn thì bắt buộc quay. Lần ghép đầu theo kịch bản vẫn ít nhất Rare. Ghép thiên thể ẩn (Thiên hà + bạn ghép) dùng luật 50/50, không có ngoại lệ cấp cao. Câu hướng dẫn đổi thành "Merge two rare bodies for a 50% chance to keep their rarity".
4b. Thưởng khi ghép (yêu cầu người dùng 11/10): mỗi lần ghép cho năng lượng bằng một phần trăm giá Scan hiện tại, tăng theo hai chiều là cấp của cặp và độ hiếm của mảnh hiếm hơn: cấp 1 Common 0%, cấp 8 Legendary 100%. Bảng số nằm trong `economy.json`. Nhờ vậy ghép mảnh hiếm với mảnh thường vẫn có lợi. Trưa 13/10 (người dùng: giảm khoảng 20% năng lượng khi ghép mảnh hiếm cao): cột Epic, Legendary, Mythic ×0,8, cột Rare ×0,9 để bảng vẫn tăng dần theo độ hiếm (nếu giữ nguyên Rare thì ở cấp 8–9 ghép Epic được ít hơn ghép Rare); Common giữ nguyên. Cấp 8 Legendary còn 80% giá Scan.
5. Nâng cấp nhấp tay (rẻ, mạnh), máy quét, may mắn.
6. Tự động hoá (tàu thu) mở vào khoảng phút 4–5. Sau đó nhấp tay vẫn đáng làm: nhấp đều thì thu nhập gấp khoảng 2 lần. Việc ghép vẫn làm tay; ghép tự động chỉ mở muộn (nâng cấp). Quét tự động có nút bật/tắt cạnh nút Scan, để người chơi để dành năng lượng mua nâng cấp (yêu cầu người dùng 11/10).
6b. Sao băng bay qua mỗi 30–50 giây, chạm để nhận năng lượng, 1/10 là sao vàng x5. Trưa 13/10 (người dùng): giá trị sao băng giảm 30%, từ 10 xuống 7 giây thu nhập khi nhấp đều (`stars.seconds`). Chiều 13/10 (người dùng) chỉnh lại: giá trị −20% so với gốc, tức 8 giây; trước khi có Thiên hà và trong lượt tính giờ sao xuất hiện dày hơn 40% (`stars.freqMultBeforeGoal`); ở lượt chính sau Thiên hà (chơi tiếp để sưu tầm) sao về nhịp gốc nhưng giá trị ×2, tức 16 giây (`stars.valueMultEndless`). Hiểu "giảm 20%" là so với gốc 10 giây, thay cho mức −30% trước đó; nếu tính trên 7 giây (còn 5,6 giây) thì lượt tính giờ không quảng cáo 67 phút thay vì 61 phút (100 lượt). **Chiều 13/10 (người dùng, thay các quy định về nhịp ở trên):** sao xuất hiện ngẫu nhiên 4–8 giây sau khi đợt trước hết (bắt xong hoặc bay mất), ở mọi chế độ; 20% số đợt có 2 sao cùng lúc, bay ngược chiều nhau, mỗi sao có thể là sao vàng; bỏ nhịp dày hơn 40% trước Thiên hà và nhịp riêng 10 phút đầu vì 4–8 giây đã dày hơn nhiều. Giá trị mỗi sao vẫn 8 giây thu nhập, ×2 ở lượt chính sau Thiên hà. Sao không xuất hiện khi chưa xong hướng dẫn đầu game (tới bước goal), vì cứ vài giây lại có sao bay ngang hướng dẫn. Mô phỏng: mỗi sao chỉ quyết định bắt hay trượt một lần (5/6 bắt được); trước đó lần thử lặp lại mỗi bước nên gần như sao nào cũng bắt được. Chiều 13/10 lần 3 (người dùng): giá trị trước Thiên hà (và trong lượt tính giờ) giảm 30%, còn 5,6 giây thu nhập; sau Thiên hà ở lượt chính ×3 so với trước Thiên hà, tức 16,8 giây. Tối 13/10 (người dùng): sau Thiên hà còn ×2, tức 11,2 giây. Lượt tính giờ trên máy tính: đầu mỗi lượt hiện mẹo "click và nhấn Space cùng lúc để nhấp nhanh hơn" (cả hai đều tính là nhấp, không giới hạn số lần mỗi bước).
6c. Nâng cấp chỉ xuất hiện sau khi có auto (yêu cầu người dùng 11/10): tăng tỉ lệ quét ra thiên thể lớn hơn; ghép có tỉ lệ ra thêm 1 bản giống hệt; sao băng xuất hiện dày hơn. Sau mỗi lần ghép, có nút xem quảng cáo để nhận thêm 1 bản thiên thể vừa ghép. Bản sao (cả nâng cấp lẫn quảng cáo) chỉ áp dụng tới cấp Khí khổng lồ, để không nhân đôi được Ngôi sao, Hố đen mà về đích tắt. Trưa 13/10 (người dùng): bản sao qua quảng cáo chỉ tới Tiểu hành tinh (`rewarded.twin.maxTier` = 3); Binary Merge vẫn tới Khí khổng lồ.
7. Tạo ra cấp cao nhất là về đích. Màn chúc mừng "Your galaxy is complete!" hiện thời gian, số lần ghép, số lần quét, bộ sưu tập, kỷ lục (yêu cầu người dùng 12/10). Hai lựa chọn: chơi tiếp không giới hạn (sưu tầm các biến thể còn thiếu, tiến trình giữ nguyên) hoặc chơi lại tính giờ để phá kỷ lục. Ở lượt chính sau Thiên hà (chiều 13/10, người dùng): sao băng ×2 giá trị (mục 6b) và giá Scan tăng chậm một nửa (`scan.endlessGrowth` 0,5: mỗi lần quét chỉ đẩy giá đi nửa bước, tính từ số lần quét lúc có Thiên hà, lưu ở `endlessUnits`). Chiều 13/10 lần 2 (người dùng): chậm hơn nữa, `endlessGrowth` 0,25 (mỗi lần quét đẩy giá đi một phần tư bước). Lần về đích đầu tiên (trưa 13/10, người dùng): màn chúc mừng ghi "Now try to find every hidden body to complete your collection" (thay dòng kỷ lục) và chỉ có nút "See collection"; nút này mở bộ sưu tập ở thẻ Hidden; đóng bộ sưu tập thì màn chúc mừng hiện lại với hai lựa chọn như cũ. Chỉ một lần (cờ `collectionTour` trong tutorial), bỏ qua nếu đã tìm đủ thiên thể ẩn. Chơi lại không xoá tiến trình chính: lượt tính giờ chạy riêng, thoát ra thì về lại thiên hà của mình. Sau khi về đích, chơi lại tính giờ mở từ nút menu ở góc trên.
8. Bốn thiên thể ẩn (yêu cầu người dùng 12/10, màn về đích giữ nguyên): kéo Thiên hà vào Hành tinh, Khí khổng lồ, Ngôi sao hoặc Hố đen tạo ra 4 thiên thể đặc biệt (Cradle World, Halo Giant, Starburst Core, Quasar). Có độ hiếm như thiên thể thường (ít nhất trung bình độ hiếm của cặp, làm tròn xuống, rồi quay), nên bộ sưu tập ẩn có 4 loại × 5 bậc = 20 (yêu cầu người dùng 12/10). Chỉ để sưu tầm: không ghép tiếp được, không cộng sức mạnh, không cộng thưởng sưu tầm. Ghép tự động không tạo ra chúng. Bộ sưu tập có ô ẩn với gợi ý nhẹ, không nói rõ công thức. Lần đầu tạo ra mỗi loại và mỗi bậc hiếm có màn chúc mừng "Hidden discovery". Bán được để lấy tinh thể, giá nhân theo độ hiếm. **Chiều 13/10 (người dùng):** thiên thể ẩn có năng lượng trên bảng. Bản cuối: giữ năng lượng của chính Thiên hà đã tạo ra nó, cộng 10% (`power` 1,1 trong `bodies.json`; độ hiếm Thiên hà lưu ở trường `g` của thiên thể, save cũ dùng độ hiếm của thiên thể), nên độ hiếm quay ra thấp hơn cũng không làm giảm năng lượng (lần đầu Claude đặt 1,5–2,5 lần Thiên hà cùng độ hiếm của thiên thể ẩn, người dùng chỉnh còn khoảng +10% so với Thiên hà gốc). Bán lấy tinh thể thì mất phần năng lượng này; trước khi bán có bảng hỏi lại ("Sell for crystals?"), ghi số tinh thể và năng lượng mỗi lần nhấp giảm khoảng bao nhiêu %, hai nút Sell và Keep it (áp dụng cả khi bán từ thẻ thông tin và từ bảng Board full).
9. Tiền tệ thứ hai, tinh thể (Crystals), chỉ dùng cho trang trí, không mua được sức mạnh. Nguồn: bán thiên thể ẩn, xem quảng cáo có thưởng trong cửa hàng trang trí (hồi 5 phút), quà hằng ngày, quà 20 tinh thể một lần khi có Sao chổi đầu tiên (mục 10).
10. Cửa hàng trang trí (mục trong menu): đổi hình nền, mua hành tinh trang trí (sao Thổ, sao Kim, sao Mộc...) và tàu vũ trụ. Vật phẩm nhỏ, người chơi kéo đặt tự do trên nền, không được chồng lên khu vực chơi chính và các nút; tối đa 15 vật phẩm. **Trưa 14/10 (người dùng, thử trên CrazyGames Preview):** ở màn ngang khung của CrazyGames rộng hơn 16:9 một chút (khoảng 1,9:1) và chỉ còn khoảng 8 chỗ trống cho đồ trang trí, 3 chỗ khi có nút Auto. Sửa: màn ngang thu nhỏ bảng, lõi, chuỗi cấp, nút Auto một chút; phần rộng dư để thành một dải trống giữa bảng và cột nâng cấp; vùng cấm của số năng lượng và dòng thu nhập không vượt quá cột trái. Mục tiêu: đủ 15 chỗ ở mọi khung ngang thường gặp, kể cả khi có nút Auto. Số cụ thể: bảng tối đa 460 thay vì 561 (ô 108 thay vì 130), lõi bán kính 60 thay vì 70, chuỗi cấp rộng 320 thay vì 370, cột trái 340 thay vì 380, nút Auto 164 thay vì 176 (chữ 19 thay vì 21, cả màn dọc), dải trống 96 giữa bảng và cột nâng cấp (`DECOR_LANE`), cột nâng cấp giữ 320 để chữ không nhỏ thêm. Kết quả (đếm số đồ 64 đơn vị xếp được vào chỗ trống, khi có nút Auto): khung CrazyGames 1371×720 từ 3 lên 26, 16:9 từ 17 lên 24, điện thoại ngang từ 21 lên 51; màn dọc không đổi (38–73). Thử hiện cả 15 món cùng lúc ở 8 khung (16:9, khung CrazyGames, 4:3, điện thoại ngang, điện thoại dọc thường và ngắn), có nút Auto và đồng hồ lượt tính giờ: cả 15 món đều hiện, không món nào đè lên vùng cấm. Bot chơi tự động màn ngang (khung CrazyGames) và màn dọc trên bản build: không lỗi, hướng dẫn trang trí chạy hết. Video xem trước bản ngang quay lại theo bố cục mới; bản dọc không đổi. Vị trí lưu riêng cho màn ngang và màn dọc. Bản v1 (12/10): 5 hình nền, 8 hành tinh, 7 tàu/vật thể; quảng cáo trong cửa hàng cho 15 tinh thể, hồi 5 phút. Giá tăng tối 12/10 (yêu cầu người dùng): hình nền 80–160, vật phẩm 15–70, Earth giữ 20, tổng khoảng 1.010 tinh thể.
   - Trang trí đầu tiên có hướng dẫn bắt buộc (yêu cầu người dùng 12/10): lần đầu có Sao chổi ở lượt chính, sau khi xong hướng dẫn đầu game, hiện bảng tặng 20 tinh thể; nhận xong thì cửa hàng mở ở tab Planets, bàn tay chỉ lần lượt: mua Earth, bấm Arrange, kéo Earth tới chỗ trống (tay chỉ sẵn một chỗ trống), bấm Done rồi chơi tiếp. Trong lúc đó các chỗ khác bị chặn, Esc không thoát, màn ra đồ hiếm và các bước hướng dẫn khác chờ. Tinh thể quà được lưu ngay khi nhận nên tải lại trang không nhận hai lần; nếu đã tiêu số tinh thể đó thì được bù đủ giá Earth. Số trong `decor.json` (`guide`). Lưu ý: mô phỏng cho thấy Sao chổi đầu tiên có ở khoảng giây 44, nên bước này thực tế rơi vào phút thứ 1–2, ngay sau hướng dẫn đầu game và lần mua đầu. Đủ chỗ cho 15 vật phẩm ở khung 16:9 và màn dọc 9:16; vật phẩm nào không còn chỗ (ví dụ khi nút Auto hoặc đồng hồ lượt tính giờ hiện ra) tạm dời sang chỗ trống gần nhất, vị trí đã lưu không đổi.
11. Bảng đầy (quyết định 12/10): khi bảng đầy, không còn cặp ghép và không mua được ô (đã max hoặc chưa đủ tiền), sau 4 giây hiện bảng "Board full" với: cho lõi ăn thiên thể yếu nhất (miễn phí), xem quảng cáo để làm việc đó với x5 năng lượng, về menu chính. Không có nút Restart: game không bao giờ kẹt thật (thiên thể thường luôn cho lõi ăn được, thiên thể ẩn bán được), còn restart lượt chính làm mất toàn bộ tiến trình. Bảng hiện một lần mỗi đợt kẹt.

Chủ đề:

- **Mặc định là vũ trụ:** nhấp để thu năng lượng, ghép từ bụi vũ trụ lên tới cấp cuối (ví dụ thiên hà), sưu tầm các biến thể theo độ hiếm.
  - Tag Space trên CrazyGames có 63 game.
  - Không trùng game #2.
  - Hợp tuổi 10–20 và cả người lớn.
- **Phương án 2:** phép thuật / độc dược (tag Magic có 48 game).
- Đây là quyết định ít dữ liệu nhất. Nội dung ở dạng dữ liệu nên đổi chủ đề không phải viết lại code.

Phạm vi v1 (con số ước lượng, chỉnh theo mô phỏng):

- 1 màn chơi, bảng 4×4 ô: mở sẵn 8 ô, mỗi cấp Orbit Ring thêm 1 ô, 8 cấp, tới 16 ô (yêu cầu người dùng 12/10; trước đó 2 cấp, mỗi cấp +4 ô). Giá Orbit Ring nhân đôi tối 12/10 (yêu cầu người dùng): 25K, 50K, 100K, 200K, 8M, 18M, 40M, 90M. Rạng sáng 13/10 tăng tiếp theo yêu cầu người dùng (cấp 1 ×5, cấp 2 ×8, cấp 3 ×10, cấp 4 ×12, các cấp sau ×14, ×16, ×18, ×20): 125K, 400K, 1M, 2,4M, 112M, 288M, 720M, 1,8B. Trưa 13/10 (người dùng): Orbit Ring bắt đầu từ 10M, tăng dần, chỉ hiện khi có Mặt trăng lần đầu; chọn mỗi cấp khoảng ×2,2: 10M, 22M, 48M, 105M, 230M, 510M, 1,1B, 2,5B (mọi cấp đắt hơn bảng trước; ×2,5 thì cấp 8 tới phút 50, sát lúc về đích). Chiều 13/10 (người dùng): cấp 2–4 ×3, cấp 5–6 ×6, cấp 7–8 ×10: 10M, 66M, 144M, 315M, 1,38B, 3,06B, 11B, 25B. Vì Core Focus mạnh hơn 1,5 lần, tàu thu bị mua sớm ở phút 2:30; để giữ mốc phút 4–5, Probe Fleet cấp 1–3 tạm tăng lên 750K, 1M, 1,4M. Sau đó (13/10, người dùng) Probe Fleet cấp 1 về 350K, cấp 2 trở lên bằng 120% giá lúc đó: 1,2M, 1,68M, 2,28M, 6M, 16,8M… Mô tả Supernova Tap đổi thành "Higher chance to earn 6x on a tap". Để tàu thu vẫn mở ở phút 4–5, cấp 1 Probe Fleet tăng từ 130K lên 160K
- 12 dòng nâng cấp, 102 cấp (bỏ Ion Thrusters 11/10; Lean Optics hạ giá; Orbit Ring thành 8 cấp 12/10). Đổi theo yêu cầu người dùng chiều 12/10: Chiều 13/10 (người dùng): Lean Optics thêm 3 cấp mở sau Thiên hà (11 cấp, trước Thiên hà tối đa 8; giá cấp 9–11: 100B, 280B, 750B). Giá Core Focus từ cấp 21 và Probe Fleet từ cấp 16 giảm, tăng ×1,8 mỗi cấp thay vì khoảng ×2,2: Core Focus cấp 21–25: 215B, 390B, 700B, 1,25T, 2,25T (trước 260B, 570B, 1,25T, 2,75T, 6T); Probe Fleet cấp 16–20: 195B, 350B, 630B, 1,1T, 2T (trước 240B, 540B, 1,2T, 2,64T, 6T). Chiều 13/10 lần 2 (người dùng: giảm giá Probe Fleet từ cấp 14): mỗi cấp ×1,6 tính từ cấp 13 (21,6B): cấp 14–20 là 35B, 55B, 88B, 140B, 230B, 360B, 580B. Mô phỏng chơi tiếp sau Thiên hà (lượt chính, người chơi giữ lại 1 Thiên hà để lấy sức mạnh, ghép các Thiên hà dư thành thiên thể ẩn): mọi cấp sau Thiên hà mua xong trong khoảng 7 phút (giá cũ khoảng 10 phút), vì bảng đầy Thiên hà làm thu nhập tăng khoảng 270 lần sau 30 phút; thiên thể ẩn thứ 5 ở phút 33 sau Thiên hà. Nếu người chơi ghép luôn Thiên hà duy nhất thì thu nhập giảm khoảng 100 lần (thiên thể ẩn không cho sức mạnh) và trong 2 giờ chỉ lên được Core Focus cấp 19. Chiều 13/10 (người dùng): Core Focus và Probe Fleet mạnh hơn 20% ở mọi cấp (Core Focus cấp 1 ×2,7 thay vì ×2,25, mỗi cấp sau vẫn ×1,5; Probe Fleet cấp 1 72 thay vì 60). Chiều 13/10 lần 4 (người dùng): Core Focus, Probe Fleet mạnh thêm 20% ở mọi cấp (cấp 1 Core Focus ×3,24, Probe Fleet 86,4). Chiều 13/10 lần 5 (người dùng): Core Focus mạnh thêm 30% ở mọi cấp (cấp 1 ×4,212, mỗi cấp sau vẫn ×1,5). Tối 13/10 (người dùng): Core Focus cấp 21–25 và Probe Fleet cấp 16–20 cho ít hơn 20% so với trước; giá Gravity Lens cấp 8–10 ×2 (1,6B, 3,6B, 8B); Binary Merge cấp 5 ×2 (10,8B); Orbit Ring cấp 5–6 ×2, cấp 7–8 ×4 (2,76B, 6,12B, 44B, 100B); Supernova Tap rẻ hơn 40% ở mọi cấp (mức do Claude chọn: 220K, 3,1M, 23M, 170M, 960M, 3B, 8,4B, 24B; mức tăng giá ×2 của Gravity Lens và Binary Merge cũng do Claude chọn). Nâng cấp miễn phí qua quảng cáo hồi 265 giây thay vì 300 (xuất hiện nhiều hơn khoảng 13%). Stellar Luck và Gravity Lens tăng nhiều ở cấp 1–3, các cấp sau ít dần, giữ nguyên mức cuối: Stellar Luck trọng số Rare trở lên ×1,43 / 1,81 / 2,14 / 2,43 / 2,66 / 2,84 / 2,95 / 3 (trước +0,25 mỗi cấp); Gravity Lens tỉ lệ bụi sao 89,6% / 80,2% / 71,6% / 64% / 57,2% / 51,5% / 46,8% / 43,4% / 41% / 40% ở cấp 1–10 (trước giảm đều 6% mỗi cấp), các cấp thiên thể lớn hơn chia theo tỉ lệ 3:2:1 như cũ.
  - Bỏ Deep Scanner. Gravity Lens 10 cấp, quét chỉ ra tối đa cấp 4 (Sao chổi). Tỉ lệ cấp 1/2/3/4 của một lần quét: cấp lens 0 là 100/0/0/0%, cấp 10 là 40/30/20/10%, tăng đều theo từng cấp.
  - Bỏ Probe Bay. Probe Fleet cấp 1 mở tàu thu (tự kiếm năng lượng không cần nhấp), các cấp sau nhân thu nhập tàu thu, tối đa 15 cấp. Core Focus chỉ cho nhấp tay, tối đa 20 cấp.
  - Lean Optics, Supernova Tap tối đa 8 cấp. Stellar Luck +25% trọng số Rare trở lên mỗi cấp, 8 cấp. Star Magnet sao băng xuất hiện nhiều hơn 8% mỗi cấp, 8 cấp.
  - Trọng số gốc của Rare trở lên giảm 1/6, để tỉ lệ khi Stellar Luck tối đa giữ như trước.
  - Tối 12/10: Orbit Ring, Lean Optics, Probe Fleet hiện ra khi có Tiểu hành tinh (cấp 3) thay vì Sao chổi (trưa 13/10: Orbit Ring đổi sang hiện khi có Mặt trăng, cấp 5). Trước khi có Thiên hà, Core Focus chỉ lên tới cấp 17 và Probe Fleet tới cấp 13; các cấp 18–20 và 14–15 mở sau khi có Thiên hà (13/10: nâng tối đa sau Thiên hà lên Core Focus cấp 25, Probe Fleet cấp 20; cấp 1 Core Focus nhân 2,25, mỗi cấp sau ×1,5, tức mọi cấp mạnh hơn trước 1,5 lần, theo yêu cầu người dùng) (`capBeforeGoal` trong `upgrades.json`, tính theo từng lượt nên lượt tính giờ cũng vậy). Thẻ ở mức chặn hiện cấp hiện tại (không ghi MAX) và dòng "More levels after your Galaxy". Stellar Luck ghi "Rarer bodies from scans and merges" (13/10: tăng tỉ lệ ở cả Scan, Merge, Lucky Scan và ghép thiên thể ẩn, không đổi bảo hiểm Epic/Legendary; chữ cũ "when scanning" nói thiếu. Người dùng đồng ý "Rare bodies more often from scans and merges", nhưng câu đó phải thu chữ xuống 17px trên điện thoại dọc trong khi các thẻ khác 22px, nên dùng câu ngắn hơn cùng nghĩa, vừa 22px).
  - Mô tả nâng cấp (sửa tối 12/10): câu ngắn, không ghi số, chỉ nói tác dụng bằng lời người mới hiểu được, tránh thuật ngữ của người làm game (ví dụ "Each tap gives more energy", "Probes earn energy for you", "Bigger bodies from scans"). Thẻ Lucky Scan ghi "Lucky scan for free!". Ở bộ sưu tập và thẻ thiên thể cũng bỏ từ khó: "rolls" thành "scans or merges", "Tier" thành "Stage". Bảng nâng cấp giữ thứ tự cố định (thứ tự trong `upgrades.json`): bấm mua chỉ tăng cấp, thẻ không đổi chỗ (yêu cầu người dùng 11/10)
- 10 cấp ghép × 5 bậc hiếm = 50 thiên thể sưu tầm, hiện tỉ lệ. Thiên thể mới không cộng năng lượng (chiều 13/10, người dùng: bỏ thưởng bộ sưu tập để lượt chơi đầu bằng lượt tính giờ; trước đó mỗi thiên thể mới cộng +2% đến +15% năng lượng vĩnh viễn ở lượt chính, khoảng 30 thiên thể là gần gấp đôi, nên lượt chơi đầu nhanh gần gấp đôi lượt tính giờ mà người dùng không biết). Bộ sưu tập giờ chỉ để sưu tầm. Chiều 13/10 (người dùng): năng lượng mỗi thiên thể trên bảng góp vào mỗi lần nhấp giảm 50% cho mọi cấp và độ hiếm (`economy.bodyValueScale` 0,5); phần 1 của bảng trống giữ nguyên. Chiều 13/10 lần 4 (người dùng: các cấp không cách xa nhau quá, chơi nhanh lúc đầu, chậm về sau): mỗi cấp gấp 2,5 lần cấp trước thay vì 3 lần, `bodyValueScale` 1,493 để Khí khổng lồ (cấp 7) giữ nguyên; Bụi sao gấp 3 lần trước, Mặt trăng ×1,44, Hố đen ×0,69, Thiên hà ×0,58. Vẫn trên 2 lần để mỗi lần ghép tăng năng lượng (2 mảnh thành 1 mảnh giá trị 2,5). Mô phỏng 60 lượt không quảng cáo: Hành tinh phút 6 (trước 9,7), Ngôi sao phút 22,6 (trước 28,3), từ Ngôi sao tới Thiên hà 50 phút (trước 38,5). Claude thử thêm điểm giữ nguyên ở cấp 6 (về đích 84 phút) và cấp 8 (55 phút, phần cuối không chậm hơn); chọn cấp 7
- Đích cuối là tạo ra cấp cao nhất. Không cần đủ bộ sưu tập; các biến thể hiếm còn thiếu là lý do quay lại.
- Thời gian về đích (người nhấp đều, trung vị): dưới 60 phút cả khi xem và khi không xem quảng cáo (quyết định 13/10, người dùng; trước đó 45–60 phút có quảng cáo, 70–90 phút không quảng cáo) (mục 4.5). Mô phỏng 200 lượt ngày 12/10 sau khi đổi Orbit Ring: trung vị 73 phút không quảng cáo, 48 phút có xem quảng cáo, 40 phút ở Basic Launch (trước khi đổi: 69, 46, 40). Sau đợt sửa nâng cấp chiều 12/10 (giá quét 0,0059 × n^6,25): 68 phút không quảng cáo, 56 phút có xem quảng cáo, 44 phút ở Basic Launch; tàu thu mở ở phút 4; người nhấp đều về đích sớm hơn người thi thoảng nhấp 36%. Số lần ghép tăng từ khoảng 106 lên 168 mỗi lượt, vì quét chỉ ra tối đa cấp 4. Sau đợt đổi tối 12/10 (nâng cấp hiện từ Tiểu hành tinh, giới hạn cấp trước Thiên hà): 68 / 56 / 44 phút, gần như không đổi; tàu thu mở ở phút 4; người nhấp đều về đích sớm hơn 35%. Mô phỏng không tính thời gian của hướng dẫn trang trí (khoảng 20–30 giây). Sau khi nhân đôi giá Orbit Ring và đưa Probe Fleet cấp 1 lên 160K (20h 12/10): 68 / 53 / 44 phút; tàu thu mở ở phút 4:04; Orbit Ring cấp 1 mua ở phút 1:24 (trước là 0:59); người nhấp đều về đích sớm hơn 31%. Sau đợt đổi rạng sáng 13/10 (Orbit Ring đắt hơn nhiều, Core Focus ×1,5 mọi cấp, Probe Fleet cấp 1 750K): 58 / 49 / 41 phút; tàu thu mở ở phút 4:11; người nhấp đều về đích sớm hơn 41%; nhấp đều cho thêm khoảng 130% thu nhập so với chỉ để auto (trước khoảng 87%). Không quảng cáo 58 phút là dưới mốc 70–90 phút cũ; người dùng chốt mục tiêu mới dưới 1 giờ cho cả hai. Sau khi Probe Fleet cấp 1 về 350K và cấp 2 trở lên ×1,2 (13/10): 60 / 52 / 42 phút (đạt mục tiêu, không quảng cáo sát mốc 60); tàu thu mở ở phút 3:08 (dưới mốc 4–5); người nhấp đều về đích sớm hơn 47% (mốc 30–40%); khoảng dài nhất giữa hai thứ mới trong 10 phút đầu 3:17 (trước 2:15, mốc 1–2 phút). Auto Scanner hiện khi có Khí khổng lồ (khoảng phút 10:30), Gravity Well hiện khi có Ngôi sao (khoảng phút 19:20, mua khoảng phút 32) Sau khi Orbit Ring từ 10M và hiện khi có Mặt trăng (trưa 13/10, 200 lượt): 59 / 52 / 41 phút, gần như không đổi (thử 4 bảng giá ×1,6 đến ×2,5 với 100 lượt: không quảng cáo 56–64 phút, chênh nhau trong mức nhiễu); Orbit Ring cấp 1 mua ở phút 9 (trước 2:15), cấp 8 ở phút 40; tàu thu mở ở phút 2:47; người nhấp đều về đích sớm hơn 47%; khoảng dài nhất giữa hai thứ mới trong 10 phút đầu 2:51. Sau khi giảm sao băng 30%, thưởng ghép mảnh hiếm 10–20%, bản sao quảng cáo chỉ tới Tiểu hành tinh (trưa 13/10, 200 lượt): 71 / 59 / 49 phút; **không quảng cáo vượt mục tiêu 60 phút**, có xem quảng cáo sát mốc. Tách từng thay đổi (100 lượt, so với 56 / 52 phút): sao băng −30% thành 72 / 57 (nguyên nhân chính, sao băng chiếm phần lớn thu nhập khi nhấp đều), thưởng ghép thành 62 / 52, bản sao quảng cáo thành 52 phút (có quảng cáo). Đã báo người dùng, chờ chọn: chấp nhận khoảng 70 phút khi không xem quảng cáo, hoặc bù (thử 100 lượt: giá Core Focus −30% thì 61 / 56; thu nhập Probe Fleet +25% thì 64 / 52). Tàu thu mở ở phút 3:14; người nhấp đều về đích sớm hơn 45%; khoảng dài nhất giữa hai thứ mới trong 10 phút đầu 3:15. Chiều 13/10 (sao băng 8 giây, dày hơn 40% trước Thiên hà; Lean Optics, giá cấp cao Core Focus và Probe Fleet; 200 lượt): lượt tính giờ 61 / 50 / 42 phút; không quảng cáo sát mốc 60. **Phát hiện quan trọng:** từ trước tới nay mô phỏng đo lượt tính giờ, không có thưởng bộ sưu tập. Lượt chính đầu tiên của người mới (có thưởng bộ sưu tập, mỗi thiên thể mới +2% đến +15% năng lượng vĩnh viễn, khoảng 30 thiên thể là gần gấp đôi) chỉ mất 33 / 33 / 26 phút. Báo cáo mô phỏng giờ hiện cả hai. Chờ người dùng chốt mục tiêu dưới 60 phút áp cho lượt nào. Tàu thu mở ở phút 2:48; người nhấp đều về đích sớm hơn 43%; khoảng dài nhất giữa hai thứ mới trong 10 phút đầu 3:00. Người dùng chốt (chiều 13/10): bỏ thưởng bộ sưu tập, nên lượt chơi đầu bằng lượt tính giờ. Sau đợt chiều 13/10 (bỏ thưởng bộ sưu tập; Core Focus, Probe Fleet +20%; sao 4–8 giây, 20% đợt có 2 sao): 30 / 32 / 25 phút, xem quảng cáo còn chậm hơn không xem vì sao băng cho nhiều hơn phần thưởng quảng cáo. Sau đợt cuối chiều 13/10 (Orbit Ring ×3/×6/×10, độ hiếm khi ghép 50/50, Probe Fleet cấp 14+ rẻ hơn, Scan sau Thiên hà tăng chậm 4 lần; 200 lượt): **38 / 36 / 30 phút**, lượt chơi đầu giống hệt; tàu thu mở ở phút 2:14 (mốc 4–5 phút); Orbit Ring cấp 1 ở phút 6:21, đa số lượt chưa lên cấp 8 trước khi về đích; người nhấp đều về đích sớm hơn người thi thoảng nhấp 44%; khoảng dài nhất giữa hai thứ mới trong 10 phút đầu 2:50; khoảng 310 sao băng mỗi lượt không quảng cáo. Sau Thiên hà (mô phỏng giữ 1 Thiên hà): mọi cấp mua xong trong khoảng 6 phút. Sau đợt chiều 13/10 lần 3 (sao −30% trước Thiên hà, ×3 sau Thiên hà; năng lượng thiên thể trên bảng −50%; thiên thể ẩn có năng lượng; 200 lượt): **103 / 72 / 58 phút**, không quảng cáo và có quảng cáo vượt xa mục tiêu 60 phút. Tách (100 lượt, so với 38 / 36): chỉ giảm sao thành 47 / 44; chỉ giảm bảng 50% thành 77 / 64; giảm bảng 25% cùng giảm sao thành 60 / 53 / 45. Tàu thu mở ở phút 4:58 (lần đầu vào mốc 4–5 phút từ khi có sao 4–8 giây); quảng cáo giờ giúp nhanh hơn rõ (72 so với 103 phút). Người thi thoảng nhấp không về đích trong 3 giờ ở gần một nửa số lượt. Đã báo người dùng, chờ chọn giữ 50% hay giảm còn 25%. Người dùng không chọn A/B mà đổi tiếp (chiều 13/10 lần 4: Stellar Luck, Gravity Lens tăng mạnh ở cấp đầu; các cấp gần nhau hơn, mốc giữ nguyên ở Khí khổng lồ; thiên thể ẩn +10% Thiên hà gốc; Core Focus, Probe Fleet +20%; 200 lượt): **69 / 53 / 45 phút**; có quảng cáo và Basic Launch đạt mục tiêu, không quảng cáo vượt khoảng 9 phút. Tàu thu mở ở phút 2:30 (lại sớm hơn mốc 4–5 phút vì các cấp thấp mạnh hơn); Hành tinh phút 6, Hố đen phút 39; người nhấp đều về đích sớm hơn người thi thoảng nhấp 46%; khoảng dài nhất giữa hai thứ mới trong 10 phút đầu 2:35.
- Trong 10 phút đầu mỗi phần thưởng cách nhau tối đa 10–20 giây (mục 4.3)
- Hướng dẫn theo bước (mục 4.2); phím Space để nhấp trên máy tính. Sau lần ghép đầu tiên trong hướng dẫn có bảng "First merge!" (yêu cầu người dùng 12/10): thiên thể vừa ghép ở đủ 5 độ hiếm, mỗi độ hiếm kèm số biểu tượng năng lượng tăng dần (không ghi số), và câu "thiên thể càng hiếm càng cho nhiều năng lượng để quét tiếp, lần quét hay lần ghép nào cũng có thể ra đồ hiếm". Đóng bảng thì hướng dẫn chạy tiếp
- Phần trên của màn chơi (yêu cầu người dùng 12/10): dưới số năng lượng là một dòng "+x per tap · +y/s" (chỉ có phần per tap khi chưa có tàu thu); chuỗi 10 cấp hiện thành 2 hàng 5 thiên thể, to khoảng gấp 1,3 lần trên điện thoại và 1,5 lần trên máy tính so với 1 hàng trước đó; sửa 20h 12/10 cho thiên thể có vành (Khí khổng lồ, Hố đen) không chạm nhau, và trên máy tính lõi nhỏ lại để nút Auto vẫn nằm trong khung 720
- **Nút Auto Scan và Auto Merge (chiều 13/10, người dùng):** hai nút bật/tắt riêng nằm dưới nút Scan, mỗi nút hiện khi đã mua nâng cấp tương ứng, chữ hai dòng (tên, On/Off), xanh khi bật. Trên điện thoại dọc, khi có nút Auto thì nút Scan dịch lên khoảng 66 đơn vị và bảng nhỏ lại tương ứng; trước đó nút Auto Scan nằm cạnh nút Scan. Trên máy tính hai nút nằm cạnh nhau dưới Scan trong cột trái. Tắt Auto Merge để giữ cặp (ví dụ để ghép thiên thể ẩn); có một bước hướng dẫn khi mua Auto Merge lần đầu.
- Chế độ chơi lại tính giờ: bắt đầu từ 0, không có thu nhập offline và quà ngày. Kỷ lục chỉ tính ở chế độ này. Bảng kỷ lục cá nhân trên máy lưu 5 lượt nhanh nhất (thời gian, độ hiếm Thiên hà, ngày), hiện ở màn về đích và bảng Timed run (yêu cầu người dùng 12/10); `bestRunMs` là chỉ số nộp bảng xếp hạng online khi được mời. Trong lúc chơi lượt tính giờ, tàu thu của lượt chính vẫn kiếm (nhận ở màn chào mừng khi quay về).
- Thu nhập khi vắng mặt, quà hằng ngày (năng lượng và tinh thể, chuỗi 7 ngày, x2 bằng quảng cáo). Tính theo ngày lịch trên máy người chơi, không theo số lần vào game: mỗi ngày nhận một lần; nhận ngày hôm sau thì lên ngày tiếp theo của chuỗi; bỏ một ngày thì về ngày 1; hết 7 ngày quay lại ngày 1 (kiểm tra 13/10)
- Menu: người chơi đã có save vào màn menu (Continue, Timed run, bộ sưu tập, cửa hàng trang trí, kỷ lục; quà ngày hiện ở đây). Trong màn chơi có nút menu ở góc trên mở cùng các mục đó. Về menu không chèn quảng cáo giữa chừng (CrazyGames cấm gắn quảng cáo vào nút điều hướng)
- Chạm vào một thiên thể để xem tên, độ hiếm, ghép ra gì; thiên thể ẩn có nút bán
- Quảng cáo có thưởng: nâng cấp miễn phí (gắn trên món đắt nhất chưa mua được, trong tầm 2,5 phút thu nhập; cấp đầu của Probe Fleet, tức là mở tàu thu, không nhận bằng quảng cáo), lượt quét may mắn (cao hơn 1 cấp so với một lần quét thường, ít nhất Rare; hồi 4 phút từ 12/10; trưa 14/10, người dùng: khi portal tắt quảng cáo như trong Basic Launch, quét may mắn vẫn hồi 4 phút, không nhân 1,5 như các nút thưởng khác, vì 6 phút là quá lâu: `rewarded.luckyScan.freeCooldownMult` 1), thêm 1 bản sau khi ghép (tới cấp Khí khổng lồ; từ trưa 13/10 chỉ tới Tiểu hành tinh), x2 thu nhập khi vắng mặt, x2 quà ngày, x5 năng lượng ở bảng Board full, 15 tinh thể ở cửa hàng trang trí. Đã bỏ "ghép tất cả" (yêu cầu người dùng 11/10). Mỗi nút hồi 5 phút (mục 3). Quảng cáo giữa chừng chỉ lúc về đích và lúc bắt đầu lượt chơi lại. Vị trí (quyết định 11/10, theo quy định CrazyGames ở mục 4.5): nâng cấp miễn phí gắn trên thẻ nâng cấp; một thẻ thưởng ở đầu bảng nâng cấp đưa ra "thêm 1 bản" (8 giây sau mỗi lần ghép) hoặc quét may mắn, có biểu tượng video và đồng hồ khi đang hồi (một thẻ thay vì nhiều nút, để dải nâng cấp trên điện thoại vẫn còn chỗ cho nâng cấp); x2 nằm ở màn quà. Không có nút thưởng ở vùng thao tác chính (lõi, bảng ghép, nút Scan).
- Phần A mục 5c: RNG có seed, sự kiện khoảnh khắc, màn ra đồ hiếm "lên hình", `?clean`.
- Số kinh tế nằm trong `src/content/*.json`; báo cáo mô phỏng ở mục 10.
- Tiếng Anh. Chuỗi chữ để trong file ngôn ngữ để sau thêm tiếng Nga và tiếng Thổ Nhĩ Kỳ khi lên Yandex.

Không làm ở v1: prestige nhiều tầng, nhiều thế giới, bảng xếp hạng online, IAP, đa ngôn ngữ.

## 5. Game #2: tycoon 2D, quán cozy do thú vận hành

Đường phát hành: thử Poki trước (mục 1, 3). Vì vậy game #2 phải đạt yêu cầu của Poki ngay từ v1: tải ban đầu dưới 8 MB, chơi tốt trên điện thoại và máy tính bảng, khung 16:9 phủ toàn canvas, không request ra ngoài, không link ra ngoài, giữ người chơi trên 3 phút (ngưỡng Player Fit Test).

Vòng lặp chính:

1. Khách vào quán.
2. Phục vụ: đầu game người chơi tự chạm để làm món và đưa món.
3. Thu tiền.
4. Nâng cấp quầy, thêm món mới.
5. Nhận nuôi thú làm nhân viên để tự động hoá.
6. Mở khu mới.
7. Chạm đích cuối.

Các yếu tố riêng:

- **Áp lực nhẹ:** khách chờ lâu thì bỏ về. Nhờ vậy thao tác tay vẫn có ý nghĩa trong những phút đầu.
- **Sưu tầm:** thú nhân viên có độ hiếm và kỹ năng riêng (làm nhanh hơn, khách tip nhiều hơn). Tỉ lệ công khai.
- **Tuỳ biến:** trang trí quán (đồ nội thất, màu sắc), có bonus nhỏ.
- **Đích cuối:** mở đủ các khu hoặc đạt 5 sao. Chế độ chơi lại là thử thách tính giờ.
- **Hình ảnh:** 2D, nhìn từ trên xuống hoặc nhìn ngang. Phong cách cozy, dễ thương nhưng không trẻ con (quán mèo, quán capybara, không làm nhà trẻ thú cưng).

Phạm vi v1 (ước lượng):

- 1 quán, 3 khu mở dần
- 4–6 món
- 8–12 thú
- 10–15 đồ trang trí

Dùng lại từ game #1: kinh tế, lưu tiến trình, quảng cáo (có thời gian hồi nút thưởng), UI, định dạng số, quà hằng ngày, thu nhập khi vắng mặt, RNG theo trọng số có bộ đếm bảo hiểm (cho thú có độ hiếm), bộ đọc nội dung JSON.

Không làm ở v1: nhiều quán, nhiều người chơi, IAP.

Vì sao chọn thể loại tycoon:

- Hai lần đo trên CrazyGames (10/10 và 11/10) cho cùng kết quả. Trong số game mới:
  - Tycoon/quản lý: khoảng 4 trên 7 lọt Hot
  - Clicker/idle: khoảng 2 trên 10–12
  - Hành động: 0 trên 11–12
- Ngày 11/10, khoảng 7 trên 22 game Hot là tycoon, quản lý hoặc mô phỏng cửa hàng.
- Trên Poki:
  - Top 60 có khoảng 5 game tycoon, không có clicker thuần nào.
  - Office Manager đứng đầu tag Tycoon.
- Ít đối thủ theo tag CrazyGames: Tycoon 97, Management 229 (so với Idle 521, Incremental 461).
- Đồ hoạ 2D vẫn lọt Hot được: Office: Company Tycoon là game 2D, ra 10/2026 và đang Hot.

Vì sao chọn chủ đề thú cute:

- Ít đối thủ: tag Pet 12 game, Cat 59.
- Quán do thú vận hành có trong top tag:
  - Poki: Cat Pizza, Platypus Coffee
  - CrazyGames: Capy Cafe, Cat Bakery
- Idle Pet Business (ra 9/2022) vẫn được 9,4 điểm.
- Cùng họ với trend thú cưng và sưu tầm (Adopt Me khoảng 315 nghìn người chơi đồng thời trên Roblox, 6/2026).

Rủi ro:

- Chưa có game thú cưng nào trong Hot. Tag Pet ít game có thể vì ít người chơi.
- Nếu chủ đề thú không ổn, đổi sang văn phòng hoặc cửa hàng thường, giữ nguyên code.

Dự phòng nếu tycoon quá sức trong một tuần: câu cá nâng cấp 2D.

- Tag Fishing chỉ có 27 game; Tiny Fishing (12/2020) vẫn trong Hot.
- Độ phức tạp thấp.
- Nhược điểm: gần với game #1, và Tiny Fishing đang chiếm đỉnh.

Đã bỏ lái xe một nút khỏi vai trò dự phòng: nhiều đối thủ (Car 392) và không game mới nào lọt Hot.

### 5a. Thiết kế v1 game #2 (chiều 14/10, chat phát triển game #2)

Người dùng chọn (14/10): nhiều loài thú, nhìn ngang mặt cắt quán, chạm món rồi chạm khách. Tên: **Tiny Tails Cafe Tycoon** (người dùng chọn 14/10). Tên tạm trước đó "Critter Cafe Tycoon" bị bỏ vì trùng gần hoàn toàn với Critter Café (game quản lý quán cà phê thú của Secret Mode/Sumo Digital, Switch và PC, 11/2024). Tìm nhanh 14/10 không thấy game nào tên Tiny Tails Cafe. Mọi số nằm trong `src/content/*.json`, logic trong `src/logic/cafe.ts` (không dùng Phaser), mô phỏng `npm run sim` / `npm run sim:quick`.

- **Quán 3 tầng** xếp chồng, mỗi tầng 2 món, 2–4 chỗ khách (mua thêm chỗ): Coffee (cà phê, trà), Bakery (croissant, bánh kem, mở 60K), Dessert Bar (kem, trà sữa, mở 15M). Khách vào từ cửa trái, đứng chờ trước quầy, bong bóng hiện món và vòng kiên nhẫn (22 giây gốc). Hết kiên nhẫn thì bỏ về, không trả tiền.
- **Thao tác:** chạm máy để bắt đầu làm món (đang làm thì mỗi chạm đẩy nhanh), món xong nằm trên quầy (tối đa 2), chạm khách để đưa. Khách được phục vụ bằng tay trả ×1,5 (`handBonus`), nâng cấp Friendly Smile cộng thêm.
- **Thú nhân viên:** 10 loài (Common: capybara, hamster, bunny, cat; Rare: shiba, penguin, koala; Epic: red panda, panda; Legendary: axolotl), tỉ lệ 62 / 28 / 8,5 / 1,5%, bảo hiểm Epic trở lên trong 12 lần, Legendary trong 50 lần. Mỗi máy một con, tự làm và tự bưng món; con mạnh nhất tự vào máy có món đắt nhất. Thú chờ 1,2 giây (`staff.pickupDelay`) mới bưng món, để người chạm nhanh vẫn giành được khách. Còn máy trống thì lần nhận nuôi luôn ra con chưa có (nếu độ hiếm đó còn); con trùng lên cấp (tối đa 5), đủ cấp thì hoàn nửa giá. Lần nhận nuôi đầu là capybara theo hướng dẫn. Kỹ năng: làm nhanh hơn hoặc khách tip nhiều hơn.
- **Khách VIP** (vàng, từ khách thứ 15, mỗi 35–60 giây): thú không phục vụ, chỉ nhận phục vụ bằng tay; thưởng khoảng 12 giây thu nhập và 3 tim.
- **Nâng cấp:** mỗi món tăng cấp (giá ×1,17–1,19 mỗi cấp, mốc 10/25/50/75/100 nhân giá trị, 25 và 75 còn tăng tốc); mở món, mở tầng, thêm chỗ; Friendly Smile, Quick Hands (chỉ tăng thao tác tay), Cozy Sign (khách đến dày hơn), Comfy Chairs (kiên nhẫn), Tip Jar, Staff Training, Pantry (giờ thu nhập offline).
- **Đích 5 sao, theo thứ tự:** phục vụ 20 khách → mở Bakery → 4 nhân viên → mở Dessert Bar → Bubble tea cấp 25. Sau đó chơi tiếp hoặc lượt tính giờ (như game #1).
- **Tim:** khách vui (còn từ 50% kiên nhẫn) cho 1 tim; dùng cho trang trí (chưa làm).
- **Quảng cáo có thưởng (dự kiến):** Rush Hour (khách trả ×2 trong 60 giây), nhận nuôi miễn phí, x2 offline, x2 quà ngày; hồi 5 phút. Quảng cáo giữa chừng của Poki chỉ ở điểm nghỉ (mở tầng, về đích, vào lại từ menu); cấu hình theo portal vì CrazyGames cấm gắn vào nút điều hướng.
- **Hình ảnh:** vẽ bằng Canvas 2D thành texture (`src/render/animals.ts`, `src/render/cafe.ts`), viền nâu ấm, thú chibi nhìn thẳng; nhân viên đeo tạp dề, khách quàng khăn. Mẫu đã gửi người dùng 14/10.
- **Mô phỏng lần 1 (40 lượt, 14/10):** người chạm đều, không quảng cáo: về đích 47 phút (p10–p90 43–52); nhân viên đầu tiên phút 4:08; Bakery phút 12; Dessert phút 31. Có xem quảng cáo 45 phút; Basic Launch 39 phút. Người ít chạm khi đã có thú: 98 phút, tức người chạm đều nhanh hơn khoảng 52% (mốc 30–40%, cần chỉnh).
- **Mô phỏng sau khi chỉnh (30 lượt, chiều 14/10):** thú nhanh hơn (Common 0,8, Rare 1,05, Epic 1,35, Legendary 1,75), thú chờ 1 giây mới bưng món. Người chạm đều: 56 phút không quảng cáo, 56 có quảng cáo, 50 ở chế độ không quảng cáo mà vẫn thưởng; nhân viên đầu tiên phút 4:08, Bakery 13:52, Dessert 42:19. Người ít chạm 97 phút, tức người chạm đều nhanh hơn khoảng 42% (mốc 30–40%). Quảng cáo gần như không rút ngắn thời gian về đích (Rush Hour ×2 trong 60 giây mỗi 5 phút); chờ số liệu thật.
- **Bản chơi thử 1 (chiều 14/10):** artifact bản chơi thử game #2 (mục 10). Đã có: 3 tầng, hướng dẫn theo bước (pha cà phê, đưa khách, nâng cấp, mở trà, nhận nuôi thú, VIP, mở Bakery, Rush Hour), bảng nhận nuôi có tỉ lệ, bảng Staff (tỉ lệ, bảo hiểm, bóng đen cho thú chưa gặp), menu, Decor (12 món, mỗi món +3% tip, xem trước hình), quà 7 ngày (xu, tim, thú miễn phí), thu nhập khi vắng mặt, màn 5 sao, lượt tính giờ và kỷ lục, màn Home cho người đã có save, âm thanh riêng (coin, pop, sad). Quán dừng khi có bảng mở để khách không bỏ về lúc người chơi đang đọc. Quà ngày không tự mở trong hướng dẫn đầu game. Build Poki 1,72 MB; adapter Poki thử với SDK giả: init → gameLoadingFinished → gameplayStart; quảng cáo có thưởng gọi gameplayStop → rewardedBreak → gameplayStart. Quảng cáo giữa chừng (Poki): khi Continue từ Home, mở tầng mới, bắt đầu lượt tính giờ; về đích ở mọi portal. 24 unit test (core + logic).
- **Sửa theo hướng dẫn Poki (rạng sáng 15/10, người dùng yêu cầu; đối chiếu `claude/Poki-Huong-dan.md`).** Các điểm game #2 chưa đạt và cách sửa:
  - Sự kiện SDK: `gameplayStart` chỉ gửi ở lần chạm đầu (trước đây gửi lúc vào scene); mở menu hoặc bảng nào cũng `gameplayStop`, đóng bảng quay lại chơi thì `commercialBreak` rồi `gameplayStart`. Bỏ quảng cáo giữa chừng lúc mở tầng mới (không phải điểm quay lại chơi).
  - Không tự đặt bộ đếm quảng cáo: bỏ hồi 5 phút của Rush Hour, nhận nuôi miễn phí, nâng cấp miễn phí, tim trong Decor; bỏ khoảng cách 180 giây giữa hai quảng cáo giữa chừng ở bản Poki. Ưu đãi hiện theo trạng thái game: Rush Hour khi không đang chạy; nhận nuôi miễn phí thay cho trả xu khi chưa đủ tiền; nâng cấp miễn phí trên thẻ chưa đủ tiền. Thay đổi này chỉ áp cho bản Poki; quy định hồi 5 phút ở mục 3 vẫn giữ cho game đường B.
  - Một loại tiền: bỏ tim. Đồ trang trí mua bằng xu, hoặc mở bằng quảng cáo có thưởng (kiểu "tùy biến" Poki khuyên). VIP chỉ thưởng xu.
  - Nút thưởng: không màu xanh lá (đổi sang tím), có biểu tượng video; ở màn quà khi quay lại và quà ngày, nút thường nằm trên và cùng cỡ nút thưởng. Quảng cáo lỗi hoặc bị chặn thì im lặng, không thưởng, không tự hiện thông báo (bản Poki).
  - Vùng nút Poki ở góc trên trái trên điện thoại: dời nút menu sang góc trên phải.
  - Vào thẳng gameplay: bản Poki bỏ màn Home cho cả người đã có save; mọi mục của Home (Staff, Decor, quà ngày, lượt tính giờ, kỷ lục) có trong menu ở góc trên phải. ESC mở/đóng menu (tạm dừng).
  - Build sạch: hộp debug chỉ có ở bản web; preset và hook test chỉ ở bản web. Chặn phím mũi tên, Space và con lăn cuộn trang.
  - Hướng dẫn ít chữ: câu 3–6 chữ, tay chỉ làm mẫu.
  - Thumbnail tĩnh 1:1 không chữ, tối thiểu 628 px, tránh màu gần `#83FFE7`.
  - Chưa làm (khuyến nghị, không bắt buộc): đa ngôn ngữ, thumbnail động (cần trước Global Release).
- **Đo nhịp chơi và bổ sung (sáng 15/10, người dùng yêu cầu chạy test một lượt đầy đủ, báo cáo kinh tế, đánh giá khả năng qua xét duyệt Poki).** Kết quả đo trước khi sửa (mô phỏng 40 lượt, `tools/sim/pacing.ts`): 3 phút đầu dày (mỗi phút 50–70 lần chạm, khoảng 20 lần đưa món, 6–14 lần mua, 2–5 thứ mới); chỗ yếu là phút 6–13 (từ con thú thứ hai tới Bakery không có thứ gì mới, mục tiêu sao kế tiếp cách 13 phút) và phút 22–42 (từ Cake tới Dessert Bar). Trong 3 phút đầu người chạm đều không có khách để phục vụ khoảng 30% thời gian. Lỗi: sao 2, 3, 4 (mở tầng, đủ 4 thú) không có hiệu ứng và thông báo vì sự kiện sao bị bỏ khi đạt bằng thao tác mua. Quyết định:
  - Sửa lỗi sự kiện sao.
  - Thêm **chuỗi nhiệm vụ ngắn** (`src/content/tasks.json`): mỗi lúc một nhiệm vụ (ví dụ "Coffee to Lv 25", "Serve 3 VIPs", "Buy a decoration"), xong thì chạm để nhận xu (12 giây thu nhập, tối thiểu 30 xu; 69 nhiệm vụ), cách nhau khoảng 1–2 phút ở 15 phút đầu; một nhiệm vụ chậm (ví dụ chờ VIP) không chặn chuỗi: nhiệm vụ đã xong trong 3 nhiệm vụ kế tiếp được nhận trước. Màn dọc: dòng thứ hai của thanh trên (mục tiêu sao chuyển xuống dưới hàng sao); màn ngang: đầu cột shop. Chạm khi chưa xong thì chỉ tới chỗ cần làm. Theo hướng dẫn Poki mục 8 (mục tiêu ngắn hạn và dài hạn, ăn mừng mốc).
  - Hiệu ứng và thông báo khi món lên mốc x2 (cấp 10, 25, 50...).
  - Bản Poki (không có bộ đếm quảng cáo): nâng cấp miễn phí dùng xong thì chỉ hiện lại sau 3 lần mua (`rewarded.afterBuys`), để ưu đãi không hiện lại ngay trên thẻ khác; Rush Hour và thú miễn phí giữ giới hạn theo trạng thái như trước. Đây là giới hạn theo trạng thái game (hướng dẫn Poki mục 7.1), không phải đồng hồ. Mô phỏng: cổng này gần như không đổi thời gian về đích; quảng cáo rút ngắn chủ yếu nhờ Rush Hour.
  - **Bẫy giữa game (phát hiện khi bot chơi hết lượt trên bản build, sáng 15/10):** người chơi mua ngay thẻ rẻ nhất mỗi khi đủ xu (không bao giờ để dành) dồn xu vào Coffee và Tea (giá rẻ nhưng mỗi cấp cho rất ít), thu nhập chững lại và không bao giờ đủ 25M mở Dessert Bar. Bot trên bản build dừng ở 3 sao từ phút 15 tới quá phút 28; mô phỏng cùng cách mua: Dessert Bar phút 59–71, về đích 74–86 phút (từ sao 3 tới sao 4 khoảng 50 phút). Quyết định: **mọi món tối đa cấp 50 cho tới khi mở Dessert Bar** (`cafe.levelCapBeforeLastFloor`; thẻ ghi "More levels after the Dessert Bar", giống cách game #1 chặn cấp trước Thiên hà), thêm nhiệm vụ "Open the Dessert Bar" (thanh tiến độ xu/giá), chuyển các nhiệm vụ Coffee 75, Tea 75 ra sau nhiệm vụ đó. Mô phỏng cách mua của bot (4 lượt, cap 50, Dessert Bar vẫn 25M): về đích khoảng 56 phút (Dessert Bar phút 41–43); 100 lượt với người "không để dành" trong `sim:pacing`: 64 → 48 phút; người chạm đều 36 phút, người mới 39 phút, người ít chạm 68 phút (chặn cấp cũng giúp người chơi khác vì xu không còn đổ vào món ít lời). Đã thử chỉ hạ giá Dessert Bar (15M, 20M): người không để dành vẫn mở ở phút 49–57.
  - **Lỗi rò bộ nhớ (phát hiện khi bot chơi hết lượt, trưa 15/10, có từ bản đầu):** mỗi khách tạo một texture mới vì khoá texture gồm số thứ tự khách (`scarf: look + id`), nên bộ nhớ tăng khoảng 1 MB mỗi giây; trình duyệt bị hệ thống tắt ở khoảng 4 GB sau 43 phút chơi (trên điện thoại sẽ sập sớm hơn nhiều). Sửa: khoá texture theo màu khăn (số màu có hạn). Đo 5 phút sau khi sửa: texture dừng ở 267, JS heap 60–70 MB, số node DOM không tăng. Bài học: bot chơi trọn lượt có ghi heap và số texture là bước bắt buộc trước khi nộp.
  - Thanh nhiệm vụ trên điện thoại bắt đầu bên phải vùng nút Poki (46×62 px CSS ở góc trên trái); ở cột shop màn ngang dùng 2 dòng để chữ không bị thu nhỏ.
  - Chỉnh giá để Bakery mở sớm hơn (mục tiêu khoảng phút 9–10) và Dessert Bar khoảng phút 30–35, khách đến dày hơn ở đầu game; giữ thời gian về đích dưới 60 phút cho người chơi lần đầu. Số đã đổi: khách tầng Coffee mỗi 2,7 giây (trước 3,0), Bakery 35K (trước 60K), Strawberry Cake 400K (trước 600K), Dessert Bar 25M (trước 15M).
  - **Kết quả sau khi sửa (mô phỏng 100 lượt mỗi kiểu, `npm run sim:pacing`; bản đầu → bản cuối có chặn cấp, không quảng cáo):** người chạm đều về 5 sao 57 → 35 phút, người chơi lần đầu (mua thẻ rẻ nhất, làm theo nhiệm vụ) 60 → 39 phút, người ít chạm khi có thú 93 → 67 phút, người không bao giờ để dành (như bot) 64 phút khi chưa chặn cấp → 48 phút. Có quảng cáo trên Poki (1 quảng cáo mỗi 3 phút) 28 phút, xem mọi quảng cáo 25 phút (người chạm đều); quảng cáo rút ngắn chủ yếu nhờ Rush Hour, nâng cấp miễn phí gần như không đổi thời gian. Thú đầu tiên phút 4,1 → 2,9; Bakery 13,5 → 7,4; Strawberry Cake 20,5 → 11,6; Dessert Bar 43,2 → 26,6. Khoảng dài nhất (p90) không có nhiệm vụ hay thứ mới: phút 0–10 3:48 → 2:17, phút 10–30 8:25 → 3:23; giữa hai phần thưởng bất kỳ (mua, nhiệm vụ, thứ mới) trong 10 phút đầu 26 giây (người mới 18 giây). 3 phút đầu mỗi phút 66–75 lần chạm làm món, 21–24 lần đưa món, 7–25 lần mua. Thời gian về đích ngắn hơn trước nhiều nhưng vẫn trong mục tiêu dưới 1 giờ; người thật chậm hơn bot. Điểm cần theo dõi: quãng Strawberry Cake (phút 12) tới Dessert Bar (phút 27) không có món hay tầng mới; thú đầu tiên đến sớm hơn mốc 4–5 phút; mô phỏng và bot gần như không để khách bỏ về.
- **Đợt 1 giữ chân D3–D7 (tối 15/10, người dùng chọn "chạy luôn đợt 1").**
  - Vấn đề: người chơi lần đầu, mỗi ngày khoảng 15 phút, đạt 5 sao vào ngày 3. Sau đó chỉ còn nâng cấp không mục tiêu, trang trí và chơi lại tính giờ. Quà 7 ngày chỉ có xu và vé.
  - Mọi thứ mới chỉ mở ở quán chính sau 5 sao, nên nhịp chơi tới 5 sao và các mô phỏng trước đó không đổi. Riêng quà 7 ngày đổi cho mọi người.
  - **Nhiệm vụ ngày:** mỗi ngày (theo ngày trên máy) 3 nhiệm vụ trong thanh nhiệm vụ. Ví dụ: phục vụ N khách, phục vụ tận tay N khách, N VIP, bán N món X, bán N món của ngày, mua N lần, kiếm N xu từ khách.
    - Thưởng xu theo thu nhập hiện tại. Xong cả 3 thì thêm 1 vé nhận nuôi.
    - Thanh nhiệm vụ ưu tiên: thứ đã xong chờ nhận, rồi nhiệm vụ ngày, rồi chuỗi nhiệm vụ cũ. Hết cả hai thì hiện "Nhiệm vụ mới vào ngày mai".
  - **Món của ngày:** mỗi ngày một món đã mở bán giá ×2, khác món hôm trước. Có huy hiệu trên máy và dòng chữ trên thẻ nâng cấp.
  - **Quà 7 ngày:** ngày 3 là một thú Rare chưa có (hết Rare thì Epic chưa có, hết nữa thì lên cấp một Rare). Ngày 7 là Snow Fox: thú Legendary độc quyền, không có trong vòng nhận nuôi, mỗi vòng 7 ngày lên thêm 1 cấp. Bảng quà hiện trước hai phần thưởng này.
    - Luật chuỗi giữ nguyên: bỏ một ngày thì về ngày 1. Muốn đổi phải sửa `core/`, ảnh hưởng cả game #1, chờ người dùng quyết.
  - **Ca đêm (Night Shift):** nâng cấp mở sau 5 sao, mỗi cấp +2 giờ thu nhập khi vắng mặt, 2 cấp (tối đa 10 giờ cùng Pantry).
- **Môi trường build trong chat 14/10:** npm bị chặn ở cả máy ảo lẫn cloud nên Claude build bằng esbuild và Phaser lấy từ GitHub release (công cụ tạm, không nằm trong repo). Trên máy người dùng vẫn dùng `npm install` và Vite như README.

## 5b. Người chơi theo portal và cách bắt đột biến

Không portal nào công bố độ tuổi chính xác. Các nguồn:

- **CrazyGames:**
  - Trang chính dành cho 13+, phải tuân thủ PEGI 12. Game cho trẻ em nằm ở site riêng, nơi tắt kiếm tiền.
  - Similarweb (chỉ đo người từ 18 tuổi): nhóm 18–24 đông nhất, 52% nam.
  - Ngày thường đông hơn cuối tuần 22%, đỉnh lúc 13h giờ miền Đông Mỹ, đông nhất mùa đông. Đây là dấu hiệu có nhiều học sinh (suy luận).
  - Top nước: Mỹ 23,6%, Ấn Độ 9,1%, Việt Nam 5,6%.
- **Poki:**
  - Tuyên bố dành cho mọi lứa tuổi, kể cả trẻ em. Common Sense Media ghi phụ huynh và trẻ em đánh giá hợp từ 11 tuổi.
  - Similarweb (từ 18 tuổi): 55% nữ.
- **Yandex Games** (số liệu của Yandex):
  - 55+ chiếm 38%, dưới 18 chỉ 9%; 58% nữ; Nga 60%.
  - Trang chủ phần lớn là xếp hình, mahjong, sudoku.
- **Newzoo và Google** (2/2026, người 13–55 tuổi):
  - 60% người 13–20 chơi game web mỗi tháng, so với 38% người 41–55.
  - Nhóm 13–20 thích hành động, nhưng ngách này khó thắng với người làm một mình. Chỉ lấy cơ chế họ thích (tuỳ biến, bảng xếp hạng, thử thách).

Bắt đột biến:

- Đột biến hiện chủ yếu đến từ trend của trẻ em lan từ Roblox/TikTok. Trên Yandex: Italian brainrot khoảng 15 triệu lượt cài, Labubu khoảng 7 triệu.
- Game mới mất ít nhất 2–3 tuần mới có quảng cáo, thường sau đỉnh trend. Vì vậy bắt trend bằng bản cập nhật của game đã ra, không làm game mới theo trend.
- Chỉ lấy cơ chế và chủ đề chung của trend (mục 4.6).

Chi tiết và nguồn: mục 3b trong tài liệu nghiên cứu (mục 10).

## 5c. Hướng đi tiềm năng: kênh video riêng và kênh kéo người chơi

Trạng thái: tiềm năng, chưa chốt (11/10). Chốt hay bỏ sau khi có số liệu Basic Launch của game #1. Phần code ở dưới được chuẩn bị sẵn để không phải sửa lớn về sau. Nghiên cứu và nguồn: chat nghiên cứu chiều 11/10 (Android, organic, kênh video AI).

### Ý tưởng

- Kênh TikTok và YouTube Shorts không lộ mặt, giọng AI. Nguyên liệu chính là gameplay thật quay từ game: khoảnh khắc ra đồ hiếm, ghép lên cấp cao nhất, speedrun, devlog "một người + AI làm game". Chủ đề kênh trùng ngách game (vũ trụ, RNG) ngay từ đầu.
- Công cụ:
  - Claude: code game, công cụ quay video, kịch bản, caption, đọc số liệu.
  - Gemini Pro (Veo 3.1 Fast): chỉ dùng cho cảnh mở đầu. Hạn mức khoảng 1.000 Flow credit/tháng + 50/ngày, 20 credit cho một clip 8 giây, tức khoảng 125 clip/tháng.
- Đăng bài và chọn nội dung làm tay (ước tính 15–30 phút/ngày). Không tự động hoá việc đăng.
- Nghiên cứu cho thấy các game lên được nhờ organic gần như đều kéo khán giả từ bên ngoài store (Vampire Survivors, Balatro từ PC; Dumb Ways to Die từ TikTok). Web portal + kênh riêng đi theo cùng mẫu này.
- Với game đi đường Poki, người chơi tự mang đến được 100% doanh thu (mục 1), nên kênh riêng có giá trị hơn ở đường này.

### Vì sao không làm kênh AI chung chung rồi mới gắn game

- Người xem kênh chung không phải người chơi game. Kênh đổi chủ đề đột ngột nằm trong nhóm bị YouTube rà soát.
- YouTube (7/2025) đổi chính sách "repetitious content" thành "inauthentic content": nội dung làm hàng loạt, theo khuôn, ít khác biệt bị tắt kiếm tiền; đợt 1/2026 khoá 16 kênh với 35 triệu người đăng ký. Kênh không lộ mặt có nội dung riêng vẫn được. Giọng hoặc hình AI trông như thật phải bật nhãn.
- TikTok: cho phép nội dung AI nhưng phải gắn nhãn, tự phát hiện qua C2PA. Creator Rewards không trả cho nội dung AI. Mục tiêu ở đây là kéo người chơi nên việc này ít quan trọng, nhưng bị khoá kênh thì mất hết.
- Game #1 có RNG nên mỗi video tự nhiên khác nhau, không bị coi là làm theo khuôn.

### Giới hạn đã biết (11/10)

- TikTok: link ở bio cần 1.000 follower hoặc tài khoản Business. Dùng Business từ đầu, vì dùng nhạc của chính game nên không cần kho nhạc trend.
- YouTube Shorts: link trong mô tả và bình luận không bấm được. Dùng link trên trang kênh và "Related video" sang video dài có link (cần bật advanced features).
- TikTok Minis: từ 28/8/2026 không nhận mini game HTML5, chỉ Cocos/Unity/Laya. Game Phaser không vào được.
- YouTube Playables: hỗ trợ Phaser, game chơi ngay trong YouTube, đang early access qua form. Poki tính Playables là web, nên chỉ dùng cho game đi đường B.
- CrazyGames:
  - Không đòi độc quyền; game có mặt ở nơi khác vẫn được nếu có quyền phân phối.
  - Invite link của SDK chỉ được dùng cho multiplayer. Dùng làm nút chia sẻ hay đo nguồn có thể bị chậm duyệt hoặc từ chối.
  - Dashboard có lượt chơi, doanh thu, tương tác, quốc gia; chưa thấy chia theo nguồn. Đo hiệu quả kênh bằng lượt chơi tăng sau mỗi lần đăng.
  - Link cộng đồng (Discord, website của dev) được phép trên menu game, nhưng không phải nút chính và không dẫn tới bản web chơi được. Cấm quảng bá game hay portal khác. Poki thì cấm mọi link ra ngoài.

### Kênh kéo người chơi khác, chi phí gần 0

| Kênh | Hợp với | Lưu ý |
| --- | --- | --- |
| Google tìm kiếm, qua trang game trên CrazyGames | Cả hai | Tên game chứa từ khoá (mục 4.1). Đã có sẵn, không tốn thêm |
| Reddit r/incremental_games | Game #1 | Dev đăng vào thread Feedback Friday hằng tuần; bài riêng tối đa 1 lần/30 ngày và phải chơi được |
| Reddit r/WebGames | Cả hai | Link thẳng tới một game, tiêu đề bắt đầu bằng tên game, không đăng lại trong 3 tháng. Link CrazyGames có thể bị coi là site lưu trữ game lớn (1 bài/tháng, phải nhắn mod trước): hỏi mod trước khi đăng |
| Reddit theo thể loại (r/tycoon cho game #2), r/playmygame | Cả hai | Mỗi subreddit khoảng 1 bài/tháng, không đăng cùng lúc nhiều nơi, tham gia cộng đồng trước. Subreddit nhỏ đúng thể loại thường chuyển đổi tốt hơn subreddit lớn |
| Instagram Reels, Facebook Reels | Cả hai | Đăng lại cùng video. Facebook có thể hợp nhóm lớn tuổi (giả định) |
| Streamer, YouTuber nhỏ chơi clicker/game web | Cả hai | Gửi link và clip. Creator khác làm video về game thường mang nhiều người hơn kênh của chính dev |
| Cộng đồng tiếng Việt (nhóm Facebook, Voz) | Cả hai | Việt Nam chiếm 5,6% traffic CrazyGames (mục 5b). eCPM thấp |
| galaxy.click | Game #1 | Hub game incremental trên trình duyệt, có API nhúng iframe. Chưa rõ có nhận link portal không; nếu game chạy ở đó thì lượt chơi không về CrazyGames. Đọc luật trước |

Không ưu tiên: r/gamedev, r/indiedev, X/Bluesky #screenshotsaturday (khán giả chủ yếu là dev; tốt cho góp ý, ít lượt chơi). Không làm: quảng cáo Reddit, mua lượt xem, Discord Activities (hợp game chơi nhóm, không hợp game idle một người; Poki tính Discord là web).

### Cấu phần code chuẩn bị sẵn

Phần A: làm trong game #1 trước 15/10. Nhỏ, nhưng sửa sau thì tốn.

| # | Cấu phần | Chỗ đặt | Dùng cho |
| --- | --- | --- | --- |
| A1 | RNG có seed (`core/rng.ts`, truy cập qua `app.rng`). Mọi phép ngẫu nhiên trong gameplay (quét, biến thể, bảo hiểm) đi qua đây, không gọi `Math.random()` trực tiếp. `?seed=123` chỉ có tác dụng ở build web và capture | `core/` | Quay lại đúng khoảnh khắc hiếm, test, kỷ lục công bằng về sau. Game #2 dùng cho thú có độ hiếm |
| A2 | Sự kiện khoảnh khắc `app.moments` (dùng `Emitter` có sẵn): `rarePull { tier, odds }`, `merge { level }`, `collectionNew { id }`, `finish { runMs }` | `core/` khai báo, `src/` phát | Tự cắt clip, `happyTime()`, đo lường về sau |
| A3 | Màn ra đồ hiếm đủ "lên hình": tỉ lệ hiện to (ví dụ "1 / 5,000"), hiệu ứng 2–3 giây, chữ đọc rõ ở khung dọc | `src/` | Câu mở đầu của video; cũng là yêu cầu "đã tay" ở mục 4.3 |
| A4 | `?clean`: ẩn nút quảng cáo, thông báo hệ thống, bảng debug và con trỏ chuột | `core/` | Video xem trước nộp CrazyGames ngày 15/10 (bắt buộc, cấm con trỏ mặc định), video cho kênh |

Phần B: sau khi nộp game #1 (từ 15/10), trong `core/`, chỉ có ở build `web`/`capture`, không vào build CrazyGames.

| # | Cấu phần | Ghi chú |
| --- | --- | --- |
| B1 | Build `capture` (`npm run build:capture`, thêm mode trong `vite.config.ts`) | Khung cố định 1080×1920 (TikTok/Shorts), 1080×1620 (2:3 CrazyGames), 1920×1080; 60 fps cố định (dùng cơ chế `?fps` có sẵn); seed cố định |
| B2 | Save dựng sẵn `?preset=<tên>`, đọc từ `src/capture/presets/*.json` | Dùng khoá lưu riêng để không đè save thật |
| B3 | Kịch bản chơi tự động `src/capture/scripts/*.json`: chạm, quét, kéo ghép, chờ | Quay "từ bụi lên thiên hà", speedrun |
| B4 | `scripts/capture.mjs`: Playwright chạy kịch bản trong Chromium headless, ghi video, xuất mp4 bằng ffmpeg | Giả định: WebGL headless chậm hơn nhưng vẫn quay được; kiểm tra khi làm |
| B5 | Tự cắt clip khi có `rarePull`, giữ vài giây trước và sau | Dựa trên A2 |

Game #2 dùng lại toàn bộ qua `npm run sync-core`; chỉ viết preset và kịch bản riêng.

Không làm:

- Không đưa link kênh mạng xã hội vào game đi đường Poki (Poki cấm link ra ngoài). Ở CrazyGames chỉ đặt trên menu như link cộng đồng, không làm nút chính.
- Không dùng invite link của CrazyGames để đo nguồn.
- Không nộp YouTube Playables cho game đi đường Poki.

### Thời điểm

- Trước 15/10: chỉ phần A.
- Trong Basic Launch game #1: phần B, mở kênh, đăng thử. Giả định cần kiểm chứng: người chơi từ kênh riêng có thể làm lệch số liệu Basic Launch so với người chơi do portal mang đến.
- Chốt hay bỏ: sau 2–3 tuần đăng, xem lượt chơi có tăng theo các lần đăng không.

## 5d. Game #3: câu cá + ấp trứng ra thú (chọn 14/10)

Chọn tối 14/10 trong chat nghiên cứu ngách mới (CrazyGames, Y8, Poki, Roblox). Tên tạm: **Pond Pals: Hatch & Fish** (chưa kiểm tra trùng tên). Tài liệu thiết kế v0 ở mục 10. Mọi số trong tài liệu là điểm xuất phát, chưa mô phỏng.

Vì sao chọn (nghiên cứu 14/10):

- Ghép hai ngách cầu cao, ít đối thủ theo tag CrazyGames: Fishing 27 game, Pet 12 (so với Idle 524, Merge 250).
- Cầu: Tiny Fishing và Fish Orbit đang Hot trên CrazyGames; Hatch Your Pets, Catch a Pet, Petnest.io trong Popular của Poki; Fisch và Adopt Me đang trending trên Roblox, Steal an Egg (ra 7/2026) vượt 3,1 tỷ lượt chơi.
- Đây là phương án dự phòng "câu cá nâng cấp 2D" ở mục 5, thêm lớp ấp trứng ra thú để có sưu tầm và tự động hoá.

Vòng lặp chính:

1. Thả câu (giữ rồi nhả, thanh lực), cắn câu (chạm đúng lúc, cửa sổ 0,6 giây), kéo dây (giữ để kéo, nhả khi cá giật, thanh căng dây).
2. Vật bắt được: cá 70%, trứng 15%, rác vui 10%, rương 5%. Độ hiếm 5 bậc 60 / 25 / 10 / 4 / 1%.
3. Bán cá lấy xu, nâng cấp cần, dây, mồi, phao (giá ×1,15 mỗi cấp).
4. Trứng vào lò ấp (30 giây tới 20 phút theo độ hiếm; mỗi con cá câu được rút 5 giây). Thú nở ra có một perk: may mắn, giá bán, lực kéo, cửa sổ chạm, câu hộ kể cả offline, ấp nhanh. Thú trùng thành thức ăn lên cấp (tối đa 5), không merge.
5. Đủ 6/8 loài trong Sổ cá thì gặp boss của hồ; thắng boss thì mở hồ mới, giá cá ×3.

Phạm vi v1: 2 hồ (Cozy Pond, Misty Creek), 16 loài cá, 10 thú, 2 boss, nhiệm vụ ngày, chuỗi đăng nhập, thu nhập khi vắng mặt. Bản Giáng sinh thêm hồ Frozen Lake (mục 4.6).

**Đường phát hành: A, Poki (người dùng chọn 14/10).** Lý do: khán giả Poki hợp game cozy thú cưng trên điện thoại (55% nữ; Popular của Poki có Hatch Your Pets, Catch a Pet, Petnest.io); mục Fishing của Poki chỉ có 9 game, so với 27 trên CrazyGames và khoảng 24 trên Yandex (kiểm tra 14/10). Cái giá: đường Poki mất 1–2 tháng tới global release nên gần như lỡ mùa Giáng sinh, và hai trên ba game cùng chờ Poki.

- Làm theo chuẩn Poki từ v1 (cũng đạt chuẩn CrazyGames): tải ban đầu dưới 8 MB, chơi tốt ở màn dọc trên điện thoại và máy tính bảng, giữ người chơi qua 3 phút (Player Fit Test), không request ra ngoài, adapter `core/platform/poki.ts`.
- Không đăng game #3 ở bất kỳ web nào (kể cả itch.io, Discord, YouTube Playables) trước khi Poki trả lời. Đây là sai lầm duy nhất không quay lại được.
- Mốc kiểm tra khoảng 26/10, khi Poki trả lời game #2: Poki nhận hoặc phản hồi tích cực thì giữ đường A; im lặng hoặc từ chối thì chuyển game #3 sang đường B (suy luận: hai game cùng thể loại thú cưng cozy nhiều khả năng được Poki đánh giá giống nhau).
- Hồ Frozen Lake (mục 4.6) đưa vào bản nộp nếu kịp, thay vì làm bản cập nhật Giáng sinh riêng.

Dùng lại từ game #1 và #2: bộ khung `core/`, RNG theo trọng số có bộ đếm bảo hiểm, quà hằng ngày, thu nhập khi vắng mặt, nút thưởng có thời gian hồi, lượt tính giờ và kỷ lục, bộ đọc nội dung JSON, mô phỏng kinh tế.

Chỗ tài liệu thiết kế v0 lệch với quyết định đã chốt (sửa theo dự án trước khi làm):

- **Khán giả:** tài liệu ghi 10–35 tuổi. Theo mục 4.6 phải là 13+, phong cách cozy nhưng không trẻ con.
- **Hướng dẫn đầu game:** tài liệu ghi "con cá đầu tiên lên trước mọi dòng hướng dẫn". Theo mục 4.2 dùng hướng dẫn theo bước; bước đầu là "Giữ để thả" và lần thả đầu chắc chắn có cá.
- **Tải ban đầu:** tài liệu ghi dưới 10 MB. Quy ước dự án dưới 8 MB (mục 11).
- **Engine:** tài liệu gợi ý Phaser hoặc Cocos Creator. Dự án đã chốt Phaser 4 + TypeScript + bộ khung chung (mục 3).
- **Đường phát hành:** tài liệu ghi Poki, CrazyGames, Y8 cùng lúc, trái với độc quyền của Poki. Phải chọn đường A hoặc B trước khi đăng (mục 1). Đã chọn đường A (14/10), xem phần đường phát hành ở trên.
- **Quảng cáo:** "Thử lại boss khi đứt dây" phải hiện ở màn thua sau khi trận dừng, không trong lúc kéo (mục 4.5). "Mồi vàng" đặt trong bảng nâng cấp hoặc màn nghỉ.
- **Đích cuối:** tài liệu chưa có đích chạm được dưới 1 giờ (mục 4.4). Đề xuất cho v1: thắng boss hồ 2 và đủ Sổ cá 2 hồ; kiểm bằng mô phỏng.
- **Lịch:** tài liệu đề xuất MVP 15/10–15/11, trùng tuần làm game #2 (mục 11). Bắt đầu sau khi nộp game #2.

Rủi ro:

- Gần với game #1 (RNG độ hiếm, sưu tầm) và trùng chủ đề thú với game #2 (axolotl Legendary có ở cả game #2 và game #3). Cần phong cách hình ảnh và cảm giác tay khác hẳn.
- Tiny Fishing (12/2020) vẫn chiếm đỉnh ngách câu cá trên CrazyGames.
- Đã có bản sao "Steal an Egg" trên CrazyGames; giữ hướng cozy, không làm cơ chế "steal".

Việc cần chốt trước khi làm: tên game (kiểm tra trùng), đích cuối v1, mô phỏng kinh tế (thời gian về đích, tỉ lệ người câu đều so với để thú câu hộ).

## 6. Yêu cầu kỹ thuật bắt buộc của portal

Bản đầy đủ, kèm checklist và nguồn: `claude/WebGame-Publishing_Brief_v1.md`. Phần dưới là tóm tắt.

Chung cho mọi game:

- Chuyển động tính theo delta time, chạy đúng ở màn hình 144/165 Hz
- Khung 16:9 co giãn, chữ đọc rõ ở devicePixelRatio 1
- Tạm dừng và tắt tiếng khi quảng cáo chạy hoặc khi chuyển tab
- `localStorage` bọc trong try/catch
- Mọi tài nguyên đóng gói sẵn, không gọi request ra ngoài
- Nội dung gốc: không clone, không phải bản ghép asset có sẵn, không trông như prototype
- Thời điểm gọi quảng cáo cấu hình theo từng portal (quy định mỗi nơi khác nhau), không viết cứng trong code game

CrazyGames:

- Tải ban đầu tối đa 50 MB (tối đa 20 MB để lên trang chủ mobile), tổng tối đa 250 MB, tối đa 1.500 file; từ lúc tải đến lúc chơi được nên dưới 20 giây
- Tuân thủ PEGI 12; khán giả từ 13 tuổi (game cho trẻ em bị đưa sang site riêng, nơi tắt kiếm tiền); phải có tiếng Anh
- Không logo portal khác, không quảng cáo ngoài SDK, không quảng bá game hay portal khác, không link App Store; không tự làm nút toàn màn hình
- Âm thanh iOS: gọi `resume()` cho AudioContext khi người chơi chạm, sau khi app chạy nền
- Full Launch: tích hợp SDK và sự kiện bắt đầu gameplay; người chơi mới vào thẳng màn chơi (tối đa 1 lần nhấp); quy định quảng cáo ở mục 4.5
- SDK v3: nạp `crazygames-sdk-v3.js` trong `<head>` trước code game, gọi `await window.CrazyGames.SDK.init()` trước khi dùng. Các module: `ad`, `banner`, `game`, `user`, `data`.
- Ảnh bìa 3 cỡ và video xem trước bắt buộc (mục 4.1)

Yandex Games:

- Cài SDK; tự nhận diện ngôn ngữ qua SDK (mục 2.14). Tiếng Nga cho RU/BE/KK/UK/UZ, tiếng Anh cho các nước còn lại, thêm tiếng Thổ Nhĩ Kỳ nếu được
- Cấm AI tương tác trong game; tên file và thư mục không có dấu cách hoặc chữ Nga; ZIP tối đa 100 MB khi giải nén, một `index.html` ở gốc
- Hay bị từ chối vì: không gọi Game Ready, không lưu tiến trình, không tắt tiếng khi quảng cáo, tên có "free"/"best"
- Sticky banner là định dạng mang doanh thu cao nhất; điện thoại (nhất là Android) mang nhiều traffic nhất

Poki (game #2):

- Tải ban đầu dưới 8 MB, khung 16:9 phủ toàn canvas, chơi được trên điện thoại và máy tính bảng, SDK Poki (`gameplayStart` / `gameplayStop`, quảng cáo qua SDK)
- Không request ra ngoài, không màn hình logo, không link ra ngoài (logo chỉ ở màn tải), không khoá game khi chặn quảng cáo, chạy được ở chế độ ẩn danh
- Độc quyền trên web 5 năm (hai trang của Poki ghi khác nhau, trang Deals ghi 5 năm); Discord và YouTube Playables bị tính là web; Steam và kho ứng dụng di động vẫn được
- Chia doanh thu: 50% với người chơi do Poki mang đến, 100% với người chơi tự mang đến

## 7. Quy trình ra mắt và thời gian

| Portal | Bước | Thời gian |
| --- | --- | --- |
| CrazyGames | Duyệt QA | Thường 1–2 ngày (nguồn bên thứ ba) |
| CrazyGames | Basic Launch, chưa có quảng cáo | Tối thiểu 7 ngày và 500 lượt chơi, tối đa 21 ngày |
| CrazyGames | Kết quả Basic Launch | Đạt hết: mời làm Full Launch. Đạt một phần: có thể sửa và xin thêm một đợt. Phần lớn không đạt: phải nộp lại như game mới với cải tiến lớn |
| CrazyGames | Cập nhật game | Thường trong ngày; trong Basic Launch cập nhật lên ngay |
| CrazyGames | Thanh toán | Hằng tháng khi số dư đạt €100, qua Tipalti (chuyển khoản hoặc PayPal), NET 60 |
| Yandex | Kiểm duyệt | 3–5 ngày làm việc, mỗi lần sửa phải duyệt lại; tối đa 2 game mới chờ duyệt cùng lúc |
| Yandex | Mục New và đánh giá của hệ thống đề xuất | 1 tuần, chỉ một lần cho mỗi ID game |
| Yandex | Rating | Rating không vượt 30 sau 3 tuần thì game bị gỡ |
| Poki | Chờ phản hồi sau khi nộp (beta đóng, duyệt bằng tay) | Không cố định; dự án đặt hạn 7 ngày |
| Poki | Player Fit Test (500 người, cần trung bình trên 3 phút và từ 25% chơi quá 3 phút) | Khoảng 5 giờ |
| Poki | Web Fit Test | 3–5 ngày |
| Poki | Duyệt cuối, đặt lịch soft release | 1–2 tuần |
| Poki | Soft release, rồi global release | 2–3 tuần mỗi bước |

Hệ quả:

- Tuần ra mắt chưa có doanh thu.
- Chỉ nộp Yandex khi game đã được chỉnh theo số liệu CrazyGames, vì phát hành lại cùng ID không được vào lại mục New.
- Nộp CrazyGames bản còn thô có thể mất cơ hội chính của game đó (phải nộp lại như game mới).
- Đường Poki mất 1–2 tháng từ lúc nộp tới global release nếu suôn sẻ.

## 8. Kỳ vọng tài chính và mốc kiểm tra

Dự báo (ước tính, chưa có số liệu thật):

- Tháng 1–2: khoảng $0
- Tháng 3–6: $0–300 mỗi tháng
- Tháng 6–12: $200–1.500 mỗi tháng nếu 1–2 game chạy tốt
- Giả định doanh thu về developer: $0,5–5 trên 1.000 lượt chơi. Thay bằng số thật từ trang developer của portal ngay khi có.

Chi phí:

- Tiền mặt tối đa A$300 trước tháng 6.
- Chi phí chính là thời gian, khoảng 180–240 giờ mỗi tháng.

Mốc kiểm tra:

1. Ngày 45–60: chưa game nào lên Full Launch thì xem lại chất lượng và thể loại trước khi làm thêm.
2. Tháng 3: cập nhật dự báo bằng doanh thu trên 1.000 lượt chơi và lượt chơi mỗi ngày thật.
3. Tháng 6: dưới $200 mỗi tháng và không game nào quá 1.000 lượt chơi mỗi ngày thì đổi hướng; có game trên $500 mỗi tháng thì dồn sức cho game đó (cập nhật, IAP trên Yandex, port Android).

## 9. Thuế, visa, nhận tiền ở Úc

Phần này không phải tư vấn pháp lý hay thuế.

- **Kinh doanh hay sở thích:** làm game có quảng cáo, đều đặn, có kế hoạch thì nhiều khả năng ATO coi là kinh doanh. Khi đó cần ABN và khai thu nhập.
- **Thu nhập nước ngoài:** cư dân thuế Úc khai thu nhập toàn cầu, dù tiền nằm ở Payoneer, PayPal hay ngân hàng Việt Nam.
- **Cư dân tạm thời:** miễn thuế thu nhập nước ngoài có thể không áp dụng cho công việc làm tại Úc. Hỏi tax agent trước khoản thanh toán đầu tiên.
- **Visa du học (nếu có):** giới hạn 48 giờ mỗi hai tuần trong kỳ học, và tự làm chủ có thể bị tính. Kiểm tra VEVO và hỏi migration agent.
- **Yandex:** Úc có lệnh trừng phạt liên quan đến Nga. Kiểm tra danh sách DFAT và hỏi ngân hàng hoặc Payoneer trước khi dựa vào nguồn thu này.
- **Telegram Stars:** tiền về dạng TON, tính là thu nhập theo giá AUD lúc nhận, bán ra sau có thể phát sinh CGT.
- **Ghi chép:** gom thu nhập về một kênh (đề xuất Payoneer). Ghi ngày, số tiền gốc, tỉ giá quy ra AUD, phí. Lưu sao kê 5 năm.

## 10. Tài liệu và artifact

- Sổ chơi thử Clicker (dữ liệu chơi thử, db collection `observations`): https://claude.ai/artifact/5WxTwsUoTxdBzTtLup5h9z
- Nghiên cứu Clicker & chọn thể loại game #2: https://claude.ai/code/artifact/ddd91c6a-f05b-4e6a-9e67-70fb4cc81774
- Báo cáo đối thủ clicker: `claude/WebGame-Clicker_Report_v1.md` (trong project)
- Hướng dẫn đăng game lên các portal (từng bước, checklist, nguồn): `claude/WebGame-Publishing_Brief_v1.md` (trong project)
- Repo game #1: https://github.com/anhtu000/1Clicker (thư mục trên máy: `D:\Projects\GameMaking\Game1_Clicker`)
- Repo game #2: https://github.com/anhtu000/2TycoonCafe (thư mục trên máy: `D:\Projects\GameMaking\Game2_Tycoon_cafe`)
- Tài liệu thiết kế game #3 (bản chỉnh sửa được): https://claude.ai/code/artifact/d79f1125-36b4-4d20-b33d-45a465f2efa8
- Tài liệu thiết kế game #3 (bản trên máy): `D:\Projects\GameMaking\Game3_Fishing_pets\Pond-Pals-Tai-lieu-thiet-ke.md`
- Bản build thử bộ khung (mở trên điện thoại): https://claude.ai/artifact/NjCx8L3YREeeLDNUQMQZY3
- Mô phỏng kinh tế game #1 (dựng lại bằng `npm run sim` và `npm run sim:report` trong repo): https://claude.ai/artifact/LVGTE1Q9dbUCFqifUJHByN
- Bản chơi thử game #2 (mở trên điện thoại; `#staff`, `#dessert`, `#finish` để xem trạng thái dựng sẵn, `#reset` để chơi lại): https://claude.ai/artifact/HumVJY2Kxo9r9rRUJswr48
- Bản nháp game #1 (mở trên điện thoại; thêm `#showcase` vào cuối link để xem bảng đã có nhiều thiên thể, `#starstep` để thử bước sao băng): https://claude.ai/artifact/3yHfPmZFGWk5prQfumegQy

## 11. Giai đoạn phát triển: lịch tuần đầu và quy ước

### Lịch tuần 12–18/10

Rút 1 ngày (quyết định 11/10): người dùng rảnh toàn thời gian 11–14/10. Điều kiện là người dùng duyệt kết quả mô phỏng và mẫu hình ảnh ngay trong ngày nhận được.

| Ngày | Việc | Xong khi |
| --- | --- | --- |
| T2 12/10 | Bộ khung chung: Vite + Phaser 4 + TypeScript; màn loading, menu; tắt/bật tiếng, tự tạm dừng khi chuyển tab; co giãn 16:9 và màn dọc; delta time; adapter quảng cáo, lưu, ngôn ngữ; lưu tự động | Chạy được trên điện thoại và máy tính. Đã dựng xong 11/10 và đã có trong cả 2 repo; đã thử trên Chrome máy tính và trình duyệt giả lập điện thoại; còn chờ thử trên điện thoại thật |
| CN–T4 11–14/10 | Game #1 v1: kinh tế và mô phỏng (11–12/10); thêm vào `core/` và mẫu hình ảnh (12/10), gồm phần A mục 5c (RNG có seed, sự kiện khoảnh khắc, `?clean`) và các việc hạn "trước 15/10" ở mục 8 của hướng dẫn đăng game (âm thanh iOS, vị trí nút thưởng); làm game, gửi bản nháp (13/10); chơi thử 30 phút, đối chiếu mục 4 và 6, sửa lỗi (14/10) | Đủ mục 4 và 4b; chơi thử 30 phút liền không lỗi |
| T5 15/10 | Ảnh bìa 3 cỡ, video xem trước (quay với `?clean`, không tiếng, mục 4.1), nộp game #1 lên CrazyGames theo mục 2 của hướng dẫn đăng game (chat riêng). Ảnh bìa, video, mô tả xong sớm (rạng sáng 14/10, mục "Ảnh bìa, video, mô tả" dưới đây) | Đã nộp, sớm 1 ngày: 13h 14/10 (bản build v2 có chỗ cho đồ trang trí ở màn ngang và Lucky Scan hồi 4 phút). Đang chờ CrazyGames duyệt QA |
| T5–CN 15–18/10 | Game #2 v1 trên bộ khung chung, đạt yêu cầu Poki (mục 5); adapter `core/platform/poki.ts` | Đủ mục 4 và 5. Bắt đầu sớm chiều 14/10: adapter Poki, thiết kế, mô phỏng, bản chơi thử 1 (mục 5a) |
| Từ T2 19/10 | Nộp game #2 lên Poki for Developers theo mục 3 của hướng dẫn đăng game; chờ tối đa 7 ngày, không có tiến triển thì nộp CrazyGames (khoảng 26/10). Đọc số liệu Basic Launch của game #1 và sửa; phần B mục 5c nếu còn thời gian | |

Nếu game #1 trễ thì lùi game #2 sang tuần sau, không cắt chất lượng game #1:

- CrazyGames loại game có lỗi hoặc trông như prototype, và game không đạt Basic Launch phải nộp lại như game mới.
- Basic Launch kéo dài ít nhất 7 ngày, nên nộp game #2 muộn vài ngày không làm mất doanh thu tuần đầu.

### Quy ước cho chat phát triển

- **Nơi để code:** mỗi game một repo GitHub, có bản sao trên máy ở `D:\Projects\GameMaking\` (link ở mục 10). Nếu dùng Claude Code trên máy, chép file này vào gốc repo.
- **GitHub và thư mục trên máy (15/10, người dùng):** GitHub đang liên kết với một tài khoản Claude khác. Chat ở tài khoản này không push, pull hay fetch GitHub. Mọi việc làm ở thư mục trên máy, người dùng đẩy và kéo GitHub sau.
  - Bản gốc là thư mục trên máy `D:\Projects\GameMaking\`. Bản trên cloud chỉ là bản làm việc tạm.
  - Trước khi sửa: lấy commit mới từ thư mục trên máy về cloud, vì có thể có commit từ tài khoản kia hoặc từ chat khác.
    - Trên máy: `git bundle` vào `_claude_tmp\`, đưa vào cloud, rồi gộp thẳng.
    - Thư mục trên máy có thay đổi chưa commit thì hỏi người dùng trước.
  - Sau khi commit trên cloud: đưa commit về máy theo các bước sau.
    - Tạo `git bundle` các commit mới và chép vào `D:\Projects\GameMaking\_claude_tmp\`.
    - Trong thư mục game: `git fetch` từ bundle và gộp thẳng.
    - Xoá `_claude_tmp`, rồi kiểm tra cloud và máy cùng một commit.
    - Lệch nhánh thì dừng và báo.
  - Khi người dùng muốn đẩy lên GitHub, có thể bấm đúp `D:\Projects\GameMaking\sync-github.cmd`.
    - Với mỗi thư mục game có `.git`, file kéo bản mới (`pull --ff-only`) rồi đẩy `main` bằng tài khoản Git trên Windows.
    - Kết quả ghi vào `_sync-github.log`.
    - Ngày 15/10, GitHub còn thiếu 3 commit của game #1 (tới 68a9cd1) và 8 commit của game #2 (tới 839c80c).
- **Cấu trúc:** mỗi repo có `core/` (bộ khung dùng chung) và `src/` (code riêng của game), mỗi game một bản build riêng.
  - Hai bản `core/` phải giống nhau. Chỉ sửa `core/` ở repo game #1, rồi chạy `npm run sync-core` trong thư mục Game1 để chép sang Game2, sau đó commit ở cả hai repo.
  - Cách dùng bộ khung, lệnh chạy và tham số thử nghiệm (`?debug`, `?fps=144`, `?ads=fail`...) ghi trong README của mỗi repo.
- **Tải ban đầu:** mỗi game dưới 8 MB.
- **Chạy thử:** chạy trên điện thoại trước khi nộp. Có thể đăng bản build thành artifact riêng tư để mở trên điện thoại.
- **Hiệu năng trên điện thoại (bài học 12/10):** Graphics của Phaser được dựng lại mỗi khung hình (mỗi góc bo tròn, mỗi hình tròn thành hàng chục điểm phải chia tam giác lại). Game #1 chỉ đạt khoảng 20 fps trên Samsung chính vì vậy: đo với CPU chậm 6 lần (gần một điện thoại tầm trung) mất 49 ms mỗi khung, Graphics chiếm khoảng 3/4. Hình tĩnh (nút, thẻ, ô bảng, khung panel, icon) vẽ một lần thành texture bằng `shapeTexture` / `setShape` / `shapeImage` trong `core/ui/shapes.ts` rồi hiện bằng Image; chỉ dùng Graphics cho hình đổi mỗi khung và ít điểm. Hình chuyển động đều (vòng quanh lõi, sao lấp lánh) là Image xoay hoặc di chuyển. Chữ bay lên khi nhấp dùng pool theo cỡ và màu, chỉ đổi nội dung chữ. Sau khi sửa: 13 ms mỗi khung ở cùng mức CPU. Kiểm tra trên điện thoại: chạm tiêu đề màn Home 5 lần để mở hộp debug (chỉ bản web và file thử trên điện thoại; bản CrazyGames tắt cách này để người chơi không mở nhầm, vẫn mở được bằng `?debug`) (fps, game ms/frame, tên chip đồ hoạ). Game ms gần hoặc trên 16 là CPU, game ms thấp mà fps vẫn thấp là GPU hoặc trình duyệt giới hạn khung hình. Lần thử thứ hai trên Samsung (tối 12/10): game 1,2 ms nhưng chỉ 40 fps, delta nhảy 16/24/33 ms, tức màn 120 Hz và phần vẽ (GPU) là giới hạn. Đã sửa trong `core/`: tắt khử răng cưa đa mẫu của canvas (antialiasGL, không mất gì vì hình đã vẽ sẵn mịn), trên điện thoại vẽ tối đa 60 khung/giây ở màn 120 Hz (`fps.limit` 95, màn 60 và 90 Hz không bị ảnh hưởng), và bộ tự hạ độ phân giải canvas `core/quality.ts` (chỉ trên điện thoại: khung trung vị chậm hơn 20 ms thì hạ 2 → 1,5 → 1,25 → 1, chỉ giữ mức thấp hơn khi thật sự nhanh hơn 15%, lưu mức đã chọn vào settings). Chạm vào hộp debug để tự hạ mức và so fps; `?fixedres` tắt bộ tự hạ. Lần thử thứ ba (23h 12/10, Galaxy với chip Xclipse 540): game 0,7–1,9 ms mỗi khung; mở file bằng Chrome được 60 fps vì Chrome chỉ cho trang này 60 nhịp/giây (dòng browser 60/s), mở trong ứng dụng Claude trình duyệt cho 120 nhịp và game vẽ 60. Cả hai đều đạt; game không còn là giới hạn. Hộp debug từ bản này đếm số khung thật sự vẽ (fps drawn) và khoảng trống dài nhất giữa hai khung, vì fps của Phaser đếm cả các nhịp bị bỏ qua.
- **Chữ trên thẻ nâng cấp (13/10):** ở dải nâng cấp trên điện thoại, mô tả được hai dòng phía trên giá; chữ tự nhỏ dần (22 xuống tối thiểu 16) tới khi vừa hai dòng, vì font trên mỗi máy rộng hẹp khác nhau (Samsung xuống dòng "Rare bodies more often when scanning" thành ba dòng đè lên giá). Cỡ chữ chỉ đổi khi chữ hoặc kích thước thẻ đổi, vì mỗi lần đổi cỡ chữ Phaser phải đo lại.
- **Mũi tên "còn nâng cấp" (13/10, người dùng):** người chơi không biết danh sách nâng cấp cuộn được. Khi còn thẻ khuất ở cuối danh sách, một mũi tên tròn nhỏ hiện ở mép phải dải nâng cấp (điện thoại dọc) hoặc mép dưới cột nâng cấp (máy tính), nhún nhẹ; chuyển vàng khi một thẻ đang khuất mua được. Chạm vào thì cuộn thêm một màn (giữ lại thẻ cuối đang thấy); kéo bắt đầu từ mũi tên vẫn cuộn như thường. Hết thẻ khuất thì ẩn. Chỉ có mũi tên phía cuối, không có mũi tên quay lại đầu, để đỡ rối.
- **Chơi lại từ đầu khi test (13/10):** bản web (bản nháp artifact và file thử trên điện thoại) có `WEB_SAVE_EPOCH` trong `src/save.ts`: đổi giá trị này rồi build lại thì lần mở tiếp theo xoá save thử (giữ cài đặt âm thanh, ngôn ngữ). Người test tự làm được bằng `#reset` cuối link (có tác dụng khi trang tải lại) hoặc dòng "reset save (tap twice)" trong hộp debug. Bản CrazyGames không có cơ chế xoá theo epoch.
- **Trước khi nộp (tối 13/10, người dùng):** Probe Fleet cấp 1 giá 300K (trước 350K). Nút xem quảng cáo nhận nâng cấp miễn phí lần đầu hiện khi có Sao chổi lần đầu (`rewarded.freeUpgrade.firstAtTier` 4, bỏ mốc phút 4), sau đó hồi 265 giây như cũ. Đề nghị "thêm 1 bản" sau khi ghép không còn là bước hướng dẫn phải bấm: thẻ thưởng đầu dải nâng cấp có viền xanh nhấp nháy trong 8 giây đề nghị (`Boost.highlight`), lần đầu dải nâng cấp cuộn về thẻ đó. Sao băng dày gấp đôi trong 2 phút đầu lượt (2–4 giây, `stars.early`), vẫn không xuất hiện khi chưa xong hướng dẫn đầu game.
- **QC cuối trước khi nộp (tối 13/10):** tsc, 45 unit test; build CrazyGames 1,72 MB, 19 file, tải trang khoảng 1,2 giây trên máy, chỉ gọi ra ngoài tới sdk.crazygames.com; bot chơi tự động màn dọc và màn ngang trên bản build (hướng dẫn đầu game bằng thao tác thật, hướng dẫn trang trí, tải lại giữa lượt giữ nguyên bảng và cấp, xoay màn hình, Space, lượt tính giờ, tới Thiên hà ở màn ngang): không lỗi console, không lỗi hiển thị; màn về đích, đi xem bộ sưu tập, về đích lượt tính giờ (cả hai hướng màn hình) chạy đúng; nâng cấp miễn phí hiện khi có Sao chổi, viền sáng của đề nghị "thêm 1 bản" không chặn thao tác, nhịp sao 2–4 giây trong 2 phút đầu rồi 4–8 giây, ẩn tab thì dừng và tắt tiếng, quà hằng ngày, Continue về lượt chính, bảng hỏi trước khi bán đều đúng. Mô phỏng 200 lượt: 57 / 48 / 39 phút (không quảng cáo / có quảng cáo / Basic Launch), tàu thu mở ở phút 1:44 (sớm hơn nhiều so với mốc 4–5 phút vì Probe Fleet cấp 1 rẻ hơn và Core Focus mạnh hơn). Còn thiếu để nộp: ảnh bìa 3 cỡ và video xem trước (mục 4.1, kế hoạch làm ở chat riêng). Đọc lại hướng dẫn chất lượng của CrazyGames (13/10, khuyến nghị, không bắt buộc): tránh phím Esc vì Esc thoát toàn màn hình (game #1 dùng Esc để tạm dừng), và cho phép bỏ qua phần hướng dẫn đầu game (game #1 chưa có). Không tìm thấy game nào trùng đúng tên "Cosmic RNG Clicker"; "Cosmic Clicker" thì có vài game nhỏ trên itch.io.
- **Ảnh bìa, video, mô tả (rạng sáng 14/10):** mọi file nằm trong `marketing/` của repo game #1.
  - Ảnh bìa 1920×1080, 800×1200, 800×800 vẽ bằng `tools/capture/cover.ts` (mở `tools/capture/cover.html?layout=landscape|portrait|square&w=` trên dev server), dùng chính hình thiên thể của game: lõi sao, chuỗi 9 cấp trên quỹ đạo, Thiên hà Mythic lớn, sao băng. Chữ duy nhất là tên game; không viền, không logo. Trang báo lỗi nếu tên game sát mép quá 24 px.
  - Video 1920×1080 và 1080×1620, 30 fps, khoảng 17,6 giây, H.264, không có luồng âm thanh. Giây đầu là ảnh bìa đứng yên (bản dọc dùng `video_start_portrait_1080x1620.png`, cùng bố cục với bìa 2:3), rồi chuyển mờ 0,3 giây sang gameplay. Quay bằng `python tools/capture/video.py <port>` khi dev server đang chạy: trang mở `?clean&fixedres#video+reset` (preset `video` trong `src/game/presets.ts`), `tools/capture/director.ts` dừng vòng lặp của game, giả đồng hồ (tween của Phaser 4 chạy theo `Date.now`, nên phải giả cả `Date.now` và `performance.now`) và chạy từng khung 33 ms, nên video đúng tốc độ thật dù trình duyệt headless chậm (CrazyGames cấm tua nhanh). Kịch bản: nhấp lõi, Scan, kéo ghép Bụi sao lên tới Hành tinh Legendary (màn ra đồ hiếm), bắt 2 sao băng (1 sao vàng), mua Core Focus, kéo 2 Hố đen thành Thiên hà Mythic. Kết quả các lần quay độ hiếm, cấp quét và bản sao được cố định để lần quay nào cũng giống nhau. Bàn tay chỉ là hình vẽ trong game (giống hướng dẫn), không phải con trỏ chuột. Khung hình chụp JPEG chất lượng 95 (PNG mất hơn 1 giây mỗi khung ở 1080p); mỗi bản quay mất khoảng 4–5 phút.
  - Một phần của phần B mục 5c đã có sớm: save dựng sẵn (`#video`), kịch bản chơi tự động (viết bằng TypeScript trong `director.ts`, chưa phải JSON), quay bằng Playwright và ffmpeg (Python, chưa phải `scripts/capture.mjs`).
  - Mô tả ngắn, mô tả đầy đủ, hướng dẫn điều khiển (máy tính và điện thoại), danh mục và tag đề xuất: `marketing/store_listing.md`. Trang tài liệu CrazyGames chỉ ghi phải có mô tả và điều khiển, không nêu giới hạn độ dài (kiểm tra 14/10); xem lại giới hạn trong form khi nộp.
- **Lỗi nút Continue (tối 13/10, người dùng báo):** Continue ở menu mở lại lượt tính giờ đang dở (hoặc đã về đích mà chưa thoát) thay vì lượt chính. Sửa: Continue luôn mở lượt chính; lượt tính giờ để dở bị bỏ như khi chọn Leave timed run.
- **Giá đồ trang trí (tối 13/10, người dùng):** giữ Earth 20 tinh thể (đúng quà hướng dẫn), mọi món khác ×2 (mức do Claude chọn): nền 160, 200, 260, 320; đồ 30–140.
- **Lỗi quà hằng ngày (tối 13/10, người dùng báo):** nhận quà ngày 1 xong thì ô ngày 2 cũng hiện dấu tích, vì sau khi nhận, chỉ số "hôm nay" trỏ sang ô ngày mai. Sửa trong `core/` (`dailyClaimedInCycle` ở `core/time.ts`, có test): số ô có dấu tích là số ngày đã nhận trong vòng 7 ngày; nhận xong ngày 7 thì cả 7 ô đều tích tới hôm sau.
- **Kiểm tra lỗi trước QC (13/10):** tsc, 36 unit test, build CrazyGames 1,71 MB; bot chơi tự động màn dọc và màn ngang (hướng dẫn đầu game bằng thao tác thật, bảng First merge, hướng dẫn trang trí bằng thao tác thật, chơi tới cấp 9, tải lại giữa chừng, xoay màn hình, lượt tính giờ, về Home) không có lỗi console và không lệch trạng thái bảng; preset về đích, về đích lượt tính giờ, thiên thể ẩn, Board full đều chạy đúng. Sửa 3 lỗi: (1) lần ghép đầu ra Epic thì gợi ý "giữ độ hiếm" hiện trước bảng First merge, nay chờ sau bảng; (2) chuỗi 2 hàng làm màn dọc cao chỉ còn chỗ cho 14 đồ trang trí, nay đủ 15 ở mọi khung đã thử; (3) hình vẽ sẵn bị mờ khi phóng to cửa sổ, nay vẽ lại theo độ nét mới khi đổi cỡ.
- **Asset:**
  - Dùng asset CC0 (ví dụ Kenney) hoặc tự làm. Ghi lại nguồn và giấy phép của mọi asset (file `ASSETS.md` trong repo).
  - Không được thành bản ghép asset: cần phong cách thống nhất và có phần riêng (màu, UI, nhân vật chính).
- **Nội dung:** để ở dạng dữ liệu (mục 4.6).
- **Ngẫu nhiên:** mọi phép ngẫu nhiên trong gameplay đi qua RNG có seed của bộ khung (mục 5c, A1).
- **Quảng cáo:** thời điểm gọi quảng cáo cấu hình theo portal; việc cần sửa trong bộ khung ở mục 8 của `claude/WebGame-Publishing_Brief_v1.md`. Đã sửa 12/10: `app.toMenu()` không còn gọi quảng cáo giữa chừng (CrazyGames cấm gắn quảng cáo vào nút điều hướng).
- **Trước khi nộp:** đối chiếu từng mục ở phần 4 và phần 6, và checklist mục 1.3 của hướng dẫn đăng game.
- **Khi đổi quyết định:** sửa file này trong project trước, rồi mới làm tiếp.

### Việc người dùng cần làm ngoài code

- [x] Tạo tài khoản developer CrazyGames (người dùng báo 14/10)
- [ ] Điền **Account → Billing** trên CrazyGames (địa chỉ, thông tin thuế qua Tipalti, PayPal chọn USD) trước T5 15/10 (hướng dẫn đăng game mục 2.1)
- [x] Chọn nơi để code (repo GitHub hoặc thư mục trên máy) trước khi mở chat phát triển đầu tiên
- [ ] Thử bộ khung trên điện thoại thật (artifact ở mục 10) trước T3 13/10
- [ ] Duyệt kết quả mô phỏng và mẫu hình ảnh game #1 trong ngày nhận được (11–12/10)
- [ ] Chơi thử game #1 30 phút trên điện thoại thật (14/10)
- [ ] Tạo tài khoản Poki for Developers (developers.poki.com) trước T2 19/10 (hướng dẫn đăng game mục 3.3)
- [ ] Gửi form early access YouTube Playables cho game #1 (developers.google.com/youtube/gaming/playables), vì phải chờ được chọn
- [ ] Không bắt buộc: chơi khoảng 15 phút mỗi game Mine Idle Clicker (CrazyGames) và Planet Merge (Poki), ghi vào Sổ chơi thử
- [ ] Không bắt buộc: chơi nhanh Office: Company Tycoon, Idle Pet Business, Capy Cafe trước T5 15/10, ghi vào Sổ chơi thử
- [ ] Không bắt buộc, sau khi chốt tên game #1: giữ tên TikTok (tài khoản Business) và YouTube trùng tên game; xác minh kênh YouTube để mở advanced features (mục 5c)
- [ ] Không bắt buộc, trong Basic Launch: tham gia r/incremental_games trước khi đăng game (mục 5c)
- [ ] Trước khoản thanh toán đầu tiên: kiểm tra thuế, visa, việc nhận tiền từ Yandex (mục 9)
