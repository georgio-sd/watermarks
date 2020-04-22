# Плеер с водными знаками

Для сборки необходимо
- Установить [node.js](https://nodejs.org)
- Установить [webpack](https://webpack.js.org/)
- Установить [webpack-cli](https://www.npmjs.com/package/webpack-cli)
- Установить [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server)
- Установить [typescript](https://www.typescriptlang.org/)
- Установить [ts-node](https://github.com/TypeStrong/ts-node)

Далее установить локальные зависимости
```bash
> npm install
```

Далее можно собирать 
DEV Mode

```bash
> webpack
```

PRODUCTION Mode
```bash
> webpack --prod
```

Можно запустить сервер для отладки
```bash
> webpack-dev-server
```

Подключение плеера на страницу
```html
<!-->Подключение React<!-->
<script src="vendor/react/min.js"></script>
<script src="vendor/react-dom/min.js"></script>

<!-->Подключение собранного плеера<!-->
<script src="build/main.js"></script>
```

Структура плеера имеет простую форму
```html
<div data-player></div>
```

Возможные аргументы
```js
'data-src' // Исходник воспроизведения ссылка на поток или же ссылка на видео
'data-width' // Базовая ширина плеера
'data-remember' // Параметр, отвечающий за запоминание позиции. Если указан без параметра, запоминает по идентификатору src иначе по идентификатору указанному в этом параметре
'data-watermark' // Параметр ждет ссылку на json, который отвечает за watemark. Его описание будет ниже
```

Описание интерфейса Watemark
```ts
// Вообще в JSON, который плеер ждет в соответствующем URL должен быть массив из объектов, описанных ниже. Все параметры, кроме тех, которые помечены знаком вопроса, обязательны
interface Watemark {
  text: string // Собственно текст водного знака
  fontSize?: number // Размер шрифта
  fontFamily?: string // Имя шрифта. Ожидается, что шрифт загружен через CSS или стандартен для всех браузеров
  color?: string // Цвет в формате HEX
  alpha?: number // Значение непрозрачности текста. от 0 до 1
  delay?: number | string // Если указано число, то обновление положения текста будет строго через указанное количество сеунд. Если строкой [от]-[до], то будет обновление в рандомное число секунд в указаном диапазоне
}

