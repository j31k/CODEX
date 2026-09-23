# CODEX — Claude Opus 5.5: видео-разбор (Remotion)

Программно сгенерированный видеоролик по сценарию обзора Claude Opus 5.5.
Палитра: чёрный / оранжевый / белый. Русская озвучка (edge-tts), кинетические субтитры,
три игровых демо, отрисованных кодом прямо внутри Remotion.

## Структура

- `src/Root.tsx` — композиция `Opus55` (1920×1080, 30 fps)
- `src/Main.tsx` — таймлайн сцен, фоновая музыка
- `src/scenes/` — 14 сцен по сценарию (холодный старт → демо → итог)
- `src/demos/` — «игры», собранные кодом: `DarkSoulsGame`, `MarioKartGame`, `JsAnimScene`
- `src/components/` — Stage (зерно, главы, субтитры), примитивы UI
- `scripts/make-audio.py` — генерация озвучки и `src/timing.json`
- `public/assets/official/` — официальные изображения с anthropic.com/news/claude-opus-5-5
- `public/audio/` — озвучка по сценам + SFX + музыка (синтез ffmpeg)

## Команды

```bash
npm install
npm run dev      # Remotion Studio
npm run render   # рендер out/video.mp4
python3 scripts/make-audio.py   # перегенерировать озвучку (нужен edge-tts)
```

## Источники данных в ролике

- anthropic.com/news/claude-opus-5-5 — цифры, графики, цены, кейсы
- Artificial Analysis — независимые замеры (59,6% Terminal-Bench, 119k токенов max effort)
- METR — оценка ускорения ИИ-исследований
- Пост X воссоздан карточкой по тексту анонса (x.com требует авторизации для скрейпинга)
