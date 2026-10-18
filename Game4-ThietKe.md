# Game #4 – Tài liệu thiết kế (ma dễ thương, vẽ đường bằng mực)

15/10/2026

## 1. Tóm tắt

Game #4 là puzzle vẽ đường một màn hình trong thế giới ma dễ thương: người chơi dùng một lượng mực có hạn để nối các đoạn đường đứt, rồi bé ma Boo lái xe tự chạy về căn nhà ma ấm áp. Các dịp lễ đến qua gói cập nhật theo mùa. Đi đường A (Poki), dựng trên bộ khung chung như Pond Pals.

**Pitch một câu:** "Vẽ nốt con đường bị ma tinh nghịch giấu mất, tiết kiệm mực và nhặt kẹo, đưa bé ma Boo về nhà."

| Mục | Quyết định |
| --- | --- |
| Tên tạm | **Ink Hollow** (phương án khác: Boo's Ink Road, Ghostly Lane). Cần tra trùng tên trên Poki, CrazyGames và app store trước khi chốt. Tránh mọi tên chứa "Draw the Road" hay "Draw Bridge". |
| Chủ đề | Ma dễ thương, chơi quanh năm. Halloween, Giáng sinh, Tết, Valentine, Phục sinh và mùa hè đến qua gói lễ theo mùa (mục 11.6). |
| Thể loại Poki | Drawing, Puzzle, Brain, Car (tối đa 4) |
| Nội dung | 20 màn, mỗi màn vừa một màn hình, không cuộn camera |
| Thời gian chơi mục tiêu | Lần đầu qua hết 20 màn: khoảng 45 phút; săn 3 sao, mua đủ xe và nâng cấp: tổng khoảng 80–90 phút; chế độ Trăng tròn thêm khoảng 40 phút |
| Hướng màn hình | Dọc là chính (sân chơi 9:16); ngang và desktop 16:9 dùng cùng sân chơi, hai bên là cảnh trang trí và UI |
| Tiền tệ | Một loại: xu. Nhận mỗi lần thắng màn (kể cả chơi lại) và từ hộp kẹo nhặt trên đường |
| Xe | 5 xe trong cửa hàng và 2 xe phần thưởng, khác chỉ số và kích thước; xưởng nâng cấp 4 bộ phận; ảnh hưởng tối đa khoảng 20% đến kết quả màn |
| Engine | Phaser 3 + Matter.js (có sẵn trong Phaser), bộ khung chung `core/` |
| Giữ chân D3/D7 | Đợt 1: mốc ngày chơi 3 và 7, sổ sticker ma, chế độ Trăng tròn, gợi ý miễn phí đầu ngày. Đợt 2: huy chương theo màn, Tuần lễ ma, nhà của Boo. Tất cả mở sau màn 10 hoặc màn 20 (mục 11). |

**Bốn điểm khác biệt so với các game vẽ đường đang có:**

1. Đường có sẵn, chỉ thiếu vài đoạn. Người chơi "vá" chứ không vẽ cả con đường, nên mỗi màn đọc được ngay trong 2 giây.
2. Điểm theo mực có **mức chuẩn (par)**: dùng đúng hoặc ít hơn mức chuẩn là tối đa điểm, vượt thì điểm giảm theo đường cong chữ S, không giảm đều.
3. Hộp kẹo nằm ở tuyến phụ, tạo lựa chọn "đi vòng nhặt kẹo hay đi thẳng tiết kiệm mực". Mức chuẩn được tính cho tuyến nhặt đủ kẹo.
4. Cơ chế riêng của thế giới ma dễ thương: ván ma chập chờn, sương ma không vẽ được, dơi tuần tra, bí ngô bật nảy, gương dịch chuyển.

## 2. Nghiên cứu thị trường

Thể loại vẽ đường cho xe đã đông, và Poki **đã có một game cùng lõi** (Draw the Road, ra tháng 1/2026). Cơ hội nằm ở chỗ chưa ai kết hợp vẽ đường với thế giới ma dễ thương và gói lễ theo mùa, chấm điểm theo mực có mức chuẩn, và đồ họa nhẹ chạy tốt trên điện thoại. Số liệu đọc ngày 15/10/2026.

### 2.1 Đối thủ trực tiếp (vẽ đường/cầu cho xe)

| Game | Nền tảng | Nhà phát triển | Ra mắt | Đánh giá | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| [Draw the Road](https://poki.com/en/g/draw-the-road) | Poki | Yodco Media | 01/2026 (cập nhật 06/2026) | 4,3/5 (31.378 lượt) | Vẽ đường và bấm ô theo thứ tự để ô rơi thành bệ đỡ; có sơn lại xe. Đối thủ gần nhất, cùng portal. |
| [Draw Bridge](https://www.crazygames.fr/jeu/draw-bridge-brain-game) | CrazyGames, Android | Bravestars Games | 04/2025 | 8,7/10 (3.994 lượt) | Unity WebGL, màn dọc. Vẽ cầu cứu xe qua chướng ngại. |
| [Draw Bridge Puzzle](https://www.crazygames.com/es/game/draw-bridge-puzzle) | CrazyGames, iOS, Android | Eyestorm | 07/2025 | 9,0/10 (1.043 lượt) | Unity 6, màn dọc. Một nét cầu cho xe đạp, vật lý ragdoll, tránh xe khác. |
| [Flying Road](https://www.crazygames.com/game/flying-road) | CrazyGames, Android | Funtory | 05/2024 web (Android 10/2021) | 8,9/10 (564 lượt) | Unity, màn dọc. Vẽ đường giao hàng, không làm rơi hàng. |
| [Doodle Road](https://www.crazygames.com/game/draw-play) | CrazyGames | — | — | — | Đứng đầu danh sách game vẽ phổ biến của CrazyGames. Vẽ đường từ xe đến đích. |
| [Draw Bridge – Puzzle Game](https://apps.apple.com/app/id1558771114) | iOS | Eureka Studio | — | 4,4/5 (18 nghìn lượt) | Tự nhận hơn 10 triệu người chơi; xe dễ vỡ, một nét vẽ, xe tự chạy khi nhấc tay. |
| [Draw Bridge: Save Car Puzzle](https://grand-screen.com/games/draw-bridge-save-car-puzzle/) | Android | Deneb Game Global | — | — | Hơn 780 nghìn lượt tải Google Play. |

### 2.2 Game vẽ có thước đo mực (cơ chế gần với hệ điểm của mình)

| Game | Cách chấm | Bài học |
| --- | --- | --- |
| [Happy Glass](https://www.gamedeveloper.com/design/happy-glass-design-analysis) (Lion Studios) | 1–3 sao theo lượng mực đã vẽ, ít hơn là tốt hơn; khoảng 500 màn, mỗi lượt quay vòng khoảng 5 giây | Thanh mực luôn hiện trên đầu màn hình là đủ để người chơi tự tối ưu. Trên Poki đây là game vẽ phổ biến nhất ([Poki Drawing](https://poki.com/en/drawing)). |
| [Brain It On!](https://mobygames.com/game/81409/brain-it-on) (Orbital Nine) | Mỗi màn có thời gian chuẩn và số hình tối đa; đạt các mốc thì thêm sao | Mốc "chuẩn" rõ ràng dễ hiểu hơn điểm tuyến tính; sao dùng để mở nhóm màn. |

### 2.3 Bức tranh trên Poki

- Trang [Drawing Games](https://poki.com/en/drawing) có hơn 30 game, chia 4 loại; loại "vẽ đường" đứng đầu với Happy Glass, Sugar Sugar 2, Love Balls.
- Top 5 theo đánh giá người chơi: Love Balls 4,5; Ant Art Tycoon 4,5; Happy Glass 4,4; Sugar, Sugar 4,3; Pixel Perfect 4,2.
- Trang [Halloween Games](https://poki.com/en/halloween) chủ yếu là dress-up, đua xe (Moto X3M Spooky Land), chạy né và kinh dị. **Không có game vẽ/puzzle nào trong top 10.** Poki cũng mô tả game Halloween là chơi quanh năm, không chỉ tháng 10.

### 2.4 Kết luận cho thiết kế

| Phát hiện | Hệ quả |
| --- | --- |
| Đối thủ web phần lớn là bản port Unity, màn dọc | Mình làm Phaser, nhắm build dưới 3 MB và màn dọc là chính; đây là lợi thế C2P. |
| Lõi "vẽ một nét, xe tự chạy" đã bão hòa | Không làm vẽ tự do cả con đường. Làm "vá đường có sẵn" + mực có mức chuẩn + tuyến kẹo. |
| Poki đã có Draw the Road cùng thể loại | Rủi ro bị từ chối vì trùng. Phải chứng minh khác biệt bằng thumbnail, tên, chủ đề và cơ chế (mục 12). |
| Halloween puzzle trên Poki đang trống | Halloween là gói lễ đầu tiên, nhắm đúng khoảng trống này; giữ phong cách "ma dễ thương" để chơi quanh năm. |
| Thanh mực và sao là quen thuộc với người chơi Happy Glass | Không cần dạy khái niệm; chỉ cần dạy mức chuẩn bằng một vạch trên thanh mực. |

## 3. Cơ chế lõi

Mỗi màn là một bức tranh đồi ma nhìn ngang, vừa trọn một màn hình: xe của bé ma ở điểm xuất phát, căn nhà ma ở đích, giữa là con đường đứt khúc. Người chơi vẽ, bấm GO, xem xe chạy; hỏng thì nét vẽ còn nguyên để sửa.

### 3.1 Vòng chơi một màn

1. **Nhìn** (1–3 s): thấy cả đường, chỗ đứt, kẹo, nguy hiểm và căn nhà.
2. **Vẽ**: kéo tay hoặc chuột để tạo nét mực. Vẽ bao nhiêu nét cũng được, miễn còn mực. Nút Hoàn tác (bỏ nét cuối, trả lại mực) và Xóa hết.
3. **GO**: xe tự chạy với lực kéo cố định. Không còn vẽ được khi xe đang chạy.
4. **Kết quả**: xe chạm cửa nhà là thắng. Hỏng thì xe tan thành làn khói "Boo!" và quay về vạch xuất phát sau 0,6 s, nét vẽ giữ nguyên.

Một lượt thử (vẽ, chạy, kết quả) dài 10–25 s ở màn dễ và 20–45 s ở màn khó.

### 3.2 Đường chính và đoạn biến mất

| Thành phần | Mô tả |
| --- | --- |
| Đường chính | Đường đá cố định, xe chạy được. Màu nâu tím, viền sáng để dễ đọc trên nền tối. |
| Đoạn biến mất (chỗ đứt) | Khoảng trống giữa hai đoạn đường chính. Có viền chấm mờ cho biết "ở đây từng có đường", để người mới hiểu ngay chỗ cần vẽ. Từ màn 9 viền chấm này tắt dần. |
| Ván ma (từ màn 9) | Đoạn đường hiện rồi mờ theo nhịp 2–3 s. Người chơi chọn: canh thời điểm, hoặc tốn mực vẽ đè lên. |
| Ván mục (từ màn 13) | Đoạn đường sập sau khi xe đi qua lần đầu; dùng khi tuyến kẹo buộc xe quay lại. |

### 3.3 Mực

- Mỗi màn có **ngân sách mực B** (đơn vị: độ dài nét, tính bằng đơn vị thiết kế của sân chơi 720×1280).
- Thanh mực là một lọ thuốc phù thủy ở đầu màn hình, có **vạch mức chuẩn T** màu vàng. Mực tụt theo thời gian thực khi vẽ.
- Hết mực thì nét dừng; không có cách mua thêm mực.
- Nét vẽ được làm mượt (thuật toán Ramer–Douglas–Peucker, sai số 3 đơn vị) trước khi tính độ dài, để tay run không bị phạt mực.
- Nét mực thành vật thể tĩnh ngay khi nhấc tay: không rơi, không cong. Quyết định này giúp mỗi lời giải ổn định và lặp lại được.
- Nét dày 14 đơn vị. Nét không được vẽ xuyên qua đường chính, nhà, hay vùng sương ma (nét bị cắt tại biên, mực không bị trừ).

### 3.4 Xe

- Xe mặc định (Bí Ngô Lăn Lóc) hai bánh, động cơ mô-men cố định, có giới hạn tốc độ. Bốn xe khác và xưởng nâng cấp ở mục 9.2–9.4. Không có ga hay phanh cho người chơi.
- Vật lý Matter.js chạy bước cố định 60 Hz, cùng đầu vào thì cùng kết quả. Điều này cần cho công cụ kiểm tra lời giải mẫu (mục 10).
- Xe mặc định leo được dốc tối đa khoảng 40° (các xe khác 36–44°); dốc hơn thì trượt lùi.
- Ở đỉnh dốc nhảy, xe bay theo quỹ đạo dễ đoán; có vệt chấm dự đoán đường bay khi người chơi giữ nút GO (chỉ ở màn 5–8 để dạy).

### 3.5 Thắng và thua

| Kết cục | Điều kiện |
| --- | --- |
| Thắng | Thân xe chạm vùng cửa nhà |
| Rơi | Xe ra khỏi đáy màn hình |
| Lật | Xe ngửa bụng quá 1,5 s |
| Kẹt | Tốc độ gần 0 trong 3 s |
| Chạm nguy hiểm | Dơi, bí ngô lăn, vạc sôi (hiệu ứng khói, không có va chạm bạo lực) |

Không giới hạn số lần thử, không có mạng sống. Màn đã thắng luôn chơi lại được.

## 4. Chấm điểm theo mực

Dùng mực đến mức chuẩn T thì được tối đa 1.000 điểm; dùng ít hơn T cũng không được thêm. Vượt T thì điểm giảm theo đường chữ S: lãng phí một chút gần như không mất điểm, lãng phí vừa phải mất nhanh, gần cạn mực thì chạm sàn 400.

### 4.1 Công thức

```latex
x = \min\left(1, \max\left(0, \frac{u - T}{B - T}\right)\right), \quad s = x^2 (3 - 2x), \quad \text{Điểm mực} = 1000 - 600\,s
```

- u: mực đã dùng; T: mức chuẩn; B: ngân sách mực của màn.
- x chuẩn hóa phần vượt theo khoảng dư của từng màn, nên đường cong giống nhau ở mọi màn dù B khác nhau.
- s là hàm smoothstep: phẳng ở hai đầu, dốc ở giữa.

Ví dụ một màn có T = 600 và B = 1.200 (bản Docs có biểu đồ của bảng này):

| Mực đã dùng | 300–600 | 660 | 720 | 780 | 840 | 900 | 960 | 1.020 | 1.080 | 1.140 | 1.200 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Điểm mực (chữ S) | 1.000 | 983 | 938 | 870 | 789 | 700 | 611 | 530 | 462 | 417 | 400 |
| Nếu giảm tuyến tính | 1.000 | 940 | 880 | 820 | 760 | 700 | 640 | 580 | 520 | 460 | 400 |

### 4.2 Mức chuẩn T đến từ đâu

- Người thiết kế vẽ **lời giải mẫu nhặt đủ kẹo** trong trình sửa màn. Công cụ đo độ dài sau làm mượt và đặt T = độ dài mẫu × 1,10 (10% cho tay người).
- Nếu người chơi tìm ra lời giải ngắn hơn T, họ vẫn chỉ được 1.000. Đây là "mức dùng tối thiểu để có điểm cao nhất".
- B = T × hệ số dư của màn (bảng ở mục 6). Hệ số dư càng nhỏ thì màn càng khó. T và B luôn đo bằng xe mặc định chưa nâng cấp (mục 9.4).

### 4.3 Sao và tổng điểm

| Kết quả | Điều kiện | Tương ứng ở mực |
| --- | --- | --- |
| 3 sao | Điểm mực từ 950 | Vượt T tối đa khoảng 18% khoảng dư |
| 2 sao | Điểm mực từ 700 | Vượt T tối đa một nửa khoảng dư |
| 1 sao | Xe về đến nhà | Mọi mức mực |

- Sao chỉ tính theo mực, để mục tiêu "vẽ gọn" rõ ràng. Kẹo là mục tiêu riêng (mục 5).
- **Tổng điểm màn** = điểm mực + 100 cho mỗi hộp kẹo (tối đa 3 hộp, tức tối đa 1.300). Lưu điểm cao nhất của từng màn.
- Màn hình kết quả hiện thanh mực với vạch T và chỗ người chơi dừng, kèm câu ngắn: "Chỉ cần ít hơn 40 mực nữa là 3 sao!" để mời chơi lại.

## 5. Hộp kẹo

Mỗi màn có 0–3 hộp kẹo đặt ngoài tuyến ngắn nhất; nhặt được thì +100 điểm và +xu (mục 5.3). Kẹo tạo ra lựa chọn thật: đi vòng tốn mực hơn tuyến thẳng, nhưng mức chuẩn T được tính cho tuyến nhặt đủ kẹo, nên người giỏi được cả 3 sao lẫn đủ kẹo.

### 5.1 Quy tắc

- Kẹo chỉ được nhặt khi **thân xe** chạm hộp; nét mực chạm hộp không tính. Đây là nghĩa của "vẽ đúng".
- Hộp kẹo lơ lửng, nhún nhẹ, phát sáng cam; khi nhặt thì nổ pháo giấy, bay về góc màn hình và cộng số.
- Thắng màn mới nhận xu từ kẹo đã nhặt; thua thì kẹo trả về chỗ cũ. Chơi lại vẫn nhặt được và vẫn có xu; hộp chưa nhặt lần nào có viền vàng để người chơi biết còn thưởng sưu tập.
- Một màn có tối đa 3 hộp. Toàn game có 45 hộp (bảng màn ở mục 6).

### 5.2 Các kiểu đặt hộp

| Kiểu | Cách nhặt | Từ màn |
| --- | --- | --- |
| Trên mặt đường, hơi cao | Vẽ một gờ nhỏ để xe nảy lên | 3 |
| Tuyến phụ thấp | Vẽ đường vòng xuống dưới rồi leo lên lại | 4 |
| Trên không | Vẽ dốc nhảy đúng góc | 5 |
| Sau sương ma | Vẽ vòng qua vùng không vẽ được | 6 |
| Giữa đường dơi bay | Canh dốc để xe qua lúc dơi ở xa | 8 |
| Sau gương dịch chuyển | Đưa xe vào gương để sang nửa kia màn hình | 16 |

### 5.3 Kẹo đổi ra xu

Mỗi hộp kẹo nhặt được trả 15 xu mỗi lượt thắng, kể cả khi chơi lại; hộp nhặt lần đầu thêm 30 xu thưởng sưu tập. Xu dùng mua xe, nâng cấp và đồ trang trí (mục 9.1–9.4).

## 6. Thiết kế 20 màn

Màn 1–5 dễ và dạy từng kỹ năng vẽ; từ màn 6 xen kẽ trung bình và khó; màn 14 và 20 là hai đỉnh. Mọi cơ chế mới được giới thiệu ở một màn trung bình rồi mới xuất hiện trong màn khó, để người chơi không phải vừa học vừa vượt thử thách.

Điểm độ khó thiết kế (1–10), sẽ hiệu chỉnh theo playtest (bản Docs có biểu đồ cột):

| Màn | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Độ khó | 1,0 | 1,4 | 1,8 | 2,3 | 2,8 | 3,6 | 5,2 | 4,0 | 5,8 | 4,4 | 6,3 | 4,8 | 6,8 | **8,8** | 5,0 | 7,0 | 5,4 | 7,6 | 5,8 | **9,6** |

### 6.1 Đòn bẩy độ khó

- **Hệ số dư mực B/T**: từ 3,0 (màn 1) xuống 1,2 (màn 20). Đây là đòn bẩy chính và dễ chỉnh nhất.
- **Số chỗ đứt**: 1 đến 6.
- **Độ chính xác**: góc dốc nhảy, khoảng hở giữa nguy hiểm.
- **Số cơ chế kết hợp**: 0 ở màn dễ, 1 ở màn trung bình, 2–3 ở màn khó, 4 trở lên ở màn đỉnh.

### 6.2 Bảng màn

Sân chơi dọc 720×1280: con đường uốn lượn kiểu đường đèo, xen kẽ từ đỉnh đồi xuống chân đồi và từ chân đồi lên dinh thự trên đỉnh.

| Màn | Tên | Mức | Chỗ đứt | B/T | Kẹo | Cơ chế / ý tưởng chính | Thời gian lần đầu (phút) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Cổng nghĩa trang | Dễ | 1 | 3,0 | 0 | Một chỗ đứt phẳng; bàn tay ma vẽ mẫu | 0,3 |
| 2 | Cầu gỗ cũ | Dễ | 2 | 2,8 | 0 | Hai chỗ đứt, một chỗ lệch bậc xuống; dạy vẽ nhiều nét | 0,5 |
| 3 | Kẹo đầu tiên | Dễ | 2 | 2,6 | 1 | Giới thiệu kẹo: vẽ gờ cho xe nảy lên | 0,6 |
| 4 | Đồi dốc | Dễ | 2 | 2,4 | 2 | Chỗ đứt trên dốc (giới hạn 40°); kẹo ở tuyến vòng thấp | 0,8 |
| 5 | Nhảy qua mộ | Dễ | 2 | 2,2 | 2 | Hố rộng phải vẽ dốc nhảy; vệt chấm dự đoán đường bay | 1,0 |
| 6 | Sương ma | Trung bình | 3 | 2,0 | 2 | **Mới:** vùng sương không vẽ được | 1,5 |
| 7 | Ngã ba con quạ | Khó | 3 | 1,6 | 3 | Hai tuyến; tuyến cao có kẹo nhưng phải vòng qua sương | 2,5 |
| 8 | Đàn dơi | Trung bình | 3 | 1,9 | 2 | **Mới:** dơi bay tuần tra ngang | 1,5 |
| 9 | Tháp chuông | Khó | 3 | 1,55 | 3 | Dơi bay dọc + sương + dốc nhảy | 3,0 |
| 10 | Ván ma | Trung bình | 3 | 1,8 | 2 | **Mới:** ván ma hiện/mờ theo nhịp; viền chấm bắt đầu tắt | 2,0 |
| 11 | Cầu chập chờn | Khó | 4 | 1,5 | 3 | Chuỗi ván ma + dơi; chọn canh nhịp hay tốn mực vẽ đè | 3,0 |
| 12 | Bí ngô bật | Trung bình | 3 | 1,75 | 2 | **Mới:** bí ngô nảy hất xe lên cao | 2,0 |
| 13 | Vườn bí | Khó | 4 | 1,45 | 3 | Bí ngô nảy + ván ma + sương; cần góc chính xác | 3,5 |
| 14 | Rừng thì thầm | **Đỉnh khó** | 5 | 1,25 | 3 | Sương + dơi + ván ma + bí ngô nảy; mực rất sát | 5,0 |
| 15 | Gương thần | Trung bình | 3 | 1,7 | 2 | **Mới:** cặp gương dịch chuyển; màn thở sau đỉnh 14 | 2,0 |
| 16 | Mê cung gương | Khó | 4 | 1,4 | 3 | Gương + dơi + bí ngô nảy | 3,5 |
| 17 | Cổng đèn lồng | Trung bình | 4 | 1,65 | 3 | **Mới:** xe chạm đèn lồng thì cổng sắt mở | 2,0 |
| 18 | Lâu đài dơi | Khó | 5 | 1,35 | 3 | Đèn lồng + gương + dơi | 4,0 |
| 19 | Đường về | Trung bình | 4 | 1,6 | 3 | Ôn tập nhẹ, cảnh đẹp, nhiều kẹo; lấy đà trước màn cuối | 2,0 |
| 20 | Dinh thự nửa đêm | **Đỉnh khó** | 6 | 1,2 | 3 | Mọi cơ chế; xe đi hết nửa trên rồi gương đưa xuống nửa dưới | 6,0 |

Tổng: 45 hộp kẹo; khoảng 46 phút để qua hết 20 màn lần đầu (ước lượng, cần playtest). Ở mốc 3 phút, người chơi đang ở màn 5–6, vừa gặp cơ chế mới đầu tiên.

### 6.3 Quy tắc cho màn đỉnh (14 và 20)

- Có ít nhất hai lời giải thắng được; chỉ lời giải nhặt đủ kẹo mới đạt T.
- Không dùng thử thách canh giờ từng khung hình: khó ở chỗ nghĩ ra tuyến, không ở phản xạ.
- Sau 3 lần thua hiện nút Gợi ý 🎬 (nét mờ của một đoạn lời giải). Sau 5 lần thua hiện thêm Bỏ qua màn 🎬. Nếu người chơi rời game khi đang kẹt, ngày hôm sau được một gợi ý miễn phí (mục 11.3). Cả hai dựa vào số lần thua, không dựa vào đồng hồ.
- Thắng màn đỉnh có hoạt cảnh riêng: màn 14 tặng vệt mực vàng trăng (không bán trong cửa hàng); màn 20 có bữa tiệc kẹo của các bé ma trong dinh thự và pháo hoa.

## 7. Mỹ thuật, âm thanh và an toàn nội dung

Phong cách là "ma dễ thương": ấm, sáng, vui, không đáng sợ. Mục tiêu là hợp khán giả nhỏ tuổi của Poki và chơi được quanh năm, không chỉ tháng 10.

### 7.1 Hình ảnh

| Hạng mục | Hướng đi |
| --- | --- |
| Bảng màu | Nền tím than và xanh đêm, điểm nhấn cam bí ngô, vàng đèn lồng, xanh ngọc phát sáng. Tránh nền gần `#83FFE7`. |
| Nét vẽ | Vector phẳng, viền dày, góc tròn; cùng một bộ cọ cho mọi asset |
| Nhân vật | Nhân vật chính là bé ma Boo (tròn, trắng, má hồng) lái xe; xe nào cũng có mắt to biết chớp. Ma, dơi, mèo đen đều cười hoặc tròn mắt, không nhe nanh |
| Nét mực | Mực tím phát sáng, đầu bút có tia lấp lánh; vệt mực trong cửa hàng đổi màu |
| Thắng | Cửa nhà mở, ánh vàng tràn ra, pháo giấy và kẹo bay |
| Thua | Xe tan thành làn khói kèm chữ "Boo!", không có vỡ nát hay cháy nổ |
| Nền từng màn | 4 bộ cảnh: nghĩa trang dễ thương (1–5), rừng ma (6–10), vườn bí ngô (11–15), lâu đài và dinh thự (16–20) |

### 7.2 Âm thanh

- Nhạc nền nhẹ kiểu "hộp nhạc ma", một vòng 60–90 s cho mỗi bộ cảnh.
- Tiếng vẽ (bút quẹt), tiếng xe nổ bành bạch, tiếng "pop" khi nhặt kẹo, tiếng chuông cửa khi thắng.
- Nút tắt nhạc và tắt hiệu ứng riêng; tự tắt tiếng khi quảng cáo chạy (bộ khung đã có).

### 7.3 Danh sách kiểm nội dung (theo mục 9 của hướng dẫn Poki)

- [ ] Không máu, xương, vết thương; xương người chỉ dùng dạng đồ trang trí hoạt hình nếu cần, ưu tiên bỏ hẳn.
- [ ] Không jump scare, không âm thanh la hét; không chủ đề kinh dị kéo dài.
- [ ] Không rượu, thuốc lá, cờ bạc (kể cả vòng quay may mắn).
- [ ] Không nhân vật, logo hay hình dáng gợi IP khác (ví dụ không dùng ma, bí ngô hay dinh thự giống phim nổi tiếng).
- [ ] Mọi asset tự làm hoặc có giấy phép, ghi vào `ASSETS.md`; ảnh có dùng AI thì chỉnh tay và giữ lịch sử prompt.

### 7.4 Thumbnail

- Bé ma Boo lái xe bí ngô bay qua khoảng trống trên một nét mực tím phát sáng, phía sau là căn nhà sáng đèn và mặt trăng lớn.
- Không chữ; nền tím đậm và cam, tương phản mạnh; xem lại ở cỡ 94×94 px.
- Thumbnail động (cho Soft Release): 3 cảnh 1,5 s: vẽ nét mực, xe lao qua nhặt kẹo, cửa nhà mở.

## 8. UX, điều khiển và hướng dẫn

Người mới mở game là vào thẳng màn 1 với bàn tay ma đang vẽ mẫu; nét đầu tiên của họ là lúc bắt đầu chơi. Không màn tiêu đề, không chọn màn ở lần đầu.

### 8.1 Điều khiển

| Hành động | Cảm ứng | Chuột / bàn phím |
| --- | --- | --- |
| Vẽ | Kéo ngón tay | Giữ chuột trái và kéo |
| Chạy xe | Nút GO (góc dưới phải) | Nút GO, hoặc Space / Enter |
| Hoàn tác nét cuối | Nút ↶ | Nút ↶, hoặc Z |
| Xóa hết | Nút 🗑 (giữ 0,5 s) | Nút 🗑, hoặc R |
| Tạm dừng | Nút ⏸ | ESC |

- Cả game chơi được chỉ bằng chuột hoặc chỉ bằng chạm.
- Ngón tay che nét vẽ trên điện thoại: hiện kính lúp nhỏ phía trên ngón tay khi đang vẽ gần mép đường.
- Điểm đầu nét "hút" vào mép đường gần nhất trong bán kính 18 đơn vị, để nối đường liền mạch mà không cần vẽ thật chính xác.
- Chặn cuộn trang khi vẽ, bấm phím mũi tên, Space hay lăn chuột (bộ khung đã có).

### 8.2 Hướng dẫn (ít chữ)

| Màn | Dạy gì | Cách dạy |
| --- | --- | --- |
| 1 | Vẽ nối chỗ đứt, bấm GO | Bàn tay ma vẽ mẫu lặp lại; nút GO nhấp nháy sau khi nối xong. Chữ: "Vẽ đường!" |
| 2 | Vẽ nhiều nét | Hai viền chấm sáng lần lượt |
| 3 | Kẹo | Hộp kẹo nảy, mũi tên chỉ gờ cần vẽ. Chữ: "Nhặt kẹo!" |
| 4 | Vạch mức chuẩn | Lọ mực rung và vạch vàng sáng lên. Chữ: "Dưới vạch = 3 ★" |
| 5 | Dốc nhảy | Vệt chấm dự đoán đường bay khi giữ GO |
| 6, 8, 10, 12, 15, 17 | Cơ chế mới | Thẻ hình 2 giây trước khi màn bắt đầu, bỏ qua được; tối đa 4 chữ |

### 8.3 Màn hình và bố cục

- **Màn dọc**: sân chơi 720×1280 phủ kín; lọ mực và kẹo ở trên, các nút ở dưới.
- **Màn ngang và desktop 16:9**: sân chơi đặt giữa; hai bên là cảnh trăng, cây và UI (lọ mực bên trái, nút bên phải). Kiểm ở 640×360, 836×470, 1031×580.
- Vùng nút Poki ở góc trên trái trên mobile: lọ mực bắt đầu từ 25% chiều rộng, không đặt nút nào trong vùng 46×62 px (hoặc 92×64 px ở màn ≥ 1211 px).
- Bản đồ màn: con đường đêm có 20 ngôi nhà nhỏ, hiện số sao và kẹo từng màn. Chỉ mở từ màn 2 trở đi, qua nút trong menu tạm dừng hoặc sau khi thắng.

### 8.4 Màn hình kết quả

Thứ tự từ trên xuống: số sao và tổng điểm; thanh mực với vạch T; số xu nhận được (thưởng thắng màn + kẹo). Bên dưới là nút **Tiếp** (to, màu cam) và nút **🎬 x2 xu** (màu tím, cùng cỡ, đặt dưới). Nút **Chơi lại** nhỏ ở góc, để săn 3 sao.

## 9. Kinh tế, xe và quảng cáo

Một loại tiền (xu), kiếm bằng thắng màn và nhặt kẹo, kể cả khi chơi lại màn cũ; tiêu vào xe, xưởng nâng cấp và đồ trang trí. Không mua trong game, quảng cáo chỉ qua Poki SDK. Nâng cấp bị chặn ở mức ảnh hưởng khoảng 20% để mỗi màn vẫn là bài toán vẽ, không phải bài toán cày.

### 9.1 Thu nhập xu

Mỗi lần xe về đến nhà, kể cả khi chơi lại màn cũ, người chơi nhận thưởng hoàn thành cộng xu từ hộp kẹo nhặt trên đường. Thua thì không có xu, và kẹo nhặt trong lượt thua trả về chỗ cũ.

| Khoản | Công thức | Màn 1 | Màn 20 |
| --- | --- | --- | --- |
| Thưởng hoàn thành | (20 + 4 × số màn) × hệ số sao: 1 sao ×1,0; 2 sao ×1,25; 3 sao ×1,5 | 24–36 | 100–150 |
| Thưởng thắng lần đầu | Cộng thêm một lần thưởng hoàn thành, chỉ ở lần thắng đầu tiên | 24–36 | 100–150 |
| Hộp kẹo | 15 xu mỗi hộp, mỗi lượt thắng | 0 | 45 |
| Thưởng sưu tập | +30 xu cho hộp nhặt lần đầu | 0 | 90 |
| 🎬 x2 xu | Nhân đôi tổng xu của lượt (tùy chọn) | — | — |

- **Lần đầu qua hết 20 màn**: khoảng 4.500–5.000 xu, tùy số sao và số hộp nhặt được.
- **Chơi lại một màn đã giải**: 24–36 xu ở màn 1, 145–195 xu ở màn 20. Màn sau trả nhiều hơn, nên chơi lại màn khó là cách kiếm xu tốt nhất, và chơi lại để lên 3 sao cũng trả nhiều xu hơn.
- **Thử thách ngày, quà ngày chơi và Trăng tròn** (mục 11.3): thử thách ngày trả thưởng hoàn thành như chơi lại cộng 1 sticker (bỏ mức xu ×3). Quà ngày chơi trả 700 xu mỗi vòng 7 ngày. Trăng tròn trả thưởng hoàn thành của màn gốc ×1,5, khoảng 1.900–2.800 xu cho mỗi lượt qua đủ 20 màn.

### 9.2 Mẫu xe

Mỗi xe khác nhau về kích thước và cảm giác lái, nhưng chỉ số chỉ lệch tối đa ±10% so với xe mặc định. Xe nào cũng qua được mọi màn; chọn xe là chọn phong cách, không phải chọn chìa khóa. Hai xe cuối bảng không bán, chỉ nhận từ hệ thống giữ chân (mục 11.3).

| Xe | Giá (xu) | Kích thước (trục bánh, đơn vị) | Tốc độ | Leo dốc | Bám đường | Giảm xóc | Cảm giác lái |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Bí Ngô Lăn Lóc | Miễn phí | Vừa (80) | 100 | 100 | 100 | 100 | Cân bằng, dễ đoán; mọi mức chuẩn T đo bằng xe này |
| Chổi Bay Mini | 400 | Nhỏ (60) | 105 | 108 | 95 | 95 | Nhẹ, leo tốt; trục ngắn nên khe hở nhỏ cũng phải vá |
| Ma Bông Bông | 700 | Vừa (80) | 95 | 100 | 105 | 110 | Êm, đáp đất mềm, ít lật; hợp người vẽ run tay |
| Vạc Phù Thủy | 1.000 | Lớn (100) | 92 | 95 | 110 | 100 | Nặng, chắc; trục dài lăn qua khe nhỏ; leo dốc kém |
| Xe Buýt Dơi | 1.500 | Lớn (100) | 110 | 92 | 100 | 105 | Nhanh, nhảy xa; leo dốc kém |
| Đèn Lồng Ma | Không bán: quà ngày chơi thứ 7 | Vừa (80) | 102 | 105 | 105 | 105 | Cân bằng, nhỉnh nhẹ mọi mặt; đèn xe soi rộng hơn trong tuần Đêm đen |
| Trăng Bạc | Không bán: đủ 20 mảnh trăng | Nhỏ (60) | 110 | 108 | 102 | 98 | Nhanh và leo tốt nhất; trục ngắn nên phải vá kỹ từng khe |

Chỉ số tính theo phần trăm so với xe mặc định (100).

- **Kích thước** đổi cách vá đường: xe Lớn lăn qua khe dưới 30 đơn vị mà không cần mực, xe Nhỏ chỉ qua khe dưới 15. Xe Lớn cao hơn, nên tuyến bắt buộc không có trần thấp hơn chiều cao xe Lớn.
- **Leo dốc** quy ra góc: xe mặc định 40°, các xe khác 36–44°. Tuyến bắt buộc của mọi màn không dốc quá 35°.
- Xe chưa mua có nút **🎬 Lái thử** cho 1 lượt chơi (tùy chọn, có nút Đóng cùng cỡ đặt bên cạnh).
- Gói lễ thêm xe theo mùa (mục 11.6), cùng khung chỉ số ±10%.
- Màu xe, bé lái và vệt mực vẫn bán riêng như đồ trang trí, dùng được cho mọi xe.

### 9.3 Xưởng nâng cấp

Xưởng có 4 bộ phận, mỗi bộ phận 5 cấp, mỗi cấp +2% cho một chỉ số, tối đa +10%. Nâng cấp áp dụng cho mọi xe, nên đổi xe không mất công đã nâng; và tổng chi tiêu giữ ở mức một giờ chơi.

| Bộ phận | Chỉ số tăng | Tác dụng người chơi thấy |
| --- | --- | --- |
| Động cơ | Tốc độ tối đa | Nhảy xa hơn một chút, về nhà nhanh hơn |
| Hộp số | Leo dốc | Thêm khoảng 2–3° dốc leo được ở cấp tối đa |
| Lốp | Bám đường | Ít trượt trên nét mực dốc |
| Giảm xóc | Hấp thụ va chạm | Ít lật khi đáp đất hoặc chạy qua nét gồ ghề |

| Cấp | 1 | 2 | 3 | 4 | 5 | Cả 5 cấp |
| --- | --- | --- | --- | --- | --- | --- |
| Giá (xu) | 60 | 120 | 200 | 300 | 420 | 1.100 |
| Chỉ số cộng dồn | +2% | +4% | +6% | +8% | +10% |  |

Cả xưởng (4 bộ phận) tốn 4.400 xu. Khi nâng cấp, xe trong xưởng rung nhẹ và hiện thanh chỉ số cũ–mới, để người chơi thấy rõ thay đổi dù nhỏ.

### 9.4 Trần ảnh hưởng 20% và tổng chi tiêu

So với xe mặc định chưa nâng cấp, xe tốt nhất ở cấp tối đa chỉ được làm thay đổi kết quả màn khoảng 20%. Chỉ số xe lệch tối đa ±10% và nâng cấp thêm tối đa +10%, nên một chỉ số thay đổi nhiều nhất 20%. Nhưng chỉ số không quy thẳng ra kết quả, nên trần được kiểm trực tiếp trên kết quả, bằng công cụ kiểm màn trong CI (mục 10.2):

| Thước đo kết quả | Trần so với xe mặc định cấp 0 |
| --- | --- |
| Mực tối thiểu để thắng và nhặt đủ kẹo | Giảm không quá 20% |
| Thời gian từ GO đến khi về nhà | Nhanh hơn không quá 20% |
| Tỉ lệ thắng của lời giải gần đúng (lời giải mẫu có nhiễu ±6 đơn vị, 100 lượt) | Tăng không quá 20 điểm phần trăm |

- Màn nào vượt trần thì chỉnh chỉ số xe hoặc giảm mức cộng của nâng cấp, không sửa màn.
- Mức chuẩn T và ngân sách B luôn đo bằng xe mặc định cấp 0. Điểm mực chặn ở 1.000 khi chạm T, nên nâng cấp giúp chạm 3 sao dễ hơn nhưng không nâng điểm tối đa.
- Mọi xe ở cấp 0 phải thắng lời giải mẫu của mọi màn: không có màn nào bị khóa theo xe hay theo cấp nâng.

**Tổng chi tiêu và nhịp mua:**

| Nhóm | Tổng giá (xu) |
| --- | --- |
| 4 xe phải mua | 3.600 |
| Xưởng: 4 bộ phận × 5 cấp | 4.400 |
| Trang trí: 6 màu xe (50 mỗi màu), 4 vệt mực (100–200), 3 bé lái (150 mỗi bé) | 1.350 |
| **Tổng** | **9.350** |

- Lần đầu qua 20 màn kiếm khoảng một nửa số này. Phần còn lại đến từ chơi lại màn khó, săn 3 sao và thử thách hằng ngày.
- Ước tính mua hết sau khoảng 80–90 phút chơi: đủ để luôn có thứ muốn mua, nhưng không thành chuỗi cày dài kiểu game mobile. Đợt 2 thêm nhà của Boo (khoảng 6.000 xu, mở sau màn 20), chủ yếu được trả bằng xu từ Trăng tròn và chơi lại.
- Nhịp mở: nâng cấp đầu tiên (60 xu) mua được ngay sau màn 1; xe thứ hai (400 xu) quanh phút 3–4, sau màn 5. Đây cũng là lúc Player Fit Test đo mốc 3 phút.

### 9.5 Chỗ gọi `commercialBreak` (midroll)

| Tình huống | Chuỗi sự kiện |
| --- | --- |
| Thắng, bấm Tiếp | `gameplayStop` (lúc xe vào nhà) → `commercialBreak` → vào màn mới → `gameplayStart` ở nét vẽ đầu tiên |
| Bấm Chơi lại ở màn kết quả | `gameplayStop` → `commercialBreak` → `gameplayStart` |
| Mở menu tạm dừng hoặc bản đồ, rồi quay lại | `gameplayStop` khi mở → `commercialBreak` khi đóng → `gameplayStart` |

Thua giữa màn **không** dừng gameplay: xe khói "Boo!" rồi đặt lại ngay, người chơi sửa nét và chạy tiếp. Như vậy không chèn quảng cáo vào giữa chuỗi thử–sai ngắn, vốn là nhịp chính của thể loại này.

### 9.6 Nút thưởng

| Nút | Khi nào hiện | Phần thưởng |
| --- | --- | --- |
| 🎬 x2 xu | Màn kết quả, sau mỗi lần thắng | Nhân đôi tổng xu của lượt |
| 🎬 Gợi ý | Sau 3 lần thua ở cùng màn | Hiện nét mờ của một đoạn lời giải mẫu (đoạn khó nhất). Mỗi ngày một lần miễn phí cho màn đang kẹt (mục 11.3) |
| 🎬 Bỏ qua màn | Sau 5 lần thua ở cùng màn | Mở màn tiếp theo, màn này ghi 0 sao |

Quy tắc chung (đã có trong hướng dẫn Poki, mục 7.2):

- Nút thưởng màu tím, có biểu tượng 🎬; luôn có nút thường (miễn phí) cùng cỡ đặt phía trên hoặc bên cạnh.
- Quảng cáo lỗi hoặc bị chặn: không trao thưởng, không hiện thông báo tự chế.
- Một video cho một phần thưởng; phần thưởng hiện ngay kèm hiệu ứng.
- Không có bộ đếm giờ giữa các lần mời xem quảng cáo.

### 9.7 Ước tính số quảng cáo

Với khoảng 20 màn trong phiên đầu, mỗi lần thắng là một cơ hội midroll, cộng các lần mở menu và chơi lại. Ước tính 20–30 cơ hội midroll mỗi phiên đầu, và Poki tự quyết số lần chiếu thật. Rewarded x2 xu xuất hiện sau mỗi lần thắng, kể cả khi chơi lại, cộng thêm nút Lái thử xe. Mục tiêu soft release (≥ 1 quảng cáo/người chơi/ngày) nhiều khả năng đạt; cần xác nhận bằng số liệu thật.

## 10. Kỹ thuật và tuân thủ Poki

Dùng lại bộ khung chung (adapter Poki, `GameplayTracker`, storage, build theo target, `check-build`). Phần mới của game #4 là vật lý, hệ thống vẽ, định dạng màn và công cụ kiểm lời giải.

### 10.1 Kiến trúc

| Phần | Ghi chú |
| --- | --- |
| Engine | Phaser 3, vật lý Matter.js đi kèm Phaser (không thêm thư viện) |
| Vật lý | Bước cố định 1/60 s, tách khỏi tốc độ khung hình; cùng nét vẽ thì cùng kết quả. Mỗi xe một file cấu hình trong src/cars (kích thước, khối lượng, mô-men, bám, giảm xóc); nâng cấp là hệ số nhân lên các chỉ số này |
| Nét mực | Polyline sau làm mượt → chuỗi thân tĩnh hình chữ nhật dày 14 đơn vị; tính độ dài cho thanh mực |
| Màn chơi | Mỗi màn một file JSON trong `src/levels/`: đường chính, chỗ đứt, kẹo, vật thể, B, T, lời giải mẫu, số nét của lời giải mẫu. Màn Trăng tròn và biến thể Gương thần là file JSON riêng cùng định dạng |
| Trình sửa màn | Chỉ có ở bản web (`?editor`): đặt vật thể, vẽ lời giải mẫu, xuất JSON |
| Lưu tiến trình | Sao, điểm cao nhất, hộp kẹo đã nhặt theo màn, xu, xe đã mua và xe đang dùng, cấp từng bộ phận, đồ trang trí, số ngày chơi và ngày chơi gần nhất, sticker, mảnh trăng, huy chương, thanh Tuần lễ ma, đồ nhà Boo, gợi ý miễn phí đã dùng, ngôn ngữ. `localStorage` trong try/catch qua `core/storage.ts` |
| Đa ngôn ngữ | en, fr, it, de, es, tr như Pond Pals; chữ ví dụ trong tài liệu này ("Vẽ đường!") chỉ là ghi chú thiết kế, chữ thật là khóa i18n |

### 10.2 Công cụ kiểm lời giải (chạy trong CI)

`tools/levelcheck.ts` chạy vật lý không giao diện cho từng màn:

1. Lời giải mẫu phải thắng và nhặt đủ kẹo.
2. Tính lại T từ lời giải mẫu và so với JSON.
3. Kiểm B/T đúng bảng mục 6.
4. Thử lời giải "vẽ thẳng nối mép" cho từng chỗ đứt: ở màn 1–5 phải thắng (màn dễ không đánh đố); ở màn 14 và 20 phải thua.
5. Chạy lời giải mẫu 100 lần với nhiễu nhỏ (±2 đơn vị mỗi điểm) và yêu cầu thắng ít nhất 95%, để màn không phụ thuộc may rủi.
6. Chạy lời giải mẫu với từng xe (kể cả hai xe phần thưởng) ở cấp 0 và cấp tối đa: xe nào cũng phải thắng và nhặt đủ kẹo; đo ba thước ở mục 9.4 và báo lỗi nếu vượt trần 20%.
7. Chạy bước 1–6 cho 20 màn Trăng tròn và các biến thể Gương thần. Lời giải mẫu của mỗi màn gốc cũng phải thắng dưới từng luật Tuần lễ ma, trừ khi luật đó có lời giải mẫu riêng.
8. Đếm số nét của lời giải mẫu và ghi vào JSON làm ngưỡng huy chương vàng (mục 11.4).

### 10.3 Sự kiện SDK

- `gameLoadingFinished` khi tải xong màn 1.
- `gameplayStart` ở nét vẽ đầu tiên của mỗi màn, và khi bỏ tạm dừng.
- `gameplayStop` khi xe vào nhà, khi mở menu, tạm dừng hay bản đồ.
- `commercialBreak` và `rewardedBreak` như mục 9.
- Thua giữa màn không gửi sự kiện nào.
- `PokiSDK.measure('level', '<số màn>', 'start' | 'win' | 'fail')` để vẽ phễu rơi theo màn. Các sự kiện đo giữ chân theo ngày ở mục 11.5.

### 10.4 Ngân sách dung lượng

| Phần | Mục tiêu |
| --- | --- |
| Phaser + code game | khoảng 1,2 MB |
| Hình (4 bộ cảnh, atlas WebP) | ≤ 1,2 MB |
| Âm thanh (4 nhạc nền, khoảng 15 hiệu ứng) | ≤ 0,8 MB |
| Font có đủ dấu EFIGS + Thổ Nhĩ Kỳ | ≤ 0,1 MB |
| **Tổng** | **≤ 3,3 MB** (lần tải đầu ≤ 2 MB: chỉ bộ cảnh 1 và nhạc 1); sticker, huy chương và đồ nhà Boo thêm khoảng 0,3 MB, tải nền sau màn 10 |

### 10.5 Đối chiếu hướng dẫn Poki

Game #4 phải qua toàn bộ checklist mục 11 của hướng dẫn Poki. Các điểm riêng của thể loại này cần chú ý:

- [ ] Vẽ bằng chuột và chạm đều mượt ở 60 fps trên điện thoại tầm trung.
- [ ] Kéo tay để vẽ không làm cuộn hay phóng to trang (chặn `touchmove` và cử chỉ chụm).
- [ ] Không có UI ở vùng nút Poki; lọ mực không bị nút che.
- [ ] Lần chạm đầu (bắt đầu vẽ) mới gửi `gameplayStart`.
- [ ] Chặn quảng cáo: Gợi ý và Bỏ qua màn không mở được, nhưng game vẫn chơi hết được.

## 11. Giữ chân và lộ trình cập nhật

Bản gốc giữ người chơi thường đến D2–D3 nhờ 20 màn trải ra 3–4 phiên, nhưng chưa có mốc nào cho D7, và người chơi mê game hết lý do quay lại sau ngày 1. Mục 11.3–11.4 thêm 7 hệ thống, tất cả mở sau màn 10 hoặc màn 20 nên không đụng 14 phút đầu; gói lễ (mục 11.6) kéo người chơi quay lại theo mùa.

### 11.1 Móc giữ chân trong phiên

- Mỗi màn 20 giây đến vài phút, thắng là có ngay pháo giấy, sao và kẹo.
- Mục tiêu ngắn: 3 sao màn này. Mục tiêu dài: đủ 60 sao, đủ 45 hộp kẹo, mua đủ 5 xe và nâng xưởng lên cấp tối đa; sau màn 20 còn Trăng tròn, huy chương và nhà của Boo (mục 11.3–11.4).
- Màn kết quả cho biết chính xác thiếu bao nhiêu mực để lên 3 sao, mời chơi lại ngay. Chơi lại luôn có xu, nên khi kẹt ở màn khó người chơi có thể quay lại màn cũ kiếm xu, nâng cấp xe rồi thử lại.
- Mốc ăn mừng: 15, 30, 45, 60 sao mở một bé lái xe hoặc vệt mực đặc biệt.

### 11.2 Đánh giá D3/D7 của bản gốc

Trước đợt nâng cấp ở mục 11.3–11.4, bản gốc chỉ có một móc gắn với ngày là thử thách hằng ngày. Đánh giá dưới đây là ước tính từ thời gian từng màn ở bảng 6.2, chưa có số liệu người thật.

| Tầng | Móc trong bản gốc | Đánh giá |
| --- | --- | --- |
| Trong phiên | 20 màn (khoảng 46 phút), 3 sao mỗi màn, 45 hộp kẹo, xu sau mỗi lần thắng, 5 xe, xưởng nâng cấp, mốc 15/30/45/60 sao | Tốt cho phiên đầu và D1–D3 |
| Quay lại hôm sau | Thử thách hằng ngày: 1 màn đã thắng, đổi chỗ kẹo, B −10%, thưởng xu ×3 | Móc duy nhất gắn với ngày; thưởng bằng xu nên mất giá trị khi đã mua hết cửa hàng |
| Dài hạn | Gói lễ, khoảng 2 tháng một gói | Quá thưa để tác động đến D7 |
| Cố ý không làm | Điểm danh liên tiếp, đếm giờ offline | Đúng tinh thần Poki, nhưng vì thế không còn mốc nào cho D3/D7 |

**Ước tính theo kiểu người chơi:**

| Kiểu người chơi | Ngày 1 | Ngày 2 | Ngày 3 | Ngày 7 |
| --- | --- | --- | --- | --- |
| Thường (10–20 phút/ngày) | Màn 8–10 | Màn 11–14 | Màn 15–18 | Xong 20 màn từ ngày 4–5; chỉ còn thử thách ngày |
| Mê game (phiên đầu ≥ 45 phút) | Xong 20 màn | Săn 3 sao, mua xe | Chỉ còn thử thách ngày | Không còn lý do quay lại |

**Ba lỗ hổng mà mục 11.3–11.4 xử lý:**

1. Không có mốc nào cho D3 hay D7.
2. Thử thách ngày thưởng bằng xu, nên mất giá trị sau khi người chơi mua hết cửa hàng.
3. Màn 14 (đỉnh khó) rơi đúng cuối ngày 2 của người chơi thường. Phiên chơi kết thúc bằng thua liên tiếp là chỗ dễ mất người từ D2 sang D3.

### 11.3 Đợt 1: hệ thống D3/D7 trước khi nộp Poki

Bốn hệ thống nhỏ, dùng lại trình sửa màn và vật lý có sẵn, xử lý đúng ba lỗ hổng ở mục 11.2. Quy tắc chung cho cả đợt 1 và đợt 2:

- Không đụng 14 phút đầu (màn 1–10). Mỗi hệ thống mở sau màn 10 hoặc màn 20, báo một lần "Mục tiêu mới", và nút của nó chỉ hiện khi đã mở.
- Không hẹn giờ, không phạt người chơi bỏ ngày, không popup lúc vào game (giữ C2P).
- Phần thưởng là đồ trang trí hoặc xe trong khung chỉ số ±10%, không bao giờ là mực thêm.

| Hệ thống | Mở khi | Cách chơi | Phần thưởng | Lỗ hổng xử lý |
| --- | --- | --- | --- | --- |
| **Mốc ngày chơi 3 và 7** | Sau màn 10 | Đếm số ngày có thắng ít nhất một màn (theo giờ máy, đổi ngày lúc 0:00), không cần liên tiếp. Bảng 7 ô cho thấy trước mọi món quà | Ngày 1: 100 xu · ngày 2: 150 xu · **ngày 3: vệt mực Đom Đóm** · ngày 4: 200 xu · ngày 5: màu xe Bạc Ma · ngày 6: 250 xu · **ngày 7: xe Đèn Lồng Ma**. Sau ngày 7, bảng lặp lại chỉ với xu (100–300) | 1 |
| **Sổ sticker ma** | Sau màn 10, cùng thử thách hằng ngày | Thắng thử thách ngày được 1 sticker và thưởng hoàn thành như chơi lại (bỏ mức xu ×3). 28 sticker chia 4 trang × 7 theo 4 bộ cảnh; sticker kế tiếp hiện mờ để người chơi biết mình chờ gì | Đủ mỗi trang mở một món độc quyền: bé lái Ma Mèo · vệt mực Sương Bạc · màu xe Bí Ngô Vàng · mũ phù thủy cho Boo | 2 |
| **Chế độ Trăng tròn** | Sau màn 20 (nút mặt trăng trên bản đồ) | 20 phiên bản khó của 20 màn, mở cùng lúc để người chơi kẹt thì chọn màn khác. Mỗi màn: B/T thấp hơn 15% (không dưới 1,1), ván ma nhanh hơn 30%, kẹo đổi chỗ, tắt hết viền chấm; T đo lại từ lời giải mẫu mới | Thắng lần đầu được 1 mảnh trăng; đủ 20 mảnh mở **xe Trăng Bạc**. Xu mỗi lần thắng = thưởng hoàn thành của màn gốc × 1,5 | 2 và nhóm mê game |
| **Gợi ý miễn phí đầu ngày** | Sau màn 10 | Nếu lần chơi trước dừng ở một màn chưa thắng và đã thua từ 3 lần, thì sang ngày mới nút Gợi ý ở màn đó ghi "Miễn phí hôm nay" thay cho 🎬 | 1 gợi ý miễn phí mỗi ngày, kể cả ở Trăng tròn | 3 |

Ghi chú triển khai:

- **Mốc ngày chơi** đếm cả những ngày trước khi mở. Bảng hiện một lần sau khi thắng màn 10; từ đó quà của ngày được trao ở lần thắng màn đầu tiên trong ngày, ngay trên màn hình kết quả. Đếm ngày chơi thay vì ngày liên tiếp nhẹ nhàng hơn với trẻ em, đổi lại người bỏ ngày sẽ nhận quà ngày 7 muộn hơn ngày lịch thứ 7.
- **Sticker** mỗi ngày chỉ một cái, bỏ ngày không mất gì. Mỗi gói lễ thêm một trang sticker riêng, nên sổ không cạn sau 28 ngày.
- **Trăng tròn** không cần hình mới: dùng lại 4 bộ cảnh với bộ lọc màu đêm và mặt trăng lớn. Công việc chính là 20 lời giải mẫu mới và 20 file JSON. Thời gian chơi thêm khoảng 40 phút; Trăng 14 và Trăng 20 vẫn là hai đỉnh.
- **Gợi ý miễn phí** lấy đúng đoạn nét mà nút Gợi ý 🎬 vẫn hiện (mục 9.6); chỉ khác là không cần xem quảng cáo. Chỗ dự kiến dùng nhiều nhất là màn 14 vào đầu ngày 3.

### 11.4 Đợt 2: trước Soft Release

Ba hệ thống thêm mục tiêu tuần và chỗ tiêu xu sau khi mua hết xe và nâng cấp. Cùng quy tắc chung ở mục 11.3.

| Hệ thống | Mở khi | Cách chơi | Phần thưởng |
| --- | --- | --- | --- |
| **Huy chương theo màn** | Sau màn 10 (tính cả các màn đã thắng) | Mỗi màn gốc có 3 huy chương. Đồng: 3 sao. Bạc: 3 sao và đủ kẹo (màn không có kẹo thì bạc đi cùng đồng). Vàng: bạc và thắng với số nét không nhiều hơn lời giải mẫu. Tổng 60 huy chương | Đủ vàng 5 màn của một bộ cảnh: cúp trên bản đồ và một món nhà Boo không bán (4 món cho 4 bộ cảnh) |
| **Tuần lễ ma** | Sau màn 10 | Mỗi tuần (thứ Hai đến Chủ nhật) một luật mới áp vào thử thách ngày. Thanh 7 nấc: thắng thử thách ngày +1, thắng thêm 3 màn bất kỳ trong ngày +1, tối đa 2 nấc mỗi ngày | Nấc 3: xu · nấc 5: một sticker thưởng · nấc 7: món trang trí của tuần (vệt mực hoặc màu xe theo luật tuần đó) |
| **Nhà của Boo** | Sau màn 20 | Căn nhà ở đích mọi màn là nhà của người chơi. Khoảng 25 món chia 5 khu (cửa, cửa sổ, mái, vườn, sân), giá 50–600 xu, tổng khoảng 6.000 xu. Chỉ là trang trí, không đổi chỉ số | Nhà hiện ở đích mỗi màn và trong cảnh ăn mừng; xu có giá trị trở lại sau khi mua hết cửa hàng |

**Luật của Tuần lễ ma** (6 luật xoay vòng; trong mùa lễ, gói lễ thay cho luật tuần):

| Tuần | Luật | Áp vào vật lý |
| --- | --- | --- |
| Gió ma | Gió ngang đẩy xe, đổi chiều mỗi 3 s theo nhịp cố định | Thêm lực ngang lên xe |
| Mực nảy | Nét mực nảy như bí ngô bật | Tăng độ đàn hồi của nét |
| Đêm đen | Chỉ thấy rõ vùng quanh đèn xe; đường có sẵn vẫn có viền mờ để không đánh đố | Chỉ đổi hiển thị |
| Xe tí hon | Mọi xe nhỏ đi 20%, khe hở nhỏ cũng phải vá | Thu nhỏ thân xe |
| Mực hiếm | B giảm thêm 10%, nhưng kẹo trả gấp đôi xu | Đổi B và thưởng |
| Gương thần | Thêm một cặp gương dịch chuyển đặt sẵn cho từng màn | Biến thể màn làm sẵn |

Ghi chú:

- **Huy chương vàng** đo số nét, không đo mực, nên không mâu thuẫn với mức chuẩn T: điểm mực vẫn chặn ở 1.000. Ở màn dễ, vàng thường là "một nét".
- **Tuần lễ ma** cần ít nhất 4 ngày chơi trong tuần để về đích, nên lỡ 1–3 ngày vẫn kịp. Món của mỗi tuần quay lại ở lần xoay vòng sau, nên không ai mất viễn vĩnh một món. Mỗi luật là tham số vật lý hoặc hiển thị, trừ Gương thần cần biến thể màn làm bằng trình sửa màn.
- **Nhà của Boo** mở sau màn 20 để không tranh xu với xe và xưởng trong lần chơi đầu. Asset thêm khoảng 0,2 MB, tải nền sau màn 10.

### 11.5 Kỳ vọng theo mốc và cách đo

Sau hai đợt, mỗi mốc D2, D3, D7 có ít nhất một lý do quay lại cho cả người chơi thường lẫn người chơi mê game. Đây là kỳ vọng thiết kế, cần xác nhận bằng số liệu thật.

| Mốc | Người chơi thường | Người chơi mê game |
| --- | --- | --- |
| D1 → D2 | Màn còn dang dở; gợi ý miễn phí nếu đang kẹt; sticker của hôm nay; quà ngày chơi 2 | Trăng tròn còn dang dở; sticker; huy chương |
| D3 | Vệt mực ngày chơi 3; đang ở màn 15–18; gợi ý miễn phí cho màn 14 | Vệt mực ngày chơi 3; Trăng tròn; huy chương vàng; nhà của Boo |
| D7 | Xe ngày chơi 7; đủ trang sticker đầu tiên; Tuần lễ ma về đích; vừa mở Trăng tròn | Xe ngày chơi 7; xe Trăng Bạc; Tuần lễ ma; nhà của Boo |

**Cách đo** (thêm vào mục 10.3):

- `PokiSDK.measure('day', '<ngày chơi thứ N>', 'return')` mỗi lần mở game trong ngày mới, để vẽ đường giữ chân theo ngày chơi.
- `PokiSDK.measure('daily', '<ngày chơi thứ N>', 'start' | 'win')` cho thử thách ngày.
- `PokiSDK.measure('moon', '<số màn>', 'start' | 'win' | 'fail')` cho Trăng tròn.
- `PokiSDK.measure('hint', '<số màn>', 'free' | 'ad')` để biết gợi ý miễn phí có kéo người kẹt ở màn 14 quay lại hay không.

**Nếu chỉ làm được một phần:** ưu tiên mốc ngày chơi 3 và 7, sổ sticker ma, rồi Trăng tròn. Ba mục này nhỏ, dùng lại hệ thống có sẵn và xử lý đúng ba lỗ hổng ở mục 11.2.

### 11.6 Lộ trình (nộp kèm khi xin review)

Bản 1.x hoàn thiện game gốc; sau Global Release (ước tính quý 2/2027) là các gói lễ theo mùa, khoảng hai tháng một gói. Halloween 2027 là gói chủ lực. Mốc tháng là dự kiến và sẽ chốt lại khi có ngày Global Release.

| Bản / gói | Dịp lễ | Nội dung chính | Xe mới | Ra mắt dự kiến |
| --- | --- | --- | --- | --- |
| v1.0 | — | 20 màn, 6 cơ chế, 5 xe, xưởng nâng cấp, 6 ngôn ngữ; đợt 1 giữ chân: thử thách ngày và sổ sticker, mốc ngày chơi 3/7, 20 màn Trăng tròn, gợi ý miễn phí đầu ngày | Đèn Lồng Ma, Trăng Bạc (xe phần thưởng) | Nộp Poki |
| v1.1 | — | Đợt 2 giữ chân: huy chương theo màn, Tuần lễ ma, nhà của Boo; thumbnail động | — | Trước Soft Release |
| Gói "Bãi biển ma" | Mùa hè | 10 màn; **mới:** vũng nước, xe nổi và trôi theo dòng | Thuyền Phao Ma | 07/2027 |
| Gói "Đêm bí ngô" | Halloween | 10 màn; **mới:** bí ngô khổng lồ lăn, phải vẽ chặn hoặc làm cầu; đèn bí ngô dẫn đường | Bí Ngô Phát Sáng | Đầu 10/2027 |
| Gói "Ma tuyết" | Giáng sinh, năm mới | 10 màn; **mới:** băng trơn (giảm bám), người tuyết chắn đường | Xe Kẹo Gậy | Đầu 12/2027 |
| Gói "Đèn lồng đỏ" | Tết Nguyên đán | 10 màn; **mới:** pháo hoa đẩy xe bay một đoạn | Xe Lân Con | Giữa 01/2028 |
| Gói nhỏ "Ma tình yêu" | Valentine | 5 màn; **mới:** hai xe cùng xuất phát, phải về nhà cả hai | Xe Trái Tim | Đầu 02/2028 |
| Gói "Săn trứng" | Phục sinh | 10 màn; trứng màu thay cho hộp kẹo, có trứng ẩn sau bụi cây | Xe Thỏ Bông | Đầu 04/2028 |
| v2.0 | — | Trình sửa màn cho người chơi, chia sẻ bằng `PokiSDK.shareableURL` | — | Tùy số liệu |

Mỗi gói lễ thêm khoảng 15–20 phút nội dung và là một bản cập nhật nội dung lớn, đủ lý do để xin đổi thumbnail theo mùa.

### 11.7 Chủ đề ma dễ thương và cách làm gói lễ

Đã chốt: chủ đề nền là thế giới ma dễ thương, chơi quanh năm; các dịp lễ là gói cập nhật. Cách này bỏ được rủi ro mùa vụ (game không kịp Halloween 2026) mà vẫn giữ Halloween làm gói chủ lực đầu tiên vào tháng 10/2027.

**Game gốc:** giữ những thứ hợp quanh năm như bé ma, dơi, mèo đen, bí ngô, hộp kẹo (ma thích kẹo), đèn lồng. Không dùng biểu tượng gắn với một dịp lễ cụ thể, như cây thông, trứng màu hay chữ "Halloween".

**Quy tắc cho mọi gói lễ:**

- Gói nằm ở một "đảo lễ hội" riêng trên bản đồ, mở sau khi thắng màn 10. Người mới vẫn vào thẳng màn 1.
- Trong mùa lễ, căn nhà ma ở các màn gốc được trang trí theo dịp lễ và có biển chỉ đường đến đảo lễ hội.
- Hết mùa lễ, gói vẫn chơi được và xe lễ vẫn mua được; chỉ phần trang trí trở về như cũ. Không dùng phần thưởng giới hạn thời gian để ép người chơi quay lại.
- Xe lễ nằm trong cùng khung chỉ số ±10% và trần ảnh hưởng 20% (mục 9.4). Mỗi gói cũng thêm một trang sticker và thay luật Tuần lễ ma trong mùa lễ (mục 11.3–11.4).
- Mỗi gói tải nền khi mở đảo lễ hội (khoảng 0,4–0,6 MB), không làm nặng lần tải đầu.
- Chỉ dùng hình ảnh lễ hội đời thường (tuyết, quà, đèn lồng, trứng màu, trái tim), không dùng biểu tượng tôn giáo.
- Làm xong gói 6 tuần trước dịp lễ và nộp P4D 4 tuần trước, để có thời gian cho các vòng QA của Poki.

## 12. Rủi ro, câu hỏi mở và việc tiếp theo

Rủi ro lớn nhất là Poki coi game trùng với Draw the Road; rủi ro thứ hai là puzzle khó làm người chơi bỏ ở giữa. Cả hai cần được kiểm sớm bằng bản thử 5 màn, trước khi làm đủ 20 màn.

### 12.1 Rủi ro

| Rủi ro | Mức | Cách giảm |
| --- | --- | --- |
| Trùng thể loại với Draw the Road (Poki, 01/2026) | Cao | Nộp kèm mô tả 4 điểm khác biệt (mục 1); thumbnail, tên, màu sắc khác hẳn; mở đầu bằng cơ chế ván ma hoặc kẹo trong video playtest để thấy ngay sự khác biệt |
| Người chơi kẹt ở màn khó và bỏ game | Cao | Nhịp xen kẽ trung bình–khó; Gợi ý sau 3 lần thua; Bỏ qua sau 5 lần thua; gợi ý miễn phí đầu ngày hôm sau; `measure` theo màn để tìm màn rơi nhiều |
| Nội dung khoảng 45 phút, puzzle không chơi lại vô hạn | Trung bình | Săn 3 sao và kẹo, xe và xưởng nâng cấp, mốc ngày chơi 3/7, sổ sticker, Trăng tròn (thêm khoảng 40 phút), huy chương, Tuần lễ ma, nhà của Boo, gói lễ theo mùa (mục 11.3–11.6) |
| Vật lý thiếu ổn định làm lời giải đúng vẫn thua | Trung bình | Bước cố định, nét mực tĩnh, kiểm 100 lần có nhiễu trong CI |
| Vẽ trên điện thoại nhỏ khó chính xác | Trung bình | Hút điểm đầu vào mép đường, kính lúp, nét được làm mượt |
| Gói lễ không kịp dịp lễ | Trung bình | Làm xong 6 tuần và nộp 4 tuần trước dịp lễ; gói vẫn chơi được sau mùa (mục 11.7) |
| Xe và nâng cấp làm màn dễ quá, hoặc người chơi thấy phải cày | Trung bình | Trần 20% kiểm trong CI; T đo bằng xe gốc; mọi xe cấp 0 thắng được mọi màn; tổng chi tiêu khoảng 80–90 phút chơi (mục 9.4) |
| Hệ thống giữ chân làm rối người mới, hoặc trông như game mobile bắt cày | Trung bình | Tất cả mở sau màn 10 hoặc màn 20; không hẹn giờ, không phạt bỏ ngày, không popup lúc vào game; phần thưởng chỉ là trang trí hoặc xe trong khung ±10% (mục 11.3) |

### 12.2 Câu hỏi mở

- [ ] Chốt tên game sau khi tra trùng trên Poki, CrazyGames, App Store và Google Play.
- [ ] Nâng cấp dùng chung cho mọi xe (đề xuất ở mục 9.3) hay riêng từng xe? Riêng từng xe tăng chiều sâu nhưng chi phí xưởng sẽ gấp 5 lần (22.000 xu thay vì 4.400).
- [ ] Có cho vẽ trong lúc xe đang chạy ở vài màn đặc biệt không (tăng kịch tính, nhưng khó kiểm lời giải)?
- [ ] Màn 14 có nên nâng B/T từ 1,25 lên 1,3 nếu playtest cho thấy rơi quá 40% không?
- [ ] Mốc ngày chơi đếm ngày có chơi (đề xuất ở mục 11.3) hay ngày liên tiếp? Ngày liên tiếp kéo D7 mạnh hơn nhưng phạt người lỡ một ngày.
- [ ] Trăng tròn mở cùng lúc 20 màn (đề xuất) hay mở dần theo bộ cảnh để có nhịp?

### 12.3 Việc tiếp theo

- [ ] Nguyên mẫu màn 1–5 + màn 10 (ván ma) với đồ họa tạm; đo cảm giác vẽ trên điện thoại thật.
- [ ] Trình sửa màn và `tools/levelcheck.ts`.
- [ ] Cho 3–5 người thật chơi bản riêng tư, ghi lại thời gian từng màn.
- [ ] Làm đủ 20 màn và bộ asset 4 cảnh; thumbnail tĩnh.
- [ ] Làm đợt 1 giữ chân (mục 11.3): thử thách ngày và sổ sticker, mốc ngày chơi 3/7, 20 màn Trăng tròn, gợi ý miễn phí đầu ngày.
- [ ] Chạy checklist mục 11 hướng dẫn Poki, upload và playtest 10 video.
- [ ] Sau Player Fit Test: làm đợt 2 (mục 11.4) trước Soft Release.

## 13. Nguồn

Đọc ngày 15/10/2026. Đánh giá và lượt bình chọn thay đổi theo thời gian.

- [Draw the Road – Poki](https://poki.com/en/g/draw-the-road)
- [Drawing Games – Poki](https://poki.com/en/drawing)
- [Halloween Games – Poki](https://poki.com/en/halloween)
- [Draw Bridge (Bravestars Games) – CrazyGames](https://www.crazygames.fr/jeu/draw-bridge-brain-game)
- [Draw Bridge Puzzle (Eyestorm) – CrazyGames](https://www.crazygames.com/es/game/draw-bridge-puzzle)
- [Flying Road (Funtory) – CrazyGames](https://www.crazygames.com/game/flying-road)
- [Drawing Games – CrazyGames](https://www.crazygames.com/game/draw-play)
- [Draw Bridge – Puzzle Game (Eureka Studio) – App Store](https://apps.apple.com/app/id1558771114)
- [Draw Bridge: Save Car Puzzle – Grand Screen](https://grand-screen.com/games/draw-bridge-save-car-puzzle/)
- [Happy Glass – Design Analysis, Game Developer](https://www.gamedeveloper.com/design/happy-glass-design-analysis)
- [Brain It On! – MobyGames](https://mobygames.com/game/81409/brain-it-on)
- Hướng dẫn nội bộ: `claude/Poki-Huong-dan.md` và `claude/PondPals-BaoCao-KinhTe-v1.3.md`
