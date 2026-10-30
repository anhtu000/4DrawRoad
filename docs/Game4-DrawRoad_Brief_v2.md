# Game #4 – Rà soát v0, đặc tả bản thử lõi và đặc tả 20 màn

v2, 28/10/2026: thêm mục 7, đặc tả bước 2 (5 cơ chế mới, luật "chỗ đứt là hố", bảng 20 màn). Người dùng cho làm bước 2 trước khi chơi thử với người mới (bước 1 chưa đạt đủ H1–H7). Mục 1–6 giữ như v1.

v1, 19/10/2026. Đầu vào: `Game4-ThietKe.md` (v0, 15/10), `CLAUDE.md` của dự án (bản trên máy), `Game3_Fishing/docs/Poki-Huong-dan.md`, cấu hình game #3 (Phaser 4.2.1). Mọi con số về vật lý và kích thước màn trong tài liệu này là điểm xuất phát, sẽ chỉnh trong bản thử.

## 1. Tóm tắt

Tài liệu v0 đủ ý tưởng, kinh tế và lộ trình, nhưng thiếu một luật lõi: sân chơi dọc 720×1280 nhìn ngang buộc con đường phải gấp khúc nhiều tầng, mà v0 không nói xe đổi chiều thế nào. Luật này quyết định cách dựng cả 20 màn, nên phải chốt trước khi làm bất kỳ màn nào. Ngoài ra có 5 chỗ lệch với quy tắc dự án (engine, nhân vật chính, tên game, độ tuổi, đường phát hành) và vài mâu thuẫn nhỏ.

Bước thiết kế tiếp theo là bản thử lõi 6 màn (1–5 và 10), đồ họa khối, để trả lời 7 câu hỏi về cảm giác vẽ, độ ổn định vật lý và độ dễ hiểu (mục 5). Bản thử đạt thì mới làm đủ 20 màn, hình ảnh và hệ thống giữ chân.

## 2. Lộ trình thiết kế

| Bước | Việc | Đầu ra | Xong khi |
| --- | --- | --- | --- |
| 0 | Chốt khung: luật quay đầu, đường phát hành, độ tuổi, nhân vật chính, tên game | Mục 6 được trả lời; thêm game #4 vào `CLAUDE.md` | Người dùng chốt |
| 1 | Bản thử lõi: vẽ, vật lý, chấm mực, kẹo, vách quay đầu, ván ma; 6 màn đồ họa khối | Bản web chạy trên điện thoại, báo cáo đo | Đạt ngưỡng H1–H7 (mục 5.2) |
| 2 | Thiết kế đủ 20 màn trên giấy theo luật đã chốt, dựng bằng trình sửa màn; `tools/levelcheck.ts` | 20 file JSON, kiểm màn tự động xanh | Mọi màn qua levelcheck |
| 3 | Kinh tế và nhịp chơi: mô phỏng xu, thời gian từng màn, thời điểm mua xe và nâng cấp | `tools/sim.ts`, báo cáo kinh tế | Lần đầu qua 20 màn 40–50 phút; mua hết cửa hàng 80–90 phút |
| 4 | Mỹ thuật: nhân vật chính, 4 bộ cảnh, UI, thumbnail | Bảng mẫu hình, thumbnail tĩnh | Người dùng duyệt; build ≤ 3,3 MB |
| 5 | Chơi thử với 3–5 người thật | Thời gian và số lần thua từng màn | Không màn nào rơi quá 40% |
| 6 | Giữ chân đợt 1, đối chiếu checklist Poki | Bản nộp | Đủ mục 11 của hướng dẫn Poki |

Bước 2, 3 và 4 làm song song được sau khi bước 1 đạt.

## 3. Rà soát v0

### 3.1 Lỗ hổng phải sửa trước khi làm

