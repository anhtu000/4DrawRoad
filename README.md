# Ghost Ink Road (game #4)

Puzzle vẽ đường bằng mực, thế giới ma dễ thương, đi đường Poki. Phaser 4.2.1 + TypeScript, dựng bằng Vite, trên bộ khung `core/` chép từ game #1. Quyết định chung của dự án nằm trong `CLAUDE.md` (mục 5e). Thiết kế: `Game4-ThietKe.md` (v0) và `docs/Game4-DrawRoad_Brief_v2.md` (rà soát, đặc tả bản thử; v2 thêm đặc tả 20 màn và 5 cơ chế mới). Kết quả: `docs/Game4-DrawRoad_Report_v5.md` (v2 thêm chơi thử đợt 1, màn bị rò, xe mới; v3 thêm hai luật mức chuẩn và 6 màn sửa lại; v4 thêm chơi thử đợt 2 và vì sao xe kẹt; v5 thêm kết quả đủ 20 màn).

Đủ 20 màn với sương ma, dơi, ván ma, bí ngô bật, gương, đèn lồng và cổng. Đồ hoạ vẽ bằng code, chưa có xu, cửa hàng, SDK, quảng cáo, nhạc nền.

## Cài đặt

1. Node.js 22.12 trở lên (`node -v`).
2. Trong thư mục này: `npm install`.

## Lệnh

| Lệnh | Việc |
| --- | --- |
| `npm run dev` | Chạy thử trên máy (không SDK). Điện thoại cùng Wi-Fi mở được link `Network` |
| `npm run build:single` | Build web rồi gộp thành một file HTML để thử trên điện thoại: `dist/single/GhostInkRoad_PhoneTest_v1.html` |
| `npm run build:web` | Build web vào `dist/web` |
| `npm run build` | Build Poki vào `dist/poki` (chưa dùng ở bản thử) |
| `npm run levelcheck` | Kiểm mọi màn bằng đúng vật lý của game, gồm cả tìm cách rẻ nhất (xem dưới; 20 màn mất khoảng nửa giờ). Thêm `-- --fix` để ghi lại T, B và `best` vào file màn, `-- 4 5` để chỉ kiểm vài màn, `-- --trace 5` để in đường đi của xe ở màn 5 |
| `npm run cheapest` | Tìm cách thắng rẻ mực nhất cho từng màn (cắt bớt nét, dốc ngắn ở mép) để kiểm mức chuẩn T có quá dễ không. Chạy vài phút |
| `npm run levelmap -- 6 7` | Ảnh bản đồ màn vào `.levelmaps/`: mọi vật trong màn, lời giải mẫu (tím) và cách rẻ nhất (vàng) cùng đường đi của xe và các sự kiện. Thêm `--file nhap.json` để xem một màn nháp |
| `npm run tune` | Đo xe so với mục tiêu: tốc độ, dốc leo được, quãng bay, rơi tầng, độ êm trên nét mực |
| `npm run typecheck` | Kiểm lỗi TypeScript |
| `npm test` | Test của bộ khung |
| `npm run sfx` | Tạo lại 8 tiếng hiệu ứng tạm trong `public/audio` (cần Python và numpy) |

Không có lệnh `sync-core` ở repo này: bộ khung chỉ sửa ở game #1 rồi chép sang (quy ước trong `CLAUDE.md`). Chép sang đây bằng `npm run sync-core -- ../Game4_DrawRoad` chạy trong thư mục game #1.

## Tham số thử nghiệm (bản web và file thử điện thoại)

| Tham số | Tác dụng |
| --- | --- |
| `?level=5` hoặc `#l5` | Mở thẳng màn 5 (1 đến 20). Trang artifact bỏ phần `?`, nên ở đó dùng dạng `#` |
| `?debug` hoặc `#debug` | Hộp debug: fps, thời gian game mỗi khung, `sim ms/step` (vật lý mỗi bước). Trên điện thoại: chạm tên màn 5 lần |
| `?inkturn` | Thử luật quay đầu phương án B: nét mực dựng đứng (dốc hơn 70°) cũng làm xe quay đầu |
| `?reset` hoặc `#reset` | Xoá save thử (sao, kẹo, bước hướng dẫn) và nhật ký lượt thử giữ nguyên |
| `?fixedres` | Tắt bộ tự hạ độ phân giải canvas |

Nhật ký lượt thử: mỗi lần bấm GO ghi một dòng (màn, lần thử, số nét, mực, thời gian vẽ, thời gian chạy, kết quả, kẹo, sao). Lưu trên máy; xuất CSV bằng nút "Save test log" trong menu tạm dừng (nút ≡ góc trên, hoặc phím P).

## Điều khiển

