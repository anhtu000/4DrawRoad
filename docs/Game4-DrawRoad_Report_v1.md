# Game #4 – Bản thử lõi: kết quả đo v1

19/10/2026. Bước thiết kế 1 trong `docs/Game4-DrawRoad_Brief_v1.md` (mục 5). Mọi số đo ở đây lấy từ công cụ trong repo (`npm run levelcheck`, `npm run tune`) và bot chơi qua trình duyệt Chromium không giao diện. Các câu cần người thật (H1, H3, H4, H7) và số đo trên điện thoại thật (H5) chưa có.

## 1. Tóm tắt

Bản thử 6 màn (1–5 và 10) đã chạy được ở màn dọc, màn ngang 16:9 và bằng cảm ứng. Bot vẽ lời giải mẫu bằng con trỏ thật qua cả 6 màn: thắng cả 6, đủ kẹo, 3 sao, không lỗi console. Vật lý ổn định (H2 đạt). Hiệu năng và nhịp lượt thử chỉ đo được một phần trong máy giả lập.

Một mục tiêu trong bản đặc tả không đạt và không nên đạt: dốc nhảy 30° đưa xe bay khoảng 230 đơn vị (mục 4.5). Với trọng lực nhẹ đủ để bay xa như vậy, xe tự lao qua chỗ đứt rộng 120 mà không cần mực, tức màn 1 giải được bằng 0 mực. Bản thử dùng trọng lực 420 và xe 300 đơn vị/s; dốc nhảy bay khoảng 131 đơn vị. Chi tiết ở mục 3.

Việc tiếp theo là cho 3–5 người chơi thử trên điện thoại (mục 6). Kết quả đó quyết định có làm tiếp đủ 20 màn hay phải sửa lõi.

## 2. Bản thử có gì

- Vẽ bằng ngón tay và chuột, làm mượt RDP sai số 3, đầu và cuối nét hút vào mép đường trong bán kính 18, kính lúp khi vẽ bằng ngón tay.
- Mực có hạn, lọ mực có vạch vàng (3 sao) và vạch bạc (2 sao), hiện số mực còn lại. Hết mực thì nét dừng.
- Hoàn tác, xoá hết (giữ 0,5 giây), GO và Stop. Phím: Space/Enter, Z, R, P.
- Xe 2 bánh có giảm xóc; vách đá có biển mũi tên làm xe quay đầu; kẹo; ván ma; bia mộ chặn nét; vệt chấm dự đoán đường bay khi giữ GO (màn 5).
- Thua: chữ "Boo!" và lý do (rơi, lật, kẹt, quá lâu), nét giữ nguyên. Thắng: màn kết quả có sao, điểm, thanh mực, "còn thiếu X mực để lên 3 sao", Next và Replay. Replay bắt đầu từ sân trống.
- Gợi ý ít chữ theo từng màn (vẽ đường, sửa mọi chỗ đứt, nhặt kẹo, vạch vàng, dốc nhảy, thẻ ván ma).
- Menu tạm dừng: chọn màn, tắt tiếng, chép nhật ký lượt thử.
- Lớp thử nghiệm: `?debug` (hoặc chạm tên màn 5 lần), `?inkturn`, `?level=` hoặc `#l5`, `?reset`.
- 8 tiếng hiệu ứng tạm, không có nhạc nền.

Không có (đúng phạm vi 5.1): xu, cửa hàng, xe khác, SDK, quảng cáo, nhạc nền, hình hoàn thiện, đa ngôn ngữ.

Dung lượng: bản web 1,67 MB (JS 391 KB sau gzip); file thử điện thoại một file 1,84 MB.

## 3. Vật lý so với mục tiêu (mục 4.5 của bản đặc tả)

| Mục tiêu | Đặc tả | Đo được | Đánh giá |
| --- | --- | --- | --- |
| Tốc độ trên mặt phẳng | Khoảng 260 đơn vị/s | 295 đơn vị/s; đạt 90% sau 0,9 s | Hết chiều ngang sân trong 2,44 s, khớp mục tiêu 2,5 s |
| Trọng lực | Khoảng 250 đơn vị/s² | 420 đơn vị/s² | Đổi có chủ ý, xem dưới |
| Dốc nhảy 30°, dài 90 | Bay khoảng 230, đỉnh khoảng 35, bay khoảng 1 s | Bay 131, đỉnh 21, bay 0,57 s | Không đạt, có chủ ý |
| Dốc leo được | 40° leo, 45° trượt | 40° leo, 42° không leo (ngưỡng đặt 41°) | Đạt |
| Rơi một tầng 200 | Không lật, nảy nhẹ | Nghiêng tối đa 18°, không lật | Đạt |
| Bước vật lý | Cố định 1/60 s | Cố định 1/60 s, tối đa 6 bước mỗi khung | Đạt |
| Lặp lại | 100/100 giống nhau | Cùng nét cho cùng kết quả đến từng số (levelcheck bước 7) | Đạt |