| # | Vấn đề | Vì sao quan trọng | Đề xuất |
| --- | --- | --- | --- |
| 1 | **Không có luật xe đổi chiều.** Sân rộng 720 đơn vị, xe dài khoảng 110, chạy hết chiều ngang trong khoảng 2,5 giây. Mục 6.2 mô tả đường đèo uốn lượn, tức xe phải đi trái rồi phải nhiều lần, trong khi xe không có ga, phanh hay lái. | Không có luật này thì không dựng được màn nào ngoài màn một tầng | Xe chạm **vách đá cố định** (có biển mũi tên vòng) thì quay đầu. Nét mực không làm xe quay đầu ở v1 (so sánh ở mục 4.1) |
| 2 | **Đường đi lên nhiều tầng không dựng được bằng dốc thường.** Nhìn ngang, dốc lên tầng trên luôn nằm ngay dưới mặt tầng trên nên xe bị kẹt nóc gần đỉnh dốc. Mục 6.2 có màn đi "từ chân đồi lên dinh thự trên đỉnh". | Màn đi lên sẽ hỏng ngay ở trình sửa màn | Màn 1–11 chỉ đi xuống: sang tầng dưới bằng cách rơi qua mép. Đi lên chỉ bằng cơ chế: bí ngô bật (từ màn 12), gương (từ màn 15), hoặc dốc nhảy người chơi tự vẽ |
| 3 | **Chỗ đứt có thể thành lối tắt.** Xe rơi qua chỗ đứt có thể đáp xuống tầng dưới rồi vẫn về nhà mà không cần vẽ. | Màn bị giải bằng 0 mực | Dưới mỗi chỗ đứt là khoảng trống tới đáy màn hình hoặc vùng chết. Levelcheck thêm bước "không vẽ gì thì phải thua" |
| 4 | **Ván ma phụ thuộc lúc bấm GO.** Nếu ván chạy nhịp liên tục, kết quả tùy giây người chơi bấm GO: thành bài canh giờ phản xạ, trái với mục 6.3, và levelcheck không lặp lại được. | Màn không tất định | Nhịp ván ma bắt đầu lại từ 0 khi bấm GO. "Canh nhịp" nghĩa là vẽ tuyến sao cho xe tới đúng lúc ván hiện (thêm gờ hoặc vòng nhỏ để xe tới chậm hơn), không phải bấm đúng lúc |
| 5 | **Chơi lại mà giữ nét thì cày xu quá nhanh.** V0 giữ nét sau khi thua, nhưng không nói gì về chơi lại sau khi thắng. Nếu giữ nét, chơi lại màn 20 chỉ cần bấm GO: khoảng 25 giây cho 195 xu (390 với x2), phần cửa hàng còn lại (khoảng 4.500 xu) mua xong trong khoảng 6–10 phút. Sân trống thì mất khoảng 70 giây mỗi lượt (vẽ lại và chạy), khoảng 25–30 phút, khớp mốc 80–90 phút của mục 9.4. | Phá nhịp kinh tế | Thua thì giữ nét (như v0). Chơi lại sau khi thắng thì bắt đầu từ sân trống |
| 6 | **Gờ ảo ở khớp nét mực.** Matter.js không có thân dạng chuỗi liền như Box2D. Nét mực ghép từ nhiều hình chữ nhật thì bánh xe có thể vấp ở chỗ nối, nhất là ở nét gần nằm ngang. | Lời giải đúng vẫn thua ngẫu nhiên; người chơi thấy game lỗi | Bản thử đo riêng: thêm hình tròn ở mỗi khớp, hoặc cho các đoạn gối lên nhau; ngưỡng ở H2 |
| 7 | **Tốc độ xe và trọng lực chưa được đặt.** Với trọng lực mặc định của Matter (khoảng 1.000 đơn vị/s²) và xe chạy khoảng 200 đơn vị/s, dốc nhảy 30° chỉ đưa xe đi khoảng 35 đơn vị, không qua được hố nào ở màn 5. | Toàn bộ kích thước màn phụ thuộc vào hai số này | Đặt mục tiêu theo cảm giác (mục 4.5): dốc nhảy 30° đưa xe qua hố khoảng 200 đơn vị. Tính sơ bộ cần xe khoảng 260 đơn vị/s và trọng lực khoảng 250 đơn vị/s², tức thế giới "nhẹ" hơn mặc định 4 lần, hợp chủ đề ma |

### 3.2 Lệch với quy tắc dự án

| Mục | V0 | Quy tắc dự án | Đề xuất |
| --- | --- | --- | --- |
| Engine | Phaser 3 + Matter.js (mục 1, 10.1) | Phaser 4 + TypeScript + Vite (CLAUDE.md mục 3); game #3 dùng Phaser 4.2.1 | Dùng Phaser 4.2.1. Bản này vẫn có Matter.js đi kèm, không cần thư viện thêm |
| Nhân vật chính | Bé ma "Boo": tròn, trắng, má hồng | Không dùng nhân vật hay hình dáng gợi IP khác (CLAUDE.md 4.6; hướng dẫn Poki mục 9) | Đổi tên và dáng. Một con ma tròn trắng tên Boo dễ bị liên tưởng tới nhân vật Boo trong loạt Mario của Nintendo (ý kiến, không phải kết luận pháp lý). Gợi ý dáng: giọt nước có khăn quàng hoặc mũ đèn lồng. Gợi ý tên (chưa tra trùng): Wisp, Puff, Lumi. Chữ "Boo!" khi thua vẫn dùng được vì là tiếng kêu chung |
| Tên game | Ink Hollow | Tên chứa từ khoá thể loại và chủ đề (CLAUDE.md 4.1) | Ink Hollow không có "draw", "road" hay "ghost". Tìm nhanh ngày 19/10 không thấy game nào trùng tên này, nhưng chưa tra trực tiếp trên Poki, CrazyGames, App Store, Google Play. Phương án có từ khoá (chưa tra trùng): Ghost Ink Road, Spooky Ink Road. Vẫn tránh "Draw the Road", "Draw Bridge" |
| Độ tuổi | "Hợp khán giả nhỏ tuổi của Poki" (mục 7) | Phong cách 13+, không trẻ con; game cho trẻ em trên CrazyGames bị đưa sang site không có doanh thu (CLAUDE.md 4.6) | Nếu game #4 có khả năng phải sang đường B, giữ "dễ thương nhưng không trẻ con" như game #2: nét gọn, màu đêm, UI không kiểu nhà trẻ |
| Đường phát hành | Đường A (Poki) | Chọn đường trước khi code, người dùng quyết, ghi vào bảng mục 3 của CLAUDE.md. CLAUDE.md chưa có game #4 | Đã chốt A ngày 19/10 (mục 6). Rủi ro đã biết: (1) game #2 và #3 đều đang chờ Poki, mốc kiểm tra khoảng 26/10; (2) Poki đã có Draw the Road cùng lõi, và hướng dẫn Poki ghi game trùng nhiều với thể loại đã có có thể bị từ chối |

