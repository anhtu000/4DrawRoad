# Game #4 – Bản thử lõi: kết quả đo v4

v4, 28/10/2026: kết quả chơi thử đợt 2 trên bản v3 (mục 13), lỗi đo thời gian vẽ (mục 13.3), vì sao xe kẹt (mục 13.4). Mục 1–12 giữ như v3.

v3, chiều 22/10/2026: hai luật mức chuẩn người dùng chốt và 6 màn sửa lại (mục 12). Số ở mục 4 và 10 là của màn cũ, giữ để so sánh.

v2, 22/10/2026: thêm kết quả chơi thử đợt 1 (mục 9), phát hiện màn bị rò và ba hướng sửa (mục 10), xe mới (mục 11). Mục 1–8 giữ như v1 (19/10); riêng việc tiếp theo ở mục 8 nay thay bằng mục 10.

v1, 19/10/2026. Bước thiết kế 1 trong `docs/Game4-DrawRoad_Brief_v1.md` (mục 5). Mọi số đo ở đây lấy từ công cụ trong repo (`npm run levelcheck`, `npm run tune`) và bot chơi qua trình duyệt Chromium không giao diện. Các câu cần người thật (H1, H3, H4, H7) và số đo trên điện thoại thật (H5) chưa có.

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

## 9. Chơi thử đợt 1 (21/10)

Nhật ký người dùng gửi ngày 22/10: một phiên, một người (người dùng), 7 lượt bấm GO.

| Màn | Lượt | Nét | Mực | T | Mực / T | Vẽ (s) | Chạy (s) | Kết quả | Kẹo | Sao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 148 | 132 | 112% | 23,2 | 2,6 | Thắng | 0/0 | 3 |
| 2 | 1 | 2 | 234 | 354 | 66% | 15,2 | 6,3 | Thắng | 0/0 | 3 |
| 3 | 1 | 2 | 201 | 359 | 56% | 14,4 | 7,0 | Thắng | 0/1 | 3 |
| 4 | 1 | 2 | 265 | 455 | 58% | 84,2 | 5,9 | Thắng | 0/2 | 3 |
| 5 | 1 | 2 | 337 | 238 | 142% | 11,8 | 6,2 | Rơi | 1/2 | 0 |
| 5 | 2 | 3 | 408 | 238 | 171% | 90,2 | 5,5 | Thắng | 2/2 | 1 |
| 10 | 1 | 2 | 349 | 488 | 72% | 25,3 | 10,7 | Thắng | 1/2 | 3 |

Sự thật từ nhật ký:

- Thắng 6/6 màn với 7 lượt; chỉ thua một lần (màn 5). 5/6 màn được 3 sao ngay lượt đầu.
- Ở 4 màn (2, 3, 4, 10) người chơi dùng ít hơn mức chuẩn T 28–44%. Chỉ màn 5 làm khó được về mực (1 sao).
- Kẹo: nhặt 4/9. Bỏ qua kẹo vẫn được 3 sao.
- Màn 1–5 mất khoảng 4 phút 54 giây (từ lúc bắt đầu màn 1 tới lúc thắng màn 5), mục tiêu khoảng 3 phút. Phần lớn chênh lệch nằm ở màn 4 (vẽ 84 giây) và lượt 2 của màn 5 (vẽ 90 giây). Nhật ký không cho biết trong lúc đó người chơi đang nghĩ, đang vẽ lại hay đang làm việc khác.
- Mỗi lượt (vẽ cộng chạy): 26, 22, 21, 90, 18, 96 và 36 giây. Mục tiêu 10–25 giây đạt ở 4/7 lượt.

Theo các câu hỏi H1–H7:

- H1: màn 1 thắng ngay lượt đầu (1/1 người). Cần thêm người.
- H3, H4, H7: nhật ký không trả lời được (cần hỏi trực tiếp). Ở màn 10 người chơi dùng 349 mực, ít hơn cả lời giải mẫu (444), tức không vẽ đè cả ván ma.
- H6: một phần đạt, xem trên.

Đánh giá (ý kiến): một người chơi là quá ít để kết luận về độ khó. Nhưng việc dùng ít hơn T ở 4/6 màn khớp với phát hiện ở mục 10, nên đây là lỗi của màn chứ không phải người chơi giỏi bất thường.

