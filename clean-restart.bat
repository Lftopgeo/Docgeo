@echo off
echo Encerrando processos Node.js...
taskkill /F /IM node.exe /T

echo Limpando cache do Next.js...
if exist .next rmdir /S /Q .next

echo Limpando cache do Node.js...
if exist node_modules\.cache rmdir /S /Q node_modules\.cache

echo Instalando dependências...
call npm install

echo Iniciando servidor em uma porta específica...
call npx next dev -p 3002

pause 