### 3.3 Mâu thuẫn nhỏ trong v0

- Mục 3.2 ghi ván ma và viền chấm tắt dần từ màn 9; bảng 6.2 và mục 8.2 ghi màn 10. Lấy màn 10.
- Ván mục (mục 3.2, "từ màn 13") không có trong bảng màn và không nằm trong "6 cơ chế" của lộ trình 11.6. Đề xuất bỏ khỏi v1, để dành cho gói lễ.
- Mục 3.5 có "bí ngô lăn" và "vạc sôi" là nguy hiểm, nhưng bảng màn không dùng; bí ngô lăn là cơ chế mới của gói Halloween 2027. Bỏ khỏi danh sách v1.
- Levelcheck bước 4 bắt màn 1–5 thắng được bằng nét thẳng nối mép, nhưng màn 5 cố ý bắt vẽ dốc nhảy. Đổi thành màn 1–4.
- Xu lần đầu qua 20 màn: tính lại từ công thức mục 9.1 được khoảng 2.500 (toàn 1 sao, không kẹo) đến 5.750 (toàn 3 sao, đủ kẹo). Con số 4.500–5.000 của v0 tương ứng trung bình khoảng 2 sao và 75–100% kẹo: hợp lý, cần mô phỏng ở bước 3.

### 3.4 Câu hỏi mở của v0 (mục 12.2): đề xuất

| Câu hỏi | Đề xuất | Lý do |
| --- | --- | --- |
| Nâng cấp chung hay riêng từng xe | Chung | Giữ tổng chi tiêu 9.350 xu; đổi xe không mất công đã nâng |
| Vẽ khi xe đang chạy | Không ở v1 | Phá tính tất định và levelcheck; có thể thành cơ chế của một gói lễ |
| Màn 14 nâng B/T lên 1,3 | Quyết sau bước 5 | Cần số rơi thật |
| Mốc ngày chơi: ngày có chơi hay ngày liên tiếp | Ngày có chơi (giữ v0) | Không phạt người lỡ ngày, hợp tinh thần Poki |
| Trăng tròn mở cùng lúc hay mở dần | Cùng lúc (giữ v0) | Người kẹt có màn khác để chơi |

## 4. Luật bổ sung (dùng trong bản thử)

### 4.1 Xe quay đầu

| Phương án | Ưu | Nhược |
| --- | --- | --- |
| **A. Chỉ vách cố định làm xe quay đầu** (đề xuất) | Đọc được ngay; người thiết kế kiểm soát tuyến; levelcheck đơn giản | Ít lời giải sáng tạo |
| B. Cả nét mực dựng đứng (dốc hơn 70°) cũng làm xe quay đầu | Thêm cách giải: vẽ tường để xe quay lại nhặt kẹo | Nhiều lời giải ngoài ý muốn, khó đặt T, khó dạy; xe chạm nét lệch góc dễ lật thay vì quay |

Bản thử làm A, có cờ `?inkturn` để thử B. Nếu B hay thì để dành làm cơ chế mới cho một gói sau.

Chi tiết A: vách là khối đá thẳng đứng có biển mũi tên vòng, chỉ đặt ở cuối tầng. Xe chạm vách thì dừng 0,15 s, lật hình, chạy chiều ngược lại. Lần đầu xe quay đầu (màn 2) có hiệu ứng nhỏ, không cần chữ hướng dẫn.

### 4.2 Quy tắc dựng màn