## 10. Màn bị "rò": vá một mẩu ở mép là thắng

Để kiểm xem T có quá dễ không, Claude viết `tools/cheapest.ts` (`npm run cheapest`): với mỗi nét của lời giải mẫu, thử bỏ nét, cắt bớt hai đầu, hoặc thay bằng một dốc ngắn ở mép, chạy đúng vật lý của game và giữ cách rẻ nhất vẫn thắng. Công cụ chỉ thử những dạng này, nên con số là mức trần: người chơi có thể tìm ra cách còn rẻ hơn.

| Màn | T | Giới hạn 3 sao | Rẻ nhất tìm được, đủ kẹo | Rẻ nhất tìm được, không cần kẹo |
| --- | --- | --- | --- | --- |
| 1 | 132 | 179 | 24 | 24 |
| 2 | 354 | 468 | 54 | 54 |
| 3 | 359 | 461 | 65 | 65 |
| 4 | 455 | 569 | 77 | 77 |
| 5 | 238 | 289 | 90 | 59 |
| 10 | 488 | 558 | 60 | 60 |

Thử riêng màn 1 (chỗ đứt rộng 120): một miếng mực phẳng dài 20 đặt ở mép bên kia, hoặc dài 20 ở mép bên này, hoặc một dốc dài 30 nghiêng 10–30°, đều thắng. Thân xe gần như không hạ xuống khi qua chỗ đứt (tâm thân xe lệch tối đa 6 đơn vị).

Nguyên nhân (sự thật đo được, cộng giải thích của Claude):

- Xe tự qua được chỗ đứt khoảng 100 đơn vị mà không cần mực (đo ở bản v1). Chỗ đứt của 6 màn rộng 120–220, tức chỉ hơn ngưỡng đó một chút. Hai bánh cách nhau 66: khi bánh trước ra khỏi mép, bánh sau còn trên đường, rồi đà 300 đơn vị/s đưa bánh trước sang bờ kia trước khi xe kịp rơi. Chỉ cần thu hẹp chỗ đứt thêm 20 đơn vị là đủ.
- Trọng lực không phải nguyên nhân chính: thử 700 và 900 (gấp đôi bản thử), màn 1 vẫn thắng với 24 mực; các màn khác cần 72–126 mực.
- T lấy từ lời giải mẫu vá kín chỗ đứt, nên luôn cao hơn nhiều so với cách rẻ nhất. Vì vậy sao không còn là thử thách, và kẹo không có lý do để nhặt.

Ba hướng sửa (chờ người dùng chọn):

| Hướng | Cách làm | Ưu | Nhược |
| --- | --- | --- | --- |
| A. T theo cách rẻ nhất | `cheapest` chạy trong levelcheck, T = mực rẻ nhất tìm được × 1,1. Thử thách đổi thành "vá ít mực nhất" (gần Happy Glass) | Mỗi màn có thử thách thật, có lý do chơi lại để lên 3 sao; lỗ hổng mới bị công cụ tìm ra trước người chơi | Màn hướng dẫn: vá kín chỗ đứt (như bàn tay ma vẽ mẫu) chỉ được 1 sao, dễ gây khó hiểu; viền chấm gợi ý "vá kín" lại không còn đúng; công cụ có thể bỏ sót cách rẻ hơn |
| B. Giữ "vá kín", sửa luật dựng màn | Chỗ đứt rộng gấp 2,5–3 lần xe; mép đáp cao hơn mép đi (không bay lên được); đặt chỗ đứt ngay sau vách quay đầu để xe chưa có đà; xe chậm hơn (khoảng 200 đơn vị/s); `cheapest` kiểm rằng cách rẻ nhất không dưới khoảng 85% T | Giữ ý tưởng gốc, dễ hiểu, hướng dẫn khớp với cách chấm | Ít kiểu màn hơn; xe chậm thì mỗi lượt lâu hơn; phải dựng lại cả 6 màn |
| C. Kết hợp | Màn 1–5 dựng theo B (hướng dẫn rõ, vá kín là đúng); từ màn 6 dùng T của A, coi tìm cách vá ít mực là kỹ năng nâng cao | Người mới không bị phạt; người giỏi có thử thách thật | Hai luật trong một game; phải nói rõ cho người chơi khi chuyển (ví dụ thẻ "Ít mực hơn = nhiều sao hơn" ở màn 6) |

