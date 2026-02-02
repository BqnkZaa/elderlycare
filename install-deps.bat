@echo off
cd /d %~dp0
call npm install @prisma/client
call npm install @auth/prisma-adapter
call npm install @tanstack/react-query
call npm install @hookform/resolvers
call npm install @types/bcryptjs
call npx prisma init
echo Done!