- Mặt đường các tầng cách nhau khoảng 200 đơn vị (xe cao khoảng 75, đường dày 30, còn khoảng 170 chỗ trống).
- Xuống tầng: xe rơi qua mép cuối tầng, đáp xuống đoạn tầng dưới kéo dài quá mép tầng trên, chạy tới vách rồi quay đầu. Không dùng dốc nối hai tầng: dốc xuống luôn đè lên khoảng trống của tầng dưới đúng chỗ xe quay đầu.
- Đi lên: chỉ bằng bí ngô bật, gương, hoặc dốc nhảy tự vẽ (mục 3.1, dòng 2).
- Chỗ đứt của các tầng nên xếp chồng thành một "cột vực" chung, để rơi qua chỗ đứt nào cũng ra đáy màn hình.
- Vùng cấm: trên y = 160 (lọ mực, vùng nút Poki) và dưới y = 1.120 (các nút). Sân chơi thật khoảng 720×960.

### 4.3 Ván ma

- Nhịp bắt đầu lại khi bấm GO: hiện 1,6 s, mờ 1,2 s (chu kỳ 2,8 s). Lúc đang vẽ, ván vẫn nhấp nháy theo đúng nhịp đó (tính từ lúc vào màn) để người chơi thấy.
- Vẽ đè lên ván ma luôn được, tốn mực như thường.
- Mức chuẩn T đo theo lời giải canh nhịp (ít mực hơn). Vẽ đè vẫn thắng nhưng thường chỉ 2 sao.

### 4.4 Chơi lại

- Thua: nét giữ nguyên, sửa và chạy lại (như v0).
- Thắng rồi chơi lại (từ màn kết quả hoặc bản đồ): sân trống.
- Không có xem lại lời giải hay nhất ở v1.

### 4.5 Mục tiêu vật lý (đo trong bản thử, chưa phải hằng số Matter)

| Mục tiêu | Giá trị | Ghi chú |
| --- | --- | --- |
| Tốc độ tối đa trên mặt phẳng | Khoảng 260 đơn vị/s | Xe đi hết chiều ngang sân trong khoảng 2,5 s |
| Dốc nhảy 30°, dài khoảng 90 | Bay khoảng 230 đơn vị, đỉnh cao khoảng 35, bay khoảng 1 s | Cần trọng lực khoảng 250 đơn vị/s² (Matter mặc định khoảng 1.000) |
| Dốc leo được | 40° thì leo, 45° thì trượt | Theo mục 3.4 của v0 |
| Rơi một tầng (200) | Không lật, nảy nhẹ | Khoảng 1,3 s với trọng lực trên |
| Bước vật lý | Cố định 1/60 s | Tách khỏi tốc độ khung hình |
| Kết quả lặp lại | Cùng nét, cùng máy: 100/100 lượt giống nhau | Khác trình duyệt có thể lệch nhỏ vì phép tính số thực, nên cần kiểm có nhiễu ±2 (H2) |

## 5. Đặc tả bản thử lõi

### 5.1 Phạm vi

Có: vẽ bằng ngón tay và chuột, làm mượt RDP sai số 3, hút đầu nét vào mép đường trong bán kính 18, hoàn tác, xóa hết, GO (kèm phím Space/Enter, Z, R), lọ mực có vạch T, điểm chữ S và sao, kẹo, vách quay đầu, ván ma, màn kết quả (sao, thanh mực, "còn thiếu X mực để lên 3 sao"), chơi lại, chuyển màn, lớp debug `?debug` (thân vật lý, fps, thời gian mỗi khung, nhật ký lượt thử).

Không có: xu, cửa hàng, xe khác, xưởng, SDK, quảng cáo, nhạc nền (chỉ 3–4 tiếng hiệu ứng tạm), hình hoàn thiện, đa ngôn ngữ, lưu tiến trình (trừ màn đang chơi), trình sửa màn đầy đủ (màn viết tay bằng JSON).

Dựng trên bộ khung `core/` chép từ game #1 (theo quy ước `sync-core`), Phaser 4.2.1, trong thư mục `D:\Projects\GameMaking\Game4_DrawRoad`. Bản thử trên điện thoại xuất thành một file HTML như game #3.

### 5.2 Câu hỏi cần trả lời và ngưỡng đạt

| # | Câu hỏi | Đo thế nào | Đạt khi |
| --- | --- | --- | --- |
| H1 | Vẽ trên điện thoại có đủ chính xác không | 3–5 người mới, màn 1–3, điện thoại thật | Màn 1 thắng trong ≤ 2 lượt ở ≥ 90% người; không ai phàn nàn nét lệch khỏi ngón tay |
| H2 | Vật lý có ổn định không | Lời giải mẫu chạy 100 lượt; thêm nhiễu ±2 đơn vị mỗi điểm | 100/100 khi không nhiễu; ≥ 95/100 khi có nhiễu; 0 lần vấp ở nét gần nằm ngang |
| H3 | Màn có đọc được trong 2 giây không | Hỏi người thử "cần vẽ ở đâu" ngay khi màn hiện | ≥ 4/5 người chỉ đúng ở màn 1–5 |
| H4 | Vạch mức chuẩn có tự hiểu không | Sau màn 4 hỏi "vạch vàng là gì" | ≥ 3/5 người trả lời đúng ý "dưới vạch là 3 sao" |
| H5 | Hiệu năng | Hộp debug trên Samsung của người dùng | 60 fps khi vẽ và khi xe chạy; thời gian game mỗi khung dưới 8 ms |
| H6 | Nhịp lượt thử | Nhật ký lượt thử | Màn 1–5: mỗi lượt (vẽ, chạy, kết quả) 10–25 s; xong màn 1–5 trong khoảng 3 phút |
| H7 | Ván ma có tạo lựa chọn thật không | Màn 10: đếm người canh nhịp và người vẽ đè | Ít nhất 1–2 người tự nghĩ ra cách canh nhịp. Nếu ai cũng vẽ đè thì ván ma chỉ là "thuế mực", phải đổi |