Đề xuất của Claude: C. Dù chọn hướng nào, `npm run cheapest` cũng phải thành một bước của levelcheck để không lọt màn rò.

## 11. Xe mới (22/10)

Người dùng nhận xét xe cũ quá đơn giản. Xe mới tên Pumpkin Buggy (Bí Ngô Lăn Lóc trong v0), vẽ bằng code trong `src/render/car.ts`, ghép trong `src/play/CarView.ts`:

- Vỏ bí ngô có gân, mắt to biết chớp ở mũi xe và miệng cười (v0 mục 7.1: xe nào cũng có mắt biết chớp), cản trước có đèn với vệt sáng mờ, ống xả phả khói ma nhỏ, bánh to có gai và nan, vè che bánh.
- Lumi ngồi trong buồng lái: giọt ma tròn, chóp vuốt ra sau như ngọn lửa trong gió, mắt to, má hồng, khăn quàng sọc cam. Khăn bay theo tốc độ, dây leo ăng-ten lắc theo gia tốc, Lumi nhấc nhẹ khỏi ghế khi bay, xe nhún khi đáp đất và khi quay đầu ở vách. Lumi và xe chớp mắt lệch nhịp nhau.
- Chỉ là hình: khung va chạm, bánh xe và vòng tròn nhặt kẹo của Lumi không đổi (code kiểm điều này khi chạy), nên mọi số ở mục 3–4 và mục 10 vẫn đúng.
- Lần dựng đầu (trước khi người dùng xem) bị sửa 3 chỗ: chóp đầu Lumi nhọn và cao trông như mũ trùm, vành buồng lái nhô lên trông như vành mũ, vô lăng cạnh mặt trông như kính một mắt.
- Bảng mẫu để xem kỹ: `npm run dev` rồi mở `/tools/carsheet/index.html` (xe đứng, đang chạy, đang bay, đáp đất, quay đầu, cỡ thật trên điện thoại, so với xe cũ).
- Bot vẽ lời giải mẫu qua cả 6 màn với xe mới: thắng cả 6, đủ kẹo, không lỗi console.

## 12. Sửa màn theo quyết định 22/10

Người dùng chốt (chiều 22/10) một biến thể của hướng C: **màn 1–3 theo hướng B ("vá kín"), từ màn 4 theo hướng A ("ít mực nhất")**. Mỗi file màn có trường `parRule` (`patch` hoặc `cheapest`), levelcheck kiểm theo luật của màn đó.

### 12.1 Công cụ tìm cách rẻ nhất

`tools/search.ts` (chạy trong levelcheck và qua `npm run cheapest`): từ lời giải mẫu và các lời giải khác trong `alt`, thử bỏ từng nét, cắt hai đầu, khoét một lỗ, hoặc thay bằng dốc hay miếng vá ngắn ở mép, chạy đúng vật lý của game. Một cách chỉ được nhận khi vẫn thắng lúc tay run: 4 bản rung ±2 ở màn vá kín; 12 bản rung và thắng từ 90/100 lần có nhiễu ±2 ở màn ít mực. Ở màn ít mực, tìm kiếm chạy lại từ kết quả tốt nhất tới khi không rẻ hơn được nữa. levelcheck cả 6 màn mất khoảng 2 phút.

### 12.2 Màn 1–3: vá kín

Luật dựng, rút ra từ đo đạc (sự thật):

