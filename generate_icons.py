#!/usr/bin/env python3
"""
네이버 블로그 모바일 미리보기 — Chrome 익스텐션 아이콘 생성기
Output: icons/icon16.png, icons/icon48.png, icons/icon128.png
"""
import zlib, struct, math, os


# ──────────────────────────────────────────────
# PNG writer (no external deps)
# ──────────────────────────────────────────────
def write_png(filename, width, height, pixels):
    """RGBA PNG 저장. pixels[y][x] = (r, g, b, a) each 0-255."""
    def chunk(name, data):
        body = name + data
        return (struct.pack('>I', len(data))
                + body
                + struct.pack('>I', zlib.crc32(body) & 0xFFFFFFFF))

    raw = b''
    for row in pixels:
        raw += b'\x00'          # filter: None
        for px in row:
            raw += bytes(px)    # r g b a

    with open(filename, 'wb') as f:
        f.write(
            b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw, 9))
            + chunk(b'IEND', b'')
        )


# ──────────────────────────────────────────────
# 도형 유틸
# ──────────────────────────────────────────────
def in_rrect(px, py, x0, y0, x1, y1, r):
    """점 (px,py)가 rounded-rect 안에 있으면 True (float 좌표)."""
    if px < x0 or px > x1 or py < y0 or py > y1:
        return False
    r = float(r)
    if px < x0+r and py < y0+r: return (px-x0-r)**2 + (py-y0-r)**2 <= r*r
    if px > x1-r and py < y0+r: return (px-x1+r)**2 + (py-y0-r)**2 <= r*r
    if px < x0+r and py > y1-r: return (px-x0-r)**2 + (py-y1+r)**2 <= r*r
    if px > x1-r and py > y1-r: return (px-x1+r)**2 + (py-y1+r)**2 <= r*r
    return True


def aa_cov(ix, iy, x0, y0, x1, y1, r, ss=4):
    """픽셀 (ix,iy)에 대해 rounded-rect의 anti-aliased coverage [0,1]."""
    count = 0
    s = 1.0 / ss
    for dy in range(ss):
        for dx in range(ss):
            if in_rrect(ix + (dx+0.5)*s, iy + (dy+0.5)*s, x0, y0, x1, y1, r):
                count += 1
    return count / (ss * ss)


def lerp(c1, c2, t):
    """두 RGBA 색상을 비율 t로 blending."""
    return (
        int(c1[0]*(1-t) + c2[0]*t),
        int(c1[1]*(1-t) + c2[1]*t),
        int(c1[2]*(1-t) + c2[2]*t),
        int(c1[3]*(1-t) + c2[3]*t),
    )


def paint(pixels, S, x0, y0, x1, y1, r, color, clip=None, ss=4):
    """
    rounded-rect를 pixels 위에 anti-aliased로 그린다.
    clip = (cx0, cy0, cx1, cy1, cr) 이면 해당 rrect 안에서만 그린다.
    """
    bx0 = max(0, int(x0) - 1)
    by0 = max(0, int(y0) - 1)
    bx1 = min(S - 1, int(x1) + 2)
    by1 = min(S - 1, int(y1) + 2)

    for y in range(by0, by1 + 1):
        for x in range(bx0, bx1 + 1):
            if clip and not in_rrect(x + 0.5, y + 0.5, *clip):
                continue
            cov = aa_cov(x, y, x0, y0, x1, y1, r, ss)
            if cov > 0:
                pixels[y][x] = lerp(pixels[y][x], color, cov)


# ──────────────────────────────────────────────
# 아이콘 생성 (128 기준 좌표계)
# ──────────────────────────────────────────────
def create_icon(S):
    GREEN      = (3,  199, 90,  255)   # 네이버 그린 #03C75A
    DARK_GREEN = (2,  155, 70,  255)   # 스크린 배경 (조금 더 어둡게)
    WHITE      = (255,255,255, 255)
    TRANSP     = (0,  0,   0,   0)

    def p(v): return v * S / 128.0    # 128 좌표계 → 실제 크기

    pixels = [[TRANSP] * S for _ in range(S)]

    # ── 1. 배경: 녹색 rounded-square ──────────────
    paint(pixels, S,
          0, 0, S-1, S-1, p(22),
          GREEN)

    # ── 2. 흰 폰 바디 ───────────────────────────
    phone = (p(36), p(19), p(92), p(109), p(10))
    paint(pixels, S, *phone, WHITE)

    # ── 3. 어두운 스크린 영역 ──────────────────────
    screen = (p(41), p(31), p(87), p(92), p(5))
    paint(pixels, S, *screen, DARK_GREEN, clip=phone)

    # ── 4. 스피커 노치 (폰 상단 작은 알약) ──────────
    notch = (p(53), p(24), p(75), p(28), p(2))
    paint(pixels, S, *notch, DARK_GREEN, clip=phone)

    # ── 5. 홈 인디케이터 (폰 하단 바) ──────────────
    home = (p(50), p(97), p(78), p(102), p(2))
    paint(pixels, S, *home, DARK_GREEN, clip=phone)

    # ── 6. 스크린 위 글줄 (블로그 콘텐츠 느낌) ──────
    line_x0 = p(47)
    line_h   = max(1.5, p(3.5))
    lines = [
        (p(39), p(81)),   # 1번째 줄 (제목느낌, 풀폭)
        (p(50), p(81)),   # 2번째 줄
        (p(61), p(81)),   # 3번째 줄
        (p(72), p(68)),   # 4번째 줄 (짧게)
    ]
    for (ly, lx1) in lines:
        paint(pixels, S,
              line_x0, ly, lx1, ly + line_h, 0,
              WHITE, clip=screen)

    return pixels


# ──────────────────────────────────────────────
# 실행
# ──────────────────────────────────────────────
if __name__ == '__main__':
    os.makedirs('icons', exist_ok=True)
    for size in [128, 48, 16]:
        print(f'  generating {size}×{size}...', flush=True)
        px = create_icon(size)
        path = f'icons/icon{size}.png'
        write_png(path, size, size, px)
        print(f'  ✓  {path}')
    print('\n아이콘 생성 완료!')
