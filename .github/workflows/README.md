# GitHub Actions Workflows

## npm-publish.yml

Автоматическая публикация библиотеки в npm при создании git tag.

### Как работает:

1. **Триггер**: Срабатывает при push тега вида `v*` (например, `v3.0.0`, `v3.1.0`)
2. **Сборка**: Запускает тесты и production build библиотеки
3. **Публикация**: Определяет npm tag автоматически:
   - Stable версии (3.0.0, 3.1.0) → публикуются с тегом `latest`
   - Pre-release (3.0.0-beta.1, 3.1.0-rc.1) → публикуются с тегом `next`
4. **GitHub Release**: Автоматически создаёт GitHub Release с CHANGELOG

### Настройка (один раз):

#### 1. Создать NPM Access Token

1. Зайти на [npmjs.com](https://www.npmjs.com/)
2. Settings → Access Tokens → Generate New Token
3. Выбрать тип: **Automation** (для CI/CD)
4. Скопировать токен

#### 2. Добавить секрет в GitHub

1. Открыть репозиторий на GitHub
2. Settings → Secrets and variables → Actions
3. New repository secret:
   - Name: `NPM_TOKEN`
   - Secret: вставить токен из npm

#### 3. Готово!

Теперь при каждом push тега библиотека будет автоматически опубликована.

### Как использовать:

```bash
# 1. Обновить версию в package.json (уже сделано)

# 2. Закоммитить изменения
git add .
git commit -m "chore(release): 3.0.0"

# 3. Создать и запушить тег
git tag v3.0.0
git push origin v3.0.0

# 4. GitHub Actions автоматически:
#    - Запустит тесты
#    - Соберёт production build
#    - Опубликует в npm
#    - Создаст GitHub Release
```

### Особенности:

- ✅ **Автоматическое определение тега**: beta/alpha/rc → `next`, stable → `latest`
- ✅ **Provenance**: Публикация с npm provenance для безопасности
- ✅ **Тесты**: Всегда запускаются перед публикацией
- ✅ **GitHub Release**: Автоматически создаётся с CHANGELOG
- ✅ **Безопасность**: NPM токен хранится в GitHub Secrets

### Проверка workflow:

После push тега можно проверить статус:
- GitHub → Actions tab
- Там будет видно выполнение workflow

### Откат публикации:

Если что-то пошло не так:

```bash
# Удалить версию из npm (в течение 72 часов)
npm unpublish @kolkov/angular-editor@3.0.0

# Удалить тег с GitHub
git push origin --delete v3.0.0

# Удалить локальный тег
git tag -d v3.0.0
```

**Важно**: npm unpublish работает только в течение 72 часов после публикации!
