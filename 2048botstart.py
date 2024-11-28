from aiogram import Bot, Dispatcher, executor, types


from aiogram.types.web_app_info import *
API_TOKEN = "TOKEN"

bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)
@dp.message_handler(commands=["start"])
async def start(message: types.Message):
    mark = types.ReplyKeyboardMarkup()
    mark.add(types.KeyboardButton("Открыть", web_app=WebAppInfo(url="URL"))) #for my 2048 use https://gamesfornika.online/
    await message.answer("2048",reply_markup=mark)

@dp.message_handler() 
async def echo(message: types.Message): #Создаём функцию с простой задачей — отправить обратно тот же текст, что ввёл пользователь.
   await message.answer(message.text)

if __name__ == '__main__':
   executor.start_polling(dp)