- Chỗ đứt phẳng không chặn được: rộng 220 vẫn thắng với một miếng 44 mực ở giữa. Đặt chỗ đứt sát điểm xuất phát cũng không đủ, vì chỉ sau 40 đơn vị xe đã chạy khoảng 220 đơn vị/s.
- Cách hiệu quả: **mép đáp cao hơn mép đi, dốc 33–35°** (xe leo được tới 41°). Khi đó cách rẻ nhất (cắt ngắn đầu nét hoặc chừa một lỗ) còn khoảng 70–80% lời giải vá kín.
- Dưới mỗi chỗ đứt phải trống tới đáy (không có đường hay chỗ đứt khác bên dưới): thử dựng hai chỗ đứt chồng lên nhau thì xe rơi qua chỗ trên, đáp lên miếng vá chỗ dưới rồi vẫn về nhà.
- Kẹo đặt trên chỗ đứt dốc không làm được: vòng cung qua kẹo làm đoạn đầu dốc quá 41° và xe kẹt. Màn 3 đặt kẹo phía trên tầng trên phẳng, lấy bằng một dốc nhỏ vẽ trên mặt đường (đúng ý v0 mục 5.2 "vẽ gờ cho xe nảy lên").

| Màn | Bố cục mới | Lời giải mẫu (mực) | Cách rẻ nhất (%) | T | B | Xe chạy (s) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Graveyard Gate | Một chỗ đứt rộng 160, mép đáp cao hơn 105 (33°), nhà ở trên | 191 | 153 (80%) | 211 | 633 | 3,0 |
| 2 Old Bridge | Xe xuất phát sát vách quay đầu; hai chỗ đứt leo sang trái, mỗi chỗ 35° | 305 | 214 (70%) | 336 | 941 | 4,2 |
| 3 First Candy | Kẹo trên tầng trên (dốc nhỏ 60 trên mặt đường); rơi xuống tầng dưới, quay đầu ở vách, một chỗ đứt leo 32° tới nhà | 259 | 210 (81%) | 285 | 741 | 6,6 |

Ghi chú: một nét chấm có nhiều lỗ nhỏ (20–40 đơn vị) vẫn thắng màn 2 với khoảng 51% mực, vì xe lăn qua lỗ nhỏ trên dốc 35°. Ở màn vá kín, nét đó cũng chỉ được 3 sao như vá kín, nên levelcheck chỉ xét cách cắt ngắn và một lỗ, không chặn nét chấm.

### 12.3 Màn 4, 5, 10: ít mực nhất

T = cách rẻ nhất đủ kẹo (`best`) × 1,1. B = số lớn hơn giữa T × hệ số của màn và lời giải dễ thấy × 1,15, để người mới vá kín vẫn thắng (1 sao) rồi được mời thử lại với ít mực hơn. Mức 1,15 do Claude chọn.

| Màn | Cách rẻ nhất (mực) | T | B | 3 sao khi mực ≤ | 2 sao khi mực ≤ | Cách dễ thấy |
| --- | --- | --- | --- | --- | --- | --- |
| 4 Steep Hill | 47: một miếng 16 ở mép bên kia chỗ đứt 1, một miếng ngắn ở hõm dưới | 51 | 476 | 127 | 264 | Vá kín, đủ kẹo: 414 mực, 1 sao |
| 5 Grave Jump | 118: dốc nhảy ngắn qua bia mộ (đúng bài của màn) và miếng vá ngắn ở chỗ đứt 2 | 130 | 508 | 197 | 319 | Cầu vòng qua bia mộ: 442 mực, 1 sao; dốc nhảy theo v0: 246 mực, 2 sao |
| 10 Ghost Planks | 65: ba miếng ngắn, một miếng 10 ở đầu ván ma | 72 | 700 | 184 | 386 | Vẽ đè cả ván: 609 mực, 1 sao; vá ngắn canh nhịp (lời giải cũ): 444 mực, 1 sao |

Thay đổi khác:

- Màn 5: chỗ đứt 2 nới từ 120 lên 150, vì xe đi cầu vòng chạy nhanh hơn và tự vượt chỗ đứt 120. Lời giải mẫu giờ là cầu vòng (cách dễ thấy), dốc nhảy chuyển vào `alt`; bàn tay ma ở màn 5 vẫn vẽ mẫu dốc nhảy.
- Màn 10: lời giải mẫu là vẽ đè cả ván; vá ngắn canh nhịp chuyển vào `alt`.
- So với lượt chơi thử 21/10 (mực bằng nhau, màn 4 và 10 giữ bố cục): màn 4 dùng 265 mực giờ được 1 sao (trước 3 sao); màn 10 dùng 349 mực giờ được 2 sao (trước 3 sao).

