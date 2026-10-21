# local-sync: file chung của dự án, chờ chép về máy

Ngày 22/10 chat không truy cập được máy tính, nên theo lời người dùng các file chung của dự án được giữ ở đây. Khi quay lại máy:

| File trong repo | Chép tới |
| --- | --- |
| `local-sync/CLAUDE.md` (v6) | `D:\Projects\GameMaking\CLAUDE.md` (ghi đè v4 hoặc v5 đang có) |
| `local-sync/CLAUDE-history/*` | `D:\Projects\GameMaking\docs\CLAUDE-history\` (tạo thư mục nếu chưa có) |

Bản trong project trên claude.ai (`claude/CLAUDE.md`) đã là v6, nên sau khi chép thì hai bản giống nhau.

Chép xong có thể xoá thư mục `local-sync/` trong repo (commit việc xoá), để repo game #4 chỉ còn file của game.

Lệnh mẫu (PowerShell, chạy trong `D:\Projects\GameMaking\Game4_DrawRoad` sau khi đã kéo repo về):

```powershell
Copy-Item local-sync\CLAUDE.md ..\CLAUDE.md -Force
New-Item -ItemType Directory -Force ..\docs\CLAUDE-history | Out-Null
Copy-Item local-sync\CLAUDE-history\* ..\docs\CLAUDE-history\ -Force
```
