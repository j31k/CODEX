# CODEX — Claude Opus 5.5: видео-разбор (Remotion)

Программно сгенерированный видеоролик по сценарию обзора Claude Opus 5.5.
Палитра: чёрный / оранжевый / белый. Музыка + SFX (синтез ffmpeg),
три игровых демо, отрисованных кодом прямо внутри Remotion.

Субтитры и голосовая озвучка отключены (см. `src/components/Stage.tsx`).
Вернуть озвучку: `python3 scripts/make-audio.py` и раскомментировать `<Audio>`/`<Captions>` в Stage.

## Реальные записи демо (холодный старт)

Положите 3 ролика в `public/video-montage/` — они заменят кодовые демо
во вспышках холодного старта и в превью-хуке. Имена по ключевым словам:
souls/dark/ds, kart/mario/mk, anim/js (иначе — по алфавиту: 1-е → Souls, 2-е → Kart, 3-е → JS).
Скрипт `scripts/check-montage.js` запускается автоматически перед `dev`/`render`
и пишет `src/montage.json`; без файлов используются кодовые демо.

## Структура

- `src/Root.tsx` — композиция `Opus55` (1920×1080, 30 fps)
- `src/Main.tsx` — таймлайн сцен, фоновая музыка
- `src/scenes/` — 14 сцен по сценарию (холодный старт → демо → итог)
- `src/demos/` — «игры», собранные кодом: `DarkSoulsGame`, `MarioKartGame`, `JsAnimScene`
- `src/components/` — Stage (зерно, главы), примитивы UI
- `scripts/make-audio.py` — генерация озвучки и `src/timing.json`
- `scripts/check-montage.js` — подхват роликов из `public/video-montage/`
- `public/assets/official/` — официальные изображения с anthropic.com/news/claude-opus-5-5
- `public/audio/` — озвучка по сценам (не используется) + SFX + музыка

## Команды

```bash
npm install
npm run dev      # Remotion Studio
npm run render   # рендер out/video.mp4
```

## Источники данных в ролике

- anthropic.com/news/claude-opus-5-5 — цифры, графики, цены, кейсы
- Artificial Analysis — независимые замеры (59,6% Terminal-Bench, 119k токенов max effort)
- METR — оценка ускорения ИИ-исследований
- Пост X воссоздан карточкой по тексту анонса (x.com требует авторизации для скрейпинга)