### 12.4 Kiểm trên trình duyệt

- Bot vẽ lời giải dễ thấy bằng con trỏ thật ở màn dọc và màn ngang: thắng cả 6 màn, đủ kẹo, không lỗi console; màn 1–3 được 3 sao, màn 4, 5, 10 được 1 sao.
- Bot vẽ cách rẻ nhất: màn 5 và 10 được 3 sao. Màn 4 thua: miếng vá 16 đơn vị lệch khoảng 1 đơn vị khi vẽ bằng con trỏ (một điểm ảnh CSS ở màn 412 px rộng là khoảng 1,75 đơn vị). Người chơi không cần đúng cách đó: 3 sao chỉ cần dưới 127 mực.

### 12.5 Rủi ro và việc tiếp theo

- Ý kiến: từ màn 4, lên 3 sao giờ cần nghĩ ra cách vá rất ngắn, khó hơn hẳn màn 1–3. Đúng ý hướng A nhưng có thể làm người chơi nản. Khi chơi thử cần đo tỉ lệ người lên 3 sao ở màn 4–10 và số lần chơi lại; nếu quá thấp thì nới T (ví dụ cách rẻ nhất × 1,3) hoặc thêm gợi ý ở màn 4.
- Màn 4 là chỗ chuyển luật. Chữ gợi ý hiện tại "Save ink: stay past the gold mark" và câu "Use N less ink for 3 stars" ở màn kết quả là cách dạy duy nhất; chưa có thẻ riêng báo "ít mực hơn = nhiều sao hơn".
- Việc tiếp theo: cho 3–5 người chơi bản thử v3 theo mục 6, ghi thêm tỉ lệ 3 sao từ màn 4.

## 13. Chơi thử đợt 2 (28/10, bản v3)

Nhật ký người dùng gửi ngày 28/10: phiên `inbodw`, 13 lượt bấm GO. Các dòng của đợt 1 (phiên `lfs86p`) nằm chung trong nhật ký, tức cùng một trình duyệt. Giả định: cùng một người chơi (người dùng), chơi lần thứ hai. Nếu đúng, thời gian và số lần thua sẽ thấp hơn so với người mới.

### 13.1 Nhật ký

Cột "Vẽ" là drawSec − runSec (lý do ở mục 13.3). Màn 10 được chơi hai lần: đầu phiên (trước màn 1) và cuối phiên.

| Màn | Lượt | Nét | Mực | T | 3 sao khi ≤ | Vẽ (s) | Chạy (s) | Kết quả | Kẹo | Sao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 10 | 1 | 1 | 153 | 72 | 184 | 23,3 | 10,0 | Rơi | 1/2 | 0 |
| 10 | 2 | 2 | 237 | 72 | 184 | 3,6 | 10,3 | Thắng | 2/2 | 2 |
| 1 | 1 | 1 | 204 | 211 | 286 | 5,2 | 2,6 | Kẹt | – | 0 |
| 1 | 2 | 1 | 185 | 211 | 286 | 3,9 | 4,5 | Thắng | – | 3 |
| 2 | 1 | 2 | 319 | 336 | 444 | 6,5 | 6,3 | Thắng | – | 3 |
| 3 | 1 | 1 | 222 | 285 | 366 | 4,5 | 7,8 | Thắng | 0/1 | 3 |
| 4 | 1 | 2 | 358 | 51 | 127 | 19,8 | 3,8 | Kẹt | 1/2 | 0 |
| 4 | 2 | 2 | 303 | 51 | 127 | 14,2 | 7,3 | Thắng | 1/2 | 1 |
| 5 | 1 | 2 | 289 | 130 | 197 | 9,3 | 3,0 | Kẹt | 0/2 | 0 |
| 5 | 2 | 2 | 250 | 130 | 197 | 21,3 | 6,0 | Kẹt | 1/2 | 0 |
| 5 | 3 | 2 | 208 | 130 | 197 | 8,5 | 7,3 | Rơi | 2/2 | 0 |
| 5 | 4 | 3 | 182 | 130 | 197 | 11,6 | 6,5 | Thắng | 2/2 | 3 |
| 10 | 1 | 2 | 243 | 72 | 184 | 10,5 | 12,1 | Thắng | 2/2 | 2 |