Ghi thêm: có ai thấy luật quay đầu khó hiểu không, xe lật khi rơi tầng bao nhiêu lần.

### 5.3 Sáu màn

Toạ độ trên sân 720×1280, gốc ở góc trên trái, y tăng xuống dưới; "y" là mặt đường. Mọi số sẽ chỉnh sau khi đặt vật lý (mục 4.5); T và B tính lại bằng lời giải mẫu thật.

| Màn | Dạy gì | Bố cục | Chỗ đứt | Kẹo | Lời giải mẫu | T / B (ước) | Kiểm riêng |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 Cổng nghĩa trang | Vẽ nối, bấm GO | Một tầng y = 720; xe ở x = 80; nhà ở x 600–700 | x 300–420, phẳng, rộng 120 | 0 | 1 nét thẳng | 130 / 390 (×3,0) | Nét thẳng thắng; không vẽ thì thua |
| 2 Cầu gỗ cũ | Nhiều nét; lần đầu thấy vách quay đầu | Tầng 1 y = 520 (x 40–300 và 400–600); rơi xuống tầng 2 y = 720 (x 420–700, vách ở 700), quay trái; đoạn cuối y = 760 (x 60–300), nhà bên trái | A: x 300–400, phẳng; B: x 300–420, hạ 40 (dốc khoảng 18°). A và B chồng thành một cột vực | 0 | 2 nét thẳng | 250 / 700 (×2,8) | Rơi tầng không lật |
| 3 Kẹo đầu tiên | Kẹo; vẽ gấp lên để xe chạm kẹo | Như màn 2, lật trái phải; chỗ đứt 2 rộng 180 | 1: rộng 100, phẳng; 2: rộng 180, phẳng | 1, lơ lửng giữa chỗ đứt 2, cao hơn mặt đường 140 | Nét thẳng ở chỗ 1; nét gấp lên khoảng 50 ở chỗ 2 (dốc khoảng 29°) | 340 / 880 (×2,6) | Nét thẳng thắng nhưng không có kẹo |
| 4 Đồi dốc | Chỗ đứt trên dốc; vòng xuống thấp nhặt kẹo; giới hạn dốc leo | Tầng 1 bắt đầu y = 400, đổ dốc 25° từ x 200 tới 520; rơi xuống tầng 2 y = 760 | 1: trên dốc, x 320–420; 2: x 200–420, phẳng, rộng 220 | 2: một hơi dưới dây cung chỗ 1; một ở giữa chỗ 2, thấp hơn mặt đường khoảng 55 | Võng nhẹ ở chỗ 1; chữ U sâu khoảng 75 ở chỗ 2 (thành dốc khoảng 34°) | 460 / 1.100 (×2,4) | Chữ U dốc hơn 40° thì xe kẹt; nét thẳng thắng nhưng không có kẹo |
| 5 Nhảy qua mộ | Dốc nhảy; vệt chấm dự đoán khi giữ GO | Tầng 1 y = 520; hố x 280–480 có bia mộ (khối đá) ở x 360–400 nhô cao 50; rơi xuống tầng 2 có một chỗ đứt nhỏ | 1: hố 200, bia mộ chặn nét thẳng; 2: rộng 180 | 2: một trên đường bay qua hố; một như màn 3 | Dốc nhảy khoảng 30°, dài khoảng 90 trước mép hố; nét gấp ở chỗ 2 | 330 / 730 (×2,2) | Nét thẳng bị bia mộ cắt nên thua (màn 5 miễn bước 4 của levelcheck); cầu vòng qua bia mộ vẫn thắng, khoảng 940 điểm (2 sao) |
| 10 Ván ma | Ván ma: canh nhịp hay vẽ đè; viền chấm bắt đầu tắt | 3 tầng y = 480 / 700 / 920; ván ma dài 160 nối chỗ đứt ở tầng 2 | 1: tầng 1, rộng 120; 2: ván ma 160; 3: tầng 3, rộng 160 | 2: một trên ván ma; một như màn 3 ở chỗ 3 | Ở chỗ 1 vẽ một gờ nhỏ để xe tới ván ma đúng lúc ván hiện; không vẽ đè ván | 350 / 630 (×1,8) | Vẽ đè ván vẫn thắng, khoảng 2 sao; bấm GO ở các thời điểm khác nhau cho cùng kết quả |