Vì sao không dùng trọng lực 250 (đo bằng cùng mô phỏng):

| Trọng lực, tốc độ | Chỗ đứt rộng nhất xe tự qua khi không vẽ | Dốc 30° dài 90 đưa xe bay |
| --- | --- | --- |
| 420, 300 (bản thử) | 100 | 131 |
| 250, 260 (đặc tả) | 120 | 158 |
| 250, 300 | 130 | 182 |

- Sự thật: với trọng lực 250, màn 1 (chỗ đứt 120) thắng được khi không vẽ gì. Ngay cả trọng lực 250 cũng chỉ bay được 158–182, chưa tới 230: xe mất tốc độ khi leo dốc nhảy, còn con số 230 trong đặc tả là tính theo quỹ đạo lý tưởng.
- Hệ quả cho việc dựng màn: mọi chỗ đứt phải rộng từ 120 trở lên (levelcheck bước "không vẽ thì thua" bắt lỗi này). Hố cần dốc nhảy rộng khoảng 120–180, không phải 200–230.
- Ý kiến: nếu chơi thử thấy xe "nặng", có thể tăng tốc độ xe thay vì giảm trọng lực, nhưng mỗi lần đổi phải chạy lại levelcheck và có thể phải nới chỗ đứt.

Độ êm trên nét mực (gờ ảo ở khớp nối, mục 3.1 dòng 6 của bản đặc tả): nét thẳng nối hai đoạn đường cho vận tốc dọc lớn nhất 8,7 đơn vị/s; nét run tay ±1,5 sau làm mượt 20,9 đơn vị/s; xe không chậm dưới 271 đơn vị/s. Không thấy xe vấp ở khớp nối. Cách dựng: mỗi đoạn là một hình chữ nhật dày 14, mỗi điểm có một hình tròn bán kính 7.

## 4. Sáu màn

Số từ `npm run levelcheck` (T = mực của lời giải mẫu × 1,10; B = T × hệ số của bảng 6.2 v0).

| Màn | Tên | T (ước trong đặc tả) | B | B/T | Kẹo | Xe chạy (s) | Nhiễu ±2: thắng | Lời giải mẫu |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Graveyard Gate | 132 (130) | 396 | 3,0 | 0 | 2,1 | 100/100 | 3 sao |
| 2 | Old Bridge | 354 (250) | 991 | 2,8 | 0 | 5,5 | 100/100 | 3 sao |
| 3 | First Candy | 359 (340) | 933 | 2,6 | 1 | 6,0 | 100/100 | 3 sao |
| 4 | Steep Hill | 455 (460) | 1.092 | 2,4 | 2 | 5,5 | 100/100 | 3 sao |
| 5 | Grave Jump | 238 (330) | 524 | 2,2 | 2 | 5,7 | 100/100 | 3 sao |
| 10 | Ghost Planks | 488 (350) | 878 | 1,8 | 2 | 9,4 | 100/100 | 3 sao |

Các kiểm khác đều đạt: không vẽ thì thua ở mọi màn; màn 1–4 nối thẳng các mép thì thắng; bỏ trống bất kỳ chỗ đứt nào thì thua; chạy lại cùng nét cho cùng kết quả.

Kiểm riêng:

- Màn 3 và 4: nối thẳng thì thắng nhưng không có kẹo (đúng ý: kẹo là lựa chọn riêng).
- Màn 5: nét thẳng qua hố bị bia mộ cắt nên xe kẹt; cầu thấp ở tầng dưới thắng nhưng hụt kẹo trên cao; cầu vòng qua bia mộ thắng, 398 mực, **1 sao** (646 điểm). Đặc tả dự kiến cầu vòng được khoảng 2 sao (940 điểm). Muốn cầu vòng được 2 sao thì phải nới B màn 5; giữ nguyên thì dốc nhảy là cách duy nhất để có 2–3 sao. Chưa đổi, chờ số liệu chơi thử.
- Màn 10: không vá thì xe rơi qua ván ma; vá quá ngắn cũng rơi; vẽ đè cả ván thì thắng, 609 mực, 2 sao (863 điểm).