### 13.2 Sự thật từ nhật ký

- Thắng cả 6 màn. 13 lượt, thua 6 lần: 4 lần kẹt, 2 lần rơi. Đợt 1 có 7 lượt, thua 1 lần, chưa lần nào kẹt.
- Màn 1–3 (luật vá kín): thắng với 88%, 95% và 78% của T, cả ba được 3 sao. Không lượt nào dùng ít mực bất thường như đợt 1 (56–66% của T). Màn 3 bỏ kẹo (0/1) vẫn được 3 sao.
- Màn 4, 5, 10 (luật ít mực nhất): 3 sao ở 1/3 màn.
  - Màn 4: 303 mực, 1 sao, gấp 2,4 lần ngưỡng 3 sao. Không chơi lại để lấy thêm sao.
  - Màn 5: mực giảm qua từng lượt (289 → 250 → 208 → 182), thắng ở lượt 4 với 3 sao.
  - Màn 10: 237 và 243 mực, cả hai lần 2 sao; ngưỡng 3 sao là 184.
- So với đợt 1 (màn 4 và 10 giữ bố cục): màn 4 dùng 303 mực (đợt 1: 265), màn 10 dùng 237 (đợt 1: 349).
- Kẹo ở các lượt thắng: 5/7 (đợt 1: 3/7).
- Màn 1–5 mất 2 phút 55 giây (đợt 1: 4 phút 51 giây, số đã sửa theo mục 13.3). Mục tiêu khoảng 3 phút.
- Mỗi lượt (vẽ cộng chạy): 9/13 lượt trong khoảng 10–25 giây, 2 lượt ngắn hơn (màn 1), 2 lượt dài hơn (màn 10 lượt đầu 33 giây, màn 5 lượt 2 27 giây).

### 13.3 Lỗi đo: drawSec gồm cả thời gian xe chạy

- drawSec được tính từ lúc vào chế độ vẽ đến lúc xe chạy xong, không phải đến lúc bấm GO. Kiểm bằng giờ ghi trong nhật ký: ở mọi cặp "lượt thua → lượt kế tiếp", khoảng cách giữa hai dòng bằng drawSec của lượt sau cộng 0,65 giây (lúc hiện chữ "Boo!").
- Thời gian vẽ thật là drawSec − runSec. Số của đợt 1 sửa lại: màn 4 vẽ 78 giây (không phải 84), màn 5 lượt 2 vẽ 85 giây (không phải 90), màn 1–5 mất 4:51 (không phải 4:54). Kết luận ở mục 9 không đổi.
- Sửa ở bản sau: dừng đếm thời gian vẽ lúc bấm GO.

### 13.4 Vì sao xe kẹt (thử bằng máy)

Nhật ký không ghi nét vẽ, nên không chạy lại được đúng lượt của người chơi. Claude thử một lỗi hay gặp khi vẽ bằng ngón tay: nét cong vồng lên như cái cầu. Mỗi nét của lời giải mẫu được uốn lên ở giữa k đơn vị (dạng parabol) rồi chạy bằng đúng vật lý của game.

| Lời giải | k = 10 | k = 15 | k = 20 | k = 30 |
| --- | --- | --- | --- | --- |
| Màn 1 | Thắng | Thắng | Kẹt | Kẹt |
| Màn 2 | Thắng | Thắng | Thắng | Kẹt |
| Màn 3, 4; màn 5 cầu vòng; màn 10 vẽ đè cả ván | Thắng | Thắng | Thắng | Thắng |
| Màn 5 dốc nhảy (`alt`) | Thắng | Thắng | Kẹt | Kẹt |
| Màn 10 vá ngắn canh nhịp (`alt`) | Thắng | Thắng | Thắng | Rơi |

