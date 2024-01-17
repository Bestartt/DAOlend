> Актуальный фронтенд это nuxt-frontend!!! Используйте только его в качестве клиента

### Crypto
Проект где находится смарт-контракт ethereum.
Компиляция:
```
npx hardhat compile
```
Для копирования в nuxt-frontend запустите скрипт `crypto/export.bat`
Подробные инструкции для работы читайте [hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#overview)

### nuxt-frontend
Написана на vue(nuxt), ethers.js и bootstrap. Читайте соответствующие доки.

### Typescript
Для генерации typescript типов используйте [typechain](https://www.npmjs.com/package/typechain) в папке crypto.
Не помню как, но вам нужно копировать типы с `crypto\typechain-types` на `nuxt-frontend\artifacts\typechain`