- Vẽ: kéo ngón tay hoặc giữ chuột trái. Đầu và cuối nét tự hút vào mép đường trong bán kính 18.
- GO: nút GO, Space hoặc Enter. Bấm lại khi xe đang chạy để dừng.
- Hoàn tác nét cuối: nút ↶ hoặc Z. Xoá hết: giữ nút thùng rác 0,5 giây, hoặc R.
- Tạm dừng: nút ≡ hoặc P (không dùng Esc vì Esc thoát toàn màn hình).
- Màn 5 đến 8: giữ GO để thấy vệt chấm dự đoán đường bay.

## Cấu trúc

| Thư mục | Nội dung |
| --- | --- |
| `core/` | Bộ khung chung (không sửa ở đây) |
| `src/levels/*.json` | Mỗi màn một file: đường, vách quay đầu, khối đá, chỗ đứt, kẹo, sương, dơi, bí ngô, gương, đèn lồng, cổng, mực B và T, luật mức chuẩn (`parRule`), lời giải mẫu, lời giải khác (`alt`), cách rẻ nhất (`best`) |
| `src/sim/` | Vật lý: `sim.ts` (thế giới Matter, xe, luật thắng thua, ván ma), `tuning.ts` (mọi hằng số vật lý và luật vẽ) |
| `src/logic/` | Hình học, luật vẽ (chỗ không được vẽ, cắt nét, hút đầu nét), điểm mực chữ S, hình học của các cơ chế (`mech.ts`) |
| `src/play/`, `src/ui/`, `src/render/` | Hiển thị: sân chơi, xe, nét mực, lọ mực, hình vẽ bằng code. Xe và Lumi: `src/render/car.ts` (hình), `src/play/CarView.ts` (ghép và chuyển động) |
| `tools/carsheet/` | Bảng mẫu xe: `npm run dev` rồi mở `/tools/carsheet/index.html` |
| `src/scenes/PlayScene.ts` | Cả vòng chơi: vẽ, chạy, kết quả, menu, hướng dẫn |
| `tools/` | `levelcheck.ts`, `levelmap.ts`, `search.ts`, `cheapest.ts`, `tune.ts`, `matter.ts` (nạp đúng bản Matter.js của Phaser cho Node), `make_sfx.py` |

Vật lý chạy bước cố định 1/60 giây, tách khỏi tốc độ khung hình; cùng nét vẽ thì cùng kết quả. Game dùng `Phaser.Physics.Matter.Matter`, công cụ Node nạp cùng file nguồn trong gói `phaser`, nên `levelcheck` chạy đúng vật lý của game.

## levelcheck kiểm gì

Mức chuẩn T theo hai luật (người dùng chốt 22/10, `CLAUDE.md` mục 5e), ghi ở trường `parRule` của mỗi màn:

- `patch` (màn 1–3, "vá kín"): T = lời giải mẫu × 1,1; B = T × hệ số B/T của màn (bảng 6.2 của v0).
- `cheapest` (từ màn 4, "ít mực nhất"): T = cách thắng rẻ nhất tìm được mà đủ kẹo và vẫn thắng khi tay run (`best` trong file màn) × 1,1; B = số lớn hơn giữa T × hệ số và lời giải mẫu × 1,15, để cách vá dễ thấy vẫn vừa mực.

Các bước (khoảng 2 phút):

1. Lời giải mẫu thắng, nhặt đủ kẹo, kể cả khi tay run nhẹ.
2. Không vẽ gì thì thua.
3. Bỏ trống bất kỳ chỗ đứt nào thì thua (mỗi chỗ đứt đều cần mực).
4. Màn 1–4: nét thẳng nối mép mọi chỗ đứt thì thắng.
5. Lời giải mẫu có nhiễu ±2 đơn vị mỗi điểm: thắng ít nhất 95/100.
6. Chạy lại cùng nét cho đúng cùng kết quả.
7. Mức chuẩn: màn `patch` báo lỗi nếu cách rẻ nhất tìm được dưới 65% lời giải mẫu (màn bị rò); màn `cheapest` báo lỗi nếu tìm được cách rẻ hơn `best` (chạy `-- --fix` để ghi lại) hoặc `best` thắng dưới 90/100 lần có nhiễu.
8. Các kiểm riêng từng màn (ví dụ màn 5: nét thẳng bị bia mộ cắt thì thua; dốc nhảy vẫn thắng).

Công cụ tìm cách rẻ nhất (`tools/search.ts`, cũng chạy riêng bằng `npm run cheapest`): từ lời giải mẫu và các lời giải khác trong `alt`, thử bỏ từng nét, cắt hai đầu, khoét một lỗ, hoặc thay bằng dốc hay miếng vá ngắn ở mép. Kết quả là mức trần: người chơi có thể tìm ra cách còn rẻ hơn.