Màn 6–9 (sương ma, dơi) để sang bước 2: hai cơ chế này không đổi cách vẽ hay vật lý, ít rủi ro hơn ván ma.

### 5.4 Ghi chú dựng

- Nét mực: polyline sau RDP thành các đoạn chữ nhật dày 14, thêm hình tròn bán kính 7 ở mỗi khớp; thử phương án đoạn gối nhau nếu H2 chưa đạt.
- Xe: thân và 2 bánh tròn nối bằng ràng buộc có lò xo (giảm xóc). "Động cơ" là đặt vận tốc góc của bánh về giá trị mục tiêu với mô-men giới hạn mỗi bước, vì Matter không có khớp động cơ.
- Kẹo: cảm biến (sensor) chỉ tính va chạm với thân và bánh xe, không tính nét mực.
- Quay đầu: cảm biến dọc mặt vách; xe chạm thì đổi dấu vận tốc góc mục tiêu.
- Nhật ký lượt thử (chỉ bản web): màn, số nét, mực, thời gian vẽ, thời gian chạy, kết quả, lý do thua. Xuất được CSV để làm bảng ở bước 5.

### 5.5 Xong khi

- 6 màn chơi được trên điện thoại thật và máy tính, không lỗi console.
- Kết quả H1–H7 ghi vào báo cáo; câu nào chưa đạt có đề xuất sửa.
- Các số ở mục 4.5 và bảng 5.3 được cập nhật theo bản thử.

## 6. Quyết định (người dùng chốt 19/10)

