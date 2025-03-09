@echo off
echo Encerrando processos Node.js...
taskkill /F /IM node.exe /T

echo Limpando cache do Next.js...
rmdir /S /Q .next 2>nul

echo Limpando cache do Node.js...
rmdir /S /Q node_modules\.cache 2>nul

echo Instalando dependências...
npm install

echo Iniciando servidor em uma porta específica...
npm run dev

pause 