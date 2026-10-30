# Browser bot: plays levels through the real pointer (or touch), the way a person would. For each
# level it opens the level, draws the reference solution (or `best` with --best) stroke by stroke,
# presses GO, waits for the result and takes screenshots. Prints a JSON summary with the result of
# every level, the test log rows and any console errors.
#
# Needs Python Playwright and the pre-installed Chromium. Serve a build first, for example:
#   npm run build:web && (cd dist/web && python3 -m http.server 8090)
#   python3 tools/playbot.py --url "http://127.0.0.1:8090/?reset" --size 412x915 --out /tmp/shots
#   python3 tools/playbot.py ... --size 1280x720 --levels 6 7 8      landscape, some levels
#   python3 tools/playbot.py ... --touch                              touch input (mobile)
#   python3 tools/playbot.py ... --best                               draw the cheapest known win
import argparse, glob, json, math, os, time
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('--url', required=True)
ap.add_argument('--size', default='412x915')
ap.add_argument('--out', required=True)
ap.add_argument('--touch', action='store_true')
ap.add_argument('--best', action='store_true')
ap.add_argument('--levels', type=int, nargs='*')
args = ap.parse_args()
W, H = (int(v) for v in args.size.split('x'))
os.makedirs(args.out, exist_ok=True)
here = os.path.dirname(os.path.abspath(__file__))
levels = [json.load(open(p)) for p in sorted(glob.glob(os.path.join(here, '..', 'src', 'levels', '[0-9][0-9].json')))]
if args.levels:
    levels = [L for L in levels if L['id'] in args.levels]
errors = []


def dense(line, step=6):
    pts = [line[0]]
    for a, b in zip(line, line[1:]):
        n = max(1, math.ceil(math.dist(a, b) / step))
        for k in range(1, n + 1):
            pts.append([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
    return pts


with sync_playwright() as p:
    browser = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = browser.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2, has_touch=args.touch, is_mobile=args.touch)
    page = ctx.new_page()
    page.on('console', lambda m: m.type in ('error', 'warning') and errors.append(f'{m.type}: {m.text}'))
    page.on('pageerror', lambda e: errors.append(f'pageerror: {e}'))
    page.goto(args.url)
    page.wait_for_function('window.__ink && window.__ink.state', timeout=30000)
    time.sleep(1.5)
    results = []
    for L in levels:
        lid = L['id']
        page.evaluate(f'window.__ink.loadLevel({lid})')
        time.sleep(1.2)
        page.screenshot(path=f'{args.out}/l{lid:02d}_a_start.png')
        if L.get('tutorial') == 'ghost':
            # The ghost plank card waits for a tap.
            page.mouse.click(W / 2, H / 2)
            time.sleep(0.5)
        lines = L['best'] if args.best and L.get('best') else L['solution']
        for line in lines:
            xy = [page.evaluate(f'window.__ink.toClient({q[0]},{q[1]})') for q in dense(line)]
            if args.touch:
                # Touch: drive the same pointer path through CDP touch events.
                cdp = ctx.new_cdp_session(page)
                cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': xy[0][0], 'y': xy[0][1]}]})
                for q in xy[1:]:
                    cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': q[0], 'y': q[1]}]})
                cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            else:
                page.mouse.move(*xy[0])
                page.mouse.down()
                for q in xy[1:]:
                    page.mouse.move(*q, steps=1)
                page.mouse.up()
            time.sleep(0.15)
        page.screenshot(path=f'{args.out}/l{lid:02d}_b_drawn.png')
        used = page.evaluate('window.__ink.used')
        nstrokes = len(page.evaluate('window.__ink.strokes'))
        gx, gy = page.evaluate("window.__ink.buttonClient('go')")
        page.mouse.click(gx, gy)
        time.sleep(1.0)
        page.screenshot(path=f'{args.out}/l{lid:02d}_c_run.png')
        state = None
        for _ in range(260):
            state = page.evaluate('window.__ink.state')
            if state in ('result', 'edit'):
                break
            time.sleep(0.1)
        time.sleep(1.4)
        page.screenshot(path=f'{args.out}/l{lid:02d}_d_end.png')
        res = page.evaluate('window.__ink.result')
        results.append({'level': lid, 'ink': round(used), 'strokes': nstrokes, 'state': state, 'result': res})
        print(f"level {lid}: {state} ink {round(used)} result {json.dumps(res)}", flush=True)
    rows = page.evaluate('window.__ink.telemetry.rows')
    summary = {'size': args.size, 'touch': args.touch, 'results': results, 'telemetry': rows[-len(levels):], 'errors': errors}
    json.dump(summary, open(os.path.join(args.out, 'summary.json'), 'w'), indent=1)
    print(json.dumps({'errors': errors[:10]}))
    browser.close()