**Lệch so với đặc tả ở màn 10:** đặc tả mô tả lời giải "canh nhịp" là vẽ một gờ nhỏ để xe tới chậm hơn. Bản dựng dùng cách khác: ván ma nằm ở chỗ xe bắt đầu tầng 2, lời giải mẫu vá một đoạn 75 ở đầu ván nơi xe đi vào, phần còn lại của ván hiện đúng lúc xe tới. Lựa chọn của người chơi vẫn là "vá một đoạn đúng chỗ" (3 sao) hay "vẽ đè cả ván" (2 sao). Câu H7 cần đo xem người chơi có tự nghĩ ra cách vá một đoạn không.

Độ bền khi tay run nhiều hơn (100 lượt mỗi ô; số trong ngoặc là số lượt đủ kẹo; nhiễu đặt lên từng điểm của lời giải mẫu, đầu nét vẫn hút vào mép đường):

| Màn | ±2 | ±4 | ±6 | ±10 |
| --- | --- | --- | --- | --- |
| 1 | 100 (100) | 100 (100) | 100 (100) | 100 (100) |
| 2 | 100 (100) | 100 (100) | 100 (100) | 100 (100) |
| 3 | 100 (100) | 100 (100) | 100 (100) | 100 (100) |
| 4 | 100 (100) | 100 (99) | 100 (82) | 100 (81) |
| 5 | 100 (100) | 98 (98) | 90 (86) | 89 (75) |
| 10 | 100 (100) | 100 (100) | 100 (100) | 100 (100) |

Màn 5 nhạy nhất vì góc dốc nhảy quyết định có qua bia mộ hay không; màn 4 hụt kẹo khi chữ U lệch. Đây là độ khó đúng ý, không phải vật lý thiếu ổn định.

## 5. H1–H7: trạng thái