- Lý do: chỗ đứt ở màn 1 dốc lên 33° (luật dựng màn B), trong khi xe leo được tối đa 41°. Nét vồng lên 20 đơn vị làm đoạn đầu dốc khoảng 49°, bánh trượt và xe đứng lại. Trên điện thoại rộng 412 px, 20 đơn vị là khoảng 11 điểm ảnh, tức chỉ là một nét cong nhẹ.
- Ở màn 1, nét vồng 20 tốn 195 mực và kẹt sau 2,8 giây. Lượt kẹt của người chơi là 204 mực, kẹt sau 2,6 giây. Hai số khớp nhau nhưng chưa chứng minh được đây là nguyên nhân.
- Dốc nhảy ở màn 5 nhạy cả hai chiều: nét võng xuống 10 đơn vị cũng kẹt.
- Khi thua vì kẹt, game chỉ hiện "Got stuck", không nói là nét quá dốc.

### 13.5 H1–H7 sau đợt 2

| # | Trạng thái | Kết quả |
| --- | --- | --- |
| H1 | Chưa kết luận | Màn 1 thua lượt đầu vì kẹt, thắng lượt 2 ngay sau đó (9 giây). Cần người mới |
| H2 | **Đạt** | Như mục 5 |
| H3 | Chưa đo | Cần hỏi người chơi |
| H4 | Chưa kết luận | Màn 5 giảm mực dần tới 3 sao; màn 4 và 10 dừng ở 1–2 sao, không chơi lại. Nhật ký không cho biết người chơi hiểu vạch vàng hay không quan tâm |
| H5 | Chưa có số | Chưa có số đo trên Samsung |
| H6 | Đạt với một người đã quen game | Màn 1–5 mất 2:55, 9/13 lượt trong 10–25 giây. Cần người mới |
| H7 | Có dấu hiệu | Màn 10 dùng 237–243 mực, xa cách vẽ đè cả ván (609): người chơi chọn vá ngắn. Chưa biết họ có thấy cách vẽ đè hay không |

### 13.6 Đánh giá và đề xuất (ý kiến)

- Luật vá kín ở màn 1–3 đạt mục đích: không còn thắng bằng một mẩu mực ở mép. Đổi lại, luật B làm nét vẽ khó hơn: 4/6 lần thua là kẹt.
- Màn 4 không sửa được bằng cách nới T. Với T = cách rẻ nhất × 1,3 (61), ngưỡng 3 sao chỉ lên từ 127 thành 135; × 1,5 thì thành 143. Người chơi dùng 303. Khoảng cách nằm ở chỗ người chơi chưa nghĩ ra cách vá ngắn, nên cần dạy (thẻ gợi ý, hoặc bàn tay ma vẽ mẫu một miếng ngắn), không phải nới số.
- Một người đã quen game là quá ít để chỉnh mức sao hay độ dốc. Đề xuất làm bản v4 với hai thay đổi nhỏ trước khi mời 3–5 người mới, giữ nguyên màn và mức chuẩn:
  1. Nhật ký ghi thêm điểm của từng nét (làm tròn) và sửa thời gian vẽ, để chạy lại được mọi lượt thua trong máy.
  2. Khi xe đứng lại trên nét dốc hơn sức leo, báo "Too steep!" và nháy đoạn dốc đó, thay cho "Got stuck".
- Sau đợt người mới: quyết định có giảm độ dốc màn 1 hay tăng sức leo của xe (cả hai đều phải chạy lại kiểm rò), và chọn cách dạy ở màn 4.

## 14. Nguồn

- Đợt 2 (mục 13): nhật ký người dùng gửi ngày 28/10; phép thử nét vồng chạy bằng `tools/search.ts` (`runLines`) với vật lý của bản v3; ngưỡng sao tính bằng `starLimits` trong `src/logic/score.ts`.
- Đo bằng `npm run levelcheck` (bản 22/10 có tìm cách rẻ nhất), `npm run tune`, `npm run cheapest` (22/10) và script đo trọng lực, nhiễu trong lần kiểm này; nhật ký chơi thử người dùng gửi ngày 22/10; bot Playwright (Chromium, SwiftShader) ở khung 412×915 (dọc), 1280×720 (ngang), 390×844 (cảm ứng).
- Đặc tả: `docs/Game4-DrawRoad_Brief_v1.md` mục 4.5, 5.2, 5.3. Thiết kế gốc: `Game4-ThietKe.md` mục 4, 6.2.