1. **Luật quay đầu:** A, chỉ vách cố định. Cờ `?inkturn` vẫn có trong bản thử để thử phương án B.
2. **Đường phát hành:** A, Poki, chốt ngay (không chờ mốc 26/10). Hệ quả: game #2, #3, #4 cùng chờ Poki; không đăng game #4 ở bất kỳ web nào trước khi Poki trả lời.
3. **Nhân vật chính:** đổi. Tên tạm Lumi, dáng giọt nước có khăn quàng cam; chữ "Boo!" khi thua giữ nguyên.
4. **Tên game:** đổi sang tên có từ khoá. Tên tạm **Ghost Ink Road**. Tìm trên web 19/10 không thấy game trùng; kết quả gần nhất là các trang "Ghost Ink" và "Ink Ghost" trên Pac-Man Wiki, gắn với Pac-Pix (Nintendo DS), không phải tên game ([Pac-Man Wiki](https://pacman.fandom.com/wiki/Ghost_Ink)). Còn phải tra trực tiếp trên Poki, CrazyGames, App Store, Google Play trước khi nộp.
5. **Việc tiếp theo:** dựng bản thử 6 màn ngay trong chat này.

Đã ghi vào `CLAUDE.md` (bảng mục 3, mục 5e, mục 10).

## 7. Bước 2: đủ 20 màn (28/10)

Kết quả đo (mức chuẩn, số lần thắng có nhiễu, kiểm trên trình duyệt) nằm trong báo cáo `docs/Game4-DrawRoad_Report_v5.md`. Mục này là luật và thiết kế.

### 7.1 Luật mới áp dụng cho mọi màn

- **Chỗ đứt là hố.** Xe rơi qua đường nối hai mép của một chỗ đứt rồi xuống sâu hơn 120 đơn vị là thua ("Fell off the road"), kể cả khi bên dưới có đường hoặc nét mực. Ván ma cũng tính là hố. Lý do: màn nhiều tầng xếp chồng, xe rơi qua chỗ đứt tầng trên hay đáp xuống cầu người chơi vẽ ở tầng dưới, thành lối tắt. Luật này còn làm lượt thua kết thúc sớm hơn (không phải chờ xe rơi khỏi màn hình). Sáu màn cũ vẫn qua levelcheck, kết quả thắng không đổi.
- **Chỗ đứt tuỳ chọn** (`optional`): có viền chấm nhưng không phải hố, dùng cho ngã rẽ lên tuyến kẹo (màn 7). Xe được rơi qua để đi tuyến dưới.
- Từ màn 4 mức chuẩn tính theo cách ít mực nhất (quyết định 22/10), nên màn mới đều dùng luật `cheapest`. Từ 30/10 (người dùng chọn), "cách ít mực nhất" phải thắng đủ kẹo khi mỗi điểm của nét lệch tới ±6 đơn vị (khoảng 3–4 px trên điện thoại), ít nhất 80/100 lần; trước đó chỉ ±2 và cách rẻ nhất là những mẩu mực cần chính xác từng điểm ảnh.

### 7.2 Năm cơ chế mới

Mọi cơ chế đều tất định: chạy lại với cùng nét thì cùng kết quả. Dơi và ván ma bắt đầu lại nhịp khi bấm GO; lúc đang vẽ chúng chạy theo thời gian từ lúc vào màn.

| Cơ chế | Từ màn | Luật | Số mặc định | Người chơi xử lý thế nào |
| --- | --- | --- | --- | --- |
| Sương ma | 6 | Vùng chữ nhật không vẽ được: nét bị cắt ở mép sương, phần trong sương không tốn mực. Xe đi xuyên qua. Sương vẽ đè lên xe và nét mực, có viền chấm để thấy rõ chỗ cấm | – | Vẽ vòng trên sương, hoặc vẽ dốc nhảy để xe bay qua |
| Dơi | 8 | Bay qua lại giữa hai điểm với tốc độ cố định. Chạm xe (thân, Lumi hoặc bánh) là thua ("A bat bumped you"). Nét mực không chặn dơi. Đường bay vẽ chấm mờ | Bán kính chạm 17; tốc độ 60–160 đơn vị/s tuỳ màn | Đưa xe tránh vùng dơi bay (cầu vồng lên trên dơi), hoặc canh thời điểm cho kẹo nằm gần dơi |
| Bí ngô bật | 12 | Không phải vật cản: xe chạm bí ngô là bị hất lên với vận tốc cố định (cả xe cùng vận tốc nên không lật) | Lên 560, tới 100 đơn vị/s: bay cao khoảng 370, đáp khoảng 220 phía trước trên đường cao hơn 220. Mỗi bí ngô chỉnh riêng được | Đỡ xe ở chỗ đáp (vẽ đoạn hứng), hoặc vẽ dốc vượt qua bí ngô để đi đường khác |
| Gương | 15 | Xe vào gương vào (tâm xe cách gương dưới 20 đơn vị, trong chiều cao 108) thì hiện ra ở gương ra, giữ nguyên vận tốc và chiều chạy. Một chiều. Hai gương một cặp cùng màu; gương vào có vòng xoáy, gương ra có sao lấp lánh. Không vẽ được trong khung gương | – | Vẽ đường tới gương vào, và đường tiếp sau gương ra |
| Đèn lồng và cổng | 17 | Cổng sắt chặn đường và làm xe quay đầu như vách, tới khi xe chạm đèn lồng của nó (chạm như nhặt kẹo). Khi đó cổng kéo lên và xe đi qua được. Không vẽ được trong khung cổng | – | Vẽ đường cho xe chạm đèn lồng trước khi tới cổng |

Bỏ khỏi v1 (như rà soát ở mục 3.3): ván mục, bí ngô lăn, vạc sôi.

### 7.3 Bảng 20 màn

"Hố" là số chỗ đứt (không tính chỗ đứt tuỳ chọn). Tổng 45 hộp kẹo, đúng v0.

| Màn | Tên | Hố | Kẹo | Cơ chế | Ý chính |
| --- | --- | --- | --- | --- | --- |
| 1 | Graveyard Gate | 1 | 0 | – | Vẽ nối, bấm GO |
| 2 | Old Bridge | 2 | 0 | Vách | Nhiều nét, lần đầu quay đầu |
| 3 | First Candy | 1 | 1 | Vách | Kẹo trên tầng cao, vẽ dốc lên |
| 4 | Steep Hill | 2 | 2 | Vách | Vạch mức chuẩn, chỗ đứt trên dốc |
| 5 | Grave Jump | 2 | 2 | Bia mộ | Dốc nhảy, vệt dự đoán khi giữ GO |
| 6 | Ghost Fog | 3 | 2 | Sương | **Mới:** sương; cầu vồng lên trên sương |
| 7 | Crow's Fork | 2 + 1 tuỳ chọn | 3 | Sương | Ngã rẽ: lên gờ cao vòng qua sương lấy 2 kẹo, hoặc rơi xuống tuyến dưới (ít kẹo); nhảy qua cột sương |
| 8 | Bat Flock | 3 | 2 | Dơi | **Mới:** dơi; cầu vồng lên trên đàn dơi, kẹo nằm giữa đường dơi bay phải canh lúc nhảy |
| 9 | Bell Tower | 3 | 3 | Sương, dơi bay dọc, cột đá | Nhảy qua sương lên bệ cao hơn dơi; vượt cột đá dưới trần dơi; kẹo canh giờ |
| 10 | Ghost Planks | 2 | 2 | Ván ma | **Mới:** ván ma (từ bản thử) |
| 11 | Flicker Bridge | 2 | 3 | 3 ván ma, dơi | Chuỗi ván ma: vá ngắn canh nhịp hay vẽ đè cả ván |
| 12 | Bounce Pumpkin | 2 | 2 | Bí ngô | **Mới:** bí ngô hất xe lên tầng trên |
| 13 | Pumpkin Patch | 2 | 3 | Bí ngô, sương, 2 ván ma | Bí ngô hất xe qua vực có sương, vẽ đoạn hứng |
| 14 | Whispering Woods | 4 | 3 | Sương, dơi, ván ma, bí ngô | **Đỉnh 1.** Hai cách qua vực: hứng cú hất của bí ngô (đủ kẹo) hoặc vẽ dốc vượt bí ngô và cầu dài (thiếu kẹo) |
| 15 | Magic Mirror | 3 | 2 | Gương | **Mới:** gương đưa xe từ tầng dưới lên tầng trên |
| 16 | Mirror Maze | 3 | 3 | 2 cặp gương, bí ngô, dơi | Bí ngô hất thẳng lên vào gương lơ lửng |
| 17 | Lantern Gate | 4 | 3 | Đèn lồng, cổng | **Mới:** xe chạm cổng, quay lại thắp đèn ở gờ bên kia rồi mới qua cổng |
| 18 | Bat Castle | 4 | 3 | Gương, cổng, đèn lồng, dơi | Cầu phẳng không chạm đèn lồng nên cổng đóng; phải vẽ cầu vồng |
| 19 | Road Home | 3 | 3 | Sương, ván ma, bí ngô | Ôn tập, nhẹ hơn trước màn cuối |
| 20 | Midnight Manor | 5 | 3 | Mọi cơ chế | **Đỉnh 2.** Nửa trên rồi gương đưa xuống nửa dưới; vẽ vòng dưới sương thì không thắp được đèn và cổng cuối đóng; hai cách qua vực bí ngô |

Levelcheck có thêm: màn 14 và 20 nối thẳng các mép phải thua (v0 mục 10.2 bước 4); mỗi màn có kiểm riêng cho bài học chính (ví dụ màn 18 cầu phẳng phải thua, màn 14 và 20 cách thứ hai phải thắng).

### 7.4 Lệch so với v0

- Số chỗ đứt ít hơn v0 ở màn 12, 13, 16, 18, 20 (v0: 3, 4, 4, 5, 6). Lý do: đường bay của bí ngô cần khoảng trời trống phía trên, và xe không được quay lại băng qua chỗ nó vừa bay lên (nét cầu sẽ chặn cú bay). Phần độ khó bù bằng ván ma, dơi và gương.
- Màn 12 chỉ dùng nửa giữa sân chơi (một bước lên bằng bí ngô).
- Thẻ hình 2 giây cho cơ chế mới (v0 mục 8.2) chưa làm; hiện dùng dòng gợi ý ngắn và cho vật mới nhấp nháy. Thẻ hình làm ở bước mỹ thuật.
- Trình sửa màn trong trình duyệt (`?editor`) chưa làm. Màn viết bằng JSON và xem bằng `tools/levelmap.ts` (ảnh bản đồ màn có đường đi của xe).
- Gợi ý sau 3 lần thua và bỏ qua màn sau 5 lần thua ở màn đỉnh (v0 mục 6.3) chưa làm: cần SDK quảng cáo, để sang bước 6.

### 7.5 Quy tắc dựng màn rút ra khi làm

- Vách quay đầu cách mép đường ít nhất 110 đơn vị, nếu không xe quay đầu khi còn trên đường và chạy ngược lại.
- Nét bắt đầu trong ô xuất phát của xe bị cắt, đầu nét lơ lửng làm xe vấp: đường dốc đầu tiên phải bắt đầu ngoài ô đó.
- Xe chạy nhanh vào chỗ trũng thì bay khỏi mặt nét rồi nảy khi đáp; không đặt dơi sát chỗ trũng. Khoảng hở giữa xe và dơi ít nhất 20 đơn vị.
- Kẹo canh giờ với dơi: chọn nhịp dơi để cửa sổ an toàn rộng hơn khoảng 1 giây, kiểm bằng nhiễu.
- Bí ngô: không đặt đường hay nét nào phía trên đường bay; đặt bí ngô ở tầng cao hoặc trước gương.

## 8. Nguồn

- `Game4-ThietKe.md` (v0, 15/10/2026); `CLAUDE.md` (bản trên máy); `Game3_Fishing/docs/Poki-Huong-dan.md` (mục 1 và 9); `Game3_Fishing/package.json` (Phaser 4.2.1).
- Phaser 4.2.1 có Matter.js: [physics-matter, phaser@4.2.1](https://unpkg.com/phaser@4.2.1/skills/physics-matter/SKILL.md).
- Trọng lực mặc định của Matter trong Phaser (gravity y = 1, scale 0,001) quy ra khoảng 1.000 đơn vị/s² ở 60 bước/giây; quãng bay, thời gian rơi, điểm mực và xu trong tài liệu này do Claude tính, cần kiểm lại trong bản thử.