| # | Câu hỏi | Trạng thái | Kết quả hoặc việc cần làm |
| --- | --- | --- | --- |
| H1 | Vẽ trên điện thoại có đủ chính xác | Chưa đo | Cần 3–5 người thật (mục 6). Bot cảm ứng vẽ đúng ở màn 1 và 4; kính lúp hiện khi vẽ bằng ngón tay |
| H2 | Vật lý ổn định | **Đạt** | 100/100 không nhiễu, 100/100 với nhiễu ±2 ở cả 6 màn; không vấp ở nét gần nằm ngang |
| H3 | Đọc màn trong 2 giây | Chưa đo | Cần người thật |
| H4 | Vạch mức chuẩn tự hiểu | Chưa đo | Cần người thật, hỏi sau màn 4 |
| H5 | 60 fps, game dưới 8 ms mỗi khung | Đo một phần | Máy giả lập dùng GPU phần mềm nên fps không có nghĩa (3–14 fps). Với CPU chậm 6 lần (cách đo của game #1): đứng yên khoảng 8–15 ms, đang vẽ khoảng 19–32 ms (trước khi sửa 55–62 ms), xe đang chạy khoảng 6–11 ms, vật lý 0,2–0,5 ms mỗi bước. Số dao động nhiều giữa các lần đo. Cần đo trên Samsung bằng hộp debug |
| H6 | Mỗi lượt thử 10–25 s, màn 1–5 trong khoảng 3 phút | Đo một phần | Phần xe chạy: 2,1–6,0 s ở màn 1–5, 9,4 s ở màn 10. Thời gian nhìn và vẽ cần người thật; nhật ký lượt thử ghi sẵn |
| H7 | Ván ma tạo lựa chọn thật | Chưa đo | Cần người thật, xem màn 10 họ vá một đoạn hay vẽ đè cả ván |

## 6. Cách chơi thử với người thật

File và link:

- Artifact riêng tư "Ghost Ink Road" trên claude.ai (mở được trên điện thoại của chính người dùng). Người khác chỉ mở được khi được chia sẻ qua menu Share của trang.
- File một trang `builds/GhostInkRoad_PhoneTest_v1.html` trong thư mục game: gửi cho người thử, mở bằng trình duyệt điện thoại.

Mỗi người thử (khoảng 5 phút), không giải thích luật trước:

1. Mở game lần đầu. Ghi số lần thử ở màn 1 (H1).
2. Màn 1–5: ngay khi màn hiện ra, hỏi "cần vẽ ở đâu?" và ghi đúng hay sai (H3).
3. Sau màn 4: hỏi "vạch vàng trên lọ mực là gì?" (H4).
4. Màn 10: xem họ vá một đoạn ở đầu ván hay vẽ đè cả ván (H7).
5. Ghi thêm: có thấy luật quay đầu ở vách khó hiểu không, xe lật khi rơi tầng mấy lần, có phàn nàn nét lệch khỏi ngón tay không.
6. Xong: nút ≡ (hoặc phím P) → "Copy test log", dán vào tin nhắn gửi lại. Nhật ký có từng lần bấm GO: màn, số nét, mực, thời gian vẽ, thời gian chạy, kết quả, kẹo, sao (H6).

H5 trên Samsung: mở link có `#debug` ở cuối (hoặc chạm tên màn 5 lần). Đọc dòng `fps drawn`, `game ms/frame` lúc đang vẽ và lúc xe chạy ở màn 10.

## 7. Lỗi tìm thấy và đã sửa trong lần kiểm này

| Lỗi | Hậu quả | Sửa |
| --- | --- | --- |
| Hình kẹo và ván ma được vẽ lại vào cùng một texture khi màn có từ 2 kẹo | Từ màn 4 trở đi màn hình đen, lỗi `resolution` | Hình không đổi chỉ vẽ một lần (`bakeOnce`) |
| Bảng kết quả và menu ở màn ngang | Chữ đè lên nút vì khung chỉ cao 720 | Bố cục gọn: hàng sát hơn, hai nút cạnh nhau |
| `?reset&debug` làm hỏng địa chỉ trang | Hộp debug không bao giờ bật | Sửa cách xoá `reset` khỏi địa chỉ trong `src/save.ts` |
| Hộp debug che nút GO trên điện thoại hẹp | Chạm GO thì hạ độ phân giải thay vì chạy xe | Chạm xuyên qua hộp debug |
| Nét đang vẽ là một Graphics dài | Đang vẽ tốn 55–62 ms mỗi khung với CPU chậm 6 lần | Cứ 12 điểm vẽ sẵn thành ảnh, chỉ phần cuối là Graphics |
| Phím Esc để tạm dừng | Esc thoát toàn màn hình (bài học game #1) | Đổi sang P |
| Nút lưu nhật ký tải file | Trang artifact chặn tải file, nút không làm gì | Chép CSV vào clipboard, trình duyệt thường vẫn tải file |
| Chữ gợi ý đè lên mặt trăng | Khó đọc | Thêm nền tối bo tròn sau chữ |
| Khung kính lúp bị chính phần phóng to che | Không thấy viền kính lúp | Thu phần phóng to vào trong khung |
| Điểm hiện "1.20K", nút GO vẫn ghi Stop sau khi thắng | Khó hiểu | Hiện "1,200"; GO về trạng thái thường |
| Lỗi kiểu TypeScript với Phaser 4 | Không build được | Sửa kiểu |

## 8. Việc tiếp theo

1. Người dùng: chơi thử trên Samsung (H5) và cho 3–5 người chơi theo mục 6. Gửi lại nhật ký và ghi chú.
2. Sau khi có số liệu: quyết định trọng lực và tốc độ cuối, B của màn 5, cách dạy ván ma ở màn 10.
3. Nếu H1–H7 đạt: bước 2 (đủ 20 màn, trình sửa màn), bước 3 (mô phỏng kinh tế), bước 4 (mỹ thuật) như lộ trình trong bản đặc tả.
4. Chưa có repo GitHub cho game #4: code nằm trong git cục bộ ở `D:\Projects\GameMaking\Game4_DrawRoad` (đã có lịch sử commit). Tạo repo trên GitHub khi người dùng muốn.

## 9. Nguồn

- Đo bằng `npm run levelcheck`, `npm run tune` và script đo trọng lực, nhiễu trong lần kiểm này; bot Playwright (Chromium, SwiftShader) ở khung 412×915 (dọc), 1280×720 (ngang), 390×844 (cảm ứng).
- Đặc tả: `docs/Game4-DrawRoad_Brief_v1.md` mục 4.5, 5.2, 5.3. Thiết kế gốc: `Game4-ThietKe.md` mục 4, 6.2.
